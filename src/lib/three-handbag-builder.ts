import * as THREE from "three";
import type { BagSilhouette, CharmProduct } from "@/config/catalog";

export interface LeatherTextures {
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
}

export function createPebbledLeatherTextures(): LeatherTextures {
  const size = 256;

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext("2d");

  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext("2d");

  if (bCtx && rCtx) {
    bCtx.fillStyle = "#808080";
    bCtx.fillRect(0, 0, size, size);

    rCtx.fillStyle = "#888888";
    rCtx.fillRect(0, 0, size, size);

    let seed = 4219;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < 2400; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 1.2 + rand() * 2.1;
      const shade = Math.floor(110 + rand() * 75);
      const rShade = Math.floor(90 + rand() * 65);

      bCtx.fillStyle = `rgb(${shade},${shade},${shade})`;
      bCtx.beginPath();
      bCtx.ellipse(x, y, r, r * (0.72 + rand() * 0.45), rand() * Math.PI, 0, Math.PI * 2);
      bCtx.fill();

      rCtx.fillStyle = `rgb(${rShade},${rShade},${rShade})`;
      rCtx.beginPath();
      rCtx.ellipse(x, y, r * 0.9, r * 0.8, 0, 0, Math.PI * 2);
      rCtx.fill();
    }
  }

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(3.5, 3.5);

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(3.5, 3.5);

  return { bumpMap, roughnessMap };
}

export function createChampagneGoldMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color("#E2B188"),
    metalness: 0.9,
    roughness: 0.2,
    envMapIntensity: 1.35,
  });
}

export function createLeatherMaterial(
  hex: string,
  textures: LeatherTextures,
  isSmooth = false
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(hex),
    roughness: isSmooth ? 0.36 : 0.48,
    metalness: 0.03,
    bumpMap: textures.bumpMap,
    bumpScale: isSmooth ? 0.004 : 0.011,
    roughnessMap: textures.roughnessMap,
    clearcoat: isSmooth ? 0.25 : 0.08,
    clearcoatRoughness: isSmooth ? 0.32 : 0.55,
    sheen: 0.35,
    sheenRoughness: 0.55,
    sheenColor: new THREE.Color("#FFF1DD"),
  });
}

function addChainDrop(
  parent: THREE.Group,
  goldMat: THREE.Material,
  links = 4,
  linkRadius = 0.042
): number {
  let y = 0;
  for (let i = 0; i < links; i++) {
    const link = new THREE.Mesh(
      new THREE.TorusGeometry(linkRadius, linkRadius * 0.26, 8, 18),
      goldMat
    );
    link.position.y = y - linkRadius * 0.8;
    link.rotation.y = i % 2 === 0 ? 0 : Math.PI / 2;
    link.castShadow = true;
    parent.add(link);
    y -= linkRadius * 1.32;
  }
  return y;
}

