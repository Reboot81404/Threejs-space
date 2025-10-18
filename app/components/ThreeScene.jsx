"use client";
import * as THREE from "three";
import { useEffect, useRef } from "react";
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Starfield() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.PointLight(0xffffff, 1.2);
    light.position.set(10, 10, 10);
    scene.add(light);

    const sunLight = new THREE.DirectionalLight(0xffffff)
    sunLight.position.set(-2,0.5,1)
    scene.add(sunLight)

    const planetGeometry = new THREE.IcosahedronGeometry(1,20);
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("/textures/earth_daymap.jpg")
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planet);

    const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("/textures/earth_clouds.jpg"),
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);

    //const controls = new OrbitControls(camera, renderer.domElement);
    
    
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 2000;
    }

    starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: Math.random() * 2 + 0.5,
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const animate = () => {
      requestAnimationFrame(animate);

      planet.rotation.y += 0.001 ;
      clouds.rotation.y += 0.0015;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
      }}
    />
  );
}
