import * as THREE from "three";
import Experience from "./Experience.js";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.setDummy();
      }
    });
  }

  setDummy() {
    this.resources.items.lennaTexture.encoding = THREE.sRGBEncoding;
    console.log(this.resources.items);

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ map: this.resources.items.lennaTexture })
    );
    // this.scene.add(cube);

    const deskTexture = this.resources.items.deskTexture;
    deskTexture.encoding = THREE.sRGBEncoding;
    deskTexture.flipY = false;
    const deskScene = this.resources.items.desk.scene;

    const deskMaterial = new THREE.MeshBasicMaterial({
      map: deskTexture,
    });

    deskScene.traverse((child) => {
      if (child.isMesh) {
        child.material = deskMaterial;
      }
    });

    this.scene.add(deskScene);
  }

  resize() {}

  update() {}

  destroy() {}
}
