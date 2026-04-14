'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

interface STLViewerProps {
  stlData: ArrayBuffer | null;
  deviceName: string;
}

const colorOptions = [
  { name: 'Silver', value: 0xcccccc },
  { name: 'Emerald', value: 0x10b981 },
  { name: 'Cyan', value: 0x22d3ee },
  { name: 'Sunset', value: 0xf59e0b },
  { name: 'Violet', value: 0x8b5cf6 }
];

export default function STLViewer({ stlData, deviceName }: STLViewerProps) {
  const [meshColor, setMeshColor] = useState<number>(0xcccccc);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const frameIdRef = useRef<number | null>(null);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen toggle failed', err);
    }
  };
  
  useEffect(() => {
    if (!stlData || !containerRef.current) return;
    
    let buffer: ArrayBuffer;
    if (stlData instanceof ArrayBuffer) buffer = stlData;
    else return;
    
    if (!buffer || buffer.byteLength === 0) return;
    
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = 400;
    
    // Cleanup previous
    if (rendererRef.current) {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      if (controlsRef.current) controlsRef.current.dispose();
      if (meshRef.current) {
        if (meshRef.current.geometry) meshRef.current.geometry.dispose();
        if (meshRef.current.material) {
          if (Array.isArray(meshRef.current.material)) {
            meshRef.current.material.forEach(m => m.dispose());
          } else {
            meshRef.current.material.dispose();
          }
        }
      }
      if (rendererRef.current.domElement && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current.dispose();
    }
    
    try {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
      sceneRef.current = scene;
      
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10000);
      cameraRef.current = camera;
      
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      
      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(5, 10, 7);
      dirLight.castShadow = true;
      scene.add(dirLight);
      
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
      fillLight.position.set(-5, 0, -5);
      scene.add(fillLight);
      
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.0;
      controlsRef.current = controls;
      
      const loader = new STLLoader();
      const geometry = loader.parse(buffer);
      geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      geometry.boundingBox!.getCenter(center);
      geometry.translate(-center.x, -center.y, -center.z);
      
      const box = new THREE.Box3().setFromObject(new THREE.Mesh(geometry));
      const size = box.getSize(new THREE.Vector3());
      
      const material = new THREE.MeshPhongMaterial({ 
        color: meshColor, 
        specular: 0x444444,
        shininess: 100,
        flatShading: false,
        side: THREE.DoubleSide
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      meshRef.current = mesh;
      
      // Add edges
      const edgesGeometry = new THREE.EdgesGeometry(geometry, 15);
      const edgesMaterial = new THREE.LineBasicMaterial({ 
        color: 0x000000, 
        linewidth: 1,
        opacity: 0.2,
        transparent: true
      });
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      mesh.add(edges);
      
      const fov = camera.fov * (Math.PI / 180);
      const fovh = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect);
      const margin = 1.5;
      const dx = size.z / 2 + Math.abs(size.x / 2 / Math.tan(fovh / 2));
      const dy = size.z / 2 + Math.abs(size.y / 2 / Math.tan(fov / 2));
      const distance = Math.max(dx, dy) * margin;
      
      camera.position.set(0, 0, distance);
      camera.near = Math.max(0.01, distance / 100);
      camera.far = Math.max(10000, distance * 10);
      camera.updateProjectionMatrix();
      
      controls.target.set(0, 0, 0);
      controls.maxDistance = distance * 3;
      controls.minDistance = size.x / 10;
      controls.update();
      
      const animate = () => {
        frameIdRef.current = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
      
      const handleResize = () => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight || 400;
        cameraRef.current.aspect = newWidth / newHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(newWidth, newHeight);
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
        if (controlsRef.current) controlsRef.current.dispose();
        if (meshRef.current) {
          if (meshRef.current.geometry) meshRef.current.geometry.dispose();
          if (meshRef.current.material) {
            if (Array.isArray(meshRef.current.material)) {
              meshRef.current.material.forEach(m => m.dispose());
            } else {
              meshRef.current.material.dispose();
            }
          }
        }
        if (rendererRef.current) {
          if (rendererRef.current.domElement && container.contains(rendererRef.current.domElement)) {
            container.removeChild(rendererRef.current.domElement);
          }
          rendererRef.current.dispose();
        }
      };
    } catch (err) {
      container.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400 text-sm">Failed to load 3D model</div>';
    }
  }, [stlData, deviceName]);

  useEffect(() => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.MeshPhongMaterial;
    material.color.setHex(meshColor);
  }, [meshColor]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/20 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/70">Mesh color</p>
          <p className="text-sm text-gray-300">Choose a finish for the generated model</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="rounded-full border border-white/20 bg-black/20 px-3 py-2 text-xs text-white transition hover:bg-black/40"
          >
            {isFullscreen ? 'Exit full screen' : 'Full screen'}
          </button>
          <div className="flex flex-wrap gap-2">
          {colorOptions.map((option) => (
            <button
              key={option.name}
              type="button"
              onClick={() => setMeshColor(option.value)}
              className={`h-9 w-9 rounded-full border-2 transition-all ${
                meshColor === option.value ? 'border-white shadow-lg shadow-emerald-500/20' : 'border-white/20'
              }`}
              style={{ backgroundColor: `#${option.value.toString(16).padStart(6, '0')}` }}
              aria-label={`Select ${option.name} color`}
            />
          ))}
        </div>
      </div>
    <div 
      ref={containerRef} 
      className={`w-full ${isFullscreen ? 'h-screen' : 'h-[400px]'} bg-white/5 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center relative overflow-hidden`}
    >
      {!stlData && <span className="text-gray-300 text-sm">STL preview will appear here</span>}
    </div>
      </div>
    </div>
  );
}