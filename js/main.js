/*
import * as THREE from '/js/three.js';
import { GLTFLoader } from '/js/GLTFLoader.js';
import { OrbitControls } from '/js/OrbitControls.js';
import { DRACOLoader } from '/js/DRACOLoader.js';
import Stats from '/js/stats.module.js';
import { MeshSurfaceSampler } from '/js/MeshSurfaceSampler.js';
import { TWEEN } from '/js/tween.module.min.js';
*/

const loc='https://miyinan.github.io/livestock-disease-ethiopia';

import * as THREE from 'https://miyinan.github.io/livestock-disease-ethiopia/js/three.js';
import { GLTFLoader } from 'https://miyinan.github.io/livestock-disease-ethiopia/js/GLTFLoader.js';
import { OrbitControls } from 'https://miyinan.github.io/livestock-disease-ethiopia/js/OrbitControls.js';
import { DRACOLoader } from 'https://miyinan.github.io/livestock-disease-ethiopia/js/DRACOLoader.js';
import Stats from 'https://miyinan.github.io/livestock-disease-ethiopia/js/stats.module.js';
import { MeshSurfaceSampler } from 'https://miyinan.github.io/livestock-disease-ethiopia/js/MeshSurfaceSampler.js';
import { TWEEN } from 'https://miyinan.github.io/livestock-disease-ethiopia/js/tween.module.min.js';



/**
 * Debug
 */
// const stats = new Stats()
// stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom)

const y_offset=-1;
const canvas = document.querySelector('canvas.webgl')
const StateCowInfo={
    "Tigray": {a:5,b:0},
    "Afar": {a:2,b:0},
   "Amhara": {a:16,b:0},
    "Oromia": {a:25,b:0},
    "Somali": {a:4,b:0},
   "Benishangul-Gumuz": {a:0,b:4},
    "SNNPR": {a:12,b:0},
    "Gambella": {a:0,b:3},
    "Harari": {a:0,b:1},
   "Dire-Dawa": {a:0,b:1}
}

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const loadingManager = new THREE.LoadingManager();

const progressContainer = document.getElementById("progress");
const progressBar = document.getElementById("progress-bar");

loadingManager.onProgress = function(url, loaded, total) {
    progressBar.style.width = (loaded / total) * 100 + "%";
    console.log( 'Loading file: ' + url + '.\nLoaded ' + loaded + ' of ' + total + ' files.' );
}
loadingManager.onLoad = function(url, loaded, total){
    progressContainer.style.display = "none";
    document.getElementById("start-button").style.display = "block";
    console.log( 'Loading complete!');
    
}
loadingManager.onError = function ( url ) {
	console.log( 'There was an error loading ' + url );
};

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('js/draco/');
//dracoLoader.setDecoderConfig({type: 'js'}); // (Optional) Override detection of WASM support.

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader);

// Models

var island;
gltfLoader.load( 
    loc+'/models/island.glb',
    function(gltf){
        island = gltf.scene;
       gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(island)
        island.translateY(y_offset)
        
});

var car; //scooter
gltfLoader.load(
    loc+'/models/scooter.glb', function(gltf){
        car = gltf.scene;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(car);
        car.scale.set(.32,.32,.32);
        car.translateY(y_offset)
});

//load grass
gltfLoader.load(
    loc+'/models/to-grow.glb', 
    function(gltf){
        var surface = gltf.scene.children[0];
        var sampler = new MeshSurfaceSampler(surface).build();
        /* Sample the coordinates */
        const tempPosition = new THREE.Vector3();
        const tempObject = new THREE.Object3D();
        //scene.add( surface);
        //surface.translateY(y_offset)


gltfLoader.load(
    loc+'/models/grass_new.glb', 
    function(gltf){
    var grass = gltf.scene.getObjectByName( 'grass');
    let grassMaterial = new THREE.MeshLambertMaterial();
    const color = new THREE.Color();
    const grassPalette = [ 0x41993A, 0x4DA83C, 0x95E793, 0x56E74A,0x96C779];
    scene.add(grass)
    grass.translateY(y_offset)

        for ( let i = 0; i < 300; i ++ ) {
                sampler.sample(tempPosition);
                tempObject.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
                tempObject.rotation.y = Math.random() * Math.PI;
                tempObject.scale.setScalar(Math.random() * .002 + .001);
                
                tempObject.updateMatrix();

                color.setHex( grassPalette[ Math.floor( Math.random() * grassPalette.length ) ] );

                
                var instancedGrass = new THREE.InstancedMesh( grass.geometry, grassMaterial, 1 );
                instancedGrass.setMatrixAt(0, tempObject.matrix);
                instancedGrass.setColorAt(0, color.convertSRGBToLinear());

                instancedGrass.castShadow = true;
                instancedGrass.receiveShadow = true;
                scene.add( instancedGrass);
                instancedGrass.translateY(y_offset+0.08)
    }
});
});


