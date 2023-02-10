import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Raycaster } from 'three'

/**
 * Base
 */
// Debug


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


const raycaster = new THREE.Raycaster()


/**
 * Galaxy
 */

let geometry = null
let material = null
let points = null

const generateGalaxy = () =>
{
    // Destroy old galaxy
    if(points !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(59380 * 6)
    const colors = new Float32Array(59380 * 6)

    const colorInside = new THREE.Color('#784284')
    const colorOutside = new THREE.Color('#784284')

    for(let i = 0; i < 59380; i++)
    {
        // Position
        const i3 = i * 3

        const radius = Math.random() * 12

        const spinAngle = radius * 6
        const branchAngle = (i % 2) / 2 * Math.PI * 2
        
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : - 1) * .888 * radius
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : - 1) * .888 * radius
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : - 1) * .888 * radius

        positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        // Color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / 12)
        
        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    /**
     * Material
     */
    material = new THREE.PointsMaterial({
        size: .001,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

generateGalaxy()

const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/texture/matcap2.png')

/**
 * Fonts
 */

/*const fontLoader = new THREE.FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        console.log('loaded')
        const textGeometry = new THREE.TextGeometry(
            'in',
            {
                font: font,
                size: .1,
                height: .1,
                curveSegments: 40,
                bevelEnabled: true,
                bevelThickness: .01,
                bevelSize: 0.007,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()
        
        const textMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)

        text.position.x = -.25
        text.position.y = .5
        text.position.z = 0
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            //text.rotation.x += 0.001;
            text.rotation.y += 0.01;
          }
          animate();
    }
)*/

/*
Other font
*/

/*const fontLoadertwo = new THREE.FontLoader()
fontLoadertwo.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        console.log('loaded')
        const textGeometry = new THREE.TextGeometry(
            'be',
            {
                font: font,
                size: .1,
                height: .1,
                curveSegments: 40,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.007,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()
        
        const textMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)

        text.position.x = .25
        text.position.y = .5
        text.position.z = 0
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            //text.rotation.x -= 0.001;
            text.rotation.y -= 0.01;
          }
          animate();
    }
)*/


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


const cursor = {
    x: 0,
    y: 0,
    z: 3
}

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => 
{
    cursor.x = event.clientX / sizes.width - 0.5

    cursor.y = -(event.clientY / sizes.width - 0.5)

    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = (event.clientX / sizes.width) * 2 + 1
    console.log(mouse)
})

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
camera.position.x = 0
camera.position.y = 30
camera.position.z = 1
camera.lookAt(points.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = false

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#45505c'),.25)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    points.rotation.y = elapsedTime / 100;

    camera.position.x = cursor.x * -.05
    camera.position.y = cursor.y * -.05
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()