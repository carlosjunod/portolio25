import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export default function ParticleBackground() {
  const mountRef = useRef(null);

  // Dev-mode state persisted in cookie
  const [devMode, setDevMode] = useState(() => {
    const match = document.cookie.match(/(?:^|; )devMode=([^;]+)/);
    return match ? match[1] === 'true' : false;
  });
  useEffect(() => {
    document.cookie = `devMode=${devMode}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }, [devMode]);

  // Control panel defaults
  const [speedFactor, setSpeedFactor] = useState(0.023);
  const [repulseMinPx, setRepulseMinPx] = useState(40);
  const [repulseMaxPx, setRepulseMaxPx] = useState(800);
  const [forceStrength, setForceStrength] = useState(30);
  const [springVal, setSpringVal] = useState(0.010);
  const [dampingVal, setDampingVal] = useState(0.85);

  // Refs for animation values
  const speedRef = useRef(speedFactor);
  const minRef = useRef(repulseMinPx);
  const maxRef = useRef(repulseMaxPx);
  const forceRef = useRef(forceStrength);
  const springRef = useRef(springVal);
  const dampRef = useRef(dampingVal);
  useEffect(() => { speedRef.current = speedFactor; }, [speedFactor]);
  useEffect(() => { minRef.current = repulseMinPx; }, [repulseMinPx]);
  useEffect(() => { maxRef.current = repulseMaxPx; }, [repulseMaxPx]);
  useEffect(() => { forceRef.current = forceStrength; }, [forceStrength]);
  useEffect(() => { springRef.current = springVal; }, [springVal]);
  useEffect(() => { dampRef.current = dampingVal; }, [dampingVal]);

  useEffect(() => {
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Setup Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    const fovRad = THREE.MathUtils.degToRad(camera.fov);
    let halfH = Math.tan(fovRad / 2) * camera.position.z;
    let halfW = halfH * camera.aspect;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000);
    mountRef.current.appendChild(renderer.domElement);

    // Create a circular sprite for particles
    const sizeC = 64;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = sizeC;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sizeC / 2, sizeC / 2, sizeC / 2, 0, Math.PI * 2);
    ctx.fill();
    const sprite = new THREE.CanvasTexture(canvas);

    // Particle initialization
    const count = 10000;
    const positions = new Float32Array(count * 3);
    const original = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 2 * halfW;
      const y = (Math.random() - 0.5) * 2 * halfH;
      positions[3 * i] = original[3 * i] = x;
      positions[3 * i + 1] = original[3 * i + 1] = y;
      positions[3 * i + 2] = original[3 * i + 2] = 0;
      velocities[3 * i] = velocities[3 * i + 1] = velocities[3 * i + 2] = 0;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Define baseSize and extraSize for sizing
    const baseSize = 0.015;
    const extraSize = 0.02;

    // Add per-particle opacity attribute
    const alphas = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      alphas[i] = 0.4 + Math.random() * 0.4; // random between 0.4 and 0.8
    }
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

    // Shader material with per-vertex alpha and dynamic point size
    const uniforms = { pointSize: { value: baseSize } };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        uniform float pointSize;
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = pointSize;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha);
        }
      `,
      transparent: true,
      depthTest: true,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Mouse interaction
    const mouse = new THREE.Vector2(0, 0);
    let prevX = null, prevY = null, prevT = performance.now(), mouseSpeed = 0;
    window.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (prevX !== null) {
        const dt = now - prevT;
        if (dt > 0) {
          const dx = e.clientX - prevX;
          const dy = e.clientY - prevY;
          mouseSpeed = Math.sqrt(dx * dx + dy * dy) / dt;
        }
      }
      prevX = e.clientX; prevY = e.clientY; prevT = now;
      mouse.x = (e.clientX / width) * 2 - 1;
      mouse.y = -(e.clientY / height) * 2 + 1;
    });
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const target = new THREE.Vector3();

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      const norm = Math.min(mouseSpeed * speedRef.current, 1);
      const minR = (minRef.current / width) * 2 * halfW;
      const maxR = (maxRef.current / width) * 2 * halfW;
      const effR = minR + norm * (maxR - minR);

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, target);
      material.uniforms.pointSize.value = THREE.MathUtils.lerp(material.uniforms.pointSize.value, baseSize + extraSize * norm, 0.1);

      const arr = geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const ix = 3 * i;
        const x = arr[ix], y = arr[ix + 1];
        const dx = x - target.x, dy = y - target.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < effR * effR) {
          const d = Math.sqrt(d2) || 0.0001;
          const f = ((effR - d) / effR) * norm * forceRef.current;
          velocities[ix] += (dx / d) * f;
          velocities[ix + 1] += (dy / d) * f;
        }
        velocities[ix] += (original[ix] - x) * springRef.current;
        velocities[ix + 1] += (original[ix + 1] - y) * springRef.current;
        velocities[ix] *= dampRef.current;
        velocities[ix + 1] *= dampRef.current;
        arr[ix] += velocities[ix];
        arr[ix + 1] += velocities[ix + 1];
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      mouseSpeed *= 0.9;
    }
    animate();

    // Handle resize
    function onResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const nh = Math.tan(fovRad / 2) * camera.position.z;
      halfH = nh;
      halfW = nh * camera.aspect;
    }
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', null);
      window.removeEventListener('resize', null);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Lexend:ital,wght@0,100&family=MuseoModerno:wght@900&display=swap"
        rel="stylesheet"
      />
      {/* Dev Mode Toggle */}
      <button
        onClick={() => setDevMode(dm => !dm)}
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}
      >
        {devMode ? 'Hide Dev' : 'Show Dev'}
      </button>
      {/* Control Panel */}
      {devMode && (
        <div
          style={{
            position: 'absolute',
            top: 50,
            right: 10,
            background: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 8,
            color: '#fff',
            zIndex: 1,
            width: '220px'
          }}
        >
          <div>Speed: {speedFactor.toFixed(3)}</div>
          <input type="range" min="0" max="0.1" step="0.001" value={speedFactor} onChange={e => setSpeedFactor(parseFloat(e.target.value))} />
          <div>Min R: {repulseMinPx}px</div>
          <input type="range" min="10" max="400" step="10" value={repulseMinPx} onChange={e => setRepulseMinPx(parseInt(e.target.value))} />
          <div>Max R: {repulseMaxPx}px</div>
          <input type="range" min="50" max="1000" step="50" value={repulseMaxPx} onChange={e => setRepulseMaxPx(parseInt(e.target.value))} />
          <div>Force: {forceStrength}</div>
          <input type="range" min="0" max="50" step="1" value={forceStrength} onChange={e => setForceStrength(parseFloat(e.target.value))} />
          <div>Spring: {springVal.toFixed(3)}</div>
          <input type="range" min="0" max="0.1" step="0.005" value={springVal} onChange={e => setSpringVal(parseFloat(e.target.value))} />
          <div>Damping: {dampingVal.toFixed(2)}</div>
          <input type="range" min="0.5" max="1" step="0.01" value={dampingVal} onChange={e => setDampingVal(parseFloat(e.target.value))} />
        </div>
      )}
      {/* Title Overlay with animated gradient and shadow */}
      <style>{` .gradient-text { background: linear-gradient(270deg, #00ff00, #00bfff, #8000ff, #00ff00); background-size: 600% 600%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradientAnimation 15s ease infinite; filter: drop-shadow(0 4px 15px rgba(0,0,0,0.5)); } @keyframes gradientAnimation { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } } `}</style>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 1, pointerEvents: 'none' }}>
        <div className="gradient-text" style={{ fontFamily: 'MuseoModerno, serif', fontWeight: 900, fontSize: '4rem', marginBottom: '0.5rem' }}>
          &lt;CarlosJunod /&gt;
        </div>
        <div style={{ fontFamily: 'Lexend, sans-serif', fontWeight: 100, letterSpacing: '0.5rem', fontSize: '1rem', color: '#fff' }}>
          FrontEnd Developer
        </div>
      </div>
      {/* Canvas Mount */}
      <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', zIndex: -1 }} />
    </>
  );
}
