// The class responsible for rendering the screen to a MeshBasicMaterial by using the texture from the renderTarget.
import * as THREE from "three";
import delay from "delay";
import { Text, preloadFont } from "troika-three-text";

import Experience from "./Experience";
import { Terminal } from "./Terminal";

export class Screen {
  constructor() {
    this.scene = new THREE.Scene();
    this.experience = new Experience();
    this.time = this.experience.time;
    this.terminal = new Terminal();

    const width = 1370;
    const height = 768;

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 150);
    this.camera.rotation.reorder("YXZ");
    this.camera.position.set(0, 0, 2);

    this.target = new THREE.WebGLRenderTarget(width, height, {
      antiAlias: true,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });

    this.texture = this.target.texture;
    preloadFont(
      {
        font: "/assets/fonts/MR_ROBOT.ttf",
        // characters: "abcdefghijklmnopqrstuvwxyz",
      },
      () => {
        this.setScene();
      },
    );
  }

  async setScene() {
    this.introText = new Text();
    this.introText.font = "/assets/fonts/MR_ROBOT.ttf";
    this.introText.text = "";
    this.introText.fontSize = 0.2;
    this.introText.position.z = -2;
    this.introText.position.x = 0;
    this.introText.color = 0xcf0a12;
    this.introText.maxWidth = 3.2;
    this.introText.anchorX = "center";
    this.introText.textAlign = "center";

    const box = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    this.mesh = new THREE.Mesh(box, material);
    this.mesh.position.x = -1;
    this.mesh.position.y = -1;

    this.scene.add(this.introText);

    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  async startTextTimeline() {
    this.scene.add(this.terminal.group);

    await delay(1000);
    await this.animateText("Hello friend");
    await delay(1000);
    await this.animateClearingOfText();
    await delay(500);
    await this.animateText(
      `"Hello friend", that's lame. Maybe i should give you a name..`,
    );
    await delay(1000);
    await this.animateClearingOfText();
    await this.animateText("But that is a slippery slope...");
    await this.animateText("You're only in my head. We have to remember that");
    await delay(500);
    await this.animateClearingOfText();
    await this.animateText(
      "I'm Max. A creative developer based in Oslo, Norway",
    );
    await delay(1000);
    await this.animateClearingOfText();
    await this.animateText("type 'help' to get started");
    await delay(500);
    await this.animateClearingOfText();
    // Add the command prompt text
    // await this.animateText("More content coming soon...");
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
    this.experience.renderer.instance.setRenderTarget(this.target);
    this.experience.renderer.instance.render(this.scene, this.camera);
    this.experience.renderer.instance.setRenderTarget(null);
  }
}
