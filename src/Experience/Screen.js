// The class responsible for rendering the screen to a MeshBasicMaterial by using the texture from the renderTarget.
import * as THREE from "three";
import delay from "delay";
import { Text, preloadFont } from "troika-three-text";

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
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.encoding = THREE.sRGBEncoding;

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
    preloadFont(
      {
        font: "/assets/fonts/MR_ROBOT.ttf",
        // characters: "abcdefghijklmnopqrstuvwxyz",
      },
      () => {
        this.setScene();
      }
    );
  }

  async setScene() {
    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 1.0, 1),
      new THREE.MeshBasicMaterial({
        color: 0x00ff00,
      })
    );

    this.cube.position.set(0, 0, 0);

    // this.scene.add(this.cube);

    this.introText = new Text();

    // myText.rotation.y = Math.PI / 180;
    this.introText.font = "/assets/fonts/MR_ROBOT.ttf";
    this.introText.text = "";
    this.introText.fontSize = 0.2;
    this.introText.position.z = -2;
    this.introText.position.x = 0;
    this.introText.color = 0xcf0a12;
    this.introText.maxWidth = 3.2;
    this.introText.anchorX = "center";
    this.introText.textAlign = "center";
    this.introText.material.opacity = 0.5;

    this.scene.add(this.introText);

    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer.setClearColor(new THREE.Color("#111111"));

    await delay(1000);
    await this.animateText("Hello friend");
    await delay(1000);
    await this.animateClearingOfText();
    await delay(500);
    await this.animateText(
      `"Hello friend", that's lame. Maybe i should give you a name?`
    );
    await delay(1000);
    await this.animateClearingOfText();
    await this.animateText("But that is a slippery slope...");
    await this.animateText("You're only in my head. We have to remember that");
    await delay(500);
    await this.animateClearingOfText();
    await this.animateText(
      "I'm Max. A creative developer based in Oslo, Norway"
    );
    await delay(1000);
    await this.animateClearingOfText();
    await this.animateText("Let me show you some of my work");
  }

  animateText(textToAnimate) {
    return new Promise((resolve, reject) => {
      let index = 1;

      const interval = setInterval(() => {
        console.log("interval");
        const textToShow = textToAnimate.substring(0, index);

        if (textToAnimate.length === textToShow.length) {
          clearInterval(interval);
          resolve();
        }

        this.introText.text = textToShow;
        this.introText.sync();
        index++;
      }, 80);
    });
  }

  animateClearingOfText() {
    const text = this.introText.text;

    return new Promise((resolve, reject) => {
      let index = text.length;

      const interval = setInterval(() => {
        const textToShow = text.substring(0, index);

        if (textToShow.length === 0) {
          clearInterval(interval);
          resolve();
        }

        this.introText.text = textToShow;
        this.introText.sync();
        index--;
      }, 30);
    });
  }

  update() {
    this.renderer.render(this.scene, this.camera);
    this.texture.needsUpdate = true;
  }
}
