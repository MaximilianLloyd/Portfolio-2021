// Create a class to take care of the keyboard mesh animation

import anime from "animejs/lib/anime.es.js";

export class Keyboard {
  constructor() {
    this.keys = [];
    this.keyTimelines = {};
  }

  setKeyboard(scene) {
    this.initializeTimelines(scene);
    this.initializeListeners();
  }

  initializeTimelines(scene) {
    scene.traverse((child) => {
      if (
        child.name.includes("Key") ||
        child.name.includes("Space") ||
        child.name.includes("Arrow") ||
        child.name.includes("Control") ||
        child.name.includes("Shift") ||
        child.name.includes("Alt") ||
        child.name.includes("Meta")
      ) {
        this.keys.push(child);
        this.keyTimelines[child.name] = anime.timeline({
          duration: 100,
          autoplay: false,
          easing: "linear",
        });

        this.keyTimelines[child.name].add({
          targets: child.position,
          y: child.position.y - 0.006,
        });
      }
    });
  }

  initializeListeners() {
    this.keyDownListener = document.addEventListener(
      "keydown",
      (event) => {
        console.log("here", event.code);
        const keyCapMesh = this.keys.find((key) =>
          key.name.includes(event.code),
        );

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
      false,
    );

    this.keyUpListener = document.addEventListener(
      "keyup",
      (event) => {
        const keyCapMesh = this.keys.find((key) =>
          key.name.includes(event.code),
        );

        if (keyCapMesh) {
          const timeline = this.keyTimelines[keyCapMesh.name];
          timeline.reverse();
          timeline.play();
        }
      },
      false,
    );
  }

  update() {}

  destroy() {
    document.removeEventListener("keydown", this.keyDownListener);
    document.removeEventListener("keyup", this.keyUpListener);
  }
}
