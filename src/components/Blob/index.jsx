import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';

const Blob = () => {
  const mesh = useRef();
  const analyser = useRef(null);
  const dataArray = useRef(null);
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_intensity: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    let audioContext;
    let audio;

    const startAudio = async () => {
      // Create Audio Context
      audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Load Audio
      audio = new Audio(
        'https://p.scdn.co/mp3-preview/a751607799d4f2ef275d9f45159a5186acdea513?cid=b30c1a206f264d549b8da6e1da1bdaf9'
      );
      audio.crossOrigin = 'anonymous';
      await audio.play();

      // Create Media Element Source
      const source = audioContext.createMediaElementSource(audio);

      // Create Analyser Node
      analyser.current = audioContext.createAnalyser();
      analyser.current.fftSize = 256;
      const bufferLength = analyser.current.frequencyBinCount;
      dataArray.current = new Uint8Array(bufferLength);

      // Connect Nodes
      source.connect(analyser.current);
      analyser.current.connect(audioContext.destination);

      // Remove Event Listener
      window.removeEventListener('click', startAudio);
    };

    // Start Audio on User Interaction
    window.addEventListener('click', startAudio);

    // Cleanup Function
    return () => {
      if (audio) {
        audio.pause();
        audio = null;
      }
      if (audioContext) {
        audioContext.close();
        audioContext = null;
      }
      window.removeEventListener('click', startAudio);
    };
  }, []);

  useFrame((state) => {
    const { clock } = state;
    if (mesh.current && analyser.current && dataArray.current) {
      analyser.current.getByteFrequencyData(dataArray.current);

      // Calculate Average Frequency
      const avgFrequency =
        dataArray.current.reduce((sum, value) => sum + value, 0) / dataArray.current.length;

      // Normalize Intensity
      const intensity = MathUtils.clamp(avgFrequency / 128, 0, 1);

      // Smooth the intensity changes
      mesh.current.material.uniforms.u_intensity.value = MathUtils.lerp(
        mesh.current.material.uniforms.u_intensity.value,
        intensity,
        0.1 // Adjust smoothing factor as needed
      );

      // Update Time Uniform
      mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={mesh} scale={1.5} position={[0, 0, 0]}>
      <icosahedronGeometry args={[2, 20]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
};

export default Blob;
