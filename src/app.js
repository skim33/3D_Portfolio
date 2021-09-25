import {
  clock,
  scene,
  camera,
  renderer,
  stats,
  manager,
  createWorld,
  dumpObject
} from './resources/world.js';

import {
  setupEventHandlers,
  moveDirection
} from './resources/eventHandlers.js'

import {
  rotateCamera,
  onHover,
  onClick
} from './resources/utility.js';

import {
  createFloor,
  createGraphTitle,
  createGraphPercentage
} from './resources/graph.js';

import {
  billboardTextures,
  URL,
  timelineTexture,
  boxTexture
} from './resources/info.js';

import {
  addText,
  addPhotoOnPlane
} from './resources/surfaces.js';

let rigidBodies = [], physicsWorld, ballObject = null, tmpTrans = null, bar = new Array(), objectsWithLinks = [];

const STATE = {DISABLE_DEACTIVATION: 4};

export const bar_info = [
  {name: "Html/CSS", value: 90},
  {name: "JS", value: 80},
  {name: "Python", value: 70},
  {name: "C++", value: 60},
  {name: "Redux", value: 60},
  {name: "Git", value: 60},
  {name: "Linux", value: 60},
  {name: "Goal", value: 100}
];

export let cursorHoverObjects = [];

Ammo().then(start);

function start() {
  tmpTrans = new Ammo.btTransform();

  setupPhysicsWorld();

  createWorld();

  createPlane();
  createBall();

  createWallX(87.5, 1.75, 0);
  createWallX(-87.5, 1.75, 0);
  createWallZ(0, 1.75, 87.5);
  createWallZ(0, 1.75, -87.5);

  loadNameText();
  loadDeveloperText();

  createFloor();
  createBar();
  createGraphTitle(0, -5);
  createGraphPercentage(0, -5);

  createGraphTitle(1, 9);
  createGraphPercentage(1, 9);

  createGraphTitle(2, 17);
  createGraphPercentage(2, 17);

  createGraphTitle(3, 28);
  createGraphPercentage(3, 28);

  createGraphTitle(4, 37);
  createGraphPercentage(4, 37);

  createGraphTitle(5, 48);
  createGraphPercentage(5, 48);

  createGraphTitle(6, 58);
  createGraphPercentage(6, 58);

  createGraphTitle(7, 68);
  createGraphPercentage(7, 68);

  wallOfBricks();

  createBillboard(-80, 2.5, -70, billboardTextures.portfolio_1, URL.main, Math.PI * 0.22);
  createBillboard(-50, 2.5, -78, billboardTextures.portfolio_2, URL.main, Math.PI * 0.17);
  createBillboard(-20, 2.5, -75, billboardTextures.portfolio_3, URL.main, Math.PI * 0.15);

  createBox(12, 2, 25, 4, 4, 1, boxTexture.github, URL.github, 0x000000, true);
  createBox(18, 2, 25, 4, 4, 1, boxTexture.email, URL.email, 0x000000, true);

  addText(35, 0.01, -30, 'SKILLS', 4, 0x000000);
  addText(-45, 0.01, -30, 'PORTFOLIO', 4, 0x000000);
  addText(-45, 0.01, 10, 'Timeline', 4, 0x000000);
  addText(-45, 0.01, -50, 'Click On Billboards To Visit', 3, 0x292929);
  addText(-45, 0.01, -45, 'Guest - Email: guest@guest.com', 2, 0x292929);
  addText(-45, 0.01, -40, '- Password: 123123', 2, 0x292929);
  addText(56.5, 0.01, 75, '●', 5, 0x064eb2);
  addText(56.8, 0.01, 69, '^', 3, 0x313031);
  addText(56.8, 0.01, 67, '^', 3, 0x313031);
  addText(56.8, 0.01, 65, '^', 3, 0x313031);
  addText(8.5, 0.01, 10, 'Use the arrow keys on your', 1.5,  0x000000);
  addText(8.5, 0.01, 13, 'keyboard to move the ball', 1.5,  0x000000);
  addText(8.5, 0.01, -3, '↑', 1.5,  0x000000);
  addText(6, 0.01, 0, '←', 1.5,  0x000000);
  addText(11, 0.01, 0, '→', 1.5,  0x000000);
  addText(8.5, 0.01, 3, '↓', 1.5,  0x000000);
  addText(1, 0.01, 25, 'Click on the logo to:', 1,  0x000000);
  addText(12, 0.01, 28, 'visit', 1,  0x000000);
  addText(12, 0.01, 30, 'Github', 1,  0x000000);
  addText(18, 0.01, 28, 'email', 1,  0x000000);
  addText(18, 0.01, 30, 'me', 1,  0x000000);

  addPhotoOnPlane(-50, 0.025, 45, 60, 70, timelineTexture.main);

  addStatue();

  setupEventHandlers();
  renderFrame();

  document.getElementById("start-button").addEventListener('click', loadingPageEventListener);
  window.addEventListener('resize', onWindowReseize, false);
  document.addEventListener('click', onClick);
  document.addEventListener('mousemove', onHover);
}

