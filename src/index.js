import * as THREE from 'three';
import RendererStats from '@xailabs/three-renderer-stats';
import Stats from 'stats.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import Clouds from './cloud';

var camera, scene, renderer, controls;
var geometry, material, mesh;
const rendererStats = new RendererStats();
const stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
var clouds;
 
init();
animate();



function init() {
 
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 1;
 
    scene = new THREE.Scene();
 
    geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    material = new THREE.MeshNormalMaterial();
 
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
 
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    scene.background = new THREE.Color('grey');

    clouds = new Clouds(scene);

    

    rendererStats.domElement.style.position	= 'absolute'
    rendererStats.domElement.style.left	= '0px';
    rendererStats.domElement.style.bottom	= '0px';
    document.body.appendChild( rendererStats.domElement );

    stats.dom.style.position	= 'absolute'
    document.body.appendChild( stats.dom );

    controls = new TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
 
}
 
function animate() {
 
    requestAnimationFrame( animate );
 
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    
    controls.update();
    
 
    renderer.render( scene, camera );
    rendererStats.update(renderer);
    stats.begin();
    stats.end();
}