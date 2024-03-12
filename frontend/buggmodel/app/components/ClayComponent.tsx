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

  // const sample_rooms = [[2345, 3659], [2345, 4268], [2566, 4268], [2566, 4254], [2568, 4252], [2605, 4252], [2606, 4268], [2762, 4268], [2762, 3659], [2345, 3659]]
  const sample_rooms2 = [[2788, 3677], [2788, 4269], [3346, 4268], [3346, 4253], [3353, 4252], [3353, 3677], [2788, 3677]];
  const rooms_example = [[[2345, 3659], [2345, 4268], [2566, 4268], [2566, 4254], [2568, 4252], [2605, 4252], [2606, 4268], [2762, 4268], [2762, 3659], [2345, 3659]], [[2788, 3677], [2788, 4269], [3346, 4268], [3346, 4253], [3353, 4252], [3353, 3677], [2788, 3677]]
]

const sample_rooms = [
 [[2788, 3677], [2788, 4269], [3346, 4268], [3346, 4253], [3353, 4252], [3353, 3677], [2788, 3677]],
 [[2345, 3659], [2345, 4268], [2566, 4268], [2566, 4254], [2568, 4252], [2605, 4252], [2606, 4268],
 [2762, 4268], [2762, 3659], [2345, 3659]], [[1986, 3659], [1904, 3660], [1904, 4268], [2323, 4268],
 [2323, 3659], [1986, 3659]], [[1519, 3659], [1519, 3671], [1516, 3673], [914, 3673], [914, 4252],
 [939, 4252], [941, 4254], [941, 4268], [1787, 4268], [1788, 4252], [1825, 4252], [1826, 4268],
 [1882, 4268], [1882, 3659], [1519, 3659]], [[941, 3295], [940, 3301], [925, 3301], [925, 3650],
 [1509, 3650], [1509, 3295], [941, 3295]], [[2398, 3022], [2398, 3208], [2775, 3208], [2775, 3022],
 [2398, 3022]], [[1827, 2997], [1827, 3368], [2578, 3367], [2578, 3226], [2376, 3225], [2376, 2997],
 [1827, 2997]], [[2795, 2948], [2795, 3230], [2599, 3231], [2599, 3367], [3346, 3368], [3346, 2948],
 [2795, 2948]], [[3643, 2861], [3643, 3260], [4248, 3260], [4248, 2861], [3643, 2861]], [[925, 2861],
 [925, 3262], [940, 3262], [941, 3272], [1509, 3272], [1509, 2861], [925, 2861]], [[1830, 2790], [1830, 2973],
 [2044, 2973], [2044, 2790], [1830, 2790]], [[2400, 2586], [2400, 3003], [2774, 3003], [2774, 2586], [2400, 2586]],
 [[1827, 2586], [1827, 2764], [2044, 2764], [2044, 2586], [1827, 2586]], [[3160, 2584], [3160, 2925], [3346, 2925],
 [3346, 2584], [3160, 2584]], [[2065, 2584], [2065, 2973], [2381, 2973], [2381, 2584], [2065, 2584]], [[2795, 2582],
 [2795, 2925], [3138, 2925], [3138, 2582], [2795, 2582]], [[3643, 2428], [3643, 2839], [4248, 2839], [4248, 2428],
[3643, 2428]],
 [[925, 2428], [925, 2839], [1509, 2839], [1509, 2428], [925, 2428]], [[1920, 2267], [1920, 2563], [3256, 2563], [3256,
2267],
[1920, 2267]], [[3643, 1995], [3643, 2406], [4248, 2406], [4248, 2002], [4233, 2002], [4232, 1995], [3643, 1995]],
[[927, 1991],
 [927, 2405], [1510, 2405], [1510, 1991], [927, 1991]], [[1839, 1859], [1839, 2235], [3333, 2235], [3333, 1859], [1839,
1859]],
 [[2373, 1574], [2373, 1825], [3366, 1825], [3434, 1827], [3367, 1828], [3367, 2273], [3365, 2273], [3365, 2269],
[3275, 2269],
 [3275, 2562], [3365, 2562], [3366, 2560], [3367, 2562], [3371, 2563], [3371, 3388], [2432, 3389], [2432, 3647], [3378,
3647],
 [3378, 3650], [3367, 3650], [3377, 3650], [3379, 3652], [3379, 4252], [3384, 4252], [3386, 4254], [3386, 4279], [4232,
4279],
 [4232, 4253], [4259, 4252], [4259, 3608], [4317, 3607], [4259, 3606], [4258, 3283], [3658, 3283], [3658, 3386], [3619,
3386],
 [3619, 1574], [2373, 1574]], [[1540, 1574], [1540, 3647], [2415, 3647], [2415, 3389], [1803, 3389], [1801, 3387],
[1801, 2566],
 [1901, 2565], [1901, 2271], [1805, 2270], [1805, 1828], [1765, 1827], [1806, 1825], [2349, 1825], [2349, 1574], [1540,
1574]],
 [[3643, 1562], [3643, 1973], [4232, 1973], [4232, 1964], [4234, 1962], [4248, 1962], [4248, 1562], [3643, 1562]],
[[924, 1562],
 [924, 1964], [1506, 1964], [1506, 1562], [924, 1562]], [[3472, 946], [3471, 960], [3426, 960], [3426, 1540], [4259,
1540], [4259, 960],
 [4233, 960], [4232, 946], [3472, 946]], [[3023, 946], [3023, 1553], [3403, 1553], [3403, 946], [3023, 946]], [[2606,
944], [2605, 960],
 [2582, 960], [2582, 1553], [3000, 1553], [3000, 944], [2606, 944]], [[2141, 944], [2141, 1553], [2559, 1553], [2559,
944], [2141, 944]],
 [[1744, 944], [1744, 1553], [2118, 1553], [2118, 944], [1744, 944]], [[941, 944], [940, 960], [914, 960], [914, 1540],
[1722, 1540],
 [1722, 960], [1666, 960], [1665, 944], [941, 944]] ]

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

    function wallsRender(array:number[][]) {
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
    walls.offsetFaces.lines.addPoints(coordinatesArray);

    wallsRender(coordinatesArray);
    walls.mesh.addEventListener("click", (event)=>{console.log("Click mesh", event)})
    walls.regenerate();

    console.log("Walls list: ", walls);

    walls.offsetFaces.lines.clear();


  }

  sample_rooms.map((data, index) => {
    renderBuilding(data);
  });

  

      
      

  
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
    return  () => {
      components.dispose();
  };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full`}
      ref={containerRef}
    ></div>
  );
}