import { scene, manager } from './world.js';

export function addText(x, y, z, inputText, fontSize, fontColor) {
  var text_loader = new THREE.FontLoader();

  text_loader.load("../../assets/Inter_Regular.json", function(font) {
    let xMid, text;

    let color = fontColor;

    let matLite = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
    });

    let shapes = font.generateShapes(inputText, fontSize);

    let geometry = new THREE.ShapeBufferGeometry(shapes);

    geometry.computeBoundingBox();

    xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

    geometry.translate(xMid, 0, 0);

    text = new THREE.Mesh(geometry, matLite);
    text.position.z = z;
    text.position.y = y;
    text.position.x = x;
    text.rotation.x = -Math.PI * 0.5;

    scene.add(text);
  });
}

export function addPhotoOnPlane(x, y, z, xScale, zScale, inputPhoto, URLLink = null) {
  let geometry = new THREE.PlaneBufferGeometry(xScale, zScale);
  const loader = new THREE.TextureLoader(manager);
  const　texture = loader.load(inputPhoto);
  texture.maxFilter = THREE.NearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.encoding = THREE.sRGBEncoding;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  });
  material.depthWrite = true;
  material.depthTest = true;

  let photo = new THREE.Mesh(geometry, material);
  photo.position.set(x, y, z);
  photo.rotation.x = -Math.PI * 0.5;
  photo.renderOrder = 1;
  photo.receiveShadow = true;
  photo.userData = {URL: URLLink};
  scene.add(photo);
}


