import * as THREE from "three";
import GUI from "lil-gui";
import Experience, { Config } from "./Experience";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import Stats from "./Utils/Stats";
import Time from "./Utils/Time";
import Sizes from "./Utils/Sizes";

export default class Renderer {
    experience: Experience;
    config: Config;
    stats: Stats;
    time: Time;
    debug: GUI;
    sizes: Sizes;
    scene: THREE.Scene;
    camera: THREE.Camera;

    constructor(_options = {}) {
        this.experience = new Experience({});
        this.config = this.experience.config;
        this.debug = this.experience.debug;
        this.stats = this.experience.stats;
        this.time = this.experience.time;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder("renderer");
        }

        this.usePostprocess = true;

        this.setInstance();
        this.setPostProcess();
    }

    clearColor: string;
    instance: THREE.WebGLRenderer;
    context: WebGLRenderingContext;
    debugFolder: any;

    setInstance() {
        this.clearColor = "#010101";

        // Renderer
        this.instance = new THREE.WebGLRenderer({
            alpha: false,
            antialias: true,
        });
        this.instance.domElement.style.position = "absolute";
        this.instance.domElement.style.top = "0px";
        this.instance.domElement.style.left = "0px";
        this.instance.domElement.style.width = "100%";
        this.instance.domElement.style.height = "100%";

        this.instance.setClearColor(this.clearColor, 1);
        this.instance.setSize(this.config.width, this.config.height);
        this.instance.setPixelRatio(this.config.pixelRatio);

        this.instance.outputColorSpace = THREE.LinearSRGBColorSpace;
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
        this.instance.shadowMap.enabled = false;
        this.instance.toneMapping = THREE.NoToneMapping;
        this.instance.toneMappingExposure = 1;

        this.context = this.instance.getContext();

        // Add stats panel
        if (this.stats) {
            this.stats.setRenderPanel(this.context);
        }

        // Debug
        if (this.debug) {
            this.debugFolder.addColor(this, "clearColor").onChange(() => {
                this.instance.setClearColor(this.clearColor);
            });

            this.debugFolder
                .add(this.instance, "toneMapping", {
                    NoToneMapping: THREE.NoToneMapping,
                    LinearToneMapping: THREE.LinearToneMapping,
                    ReinhardToneMapping: THREE.ReinhardToneMapping,
                    CineonToneMapping: THREE.CineonToneMapping,
                    ACESFilmicToneMapping: THREE.ACESFilmicToneMapping,
                })
                .onChange(() => {
                    this.scene.traverse((_child) => {
                        if (_child instanceof THREE.Mesh)
                            _child.material.needsUpdate = true;
                    });
                });

            this.debugFolder
                .add(this.instance, "toneMappingExposure")
                .min(0)
                .max(10);
        }
    }

    renderTarget: THREE.WebGLRenderTarget;

    setPostProcess() {
        this.renderTarget = new THREE.WebGLRenderTarget(
            this.config.width,
            this.config.height,
            {
                generateMipmaps: false,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
            },
        );
    }

    resize() {
        // Instance
        this.instance.setSize(this.config.width, this.config.height);
        this.instance.setPixelRatio(this.config.pixelRatio);
    }

    update() {
        if (this.stats) {
            this.stats.beforeRender();
        }
        this.instance.render(this.scene, this.camera.instance);

        if (this.stats) {
            this.stats.afterRender();
        }
    }

    destroy() {
        this.instance.renderLists.dispose();
        this.instance.dispose();
        this.renderTarget.dispose();
    }
}
