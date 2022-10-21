import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import vert from './Shader/water/vertex.glsl'
import frag from './Shader/water/fragment.glsl'
import { Material } from 'three'


/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


//color 
debugObject.depthColor = '#186691'
debugObject.SurfaceColor = '#9bd8ff'






/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(4, 4, 512,512 )

// Material

const waterMaterial = new THREE.ShaderMaterial({
    vertexShader : vert,
    fragmentShader: frag,

    uniforms:
    {
            
            uTime: {value: 0},
        
            uBigWavesElevation: {value: 0.2},
            uBigWavesFrequency: {value: new THREE.Vector2(1.319,2.444)},
            uBigWavesSpeed: {value: 0.209},



            

            uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
            uSurfaceColor: {value: new THREE.Color(debugObject.SurfaceColor)},
            uColorOffset: { value:0.08},
            uColorMultiplier: {value: 5}
    }




})

//debug

gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0.018).max(1).step(0.001).name("Wave Elevation")
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0.0).max(10).step(0.001).name("FrequencyX")
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0.0).max(10).step(0.001).name("FrequencyY")
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0.0).max(2.5).step(0.001).name("Wave Speed").onFinishChange(()=>{ waterMaterial.uniforms.uBigWavesSpeed.value})
gui.addColor(debugObject, 'depthColor', 'value').name("Color in Depth").onChange(()=> { waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)})
gui.addColor(debugObject, 'SurfaceColor', 'value').name("Color on Surface").onChange(()=> { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.SurfaceColor)})
gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0.0).max(1).step(0.001).name("Color Offset")
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0.0).max(10).step(0.1).name("Color Multiplier")


// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

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
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 0)

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //update uTime 
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()