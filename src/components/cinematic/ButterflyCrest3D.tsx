"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  buildButterflyEmblem,
  createChampagneGoldMaterial,
} from "@/lib/three-handbag-builder";

export function ButterflyCrest3D() {
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
      });
    } catch {
      window.requestAnimationFrame(() => setWebglReady(false));
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.95;

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 20);
    camera.position.set(0, 0.15, 3.8);

    const hemi = new THREE.HemisphereLight("#FFF1DD", "#8E313D", 0.85);
    scene.add(hemi);

    const key = new THREE.DirectionalLight("#FFF5E6", 2.0);
    key.position.set(2.5, 3.5, 4.0);
    scene.add(key);

    const goldMat = createChampagneGoldMaterial();
    const ivoryInlay = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#FFF1DD"),
      roughness: 0.16,
      clearcoat: 0.85,
      iridescence: 0.5,
    });

    const crestGroup = new THREE.Group();
    const haloRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.025, 16, 64),
      goldMat
    );
    crestGroup.add(haloRing);

    const innerHalo = new THREE.Mesh(
      new THREE.TorusGeometry(0.84, 0.012, 12, 56),
      ivoryInlay
    );
    crestGroup.add(innerHalo);

    const butterfly = buildButterflyEmblem(goldMat, ivoryInlay, 1.55);
    butterfly.position.z = 0.08;
    crestGroup.add(butterfly);

    scene.add(crestGroup);

    const resize = () => {
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;
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

    let pointerX = 0;
    let pointerY = 0;
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    container.addEventListener("pointermove", onPointerMove, { passive: true });

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = prefersReduced ? 0 : clock.getElapsedTime();
      const targetY = Math.sin(t * 0.5) * 0.25 + pointerX * 0.35;
      const targetX = -pointerY * 0.18;

      crestGroup.rotation.y += (targetY - crestGroup.rotation.y) * 0.06;
      crestGroup.rotation.x += (targetX - crestGroup.rotation.x) * 0.06;
      crestGroup.position.y = Math.sin(t * 1.3) * 0.06;

      const wingL = butterfly.getObjectByName("wingLeft");
      const wingR = butterfly.getObjectByName("wingRight");
      const flap = prefersReduced ? 0.15 : Math.sin(t * 3.8) * 0.3;
      if (wingL && wingR) {
        wingL.rotation.y = 0.22 + flap;
        wingR.rotation.y = -0.22 - flap;
      }

      renderer.render(scene, camera);
    };

    if (prefersReduced) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      crestGroup.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          (obj as THREE.Mesh).geometry?.dispose();
        }
      });
      goldMat.dispose();
      ivoryInlay.dispose();
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  if (!webglReady) {
    return (
      <strong
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: 64,
          color: "var(--ivory)",
        }}
      >
        Tati.
      </strong>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", maxWidth: 340, height: 270, position: "relative" }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
