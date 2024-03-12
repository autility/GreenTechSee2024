'use client';
import * as THREE from "three";
import * as OBC from "openbim-components";
import * as CLAY from "openbim-clay";
import * as WEBIFC from "web-ifc";

import Stats from "stats.js";
import * as dat from "lil-gui";
import { useEffect, useRef } from "react";
import { Model } from "../classes/Model";
// import { TransformControls } from "three/examples/jsm/controls/TransformControls";

export default function ClayComponent() {
    const containerRef = useRef<HTMLDivElement>(null);
    const parameters = {
      color: "red",
    };
  
  useEffect(() => {
      if (typeof window !== "undefined" && containerRef.current) {

const components = new OBC.Components();

components.scene = new OBC.SimpleScene(components);
const renderer = new OBC.PostproductionRenderer(components, containerRef.current);
components.renderer = renderer;
components.camera = new OBC.SimpleCamera(components);
components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

renderer.postproduction.enabled = true;

const scene = components.scene.get();

// components.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

// components.scene.setup();

const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));



const customEffects = renderer.postproduction.customEffects;
customEffects.excludedMeshes.push(grid.get());

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

// IFC API
const model = new Model();
model.ifcAPI.SetWasmPath("https://unpkg.com/web-ifc@0.0.50/", true);
model.init();

const walls = new CLAY.Walls();
scene.add(walls.offsetFaces.mesh);
scene.add(walls.offsetFaces.lines.mesh);
scene.add(walls.offsetFaces.lines.vertices.mesh);

const settings = {
    selectionStart: 0,
    selectionEnd: 0,
    pointSelectionStart: 0,
    pointSelectionEnd: 0,
    width: 0.25,
    offset: 0
}

walls.offsetFaces.lines.addPoints([
    [1, 0, 0], // 0
    [3, 0, 0], // 1
    [6, 0, 2], // 2
    [3, 0, 4], // 3
    [1, 0, 2], // 4

]);
// console.log(walls.offsetFaces);
walls.offsetFaces.add([0, 1], 0.25);
walls.offsetFaces.add([1, 2], 0.25);
walls.offsetFaces.add([2, 3], 0.25);
walls.offsetFaces.add([3, 0], 0.25);
walls.offsetFaces.add([4, 3], 0.25);

walls.regenerate();

// Set up GUI

const gui = new dat.GUI();

const scaleFolder = gui.addFolder("Scale")
scaleFolder.add(walls.mesh.position, "x").min(0).max(5).step(0.01).name("scaleX").onChange((v:number)=>{console.log("v: ", v); walls.mesh.position.set(v, walls.mesh.position.y, walls.mesh.position.z); walls.regenerate();});
scaleFolder.add(walls.mesh.scale, "y").min(0).max(5).step(0.01).name("scaleY");
scaleFolder.add(walls.mesh.scale, "z").min(0).max(5).step(0.01).name("scaleZ");
gui.add(walls.mesh, "visible");
gui.add(walls.mesh.material, "wireframe");

// gui.add(walls.baseColor, "x").name("Start X").step(0.1).onChange(() => {
//    walls.update(true);
// });

// gui.add().name("Start Y").onChange(() => {
//    console.log("B<")
// });
gui.addColor(parameters, "color").onChange((v:any) => {
  
  if(!Array.isArray(walls.mesh.material)){
    walls.mesh.material.blendColor.set(parameters.color)
  }
});

// gui.add(walls.startPoint, "x").name("Start X").step(0.1).onChange(() => {
//    walls.update(true);
// });

// gui.add().name("Start Y").onChange(() => {
//    console.log("B<")
// });

// gui.add(wall.endPoint, "x").name("End X").min(-5).max(5).step(0.1).onChange(() => {
//   wall.update();
// });

// gui.add(wall.endPoint, "y").name("End Y").min(-5).max(5).step(0.1).onChange(() => {
//   wall.update();
// });

// gui.add(wall, "width").name("Width").min(0.1).max(0.5).step(0.05).onChange(() => {
//   wall.update();
// });

// gui.add(wall, "height").name("Height").min(1).max(4).step(0.05).onChange(() => {
//   wall.update();
// });

// gui.add(opening.position, "x").name("Opening X Position").min(-5).max(5).step(0.1).onChange(() => {
//   wall.setOpening(opening);
//   wall.update();
// });

// gui.add(opening.position, "y").name("Opening Y Position").min(-5).max(5).step(0.1).onChange(() => {
//   wall.setOpening(opening);
//   wall.update();
// });

return  () => {
  components.dispose();
};

}}, []);

return (
  <div
    className={`fixed top-0 left-0 w-full h-full`}
    ref={containerRef}
  ></div>
);
}