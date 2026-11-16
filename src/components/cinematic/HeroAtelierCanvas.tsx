"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  buildButterflyEmblem,
  createChampagneGoldMaterial,
  buildCharmMesh,
  buildHandbagModel,
} from "@/lib/three-handbag-builder";

function createSparkleTexture(): THREE.CanvasTexture | null {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return null;

  const half = size / 2;
  const rad = ctx.createRadialGradient(half, half, 0, half, half, half);
  rad.addColorStop(0, "rgba(255, 250, 240, 1)");
  rad.addColorStop(0.22, "rgba(255, 241, 221, 0.85)");
  rad.addColorStop(0.55, "rgba(245, 200, 145, 0.25)");
  rad.addColorStop(1, "rgba(255, 241, 221, 0)");
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, size, size);

  // Subtle 4-point couture glint inside sparkle
  ctx.strokeStyle = "rgba(255, 252, 245, 0.72)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(half, half - 14);
  ctx.lineTo(half, half + 14);
  ctx.moveTo(half - 14, half);
  ctx.lineTo(half + 14, half);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function createSoftShadowTexture(): THREE.CanvasTexture | null {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return null;

  const half = size / 2;
  const rad = ctx.createRadialGradient(half, half, 4, half, half, half);
  rad.addColorStop(0, "rgba(92, 18, 36, 0.28)");
  rad.addColorStop(0.55, "rgba(92, 18, 36, 0.1)");
  rad.addColorStop(1, "rgba(92, 18, 36, 0)");
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

export function HeroAtelierCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglReady, setWebglReady] = useState(true);

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
    renderer.toneMappingExposure = 0.94;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.78;

    const camZ = 5.8;
    const fov = 34;
    const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 30);
    camera.position.set(0, 0.36, camZ);

    // Warm golden studio lighting blending naturally with the hero gradient
    const hemi = new THREE.HemisphereLight("#FFF3E6", "#A93B47", 0.76);
    scene.add(hemi);

    const key = new THREE.DirectionalLight("#FFF5E6", 2.05);
    key.position.set(3.2, 4.5, 4.2);
    key.castShadow = true;
    scene.add(key);

    const warmRim = new THREE.PointLight("#FFE1C8", 2.2, 14);
    warmRim.position.set(-2.4, 1.5, 2.8);
    scene.add(warmRim);

    const heroStage = new THREE.Group();
    scene.add(heroStage);

    // Sculpted signature Raspberry handbag centerpiece with butterfly charm
    const bagBuilt = buildHandbagModel("everyday", "#DB2850", "#D9A078");
    const goldMat = createChampagneGoldMaterial();
    const primaryCharm = buildCharmMesh("butterfly", "#FFF1DD", goldMat);
    primaryCharm.scale.setScalar(1.05);
    bagBuilt.charmAnchor.add(primaryCharm);
    bagBuilt.root.position.set(0, -0.14, 0);
    heroStage.add(bagBuilt.root);

    // Subtle floating contact shadow glow (no frame, no solid pedestal shelf)
    const shadowTex = createSoftShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(2.6, 1.45);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex ?? undefined,
      transparent: true,
      opacity: shadowTex ? 0.9 : 0,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -0.96, -0.05);
    heroStage.add(shadowMesh);

    // Companion champagne-ivory Butterfly hovering gracefully above the right shoulder of the handle
    const pearlInlay = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#FFF1DD"),
      roughness: 0.18,
      metalness: 0.05,
      clearcoat: 0.9,
      iridescence: 0.45,
    });
    const companionButterfly = buildButterflyEmblem(goldMat, pearlInlay, 0.72);
    companionButterfly.position.set(0.62, 1.15, 0.22);
    companionButterfly.rotation.set(0.24, -0.34, 0.16);
    heroStage.add(companionButterfly);

    // Orbiting miniature charms in a halo cleanly outside the handbag silhouette
    const orbitCharms = [
      { mesh: buildCharmMesh("heart", "#DB2850", goldMat), angle: 0.9, radius: 1.09, y: 0.18 },
      { mesh: buildCharmMesh("starburst", "#FFF1DD", goldMat), angle: 2.95, radius: 1.08, y: 0.44 },
      { mesh: buildCharmMesh("blossom", "#F57971", goldMat), angle: 4.85, radius: 1.06, y: -0.2 },
    ];
    orbitCharms.forEach(({ mesh }) => {
      mesh.scale.setScalar(0.68);
      heroStage.add(mesh);
    });

    // Full-sky champagne & golden glitter particles drifting seamlessly across the hero
    const sparkleTex = createSparkleTexture();
    const createGlitterLayer = (
      count: number,
      size: number,
      colorHex: string,
      opacity: number,
      seedOffset: number
    ) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const s1 = Math.sin((i + seedOffset) * 12.9898) * 43758.5453;
        const s2 = Math.sin((i + seedOffset) * 78.233) * 43758.5453;
        const s3 = Math.sin((i + seedOffset) * 39.425) * 43758.5453;
        const r1 = s1 - Math.floor(s1);
        const r2 = s2 - Math.floor(s2);
        const r3 = s3 - Math.floor(s3);

        pos[i * 3] = (r1 - 0.5) * 11.4;
        pos[i * 3 + 1] = (r2 - 0.5) * 4.6;
        pos[i * 3 + 2] = (r3 - 0.5) * 3.0 - 0.5;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: new THREE.Color(colorHex),
        map: sparkleTex ?? undefined,
        size,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      return { points: new THREE.Points(geo, mat), geo, mat };
    };

    const glitterFine = createGlitterLayer(140, 0.11, "#FFF1DD", 0.74, 1);
    const glitterWarm = createGlitterLayer(62, 0.16, "#FFD9AE", 0.58, 173);
    scene.add(glitterFine.points);
    scene.add(glitterWarm.points);

    let layoutWidth = 1280;
    let layoutHeight = 680;
    let sideOffsetX = 0;
    let baseY = 0;
    let stageScale = 1;

    const updateResponsivePlacement = () => {
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 360;
      layoutWidth = w;
      layoutHeight = h;

      const desktopSide = w >= 1180;
      const activeCamZ = desktopSide ? camZ : w < 520 ? 5.25 : 5.4;
      camera.position.set(0, desktopSide ? 0.2 : 0.18, activeCamZ);

      const aspect = w / h;
      const halfH = activeCamZ * Math.tan((fov * Math.PI) / 360);
      const halfW = halfH * aspect;
      const worldPerPx = (2 * halfW) / w;

      if (desktopSide) {
        // Desktop: place bag comfortably inside open right corridor with strict inner & outer safety margins
        const copyClearancePx = 256;
        const outerMarginPx = Math.max(24, Math.round(w * 0.02));
        const corridorPx = Math.max(220, w / 2 - copyClearancePx - outerMarginPx);
        const centerOffsetPx = copyClearancePx + corridorPx * 0.5;
        const corridorHalfWorld = corridorPx * 0.5 * worldPerPx;

        sideOffsetX = centerOffsetPx * worldPerPx;
        stageScale = Math.min(0.88, Math.max(0.58, corridorHalfWorld / 1.28));
        baseY = 0.04;
      } else {
        // Mobile / tablet stacked cleanly below centered hero copy
        sideOffsetX = 0;
        stageScale = w < 520 ? 1.0 : 1.04;
        baseY = 0;
      }

      heroStage.scale.setScalar(stageScale);
    };

    const resize = () => {
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 360;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      updateResponsivePlacement();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const interactionTarget =
      (container.closest(".tati-hero") as HTMLElement | null) ?? container;
    let pointerX = 0;
    let pointerY = 0;
    const onPointerMove = (e: PointerEvent) => {
      const rect = interactionTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    interactionTarget.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });

    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    let rafId = 0;
    const clock = new THREE.Clock();

    const renderFrame = () => {
      rafId = window.requestAnimationFrame(renderFrame);
      if (!isVisible) return;

      const t = prefersReduced ? 0 : clock.getElapsedTime();
      const scrollProgress = Math.min(1, window.scrollY / 700);
      const desktopSide = layoutWidth >= 1180;

      // Subtle inward pose when resting by the right side of the centered headline
      const baseRotY = desktopSide ? -0.42 : -0.24;
      const targetRotY =
        baseRotY +
        Math.sin(t * 0.42) * 0.28 +
        pointerX * 0.26 +
        scrollProgress * 0.55;
      const targetRotX = 0.05 - pointerY * 0.13;

      heroStage.position.x = sideOffsetX;
      heroStage.rotation.y += (targetRotY - heroStage.rotation.y) * 0.06;
      heroStage.rotation.x += (targetRotX - heroStage.rotation.x) * 0.06;
      heroStage.position.y =
        baseY + Math.sin(t * 1.15) * 0.055 - scrollProgress * 0.2;

      const flap = prefersReduced ? 0.12 : Math.sin(t * 4.4) * 0.32;
      const wingL = companionButterfly.getObjectByName("wingLeft");
      const wingR = companionButterfly.getObjectByName("wingRight");
      if (wingL && wingR) {
        wingL.rotation.y = 0.22 + flap;
        wingR.rotation.y = -0.22 - flap;
      }
      companionButterfly.position.y = 1.15 + Math.sin(t * 1.8) * 0.08;

      orbitCharms.forEach((item, idx) => {
        const a = item.angle + t * 0.26 + idx * 0.2;
        item.mesh.position.set(
          Math.cos(a) * item.radius,
          item.y + Math.sin(t * 1.6 + idx) * 0.07,
          Math.sin(a) * 0.62
        );
        item.mesh.rotation.y = a + Math.PI * 0.5;
      });

      // Gentle glittering motion & twinkle across the hero backdrop
      glitterFine.points.rotation.y = t * 0.025 + pointerX * 0.04;
      glitterFine.points.position.y = Math.sin(t * 0.45) * 0.08;
      glitterFine.mat.opacity = 0.64 + Math.sin(t * 1.9) * 0.14;

      glitterWarm.points.rotation.y = -t * 0.018 + pointerX * 0.06;
      glitterWarm.points.rotation.z = Math.sin(t * 0.25) * 0.03;
      glitterWarm.mat.opacity = 0.5 + Math.cos(t * 2.3) * 0.13;

      if (layoutHeight < 0) return;

      renderer.render(scene, camera);
    };

    if (prefersReduced) {
      updateResponsivePlacement();
      heroStage.position.set(sideOffsetX, baseY, 0);
      heroStage.rotation.y = layoutWidth >= 1180 ? -0.42 : -0.24;
      orbitCharms.forEach((item) => {
        item.mesh.position.set(
          Math.cos(item.angle) * item.radius,
          item.y,
          Math.sin(item.angle) * 0.62
        );
      });
      renderer.render(scene, camera);
    } else {
      renderFrame();
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      interactionTarget.removeEventListener("pointermove", onPointerMove);

      bagBuilt.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex?.dispose();
      sparkleTex?.dispose();
      glitterFine.geo.dispose();
      glitterFine.mat.dispose();
      glitterWarm.geo.dispose();
      glitterWarm.mat.dispose();
      goldMat.dispose();
      pearlInlay.dispose();
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  if (!webglReady) {
    return null;
  }

  return (
    <div ref={containerRef} className="tati-hero-stage" aria-hidden="true">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
