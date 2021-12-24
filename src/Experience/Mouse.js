import anime from "animejs/lib/anime.es.js";

import { lerp } from "../Helpers/math";

export class Mouse {
  constructor() {
    this.mesh = null;
    this.mouseMeshDefaultPosition = null;
  }

  setMouse(mesh) {
    console.log(mesh);
    this.mesh = mesh;
    this.mouseMeshDefaultPosition = this.mesh.position.clone();
  }

  update(cursor) {
    if (!cursor || !this.mesh) return null;

    const newX = this.mouseMeshDefaultPosition.x + -(cursor.x * 0.05);
    const newZ = this.mouseMeshDefaultPosition.z + -(cursor.y * 0.05);

    this.mesh.position.x = lerp(this.mesh.position.x, newX, 0.1);

    this.mesh.position.z = lerp(this.mesh.position.z, newZ, 0.1);
  }

  destroy() {}
}
