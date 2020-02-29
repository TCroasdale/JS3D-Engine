let Primitive = {
  BOX: (x, y, z) => { return new THREE.BoxGeometry(x, y ,z) },
  PLANE: (w, h, s) => { return new THREE.PlaneGeometry(w, h, s) },
  SPHERE: (rad, rings, segments) => { return new THREE.SphereGeometry(rad, rings, segments) }
}

let parsePrimitive = (object) => {
  if (object.Primitive === "Box") {
    return Primitive.BOX(object.Shape.w, object.Shape.h, object.Shape.d)
  } else if (object.Primitive === "Plane") {
    return Primitive.PLANE(object.Shape.w, object.Shape.h, object.Shape.s)
  } else if (object.Primitive === "Sphere") {
    return Primitive.SPHERE(object.Shape.Radius, object.Shape.Rings, object.Shape.Segments)
  }

  return undefined
}

let SimpleMaterial = {
  NORMAL: () => { return new THREE.MeshNormalMaterial() }
}

let parseMaterial = (object) => {
  if (object.Primitive === "Normal") {
    return SimpleMaterial.NORMAL()
  }

  return undefined
}


class Object3D {
  constructor (parent, geometry, material){
    if (parent === null && geometry === null) {
      this.mesh = new THREE.Mesh(geometry, material)
    } else {
      this.mesh = new THREE.Object3D()
    }
    parent.add(this.mesh)
    this.components = []
  }
  setPosition(x, y, z) {
    this.mesh.position.x = x
    this.mesh.position.y = y
    this.mesh.position.z = z
  }
  setName(name) {
    this.name = name
    this.mesh.name = name
  }
  getMesh () { return this.mesh }
  addComponent (comp) { this.components.push(comp) }
  onEarlyUpdate (dT) {
    this.components.forEach((comp) => {
      comp.onEarlyUpdate(dT)
    })
  }
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

module.exports = { Primitive, SimpleMaterial, Object3D, parsePrimitive, parseMaterial }