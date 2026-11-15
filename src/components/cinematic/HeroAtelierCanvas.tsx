"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  buildButterflyEmblem,
  createChampagneGoldMaterial,
  buildCharmMesh,
  buildHandbagModel,
} from "@/lib/three-handbag-builder";

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
    renderer.toneMappingExposure = 0.9;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.72;

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(0.2, 0.48, 5.4);

    // Warm golden lighting matching Tati hero gradient
    const hemi = new THREE.HemisphereLight("#FFF3E6", "#A93B47", 0.72);
    scene.add(hemi);

    const key = new THREE.DirectionalLight("#FFF5E6", 2.0);
    key.position.set(3.2, 4.5, 4.2);
    key.castShadow = true;
    scene.add(key);

    const warmRim = new THREE.PointLight("#F57971", 2.4, 12);
    warmRim.position.set(-2.6, 1.4, 2.2);
    scene.add(warmRim);

    const heroStage = new THREE.Group();
    scene.add(heroStage);

    // Sculpted signature Raspberry handbag centerpiece
    const bagBuilt = buildHandbagModel("everyday", "#DB2850", "#D9A078");
    const goldMat = createChampagneGoldMaterial();
    const primaryCharm = buildCharmMesh("butterfly", "#FFF1DD", goldMat);
    primaryCharm.scale.setScalar(1.05);
    bagBuilt.charmAnchor.add(primaryCharm);
    bagBuilt.root.position.set(0, -0.18, 0);
    heroStage.add(bagBuilt.root);

    // Soft glass/travertine pedestal disc beneath bag
    const discGeo = new THREE.CylinderGeometry(1.55, 1.65, 0.16, 48);
    const discMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#FFF1DD"),
      roughness: 0.25,
      metalness: 0.05,
      transparent: true,
      opacity: 0.28,
      clearcoat: 0.6,
    });
    const pedestalDisc = new THREE.Mesh(discGeo, discMat);
    pedestalDisc.position.set(0, -0.92, 0);
    pedestalDisc.receiveShadow = true;
    heroStage.add(pedestalDisc);

    // Hero companion Butterfly circling gently above right corner
    const pearlInlay = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#FFF1DD"),
      roughness: 0.18,
      metalness: 0.05,
      clearcoat: 0.9,
      iridescence: 0.45,
    });
    const companionButterfly = buildButterflyEmblem(goldMat, pearlInlay, 0.9);
    companionButterfly.position.set(1.22, 1.05, 0.45);
    companionButterfly.rotation.set(0.25, -0.35, 0.2);
    heroStage.add(companionButterfly);

    // Orbiting miniature charms
    const orbitCharms = [
      { mesh: buildCharmMesh("heart", "#DB2850", goldMat), angle: 0.9, radius: 1.72, y: 0.28 },
      { mesh: buildCharmMesh("starburst", "#FFF1DD", goldMat), angle: 3.1, radius: 1.68, y: 0.56 },
      { mesh: buildCharmMesh("blossom", "#F57971", goldMat), angle: 4.8, radius: 1.56, y: -0.25 },
    ];
    orbitCharms.forEach(({ mesh }) => {
      mesh.scale.setScalar(0.76);
      heroStage.add(mesh);
    });

    // Subtle warm Champagne dust particles
    const particleCount = 46;
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.sin(i * 7.13) * 0.5 + (Math.random() - 0.5) * 0.5) * 4.4;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 3.4;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 2.5 - 0.4;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color("#FFF1DD"),
      size: 0.045,
      transparent: true,
      opacity: 0.65,
    });
    const motes = new THREE.Points(particleGeo, particleMat);
    scene.add(motes);

    const resize = () => {
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 420;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let pointerX = 0;
    let pointerY = 0;
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    container.addEventListener("pointermove", onPointerMove, { passive: true });

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

      // Smooth pointer tilt + slow turntable
      const targetRotY = -0.26 + Math.sin(t * 0.42) * 0.34 + pointerX * 0.32 + scrollProgress * 0.65;
      const targetRotX = 0.05 - pointerY * 0.14;

      heroStage.rotation.y += (targetRotY - heroStage.rotation.y) * 0.06;
      heroStage.rotation.x += (targetRotX - heroStage.rotation.x) * 0.06;
      heroStage.position.y = Math.sin(t * 1.15) * 0.06 - scrollProgress * 0.25;

      // Subtle butterfly wingbeat
      const flap = prefersReduced ? 0.12 : Math.sin(t * 4.4) * 0.32;
      const wingL = companionButterfly.getObjectByName("wingLeft");
      const wingR = companionButterfly.getObjectByName("wingRight");
      if (wingL && wingR) {
        wingL.rotation.y = 0.22 + flap;
        wingR.rotation.y = -0.22 - flap;
      }
      companionButterfly.position.y = 1.0 + Math.sin(t * 1.8) * 0.1;

      orbitCharms.forEach((item, idx) => {
        const a = item.angle + t * 0.24 + idx * 0.2;
        item.mesh.position.set(
          Math.cos(a) * item.radius,
          item.y + Math.sin(t * 1.6 + idx) * 0.09,
          Math.sin(a) * 0.9
        );
        item.mesh.rotation.y = a + Math.PI * 0.5;
      });

      motes.rotation.y = t * 0.04;
      renderer.render(scene, camera);
    };

    if (prefersReduced) {
      heroStage.rotation.y = -0.26;
      orbitCharms.forEach((item) => {
        item.mesh.position.set(
          Math.cos(item.angle) * item.radius,
          item.y,
          Math.sin(item.angle) * 0.9
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
      container.removeEventListener("pointermove", onPointerMove);

      bagBuilt.dispose();
      discGeo.dispose();
      discMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      goldMat.dispose();
      pearlInlay.dispose();
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="tati-hero-stage" aria-label="Interactive 3D Tati handbag atelier stage">
      {webglReady ? (
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      ) : (
        <Image
          src="/images/bag-everyday.jpg"
          alt="The Everyday Tati bag in Raspberry Pink"
          fill
          sizes="(max-width: 1020px) 100vw, 48vw"
          style={{ objectFit: "cover" }}
        />
      )}
      <div className="tati-hero-stage-caption">
        <span>Interactive 3D Atelier · The Everyday</span>
        <span>Move cursor to tilt</span>
      </div>
    </div>
  );
}
