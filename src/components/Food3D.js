import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Burger() {
  const group = useRef();
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.01; // Slow rotation
    }
  });
  return (
    <group ref={group} position={[-1.1, 0, 0]}>
      {/* Bottom Bun */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.25, 32]} />
        <meshStandardMaterial color="#e2a76f" />
      </mesh>
      {/* Patty */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.15, 32]} />
        <meshStandardMaterial color="#7b3f00" />
      </mesh>
      {/* Cheese */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.05, 32]} />
        <meshStandardMaterial color="#ffd600" />
      </mesh>
      {/* Lettuce */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.04, 32]} />
        <meshStandardMaterial color="#7ed957" />
      </mesh>
      {/* Top Bun */}
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.9, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.1]} />
        <meshStandardMaterial color="#e2a76f" />
      </mesh>
      {/* Sesame seeds */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.6, 0.55, Math.sin(angle) * 0.6]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#fffbe6" />
          </mesh>
        );
      })}
    </group>
  );
}

function Pizza() {
  const group = useRef();
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.z += 0.012;
      group.current.position.y = 0.1 * Math.sin(clock.getElapsedTime() * 2);
    }
  });
  return (
    <group ref={group} position={[1.1, 0, 0]}>
      {/* Pizza base */}
      <mesh>
        <cylinderGeometry args={[0.9, 0.9, 0.12, 32]} />
        <meshStandardMaterial color="#ffe0b2" />
      </mesh>
      {/* Sauce */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.03, 32]} />
        <meshStandardMaterial color="#e57373" />
      </mesh>
      {/* Cheese */}
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.02, 32]} />
        <meshStandardMaterial color="#fff176" />
      </mesh>
      {/* Pepperoni */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.5, 0.12, Math.sin(angle) * 0.5]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
            <meshStandardMaterial color="#b71c1c" />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Food3D() {
  return (
    <div style={{ width: 340, height: 240, maxWidth: '95vw', background: '#ffffff', borderRadius: 16, margin: '0 auto' }}>
      <Canvas camera={{ position: [0, 1.2, 4], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 7]} intensity={1.2} />
        <Burger />
        <Pizza />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
} 