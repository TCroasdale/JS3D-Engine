
class Component {
  constructor(obj) {
    this.attachedObject = obj
  }
  onCreate() {}
  onUpdate() {}
  onLateUpdate() {}
  static fromParameters(p) {}
}

let BodyPrimitive = {
  CUBE: (x, y, z) => { return new CANNON.Box(new CANNON.Vec3(x, y, z)) },
  SPHERE: (r) => { return new CANNON.Sphere(r) }
}

let parseBodyPrimitive = (object) => {
  if (object.Primitive === "Cube") {
    return BodyPrimitive.CUBE(object.HalfExtents.w, object.HalfExtents.h, object.HalfExtents.d )
  } else if (object.Primitive === "Sphere") {
    return BodyPrimitive.SPHERE(object.Radius)
  }

  return undefined
}

class RigidBody extends Component {
  constructor(obj, bodyShape, mass) {
    super(obj)
    this.bodyShape = bodyShape
    this.mass = mass

    this.onCreate()
  }
  onCreate() {
    // this.attachedObject.mesh.useQuaternion = true
    this.body = new CANNON.Body({
      mass: this.mass, // kg
      position: new CANNON.Vec3(this.attachedObject.mesh.position.x,
                                this.attachedObject.mesh.position.y,
                                this.attachedObject.mesh.position.z), // m
      shape: this.bodyShape
   })
  }

  onLateUpdate() {
    this.attachedObject.mesh.position.x = this.body.position.x
    this.attachedObject.mesh.position.y = this.body.position.y
    this.attachedObject.mesh.position.z = this.body.position.z
    
    this.attachedObject.mesh.quaternion.x = this.body.quaternion.x
    this.attachedObject.mesh.quaternion.y = this.body.quaternion.y
    this.attachedObject.mesh.quaternion.z = this.body.quaternion.z
    this.attachedObject.mesh.quaternion.w = this.body.quaternion.w
    // console.log(this.attachedObject.mesh.quaternion)
  }

  static fromParameters(object, params) {
    return new RigidBody(object, parseBodyPrimitive(params.BodyShape), params.Mass)
  }
}

class Camera extends Component {
  constructor(obj, FoV, near, far) {
    super(obj)
    this.FoV = FoV
    this.near = near
    this.far = far
  }

  setCamera(camera) {
    this.camera = camera
  } 

  onCreate() {}
  onEarlyUpdate(dT) {
    this.camera.position.x = this.attachedObject.position.x
    this.camera.position.y = this.attachedObject.position.y
    this.camera.position.z = this.attachedObject.position.z
  }
  onUpdate() {}
  onLateUpdate() {}

  static fromParameters(object, params) {
    return new Camera(object, params.FoV, params.Near, params.Far)
  }
}

module.exports = { BodyPrimitive, Component, RigidBody, Camera }