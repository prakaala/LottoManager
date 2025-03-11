import { OrbitControls, Sphere } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function LotteryBall({ position, color, number }) {
    const meshRef = useRef();
    const randomSpeed = useMemo(() => ({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
    }), []);

    // Create texture outside conditional
    const texture = useMemo(() => {
        if (number === undefined) return null;

        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const context = canvas.getContext('2d');

        // Draw ball background
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(64, 64, 60, 0, Math.PI * 2);
        context.fill();

        // Draw number
        context.fillStyle = 'black';
        context.font = 'bold 70px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(number, 64, 64);

        return new THREE.CanvasTexture(canvas);
    }, [number]);

    useFrame(() => {
        meshRef.current.position.x += randomSpeed.x;
        meshRef.current.position.y += randomSpeed.y;
        meshRef.current.position.z += randomSpeed.z;

        // Bounce off walls
        if (Math.abs(meshRef.current.position.x) > 5) randomSpeed.x *= -1;
        if (Math.abs(meshRef.current.position.y) > 5) randomSpeed.y *= -1;
        if (Math.abs(meshRef.current.position.z) > 5) randomSpeed.z *= -1;

        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.y += 0.005;
    });

    if (number !== undefined) {
        return (
            <Sphere ref={meshRef} position={position} args={[0.15, 32, 32]}>
                <meshBasicMaterial map={texture} />
            </Sphere>
        );
    }

    return (
        <Sphere ref={meshRef} position={position} args={[0.08 + Math.random() * 0.12, 32, 32]}>
            <meshBasicMaterial 
                color={color} 
                transparent
                opacity={0.8 + Math.random() * 0.2}
            />
        </Sphere>
    );
}

function Scene() {
    const { camera } = useThree();
    const mouseRef = useRef({ x: 0, y: 0 });

    useFrame(() => {
        camera.position.x += (mouseRef.current.x * 0.05 - camera.position.x) * 0.02;
        camera.position.y += (mouseRef.current.y * 0.05 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);
    });

    const ballColors = useMemo(() => [
        '#FF6F61', // Red
        '#FFD700', // Gold
        '#4169E1', // Blue
        '#32CD32', // Green
        '#FF69B4', // Pink
        '#FFA500'  // Orange
    ], []);

    const balls = useMemo(() => {
        const regularBalls = Array(60).fill().map(() => ({
            position: [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            ],
            color: ballColors[Math.floor(Math.random() * ballColors.length)]
        }));

        const numberedBalls = Array(10).fill().map(() => ({
            position: [
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                -2 + (Math.random() - 0.5) * 4
            ],
            number: Math.floor(Math.random() * 99)
        }));

        return [...regularBalls, ...numberedBalls];
    }, [ballColors]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 0, 2]} intensity={1} />
            {balls.map((ball, index) => (
                <LotteryBall 
                    key={index}
                    position={ball.position}
                    color={ball.color}
                    number={ball.number}
                />
            ))}
        </>
    );
}

const LotteryBackground = () => {
    return (
        <Canvas
            camera={{ position: [0, 0, 3], fov: 75 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                background: '#000033'
            }}
        >
            <Scene />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
    );
};

export default LotteryBackground; 