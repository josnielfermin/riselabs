"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const InteractiveRise2 = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let started = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let modelRoot: THREE.Object3D | null = null;
    let matcapTexture: THREE.Texture | null = null;

    // keep references so we can remove listeners properly
    let onPointerMove: ((ev: PointerEvent) => void) | null = null;
    let onResize: (() => void) | null = null;

    const start = () => {
      if (started) return;
      started = true;
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth || 300;
      const height = containerRef.current.clientHeight || 300;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      // Ensure canvas fills container (Tailwind controls container size)
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      // output color space compatibility
      try {
        (renderer as any).outputColorSpace =
          (THREE as any).SRGBColorSpace || undefined;
      } catch (e) {
        // ignore if not available on older versions
      }

      // Attach canvas
      containerRef.current.appendChild(renderer.domElement);

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 2.5);

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambient);
      const dir = new THREE.DirectionalLight(0xffffff, 0.4);
      dir.position.set(5, 10, 7.5);
      scene.add(dir);

      // Root to hold loaded models and allow transformations
      modelRoot = new THREE.Object3D();
      scene.add(modelRoot);

      const loader = new GLTFLoader();
      const texLoader = new THREE.TextureLoader();

      // Use project assets
      const logoPath = "/static/3d/riselabs_logo_low-1piece.glb"; // low-res logo GLB
      const matcapPath = "/static/3d/riselab_matcap_512x512.png"; // matcap image

      // Load matcap first then GLB so we can apply material consistently
      texLoader.load(
        matcapPath,
        (tex) => {
          matcapTexture = tex;
          // avoid direct encoding assignment to satisfy TS across three versions
          (matcapTexture as any).needsUpdate = true;

          loader.load(
            logoPath,
            (gltf) => {
              const obj = gltf.scene || gltf.scenes[0];
              if (!obj) return;

              // Normalize: center and scale to reasonable size
              const box = new THREE.Box3().setFromObject(obj);
              const size = new THREE.Vector3();
              box.getSize(size);
              const maxDim = Math.max(size.x, size.y, size.z) || 1;
              const scale = 1.2 / maxDim; // tune scale to fit camera
              obj.scale.setScalar(scale);

              // Re-center on origin
              const center = new THREE.Vector3();
              box.getCenter(center);
              obj.position.sub(center.multiplyScalar(scale));

              // Apply matcap material to meshes (simple visual)
              obj.traverse((c) => {
                if ((c as THREE.Mesh).isMesh) {
                  const m = c as THREE.Mesh;
                  const mat = new THREE.MeshMatcapMaterial({
                    matcap: matcapTexture as any,
                  });
                  // preserve UVs or normal scale if needed
                  m.material = mat;
                  m.castShadow = true;
                  m.receiveShadow = true;
                }
              });

              obj.position.set(0, -0.05, 0);
              modelRoot?.add(obj);
            },
            undefined,
            (err) => {
              console.warn("InteractiveRise: failed to load GLB", err);
            }
          );
        },
        undefined,
        (err) => {
          console.warn("InteractiveRise: failed to load matcap", err);
          // Still attempt to load GLB without matcap
          loader.load(
            logoPath,
            (gltf) => {
              const obj = gltf.scene || gltf.scenes[0];
              if (!obj) return;
              obj.traverse((c) => {
                if ((c as THREE.Mesh).isMesh) {
                  const m = c as THREE.Mesh;
                  m.castShadow = true;
                  m.receiveShadow = true;
                }
              });
              obj.scale.set(1, 1, 1);
              obj.position.set(0, -0.05, 0);
              modelRoot?.add(obj);
            },
            undefined,
            (e) => console.warn(e)
          );
        }
      );

      // Interaction state
      const state = {
        targetYaw: 0,
        targetPitch: 0,
        // removed horizontal translation state to keep rotation on Y axis only
        yaw: 0,
        pitch: 0,
      };

      // Limits
      // allow almost 90deg so user can see full sides
      const maxYaw = Math.PI / 2 - 0.05;
      const maxPitch = Math.PI / 12; // slight up/down

      // pointer handling attached to container for scoped interaction
      onPointerMove = (ev: PointerEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (ev.clientX - rect.left) / rect.width; // 0..1
        const y = (ev.clientY - rect.top) / rect.height; // 0..1
        const nx = Math.max(-1, Math.min(1, (x - 0.5) * 2)); // -1..1
        const ny = Math.max(-1, Math.min(1, (y - 0.5) * 2)); // -1..1

        // map pointer to yaw/pitch: center = front (0); left -> rotate left, right -> rotate right
        state.targetYaw = nx * maxYaw;
        state.targetPitch = -ny * maxPitch;
      };

      containerRef.current.addEventListener("pointermove", onPointerMove);

      onResize = () => {
        if (!containerRef.current || !renderer || !camera) return;
        const w = containerRef.current.clientWidth || 300;
        const h = containerRef.current.clientHeight || 300;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };

      window.addEventListener("resize", onResize);

      // animation
      const animate = () => {
        if (!renderer || !scene || !camera || !modelRoot) {
          rafRef.current = requestAnimationFrame(animate);
          return;
        }

        // eased interpolation
        const ease = 0.12;
        state.yaw += (state.targetYaw - state.yaw) * ease;
        state.pitch += (state.targetPitch - state.pitch) * ease;

        // clamp pitch so model never flips
        state.pitch = Math.max(-maxPitch, Math.min(maxPitch, state.pitch));

        modelRoot.rotation.y = state.yaw;
        modelRoot.rotation.x = state.pitch;
        // no horizontal translation; rotation occurs around model's own Y axis

        renderer.render(scene, camera);
        rafRef.current = requestAnimationFrame(animate);
      };

      rafRef.current = requestAnimationFrame(animate);
    };

    const tryStart = () => {
      if (document.readyState === "complete") {
        start();
      } else {
        window.addEventListener("load", start, { once: true });
      }
    };

    tryStart();

    return () => {
      // cleanup
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      if (containerRef.current) {
        const canvas = containerRef.current.querySelector("canvas");
        if (canvas) canvas.remove();
        if (onPointerMove)
          containerRef.current.removeEventListener(
            "pointermove",
            onPointerMove
          );
      }

      if (onResize) window.removeEventListener("resize", onResize);

      if (renderer) {
        try {
          renderer.dispose();
          // attempt to release GL context
          const gl = (renderer as any).getContext?.();
          if (gl) {
            const loseContext = (gl as any).getExtension?.(
              "WEBGL_lose_context"
            );
            loseContext?.loseContext?.();
          }
        } catch (e) {
          // ignore
        }
      }

      if (matcapTexture) {
        matcapTexture.dispose();
      }

      started = false;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      // keep same responsive coordinates as existing Rise3D image but increase size to avoid clipping
      className="cursor-pointer relative w-[clamp(10rem,_-0.125rem_+_20.927vw,_26.188rem)] h-[clamp(10rem,_-0.125rem_+_20.927vw,_26.188rem)] md:absolute 2xl:right-[20%] md:right-0 md:top-1/2 md:-translate-y-1/2 2xl:bottom-0 2xl:-translate-y-24 max-md:mx-auto"
      aria-hidden={true}
    />
  );
};

export default InteractiveRise2;
