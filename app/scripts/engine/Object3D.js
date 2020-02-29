let Primitive = {
  BOX: THREE.BoxGeometry,
  PLANE: THREE.PlaneGeometry,
  SPHERE: THREE.SphereGeometry
}

let BodyPrimitive = {
  CUBE: (x, y, z) => { return new CANNON.Box(new CANNON.Vec3(x, y, z)) },
  SPHERE: (r) => { return new CANNON.Sphere(r) }
}

let SimpleMaterial = {
  NORMAL: THREE.MeshNormalMaterial
}

class Object3D {
  constructor (parent, geometry, material){
    this.mesh = new THREE.Mesh(geometry, material)
    this.components = []
    parent.add(this.mesh)
  }

  getMesh () { return this.mesh }
  addComponent (comp) { this.components.push(comp) }
  onUpdate (dT) {
    this.components.forEach((comp) => {
      comp.onUpdate(dT)
    })
  }
  onLateUpdate (dT) {
    this.components.forEach((comp) => {
      comp.onLateUpdate(dT)
    })
  }
}

module.exports = { Primitive, BodyPrimitive, SimpleMaterial, Object3D}