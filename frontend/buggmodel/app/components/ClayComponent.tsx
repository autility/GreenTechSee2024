"use client";
import * as THREE from "three";
import * as OBC from "openbim-components";
import * as CLAY from "openbim-clay";
import * as WEBIFC from "web-ifc";

import Stats from "stats.js";
import * as dat from "lil-gui";
import { useEffect, useRef, useState } from "react";
import { SimpleWallType } from "../../../clay/src/elements/Walls/SimpleWall/index";
import { SimpleOpeningType } from "../../../clay/src/elements/Openings/index";
import { TransformControls } from "three/examples/jsm/Addons.js";
import { Model } from "../../../clay/src/base";
import { sample_rooms } from "../data/jsonmodel";

export default function Test() {
  const containerRef = useRef<HTMLDivElement>(null);


  // const [shownWalls, setShownWalls] = useState<CLAY.Walls[]>([]);
  const shownWalls:THREE.Mesh[] = [];

  useEffect(() => {
    const components = new OBC.Components();
    if (typeof window !== "undefined" && containerRef.current) {
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
      components.meshes.forEach((mesh, index)=>{console.log("Component Mesh", mesh)})
      const scene = components.scene.get();
      renderer.postproduction.enabled = true;
      camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

      // components.scene.setup();

      const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666)); // Create a new instance of the SimpleGrid class with a color and assign it to the grid variable

      const customEffects = renderer.postproduction.customEffects; // Get the customEffects property of the postproduction renderer
      customEffects.excludedMeshes.push(grid.get()); // Add the grid mesh to the excludedMeshes array

      const axesHelper = new THREE.AxesHelper(1); // Create a new instance of the AxesHelper class with a size of 1 and assign it to the axesHelper variable
      scene.add(axesHelper); // Add the axesHelper to the scene

      const model = new Model();

      model.ifcAPI.SetWasmPath("https://unpkg.com/web-ifc@0.0.50/", true);
      const gui = new dat.GUI();
      
      model.init().then(() => {
        function renderBuilding(array: number[][]) {
          const walls = new CLAY.Walls();
          scene.add(walls.offsetFaces.mesh);
          scene.add(walls.offsetFaces.lines.mesh);
          scene.add(walls.offsetFaces.lines.vertices.mesh);

          function wallsRender(array: number[][]) {
            for (let i = 0; i < array.length; i++) {
              if (i === array.length - 1) {
                return;
              } else {
                walls.offsetFaces.add([i, i + 1], 0.25);
              }
            }
          }

          let coordinatesArray: number[][] = [];

          array.map((data, index) => {
            if (index === 0) {
              coordinatesArray.push([data[0] / 100, 0, data[1] / 100]);
            } else {
              coordinatesArray.push([data[0] / 100, 0, data[1] / 100]);
            }
          });
          walls.offsetFaces.lines.addPoints(coordinatesArray);

          wallsRender(coordinatesArray);
          shownWalls.push(walls.mesh);
          console.log("Wals", shownWalls);
                // gui.add(walls.mesh, "visible").name("Visibility").onChange(()=>{walls.regenerate();});

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
          walls.regenerate();

          walls.offsetFaces.lines.clear();
        }

        components.meshes.forEach((mesh, index)=>{console.log("Component Mesh2", mesh)})

        sample_rooms.map((data, index) => {
          renderBuilding(data);
        });
      });
    }
    return () => {
      components.dispose();
    };
  }, []);

  useEffect(() => {
    if (shownWalls.length !== 0) {
      // Set up GUI

      

      shownWalls.forEach((wall, index)=>{
        console.log("Wall in other place", wall);
      })


    }
  }, [shownWalls]);

  console.log("ShownWalls", shownWalls)

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full`}
      ref={containerRef}
    ></div>
  );
}
