import * as THREE from "three";
import anime from "animejs/lib/anime.es.js";

import Experience from "./Experience.js";

import screenVertexShader from "./Shaders/screen/vertex.glsl";
import screenFragmentShader from "./Shaders/screen/fragment.glsl";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.scrollPercent = 0;

    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.initializeAnimations();
        this.initializeScroll();
        this.initializeMaterials();
        this.setScene();
      }
    });
  }

  initializeAnimations() {
    anime({
      targets: ".intro",
      easing: "linear",
      opacity: 0,
      duration: 1500,
      loop: true,
      direction: "alternate",
    });
  }

  initializeScroll() {
    const scrollContainer = document.querySelector("#scroll-container");
    const scrollElement = document.querySelector(".scroll");

    const height = scrollElement.clientHeight - scrollContainer.clientHeight;

    if (this.experience.camera) {
      const initialCameraZ = this.experience.camera.instance.position.z;

      scrollContainer.addEventListener("scroll", () => {
        this.scrollPercent = scrollContainer.scrollTop / height;
        const newZ = initialCameraZ + -this.scrollPercent * 1.3;
        this.experience.camera.modes.default.instance.position.z = newZ;
      });
    }
  }

  // todo: create helper function for applying sRGBEncoding to textures
  initializeMaterials() {
    const deskTexture = this.resources.items.deskTexture;
    deskTexture.encoding = THREE.sRGBEncoding;
    deskTexture.flipY = false;

    this.deskScene = this.resources.items.desk.scene;
    this.deskMaterial = new THREE.MeshBasicMaterial({
      map: deskTexture,
    });

    this.screenMaterial = new THREE.ShaderMaterial({
      vertexShader: screenVertexShader,
      fragmentShader: screenFragmentShader,
      uniforms: {
        uTime: {
          value: 0,
        },
        uBrightness: {
          value: 0,
        },
      },
    });

    console.log(this.resources.items.elliotTexture);
    const elliotTexture = this.resources.items.elliotTexture;
    elliotTexture.encoding = THREE.sRGBEncoding;
    // elliotTexture.flipY = false;

    this.elliotPictureMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: elliotTexture,
    });
  }

  setScene() {
    this.keys = [];
    this.keyTimelines = {};

    this.deskScene.traverse((child) => {
      if (child.isMesh) {
        child.material = this.deskMaterial;
      }

      if (child.name === "screen") {
        child.material = this.screenMaterial;
        this.screenMesh = child;
      }

      if (child.name === "picture01") {
        child.material = this.elliotPictureMaterial;
      }

      if (child.name.includes("key")) {
        this.keys.push(child);
        this.keyTimelines[child.name] = anime.timeline({
          duration: 100,
          // direction: "dire",
          autoplay: false,
          easing: "linear",
        });

        this.keyTimelines[child.name].add({
          targets: child.position,
          y: child.position.y - 0.006,
        });
      }
    });

    document.addEventListener(
      "keydown",
      (event) => {
        console.log(event.code);
        const keyName = event.code.toLowerCase();
        const keyCapMesh = this.keys.find((key) => key.name === keyName);

        if (keyCapMesh) {
          const timeline = this.keyTimelines[keyCapMesh.name];

          if (!event.repeat) {
            if (timeline.reversed) {
              timeline.reverse();
            }
            timeline.play();
          }
        }
      },
      false
    );

    document.addEventListener(
      "keyup",
      (event) => {
        const keyName = event.code.toLowerCase();
        const keyCapMesh = this.keys.find((key) => key.name.includes(keyName));

        if (keyCapMesh) {
          const timeline = this.keyTimelines[keyCapMesh.name];
          timeline.reverse();
          timeline.play();
        }
      },
      false
    );

    this.scene.add(this.deskScene);
  }

  resize() {}

  update() {
    if (this.screenMaterial) {
      this.screenMaterial.uniforms.uTime.value = this.time.elapsed / 1000;
      this.screenMaterial.uniforms.uBrightness.value = this.scrollPercent;
    }

    if (this.screenMesh) {
      // this.experience.camera.instance.lookAt(this.screenMesh.position);
    }
  }

  destroy() {}
}