export function buildButterflyEmblem(
  goldMat: THREE.Material,
  inlayMat: THREE.Material,
  scale = 1
): THREE.Group {
  const group = new THREE.Group();

  const createWingShape = (upperScale: number, lowerScale: number) => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.02);
    s.bezierCurveTo(
      0.16 * upperScale,
      0.24 * upperScale,
      0.42 * upperScale,
      0.26 * upperScale,
      0.38 * upperScale,
      0.04
    );
    s.bezierCurveTo(
      0.35 * upperScale,
      -0.05,
      0.18 * upperScale,
      -0.06,
      0.06,
      -0.03
    );
    s.bezierCurveTo(
      0.25 * lowerScale,
      -0.1 * lowerScale,
      0.3 * lowerScale,
      -0.28 * lowerScale,
      0.15 * lowerScale,
      -0.28 * lowerScale
    );
    s.bezierCurveTo(0.05, -0.26, 0.02, -0.14, 0, -0.05);
    return s;
  };

  const wingShape = createWingShape(1, 0.92);
  const frameGeo = new THREE.ExtrudeGeometry(wingShape, {
    depth: 0.024,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.008,
    bevelThickness: 0.008,
  });
  frameGeo.center();

  const inlayGeo = new THREE.ExtrudeGeometry(wingShape, {
    depth: 0.028,
    bevelEnabled: false,
  });
  inlayGeo.center();

  const buildWingSide = (dir: 1 | -1) => {
    const side = new THREE.Group();
    const frame = new THREE.Mesh(frameGeo, goldMat);
    frame.scale.set(dir, 1, 1);
    frame.position.set(dir * 0.2, 0, 0);
    frame.castShadow = true;

    const inlay = new THREE.Mesh(inlayGeo, inlayMat);
    inlay.scale.set(dir * 0.84, 0.84, 0.92);
    inlay.position.set(dir * 0.2, 0, 0.004);
    inlay.castShadow = true;

    side.add(frame, inlay);
    side.rotation.y = -dir * 0.22;
    return side;
  };

  const rightWing = buildWingSide(1);
  rightWing.name = "wingRight";
  const leftWing = buildWingSide(-1);
  leftWing.name = "wingLeft";

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.026, 0.2, 6, 12),
    goldMat
  );
  body.position.set(0, -0.02, 0.015);
  body.castShadow = true;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 12), goldMat);
  head.position.set(0, 0.11, 0.016);

  [-1, 1].forEach((dir) => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(dir * 0.012, 0.12, 0.015),
      new THREE.Vector3(dir * 0.055, 0.21, 0.025),
      new THREE.Vector3(dir * 0.095, 0.24, 0.015)
    );
    const ant = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 10, 0.006, 6, false),
      goldMat
    );
    group.add(ant);
  });

  group.add(rightWing, leftWing, body, head);
  group.scale.setScalar(scale);
  return group;
}

export function buildCharmMesh(
  symbol: CharmProduct["symbol"],
  enamelHex: string,
  goldMat: THREE.Material
): THREE.Group {
  const wrapper = new THREE.Group();

  const claspRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.048, 0.011, 10, 20),
    goldMat
  );
  wrapper.add(claspRing);

  const dropEndY = addChainDrop(wrapper, goldMat, 3, 0.036);
  const pendant = new THREE.Group();
  pendant.position.y = dropEndY - 0.13;

  const enamelMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(enamelHex),
    roughness: 0.16,
    metalness: 0.05,
    clearcoat: 0.85,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.25,
  });

  if (symbol === "butterfly") {
    const bfly = buildButterflyEmblem(goldMat, enamelMat, 0.56);
    pendant.add(bfly);
  } else if (symbol === "heart") {
    const s = new THREE.Shape();
    s.moveTo(0, 0.06);
    s.bezierCurveTo(0.05, 0.16, 0.22, 0.16, 0.22, 0.03);
    s.bezierCurveTo(0.22, -0.09, 0.08, -0.17, 0, -0.23);
    s.bezierCurveTo(-0.08, -0.17, -0.22, -0.09, -0.22, 0.03);
    s.bezierCurveTo(-0.22, 0.16, -0.05, 0.16, 0, 0.06);

    const goldBezel = new THREE.Mesh(
      new THREE.ExtrudeGeometry(s, {
        depth: 0.028,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.012,
        bevelThickness: 0.012,
      }),
      goldMat
    );
    goldBezel.geometry.center();
    goldBezel.castShadow = true;

    const enamelCore = new THREE.Mesh(
      new THREE.ExtrudeGeometry(s, {
        depth: 0.038,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.008,
        bevelThickness: 0.008,
      }),
      enamelMat
    );
    enamelCore.geometry.center();
    enamelCore.scale.set(0.84, 0.84, 1);
    enamelCore.position.z = 0.012;
    enamelCore.castShadow = true;

    pendant.add(goldBezel, enamelCore);
  } else if (symbol === "starburst") {
    const starShape = new THREE.Shape();
    const spikes = 8;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? 0.21 : 0.068;
      const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();

    const starMesh = new THREE.Mesh(
      new THREE.ExtrudeGeometry(starShape, {
        depth: 0.024,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.01,
        bevelThickness: 0.01,
      }),
      goldMat
    );
    starMesh.geometry.center();
    starMesh.castShadow = true;

    const centreBead = new THREE.Mesh(new THREE.SphereGeometry(0.044, 14, 14), enamelMat);
    centreBead.position.z = 0.018;
    pendant.add(starMesh, centreBead);
  } else if (symbol === "blossom") {
    const petals = 5;
    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2;
      const px = Math.cos(angle) * 0.095;
      const py = Math.sin(angle) * 0.095;

      const petalGold = new THREE.Mesh(
        new THREE.CylinderGeometry(0.072, 0.072, 0.028, 16),
        goldMat
      );
      petalGold.rotation.x = Math.PI / 2;
      petalGold.position.set(px, py, 0);
      petalGold.castShadow = true;

      const petalEnamel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.056, 0.056, 0.036, 16),
        enamelMat
      );
      petalEnamel.rotation.x = Math.PI / 2;
      petalEnamel.position.set(px, py, 0.002);

      pendant.add(petalGold, petalEnamel);
    }
    const centre = new THREE.Mesh(new THREE.SphereGeometry(0.046, 14, 14), goldMat);
    centre.position.z = 0.016;
    pendant.add(centre);
  } else {
    // monogram medallion
    const coinGold = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.028, 28),
      goldMat
    );
    coinGold.rotation.x = Math.PI / 2;
    coinGold.castShadow = true;

    const coinEnamel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.135, 0.135, 0.034, 28),
      enamelMat
    );
    coinEnamel.rotation.x = Math.PI / 2;

    const tBar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.022, 0.046), goldMat);
    tBar.position.y = 0.042;
    const tStem = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.125, 0.046), goldMat);
    tStem.position.y = -0.01;
    tStem.rotation.z = -0.14;

    pendant.add(coinGold, coinEnamel, tBar, tStem);
  }

  wrapper.add(pendant);
  return wrapper;
}

