"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const HeroScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || 600;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    currentMount.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const primaryLight = new THREE.DirectionalLight(0x6366f1, 2.0); // Indigo
    primaryLight.position.set(5, 5, 5);
    scene.add(primaryLight);

    const secondaryLight = new THREE.DirectionalLight(0xa855f7, 1.5); // Purple
    secondaryLight.position.set(-5, -3, 3);
    scene.add(secondaryLight);

    // 4. Floating 3D Resume Cards
    const sheetsGroup = new THREE.Group();
    scene.add(sheetsGroup);

    const createSheetMesh = (color: number, scale = 1, zPos = 0, xPos = 0, rotY = 0) => {
      const sheetGeo = new THREE.BoxGeometry(1.6 * scale, 2.26 * scale, 0.03);
      const sheetMat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.2,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(sheetGeo, sheetMat);
      mesh.position.set(xPos, 0, zPos);
      mesh.rotation.y = rotY;
      mesh.rotation.x = 0.1;
      return mesh;
    };

    // Center Hero Resume Sheet (White/Bright)
    const centerSheet = createSheetMesh(0xffffff, 1.3, 0.5, 0, -0.15);
    sheetsGroup.add(centerSheet);

    // Left Secondary Card (Tech Indigo)
    const leftSheet = createSheetMesh(0x1e1b4b, 1.0, -1.0, -2.4, 0.35);
    leftSheet.position.y = -0.3;
    sheetsGroup.add(leftSheet);

    // Right Secondary Card (Slate/Emerald)
    const rightSheet = createSheetMesh(0x064e3b, 1.05, -0.5, 2.3, -0.4);
    rightSheet.position.y = 0.4;
    sheetsGroup.add(rightSheet);

    // 5. Particles
    const count = 350;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(geometry, particlesMat);
    scene.add(particles);

    // 6. Mouse parallax tracking
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.0008;
      mouseY = (e.clientY - windowHalfY) * 0.0008;
    };

    window.addEventListener("mousemove", onMouseMove);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 7. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        const elapsedTime = clock.getElapsedTime();

        // Parallax smooth camera shift
        camera.position.x += (mouseX * 4 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 4 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        // Gentle floating animation
        centerSheet.position.y = Math.sin(elapsedTime * 1.2) * 0.12;
        centerSheet.rotation.z = Math.sin(elapsedTime * 0.8) * 0.02;

        leftSheet.position.y = -0.3 + Math.sin(elapsedTime * 1.5 + 1) * 0.15;
        leftSheet.rotation.z = Math.cos(elapsedTime * 1.0) * 0.03;

        rightSheet.position.y = 0.4 + Math.sin(elapsedTime * 1.3 + 2) * 0.14;
        rightSheet.rotation.z = Math.sin(elapsedTime * 1.1) * 0.03;

        particles.rotation.y = elapsedTime * 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);

      // Deep WebGL resource disposal
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material?.dispose();
          }
        }
      });

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  if (!hasWebGL) {
    // Low-power CSS 3D fallback
    return (
      <div className="w-full h-full flex items-center justify-center relative pointer-events-none">
        <div className="relative w-72 h-96 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl transform rotate-6 animate-pulseGlow" />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full absolute inset-0 pointer-events-auto"
      style={{ touchAction: "none" }}
    />
  );
};
