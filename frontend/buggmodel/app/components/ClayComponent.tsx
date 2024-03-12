'use client'; // Specifies that this file is intended for client-side execution

import * as THREE from "three"; // Importing the THREE library for 3D graphics
import * as OBC from "openbim-components"; // Importing the openbim-components library
import * as CLAY from "openbim-clay"; // Importing the openbim-clay library
import * as WEBIFC from "web-ifc"; // Importing the web-ifc library

import Stats from "stats.js";
import * as dat from "lil-gui";
import { useEffect, useRef } from "react";
import { SimpleWallType } from "../classes/SimpleWallType";
import { SimpleOpeningType } from "../classes/SimpleOpeningType";
import { TransformControls } from "three/examples/jsm/Addons.js";
import { Model } from "../classes/Model";


export default function Test() {
  const containerRef = useRef<HTMLDivElement>(null); // Create a ref to a div element
  const settings = { // Define an object with various settings
    selectionStart: 0, // Start index of selection
    selectionEnd: 0, // End index of selection
    pointSelectionStart: 0, // Start index of point selection
    pointSelectionEnd: 0, // End index of point selection
    width: 0.25, // Width of something
    offset: 0 // Offset value
  }

  const wallsArray = [[ // Define an array of wall coordinates
    [0, 0], // Wall coordinate 1
    [4, 0], // Wall coordinate 2
    [4, 4], // Wall coordinate 3
    [3, 6], // Wall coordinate 4
    [1, 6], // Wall coordinate 5
    [0, 4], // Wall coordinate 6
    [0, 0], // Wall coordinate 7
  ],
  [
    [1, 6], // Wall coordinate 1
    [3, 6], // Wall coordinate 2
    [4, 8], // Wall coordinate 3
    [4, 12], // Wall coordinate 4
    [0, 12], // Wall coordinate 5
    [0, 8], // Wall coordinate 6
    [1, 6], // Wall coordinate 7
  ]]

  const cubeArray = [ // Define an array of cube coordinates
    [0, 0], // Cube coordinate 1
    [4, 0], // Cube coordinate 2
    [4, 4], // Cube coordinate 3
    [0, 4], // Cube coordinate 4
    [0, 0], // Cube coordinate 5
  ]

  const sample_rooms2 = [[2788, 3677], [2788, 4269], [3346, 4268], [3346, 4253], [3353, 4252], [3353, 3677], [2788, 3677]]; // Define an array of sample room coordinates
  const rooms_example = [[[2345, 3659], [2345, 4268], [2566, 4268], [2566, 4254], [2568, 4252], [2605, 4252], [2606, 4268], [2762, 4268], [2762, 3659], [2345, 3659]], [[2788, 3677], [2788, 4269], [3346, 4268], [3346, 4253], [3353, 4252], [3353, 3677], [2788, 3677]]] // Define an array of room coordinates

  const sample_rooms = [ // Define an array of sample room coordinates
    [[2788, 3677], [2788, 4269], [3346, 4268], [3346, 4253], [3353, 4252], [3353, 3677], [2788, 3677]],
    [[2345, 3659], [2345, 4268], [2566, 4268], [2566, 4254], [2568, 4252], [2605, 4252], [2606, 4268], [2762, 4268], [2762, 3659], [2345, 3659]],
    [[1986, 3659], [1904, 3660], [1904, 4268], [2323, 4268], [2323, 3659], [1986, 3659]],
    [[1519, 3659], [1519, 3671], [1516, 3673], [914, 3673], [914, 4252], [939, 4252], [941, 4254], [941, 4268], [1787, 4268], [1788, 4252], [1825, 4252], [1826, 4268], [1882, 4268], [1882, 3659], [1519, 3659]],
    [[941, 3295], [940, 3301], [925, 3301], [925, 3650], [1509, 3650], [1509, 3295], [941, 3295]],
    [[2398, 3022], [2398, 3208], [2775, 3208], [2775, 3022], [2398, 3022]],
    [[1827, 2997], [1827, 3368], [2578, 3367], [2578, 3226], [2376, 3225], [2376, 2997], [1827, 2997]],
    [[2795, 2948], [2795, 3230], [2599, 3231], [2599, 3367], [3346, 3368], [3346, 2948], [2795, 2948]],
    [[3643, 2861], [3643, 3260], [4248, 3260], [4248, 2861], [3643, 2861]],
    [[925, 2861], [925, 3262], [940, 3262], [941, 3272], [1509, 3272], [1509, 2861], [925, 2861]],
    [[1830, 2790], [1830, 2973], [2044, 2973], [2044, 2790], [1830, 2790]],
    [[2400, 2586], [2400, 3003], [2774, 3003], [2774, 2586], [2400, 2586]],
    [[1827, 2586], [1827, 2764], [2044, 2764], [2044, 2586], [1827, 2586]],
    [[3160, 2584], [3160, 2925], [3346, 2925], [3346, 2584], [3160, 2584]],
    [[2065, 2584], [2065, 2973], [2381, 2973], [2381, 2584], [2065, 2584]],
    [[2795, 2582], [2795, 2925], [3138, 2925], [3138, 2582], [2795, 2582]],
    [[3643, 2428], [3643, 2839], [4248, 2839], [4248, 2428], [3643, 2428]],
    [[925, 2428], [925, 2839], [1509, 2839], [1509, 2428], [925, 2428]],
    [[1920, 2267], [1920, 2563], [3256, 2563], [3256, 2267], [1920, 2267]],
    [[3643, 1995], [3643, 2406], [4248, 2406], [4248, 2002], [4233, 2002], [4232, 1995], [3643, 1995]],
    [[927, 1991], [927, 2405], [1510, 2405], [1510, 1991], [927, 1991]],
    [[1839, 1859], [1839, 2235], [3333, 2235], [3333, 1859], [1839, 1859]],
    [[2373, 1574], [2373, 1825], [3366, 1825], [3434, 1827], [3367, 1828], [3367, 2273], [3365, 2273], [3365, 2269], [3275, 2269], [3275, 2562], [3365, 2562], [3366, 2560], [3367, 2562], [3371, 2563], [3371, 3388], [2432, 3389], [2432, 3647], [3378, 3647], [3378, 3650], [3367, 3650], [3377, 3650], [3379, 3652], [3379, 4252], [3384, 4252], [3386, 4254], [3386, 4279], [4232, 4279], [4232, 4253], [4259, 4252], [4259, 3608], [4317, 3607], [4259, 3606], [4258, 3283], [3658, 3283], [3658, 3386], [3619, 3386], [3619, 1574], [2373, 1574]],
    [[1540, 1574], [1540, 3647], [2415, 3647], [2415, 3389], [1803, 3389], [1801, 3387], [1801, 2566], [1901, 2565], [1901, 2271], [1805, 2270], [1805, 1828], [1765, 1827], [1806, 1825], [2349, 1825], [2349, 1574], [1540, 1574]],
    [[3643, 1562], [3643, 1973], [4232, 1973], [4232, 1964], [4234, 1962], [4248, 1962], [4248, 1562], [3643, 1562]],
    [[924, 1562], [924, 1964], [1506, 1964], [1506, 1562], [924, 1562]],
    [[3472, 946], [3471, 960], [3426, 960], [3426, 1540], [4259, 1540], [4259, 960], [4233, 960], [4232, 946], [3472, 946]],
    [[3023, 946], [3023, 1553], [3403, 1553], [3403, 946], [3023, 946]],
    [[2606, 944], [2605, 960], [2582, 960], [2582, 1553], [3000, 1553], [3000, 944], [2606, 944]],
    [[2141, 944], [2141, 1553], [2559, 1553], [2559, 944], [2141, 944]],
    [[1744, 944], [1744, 1553], [2118, 1553], [2118, 944], [1744, 944]],
    [[941, 944], [940, 960], [914, 960], [914, 1540], [1722, 1540], [1722, 960], [1666, 960], [1665, 944], [941, 944]]
  ]

  useEffect(() => {
    const components = new OBC.Components(); // Create a new instance of the Components class
    if (typeof window !== "undefined" && containerRef.current) { // Check if the window object is defined and the containerRef is available
      components.scene = new OBC.SimpleScene(components); // Create a new instance of the SimpleScene class and assign it to the scene property of the components object
      const renderer = new OBC.PostproductionRenderer( // Create a new instance of the PostproductionRenderer class
        components,
        containerRef.current
      );

      components.renderer = renderer; // Assign the renderer to the renderer property of the components object
      const camera = new OBC.SimpleCamera(components); // Create a new instance of the SimpleCamera class and assign it to the camera property of the components object
      components.camera = camera; // Assign the camera to the camera property of the components object
      components.raycaster = new OBC.SimpleRaycaster(components); // Create a new instance of the SimpleRaycaster class and assign it to the raycaster property of the components object
      components.init(); // Initialize the components

      const scene = components.scene.get(); // Get the scene from the components object
      renderer.postproduction.enabled = true; // Enable postproduction rendering
      camera.controls.setLookAt(12, 6, 8, 0, 0, -10); // Set the camera look at position

      const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666)); // Create a new instance of the SimpleGrid class with a color and assign it to the grid variable

      const customEffects = renderer.postproduction.customEffects; // Get the customEffects property of the postproduction renderer
      customEffects.excludedMeshes.push(grid.get()); // Add the grid mesh to the excludedMeshes array

      const axesHelper = new THREE.AxesHelper(1); // Create a new instance of the AxesHelper class with a size of 1 and assign it to the axesHelper variable
      scene.add(axesHelper); // Add the axesHelper to the scene

      const model = new Model(); // Create a new instance of the Model class and assign it to the model variable

      model.ifcAPI.SetWasmPath("https://unpkg.com/web-ifc@0.0.50/", true); // Set the Wasm path for the ifcAPI

      model.init().then(() => { // Initialize the model
        console.log("Model initialized", model); // Log that the model has been initialized
        function renderBuilding(array: number[][]) { // Define a function to render a building based on an array of coordinates
          console.log("Rendering building", array); // Log that the building is being rendered
          const walls = new CLAY.Walls(); // Create a new instance of the Walls class and assign it to the walls variable
          scene.add(walls.offsetFaces.mesh); // Add the walls offset faces mesh to the scene
          scene.add(walls.offsetFaces.lines.mesh); // Add the walls offset faces lines mesh to the scene
          scene.add(walls.offsetFaces.lines.vertices.mesh); // Add the walls offset faces lines vertices mesh to the scene

          function wallsRender(array: number[][]) { // Define a function to render the walls based on an array of coordinates
            for (let i = 0; i < array.length; i++) { // Loop through the array of coordinates
              if (i === array.length - 1) { // If it's the last coordinate, exit the function
                console.log("Last coordinate", walls.offsetFaces.ids);
                return
              } else {
                const wall = walls; // Add the wall segment to the offset faces with a width of 0.25
                wall.offsetFaces.add([i, i + 1], 0.25);
                console.log("Added wall segment", walls.offsetFaces.ids)

                wall.mesh.addEventListener("click", (event) => { console.log("Click wall", event) }); // Add a click event listener to the wall mesh
              }
            }
          }
          
          let coordinatesArray: number[][] = []; // Create an empty array to store the coordinates

          array.map((data, index) => { // Loop through the array of coordinates
            if (index === 0) { // If it's the first coordinate, add it to the coordinatesArray
              coordinatesArray.push([(data[0] / 100), 0, (data[1] / 100)]);
            } else {
              coordinatesArray.push([(data[0] / 100), 0, (data[1] / 100)]); // Add the coordinate to the coordinatesArray
            }
          });
          walls.offsetFaces.lines.addPoints(coordinatesArray); // Add the coordinates to the lines of the offset faces

          console.log("Coordinates array: ", coordinatesArray); // Log the coordinates array

          walls.mesh.addEventListener("click", (event) => { console.log("Click mesh", event) }) // Add a click event listener to the walls mesh
          wallsRender(coordinatesArray); // Render the walls based on the coordinates
          walls.regenerate(); // Regenerate the walls

          console.log("Walls list: ", walls); // Log the walls list

          walls.offsetFaces.lines.clear(); // Clear the lines of the offset faces
        }

        sample_rooms.map((data, index) => { // Loop through the sample rooms
          renderBuilding(data); // Render each sample room
        });
      });

      const gui = new dat.GUI(); // Create a new instance of the GUI class

      // Add GUI controls here

    }
    return () => {
      components.dispose(); // Clean up the components
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full`}
      ref={containerRef}
    ></div>
  );
}