function onWindowReseize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function loadingPageEventListener() {
  setTimeout(() => {
    document.getElementById('preload').style.display = 'none';
  }, 750);

  let startButton = document.getElementById("start-button");
  startButton.removeEventListener('click', loadingPageEventListener);
}

function setupPhysicsWorld() {
    let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
        dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration), 
        overlappingPairCache = new Ammo.btDbvtBroadphase(),
        constraintSolver = new Ammo.btSequentialImpulseConstraintSolver(); 

    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, constraintSolver, collisionConfiguration);

    physicsWorld.setGravity(new Ammo.btVector3(0, -50, 0));
}

function createPlane() {
  let pos = {x: 0, y: -0.25, z: 0};
  let scale = {x: 175, y: 0.5, z: 175};
  let quat = {x: 0, y: 0, z: 0, w: 1};
  let mass = 0;

  // Three.js section
  let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({color: 0xffffff, opacity: 0.75, transparent: true}));

  blockPlane.position.set(pos.x, pos.y, pos.z);
  blockPlane.scale.set(scale.x, scale.y, scale.z);
  blockPlane.receiveShadow = true;
  scene.add(blockPlane);

  // Ammo.js section
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x,pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  let motionState = new Ammo.btDefaultMotionState(transform);

  let colShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
  colShape.setMargin(0.05);

  let localInertia = new Ammo.btVector3(0, 0, 0);
  colShape.calculateLocalInertia(mass, localInertia);

  let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
  let body = new Ammo.btRigidBody(rbInfo);

  body.setFriction(10);
  body.setRollingFriction(10);

  physicsWorld.addRigidBody(body);
}

function createWallX(x, y, z) {
  const wallScale = {x: 0.125, y: 4, z: 175};

  const wall = new THREE.Mesh(new THREE.BoxBufferGeometry(wallScale.x, wallScale.y, wallScale.z), new THREE.MeshStandardMaterial({color: 0xffffff, opacity: 0.75, transparent: true}));

  wall.position.x = x;
  wall.position.y = y;
  wall.position.z = z;

  wall.receiveShadow = true;

  scene.add(wall);

  addRigidPhysics(wall, wallScale);
}

function createWallZ(x, y, z) {
  const wallScale = {x: 175, y: 4, z: 0.125};

  const wall = new THREE.Mesh(new THREE.BoxBufferGeometry(wallScale.x, wallScale.y, wallScale.z), new THREE.MeshStandardMaterial({color: 0xffffff, opacity: 0.75, transparent: true}));

  wall.position.x = x;
  wall.position.y = y;
  wall.position.z = z;

  wall.receiveShadow = true;

  scene.add(wall);

  addRigidPhysics(wall, wallScale);
}

