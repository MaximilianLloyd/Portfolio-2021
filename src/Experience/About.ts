import { Text, preloadFont } from "troika-three-text";
import * as THREE from "three";

export class About {
  text: any;
  group = new THREE.Group();

  constructor() {
    this.text = new Text();
    this.text.font = "/assets/fonts/JetBrainsMono-Regular.ttf";
    this.text.text =
      "I am self taught developer with a passion for creating beautiful and functional websites.";
    this.text.anchorX = "center";
    this.text.textAlign = "center";
    this.text.position.x = -3.2;
    this.text.fontSize = 0.2;
    this.text.position.y = -1.5;
    this.text.position.z = -2;
    this.text.color = "green";
    this.text.sync();
    this.group.add(this.text);
  }
}
