"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { usePathname } from "next/navigation";

function hexToVec4(hex) {
  const hexStr = hex.replace("#", "");
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

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
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

const COLOR_SCHEMES = {
  "/": {
    color1: "#DE443B",
    color2: "#006BB4",
    color3: "#162325",
  },
  "/shows": {
    color1: "#396251ff",
    color2: "#459373",
    color3: "#459373",
  },
  "/merch": {
    color1: "#595b53ff",
    color2: "#394f54",
    color3: "#162325",
  },
  "/music": {
    color1: "#006BB4",
    color2: "#5a6b77ff",
    color3: "#162325",
  },
};

const DEFAULT_COLORS = COLOR_SCHEMES["/"];

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

  const rendererRef = useRef(null);
  const programRef = useRef(null);
  const meshRef = useRef(null);
  const glRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [targetColors, setTargetColors] = useState(() => {
    const scheme = COLOR_SCHEMES[pathname] || DEFAULT_COLORS;
    return {
      color1: scheme.color1,
      color2: scheme.color2,
      color3: scheme.color3,
    };
  });

  const currentColorsRef = useRef({
    color1: hexToVec4(DEFAULT_COLORS.color1),
    color2: hexToVec4(DEFAULT_COLORS.color2),
    color3: hexToVec4(DEFAULT_COLORS.color3),
  });

  const transitionRef = useRef({
    startColors: {
      color1: hexToVec4(DEFAULT_COLORS.color1),
      color2: hexToVec4(DEFAULT_COLORS.color2),
      color3: hexToVec4(DEFAULT_COLORS.color3),
    },
    startTime: null,
    isTransitioning: false,
  });

  const propsRef = useRef({
    spinRotation,
    spinSpeed,
    offset,
    contrast,
    lighting,
    spinAmount,
    pixelFilter,
    spinEase,
    isRotate,
    mouseInteraction,
    transitionDuration,
  });

  useEffect(() => {
    propsRef.current = {
      spinRotation,
      spinSpeed,
      offset,
      contrast,
      lighting,
      spinAmount,
      pixelFilter,
      spinEase,
      isRotate,
      mouseInteraction,
      transitionDuration,
    };
  }, [
    spinRotation,
    spinSpeed,
    offset,
    contrast,
    lighting,
    spinAmount,
    pixelFilter,
    spinEase,
    isRotate,
    mouseInteraction,
    transitionDuration,
  ]);

  useEffect(() => {
    const scheme = COLOR_SCHEMES[pathname] || DEFAULT_COLORS;
    setTargetColors({
      color1: scheme.color1,
      color2: scheme.color2,
      color3: scheme.color3,
    });
  }, [pathname]);

  const targetColorsRef = useRef(targetColors);
  useEffect(() => {
    targetColorsRef.current = targetColors;
  }, [targetColors]);

  useEffect(() => {
    const targetVec1 = hexToVec4(targetColors.color1);
    const targetVec2 = hexToVec4(targetColors.color2);
    const targetVec3 = hexToVec4(targetColors.color3);

    const shouldTransition =
      !arraysEqual(targetVec1, currentColorsRef.current.color1) ||
      !arraysEqual(targetVec2, currentColorsRef.current.color2) ||
      !arraysEqual(targetVec3, currentColorsRef.current.color3);

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
  }, [targetColors]);

  const onMouseMove = useCallback((event) => {
    if (!propsRef.current.mouseInteraction || !programRef.current) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1.0 - (event.clientY - rect.top) / rect.height;
    programRef.current.uniforms.uMouse.value = [x, y];
  }, []);

  const onResize = useCallback(() => {
    const container = containerRef.current;
    const renderer = rendererRef.current;
    const program = programRef.current;
    const gl = glRef.current;

    if (!container || !renderer || !gl) {
      return;
    }

    renderer.setSize(container.offsetWidth, container.offsetHeight);

    if (program) {
      program.uniforms.iResolution.value = [
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height,
      ];
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;

    const renderer = new Renderer();
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    rendererRef.current = renderer;
    glRef.current = gl;

    renderer.setSize(container.offsetWidth, container.offsetHeight);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
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
        uSpinRotation: { value: propsRef.current.spinRotation },
        uSpinSpeed: { value: propsRef.current.spinSpeed },
        uOffset: { value: propsRef.current.offset },
        uColor1: { value: currentColorsRef.current.color1 },
        uColor2: { value: currentColorsRef.current.color2 },
        uColor3: { value: currentColorsRef.current.color3 },
        uContrast: { value: propsRef.current.contrast },
        uLighting: { value: propsRef.current.lighting },
        uSpinAmount: { value: propsRef.current.spinAmount },
        uPixelFilter: { value: propsRef.current.pixelFilter },
        uSpinEase: { value: propsRef.current.spinEase },
        uIsRotate: { value: propsRef.current.isRotate },
        uMouse: { value: [0.5, 0.5] },
      },
    });

    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    container.appendChild(gl.canvas);

    const update = (time) => {
      animationFrameRef.current = requestAnimationFrame(update);

      const props = propsRef.current;
      const program = programRef.current;

      if (!program) {
        return;
      }

      program.uniforms.iTime.value = time * 0.001;

      program.uniforms.uSpinRotation.value = props.spinRotation;
      program.uniforms.uSpinSpeed.value = props.spinSpeed;
      program.uniforms.uOffset.value = props.offset;
      program.uniforms.uContrast.value = props.contrast;
      program.uniforms.uLighting.value = props.lighting;
      program.uniforms.uSpinAmount.value = props.spinAmount;
      program.uniforms.uPixelFilter.value = props.pixelFilter;
      program.uniforms.uSpinEase.value = props.spinEase;
      program.uniforms.uIsRotate.value = props.isRotate;

      if (transitionRef.current.isTransitioning) {
        const elapsed = time - transitionRef.current.startTime;
        const progress = Math.min(elapsed / props.transitionDuration, 1);

        const eased =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const targets = targetColorsRef.current;
        const targetVec1 = hexToVec4(targets.color1);
        const targetVec2 = hexToVec4(targets.color2);
        const targetVec3 = hexToVec4(targets.color3);

        currentColorsRef.current.color1 = lerpColor(
          transitionRef.current.startColors.color1,
          targetVec1,
          eased,
        );
        currentColorsRef.current.color2 = lerpColor(
          transitionRef.current.startColors.color2,
          targetVec2,
          eased,
        );
        currentColorsRef.current.color3 = lerpColor(
          transitionRef.current.startColors.color3,
          targetVec3,
          eased,
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

    animationFrameRef.current = requestAnimationFrame(update);

    window.addEventListener("resize", onResize);
    container.addEventListener("mousemove", onMouseMove);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onMouseMove);

      if (gl.canvas && container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }

      gl.getExtension("WEBGL_lose_context")?.loseContext();

      rendererRef.current = null;
      programRef.current = null;
      meshRef.current = null;
      glRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 z-[-1] w-full h-full"
    />
  );
}
