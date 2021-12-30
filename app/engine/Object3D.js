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
  NORMAL: () => { return new THREE.MeshNormalMaterial() },
  TOON: () => { return new THREE.MeshToonMaterial() },
  STANDARD: () => { return new THREE.MeshStandardMaterial() },
  LAMBERT: () => { return new THREE.MeshLambertMaterial() }
}

const parseMaterial = (mat) => {
  if (mat === 'Normal') {
    return SimpleMaterial.NORMAL()
  }
  if (mat === 'Toon') {
    return SimpleMaterial.TOON()
  }
  if (mat === 'Standard') {
    return SimpleMaterial.STANDARD()
  }
  if (mat === 'Simple') {
    return SimpleMaterial.LAMBERT()
  }

  if (mat.Shader) {
    const shader = parseMaterial(mat.Shader)
    shader.color = new THREE.Color(mat.Color)
    return shader
  }

  return undefined
}

class Object3D {
  constructor (argmap) {
    if (argmap.gltf) { // gltf provided, uses only the first mesh in the scene
      this.mesh = argmap.gltf.scene.children[0]
      this.mesh.castShadow = true
      this.mesh.receiveShadow = true
    } else if (argmap.material && argmap.geometry) { // usually a primitive
      this.mesh = new THREE.Mesh(argmap.geometry, argmap.material)
      this.mesh.castShadow = true
      this.mesh.receiveShadow = true
    } else if (argmap.light) {
      this.mesh = new THREE.PointLight(new THREE.Color(argmap.light.Color), argmap.light.Intensity, argmap.light.Distance, argmap.light.Decay)
      if (argmap.light.Caster) {
        this.mesh.castShadow = true
        this.mesh.shadow.mapSize.width = 512 // default
        this.mesh.shadow.mapSize.height = 512 // default
        this.mesh.shadow.camera.near = 0.5 // default
        this.mesh.shadow.camera.far = 500 // default
      }
    }else { // no model or primitive
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

  setScale (x, y, z) {
    this.mesh.scale.set(x, y, z)
  }

  setRotation (argmap) {
    if (this.getComponent('RigidBody') !== undefined) {
      return
    }

    if (argmap.Axis && argmap.Angle) {
      let axis = new THREE.Vector3(argmap.Axis.x, argmap.Axis.y, argmap.Axis.z)
      this.mesh.setRotationFromAxisAngle(axis, argmap.Angle)
    }

    if (argmap.Euler) {
      let euler = new THREE.Euler(argmap.euler.x, argmap.euler.y, argmap.euler.z, 'XYZ')
      this.mesh.setRotationFromEuler(euler)
    }
  }

  rotate (argmap) {
    if (this.getComponent('RigidBody') !== undefined) {
      return
    }

    if (argmap.Axis && argmap.Angle) {
      const axis = new THREE.Vector3(argmap.Axis.x, argmap.Axis.y, argmap.Axis.z)
      if (!argmap.Space || argmap.Space === 'local') {
        this.mesh.rotateOnAxis(axis, argmap.Angle)
      } else if (argmap.Space === 'world') {
        this.mesh.rotateOnWorldAxis(axis, argmap.Angle)
      }
    }

    if (argmap.Euler) {
      this.mesh.rotateX(argmap.euler.x)
      this.mesh.rotateY(argmap.euler.y)
      this.mesh.rotateZ(argmap.euler.z)
    }
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
    return undefined
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
