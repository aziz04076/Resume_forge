"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import html2canvas from "html2canvas";
import { RotateCw, RefreshCw } from "lucide-react";

interface ResumeOrbit3DProps {
  elementId?: string;
}

export const ResumeOrbit3D: React.FC<ResumeOrbit3DProps> = ({
  elementId = "resume-preview-pane",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoadingTexture, setIsLoadingTexture] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 800;
    const height = currentMount.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.5);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and shadow support
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    currentMount.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    directionalLight1.position.set(5, 8, 6);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x6366f1, 0.6); // Indigo rim light
    directionalLight2.position.set(-6, -4, -4);
    scene.add(directionalLight2);

    // 5. Subtle Particle Field
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 6. Resume Sheet Geometry (A4 Aspect Ratio: 1 : 1.414)
    const geometry = new THREE.BoxGeometry(2.1, 2.97, 0.02);

    // Default white card material
    const defaultMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xdddddd }), // right
      new THREE.MeshStandardMaterial({ color: 0xdddddd }), // left
      new THREE.MeshStandardMaterial({ color: 0xdddddd }), // top
      new THREE.MeshStandardMaterial({ color: 0xdddddd }), // bottom
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }), // front
      new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.5 }), // back
    ];

    const mesh = new THREE.Mesh(geometry, defaultMaterials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    meshRef.current = mesh;

    // Capture DOM element into high-res texture
    const captureResumeTexture = async () => {
      try {
        const domEl = document.getElementById(elementId);
        if (!domEl) {
          setIsLoadingTexture(false);
          return;
        }

        const canvas = await html2canvas(domEl, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const frontMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.2,
          metalness: 0.05,
        });

        const materials = [...defaultMaterials];
        materials[4] = frontMaterial;
        mesh.material = materials;
        setIsLoadingTexture(false);
      } catch (e) {
        console.error("Texture capture failed", e);
        setIsLoadingTexture(false);
      }
    };

    // Delay slightly to let fonts render
    const timer = setTimeout(captureResumeTexture, 300);

    // 7. Mouse drag interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;

      targetRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // 8. Animation Loop (60fps)
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (mesh) {
        if (!isDragging && autoRotate) {
          targetRotationY += 0.005;
        }

        // Smooth damping
        mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.08;
        mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.08;

        // Floating hover effect
        mesh.position.y = Math.sin(Date.now() * 0.002) * 0.06;
      }

      particleSystem.rotation.y += 0.0008;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handler
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
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleGeometry.dispose();
      renderer.dispose();
    };
  }, [elementId, autoRotate]);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center bg-radial-gradient from-slate-900 to-slate-950 overflow-hidden">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-[650px] cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Controls */}
      <div className="absolute bottom-6 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-2xl px-4 py-2 text-xs text-slate-300 shadow-2xl">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-colors ${
            autoRotate ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} />
          <span>Auto Rotate</span>
        </button>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          💡 Click and drag to inspect in 360°
        </span>

        {isLoadingTexture && (
          <span className="flex items-center gap-1 text-[11px] text-indigo-400 font-mono">
            <RefreshCw className="w-3 h-3 animate-spin" /> Rendering Mesh Texture...
          </span>
        )}
      </div>
    </div>
  );
};
