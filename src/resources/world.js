import Stats from '../../js/Stats.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js'; 

// variable declaration
export let clock, scene, camera, renderer, stats;

// Generic temporary transform to begin
export let manager = new THREE.LoadingManager();

export function createWorld() {
  let materialArray = [];

  clock = new THREE.Clock();

  // new Three.js scene
  scene = new THREE.Scene();

  // camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.set(0, 30, 70);

  // hemisphere light
  let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
  hemiLight.color.setHSL(0.6, 0.6, 0.6);
  hemiLight.groundColor.setHSL(0.1, 1, 0.4);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  // directional Light
  let dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(-10, 100, 50);
  dirLight.position.multiplyScalar(100);
  scene.add(dirLight);

  dirLight.castShadow = true;

  dirLight.shadow.mapSize.width = 4096;
  dirLight.shadow.mapSize.height = 4096;

  let d = 200;

  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;

  dirLight.shadow.camera.far = 15000;

  // Setup the renderer
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor( 0x000000, 0 );
  document.body.appendChild(renderer.domElement);

  stats = new Stats();
  document.body.appendChild(stats.domElement);

  renderer.outputEncoding = THREE.sRGBEncoding;

  renderer.shadowMap.enabled = true;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 100;
  controls.maxDistance = 400;
  controls.minPolarAngle = 0; // radians
  controls.maxPolarAngle = 1.5; // radians

  let texture_ft = new THREE.TextureLoader().load('../../assets/daylightBox/mystic_ft.jpg');
  let texture_bk = new THREE.TextureLoader().load('../../assets/daylightBox/mystic_bk.jpg');
  let texture_up = new THREE.TextureLoader().load('../../assets/daylightBox/mystic_up.jpg');
  let texture_dn = new THREE.TextureLoader().load('../../assets/daylightBox/mystic_dn.jpg');
  let texture_lf = new THREE.TextureLoader().load('../../assets/daylightBox/mystic_lf.jpg');
  let texture_rt = new THREE.TextureLoader().load('../../assets/daylightBox/mystic_rt.jpg');
  
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft}));
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk}));
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_up}));
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn}));
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_rt}));
  materialArray.push(new THREE.MeshBasicMaterial({map: texture_lf}));

  for (let i = 0; i < 6; i++)　{
    materialArray[i].side = THREE.BackSide;

    let skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
    let skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);
    animate();
  }
}

export function animate() {
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}

// export function dumpObject(obj, lines = [], isLast = true, prefix = '') {
//   const localPrefix = isLast ? '└─' : '├─';
//   lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
//   const newPrefix = prefix + (isLast ? '  ' : '│ ');
//   const lastNdx = obj.children.length - 1;
//   obj.children.forEach((child, ndx) => {
//     const isLast = ndx === lastNdx;
//     dumpObject(child, lines, isLast, newPrefix);
//   });
//   return lines;
// }