function addRigidPhysics(item, itemScale) {
  let pos = { x: item.position.x, y: item.position.y, z: item.position.z };
  let scale = { x: itemScale.x, y: itemScale.y, z: itemScale.z };
  let quat = { x: 0, y: 0, z: 0, w: 1 };
  let mass = 0;
  var transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(
    new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
  );

  var localInertia = new Ammo.btVector3(0, 0, 0);
  var motionState = new Ammo.btDefaultMotionState(transform);
  let colShape = new Ammo.btBoxShape(
    new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5)
  );
  colShape.setMargin(0.05);
  colShape.calculateLocalInertia(mass, localInertia);
  let rbInfo = new Ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    colShape,
    localInertia
  );
  let body = new Ammo.btRigidBody(rbInfo);
  body.setActivationState(STATE.DISABLE_DEACTIVATION);
  body.setCollisionFlags(2);
  physicsWorld.addRigidBody(body);
}

function createBall(){
  let pos = {x: 8.75, y: 0, z: 0};
  let radius = 2;
  let quat = {x: 0, y: 0, z: 0, w: 1};
  let mass = 3;

  //threeJS Section
  let ball = ballObject = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), new THREE.MeshPhongMaterial({color: 0xff0505}));

  ball.geometry.computeBoundingSphere();
  ball.geometry.computeBoundingBox();
  ball.position.set(pos.x, pos.y, pos.z);
  
  ball.castShadow = true;
  ball.receiveShadow = true;

  scene.add(ball);

  //Ammojs Section
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
  transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
  let motionState = new Ammo.btDefaultMotionState( transform );

  let colShape = new Ammo.btSphereShape( radius );
  colShape.setMargin( 0.05 );

  let localInertia = new Ammo.btVector3( 0, 0, 0 );
  colShape.calculateLocalInertia( mass, localInertia );

  let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
  let body = new Ammo.btRigidBody( rbInfo );

  body.setRollingFriction(10);

  body.setActivationState(STATE.DISABLE_DEACTIVATION);

  physicsWorld.addRigidBody( body );
  
  ball.userData.physicsBody = body;
  ballObject.userData.physicsBody = body;

  rigidBodies.push(ball);
  rigidBodies.push(ballObject);
}

function createBar() {
  for (var i = 0; i < bar_info.length; i += 1) {
    var graph_geometry = new THREE.BoxGeometry(2, 2, 2);
    graph_geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 1, 1));

    var graph_material = new THREE.MeshPhongMaterial({
      color: 0x1176c5,
    });

    var graph = new THREE.Mesh(graph_geometry, graph_material);
    
    graph.position.x = i * 10; // space between bars
    graph.position.z = -60;
    graph.name = bar_info[i].name;
    graph.value = bar_info[i].value;
    graph.castShadow = true;
    graph.receiveShadow = true;

    graph.rotation.y = THREE.Math.degToRad(-15);

    scene.add(graph);
    bar.push(graph);

    //Ammo.js Physics
    let transform = new Ammo.btTransform();
    transform.setIdentity(); // sets safe default values
    transform.setOrigin(new Ammo.btVector3(graph.position.x, 0, graph.position.z));
    transform.setRotation(
      new Ammo.btQuaternion(0, 0, 0, 1)
    );
    let motionState = new Ammo.btDefaultMotionState(transform);

    //setup collision box
    let colShape = new Ammo.btBoxShape(
      new Ammo.btVector3(2 * 0.5, 10 * 0.5, 2 * 0.5)
    );
    colShape.setMargin(0.05);

    let localInertia = new Ammo.btVector3(0, 0, 0);
    colShape.calculateLocalInertia(0, localInertia);

    //  provides information to create a rigid body
    let rigidBodyStruct = new Ammo.btRigidBodyConstructionInfo(
      0,
      motionState,
      colShape,
      localInertia
    );
    let body = new Ammo.btRigidBody(rigidBodyStruct);
    body.setFriction(10);
    body.setRollingFriction(10);

    // add to world
    physicsWorld.addRigidBody(body);
  }

  for (var i = 0; i < bar.length; i++) {
    var tween = new TweenMax.to(bar[i].scale, 1, {
      ease: Elastic.easeOut.config(1, 1),
      y: bar[i].value / 10,
      delay: i * 0.25
    });
  }
}

