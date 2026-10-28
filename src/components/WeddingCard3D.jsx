import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, RoundedBox, Text } from '@react-three/drei'

const CREAM = '#FAF6F0'
const BERRY = '#C4506B'
const MAROON = '#A31E3B'
const INK = '#8B1A32'

function InvitationCard({ dragging }) {
  const groupRef = useRef()

  useFrame((_, delta) => {
    if (!dragging && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35
    }
  })

  return (
    <group ref={groupRef} rotation={[0.15, 0.5, 0]}>
      {/* Left panel */}
      <RoundedBox args={[1.05, 0.03, 1.5]} radius={0.02} smoothness={4} position={[-0.53, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={CREAM} roughness={0.55} metalness={0.02} />
      </RoundedBox>

      {/* Right panel — slightly open bi-fold */}
      <group position={[0.53, 0, 0]} rotation={[0, -0.35, 0]}>
        <RoundedBox args={[1.05, 0.03, 1.5]} radius={0.02} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color={CREAM} roughness={0.55} metalness={0.02} />
        </RoundedBox>

        {/* Inner right face */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.95, 1.35]} />
          <meshStandardMaterial color="#F8E8EC" roughness={0.7} />
        </mesh>

        <Text
          position={[0, 0.04, 0.35]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.09}
          color={INK}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          YOU'RE INVITED
        </Text>

        <Text
          position={[0, 0.04, 0.05]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.055}
          color={BERRY}
          anchorX="center"
          anchorY="middle"
        >
          The Paper Story
        </Text>

        {/* Simple floral line accent */}
        <mesh position={[0, 0.045, -0.35]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.06, 0.09, 24]} />
          <meshStandardMaterial color={BERRY} roughness={0.6} side={2} />
        </mesh>
      </group>

      {/* Spine accent */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.04, 0.04, 1.5]} />
        <meshStandardMaterial color={MAROON} roughness={0.5} />
      </mesh>

      {/* Front cover subtle border */}
      <mesh position={[-0.53, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.9, 1.3]} />
        <meshStandardMaterial color="#F5E0E6" roughness={0.75} transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

function Scene({ dragging, setDragging }) {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={0.9} castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={0.35} color="#F8E8EE" />
      <pointLight position={[0, 1.5, 2]} intensity={0.4} color="#EDD0D8" />

      <Grid
        position={[0, -0.5, 0]}
        args={[10, 10]}
        cellSize={0.4}
        cellThickness={0.5}
        cellColor="#F5E0E6"
        sectionSize={1.6}
        sectionThickness={0.8}
        sectionColor="#C4506B"
        fadeDistance={14}
        fadeStrength={1}
        infiniteGrid
      />

      <InvitationCard dragging={dragging} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 1.7}
        rotateSpeed={0.85}
        onStart={() => setDragging(true)}
        onEnd={() => setDragging(false)}
      />
    </>
  )
}

export default function WeddingCard3D() {
  const [dragging, setDragging] = useState(false)

  return (
    <div className="wedding-card-window">
      <div className="wedding-card-window-bar">
        <span>Drag to spin</span>
        <span>✿</span>
      </div>
      <div className="wedding-card-canvas-wrap">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-sm text-paperstory-berry/60">
              Loading invitation…
            </div>
          }
        >
          <Canvas
            shadows
            camera={{ position: [0, 0.8, 3.4], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'linear-gradient(180deg, #FAF6F0 0%, #FAF2F4 100%)' }}
          >
            <Scene dragging={dragging} setDragging={setDragging} />
          </Canvas>
        </Suspense>
      </div>
    </div>
  )
}
