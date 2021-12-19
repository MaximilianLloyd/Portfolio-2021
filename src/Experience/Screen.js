// The class responsible for rendering the screen to a MeshBasicMaterial by using the texture from the renderTarget.
import * as THREE from "three";
import Experience from "./Experience";

export class Screen {
  constructor() {
    this.scene = new THREE.Scene();
    this.experience = new Experience();
    this.time = this.experience.time;
    // 1024×576
    const width = 1920;
    const height = 1080;
    this.canvas = document.querySelector(".hidden-canvas");

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 150);
    this.camera.rotation.reorder("YXZ");
    this.camera.position.set(0, 0, 2.5);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      width,
      height,
      canvas: this.canvas,
    });
    this.renderer.setPixelRatio(1);

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 1.0, 1),
      new THREE.MeshBasicMaterial({
        color: 0x00ff00,
      })
    );

    this.cube.position.set(0, 0, 0);

    this.scene.add(this.cube);

    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer.setClearColor(new THREE.Color("#333333"));

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.encoding = THREE.sRGBEncoding;
  }

  update() {
    // this.camera.lookAt(this.cube);
    this.cube.rotation.y = this.time.elapsed * 0.001;
    this.renderer.render(this.scene, this.camera);
    this.texture.needsUpdate = true;
  }
}
