import * as THREE from "three";
import Experience from "./Experience";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
    constructor(_options) {
        // Options
        this.experience = new Experience({});
        this.config = this.experience.config;
        this.debug = this.experience.debug;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.debugObject = {
            position: {
                x: 0,
                y: 1.115,
                z: -1.4,
            },
        };
        this.mode = "debug";
        // Set up this.mode = "debug"; // || "default"; // defaultCamera \ debugCamera this.setInstance();
        this.setInstance();
        this.setModes();
        this.setDebug();
    }

    setInstance() {
        // Set up
        this.instance = new THREE.PerspectiveCamera(
            25,
            this.config.width / this.config.height,
            0.1,
            150,
        );
        const { x, y, z } = this.debugObject.position;
        this.instance.position.set(x, y, z);
        this.instance.rotation.reorder("YXZ");
        this.instance.rotation.y = (180 * Math.PI) / 180;

        this.scene.add(this.instance);
    }

    getInstance() {
        return this.modes[this.mode].instance;
    }

    setDebug() {
        const onChange = (axis, value) => {
            this.debugObject.position[axis] = value;
            const { x, y, z } = this.debugObject.position;
            this.modes[this.mode].instance.position.set(x, y, z);
        };

        if (this.debug) {
            this.debug
                .add(this.debugObject.position, "x", -2, 2, 0.005)
                .onChange((value) => onChange("x", value));

            this.debug
                .add(this.debugObject.position, "y", -2, 2, 0.005)
                .onChange((value) => onChange("y", value));

            this.debug
                .add(this.debugObject.position, "z", -2, 2, 0.005)
                .onChange((value) => onChange("z", value));
        }
    }

    setModes() {
        this.modes = {};

        // Default
        this.modes.default = {};
        this.modes.default.instance = this.instance.clone();
        this.modes.default.instance.rotation.reorder("YXZ");

        // Debug
        this.modes.debug = {
            active: false,
        };
        this.modes.debug.instance = this.instance.clone();
        this.modes.debug.instance.rotation.reorder("YXZ");
        // this.modes.debug.orbitControls = new OrbitControls(
        //   this.modes.debug.instance,
        //   this.targetElement
        // );

        // this.modes.debug.orbitControls.enabled = this.modes.debug.active;
        // this.modes.debug.orbitControls.screenSpacePanning = true;
        // this.modes.debug.orbitControls.enableKeys = false;
        // this.modes.debug.orbitControls.zoomSpeed = 0.25;
        // this.modes.debug.orbitControls.enableDamping = true;
        // this.modes.debug.orbitControls.update();
    }

    resize() {
        this.instance.aspect = this.config.width / this.config.height;
        this.instance.updateProjectionMatrix();

        this.modes.default.instance.aspect =
            this.config.width / this.config.height;
        this.modes.default.instance.updateProjectionMatrix();

        this.modes.debug.instance.aspect =
            this.config.width / this.config.height;
        this.modes.debug.instance.updateProjectionMatrix();
    }

    update() {
        // Update debug orbit controls
        // this.modes.debug.orbitControls.update();

        // Apply coordinates
        if (this.instance) {
            // this.instance.position.copy(
            //     this.modes[this.mode].instance.position,
            // );
            // this.instance.quaternion.copy(
            //     this.modes[this.mode].instance.quaternion,
            // );
            // this.instance.updateMatrixWorld(); // To be used in projection
        }
    }

    destroy() {
        // this.modes.debug.orbitControls.destroy();
    }
}
