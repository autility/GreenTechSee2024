'use client';
import * as THREE from "three";
import * as OBC from "openbim-components";
import * as CLAY from "openbim-clay";
import * as WEBIFC from "web-ifc";

import Stats from "stats.js";
import * as dat from "lil-gui";
import { useEffect, useRef } from "react";
import { SimpleWallType } from "../../../clay/src/elements/Walls/SimpleWall/index";
import { SimpleOpeningType } from "../../../clay/src/elements/Openings/index";
import { TransformControls } from "three/examples/jsm/Addons.js";
import { Model } from "../../../clay/src/base";


export default function Test() {
  const containerRef = useRef<HTMLDivElement>(null);
  const settings = {
    selectionStart: 0,
    selectionEnd: 0,
    pointSelectionStart: 0,
    pointSelectionEnd: 0,
    width: 0.25,
    offset: 0
  }

  const wallsArray = [[
    [0, 0],
    [4, 0],
    [4, 4],
    [3, 6],
    [1, 6],
    [0, 4],
    [0, 0],
  ],
  [
    [1, 6],
    [3, 6],
    [4, 8],
    [4, 12],
    [0, 12],
    [0, 8],
    [1, 6],
  ]]

  const cubeArray = [
    [0, 0],
    [4, 0],
    [4, 4],
    [0, 4],
    [0, 0],
  ]

  const sample_rooms = [[2345, 3659], [2345, 4268], [2566, 4268], [2566, 4254], [2568, 4252], [2605, 4252], [2606, 4268], [2762, 4268], [2762, 3659], [2345, 3659]]
  const sample_rooms2 = [[2788, 3677], [2788, 4269], [3346, 4268], [3346, 4253], [3353, 4252], [3353, 3677], [2788, 3677]]

  useEffect(() => {
    if (typeof window !== "undefined" && containerRef.current) {
      const components = new OBC.Components();

      components.scene = new OBC.SimpleScene(components);
      const renderer = new OBC.PostproductionRenderer(
        components,
        containerRef.current
      );
      
      components.renderer = renderer;
      const camera = new OBC.SimpleCamera(components);
      components.camera = camera;
      components.raycaster = new OBC.SimpleRaycaster(components);

      components.init();

      const scene = components.scene.get();
      renderer.postproduction.enabled = true;
      camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

      // components.scene.setup();

      const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));

      const customEffects = renderer.postproduction.customEffects;
      customEffects.excludedMeshes.push(grid.get());

      const axesHelper = new THREE.AxesHelper(1);
      scene.add(axesHelper);

      // IFC API

      const model = new Model();
      
      model.ifcAPI.SetWasmPath("https://unpkg.com/web-ifc@0.0.50/", true);
      
      model.init().then(()=>{

      
      
      
        function renderBuilding(array: number[][]) {
      
          const walls = new CLAY.Walls();
          scene.add(walls.offsetFaces.mesh);
          scene.add(walls.offsetFaces.lines.mesh);
          scene.add(walls.offsetFaces.lines.vertices.mesh);
      
          function wallsRender(array: number[][]) {
            for (let i = 0; i < array.length; i++) {
              if (i === array.length - 1) {
                return
              } else {
                walls.offsetFaces.add([i, i + 1], 0.25);
              }
            }
          }
      
          let coordinatesArray:number[][] = [];
      
          array.map((data, index) => {
            if (index === 0) {
              coordinatesArray.push([(data[0] / 100), 0, (data[1] / 100)]);
            } else {
              coordinatesArray.push([(data[0] / 100), 0, (data[1] / 100)]);
            }
          });
      
          console.log(`JSON array`, coordinatesArray);
      
      
          walls.offsetFaces.lines.addPoints(coordinatesArray);
          console.log(walls.offsetFaces);
      
          wallsRender(coordinatesArray);
      
          // walls.startPoint.set(0, 0, 0);
          console.log(walls);
      
          walls.regenerate();
      
          walls.offsetFaces.lines.clear();
      
          // walls.update(true);
      
      
        }
      
        renderBuilding(sample_rooms);
        renderBuilding(sample_rooms2);
  
        // Set up GUI
        
  
        const gui = new dat.GUI();
  
        // gui
        //   .add(wall.startPoint, "x")
        //   .name("Start X")
        //   .min(-5)
        //   .max(5)
        //   .step(0.1)
        //   .onChange(() => {
        //     wall.update(true);
        //   });
  
        // gui
        //   .add(wall.startPoint, "y")
        //   .name("Start Y")
        //   .min(-5)
        //   .max(5)
        //   .step(0.1)
        //   .onChange(() => {
        //     wall.update(true);
        //   });
  
        // gui
        //   .add(wall.endPoint, "x")
        //   .name("End X")
        //   .min(-5)
        //   .max(5)
        //   .step(0.1)
        //   .onChange(() => {
        //     wall.update(true);
        //   });
  
        // gui
        //   .add(wall.endPoint, "y")
        //   .name("End Y")
        //   .min(-5)
        //   .max(5)
        //   .step(0.1)
        //   .onChange(() => {
        //     wall.update(true);
        //   });
  
        // gui
        //   .add(wall, "height")
        //   .name("Height")
        //   .min(1)
        //   .max(4)
        //   .step(0.05)
        //   .onChange(() => {
        //     wall.update(true);
        //   });
  
        // gui
        //   .add(simpleWallType, "width")
        //   .name("Width")
        //   .min(0.1)
        //   .max(0.5)
        //   .step(0.05)
        //   .onChange(() => {
        //     simpleWallType.update(true);
        //   });
  
        // gui
        //   .add(opening.position, "x")
        //   .name("Opening X Position")
        //   .min(-5)
        //   .max(5)
        //   .step(0.1)
        //   .onChange(() => {
        //     wall.setOpening(opening);
        //     wall.update(true);
        //   });
  
        // gui
        //   .add(opening.position, "y")
        //   .name("Opening Y Position")
        //   .min(-5)
        //   .max(5)
        //   .step(0.1)
        //   .onChange(() => {
        //     wall.setOpening(opening);
        //     wall.update(true);
        //   });
      });

    }
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full`}
      ref={containerRef}
    ></div>
  );
}