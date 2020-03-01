
class Component {
  constructor(obj) {
    this.attachedObject = obj
  }
  onCreate() {}
  onEarlyUpdate() {}
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
    // initpos to world position
    var initpos = new THREE.Vector3();
    this.attachedObject.mesh.updateMatrixWorld()
    initpos.setFromMatrixPosition( this.attachedObject.mesh.matrixWorld );
    this.body = new CANNON.Body({
      mass: this.mass, // kg
      position: new CANNON.Vec3(initpos.x,
                                initpos.y,
                                initpos.z), // m
      shape: this.bodyShape
   })
  }

  onLateUpdate() {
    let parent = this.attachedObject.mesh.parent
    parent.remove(this.attachedObject.mesh)

    this.attachedObject.mesh.position.x = this.body.position.x
    this.attachedObject.mesh.position.y = this.body.position.y
    this.attachedObject.mesh.position.z = this.body.position.z
    
    this.attachedObject.mesh.quaternion.x = this.body.quaternion.x
    this.attachedObject.mesh.quaternion.y = this.body.quaternion.y
    this.attachedObject.mesh.quaternion.z = this.body.quaternion.z
    this.attachedObject.mesh.quaternion.w = this.body.quaternion.w

    parent.attach(this.attachedObject.mesh)

    if (this.line !== undefined){
      this.line.position.x = this.body.position.x
      this.line.position.y = this.body.position.y
      this.line.position.z = this.body.position.z
      
      this.line.quaternion.x = this.body.quaternion.x
      this.line.quaternion.y = this.body.quaternion.y
      this.line.quaternion.z = this.body.quaternion.z
      this.line.quaternion.w = this.body.quaternion.w
    }
  }

  initDebugFrame(scene) {
    let geometry = null
    if (this.body.shapes[0].halfExtents !== undefined){
      let he = this.body.shapes[0].halfExtents
      geometry = new THREE.BoxGeometry(he.x*2, he.y*2, he.z*2)
    } else {
      geometry = new THREE.SphereBufferGeometry(this.body.shapes[0].radius, 8, 4)
    }
    let wireframe = new THREE.WireframeGeometry(geometry)
    this.line = new THREE.LineSegments(wireframe)
    this.line.material.depthTest = false
    this.line.material.opacity = 0.75
    this.line.material.transparent = true
    scene.add(this.line)
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
    if (this.camera === undefined) return;
    this.camera.position.x = this.attachedObject.mesh.position.x
    this.camera.position.y = this.attachedObject.mesh.position.y
    this.camera.position.z = this.attachedObject.mesh.position.z
  }
  onUpdate() {}
  onLateUpdate() {}

  static fromParameters(object, params) {
    return new Camera(object, params.FoV, params.Near, params.Far)
  }
}

module.exports = { BodyPrimitive, Component, RigidBody, Camera }