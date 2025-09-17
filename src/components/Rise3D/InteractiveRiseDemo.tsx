"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const InteractiveRise = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let started = false;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let modelRoot: THREE.Object3D | null = null;
    let matcapTexture: THREE.Texture | null = null;

    // pivot for cubo1 so we can translate it independently on Z
    let cube1Pivot: THREE.Object3D | null = null;
    let cube1BaseZ = 0;
    // pivot for cubo2 (mirrors cube1) so we can translate it independently on Z
    let cube2Pivot: THREE.Object3D | null = null;
    let cube2BaseZ = 0;
    // pivot for cubo3 (same direction as cube1)
    let cube3Pivot: THREE.Object3D | null = null;
    let cube3BaseZ = 0;
    // pivot for cubo4 (mirrors cube2)
    let cube4Pivot: THREE.Object3D | null = null;
    let cube4BaseZ = 0;
    // pivot for cubo5 (same direction as cube1)
    let cube5Pivot: THREE.Object3D | null = null;
    let cube5BaseZ = 0;
    // pivot for cubo6 (mirrors cube2)
    let cube6Pivot: THREE.Object3D | null = null;
    let cube6BaseZ = 0;
    // pivot for cubo7 (same direction as cube1)
    let cube7Pivot: THREE.Object3D | null = null;
    let cube7BaseZ = 0;

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
      const logoPath = "/static/3d/riselabs_logo_low-01.glb"; // low-res logo GLB
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

              const meshes: THREE.Mesh[] = [];
              obj.traverse((c) => {
                if ((c as THREE.Mesh).isMesh) {
                  const m = c as THREE.Mesh;
                  meshes.push(m);
                  console.log("mesh:", m.name || "(no-name)", m); // inspección
                }
              });

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

              // --- Setup pivot for the mesh named "cubo1" so it can translate on Z independently
              // find the mesh by name (case-insensitive)
              const cube1 =
                (modelRoot?.getObjectByName("cube1") as
                  | THREE.Mesh
                  | undefined) ||
                (modelRoot?.getObjectByName("CUBE1") as THREE.Mesh | undefined);
              if (cube1) {
                // Ensure world matrices are up-to-date so world-space queries are correct
                modelRoot?.updateMatrixWorld(true);
                cube1.updateWorldMatrix(true, false);

                // Use the mesh's world position (its origin) to place the pivot so the
                // visual location does not change after re-parenting. This keeps cube1
                // exactly where it would be without the pivot.
                const worldPos = new THREE.Vector3();
                cube1.getWorldPosition(worldPos);

                const pivot = new THREE.Object3D();
                const parent = cube1.parent || modelRoot!;
                // convert world position into the parent's local space and set pivot there
                parent.worldToLocal(worldPos);
                pivot.position.copy(worldPos);
                // NOTE: keep the same manual offsets previously applied to cube1
                // if you need to fine-tune the visual placement of cube1, adjust
                // these two values (x/y) here.
                pivot.position.x += -0.75;
                pivot.position.y += -0.88;
                parent.add(pivot);

                // move mesh into pivot preserving visual position
                parent.remove(cube1);
                const meshWorldPos = new THREE.Vector3();
                cube1.getWorldPosition(meshWorldPos);
                const pivotWorldPos = pivot.getWorldPosition(
                  new THREE.Vector3()
                );
                cube1.position.copy(meshWorldPos).sub(pivotWorldPos);
                pivot.add(cube1);

                cube1Pivot = pivot;
                cube1BaseZ = pivot.position.z;
                // --- Create cube2 pivot with same approach (if present)
                const cube2 =
                  (modelRoot?.getObjectByName("cube2") as
                    | THREE.Mesh
                    | undefined) ||
                  (modelRoot?.getObjectByName("CUBE2") as
                    | THREE.Mesh
                    | undefined);
                if (cube2) {
                  // place pivot at cube2 world position and reparent
                  modelRoot?.updateMatrixWorld(true);
                  cube2.updateWorldMatrix(true, false);
                  const worldPos2 = new THREE.Vector3();
                  cube2.getWorldPosition(worldPos2);
                  const pivot2 = new THREE.Object3D();
                  const parent2 = cube2.parent || modelRoot!;
                  parent2.worldToLocal(worldPos2);
                  pivot2.position.copy(worldPos2);
                  // apply same manual offsets so cube2 lines up similarly (tweak if needed)
                  pivot2.position.x += -0.26;
                  pivot2.position.y += -0.88;
                  parent2.add(pivot2);
                  parent2.remove(cube2);
                  const meshWorldPos2 = new THREE.Vector3();
                  cube2.getWorldPosition(meshWorldPos2);
                  const pivotWorldPos2 = pivot2.getWorldPosition(
                    new THREE.Vector3()
                  );
                  cube2.position.copy(meshWorldPos2).sub(pivotWorldPos2);
                  pivot2.add(cube2);
                  cube2Pivot = pivot2;
                  cube2BaseZ = pivot2.position.z;
                }
                // --- Create cube3 pivot with same approach as cube1 (if present)
                const cube3 =
                  (modelRoot?.getObjectByName("cube3") as
                    | THREE.Mesh
                    | undefined) ||
                  (modelRoot?.getObjectByName("CUBE3") as
                    | THREE.Mesh
                    | undefined);
                if (cube3) {
                  modelRoot?.updateMatrixWorld(true);
                  cube3.updateWorldMatrix(true, false);
                  const worldPos3 = new THREE.Vector3();
                  cube3.getWorldPosition(worldPos3);
                  const pivot3 = new THREE.Object3D();
                  const parent3 = cube3.parent || modelRoot!;
                  parent3.worldToLocal(worldPos3);
                  pivot3.position.copy(worldPos3);
                  // match cube1 visual placement offsets — tweak if needed
                  pivot3.position.x += 0.26;
                  pivot3.position.y += -0.88;
                  parent3.add(pivot3);
                  parent3.remove(cube3);
                  const meshWorldPos3 = new THREE.Vector3();
                  cube3.getWorldPosition(meshWorldPos3);
                  const pivotWorldPos3 = pivot3.getWorldPosition(
                    new THREE.Vector3()
                  );
                  cube3.position.copy(meshWorldPos3).sub(pivotWorldPos3);
                  pivot3.add(cube3);
                  cube3Pivot = pivot3;
                  cube3BaseZ = pivot3.position.z;
                }
                // --- Create cube4 pivot with same approach as cube2 (if present)
                const cube4 =
                  (modelRoot?.getObjectByName("cube4") as
                    | THREE.Mesh
                    | undefined) ||
                  (modelRoot?.getObjectByName("CUBE4") as
                    | THREE.Mesh
                    | undefined);
                if (cube4) {
                  modelRoot?.updateMatrixWorld(true);
                  cube4.updateWorldMatrix(true, false);
                  const worldPos4 = new THREE.Vector3();
                  cube4.getWorldPosition(worldPos4);
                  const pivot4 = new THREE.Object3D();
                  const parent4 = cube4.parent || modelRoot!;
                  parent4.worldToLocal(worldPos4);
                  pivot4.position.copy(worldPos4);
                  // apply similar manual offsets as cube2 (tweak if necessary)
                  pivot4.position.x += 0.76;
                  pivot4.position.y += -0.88;
                  parent4.add(pivot4);
                  parent4.remove(cube4);
                  const meshWorldPos4 = new THREE.Vector3();
                  cube4.getWorldPosition(meshWorldPos4);
                  const pivotWorldPos4 = pivot4.getWorldPosition(
                    new THREE.Vector3()
                  );
                  cube4.position.copy(meshWorldPos4).sub(pivotWorldPos4);
                  pivot4.add(cube4);
                  cube4Pivot = pivot4;
                  cube4BaseZ = pivot4.position.z;
                }
                // --- Create cube5 pivot with same approach as cube1 (if present)
                const cube5 =
                  (modelRoot?.getObjectByName("cube5") as
                    | THREE.Mesh
                    | undefined) ||
                  (modelRoot?.getObjectByName("CUBE5") as
                    | THREE.Mesh
                    | undefined);
                if (cube5) {
                  modelRoot?.updateMatrixWorld(true);
                  cube5.updateWorldMatrix(true, false);
                  const worldPos5 = new THREE.Vector3();
                  cube5.getWorldPosition(worldPos5);
                  const pivot5 = new THREE.Object3D();
                  const parent5 = cube5.parent || modelRoot!;
                  parent5.worldToLocal(worldPos5);
                  pivot5.position.copy(worldPos5);
                  // match cube1 visual placement offsets — tweak if needed
                  pivot5.position.x += 0.76;
                  pivot5.position.y += -0.38;
                  parent5.add(pivot5);
                  parent5.remove(cube5);
                  const meshWorldPos5 = new THREE.Vector3();
                  cube5.getWorldPosition(meshWorldPos5);
                  const pivotWorldPos5 = pivot5.getWorldPosition(
                    new THREE.Vector3()
                  );
                  cube5.position.copy(meshWorldPos5).sub(pivotWorldPos5);
                  pivot5.add(cube5);
                  cube5Pivot = pivot5;
                  cube5BaseZ = pivot5.position.z;
                }
                // --- Create cube6 pivot with same approach as cube2 (if present)
                const cube6 =
                  (modelRoot?.getObjectByName("cube6") as
                    | THREE.Mesh
                    | undefined) ||
                  (modelRoot?.getObjectByName("CUBE6") as
                    | THREE.Mesh
                    | undefined);
                if (cube6) {
                  modelRoot?.updateMatrixWorld(true);
                  cube6.updateWorldMatrix(true, false);
                  const worldPos6 = new THREE.Vector3();
                  cube6.getWorldPosition(worldPos6);
                  const pivot6 = new THREE.Object3D();
                  const parent6 = cube6.parent || modelRoot!;
                  parent6.worldToLocal(worldPos6);
                  pivot6.position.copy(worldPos6);
                  // apply offsets similar to cube2/cube4 — tweak if necessary
                  pivot6.position.x += 0.76;
                  pivot6.position.y += 0.13;
                  parent6.add(pivot6);
                  parent6.remove(cube6);
                  const meshWorldPos6 = new THREE.Vector3();
                  cube6.getWorldPosition(meshWorldPos6);
                  const pivotWorldPos6 = pivot6.getWorldPosition(
                    new THREE.Vector3()
                  );
                  cube6.position.copy(meshWorldPos6).sub(pivotWorldPos6);
                  pivot6.add(cube6);
                  cube6Pivot = pivot6;
                  cube6BaseZ = pivot6.position.z;
                }
                // --- Create cube7 pivot with same approach as cube1 (if present)
                const cube7 =
                  (modelRoot?.getObjectByName("cube7") as
                    | THREE.Mesh
                    | undefined) ||
                  (modelRoot?.getObjectByName("CUBE7") as
                    | THREE.Mesh
                    | undefined);
                if (cube7) {
                  modelRoot?.updateMatrixWorld(true);
                  cube7.updateWorldMatrix(true, false);
                  const worldPos7 = new THREE.Vector3();
                  cube7.getWorldPosition(worldPos7);
                  const pivot7 = new THREE.Object3D();
                  const parent7 = cube7.parent || modelRoot!;
                  parent7.worldToLocal(worldPos7);
                  pivot7.position.copy(worldPos7);
                  // match cube1 visual placement offsets — tweak if needed
                  pivot7.position.x += 0.76;
                  pivot7.position.y += 0.63;
                  parent7.add(pivot7);
                  parent7.remove(cube7);
                  const meshWorldPos7 = new THREE.Vector3();
                  cube7.getWorldPosition(meshWorldPos7);
                  const pivotWorldPos7 = pivot7.getWorldPosition(
                    new THREE.Vector3()
                  );
                  cube7.position.copy(meshWorldPos7).sub(pivotWorldPos7);
                  pivot7.add(cube7);
                  cube7Pivot = pivot7;
                  cube7BaseZ = pivot7.position.z;
                }
              } else {
                console.warn("InteractiveRise: cubo1 not found in GLB scene");
              }
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
        // target/actual offset for cubo1 along Z
        targetOffsetZ: 0,
        offsetZ: 0,
        // target/actual offset for cubo2 along Z (inverted direction)
        targetOffsetZ2: 0,
        offsetZ2: 0,
        // target/actual offset for cubo3 along Z (same direction as cube1)
        targetOffsetZ3: 0,
        offsetZ3: 0,
        // target/actual offset for cubo4 along Z (inverted like cube2)
        targetOffsetZ4: 0,
        offsetZ4: 0,
        // target/actual offset for cubo5 along Z (same direction as cube1)
        targetOffsetZ5: 0,
        offsetZ5: 0,
        // target/actual offset for cubo6 along Z (inverted like cube2)
        targetOffsetZ6: 0,
        offsetZ6: 0,
        // target/actual offset for cubo7 along Z (same direction as cube1)
        targetOffsetZ7: 0,
        offsetZ7: 0,
        // removed horizontal translation state to keep rotation on Y axis only
        yaw: 0,
        pitch: 0,
      };

      // Limits
      // allow almost 90deg so user can see full sides
      const maxYaw = Math.PI / 2 - 0.05;
      const maxPitch = Math.PI / 12; // slight up/down
      // Per-cube max Z offsets (world units). Edit these values to tune each cube
      // independently. Add cube3..cube8 when needed.
      // Example: cube1 has larger travel range than cube2.
      const maxOffsetZs: Record<string, number> = {
        cube1: 0.9,
        cube2: 0.25,
        cube3: 0.55,
        cube4: 0.8,
        cube5: 0.4,
        cube6: 0.75,
        cube7: 0.8,
      };

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
        // map nx to cubo1 forward/back: left (nx < 0) -> move "forward" (negative z), right -> move back
        state.targetOffsetZ = nx * maxOffsetZs.cube1;
        // cube2 moves in the opposite direction of cube1 (invert nx)
        state.targetOffsetZ2 = -nx * maxOffsetZs.cube2;
        // cube3 moves in the same direction as cube1
        state.targetOffsetZ3 = nx * (maxOffsetZs.cube3 ?? maxOffsetZs.cube1);
        // cube4 moves like cube2 (inverted relative to cube1)
        state.targetOffsetZ4 = -nx * (maxOffsetZs.cube4 ?? maxOffsetZs.cube2);
        // cube5 moves in the same direction as cube1
        state.targetOffsetZ5 = nx * (maxOffsetZs.cube5 ?? maxOffsetZs.cube1);
        // cube6 moves like cube2 (inverted)
        state.targetOffsetZ6 = -nx * (maxOffsetZs.cube6 ?? maxOffsetZs.cube2);
        // cube7 moves in the same direction as cube1
        state.targetOffsetZ7 = nx * (maxOffsetZs.cube7 ?? maxOffsetZs.cube1);
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
        // interpolate cubo1 offset
        state.offsetZ += (state.targetOffsetZ - state.offsetZ) * ease;
        // interpolate cubo2 offset (separate smoothing)
        state.offsetZ2 += (state.targetOffsetZ2 - state.offsetZ2) * ease;
        // interpolate cubo3 offset
        state.offsetZ3 += (state.targetOffsetZ3 - state.offsetZ3) * ease;
        // interpolate cubo4 offset
        state.offsetZ4 += (state.targetOffsetZ4 - state.offsetZ4) * ease;
        // interpolate cubo5 offset
        state.offsetZ5 += (state.targetOffsetZ5 - state.offsetZ5) * ease;
        // interpolate cubo6 offset
        state.offsetZ6 += (state.targetOffsetZ6 - state.offsetZ6) * ease;
        // interpolate cubo7 offset
        state.offsetZ7 += (state.targetOffsetZ7 - state.offsetZ7) * ease;

        // clamp pitch so model never flips
        state.pitch = Math.max(-maxPitch, Math.min(maxPitch, state.pitch));

        modelRoot.rotation.y = state.yaw;
        modelRoot.rotation.x = state.pitch;
        // no horizontal translation; rotation occurs around model's own Y axis

        // apply cubo1 pivot translation if present
        if (cube1Pivot) {
          // pivot's base z + offset (offset is relative in modelRoot coordinates)
          cube1Pivot.position.z = cube1BaseZ + state.offsetZ;
        }
        // apply cubo2 pivot translation if present (moves opposite direction)
        if (cube2Pivot) {
          cube2Pivot.position.z = cube2BaseZ + state.offsetZ2;
        }
        // apply cubo3 pivot translation if present (same direction as cube1)
        if (cube3Pivot) {
          cube3Pivot.position.z = cube3BaseZ + state.offsetZ3;
        }
        // apply cubo4 pivot translation if present (mirrors cube2)
        if (cube4Pivot) {
          cube4Pivot.position.z = cube4BaseZ + state.offsetZ4;
        }
        // apply cubo5 pivot translation if present (same direction as cube1)
        if (cube5Pivot) {
          cube5Pivot.position.z = cube5BaseZ + state.offsetZ5;
        }
        // apply cubo6 pivot translation if present (mirrors cube2)
        if (cube6Pivot) {
          cube6Pivot.position.z = cube6BaseZ + state.offsetZ6;
        }
        // apply cubo7 pivot translation if present (same direction as cube1)
        if (cube7Pivot) {
          cube7Pivot.position.z = cube7BaseZ + state.offsetZ7;
        }

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
      className="cursor-pointer relative w-[clamp(15.625rem,_5.208rem_+_21.701vw,_31.25rem)] h-[clamp(15.625rem,_5.208rem_+_21.701vw,_31.25rem)] md:absolute 2xl:right-[15%] md:right-0 md:top-1/2 md:-translate-y-1/2 2xl:bottom-0 2xl:-translate-y-52 max-md:mx-auto"
      aria-hidden={true}
    />
  );
};

export default InteractiveRise;
