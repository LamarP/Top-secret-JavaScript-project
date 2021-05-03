
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
/**
 * Base
 */
// Debug

const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const gltfLoader = new GLTFLoader()
gltfLoader.load(
  '/models/Duck/glTF/Duck.gltf',
  (gltf) => {
    scene.add(gltf.scene.children[0])
  }
)
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')




// Floor
const floor1 = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
      map: bricksColorTexture,
      aoMap: bricksAmbientOcclusionTexture,
      normalMap: bricksNormalTexture,
      roughnessMap: bricksRoughnessTexture
    })
)
floor1.receiveShadow = true
floor1.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor1.geometry.attributes.uv.array, 2))
floor1.rotation.x = - Math.PI * 0.5
floor1.position.y = 0.5
scene.add(floor1)





// Obstacle

const obstacleGeometry = new THREE.BoxGeometry(5,5);
const obstacleMaterial = new THREE.MeshBasicMaterial({
  color: 0x9E1A1A
})
const obstacleMesh = new THREE.Mesh(obstacleGeometry, obstacleMaterial)
obstacleMesh.position.y = 1.2
scene.add(obstacleMesh)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.3)
scene.add(ambientLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    // camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 2000)
//  camera.position.x = 2
camera.position.y = 5
camera.position.z = 5
scene.add(camera)

// Controls
// Camera controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
  
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor('#262837')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const playerGeometry = new THREE.SphereGeometry(1, 32, 32);

const playerMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000
});

const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial)
playerMesh.position.y = 1.2
playerMesh.position.z = 7
playerMesh.add(camera);
scene.add(playerMesh)
// Player controls


camera.position.z = 5

let keyboardEvent;

let pressed = false;



// console.log(playerMesh.geometry);
// console.log(playerMesh.geometry.vertices);
function update() {
  
  if (pressed) {
    
    const moveDistance = 0.1
    
    if (  keyboardEvent.keyCode === 37 )  {
      
      playerMesh.position.x -= moveDistance;
    }
    if (   keyboardEvent.keyCode === 39 )  { 
      playerMesh.position.x += moveDistance;
    }
    if ( keyboardEvent.keyCode === 38 ) { 
      playerMesh.position.z -= moveDistance;
    }
    if ( keyboardEvent.keyCode === 40 ) { 
      playerMesh.position.z += moveDistance;
    }
    else if (keyboardEvent.keyCode === 32) {
      playerMesh.position.y -= moveDistance;
      
    }

    var originPoint = playerMesh.position.clone();
    for (var vertexIndex = 0; vertexIndex < playerMesh.geometry.vertices.length; vertexIndex++)
    {		
      var localVertex = playerMesh.geometry.vertices[vertexIndex].clone();

      var globalVertex = localVertex.applyMatrix4( playerMesh.matrix );

      var directionVector = globalVertex.sub( playerMesh.position );

      var raycast = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );

      var collisions = raycast.intersectObjects( collidableObjects );

      if (collisions.length > 0 && collisions[0].distance < directionVector.length()) {
        console.log("Collision Detected");
        break;

      } 

    }	

  }

  }
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera)
    update();
  }
window.addEventListener('keydown', onKeyDown, false)
window.addEventListener('keyup', onKeyUp, false)
function onKeyDown(event) {
  keyboardEvent = event;
  pressed = true;

}
function onKeyUp(event) {
  pressed = false;
  keyboardEvent = event;
}


animate()