//load stone
gltfLoader.load(
    loc+'/models/for-stone.glb', 
    function(gltf){
        var surface = gltf.scene.children[0];
        var sampler = new MeshSurfaceSampler(surface).build();
        /* Sample the coordinates */
        const tempPosition = new THREE.Vector3();
        const tempObject = new THREE.Object3D();
        scene.add( surface);
        surface.translateY(y_offset)


gltfLoader.load(
    loc+'/models/stone1.glb', 
    function(gltf){
    var grass = gltf.scene.getObjectByName( 'stone1');
    let grassMaterial = new THREE.MeshLambertMaterial();
    const color = new THREE.Color();
    const grassPalette = [ 0xBEBEBD,0xAAA9A7, 0x908F8B];
    scene.add(grass)
    grass.translateY(y_offset)

        for ( let i = 0; i < 20; i ++ ) {
                sampler.sample(tempPosition);
                tempObject.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
                tempObject.rotation.y = Math.random() * Math.PI;
                tempObject.scale.setScalar(Math.random() * .0005 + .001);
                
                tempObject.updateMatrix();

                color.setHex( grassPalette[ Math.floor( Math.random() * grassPalette.length ) ] );

                
                var instancedGrass = new THREE.InstancedMesh( grass.geometry, grassMaterial, 1 );
                instancedGrass.setMatrixAt(0, tempObject.matrix);
                instancedGrass.setColorAt(0, color.convertSRGBToLinear());

                instancedGrass.castShadow = true;
                instancedGrass.receiveShadow = true;
                scene.add( instancedGrass);
                instancedGrass.translateY(y_offset)
    }
});

gltfLoader.load(
    loc+'/models/stone2.glb', 
    function(gltf){
    var grass = gltf.scene.getObjectByName( 'stone2');
    let grassMaterial = new THREE.MeshLambertMaterial();
    const color = new THREE.Color();
    const grassPalette = [ 0xBEBEBD,0xAAA9A7, 0x908F8B];
    scene.add(grass)
    grass.translateY(y_offset)

        for ( let i = 0; i < 10; i ++ ) {
                sampler.sample(tempPosition);
                tempObject.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
                tempObject.rotation.y = Math.random() * Math.PI;
                tempObject.scale.setScalar(Math.random() * .0005 + .001);
                
                tempObject.updateMatrix();

                color.setHex( grassPalette[ Math.floor( Math.random() * grassPalette.length ) ] );

                
                var instancedGrass = new THREE.InstancedMesh( grass.geometry, grassMaterial, 1 );
                instancedGrass.setMatrixAt(0, tempObject.matrix);
                instancedGrass.setColorAt(0, color.convertSRGBToLinear());

                instancedGrass.castShadow = true;
                instancedGrass.receiveShadow = true;
                scene.add( instancedGrass);
                instancedGrass.translateY(y_offset)
    }
});

});



//load cow due to state
gltfLoader.load(
   loc+'/models/state.glb', 
    function(gltf){
        for(var statename in StateCowInfo){
            console.log("statename: " + statename + " ,value: " + StateCowInfo[statename]);
            var stateCowInfo=StateCowInfo[statename]
            console.log("a:" + stateCowInfo["a"]);
            console.log("b:" + stateCowInfo["b"]);
            placeCowInLine(statename,stateCowInfo["a"],stateCowInfo["b"])           
        }
        
        function placeCowInLine(statename,atype,btype){
            var surface=gltf.scene.getObjectByName(statename);
            var sampler = new MeshSurfaceSampler(surface).build();
            /* Sample the coordinates */
            const tempPosition = new THREE.Vector3();
            const tempObject = new THREE.Object3D();
            //scene.add( surface);
            surface.translateY(y_offset)

            gltfLoader.load(
               // '/models/grass-1.glb', 
            loc+'/models/new_cow.glb', 
            function(gltf){
            var tree = gltf.scene.getObjectByName( 'cow');
            //var tree = gltf.scene.getObjectByName( 'grass-1');
            let treeMaterial = new THREE.MeshLambertMaterial();
            const color = new THREE.Color();
            const cowPalette = [ 0xF9D7B4, 0xC5A073,0x754029,0xBE6C39,0xF78656];

            //type A
            for ( let i = 0; i < atype; i ++ ) {
                sampler.sample(tempPosition);
                tempObject.position.set(tempPosition.x, tempPosition.y+0.426, tempPosition.z);
                tempObject.rotation.y = Math.random() * Math.PI;
                tempObject.scale.setScalar(.4);
                tempObject.updateMatrix();

                color.setHex( cowPalette[ Math.floor( Math.random() * cowPalette.length ) ] );

                var instancedTree = new THREE.InstancedMesh( tree.geometry, treeMaterial, 1 );
                instancedTree.setMatrixAt(0, tempObject.matrix);
                instancedTree.setColorAt(0, color.convertSRGBToLinear());

                instancedTree.castShadow = true;
                instancedTree.receiveShadow = true;
                scene.add( instancedTree );
                instancedTree.translateY(y_offset)
            }

            //Type B
            for ( let i = 0; i < btype; i ++ ) {
            sampler.sample(tempPosition);
            tempObject.position.set(tempPosition.x, tempPosition.y+0.266, tempPosition.z);
            tempObject.rotation.y = Math.random() * Math.PI;
            tempObject.scale.setScalar(.25);
            tempObject.updateMatrix();

            //color.setHex( Palette[1] ); //set color of B type
            color.setHex( cowPalette[ Math.floor( Math.random() * cowPalette.length ) ] );

            var instancedTree = new THREE.InstancedMesh( tree.geometry, treeMaterial, 1 );
            instancedTree.setMatrixAt(0, tempObject.matrix);
            instancedTree.setColorAt(0, color.convertSRGBToLinear());

            instancedTree.castShadow = true;
            instancedTree.receiveShadow = true;
            scene.add( instancedTree );
            instancedTree.translateY(y_offset)
            }
            }
            );
        }
    }
);