function moveBall() {
  let scalingFactor = 20;
  let moveX = moveDirection.right - moveDirection.left;
  let moveZ = moveDirection.back - moveDirection.forward;
  let moveY = 0;

  if (ballObject.position.y < 2.01) {
    moveX = moveDirection.right - moveDirection.left;
    moveZ = moveDirection.back - moveDirection.forward;
    moveY = 0;
  } else {
    moveX = moveDirection.right - moveDirection.left;
    moveZ = moveDirection.back - moveDirection.forward;
    moveY = -0.25;
  }

  if (moveX == 0 && moveY == 0 && moveZ == 0) return;

  let resultantImpulse = new Ammo.btVector3(moveX, moveY, moveZ);
  resultantImpulse.op_mul(scalingFactor);
  let physicsBody = ballObject.userData.physicsBody;
  physicsBody.setLinearVelocity(resultantImpulse);
}

function loadNameText() {
  const text_loader = new THREE.FontLoader();

  text_loader.load('../assets/Inter_Regular.json', function(font){
    let xMid, text;

    var color = 0xfffc00;

    var textMaterials = [
      new THREE.MeshBasicMaterial({color: color}),
      new THREE.MeshPhongMaterial({color: color})
    ];

    const geometry = new THREE.TextGeometry('Shawn Kim', {
      font: font,
      size: 4,
      height: 0.5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.11,
      bevelOffset: 0,
      bevelSegments: 1
    });

    geometry.computeBoundingBox();
    geometry.computeVertexNormals();

    xMid = -0.65 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

    geometry.translate(xMid, 0, 0);

    const textScale = {x: 42, y: 4, z: 2}

    text = new THREE.Mesh(geometry, textMaterials);
    text.position.z = -20;
    text.position.y = 0.1;
    text.receiveShadow = true;
    text.castShadow = true;
    scene.add(text);

    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( 3, 0.1, -20 ) );
    transform.setRotation( new Ammo.btQuaternion( 0, 0, 0, 1 ) );
    let motionState = new Ammo.btDefaultMotionState( transform );
  
    let colShape = new Ammo.btBoxShape( new Ammo.btVector3( textScale.x * 0.5, textScale.y * 0.5, textScale.z * 0.5 ) );
    colShape.setMargin( 0.05 );
  
    let localInertia = new Ammo.btVector3( 0, 0, 0 );
    colShape.calculateLocalInertia( 0, localInertia );
  
    let rbInfo = new Ammo.btRigidBodyConstructionInfo( 0, motionState, colShape, localInertia );
    let body = new Ammo.btRigidBody( rbInfo );
  
    body.setActivationState(STATE.DISABLE_DEACTIVATION);

    body.setFriction(4);
    body.setRollingFriction(10);
  
    physicsWorld.addRigidBody( body );

    text.userData.physicsBody = body;
  });
}

function loadDeveloperText() {
  var text_loader = new THREE.FontLoader();

  text_loader.load('../assets/Inter_Regular.json', function (font) {
    var xMid, text;

    var color = 0x00ff08;

    var textMaterials = [
      new THREE.MeshBasicMaterial({ color: color }),
      new THREE.MeshPhongMaterial({ color: color }), 
    ];

    var geometry = new THREE.TextGeometry('Developer', {
      font: font,
      size: 2,
      height: 0.5,
      curveSegments: 20,
      bevelEnabled: true,
      bevelThickness: 0.25,
      bevelSize: 0.1,
    });

    geometry.computeBoundingBox();
    geometry.computeVertexNormals();

    xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

    geometry.translate(xMid, 0, 0);

    text = new THREE.Mesh(geometry, textMaterials);
    text.position.z = -20;
    text.position.y = 0.1;
    text.position.x = 18;
    text.receiveShadow = true;
    text.castShadow = true;
    scene.add(text);
  });
}

