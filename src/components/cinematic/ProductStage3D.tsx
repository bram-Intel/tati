"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { CHARMS, type BagSilhouette } from "@/config/catalog";
import {
  createChampagneGoldMaterial,
  buildCharmMesh,
  buildHandbagModel,
  type BuiltHandbag,
} from "@/lib/three-handbag-builder";

export type StageCameraView = "front" | "three-quarter" | "charm";

interface ProductStage3DProps {
  silhouette: BagSilhouette;
  leatherHex: string;
  accentHex?: string;
  complimentaryCharmId: string;
  extraCharmIds?: string[];
  cameraView?: StageCameraView;
  compact?: boolean;
  showHint?: boolean;
}

export function ProductStage3D({
  silhouette,
  leatherHex,
  accentHex = "#D9A078",
  complimentaryCharmId,
  extraCharmIds = [],
  cameraView = "three-quarter",
  compact = false,
  showHint = true,
}: ProductStage3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglReady, setWebglReady] = useState(true);

  const builtRef = useRef<BuiltHandbag | null>(null);
  const goldMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const cameraTargetPos = useRef(new THREE.Vector3(1.15, 0.55, 4.3));
  const lookTargetPos = useRef(new THREE.Vector3(0, 0.12, 0));

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      window.requestAnimationFrame(() => setWebglReady(false));
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.78;

    const initAspect = (container.clientWidth || 320) / Math.max(1, container.clientHeight || 360);
    const aspectScale = initAspect < 0.95 ? Math.min(1.42, 0.95 / initAspect) : 1;

    const camera = new THREE.PerspectiveCamera(32, initAspect, 0.1, 30);
    camera.position.set(1.15 * aspectScale, 0.52, 4.45 * aspectScale);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.enableZoom = !compact;
    controls.minDistance = 2.1;
    controls.maxDistance = 7.4;
    controls.minPolarAngle = Math.PI * 0.2;
    controls.maxPolarAngle = Math.PI * 0.62;
    controls.autoRotate = !prefersReduced;
    controls.autoRotateSpeed = 0.9;
    controls.target.copy(lookTargetPos.current);

    const hemi = new THREE.HemisphereLight("#FFF6EA", "#C9AE94", 0.62);
    scene.add(hemi);

    const key = new THREE.DirectionalLight("#FFF2DE", 1.85);
    key.position.set(2.8, 4.6, 3.6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);

    const fill = new THREE.DirectionalLight("#FFE8DA", 0.55);
    fill.position.set(-3.0, 2.0, 2.0);
    scene.add(fill);

    // Subtle ivory studio travertine disc
    const plinthGeo = new THREE.CylinderGeometry(1.45, 1.5, 0.18, 48);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#EAE0D4"),
      roughness: 0.82,
      metalness: 0.02,
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = -0.82;
    plinth.receiveShadow = true;
    scene.add(plinth);

    const goldMat = createChampagneGoldMaterial();
    goldMatRef.current = goldMat;

    const built = buildHandbagModel(silhouette, leatherHex, accentHex);
    built.root.position.y = -0.04;
    scene.add(built.root);
    builtRef.current = built;

    const attachCharms = () => {
      const anchor = built.charmAnchor;
      while (anchor.children.length > 0) {
        const child = anchor.children[0];
        anchor.remove(child);
      }

      const comp =
        CHARMS.find((c) => c.id === complimentaryCharmId) || CHARMS[0];
      const primaryMesh = buildCharmMesh(comp.symbol, comp.enamelHex, goldMat);
      anchor.add(primaryMesh);

      extraCharmIds.slice(0, 3).forEach((id, idx) => {
        const ch = CHARMS.find((c) => c.id === id);
        if (!ch) return;
        const m = buildCharmMesh(ch.symbol, ch.enamelHex, goldMat);
        m.scale.setScalar(0.86);
        m.position.set(-0.22 * (idx + 1), -0.02 * (idx + 1), 0.04 + idx * 0.015);
        m.rotation.z = 0.08 * (idx + 1);
        anchor.add(m);
      });
    };

    attachCharms();

    const resize = () => {
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 360;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    let rafId = 0;
    let manualPresetTransition = false;
    let presetTimer: number | null = null;

    const onStartDrag = () => {
      controls.autoRotate = false;
      manualPresetTransition = false;
    };
    controls.addEventListener("start", onStartDrag);

    const renderLoop = () => {
      rafId = window.requestAnimationFrame(renderLoop);
      if (!isVisible) return;

      if (manualPresetTransition) {
        camera.position.lerp(cameraTargetPos.current, 0.08);
        controls.target.lerp(lookTargetPos.current, 0.08);
      }
      controls.update();
      renderer.render(scene, camera);
    };
    renderLoop();

    // expose camera preset trigger cleanly via custom event on container
    const handlePreset = (e: Event) => {
      const view = (e as CustomEvent<StageCameraView>).detail;
      const curAspect = (container.clientWidth || 320) / Math.max(1, container.clientHeight || 360);
      const scale = curAspect < 0.95 ? Math.min(1.42, 0.95 / curAspect) : 1;
      if (view === "front") {
        cameraTargetPos.current.set(0, 0.25, 4.55 * scale);
        lookTargetPos.current.set(0, 0.08, 0);
      } else if (view === "charm") {
        cameraTargetPos.current.set(0.85, 0.35, 2.55 * scale);
        lookTargetPos.current.set(0.45, 0.15, 0.3);
      } else {
        cameraTargetPos.current.set(1.15 * scale, 0.52, 4.45 * scale);
        lookTargetPos.current.set(0, 0.08, 0);
      }
      manualPresetTransition = true;
      if (presetTimer) window.clearTimeout(presetTimer);
      presetTimer = window.setTimeout(() => {
        manualPresetTransition = false;
      }, 950);
    };

    container.addEventListener("tati-camera-preset", handlePreset);

    return () => {
      window.cancelAnimationFrame(rafId);
      if (presetTimer) window.clearTimeout(presetTimer);
      ro.disconnect();
      io.disconnect();
      controls.removeEventListener("start", onStartDrag);
      container.removeEventListener("tati-camera-preset", handlePreset);
      controls.dispose();
      built.dispose();
      plinthGeo.dispose();
      plinthMat.dispose();
      goldMat.dispose();
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      builtRef.current = null;
      goldMatRef.current = null;
    };
    // Rebuild scene cleanly only when silhouette swaps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [silhouette, compact]);

  // Live colorway swap without tearing down WebGL context
  useEffect(() => {
    builtRef.current?.updateColors(leatherHex, accentHex);
  }, [leatherHex, accentHex]);

  // Live charm updates without tearing down WebGL context
  useEffect(() => {
    const built = builtRef.current;
    const goldMat = goldMatRef.current;
    if (!built || !goldMat) return;

    const anchor = built.charmAnchor;
    while (anchor.children.length > 0) {
      anchor.remove(anchor.children[0]);
    }

    const comp =
      CHARMS.find((c) => c.id === complimentaryCharmId) || CHARMS[0];
    const primaryMesh = buildCharmMesh(comp.symbol, comp.enamelHex, goldMat);
    anchor.add(primaryMesh);

    extraCharmIds.slice(0, 3).forEach((id, idx) => {
      const ch = CHARMS.find((c) => c.id === id);
      if (!ch) return;
      const m = buildCharmMesh(ch.symbol, ch.enamelHex, goldMat);
      m.scale.setScalar(0.86);
      m.position.set(-0.22 * (idx + 1), -0.02 * (idx + 1), 0.04 + idx * 0.015);
      m.rotation.z = 0.08 * (idx + 1);
      anchor.add(m);
    });
  }, [complimentaryCharmId, extraCharmIds]);

  // Camera preset ease trigger
  useEffect(() => {
    containerRef.current?.dispatchEvent(
      new CustomEvent("tati-camera-preset", { detail: cameraView })
    );
  }, [cameraView]);

  if (!webglReady) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: "center",
          background: "var(--sand)",
          color: "var(--muted)",
          fontSize: 12,
        }}
      >
        3D preview unavailable in this browser
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        cursor: "grab",
        touchAction: "pan-y",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      {showHint && (
        <span
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            padding: "5px 10px",
            borderRadius: 999,
            background: "rgba(255, 249, 241, 0.86)",
            border: "1px solid var(--hairline)",
            fontSize: 9.5,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--ink)",
            pointerEvents: "none",
          }}
        >
          Drag to rotate 360°
        </span>
      )}
    </div>
  );
}