function buildRoundedTrapezoidShape(
  bottomHalfW: number,
  topHalfW: number,
  height: number,
  radius: number
): THREE.Shape {
  const s = new THREE.Shape();
  const y0 = -height / 2;
  const y1 = height / 2;

  s.moveTo(-bottomHalfW + radius, y0);
  s.lineTo(bottomHalfW - radius, y0);
  s.quadraticCurveTo(bottomHalfW, y0, bottomHalfW - 0.02, y0 + radius);
  s.lineTo(topHalfW, y1 - radius);
  s.quadraticCurveTo(topHalfW - 0.02, y1, topHalfW - radius, y1);
  s.lineTo(-topHalfW + radius, y1);
  s.quadraticCurveTo(-topHalfW + 0.02, y1, -topHalfW, y1 - radius);
  s.lineTo(-bottomHalfW + 0.02, y0 + radius);
  s.quadraticCurveTo(-bottomHalfW, y0, -bottomHalfW + radius, y0);

  return s;
}

function buildCrescentShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-1.12, 0.56);
  s.bezierCurveTo(-1.05, -0.78, 1.05, -0.78, 1.12, 0.56);
  s.quadraticCurveTo(0.88, 0.34, 0.52, 0.16);
  s.quadraticCurveTo(0, -0.02, -0.52, 0.16);
  s.quadraticCurveTo(-0.88, 0.34, -1.12, 0.56);
  return s;
}

export interface BuiltHandbag {
  root: THREE.Group;
  charmAnchor: THREE.Group;
  updateColors: (leatherHex: string, accentHex?: string) => void;
  dispose: () => void;
}

