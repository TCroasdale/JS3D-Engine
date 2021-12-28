const Primitive = {
  BOX: (x, y, z) => { return new THREE.BoxGeometry(x, y, z) },
  PLANE: (w, h, s) => { return new THREE.PlaneGeometry(w, h, s) },
  SPHERE: (rad, rings, segments) => { return new THREE.SphereGeometry(rad, rings, segments) }
}

const parsePrimitive = (object) => {
  if (object.Primitive === 'Cube') {
    return Primitive.BOX(object.Shape.w, object.Shape.h, object.Shape.d)
  } else if (object.Primitive === 'Plane') {
    return Primitive.PLANE(object.Shape.w, object.Shape.h, object.Shape.s)
  } else if (object.Primitive === 'Sphere') {
    return Primitive.SPHERE(object.Shape.Radius, object.Shape.Rings, object.Shape.Segments)
  }

  return undefined
}

const SimpleMaterial = {
  NORMAL: () => { return new THREE.MeshNormalMaterial() }
}

const parseMaterial = (mat) => {
  if (mat === 'Normal') {
    return SimpleMaterial.NORMAL()
  }

  return undefined
}

class Object3D {
  constructor (argmap) {
    if (argmap.gltf) { // gltf provided, uses only the first mesh in the scene
      this.mesh = argmap.gltf.scene.children[0]
    } else if (argmap.material && argmap.geometry) { // usually a primitive
      this.mesh = new THREE.Mesh(argmap.geometry, argmap.material)
    } else { // no model or primitive
      this.mesh = new THREE.Object3D()
    }

    if (argmap.parent) {
      argmap.parent.add(this.mesh)
    }
    this.components = []
  }

  setPosition (x, y, z) {
    this.mesh.position.x = x
    this.mesh.position.y = y
    this.mesh.position.z = z
  }

  setName (name) {
    this.name = name
    this.mesh.name = name
  }

  getMesh () { return this.mesh }
  addComponent (comp) {
    comp.attachedObject = this
    this.components.push(comp)
  }

  getComponent (comp) {
    return this.components.find((component) => {
      if (component.constructor.name === comp) {
        return component
      }
    })
  }

  hasComponent (comp) {
    this.components.find((component) => {
      if (component.constructor.name === comp) {
        return true
      }
    })
    return false
  }

  onEarlyUpdate (dT, input) {
    this.components.forEach((comp) => {
      comp.onEarlyUpdate(dT, input)
    })
  }

  onUpdate (dT, input) {
    this.components.forEach((comp) => {
      comp.onUpdate(dT, input)
    })
  }

  onLateUpdate (dT, input) {
    this.components.forEach((comp) => {
      comp.onLateUpdate(dT, input)
    })
  }
}

module.exports = { Primitive, SimpleMaterial, Object3D, parsePrimitive, parseMaterial }
