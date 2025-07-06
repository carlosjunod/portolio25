import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ParticleBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Create circular sprite texture for points
    const spriteSize = 3.4;
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = spriteCanvas.height = spriteSize;
    const spriteCtx = spriteCanvas.getContext('2d');
    spriteCtx.fillStyle = '#ffffff';
    spriteCtx.beginPath();
    spriteCtx.arc(spriteSize / 2, spriteSize / 2, spriteSize / 2 - 1, 0, Math.PI * 2);
    spriteCtx.fill();
    const spriteTexture = new THREE.CanvasTexture(spriteCanvas);

    // Particles geometry
    const count = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      map: spriteTexture,
      alphaTest: 0.5,
      transparent: true,
      sizeAttenuation: true,
      vertexColors: true, // Enable vertex colors
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Add colors attribute for twinkling
    const colors = new Float32Array(count * 3);
    const originalColors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
      originalColors[i * 3] = 1;
      originalColors[i * 3 + 1] = 1;
      originalColors[i * 3 + 2] = 1;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Twinkling state
    const twinklingParticles = new Map();
    const twinkleFrequency = 0.005; // More frequent twinkling
    const twinkleDuration = 1500; // ms

    // Bright flash state
    const flashingParticles = new Map();
    const flashDuration = 400; // ms
    const flashIntensity = 7.0; // Brighter flash
    let nextFlashTime = 3 + Math.random(); // First flash in 3-4 seconds

    // Prepare per-particle velocities and original positions for repulsion/attraction
    const velocities = new Float32Array(count * 3).fill(0);
    const origPositions = new Float32Array(positions);
    const pointer3D = new THREE.Vector3();
    const prevPointer3D = new THREE.Vector3();
    const pointerVelocity3D = new THREE.Vector3();
    const repulseRadius = 3;
    const repulseStrength = 5;
    const attractionStrength = 0.0002;
    const friction = 0.95;

    // Track pointer movement for parallax effect
    let mouseX = 0;
    let mouseY = 0;
    const handlePointerMove = (e) => {
      mouseX = (e.clientX / mount.clientWidth) * 2 - 1;
      mouseY = -(e.clientY / mount.clientHeight) * 2 + 1;
      // Compute world-space pointer and velocity
      pointer3D.set(mouseX, mouseY, 0.5).unproject(camera);
      pointerVelocity3D.subVectors(pointer3D, prevPointer3D);
      prevPointer3D.copy(pointer3D);
    };
    window.addEventListener('pointermove', handlePointerMove);

    // Animation loop
    let frameId;
    const clock = new THREE.Clock();
    const frustum = new THREE.Frustum();
    const cameraViewProjectionMatrix = new THREE.Matrix4();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update frustum
      camera.updateMatrixWorld();
      cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

      // Find visible particles
      const visibleParticles = [];
      const positionAttribute = geometry.attributes.position;
      const particlePosition = new THREE.Vector3();
      for (let i = 0; i < count; i++) {
        particlePosition.fromBufferAttribute(positionAttribute, i);
        if (frustum.containsPoint(particlePosition)) {
          visibleParticles.push(i);
        }
      }

      // Handle bright flashes
      if (elapsedTime > nextFlashTime && visibleParticles.length > 0) {
        const randomIndex = Math.floor(Math.random() * visibleParticles.length);
        const particleIndex = visibleParticles[randomIndex];
        if (!flashingParticles.has(particleIndex)) {
          if (twinklingParticles.has(particleIndex)) {
            twinklingParticles.delete(particleIndex);
          }
          flashingParticles.set(particleIndex, { startTime: elapsedTime });
        }
        nextFlashTime = elapsedTime + 3 + Math.random();
      }

      // Handle twinkles
      if (Math.random() < twinkleFrequency && visibleParticles.length > 0) {
        const randomIndex = Math.floor(Math.random() * visibleParticles.length);
        const particleIndex = visibleParticles[randomIndex];
        if (!twinklingParticles.has(particleIndex) && !flashingParticles.has(particleIndex)) {
          twinklingParticles.set(particleIndex, { startTime: elapsedTime });
        }
      }

      // Update flashing particles
      flashingParticles.forEach((flash, index) => {
        const progress = (elapsedTime - flash.startTime) * 1000 / flashDuration;
        const cIdx = index * 3;
        if (progress > 1) {
          colors[cIdx] = originalColors[cIdx];
          colors[cIdx + 1] = originalColors[cIdx + 1];
          colors[cIdx + 2] = originalColors[cIdx + 2];
          flashingParticles.delete(index);
        } else {
          const pulse = 1 - Math.abs(progress * 2 - 1);
          const brightness = 1 + pulse * (flashIntensity - 1);
          colors[cIdx] = originalColors[cIdx] * brightness;
          colors[cIdx + 1] = originalColors[cIdx + 1] * brightness;
          colors[cIdx + 2] = originalColors[cIdx + 2] * brightness;
        }
      });

      // Update twinkling particles
      twinklingParticles.forEach((twinkle, index) => {
        const progress = (elapsedTime - twinkle.startTime) * 1000 / twinkleDuration;
        const cIdx = index * 3;
        if (progress > 1) {
          colors[cIdx] = originalColors[cIdx];
          colors[cIdx + 1] = originalColors[cIdx + 1];
          colors[cIdx + 2] = originalColors[cIdx + 2];
          twinklingParticles.delete(index);
        } else {
          const brightness = 1 + Math.sin(progress * Math.PI) * 1.0;
          colors[cIdx] = originalColors[cIdx] * brightness;
          colors[cIdx + 1] = originalColors[cIdx + 1] * brightness;
          colors[cIdx + 2] = originalColors[cIdx + 2] * brightness;
        }
      });

      geometry.attributes.color.needsUpdate = true;

      // Rotate particles based on pointer
      particles.rotation.x += 0.0005 + mouseY * 0.00005;
      particles.rotation.y += 0.001 + mouseX * 0.00005;

      // Parallax camera movement based on pointer
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Particle repulsion: push nearby particles away based on pointer velocity
      if (pointerVelocity3D.lengthSq() > 0) {
        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          const dx = positions[idx] - pointer3D.x;
          const dy = positions[idx + 1] - pointer3D.y;
          const dz = positions[idx + 2] - pointer3D.z;
          const dist2 = dx * dx + dy * dy + dz * dz;
          if (dist2 < repulseRadius * repulseRadius) {
            const dist = Math.sqrt(dist2) || 1;
            const force = ((repulseRadius - dist) / repulseRadius)
              * pointerVelocity3D.length()
              * repulseStrength;
            velocities[idx] += (dx / dist) * force;
            velocities[idx + 1] += (dy / dist) * force;
            velocities[idx + 2] += (dz / dist) * force;
          }
        }
      }
      // Particle attraction: pull particles slowly back toward their origin
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        velocities[idx] += (origPositions[idx] - positions[idx]) * attractionStrength;
        velocities[idx + 1] += (origPositions[idx + 1] - positions[idx + 1]) * attractionStrength;
        velocities[idx + 2] += (origPositions[idx + 2] - positions[idx + 2]) * attractionStrength;
      }
      // Apply velocities and friction
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        positions[idx] += velocities[idx];
        positions[idx + 1] += velocities[idx + 1];
        positions[idx + 2] += velocities[idx + 2];
        velocities[idx] *= friction;
        velocities[idx + 1] *= friction;
        velocities[idx + 2] *= friction;
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: -1,
      }}
    />
  );
}