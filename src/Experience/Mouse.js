import anime from "animejs/lib/anime.es.js";

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

    this.mesh.position.x = this.mouseMeshDefaultPosition.x + -(cursor.x * 0.05);
    this.mesh.position.z = this.mouseMeshDefaultPosition.z + -(cursor.y * 0.05);
  }

  destroy() {}
}