export function buildHandbagModel(
  silhouette: BagSilhouette,
  leatherHex: string,
  accentHex = "#D9A078"
): BuiltHandbag {
  const root = new THREE.Group();
  const textures = createPebbledLeatherTextures();
  const leatherMat = createLeatherMaterial(
    leatherHex,
    textures,
    silhouette === "statement" || silhouette === "blossom"
  );
  const trimMat = leatherMat.clone();
  trimMat.color.set(leatherHex).offsetHSL(0, 0.02, -0.04);

  const goldMat = createChampagneGoldMaterial();
  goldMat.color.set(accentHex === "#432C2A" ? "#C99A72" : accentHex);

  const charmAnchor = new THREE.Group();
  const stitchMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#E8C4A0"),
    roughness: 0.45,
    metalness: 0.4,
  });

  if (silhouette === "everyday") {
    const bodyShape = buildRoundedTrapezoidShape(0.95, 0.81, 1.18, 0.1);
    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
      depth: 0.52,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.045,
      bevelThickness: 0.05,
    });
    bodyGeo.center();
    const body = new THREE.Mesh(bodyGeo, leatherMat);
    body.castShadow = true;
    body.receiveShadow = true;
    root.add(body);

    // Sculpted notched front flap
    const flapShape = new THREE.Shape();
    flapShape.moveTo(-0.83, 0.58);
    flapShape.lineTo(0.83, 0.58);
    flapShape.lineTo(0.86, 0.22);
    flapShape.lineTo(0.75, 0.22);
    flapShape.lineTo(0.75, 0.04);
    flapShape.quadraticCurveTo(0.75, -0.04, 0.67, -0.04);
    flapShape.lineTo(-0.67, -0.04);
    flapShape.quadraticCurveTo(-0.75, -0.04, -0.75, 0.04);
    flapShape.lineTo(-0.75, 0.22);
    flapShape.lineTo(-0.86, 0.22);
    flapShape.closePath();

    const flap = new THREE.Mesh(
      new THREE.ExtrudeGeometry(flapShape, {
        depth: 0.075,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.018,
        bevelThickness: 0.02,
      }),
      trimMat
    );
    flap.position.set(0, 0.02, 0.295);
    flap.castShadow = true;
    root.add(flap);

    // Oval champagne gold turn-lock clasp
    const claspPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.088, 0.088, 0.032, 24),
      goldMat
    );
    claspPlate.rotation.x = Math.PI / 2;
    claspPlate.scale.set(0.76, 1, 1.1);
    claspPlate.position.set(0, 0.11, 0.388);
    claspPlate.castShadow = true;

    const claspTurn = new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.05, 6, 12), goldMat);
    claspTurn.position.set(0, 0.11, 0.41);
    root.add(claspPlate, claspTurn);

    // Arched champagne-gold rigid top handle + collars + rings
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.48, 0.64, 0),
      new THREE.Vector3(-0.43, 1.06, 0),
      new THREE.Vector3(0, 1.24, 0),
      new THREE.Vector3(0.43, 1.06, 0),
      new THREE.Vector3(0.48, 0.64, 0),
    ]);
    const handle = new THREE.Mesh(
      new THREE.TubeGeometry(handleCurve, 44, 0.044, 16, false),
      goldMat
    );
    handle.castShadow = true;
    root.add(handle);

    [-0.48, 0.48].forEach((x) => {
      const collar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.068, 0.075, 0.09, 18),
        goldMat
      );
      collar.position.set(x, 0.69, 0);
      collar.castShadow = true;

      const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.05, 14), goldMat);
      mount.position.set(x, 0.61, 0);

      const stud = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 12), goldMat);
      stud.position.set(x * 1.32, 0.62, 0.04);

      root.add(collar, mount, stud);
    });

    // Base gold feet
    [-0.72, 0.72].forEach((x) =>
      [-0.18, 0.18].forEach((z) => {
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.028, 0.035, 12), goldMat);
        foot.position.set(x, -0.64, z);
        root.add(foot);
      })
    );

    charmAnchor.position.set(0.49, 0.54, 0.39);
  } else if (silhouette === "classic") {
    const bodyShape = buildRoundedTrapezoidShape(0.98, 0.84, 1.15, 0.09);
    const body = new THREE.Mesh(
      new THREE.ExtrudeGeometry(bodyShape, {
        depth: 0.56,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 1,
        bevelSize: 0.045,
        bevelThickness: 0.045,
      }),
      leatherMat
    );
    body.geometry.center();
    body.castShadow = true;
    body.receiveShadow = true;
    root.add(body);

    // Classic stepped envelope flap + vertical belt straps
    const flapShape = new THREE.Shape();
    flapShape.moveTo(-0.84, 0.56);
    flapShape.lineTo(0.84, 0.56);
    flapShape.lineTo(0.76, -0.02);
    flapShape.quadraticCurveTo(0, -0.14, -0.76, -0.02);
    flapShape.closePath();

    const flap = new THREE.Mesh(
      new THREE.ExtrudeGeometry(flapShape, {
        depth: 0.068,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.016,
        bevelThickness: 0.016,
      }),
      trimMat
    );
    flap.position.set(0, 0.02, 0.31);
    flap.castShadow = true;
    root.add(flap);

    // Vertical tonal straps + gold rectangular twist lock
    [-0.24, 0.24].forEach((x) => {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.72, 0.04), trimMat);
      strap.position.set(x, -0.08, 0.33);
      root.add(strap);
    });

    const lockFrame = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.05), goldMat);
    lockFrame.position.set(0, 0.06, 0.39);
    lockFrame.castShadow = true;
    const lockKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.06, 16), goldMat);
    lockKnob.rotation.x = Math.PI / 2;
    lockKnob.position.set(0, 0.06, 0.42);
    root.add(lockFrame, lockKnob);

    // Twin rolled leather top handles (front + back) with gold bridge anchors
    [-0.14, 0.14].forEach((z) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.46, 0.58, z),
        new THREE.Vector3(-0.38, 1.04, z),
        new THREE.Vector3(0, 1.18, z),
        new THREE.Vector3(0.38, 1.04, z),
        new THREE.Vector3(0.46, 0.58, z),
      ]);
      const rolledHandle = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 40, 0.044, 14, false),
        leatherMat
      );
      rolledHandle.castShadow = true;
      root.add(rolledHandle);

      [-0.46, 0.46].forEach((x) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.014, 10, 18), goldMat);
        ring.position.set(x, 0.59, z);
        root.add(ring);
      });
    });

    // Base gold studs
    [-0.74, 0.74].forEach((x) =>
      [-0.18, 0.18].forEach((z) => {
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.028, 0.036, 12), goldMat);
        foot.position.set(x, -0.62, z);
        root.add(foot);
      })
    );

    charmAnchor.position.set(0.49, 0.54, 0.38);
  } else if (silhouette === "statement") {
    const crescent = buildCrescentShape();
    const body = new THREE.Mesh(
      new THREE.ExtrudeGeometry(crescent, {
        depth: 0.44,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 1,
        bevelSize: 0.055,
        bevelThickness: 0.055,
      }),
      leatherMat
    );
    body.geometry.center();
    body.castShadow = true;
    body.receiveShadow = true;
    root.add(body);

    // Sculpted concentric crescent pocket relief on front
    const pocket = new THREE.Mesh(
      new THREE.ExtrudeGeometry(crescent, {
        depth: 0.06,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.02,
        bevelThickness: 0.02,
      }),
      trimMat
    );
    pocket.geometry.center();
    pocket.scale.set(0.84, 0.84, 1);
    pocket.position.set(0, -0.06, 0.245);
    pocket.castShadow = true;
    root.add(pocket);

    // Centre tab + domed sculpted gold clasp
    const tab = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.42, 0.1), trimMat);
    tab.position.set(0, 0.08, 0.27);
    tab.castShadow = true;

    const lockDome = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.1, 8, 16), goldMat);
    lockDome.position.set(0, -0.06, 0.31);
    lockDome.castShadow = true;
    root.add(tab, lockDome);

    // Horn tip gold D-rings + shoulder strap arc + chain drape
    [-0.96, 0.96].forEach((x) => {
      const tipRing = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.018, 12, 24), goldMat);
      tipRing.position.set(x, 0.46, 0.06);
      tipRing.rotation.y = Math.PI / 6;
      tipRing.castShadow = true;
      root.add(tipRing);
    });

    const strapCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.94, 0.47, 0.03),
      new THREE.Vector3(-0.62, 1.05, 0),
      new THREE.Vector3(0, 1.24, -0.03),
      new THREE.Vector3(0.62, 1.05, 0),
      new THREE.Vector3(0.94, 0.47, 0.03),
    ]);
    const shoulderStrap = new THREE.Mesh(
      new THREE.TubeGeometry(strapCurve, 44, 0.034, 10, false),
      trimMat
    );
    shoulderStrap.castShadow = true;
    root.add(shoulderStrap);

    // Curb gold chain accent draping along lower front corner
    const chainPoints = [];
    for (let i = 0; i <= 22; i++) {
      const t = i / 22;
      const angle = Math.PI + t * Math.PI;
      chainPoints.push(
        new THREE.Vector3(
          Math.cos(angle) * 0.96,
          Math.sin(angle) * 0.65 + 0.18,
          0.26
        )
      );
    }
    const chainCurve = new THREE.CatmullRomCurve3(chainPoints);
    for (let i = 0; i < 20; i++) {
      const link = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.01, 8, 14), goldMat);
      const pt = chainCurve.getPoint(i / 19);
      link.position.copy(pt);
      link.rotation.x = i % 2 === 0 ? 0.3 : -0.3;
      link.rotation.y = i % 2 === 0 ? 0.4 : 1.1;
      link.castShadow = true;
      root.add(link);
    }

    charmAnchor.position.set(0.92, 0.43, 0.34);
  } else {
    // blossom compact curved crossbody
    const pillowShape = new THREE.Shape();
    pillowShape.moveTo(-0.82, -0.52);
    pillowShape.quadraticCurveTo(0, -0.62, 0.82, -0.52);
    pillowShape.quadraticCurveTo(0.96, 0, 0.82, 0.5);
    pillowShape.quadraticCurveTo(0, 0.58, -0.82, 0.5);
    pillowShape.quadraticCurveTo(-0.96, 0, -0.82, -0.52);

    const body = new THREE.Mesh(
      new THREE.ExtrudeGeometry(pillowShape, {
        depth: 0.44,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 1,
        bevelSize: 0.06,
        bevelThickness: 0.06,
      }),
      leatherMat
    );
    body.geometry.center();
    body.castShadow = true;
    body.receiveShadow = true;
    root.add(body);

    // Soft scalloped front flap
    const flapShape = new THREE.Shape();
    flapShape.moveTo(-0.84, 0.5);
    flapShape.quadraticCurveTo(0, 0.57, 0.84, 0.5);
    flapShape.lineTo(0.84, -0.02);
    flapShape.bezierCurveTo(0.45, -0.26, -0.45, -0.26, -0.84, -0.02);
    flapShape.closePath();

    const flap = new THREE.Mesh(
      new THREE.ExtrudeGeometry(flapShape, {
        depth: 0.065,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.022,
        bevelThickness: 0.022,
      }),
      trimMat
    );
    flap.position.set(0, 0.04, 0.255);
    flap.castShadow = true;
    root.add(flap);

    // Signature sculpted gold blossom clasp
    const claspGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 12), goldMat);
      petal.scale.set(1, 1, 0.5);
      petal.position.set(Math.cos(a) * 0.058, Math.sin(a) * 0.058, 0);
      claspGroup.add(petal);
    }
    const centre = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 12), stitchMat);
    centre.position.z = 0.018;
    claspGroup.add(centre);
    claspGroup.position.set(0, -0.06, 0.34);
    claspGroup.castShadow = true;
    root.add(claspGroup);

    // Delicate crossbody braided strap + gold side loops
    [-0.86, 0.86].forEach((x) => {
      const sideRing = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 10, 18), goldMat);
      sideRing.position.set(x, 0.44, 0);
      sideRing.rotation.y = Math.PI / 2;
      root.add(sideRing);
    });

    const strapCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.86, 0.46, 0),
      new THREE.Vector3(-0.66, 1.05, -0.02),
      new THREE.Vector3(0, 1.24, -0.04),
      new THREE.Vector3(0.66, 1.05, -0.02),
      new THREE.Vector3(0.86, 0.46, 0),
    ]);
    const strap = new THREE.Mesh(
      new THREE.TubeGeometry(strapCurve, 44, 0.028, 10, false),
      goldMat
    );
    strap.castShadow = true;
    root.add(strap);

    charmAnchor.position.set(0.76, 0.42, 0.35);
  }

  // Subtle decorative edge stitch beads
  for (let i = -5; i <= 5; i++) {
    const stitch = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.012, 0.014), stitchMat);
    stitch.position.set(i * 0.11, silhouette === "statement" ? -0.42 : -0.48, silhouette === "statement" ? 0.25 : 0.29);
    root.add(stitch);
  }

  root.add(charmAnchor);

  const updateColors = (newHex: string, newAccentHex?: string) => {
    leatherMat.color.set(newHex);
    trimMat.color.set(newHex).offsetHSL(0, 0.02, -0.04);
    if (newAccentHex) {
      goldMat.color.set(newAccentHex === "#432C2A" ? "#C99A72" : newAccentHex);
    }
  };

  const dispose = () => {
    textures.bumpMap.dispose();
    textures.roughnessMap.dispose();
    root.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material?.dispose();
        }
      }
    });
  };

  return { root, charmAnchor, updateColors, dispose };
}
