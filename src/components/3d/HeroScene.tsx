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
    const isMobile = width < 768;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    // 2. Renderer — transparent so page background shows through
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 3. Lighting — warm studio feel
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.8);
    keyLight.position.set(4, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 1.2);
    fillLight.position.set(-7, -2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    rimLight.position.set(0, -5, -4);
    scene.add(rimLight);

    // 4. Procedural canvas texture for each resume sheet
    const texturesToDispose: THREE.Texture[] = [];

    const createDocTexture = (
      name: string,
      role: string,
      accentColor: string,
      hasPhoto = false
    ) => {
      const cvs = document.createElement("canvas");
      cvs.width = 512;
      cvs.height = 724;
      const ctx = cvs.getContext("2d");
      if (!ctx) return null;

      // Base Paper — pure white for realism
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      // Top Accent Rule
      ctx.fillStyle = accentColor;
      ctx.fillRect(36, 36, cvs.width - 72, 7);

      // Optional photo avatar
      if (hasPhoto) {
        ctx.fillStyle = "#e0e7ff";
        ctx.beginPath();
        ctx.arc(cvs.width - 78, 84, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(cvs.width - 78, 77, 12, 0, Math.PI * 2);
        ctx.fill();
      }

      // Candidate Name
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText(name, 36, 82);

      // Role / Profession
      ctx.fillStyle = accentColor;
      ctx.font = "600 15px sans-serif";
      ctx.fillText(role, 36, 106);

      // Divider
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(36, 124, cvs.width - 72, 2);

      // Summary block
      ctx.fillStyle = "#475569";
      ctx.fillRect(36, 140, cvs.width - 110, 8);
      ctx.fillRect(36, 155, cvs.width - 80, 8);
      ctx.fillRect(36, 170, cvs.width - 140, 8);

      // EXPERIENCE section
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("EXPERIENCE", 36, 205);
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(36, 212, cvs.width - 72, 1.5);

      // Job 1
      ctx.fillStyle = "#0f172a";
      ctx.font = "600 13px sans-serif";
      ctx.fillText("Senior Specialist", 36, 235);
      ctx.fillStyle = "#64748b";
      ctx.font = "12px sans-serif";
      ctx.fillText("Metropolitan Institute  •  2021–Present", 36, 252);

      // Bullets
      for (let b = 0; b < 3; b++) {
        ctx.fillStyle = "#6366f1";
        ctx.beginPath();
        ctx.arc(43, 272 + b * 18, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#94a3b8";
        const bw = b === 0 ? cvs.width - 140 : b === 1 ? cvs.width - 110 : cvs.width - 170;
        ctx.fillRect(54, 268 + b * 18, bw, 7);
      }

      // Job 2
      ctx.fillStyle = "#0f172a";
      ctx.font = "600 13px sans-serif";
      ctx.fillText("Associate Practitioner", 36, 340);
      ctx.fillStyle = "#64748b";
      ctx.font = "12px sans-serif";
      ctx.fillText("Regional Centre  •  2018–2021", 36, 357);

      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.arc(43, 376, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(54, 372, cvs.width - 140, 7);

      // EDUCATION section
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("EDUCATION & CREDENTIALS", 36, 415);
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(36, 422, cvs.width - 72, 1.5);

      ctx.fillStyle = "#0f172a";
      ctx.font = "600 13px sans-serif";
      ctx.fillText("Bachelor of Science — Honors", 36, 445);
      ctx.fillStyle = "#64748b";
      ctx.font = "12px sans-serif";
      ctx.fillText("Accredited University  •  2014–2018", 36, 462);

      // Skill tags
      const skills = ["Leadership", "Analytics", "Teamwork", "Strategy"];
      let sx = 36;
      skills.forEach((sk) => {
        const tw = ctx.measureText(sk).width + 18;
        ctx.fillStyle = "#f1f5f9";
        const rounding = 5;
        ctx.beginPath();
        ctx.roundRect(sx, 485, tw, 22, rounding);
        ctx.fill();
        ctx.fillStyle = accentColor;
        ctx.font = "600 11px sans-serif";
        ctx.fillText(sk, sx + 9, 500);
        sx += tw + 8;
      });

      const texture = new THREE.CanvasTexture(cvs);
      texture.generateMipmaps = true;
      texturesToDispose.push(texture);
      return texture;
    };

    // 5. Create floating resume sheet meshes
    const sheetsGroup = new THREE.Group();
    scene.add(sheetsGroup);

    const createSheetMesh = (
      name: string,
      role: string,
      accentColor: string,
      hasPhoto: boolean,
      scale = 1.0,
      xPos = 0,
      yPos = 0,
      zPos = 0,
      rotY = 0,
      rotZ = 0
    ) => {
      const geo = new THREE.BoxGeometry(1.6 * scale, 2.26 * scale, 0.022);
      const texture = createDocTexture(name, role, accentColor, hasPhoto);
      const frontMat = new THREE.MeshStandardMaterial({
        map: texture || undefined,
        roughness: 0.3,
        metalness: 0.04,
      });
      const edgeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9 });
      const mats = [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, edgeMat];
      const mesh = new THREE.Mesh(geo, mats);
      mesh.position.set(xPos, yPos, zPos);
      mesh.rotation.y = rotY;
      mesh.rotation.z = rotZ;
      mesh.rotation.x = 0.06;
      return mesh;
    };

    // Layout: sheets spread across the full viewport — visible but not overlapping
    // the central text column (approximately x: -1.2 to +1.2 at this FOV/distance)

    // LEFT WING — designer resume (foreground)
    const leftX = isMobile ? -2.2 : -2.9;
    const leftSheet = createSheetMesh(
      "Chloe Dupont",
      "Product & Brand Designer",
      "#4f46e5",
      true,
      isMobile ? 0.82 : 1.08,
      leftX, -0.1, -0.5,
      0.32, -0.04
    );
    sheetsGroup.add(leftSheet);

    // RIGHT WING — educator resume (foreground)
    const rightX = isMobile ? 2.2 : 2.9;
    const rightSheet = createSheetMesh(
      "Marcus Sterling, M.Ed.",
      "Lead STEM Educator",
      "#059669",
      false,
      isMobile ? 0.82 : 1.08,
      rightX, 0.1, -0.5,
      -0.32, 0.04
    );
    sheetsGroup.add(rightSheet);

    // CENTER BACK — nurse resume (behind text, pushed deep, semi-transparent)
    const backSheet = createSheetMesh(
      "Elena Rostova, RN",
      "Critical Care Specialist",
      "#6366f1",
      false,
      isMobile ? 0.65 : 0.88,
      0, 0.6, -2.8,
      0.05, 0
    );
    // Semi-transparent so it peeks through and adds depth without competing with text
    (backSheet.material as THREE.MeshStandardMaterial[])[4].transparent = true;
    (backSheet.material as THREE.MeshStandardMaterial[])[4].opacity = 0.55;
    sheetsGroup.add(backSheet);

    // LOWER LEFT — finance resume (mid-depth)
    if (!isMobile) {
      const lowerLeft = createSheetMesh(
        "Priya Sharma, CPA",
        "Senior Financial Analyst",
        "#0369a1",
        false,
        0.72,
        -4.2, -1.5, -1.2,
        0.5, 0.06
      );
      sheetsGroup.add(lowerLeft);
    }

    // UPPER RIGHT — sales resume (mid-depth)
    if (!isMobile) {
      const upperRight = createSheetMesh(
        "James O'Brien",
        "Regional Sales Director",
        "#b45309",
        true,
        0.72,
        4.2, 1.4, -1.2,
        -0.5, -0.06
      );
      sheetsGroup.add(upperRight);
    }

    // 6. Particles — visible and plentiful, spread across scene
    const particleCount = isMobile ? 200 : 450;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 1;
      particleSizes[i] = Math.random() * 0.03 + 0.015;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particlesMat);
    scene.add(particles);

    // Secondary warm particles
    const warmGeo = new THREE.BufferGeometry();
    const warmPos = new Float32Array(particleCount / 2 * 3);
    for (let i = 0; i < particleCount / 2; i++) {
      warmPos[i * 3] = (Math.random() - 0.5) * 18;
      warmPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      warmPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    warmGeo.setAttribute("position", new THREE.BufferAttribute(warmPos, 3));
    const warmMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.022,
      transparent: true,
      opacity: 0.4,
    });
    const warmParticles = new THREE.Points(warmGeo, warmMat);
    scene.add(warmParticles);

    // 7. Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    window.addEventListener("mousemove", onMouseMove);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 8. Animation loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth camera parallax
      camera.position.x += (mouseX * 2.5 - camera.position.x) * 0.035;
      camera.position.y += (-mouseY * 2.0 - camera.position.y) * 0.035;
      camera.lookAt(scene.position);

      // Floating motion — gentle, each sheet independent phase
      leftSheet.position.y = -0.1 + Math.sin(t * 0.7 + 0.0) * 0.18;
      leftSheet.rotation.z = -0.04 + Math.cos(t * 0.5) * 0.02;

      rightSheet.position.y = 0.1 + Math.cos(t * 0.65 + 1.1) * 0.18;
      rightSheet.rotation.z = 0.04 + Math.sin(t * 0.55) * 0.02;

      backSheet.position.y = 0.6 + Math.sin(t * 0.4 + 2.2) * 0.1;

      // Particle drift
      particles.rotation.y = t * 0.018;
      warmParticles.rotation.y = -t * 0.012;
      warmParticles.rotation.x = t * 0.008;

      renderer.render(scene, camera);
    };

    if (prefersReducedMotion) {
      // Render one still frame
      renderer.render(scene, camera);
    } else {
      animate();
    }

    // 9. Resize handler
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (prefersReducedMotion) renderer.render(scene, camera);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      texturesToDispose.forEach((t) => t.dispose());
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
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
    // CSS-only animated fallback — no WebGL needed
    return (
      <div className="w-full h-full absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-slate-950/40 to-purple-950/50 animate-pulse" />
        {/* Fake floating cards */}
        <div className="absolute top-1/4 left-[8%] w-40 h-56 bg-white/10 dark:bg-white/8 border border-indigo-500/30 rounded-xl shadow-2xl transform -rotate-12 backdrop-blur-sm" />
        <div className="absolute top-1/3 right-[8%] w-40 h-56 bg-white/10 dark:bg-white/8 border border-emerald-500/30 rounded-xl shadow-2xl transform rotate-12 backdrop-blur-sm" />
        <div className="absolute bottom-1/4 left-1/4 w-32 h-44 bg-white/6 dark:bg-white/5 border border-purple-500/20 rounded-xl shadow-xl transform rotate-6 backdrop-blur-sm" />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="w-full h-full absolute inset-0 pointer-events-none select-none"
      style={{ zIndex: 0, touchAction: "none" }}
    />
  );
};