function wallOfBricks() {
  var stoneTexture = '../assets/stones.jpg';

  const loader = new THREE.TextureLoader(manager);
  var pos = new THREE.Vector3();
  var quat = new THREE.Quaternion();
  var brickMass = 0.1;
  var brickLength = 3;
  var brickDepth = 3;
  var brickHeight = 1.5;
  var numberOfBricksAcross = 6;
  var numberOfRowsHigh = 6;

  pos.set(10, brickHeight * 0.5, 20);
  quat.set(0, 0, 0, 1);

  for (var i = 0; i < numberOfRowsHigh; i++) {
    var oddRow = i % 2 == 1;

    pos.x = 50;

    if (oddRow) {
      pos.x += 0.25 * brickLength;
    }

    var currentRow = oddRow ? numberOfBricksAcross + 1 : numberOfBricksAcross;

    for (var j = 0; j < currentRow; j++) {
      var brickLengthCurrent = brickLength;
      var brickMassCurrent = brickMass;

      if (oddRow && (j == 0 || j == currentRow - 1)) {
        brickLengthCurrent *= 0.5;
        brickMassCurrent *= 0.5;
      }

      var brick = createBrick(
        brickLengthCurrent,
        brickHeight,
        brickDepth,
        brickMassCurrent,
        pos,
        quat,
        new THREE.MeshStandardMaterial({
          map: loader.load(stoneTexture)
        })
      );
      brick.castShadow = true;
      brick.receiveShadow = true;

      if (oddRow && (j == 0 || j == currentRow - 2)) {
        pos.x += brickLength * 0.25;
      } else {
        pos.x += brickLength;
      }

      pos.z += 0.0001;
    }
    pos.y += brickHeight;
  }
}

function createBrick(sx, sy, sz, mass, pos, quat, material) {
  var threeObject = new THREE.Mesh(
    new THREE.BoxBufferGeometry(sx, sy,sz, 1, 1, 1),
    material
  );

  var shape = new Ammo.btBoxShape(
    new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5)
  );
  shape.setMargin(0.05);

  createBrickBody(threeObject, shape, mass, pos, quat);

  return threeObject;
}

function createBrickBody(threeObject, physicsShape, mass, pos, quat) {
  threeObject.position.copy(pos);
  threeObject.quaternion.copy(quat);

  var transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(
    new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
  );

  var motionState = new Ammo.btDefaultMotionState(transform);
  
  var localInertia = new Ammo.btVector3(0, 0, 0);
  physicsShape.calculateLocalInertia(mass, localInertia);

  var rbInfo = new Ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    physicsShape,
    localInertia
  );

  var body = new Ammo.btRigidBody(rbInfo);

  threeObject.userData.physicsBody = body;

  scene.add(threeObject);

  if (mass > 0) {
    rigidBodies.push(threeObject);

    body.setActivationState(4);

    physicsWorld.addRigidBody(body);
  }
}

function createBillboard(x, y, z, textureImage, urlLink, rotation = 0) {
  const billboardPoleScale = {x: 1, y: 5, z: 1};
  const billboardSignScale = {x: 30, y: 15, z: 1};

  const loader = new THREE.TextureLoader(manager);

  const billboardPole = new THREE.Mesh(
    new THREE.BoxBufferGeometry(
      billboardPoleScale.x,
      billboardPoleScale.y,
      billboardPoleScale.z
    ),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
    })
  );

  const texture = loader.load(textureImage);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.encoding = THREE.sRGBEncoding;
  let boarderMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
  });
  const loadedTexture = new THREE.MeshBasicMaterial({
    map: texture,
  });

  let materials = [
    boarderMaterial,
    boarderMaterial,
    boarderMaterial,
    boarderMaterial,
    loadedTexture,
    boarderMaterial
  ];

  const billboardSign = new THREE.Mesh(
    new THREE.BoxGeometry(
      billboardSignScale.x,
      billboardSignScale.y,
      billboardSignScale.z
    ), 
    materials
  );

  billboardPole.position.x = x;
  billboardPole.position.y = y;
  billboardPole.position.z = z;

  billboardSign.position.x = x;
  billboardSign.position.y = y + 10;
  billboardSign.position.z = z;

  billboardPole.rotation.y = rotation;
  billboardSign.rotation.y = rotation;

  billboardPole.castShadow = true;
  billboardPole.receiveShadow = true;

  billboardSign.castShadow = true;
  billboardSign.receiveShadow = true;

  billboardSign.userData = {URL: urlLink};

  scene.add(billboardPole);
  scene.add(billboardSign);

  addRigidPhysics(billboardPole, billboardPoleScale);

  cursorHoverObjects.push(billboardSign);
}

