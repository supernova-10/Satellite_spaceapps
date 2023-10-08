// Description: This section contains the pulser for the earth section of the website


// earth 

// https://discourse.threejs.org/t/how-to-cast-shadows-from-an-outer-sphere-to-an-inner-sphere/53732

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


// general setup, boring, skip to the next comment

console.clear( );

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 30, innerWidth/innerHeight );
    camera.position.set( 0, 2, 6 );
    camera.lookAt( scene.position );

var renderer = new THREE.WebGLRenderer( {alpha: true} );
renderer.setClearColor( 0x000000, 0 );
    renderer.setSize( innerWidth, innerHeight );
    document.body.appendChild( renderer.domElement );
			
window.addEventListener( "resize", (event) => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( innerWidth, innerHeight );
});

var controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
		controls.autoRotate = true;

var ambientLight = new THREE.AmbientLight( 'white', 0.5 );
    scene.add( ambientLight );

var light = new THREE.DirectionalLight( 'white', 0.5 );
    light.position.set( 1, 1, 1 );
    scene.add( light );


// next comment



// create the texture for the clouds

var canvas = document.createElement( 'CANVAS' );
    canvas.width = 256;
    canvas.height = 128;

var context = canvas.getContext( '2d' );
    context.fillStyle = 'black';
		context.fillRect( 0, 0, 256, 128 ); 
    context.fillStyle = 'white';
		context.filter = 'blur(1px)'; 
		for( var i=0; i<40; i++ )
		{
				context.globalAlpha = Math.random();

				var x = THREE.MathUtils.randFloat( -50, 256+50 ),
						y = THREE.MathUtils.randFloat( 64-30, 64+30 ),
						r = THREE.MathUtils.randFloat( 2, 10 );
				
				context.beginPath( );
				context.arc( x, y, r, 0, 2*Math.PI );
				context.fill( );
			
				context.beginPath( );
				context.arc( x-256, y, r, 0, 2*Math.PI );
				context.fill( );
			
				context.beginPath( );
				context.arc( x+256, y, r, 0, 2*Math.PI );
				context.fill( );
		}

var cloudsMap = new THREE.CanvasTexture( canvas );
		cloudsMap.wrapS = THREE.RepeatWrapping;



// create the Earth 

var earthMap = new THREE.TextureLoader().load( EARTH ),
		earth = new THREE.Mesh(
			new THREE.SphereGeometry( 1, 64, 32 ),
    	new THREE.MeshPhongMaterial( {
					transparent: false,
					map: earthMap,
					lightMap: cloudsMap,

			} )
    );	
		earth.geometry.setAttribute( 'uv2', earth.geometry.getAttribute( 'uv' ) );
		scene.add( earth );



// create the clouds 

var clouds = new THREE.Mesh(
			new THREE.SphereGeometry( 1.2, 64, 32 ),
    	new THREE.MeshPhongMaterial( {
					transparent: true,
					opacity: 0.5,
					map: cloudsMap,
					blending: THREE.AdditiveBlending,
					side: THREE.DoubleSide,
			} )
    );	
		scene.add( clouds );



function animationLoop( t )
{
		cloudsMap.offset.set( -t/7000, 0 );

    controls.update( );
		light.position.copy( camera.position );
    renderer.render( scene, camera );
}


renderer.setAnimationLoop( animationLoop );






