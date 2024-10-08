import * as THREE from "three";
import anime from "animejs/lib/anime.es.js";
import Experience, { Config } from "./Experience.js";
import { Keyboard } from "./Keyboard.js";
import { Mouse } from "./Mouse.js";
import { Screen } from "./Screen.js";

// import screenVertexShader from "./Shaders/screen/vertex.glsl";
// import screenFragmentShader from "./Shaders/screen/fragment.glsl";

import { lerp } from "../Helpers/math.js";
import Time from "./Utils/Time.js";
import Sizes from "./Utils/Sizes.js";

const STAGES = {
    INTRO_SCROLLING: 1,
    PLAY_TEXT_INTRO: 2,
};

export default class World {
    experience: Experience;
    keyboard: Keyboard;
    mouse: Mouse;
    screen: Screen;
    config: Config;
    scene: THREE.Scene;
    resources: any;
    time: Time;
    sizes: Sizes;
    camera: THREE.PerspectiveCamera;
    scrollPercent: number;

    constructor(_options) {
        this.experience = new Experience();
        this.keyboard = new Keyboard();
        this.mouse = new Mouse();
        this.screen = new Screen();
        this.config = this.experience.config;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.sizes = this.experience.sizes;
        this.camera = this.experience.camera.getInstance();
        this.scrollPercent = 0;
        this.cursor = { x: 0, y: 0 };
        this.newCameraZ = 0;
        this.CURRENT_STAGE = STAGES.INTRO_SCROLLING;
        this.camera.position.z = -0.6;

        this.resources.on("groupEnd", (_group) => {
            if (_group.name === "base") {
                console.log("Loading ended");
                this.initializeParallax();
                this.initializeMaterials();
                this.setScene();

                setTimeout(() => {
                    anime({
                        targets: ".overlay",
                        duration: 500,
                        easing: "easeInOutQuint",
                        opacity: 0,
                        complete: () => {
                            // this.screen.startIntroText();
                            this.screen.startTextTimeline();
                            // this.camera.position.z = -4;
                        },
                    });
                }, 500);
            }
        });
    }

    handleScroll() {
        // const height =
        //     this.scrollElement.clientHeight - this.scrollContainer.clientHeight;
        //
        // this.scrollPercent = this.scrollContainer.scrollTop / height;
        // this.newCameraZ = this.initialCameraZ + -this.scrollPercent * 1.5;
        // this.handleScreenTextPlaying();
    }

    handleScreenTextPlaying() {}

    initializeParallax() {
        this.cursor.x = 0;
        this.cursor.y = 0;

        window.addEventListener("mousemove", (event) => {
            this.cursor.x = event.clientX / this.sizes.width - 0.5;
            this.cursor.y = event.clientY / this.sizes.height - 0.5;
        });
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

        this.screen.texture.flipY = true;
        this.screenMaterial = new THREE.MeshBasicMaterial({
            map: this.screen.texture,
        });
    }

    keys: any[];
    keyTimelines: Record<string, any>;
    deskScene: THREE.Scene;
    deskMaterial: THREE.MeshBasicMaterial;

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

            if (child.name === "mouse") {
                this.mouse.setMouse(child);
            }
        });

        this.keyboard.setKeyboard(this.deskScene);
        this.scene.add(this.deskScene);
    }

    resize() {}

    update() {
        this.screen.update();

        if (this.screenMaterial) this.screenMaterial.map = this.screen.texture;

        if (this.screenMaterial) this.screenMaterial.needsUpdate = true;
        this.camera.position.x =
            -(this.cursor.x - this.camera.position.x) * 0.1;

        this.camera.position.y =
            1.105 + -(this.cursor.y - this.camera.position.y) * 0.01;

        // this.camera.position.z = lerp(
        //     this.camera.position.z,
        //     this.newCameraZ,
        //     0.05,
        // );

        if (this.screenMaterial) {
            // this.screenMaterial.uniforms.uTime.value = this.time.elapsed / 1000;
            // this.screenMaterial.uniforms.uBrightness.value = this.scrollPercent;
        }

        this.mouse.update(this.cursor);

        if (this.screenMesh) {
            this.camera.lookAt(this.screenMesh.position);
        }
    }

    destroy() {
        this.keyboard.destroy();
    }
}