//load worker
const shirtColor = new THREE.Color();
const shirtPalette = [ 0xFA6D6D, 0xffffff ];
const skinPalette = [ 0x8d5524, 0xc68642, 0xe0ac69, 0xf1c27d, 0xffdbac ];

for ( let i = 0; i < 8; i ++ ) {
    gltfLoader.load(
        loc+'/models/man.glb',
        function(gltf){
        var man = gltf.scene;
        man.scale.set(.49,.49,.49);
        man.position.set(-8.5+ Math.random()*2-1, -0.01, 4.5 + Math.random()*2-1);
        man.rotation.y = Math.random()*36;
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        gltf.scene.getObjectByName( "shirt" ).traverse( function( node ) {
            if ( node.isMesh ) { 
                shirtColor.setHex( shirtPalette[ Math.floor( Math.random() * shirtPalette.length ) ] );
                node.material.color.set( shirtColor ).convertSRGBToLinear();
                
            }
        } );
        gltf.scene.getObjectByName( "body" ).traverse( function( node ) {
            if ( node.isMesh ) { 
                shirtColor.setHex( skinPalette[ Math.floor( Math.random() * skinPalette.length ) ] );
                node.material.color.set( shirtColor ).convertSRGBToLinear();
            }
        } );
        scene.add(man);
        man.translateY(y_offset)
    });
    }


//load walkingman==cyclist
var cyclist;
var mixer2;
var action2;
gltfLoader.load(
    loc+'/models/black-x.glb', 
    //'/models/cyclist.glb', 
    function(gltf){
        cyclist = gltf.scene;
        cyclist.scale.set(.33,.33,.33);
        //cyclist.rotation.y = Math.PI/4;

        //Playing Animation
        mixer2 = new THREE.AnimationMixer( cyclist );
        action2 = mixer2.clipAction( gltf.animations[ 0 ] );
        action2.timeScale = 0;
        action2.play();
        
        gltf.scene.traverse( function( node ) {
            if ( node.isMesh ) { 
                node.castShadow = true;
                node.receiveShadow = true;
            }
        } );
        scene.add(cyclist);
        cyclist.translateY(y_offset)
});

// Camera
const camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height, 1, 90);
camera.position.set(0,30,30);
//camera.position.set(0,30,30);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0,0,0);
controls.enablePan = false;
controls.minPolarAngle = Math.PI/2.4;
controls.maxPolarAngle = Math.PI/2.15;
controls.minDistance = 16;
controls.maxDistance = 26;
controls.enableDamping = true;
controls.rotateSpeed = 0.25;

// Renderer
THREE.Cache.enabled = true;

// let AA = true
// if (window.devicePixelRatio > 1) {
//   AA = false
// }

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor( 0xffffff, 0);
scene.background = null;

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})


document.getElementById("start-button").onclick = function() {
    document.getElementById("loadingscreen").classList.add("hidden");

    new TWEEN.Tween(camera.position)
    .to( { x: 0, y:3, z:16 }, 1000)
    .easing(TWEEN.Easing.Cubic.Out)
    .start()
  ;
}

// Lights
const hemiLight = new THREE.HemisphereLight( 0xfff, 0xfff, 0.6 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );

