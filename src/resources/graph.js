import { scene } from "./world.js";

import { bar_info } from "../app.js";

export function createFloor() {
  const geometry = new THREE.BoxGeometry(0, 0, 0);
  const material = new THREE.MeshPhongMaterial();

  material.side = THREE.BackSide;

  const floor = new THREE.Mesh(geometry, material);

  floor.position.set(0, 0, 0);
  floor.rotation.x = THREE.Math.degToRad(-90);

  floor.receiveShadow = true;

  scene.add(floor);
}

export function createGraphTitle(index, x) {
  const text_loader = new THREE.FontLoader();

  text_loader.load("../../assets/Inter_Regular.json", function (font) {
    const title_color = 0xffffff;

    const titleMaterials = [
      new THREE.MeshBasicMaterial({ color: title_color }),
      new THREE.MeshPhongMaterial({ color: title_color }),
    ];

    // Graph Title
    const title_geometry = new THREE.TextGeometry(bar_info[index].name, {
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

    const title_text = new THREE.Mesh(title_geometry, titleMaterials);
    title_text.position.z = -50;
    title_text.position.x = x;
    title_text.receiveShadow = true;
    title_text.castShadow = true;
    title_text.rotation.y = THREE.Math.degToRad(-15);

    scene.add(title_text);
  });
}

export function createGraphPercentage(index, x) {
  const text_loader = new THREE.FontLoader();

  text_loader.load("../../assets/Inter_Regular.json", function (font) {
    const percentage_color = 0xff0000;
    // Graph Percentage

    const percentageMaterials = [
      new THREE.MeshBasicMaterial({ color: percentage_color }),
      new THREE.MeshPhongMaterial({ color: percentage_color }),
    ];

    const percentage_geometry = new THREE.TextGeometry(
      bar_info[index].value.toString() + "%",
      {
        font: font,
        size: 1.4,
        height: 0.5,
        curveSegments: 20,
        bevelEnabled: true,
        bevelThickness: 0.25,
        bevelSize: 0.1,
      }
    );

    percentage_geometry.computeBoundingBox();
    percentage_geometry.computeVertexNormals();

    const percentage_text = new THREE.Mesh(
      percentage_geometry,
      percentageMaterials
    );
    percentage_text.position.z = -50;
    percentage_text.position.x = x;
    percentage_text.position.y = 3;
    percentage_text.receiveShadow = true;
    percentage_text.castShadow = true;
    percentage_text.rotation.y = THREE.Math.degToRad(-15);

    scene.add(percentage_text);
  });
}
