import * as THREE from "three";
import GUI from "lil-gui";
import "@theatre/core";
import studio from "@theatre/studio";

import Time from "./Utils/Time";
import Sizes from "./Utils/Sizes";
import Stats from "./Utils/Stats";

import Resources from "./Resources";
import Renderer from "./Renderer";
import Camera from "./Camera";
import World from "./World";

export type Config = {
    pixelRatio: number;
    width: number;
    height: number;
    debug: boolean;
    isMobile: boolean;
};

import assets from "./assets.js";
import { getProject, types } from "@theatre/core";

export default class Experience {
    static instance;
    config: Config;
    time: Time;
    sizes: Sizes;
    targetElement: HTMLElement;
    camera: Camera;
    stats: Stats;
    debug: GUI;
    scene: THREE.Scene;
    renderer: Renderer;
    world: World;
    resources: Resources;
    theatre = getProject("THREE.js x Theatre.js");
    sheet = this.theatre.sheet("Main");

    constructor(_options: { targetElement?: HTMLElement }) {
        if (Experience.instance) {
            return Experience.instance;
        }

        Experience.instance = this;

        // Options
        this.targetElement = _options.targetElement!;

        if (!this.targetElement) {
            console.warn("Missing 'targetElement' property");
            return;
        }

        this.time = new Time();
        this.sizes = new Sizes();
        this.setConfig();
        this.setDebug();
        this.setStats();
        this.setScene();
        this.setCamera();
        this.setRenderer();
        this.setResources();
        this.setWorld();

        this.sizes.on("resize", () => {
            this.resize();
        });

        this.update();
        studio.initialize();
    }

    setConfig() {
        this.config = {} as any;

        // Debug
        this.config.debug = window.location.hash === "#debug";

        // Pixel ratio
        this.config.pixelRatio = Math.min(
            Math.max(window.devicePixelRatio, 1),
            2,
        );
        this.config.isMobile = window.innerWidth < 768;

        // Width and height
        const boundings = this.targetElement.getBoundingClientRect();
        this.config.width = boundings.width;
        this.config.height = boundings.height || window.innerHeight;
    }

    setDebug() {
        if (this.config.debug) {
            this.debug = new GUI();
        }
    }

    setStats() {
        if (this.config.debug) {
            this.stats = new Stats(true);
        }
    }

    setScene() {
        this.scene = new THREE.Scene();
    }

    setCamera() {
        this.camera = new Camera();

        const torusKnotObj = this.sheet.object("Torus Knot", {
            // Note that the rotation is in radians
            // (full rotation: 2 * Math.PI)
            position: types.compound({
                x: types.number(this.camera.instance?.position.x, {
                    range: [-2, 2],
                }),
                y: types.number(this.camera.instance?.position.y, {
                    range: [-2, 2],
                }),
                z: types.number(this.camera.instance?.position.z, {
                    range: [-2, 2],
                }),
            }),
        });

        torusKnotObj.onValuesChange((values) => {
            const { x, y, z } = values.position;

            this.camera.instance.position.set(
                x * Math.PI,
                y * Math.PI,
                z * Math.PI,
            );
        });
    }

    setRenderer() {
        this.renderer = new Renderer({
            rendererInstance: this.rendererInstance,
        });

        // this.renderer = THREE.sRGBEncoding;

        this.targetElement.appendChild(this.renderer.instance.domElement);
    }

    setResources() {
        this.resources = new Resources(assets);
    }

    setWorld() {
        this.world = new World();
    }

    update() {
        if (this.stats) this.stats.update();

        this.camera.update();

        if (this.world) this.world.update();

        if (this.renderer) this.renderer.update();

        window.requestAnimationFrame(() => {
            this.update();
        });
    }

    resize() {
        // Config
        const boundings = this.targetElement.getBoundingClientRect();
        this.config.width = boundings.width;
        this.config.height = boundings.height;

        this.config.pixelRatio = Math.min(
            Math.max(window.devicePixelRatio, 1),
            2,
        );

        if (this.camera) this.camera.resize();
        if (this.renderer) this.renderer.resize();
        if (this.world) this.world.resize();
    }

    destroy() {}
}
