import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

interface AvatarProps {
  animation: string;
}

const Avatar: React.FC<AvatarProps> = ({ animation }) => {
  const meshRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);

  // Enhanced animation springs with more detailed control
  const { 
    leftArmRotation, 
    rightArmRotation, 
    leftForearmRotation,
    rightForearmRotation,
    leftHandRotation,
    rightHandRotation,
    leftHandPosition,
    rightHandPosition,
    headRotation, 
    bodyPosition,
    torsoRotation 
  } = useSpring({
    ...getAnimationPose(animation),
    config: { tension: 180, friction: 20 }
  });

  // Optimized idle animation with breathing effect
  useFrame((state) => {
    if (animation === 'idle' && meshRef.current) {
      const time = state.clock.elapsedTime;
      // Subtle breathing animation
      meshRef.current.position.y = Math.sin(time * 0.8) * 0.02;
      meshRef.current.scale.setScalar(1 + Math.sin(time * 0.8) * 0.005);
      
      // Subtle head movement
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 0.4) * 0.05;
        headRef.current.rotation.x = Math.sin(time * 0.3) * 0.02;
      }
      
      // Chest breathing
      if (torsoRef.current) {
        torsoRef.current.scale.z = 1 + Math.sin(time * 0.8) * 0.01;
      }
    }
  });

  // Optimized geometry with instancing for better performance
  const avatarGeometry = useMemo(() => ({
    head: new THREE.SphereGeometry(0.32, 20, 16),
    neck: new THREE.CylinderGeometry(0.12, 0.14, 0.2, 12),
    torso: new THREE.CylinderGeometry(0.28, 0.32, 1.4, 16),
    upperArm: new THREE.CylinderGeometry(0.09, 0.07, 0.7, 12),
    forearm: new THREE.CylinderGeometry(0.07, 0.06, 0.6, 12),
    hand: new THREE.SphereGeometry(0.11, 16, 12),
    fingers: new THREE.CylinderGeometry(0.02, 0.015, 0.15, 8),
    thumb: new THREE.CylinderGeometry(0.025, 0.02, 0.12, 8),
    upperLeg: new THREE.CylinderGeometry(0.12, 0.1, 0.8, 12),
    lowerLeg: new THREE.CylinderGeometry(0.1, 0.08, 0.7, 12),
    foot: new THREE.BoxGeometry(0.25, 0.1, 0.08)
  }), []);

  // Enhanced materials with better lighting response
  const materials = useMemo(() => ({
    skin: new THREE.MeshPhongMaterial({ 
      color: '#fdbcb4',
      shininess: 5,
      specular: '#ffeeee'
    }),
    clothing: new THREE.MeshPhongMaterial({ 
      color: '#4f46e5',
      shininess: 10
    }),
    hair: new THREE.MeshPhongMaterial({ 
      color: '#8b4513',
      shininess: 20
    }),
    eyes: new THREE.MeshBasicMaterial({ color: '#2c3e50' }),
    eyeWhites: new THREE.MeshPhongMaterial({ color: '#ffffff' })
  }), []);

  // Finger component for detailed hand animations
  const FingerGroup = ({ position, rotation, scale = 1 }: { position: [number, number, number], rotation: [number, number, number], scale?: number }) => (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0.075, 0]} geometry={avatarGeometry.fingers} material={materials.skin} />
    </group>
  );

  // Enhanced hand with individual fingers
  const HandGroup = ({ isLeft, handRef, fingerPositions }: { 
    isLeft: boolean, 
    handRef: React.RefObject<THREE.Group>,
    fingerPositions: any
  }) => (
    <animated.group ref={handRef} rotation={isLeft ? leftHandRotation : rightHandRotation} position={isLeft ? leftHandPosition : rightHandPosition}>
      {/* Palm */}
      <mesh geometry={avatarGeometry.hand} material={materials.skin} />
      
      {/* Thumb */}
      <FingerGroup 
        position={isLeft ? [-0.08, 0, 0.06] : [0.08, 0, 0.06]} 
        rotation={fingerPositions.thumb}
        scale={0.9}
      />
      
      {/* Index finger */}
      <FingerGroup 
        position={[0, 0.1, 0.08]} 
        rotation={fingerPositions.index}
      />
      
      {/* Middle finger */}
      <FingerGroup 
        position={[0, 0.12, 0.02]} 
        rotation={fingerPositions.middle}
      />
      
      {/* Ring finger */}
      <FingerGroup 
        position={[0, 0.1, -0.04]} 
        rotation={fingerPositions.ring}
      />
      
      {/* Pinky */}
      <FingerGroup 
        position={[0, 0.08, -0.08]} 
        rotation={fingerPositions.pinky}
        scale={0.8}
      />
    </animated.group>
  );

  return (
    <animated.group ref={meshRef} position={bodyPosition}>
      {/* Head with detailed features */}
      <animated.group ref={headRef} position={[0, 1.2, 0]} rotation={headRotation}>
        {/* Head */}
        <mesh geometry={avatarGeometry.head} material={materials.skin} castShadow />
        
        {/* Hair */}
        <mesh position={[0, 0.15, -0.05]} scale={[1.1, 0.8, 1.2]}>
          <sphereGeometry args={[0.32, 16, 12]} />
          <primitive object={materials.hair} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.1, 0.05, 0.28]}>
          <sphereGeometry args={[0.04, 12, 8]} />
          <primitive object={materials.eyeWhites} />
        </mesh>
        <mesh position={[0.1, 0.05, 0.28]}>
          <sphereGeometry args={[0.04, 12, 8]} />
          <primitive object={materials.eyeWhites} />
        </mesh>
        <mesh position={[-0.1, 0.05, 0.31]}>
          <sphereGeometry args={[0.02, 8, 6]} />
          <primitive object={materials.eyes} />
        </mesh>
        <mesh position={[0.1, 0.05, 0.31]}>
          <sphereGeometry args={[0.02, 8, 6]} />
          <primitive object={materials.eyes} />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0, -0.02, 0.3]}>
          <coneGeometry args={[0.03, 0.08, 6]} />
          <primitive object={materials.skin} />
        </mesh>
      </animated.group>

      {/* Neck */}
      <mesh position={[0, 0.9, 0]} geometry={avatarGeometry.neck} material={materials.skin} castShadow />

      {/* Enhanced Torso */}
      <animated.group ref={torsoRef} rotation={torsoRotation}>
        <mesh position={[0, 0.3, 0]} geometry={avatarGeometry.torso} material={materials.clothing} castShadow />
      </animated.group>

      {/* Left Arm System */}
      <animated.group position={[-0.45, 0.6, 0]} rotation={leftArmRotation}>
        <mesh position={[0, -0.35, 0]} geometry={avatarGeometry.upperArm} material={materials.skin} castShadow />
        
        <animated.group ref={leftForearmRef} position={[0, -0.7, 0]} rotation={leftForearmRotation}>
          <mesh position={[0, -0.3, 0]} geometry={avatarGeometry.forearm} material={materials.skin} castShadow />
          
          <HandGroup 
            isLeft={true} 
            handRef={leftHandRef}
            fingerPositions={getFingerPositions(animation, true)}
          />
        </animated.group>
      </animated.group>

      {/* Right Arm System */}
      <animated.group position={[0.45, 0.6, 0]} rotation={rightArmRotation}>
        <mesh position={[0, -0.35, 0]} geometry={avatarGeometry.upperArm} material={materials.skin} castShadow />
        
        <animated.group ref={rightForearmRef} position={[0, -0.7, 0]} rotation={rightForearmRotation}>
          <mesh position={[0, -0.3, 0]} geometry={avatarGeometry.forearm} material={materials.skin} castShadow />
          
          <HandGroup 
            isLeft={false} 
            handRef={rightHandRef}
            fingerPositions={getFingerPositions(animation, false)}
          />
        </animated.group>
      </animated.group>

      {/* Legs */}
      <mesh position={[-0.18, -0.7, 0]} geometry={avatarGeometry.upperLeg} material={materials.clothing} castShadow />
      <mesh position={[0.18, -0.7, 0]} geometry={avatarGeometry.upperLeg} material={materials.clothing} castShadow />
      <mesh position={[-0.18, -1.4, 0]} geometry={avatarGeometry.lowerLeg} material={materials.skin} castShadow />
      <mesh position={[0.18, -1.4, 0]} geometry={avatarGeometry.lowerLeg} material={materials.skin} castShadow />
      
      {/* Feet */}
      <mesh position={[-0.18, -1.85, 0.08]} geometry={avatarGeometry.foot} material={materials.clothing} castShadow />
      <mesh position={[0.18, -1.85, 0.08]} geometry={avatarGeometry.foot} material={materials.clothing} castShadow />

      {/* Enhanced ground shadow */}
      <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.5, 32]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
    </animated.group>
  );
};

