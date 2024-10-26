import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';

const Blob = () => {
  const mesh = useRef();
  const analyser = useRef(null);
  const dataArray = useRef(null);
  const audioRef = useRef(null);

  // Adjust the speed factor for the idle animation only
  const idleSpeedFactor = 0.3; // Lower value slows down the idle animation

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_intensity: { value: 0 },
      u_noiseSpeed: { value: 0.5 }, // Default idle value
      u_distortionSpeed: { value: 0.8 }, // Default idle value
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
        'https://p.scdn.co/mp3-preview/806a36ed9b464a6ff75930eb179f9982524fed3c?cid=b30c1a206f264d549b8da6e1da1bdaf9'
      );
      audio.crossOrigin = 'anonymous';
      await audio.play();

      audioRef.current = audio;

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
    if (mesh.current) {
      // Update Time Uniform with actual elapsed time for responsiveness
      mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();

      if (
        analyser.current &&
        dataArray.current &&
        audioRef.current &&
        !audioRef.current.paused // Check if audio is playing
      ) {
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

        // Set speed factors for active music playback (matching old behavior)
        mesh.current.material.uniforms.u_noiseSpeed.value = 1.0;
        mesh.current.material.uniforms.u_distortionSpeed.value = 1.0;
      } else {
        // Slowed down Idle Animation
        const idleTime = clock.getElapsedTime() * idleSpeedFactor;
        const idleIntensity = 0.3 + 0.2 * Math.sin(idleTime * 0.2);
        mesh.current.material.uniforms.u_intensity.value = MathUtils.lerp(
          mesh.current.material.uniforms.u_intensity.value,
          idleIntensity,
          0.05 // Lower smoothing factor for smoother transitions
        );

        // Set speed factors for idle state
        mesh.current.material.uniforms.u_noiseSpeed.value = 0.5;
        mesh.current.material.uniforms.u_distortionSpeed.value = 0.8;
      }
    }
  });

  return (
    <mesh ref={mesh} scale={1.5} position={[0, 0, 0]}>
      {/* Increased subdivisions for smoother edges */}
      <icosahedronGeometry args={[2, 50]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
};

export default Blob;
