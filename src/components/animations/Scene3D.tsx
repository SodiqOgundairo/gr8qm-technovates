import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  color?: string;
  speed?: number;
}

function ParticleField({
  count = 800,
  color = "#0098da",
  speed = 0.3,
}: ParticleFieldProps) {
  const mesh = useRef<THREE.Points>(null!);
  const mouseRef = useRef({ x: 0, y: 0 });

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    return [pos, vel];
  }, [count]);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = Math.random() * 3 + 0.5;
    }
    return s;
  }, [count]);

  useFrame(({ pointer, clock }) => {
    if (!mesh.current) return;
    const geo = mesh.current.geometry;
    const posAttr = geo.getAttribute("position");
    const arr = posAttr.array as Float32Array;
    const t = clock.getElapsedTime() * speed;

    mouseRef.current.x += (pointer.x * 2 - mouseRef.current.x) * 0.02;
    mouseRef.current.y += (pointer.y * 2 - mouseRef.current.y) * 0.02;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] += velocities[i3] + Math.sin(t + i * 0.1) * 0.002;
      arr[i3 + 1] += velocities[i3 + 1] + Math.cos(t + i * 0.1) * 0.002;
      arr[i3 + 2] += velocities[i3 + 2];

      // Mouse repulsion
      const dx = arr[i3] - mouseRef.current.x * 5;
      const dy = arr[i3 + 1] - mouseRef.current.y * 5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2) {
        arr[i3] += dx * 0.01;
        arr[i3 + 1] += dy * 0.01;
      }

      // Boundary wrap
      if (arr[i3] > 10) arr[i3] = -10;
      if (arr[i3] < -10) arr[i3] = 10;
      if (arr[i3 + 1] > 10) arr[i3 + 1] = -10;
      if (arr[i3 + 1] < -10) arr[i3 + 1] = 10;
      if (arr[i3 + 2] > 5) arr[i3 + 2] = -5;
      if (arr[i3 + 2] < -5) arr[i3 + 2] = 5;
    }

    posAttr.needsUpdate = true;
    mesh.current.rotation.y = t * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingGeometry() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    groupRef.current.rotation.y = t * 0.08;
  });

  return (
    <group ref={groupRef}>
      {/* Wireframe icosahedron */}
      <mesh position={[3, 1, -2]} rotation={[0.5, 0.3, 0]}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshBasicMaterial
          color="#0098da"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Wireframe torus */}
      <mesh position={[-3.5, -1.5, -3]} rotation={[0.8, 0.4, 0]}>
        <torusGeometry args={[1, 0.3, 8, 20]} />
        <meshBasicMaterial
          color="#f58634"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Wireframe octahedron */}
      <mesh position={[-1, 2.5, -4]}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshBasicMaterial
          color="#c9ebfb"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* Small floating spheres */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 4 + Math.random() * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius * 0.5,
              -2 + Math.random() * -3,
            ]}
          >
            <sphereGeometry args={[0.05 + Math.random() * 0.08, 8, 8]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? "#f58634" : "#0098da"}
              transparent
              opacity={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}

interface Scene3DProps {
  variant?: "hero" | "minimal" | "dense";
  className?: string;
}

const Scene3D: React.FC<Scene3DProps> = ({
  variant = "hero",
  className = "",
}) => {
  const config = {
    hero: { count: 800, speed: 0.3, showGeometry: true },
    minimal: { count: 300, speed: 0.15, showGeometry: false },
    dense: { count: 1200, speed: 0.4, showGeometry: true },
  }[variant];

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ParticleField count={config.count} speed={config.speed} />
        {config.showGeometry && <FloatingGeometry />}
      </Canvas>
    </div>
  );
};

export default Scene3D;
