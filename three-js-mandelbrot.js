import * as THREE from 'three';

let camera, scene, renderer;
let uniforms;

init();
animate();

function init() {
    // Create the camera and set the view size.
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Initialize the scene.
    scene = new THREE.Scene();

    // Set the uniforms.
    uniforms = {
        zoom: { type: 'f', value: 1.0 },
        offset: { type: 'v2', value: new THREE.Vector2(0, 0) },
        resolution: { type: 'v2', value: new THREE.Vector2() }
    };

    // Shader material.
    let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader(),
        fragmentShader: fragmentShader()
    });

    let mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    document.body.appendChild(renderer.domElement);

    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize(event) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.resolution.value.x = renderer.domElement.width;
    uniforms.resolution.value.y = renderer.domElement.height;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function vertexShader() {
    return `
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `;
}

function fragmentShader() {
    return `
        uniform float zoom;
        uniform vec2 offset;
        uniform vec2 resolution;

        const int maxIterations = 1000;

        void main() {
            vec2 c = (gl_FragCoord.xy / resolution - 0.5) * zoom - offset;
            vec2 z = vec2(0.0);
            
            int i;
            for(i = 0; i < maxIterations; i++) {
                float x = (z.x * z.x - z.y * z.y) + c.x;
                float y = 2.0 * z.x * z.y + c.y; // Corrected formula

                if((x * x + y * y) > 4.0) break;
                
                z.x = x;
                z.y = y;
            }

            float color = float(i) / float(maxIterations);
            gl_FragColor = vec4(vec3(color), 1.0);
        }
    `;
}