let shadowMapSize = 13;
const sunLight = new THREE.DirectionalLight(0xffffff, 1, 100);
sunLight.position.set(0,12,12);
sunLight.color.setHSL( 0.1, 1, 0.95 );
sunLight.visible = true;
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5; 
sunLight.shadow.camera.far = shadowMapSize*2;
sunLight.shadow.camera.top = shadowMapSize;
sunLight.shadow.camera.bottom = -shadowMapSize;
sunLight.shadow.camera.left = -shadowMapSize;
sunLight.shadow.camera.right = shadowMapSize;
sunLight.shadow.normalBias = 0.02;
scene.add(sunLight);
scene.add( sunLight.target );

 //const helper = new THREE.CameraHelper( sunLight.shadow.camera );
 //scene.add( helper );

const spotLight = new THREE.SpotLight(0xffffff, 4, 6, Math.PI/4, 1, 1);
spotLight.position.set( 0, 3.5, 0 );
spotLight.visible = false;
spotLight.castShadow = false;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 0.5; 
spotLight.shadow.camera.far = 2;
spotLight.shadow.normalBias = 0.02;
scene.add( spotLight );
scene.add( spotLight.target );

// const helper2 = new THREE.CameraHelper( spotLight.shadow.camera );
// scene.add( helper2 );

// Cursor
const cursor = {
    x: 0,
    y: 0
}


window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})


let scrollSpeed = (function(){

    let lastPos, newPos, delta
  
    function clear() {
      lastPos = null;
      delta = 0;
    }
  
    clear();
    
    return function(){
      newPos = controls.getAzimuthalAngle();
      if ( lastPos != null ){ // && newPos < maxScroll 
        delta = newPos -  lastPos;
      }
      if (delta == 1 || delta == -1 ) delta = 0;
      if (delta < -1) { 
          delta = -delta; 
        }
      //else if (delta > 1) cyclist.rotation.z = 0;
      if ( action2 )  action2.timeScale = delta*160;

      lastPos = newPos;
      return delta;
    
    };
})();


//Interaction with Objects

// window.addEventListener('click', onDocumentMouseDown, false);

// var raycaster = new THREE.Raycaster();
// var mouse = new THREE.Vector2();
// function onDocumentMouseDown( event ) {
// event.preventDefault();
// mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
// mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
// raycaster.setFromCamera( mouse, camera );
// var intersects = raycaster.intersectObjects( scene.children );
// if ( intersects.length > 0 ) {
//     console.log (intersects[1].object.name);
// }}
    



/**
 * Animate
 */
let azimuthalAngle;
let cyclePos = 0;
let i = 0;

const popups = document.getElementsByClassName("popup");
const popupstate = document.getElementsByClassName("popupstate");
const clock = new THREE.Clock(); 


const tick = () =>
 {
    // Update controls
    controls.update()

    if ( car ) {
        car.position.x = -Math.sin(i * Math.PI) * 11.8;
        car.position.z = -Math.cos(i * Math.PI) * 11.8;
        car.rotation.y = i * Math.PI + Math.PI/2;
        i -= 0.001;
    }

    // Update cyclist position
    azimuthalAngle = controls.getAzimuthalAngle();
    cyclePos = azimuthalAngle / (Math.PI*2);
    if ( cyclePos < 0 ) {
        cyclePos = 0.5 + ( 0.5 + cyclePos);
    }

    spotLight.position.x = Math.sin(azimuthalAngle) * 12.4;
    spotLight.position.z = Math.cos(azimuthalAngle) * 12.4;
    spotLight.target.position.x = Math.sin(azimuthalAngle) * 9;
    spotLight.target.position.z = Math.cos(azimuthalAngle) * 9;

    if ( cyclist ) {
        cyclist.position.x = Math.sin(azimuthalAngle) * 11.4;
        cyclist.position.z = Math.cos(azimuthalAngle) * 11.4;
        cyclist.rotation.y = azimuthalAngle;
    }

    if (azimuthalAngle >= 0.1 || azimuthalAngle < -0.1) {
        document.getElementById("instructions").classList.add("hidden");
      }


    for (let i = 0; i < popups.length; i++ ){
        if (cyclePos >= 0.025 + i/popups.length && cyclePos < 0.08 + i/popups.length) {
            popups[i].classList.remove("hidden");
            popups[i].classList.add("visible");
        }
        else {
            popups[i].classList.add("hidden");
            popups[i].classList.remove("visible");
        }
    }

    //test for state

    for (let i = 0; i < popupstate.length; i++ ){
        if (cyclePos >= i/popupstate.length && cyclePos < (i+1)/popupstate.length) {
            popupstate[i].classList.remove("hidden");
            popupstate[i].classList.add("visible");
        }
        else {
            popupstate[i].classList.add("hidden");
            popupstate[i].classList.remove("visible");
        }
    }


    // Animation Mixer
    const delta = clock.getDelta();
    if ( mixer2 ) mixer2.update( delta );

    scrollSpeed();

    TWEEN.update();

    // Render
    // stats.begin()
    renderer.render(scene, camera)
    // stats.end()

 
     // Call tick again on the next frame
     window.requestAnimationFrame(tick)
 }
 
 tick()
