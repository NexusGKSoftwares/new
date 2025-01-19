import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const CanvasBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mountNode = mountRef.current;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    mountNode?.appendChild(renderer.domElement);

    // Existing Stars Setup
    const starCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const goldenColor = new THREE.Color(0xffd700);
    const whiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < starCount; i++) {
      vertices[i * 3] = (Math.random() - 0.5) * 1000;
      vertices[i * 3 + 1] = (Math.random() - 0.5) * 1000;
      vertices[i * 3 + 2] = (Math.random() - 0.5) * 1000;

      const color = Math.random() < 0.5 ? goldenColor : whiteColor;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    // Interactive Stars Setup
    const interactiveStarCount = 2000;
    const radius = 200;
    const interactiveGeometry = new THREE.BufferGeometry();
    const interactiveVertices = new Float32Array(interactiveStarCount * 3);
    const interactiveColors = new Float32Array(interactiveStarCount * 3);

    const fireColor = new THREE.Color(0xff4500);
    const smallWhiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < interactiveStarCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * 2 * Math.PI;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      interactiveVertices[i * 3] = x;
      interactiveVertices[i * 3 + 1] = y;
      interactiveVertices[i * 3 + 2] = z;

      const color = Math.random() < 0.5 ? fireColor : smallWhiteColor;
      interactiveColors[i * 3] = color.r;
      interactiveColors[i * 3 + 1] = color.g;
      interactiveColors[i * 3 + 2] = color.b;
    }

    interactiveGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(interactiveVertices, 3)
    );
    interactiveGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(interactiveColors, 3)
    );

    const interactiveMaterial = new THREE.PointsMaterial({
      size: 2.5,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    });

    const interactiveStars = new THREE.Points(
      interactiveGeometry,
      interactiveMaterial
    );
    scene.add(interactiveStars);

    // Animation and Interaction
    let animationId; // Define animationId here
    const animate = () => {
      stars.rotation.x += 0.0005;
      stars.rotation.y += 0.0005;
      interactiveStars.rotation.x += 0.0005;
      interactiveStars.rotation.y += 0.0005;

      renderer.render(scene, camera);

      // Assign requestAnimationFrame ID to animationId
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId); // Cancel animation frame
      geometry.dispose();
      material.dispose();
      interactiveGeometry.dispose();
      interactiveMaterial.dispose();
      renderer.dispose();

      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    />
  );
};

export default CanvasBackground;

