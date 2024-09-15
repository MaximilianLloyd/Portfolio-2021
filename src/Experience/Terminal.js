import { Text, preloadFont } from "troika-three-text";
import * as THREE from "three";

const commands = {};

export class Terminal {
  prompt = "";
  group = new THREE.Group();

  constructor() {
    this.cmdPromptText = new Text();
    this.cmdPromptText.font = "/assets/fonts/JetBrainsMono-Regular.ttf";
    this.cmdPromptText.text = ">";
    this.cmdPromptText.anchorX = "left";
    this.cmdPromptText.textAlign = "left";
    this.cmdPromptText.position.x = -3.2;
    this.cmdPromptText.fontSize = 0.2;
    this.cmdPromptText.position.y = -1.5;
    this.cmdPromptText.position.z = -2;
    this.cmdPromptText.sync();

    this.cmdPromptOutput = new Text();
    this.cmdPromptOutput.font = "/assets/fonts/JetBrainsMono-Regular.ttf";
    this.cmdPromptOutput.text = "Output";
    this.cmdPromptOutput.anchorX = "left";
    this.cmdPromptOutput.textAlign = "left";
    this.cmdPromptOutput.position.x = -3.2;
    this.cmdPromptOutput.fontSize = 0.2;
    this.cmdPromptOutput.position.y = -1;
    this.cmdPromptOutput.position.z = -2;
    this.cmdPromptOutput.sync();

    this.group.add(this.cmdPromptText);
    this.group.add(this.cmdPromptOutput);

    window.addEventListener("keydown", this.handleKeyDown.bind(this));
  }
  render() {
    this.cmdPromptText.text = "> " + this.prompt;
    this.cmdPromptText.sync();
  }
  handleKeyDown(event) {
    if (event.key === "Enter") {
      this.prompt = "";
      this.cmdPromptText.text = "";
      this.cmdPromptText.sync();
    } else if (event.key === "Backspace") {
      this.prompt = this.prompt.slice(0, -1);
    } else {
      console.log(event);
      this.prompt = this.prompt + event.key;
    }
    this.render();
  }
}
