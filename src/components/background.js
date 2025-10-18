"use client";

import { useState, useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { usePathname } from "next/navigation";

function hexToVec4(hex) {
  let hexStr = hex.replace("#", "");
  let r = 0,
    g = 0,
    b = 0,
    a = 1;
  if (hexStr.length === 6) {
    r = parseInt(hexStr.slice(0, 2), 16) / 255;
    g = parseInt(hexStr.slice(2, 4), 16) / 255;
    b = parseInt(hexStr.slice(4, 6), 16) / 255;
  } else if (hexStr.length === 8) {
    r = parseInt(hexStr.slice(0, 2), 16) / 255;
    g = parseInt(hexStr.slice(2, 4), 16) / 255;
    b = parseInt(hexStr.slice(4, 6), 16) / 255;
    a = parseInt(hexStr.slice(6, 8), 16) / 255;
  }
  return [r, g, b, a];
}

function lerpColor(color1, color2, t) {
  return [
    color1[0] + (color2[0] - color1[0]) * t,
    color1[1] + (color2[1] - color1[1]) * t,
    color1[2] + (color2[2] - color1[2]) * t,
    color1[3] + (color2[3] - color1[3]) * t,
  ];
}

const vertexShader = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

const fragmentShader = `
  precision highp float;

  #define PI 3.14159265359

  uniform float iTime;
  uniform vec3 iResolution;
  uniform float uSpinRotation;
  uniform float uSpinSpeed;
  uniform vec2 uOffset;
  uniform vec4 uColor1;
  uniform vec4 uColor2;
  uniform vec4 uColor3;
  uniform float uContrast;
  uniform float uLighting;
  uniform float uSpinAmount;
  uniform float uPixelFilter;
  uniform float uSpinEase;
  uniform bool uIsRotate;
  uniform vec2 uMouse;

  varying vec2 vUv;

  vec4 effect(vec2 screenSize, vec2 screen_coords) {
      float pixel_size = length(screenSize.xy) / uPixelFilter;
      vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * screenSize.xy) / length(screenSize.xy) - uOffset;
      float uv_len = length(uv);
      
      float speed = (uSpinRotation * uSpinEase * 0.2);
      if(uIsRotate){
        speed = iTime * speed;
      }
      speed += 302.2;
      
      float mouseInfluence = (uMouse.x * 2.0 - 1.0);
      speed += mouseInfluence * 0.1;
      
      float new_pixel_angle = atan(uv.y, uv.x) + speed - uSpinEase * 20.0 * (uSpinAmount * uv_len + (1.0 - uSpinAmount));
      vec2 mid = (screenSize.xy / length(screenSize.xy)) / 2.0;
      uv = (vec2(uv_len * cos(new_pixel_angle) + mid.x, uv_len * sin(new_pixel_angle) + mid.y) - mid);
      
      uv *= 30.0;
      float baseSpeed = iTime * uSpinSpeed;
      speed = baseSpeed + mouseInfluence * 2.0;
      
      vec2 uv2 = vec2(uv.x + uv.y);
      
      for(int i = 0; i < 5; i++) {
          uv2 += sin(max(uv.x, uv.y)) + uv;
          uv += 0.5 * vec2(
              cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121),
              sin(uv2.x - 0.113 * speed)
          );
          uv -= cos(uv.x + uv.y) - sin(uv.x * 0.711 - uv.y);
      }
      
      float contrast_mod = (0.25 * uContrast + 0.5 * uSpinAmount + 1.2);
      float paint_res = min(2.0, max(0.0, length(uv) * 0.035 * contrast_mod));
      float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
      float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
      float c3p = 1.0 - min(1.0, c1p + c2p);
      float light = (uLighting - 0.2) * max(c1p * 5.0 - 4.0, 0.0) + uLighting * max(c2p * 5.0 - 4.0, 0.0);
      
      return (0.3 / uContrast) * uColor1 + (1.0 - 0.3 / uContrast) * (uColor1 * c1p + uColor2 * c2p + vec4(c3p * uColor3.rgb, c3p * uColor1.a)) + light;
  }

  void main() {
      vec2 uv = vUv * iResolution.xy;
      gl_FragColor = effect(iResolution.xy, uv);
  }
`;

export default function Background({
  spinRotation = -2.0,
  spinSpeed = 7.0,
  offset = [0.0, 0.0],
  contrast = 3.5,
  lighting = 0.4,
  spinAmount = 0.25,
  pixelFilter = 745.0,
  spinEase = 1.0,
  isRotate = false,
  mouseInteraction = true,
  transitionDuration = 1500,
}) {
  const pathname = usePathname();
  const containerRef = useRef(null);

  const [targetColor1, setTargetColor1] = useState("#DE443B");
  const [targetColor2, setTargetColor2] = useState("#006BB4");
  const [targetColor3, setTargetColor3] = useState("#162325");

  const currentColorsRef = useRef({
    color1: hexToVec4("#DE443B"),
    color2: hexToVec4("#006BB4"),
    color3: hexToVec4("#162325"),
  });

  const transitionRef = useRef({
    startColors: {
      color1: hexToVec4("#DE443B"),
      color2: hexToVec4("#006BB4"),
      color3: hexToVec4("#162325"),
    },
    startTime: null,
    isTransitioning: false,
  });

  useEffect(() => {
    if (pathname === "/") {
      setTargetColor1("#DE443B");
      setTargetColor2("#006BB4");
      setTargetColor3("#162325");
    } else if (pathname === "/shows") {
      setTargetColor1("#396251ff");
      setTargetColor2("#459373");
      setTargetColor3("#459373");
    } else if (pathname === "/merch") {
      setTargetColor1("#595b53ff");
      setTargetColor2("#394f54");
      setTargetColor3("#162325");
    } else if (pathname === "/music") {
      setTargetColor1("#006BB4");
      setTargetColor2("#5a6b77ff");
      setTargetColor3("#162325");
    }
  }, [pathname]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const renderer = new Renderer();
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    let program;

    const onResize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      if (program) {
        program.uniforms.iResolution.value = [
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height,
        ];
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: [
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height,
          ],
        },
        uSpinRotation: { value: spinRotation },
        uSpinSpeed: { value: spinSpeed },
        uOffset: { value: offset },
        uColor1: { value: currentColorsRef.current.color1 },
        uColor2: { value: currentColorsRef.current.color2 },
        uColor3: { value: currentColorsRef.current.color3 },
        uContrast: { value: contrast },
        uLighting: { value: lighting },
        uSpinAmount: { value: spinAmount },
        uPixelFilter: { value: pixelFilter },
        uSpinEase: { value: spinEase },
        uIsRotate: { value: isRotate },
        uMouse: { value: [0.5, 0.5] },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    let animationFrameId;

    const targetVec1 = hexToVec4(targetColor1);
    const targetVec2 = hexToVec4(targetColor2);
    const targetVec3 = hexToVec4(targetColor3);

    const shouldTransition =
      JSON.stringify(targetVec1) !==
        JSON.stringify(currentColorsRef.current.color1) ||
      JSON.stringify(targetVec2) !==
        JSON.stringify(currentColorsRef.current.color2) ||
      JSON.stringify(targetVec3) !==
        JSON.stringify(currentColorsRef.current.color3);

    if (shouldTransition) {
      transitionRef.current = {
        startColors: {
          color1: [...currentColorsRef.current.color1],
          color2: [...currentColorsRef.current.color2],
          color3: [...currentColorsRef.current.color3],
        },
        startTime: performance.now(),
        isTransitioning: true,
      };
    }

    const update = (time) => {
      animationFrameId = requestAnimationFrame(update);
      program.uniforms.iTime.value = time * 0.001;

      if (transitionRef.current.isTransitioning) {
        const elapsed = time - transitionRef.current.startTime;
        const progress = Math.min(elapsed / transitionDuration, 1);

        const eased =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const targetVec1 = hexToVec4(targetColor1);
        const targetVec2 = hexToVec4(targetColor2);
        const targetVec3 = hexToVec4(targetColor3);

        currentColorsRef.current.color1 = lerpColor(
          transitionRef.current.startColors.color1,
          targetVec1,
          eased
        );
        currentColorsRef.current.color2 = lerpColor(
          transitionRef.current.startColors.color2,
          targetVec2,
          eased
        );
        currentColorsRef.current.color3 = lerpColor(
          transitionRef.current.startColors.color3,
          targetVec3,
          eased
        );

        program.uniforms.uColor1.value = currentColorsRef.current.color1;
        program.uniforms.uColor2.value = currentColorsRef.current.color2;
        program.uniforms.uColor3.value = currentColorsRef.current.color3;

        if (progress >= 1) {
          transitionRef.current.isTransitioning = false;
        }
      }

      renderer.render({ scene: mesh });
    };

    animationFrameId = requestAnimationFrame(update);
    container.appendChild(gl.canvas);

    const onMouseMove = (event) => {
      if (!mouseInteraction) {
        return;
      }
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1.0 - (event.clientY - rect.top) / rect.height;
      program.uniforms.uMouse.value = [x, y];
    };

    container.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    spinRotation,
    spinSpeed,
    offset,
    targetColor1,
    targetColor2,
    targetColor3,
    contrast,
    lighting,
    spinAmount,
    pixelFilter,
    spinEase,
    isRotate,
    mouseInteraction,
    transitionDuration,
    containerRef,
  ]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 z-[-1] w-full h-full"
    />
  );
}