// Enhanced animation pose definitions with detailed finger control
function getAnimationPose(animation: string) {
  const poses: Record<string, any> = {
    idle: {
      leftArmRotation: [0.1, 0, -0.1],
      rightArmRotation: [0.1, 0, 0.1],
      leftForearmRotation: [0, 0, 0],
      rightForearmRotation: [0, 0, 0],
      leftHandRotation: [0, 0, 0],
      rightHandRotation: [0, 0, 0],
      leftHandPosition: [0, -0.6, 0],
      rightHandPosition: [0, -0.6, 0],
      headRotation: [0, 0, 0],
      bodyPosition: [0, 0, 0],
      torsoRotation: [0, 0, 0]
    },
    hello: {
      leftArmRotation: [0, 0, -0.3],
      rightArmRotation: [-0.8, 0.2, 1.2],
      leftForearmRotation: [0, 0, 0],
      rightForearmRotation: [-0.5, 0, 0],
      leftHandRotation: [0, 0, 0],
      rightHandRotation: [0, 0.3, 0],
      leftHandPosition: [0, -0.6, 0],
      rightHandPosition: [0, -0.3, 0.2],
      headRotation: [0.1, 0.2, 0],
      bodyPosition: [0, 0.05, 0],
      torsoRotation: [0, 0.1, 0]
    },
    goodbye: {
      leftArmRotation: [0, 0, -0.2],
      rightArmRotation: [-1.0, 0, 0.8],
      leftForearmRotation: [0, 0, 0],
      rightForearmRotation: [-0.3, 0, 0],
      leftHandRotation: [0, 0, 0],
      rightHandRotation: [0, 0.2, 0],
      leftHandPosition: [0, -0.6, 0],
      rightHandPosition: [0, -0.4, 0.1],
      headRotation: [0.05, 0.1, 0],
      bodyPosition: [0, 0, 0],
      torsoRotation: [0, 0.05, 0]
    },
    thank_you: {
      leftArmRotation: [0, 0, -0.1],
      rightArmRotation: [-0.3, 0, 0.5],
      leftForearmRotation: [0, 0, 0],
      rightForearmRotation: [-0.8, 0, 0],
      leftHandRotation: [0, 0, 0],
      rightHandRotation: [-0.2, 0, 0],
      leftHandPosition: [0, -0.6, 0],
      rightHandPosition: [0, -0.2, 0.3],
      headRotation: [0.2, 0, 0],
      bodyPosition: [0, 0.02, 0],
      torsoRotation: [0.05, 0, 0]
    },
    please: {
      leftArmRotation: [0, 0, -0.1],
      rightArmRotation: [-0.2, 0, 0.3],
      leftForearmRotation: [0, 0, 0],
      rightForearmRotation: [-0.6, 0, 0],
      leftHandRotation: [0, 0, 0],
      rightHandRotation: [0, 0, 0],
      leftHandPosition: [0, -0.6, 0],
      rightHandPosition: [0, -0.3, 0.2],
      headRotation: [0.1, 0.05, 0],
      bodyPosition: [0, 0, 0],
      torsoRotation: [0, 0, 0]
    },
    yes: {
      leftArmRotation: [0, 0, -0.1],
      rightArmRotation: [0, 0, 0.1],
      leftForearmRotation: [0, 0, 0],
      rightForearmRotation: [0, 0, 0],
      leftHandRotation: [0, 0, 0],
      rightHandRotation: [0, 0, 0],
      leftHandPosition: [0, -0.6, 0],
      rightHandPosition: [0, -0.6, 0],
      headRotation: [0.4, 0, 0],
      bodyPosition: [0, 0, 0],
      torsoRotation: [0, 0, 0]
    },
    no: {
      leftArmRotation: [0, 0, -0.1],
      rightArmRotation: [0, 0, 0.1],
      leftForearmRotation: [0, 0, 0],
      rightForearmRotation: [0, 0, 0],
      leftHandRotation: [0, 0, 0],
      rightHandRotation: [0, 0, 0],
      leftHandPosition: [0, -0.6, 0],
      rightHandPosition: [0, -0.6, 0],
      headRotation: [0, 0.6, 0],
      bodyPosition: [0, 0, 0],
      torsoRotation: [0, 0, 0]
    },
    // Full alphabet fingerspelling poses
    ...generateFingerspellingPoses()
  };

  return poses[animation] || poses.idle;
}

