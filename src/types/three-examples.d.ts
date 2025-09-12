declare module "three/examples/jsm/loaders/GLTFLoader" {
  import * as THREE from "three";

  export interface GLTF {
    scene: THREE.Object3D;
    scenes: THREE.Object3D[];
    animations: THREE.AnimationClip[];
    parser?: unknown;
    userData?: unknown;
  }

  export class GLTFLoader extends THREE.Loader {
    constructor(manager?: THREE.LoadingManager);
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: Error | string) => void
    ): void;
    parse(
      data: ArrayBuffer | string,
      path: string,
      onLoad: (gltf: GLTF) => void,
      onError?: (event: Error | string) => void
    ): void;
  }

  export default GLTFLoader;
}

// Optional: declare other example modules here if you import them later
declare module "three/examples/jsm/loaders/DRACOLoader" {
  import * as THREE from "three";
  export class DRACOLoader extends THREE.Loader {
    setDecoderPath(path: string): void;
    setDecoderConfig(config: unknown): void;
    dispose(): void;
    decodeDracoFile(
      arrayBuffer: ArrayBuffer,
      callback: (geometry: THREE.BufferGeometry) => void
    ): void;
  }
  export default DRACOLoader;
}

declare module "three/examples/jsm/controls/OrbitControls" {
  import * as THREE from "three";
  export class OrbitControls {
    constructor(object: THREE.Camera, domElement?: HTMLElement);
    enableDamping: boolean;
    dampingFactor: number;
    update(): void;
    dispose(): void;
  }
  export default OrbitControls;
}
