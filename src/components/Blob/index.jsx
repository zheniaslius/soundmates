import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import vertexShader from './vertexShader';
import fragmentShader from './fragmentShader';
import useAudioStore from '@store/audioStore';

const Blob = () => {
  const mesh = useRef();
  const analyser = useRef(null);
  const dataArray = useRef(null);
  const audioRef = useRef(null);
  const { audioUrl } = useAudioStore();

  const idleSpeedFactor = 0.3;

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_intensity: { value: 0 },
      u_noiseSpeed: { value: 0.5 },
      u_distortionSpeed: { value: 0.8 },
    }),
    []
  );

  useEffect(() => {
    let audioContext;
    let audio;

    const startAudio = async () => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();

      audio = new Audio(audioUrl);
      audio.crossOrigin = 'anonymous';
      await audio.play();

      audioRef.current = audio;

      const source = audioContext.createMediaElementSource(audio);

      analyser.current = audioContext.createAnalyser();
      analyser.current.fftSize = 256;
      const bufferLength = analyser.current.frequencyBinCount;
      dataArray.current = new Uint8Array(bufferLength);

      source.connect(analyser.current);
      analyser.current.connect(audioContext.destination);
    };

    startAudio();

    return () => {
      if (audio) {
        audio.pause();
        audio = null;
      }
      if (audioContext) {
        audioContext.close();
        audioContext = null;
      }
    };
  }, [audioUrl]);

  useFrame((state, delta) => {
    const { clock } = state;
    if (mesh.current) {
      const elapsedTime = clock.getElapsedTime();

      mesh.current.material.uniforms.u_time.value = elapsedTime;

      let targetNoiseSpeed, targetDistortionSpeed;

      if (analyser.current && dataArray.current && audioRef.current && !audioRef.current.paused) {
        targetNoiseSpeed = 1.0;
        targetDistortionSpeed = 1.0;

        analyser.current.getByteFrequencyData(dataArray.current);

        const avgFrequency =
          dataArray.current.reduce((sum, value) => sum + value, 0) / dataArray.current.length;

        const intensity = MathUtils.clamp(avgFrequency / 128, 0, 1);

        mesh.current.material.uniforms.u_intensity.value = MathUtils.lerp(
          mesh.current.material.uniforms.u_intensity.value,
          intensity,
          0.1
        );
      } else {
        targetNoiseSpeed = 0.5;
        targetDistortionSpeed = 0.8;

        const idleTime = elapsedTime * idleSpeedFactor;
        const idleIntensity = 0.3 + 0.2 * Math.sin(idleTime * 0.2);

        mesh.current.material.uniforms.u_intensity.value = MathUtils.lerp(
          mesh.current.material.uniforms.u_intensity.value,
          idleIntensity,
          0.05
        );
      }

      const smoothingFactor = 0.1;

      mesh.current.material.uniforms.u_noiseSpeed.value = MathUtils.lerp(
        mesh.current.material.uniforms.u_noiseSpeed.value,
        targetNoiseSpeed,
        smoothingFactor
      );

      mesh.current.material.uniforms.u_distortionSpeed.value = MathUtils.lerp(
        mesh.current.material.uniforms.u_distortionSpeed.value,
        targetDistortionSpeed,
        smoothingFactor
      );
    }
  });

  return (
    <mesh ref={mesh} scale={1.5} position={[0, 0, 0]}>
      <icosahedronGeometry args={[2, 50]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
};

export default Blob;