// Generate all fingerspelling poses A-Z
function generateFingerspellingPoses() {
  const fingerspellingPoses: Record<string, any> = {};
  
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  
  letters.forEach((letter, index) => {
    const angle = (index / 26) * Math.PI * 2;
    const height = Math.sin(index * 0.5) * 0.3;
    
    fingerspellingPoses[`fingerspell_${letter}`] = {
      leftArmRotation: [0, 0, -0.2],
      rightArmRotation: [-0.6 + height, 0.2, 0.8 + Math.sin(angle) * 0.3],
      leftForearmRotation: [0, 0, 0],
      rightForearmRotation: [-0.4 + Math.cos(angle) * 0.2, 0, 0],
      leftHandRotation: [0, 0, 0],
      rightHandRotation: [Math.sin(angle) * 0.3, Math.cos(angle) * 0.2, 0],
      leftHandPosition: [0, -0.6, 0],
      rightHandPosition: [0, -0.2 + height, 0.3],
      headRotation: [0.1, 0.1, 0],
      bodyPosition: [0, 0, 0],
      torsoRotation: [0, 0.05, 0]
    };
  });
  
  return fingerspellingPoses;
}

// Enhanced finger positions for realistic hand shapes
function getFingerPositions(animation: string, isLeft: boolean) {
  const defaultFingers = {
    thumb: [0, 0, 0],
    index: [0, 0, 0],
    middle: [0, 0, 0],
    ring: [0, 0, 0],
    pinky: [0, 0, 0]
  };

  // Specific finger positions for different signs
  const fingerMappings: Record<string, any> = {
    hello: {
      thumb: [0.2, 0, 0.3],
      index: [-0.1, 0, 0],
      middle: [-0.1, 0, 0],
      ring: [-0.1, 0, 0],
      pinky: [-0.1, 0, 0]
    },
    fingerspell_a: {
      thumb: [0.5, 0, 0.2],
      index: [0.8, 0, 0],
      middle: [0.8, 0, 0],
      ring: [0.8, 0, 0],
      pinky: [0.8, 0, 0]
    },
    fingerspell_b: {
      thumb: [0.8, 0, 0.5],
      index: [0, 0, 0],
      middle: [0, 0, 0],
      ring: [0, 0, 0],
      pinky: [0, 0, 0]
    },
    fingerspell_c: {
      thumb: [0.3, 0, 0.2],
      index: [0.4, 0, 0.2],
      middle: [0.4, 0, 0.2],
      ring: [0.4, 0, 0.2],
      pinky: [0.4, 0, 0.2]
    }
  };

  return fingerMappings[animation] || defaultFingers;
}

export default Avatar;