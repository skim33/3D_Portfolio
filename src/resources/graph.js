import { scene } from './world.js';

import { bar_info } from '../app.js';

export function createFloor() {
  var geometry = new THREE.BoxGeometry(0, 0, 0);
  var material = new THREE.MeshPhongMaterial();

  material.side = THREE.BackSide;

  var floor = new THREE.Mesh(geometry, material);

  floor.position.set(0, 0, 0);
  floor.rotation.x = THREE.Math.degToRad(-90);

  floor.receiveShadow = true;

  scene.add(floor);
}

export function createGraphTitle(index, x) {
  var text_loader = new THREE.FontLoader();

  text_loader.load('../../assets/Inter_Regular.json', function (font) {
    var title_color = index == 7 ? 0x0dff05 : 0xffffff;

    var titleMaterials = [
      new THREE.MeshBasicMaterial({ color: title_color }),
      new THREE.MeshPhongMaterial({ color: title_color }), 
    ];

    // Graph Title
    var title_geometry = new THREE.TextGeometry(bar_info[index].name, {
      font: font,
      size: 1.5,
      height: 0.5,
      curveSegments: 20,
      bevelEnabled: true,
      bevelThickness: 0.25,
      bevelSize: 0.1,
    });

    title_geometry.computeBoundingBox();
    title_geometry.computeVertexNormals();

    var title_text = new THREE.Mesh(title_geometry, titleMaterials);
    title_text.position.z = -50;
    title_text.position.x = x;
    title_text.receiveShadow = true;
    title_text.castShadow = true;
    title_text.rotation.y = THREE.Math.degToRad(-15);

    scene.add(title_text);
  });
}

export function createGraphPercentage(index, x) {
  var text_loader = new THREE.FontLoader();

  text_loader.load('../../assets/Inter_Regular.json', function (font) {
    var percentage_color = 0xff0000;
    // Graph Percentage

    var percentageMaterials = [
      new THREE.MeshBasicMaterial({ color: percentage_color }),
      new THREE.MeshPhongMaterial({ color: percentage_color }), 
    ];

    var percentage_geometry = new THREE.TextGeometry(bar_info[index].value.toString() + '%', {
      font: font,
      size: 1.4,
      height: 0.5,
      curveSegments: 20,
      bevelEnabled: true,
      bevelThickness: 0.25,
      bevelSize: 0.1,
    });

    percentage_geometry.computeBoundingBox();
    percentage_geometry.computeVertexNormals();

    var percentage_text = new THREE.Mesh(percentage_geometry, percentageMaterials);
    percentage_text.position.z = -50;
    percentage_text.position.x = x;
    percentage_text.position.y = 3;
    percentage_text.receiveShadow = true;
    percentage_text.castShadow = true;
    percentage_text.rotation.y = THREE.Math.degToRad(-15);

    scene.add(percentage_text);
  });
}

