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
        const simpleWallType = new SimpleWallType(model);
        const wall = simpleWallType.addInstance();
        scene.add(...wall.meshes);
  
        const simpleOpeningType = new SimpleOpeningType(model);
        const opening = simpleOpeningType.addInstance();
        scene.add(...opening.meshes);
  
        wall.addOpening(opening);
        wall.update(true);
  
        window.addEventListener("keydown", () => {
          wall.removeOpening(opening);
          wall.update(true);
        });
  
        // Set up GUI
  
        const gui = new dat.GUI();
  
        gui
          .add(wall.startPoint, "x")
          .name("Start X")
          .min(-5)
          .max(5)
          .step(0.1)
          .onChange(() => {
            wall.update(true);
          });
  
        gui
          .add(wall.startPoint, "y")
          .name("Start Y")
          .min(-5)
          .max(5)
          .step(0.1)
          .onChange(() => {
            wall.update(true);
          });
  
        gui
          .add(wall.endPoint, "x")
          .name("End X")
          .min(-5)
          .max(5)
          .step(0.1)
          .onChange(() => {
            wall.update(true);
          });
  
        gui
          .add(wall.endPoint, "y")
          .name("End Y")
          .min(-5)
          .max(5)
          .step(0.1)
          .onChange(() => {
            wall.update(true);
          });
  
        gui
          .add(wall, "height")
          .name("Height")
          .min(1)
          .max(4)
          .step(0.05)
          .onChange(() => {
            wall.update(true);
          });
  
        gui
          .add(simpleWallType, "width")
          .name("Width")
          .min(0.1)
          .max(0.5)
          .step(0.05)
          .onChange(() => {
            simpleWallType.update(true);
          });
  
        gui
          .add(opening.position, "x")
          .name("Opening X Position")
          .min(-5)
          .max(5)
          .step(0.1)
          .onChange(() => {
            wall.setOpening(opening);
            wall.update(true);
          });
  
        gui
          .add(opening.position, "y")
          .name("Opening Y Position")
          .min(-5)
          .max(5)
          .step(0.1)
          .onChange(() => {
            wall.setOpening(opening);
            wall.update(true);
          });
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
