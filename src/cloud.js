import * as THREE from 'three';

export default class Clouds {

    constructor(scene) {
        this.scene = scene;
        this.setUpShader();
        this.init();
    }

    setUpShader() {
        this.vertexShader = `

        precision highp float;
		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;
		attribute vec3 position;
		attribute vec3 offset;
		attribute vec2 uv;
		attribute vec4 orientation;
		varying vec2 vUv;

		vec3 applyQuaternionToVector( vec4 q, vec3 v ){
			return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
		}
		void main() {
			vec3 vPosition = applyQuaternionToVector( orientation, position );
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(offset, 1.0 );
        }
        `;

        this.fragmentShader = `

        precision highp float;
		uniform sampler2D map;
		varying vec2 vUv;
		void main() {
			gl_FragColor = texture2D( map, vUv );
		}
        `
    }

    init() {
        let planeGeometry = new THREE.PlaneBufferGeometry(1,1,1,1);

        let geometry = new THREE.InstancedBufferGeometry();
        geometry.index = planeGeometry.index;
        geometry.attributes.position = planeGeometry.attributes.position;
        geometry.attributes.uv = planeGeometry.attributes.uv;

        var offsetAttribute, orientationAttribute;

        var instances = 10;
    
        var offsets = [];
        var orientations = [];
        var vector = new THREE.Vector4();
        var x, y, z, w;
        for ( var i = 0; i < instances; i ++ ) {
            // offsets
            x = Math.random() * 10 - 5;
            y = Math.random() * 10 - 5;
            z = Math.random() * 10 - 5;
            vector.set( x, y, z, 0 ).normalize();
            vector.multiplyScalar( 5 ); // move out at least 5 units from center in current direction
            offsets.push( x + vector.x, y + vector.y, z + vector.z );
            // orientations
            x = Math.random() * 2 - 1;
            y = Math.random() * 2 - 1;
            z = Math.random() * 2 - 1;
            w = Math.random() * 2 - 1;
            vector.set( x, y, z, w ).normalize();
            orientations.push( vector.x, vector.y, vector.z, vector.w );
        }
        offsetAttribute = new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 );
        orientationAttribute = new THREE.InstancedBufferAttribute( new Float32Array( orientations ), 4 ).setDynamic( true );
        geometry.addAttribute( 'offset', offsetAttribute );
        // geometry.addAttribute( 'orientation', orientationAttribute );

        var material = new THREE.RawShaderMaterial( {
            uniforms: {
                map: { value: new THREE.TextureLoader().load( 'img/cloud.png' ) }
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader
        } );

        let mesh = new THREE.Mesh( geometry, material );
        this.scene.add( mesh );
    }
}