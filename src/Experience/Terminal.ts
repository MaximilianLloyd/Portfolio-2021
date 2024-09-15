import { Text, preloadFont } from "troika-three-text";
import * as THREE from "three";
import anime from "animejs";

type Commands =
  | "help"
  | "clear"
  | "cv"
  | "intro"
  | "about"
  | "contact"
  | "projects";

export class Terminal {
  prompt = "help";
  group = new THREE.Group();
  cmdPromptText: any;
  cmdPromptOutput: any;

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
    this.cmdPromptText.color = "green";
    this.cmdPromptText.sync();

    this.cmdPromptOutput = new Text();
    this.cmdPromptOutput.font = "/assets/fonts/JetBrainsMono-Regular.ttf";
    this.cmdPromptOutput.text = "";
    this.cmdPromptOutput.anchorX = "left";
    this.cmdPromptOutput.anchorY = "bottom";
    this.cmdPromptOutput.textAlign = "left";
    this.cmdPromptOutput.position.x = -3.2;
    this.cmdPromptOutput.maxWidth = 6;
    this.cmdPromptOutput.fontSize = 0.2;
    this.cmdPromptOutput.position.y = -1.45;
    this.cmdPromptOutput.position.z = -2;
    this.cmdPromptOutput.sync();

    this.group.add(this.cmdPromptText);
    this.group.add(this.cmdPromptOutput);

    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.render();
  }
  render() {
    this.cmdPromptText.text = "> " + this.prompt;
    this.cmdPromptText.sync();
  }
  enter() {
    const cmd = this.prompt as Commands;

    switch (cmd) {
      case "help": {
        this.cmdPromptOutput.text = [
          "about",
          "contact",
          // "projects",
          "cv - download my CV",
          "clear - clear the terminal",
        ].join("\n");
        break;
      }
      case "projects": {
        this.cmdPromptOutput.text = [
          "1. Project 1",
          "2. Project 2",
          "3. Project 3",
          "Type a number to view a project",
        ].join("\n");
        break;
      }
      case "about": {
        this.cmdPromptOutput.text = [
          "I'm Max, a self-taught developer with a passion for creating beautiful and functional websites and applications.",
        ].join("\n");
        // this.group.add(this.about.group);
        break;
      }
      case "cv": {
        window.open("/Maximilian ._Lloyd_English.pdf");
        break;
      }
      case "contact": {
        location.href = "mailto:me@maxlloyd.no";
        break;
      }
      case "clear": {
        this.cmdPromptOutput.text = "";
        break;
      }
      default: {
        this.cmdPromptOutput.text = "Command not found";
      }
    }

    this.prompt = "";
    this.cmdPromptText.text = "";
    this.cmdPromptText.sync();
  }
  handleKeyDown(event) {
    if (event.key === "Enter") {
      this.enter();
    } else if (event.key === "Backspace") {
      this.prompt = this.prompt.slice(0, -1);
      // Do nothing
    } else if (
      event.key === "Alt" ||
      event.key === "Control" ||
      event.key === "Shift" ||
      event.key === "Meta"
    ) {
    } else {
      console.log(event);
      this.prompt = this.prompt + event.key;
    }
    this.render();
  }
}