function createBox(x, y, z, scaleX, scaleY, scaleZ, boxTexture, URLLink, color = 0x000000, transparent = true) {
  const boxScale = {x: scaleX, y: scaleY, z: scaleZ};

  const loader = new THREE.TextureLoader(manager);
  const texture = loader.load(boxTexture);
  texture.maxFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.encoding = THREE.sRGBEncoding;

  const loadedTexture = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: transparent,
    color: 0xffffff
  });

  let borderMaterial = new THREE.MeshBasicMaterial({
    color: color
  });
  borderMaterial.color.convertSRGBToLinear();

  let materials = [
    borderMaterial,
    borderMaterial,
    borderMaterial,
    borderMaterial,
    loadedTexture,
    borderMaterial
  ];

  const linkBox = new THREE.Mesh(new THREE.BoxBufferGeometry(boxScale.x, boxScale.y, boxScale.z), materials);
  linkBox.position.set(x, y, z);
  linkBox.renderOrder = 1;
  linkBox.castShadow = true;
  linkBox.receiveShadow = true;
  linkBox.userData = {URL: URLLink, email: URLLink};

  scene.add(linkBox);

  objectsWithLinks.push(linkBox.uuid);

  addRigidPhysics(linkBox, boxScale);

  cursorHoverObjects.push(linkBox);
}

function addStatue() {
  const loader = new THREE.GLTFLoader(manager);
  const objScale = {x: 0.035, y: 0.035, z: 0.035};
  const pos = {x: 7.5, y: 0.01, z: 60}
  var geometry;
  var material = new THREE.MeshStandardMaterial();
  var objectMesh = new THREE.Mesh( geometry, material );

  loader.load('../assets/unicorn.glb', function (gltf) {
    const root = gltf.scene; 

    root.traverse((obj) => {
      objectMesh.geometry = obj.geometry;
      objectMesh.material = obj.material;
    });
    console.log(dumpObject(gltf.scene).join('\n'));

  }), undefined, function (error) {
    console.log(error);
  };

  scene.add(objectMesh);

  objectMesh.position.x = pos.x;
  objectMesh.position.y = pos.y;
  objectMesh.position.z = pos.z;
  objectMesh.scale.x = objScale.x;
  objectMesh.scale.y = objScale.y;
  objectMesh.scale.z = objScale.z;
  objectMesh.castShadow = true;
  objectMesh.receiveShadow = true;
}

function updatePhysics( deltaTime ){
  // Step world
  physicsWorld.stepSimulation( deltaTime, 10 );

  // Update rigid bodies
  for ( let i = 0; i < rigidBodies.length; i++ ) {
      let objThree = rigidBodies[ i ];
      let objAmmo = objThree.userData.physicsBody;
      let ms = objAmmo.getMotionState();
      if ( ms ) {

          ms.getWorldTransform( tmpTrans );
          let p = tmpTrans.getOrigin();
          let q = tmpTrans.getRotation();
          objThree.position.set( p.x(), p.y(), p.z() );
          objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );

      }
  }

  rotateCamera(ballObject);

}

function renderFrame() {
  stats.begin();

  let deltaTime = clock.getDelta();

  moveBall();

  updatePhysics(deltaTime);

  renderer.render(scene, camera);

  stats.end();

  requestAnimationFrame(renderFrame);
}
