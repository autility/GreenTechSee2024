'use client'; // Specifies that this file is intended for client-side execution

import * as THREE from "three"; // Importing the THREE library for 3D graphics
import * as OBC from "openbim-components"; // Importing the openbim-components library
import * as CLAY from "openbim-clay"; // Importing the openbim-clay library
import * as WEBIFC from "web-ifc"; // Importing the web-ifc library

import Stats from "stats.js"; // Importing the stats.js library for performance monitoring
import * as dat from "lil-gui"; // Importing the lil-gui library for creating GUI elements
import { useEffect, useRef } from "react"; // Importing the useEffect and useRef hooks from React
import { Model } from "../classes/Model"; // Importing the Model class from a local file

export default function ClayComponent() { // Defining a default function component named ClayComponent
  const containerRef = useRef<HTMLDivElement>(null); // Creating a ref for a HTMLDivElement

  useEffect(() => { // Using the useEffect hook to perform side effects after the component has rendered
    if (typeof window !== "undefined" && containerRef.current) {
      // Checking if the window object is available and the containerRef is assigned a value

      const components = new OBC.Components(); // Creating an instance of the Components class from openbim-components

      components.scene = new OBC.SimpleScene(components); // Creating a SimpleScene instance and assigning it to the scene property of components
      const renderer = new OBC.PostproductionRenderer(
        components,
        containerRef.current
      ); // Creating a PostproductionRenderer instance and assigning it to the renderer variable
      components.renderer = renderer; // Assigning the renderer to the renderer property of components
      components.camera = new OBC.SimpleCamera(components); // Creating a SimpleCamera instance and assigning it to the camera property of components
      components.raycaster = new OBC.SimpleRaycaster(components); // Creating a SimpleRaycaster instance and assigning it to the raycaster property of components

      components.init(); // Initializing the components

      renderer.postproduction.enabled = true; // Enabling postproduction effects in the renderer

      const scene = components.scene.get(); // Getting the scene from components

      const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666)); // Creating a SimpleGrid instance with a color and assigning it to the grid variable

      const customEffects = renderer.postproduction.customEffects; // Getting the customEffects property from the renderer
      customEffects.excludedMeshes.push(grid.get()); // Adding the grid mesh to the excludedMeshes array of customEffects

      const axesHelper = new THREE.AxesHelper(1); // Creating an AxesHelper instance with a size of 1 and assigning it to the axesHelper variable
      scene.add(axesHelper); // Adding the axesHelper to the scene

      const model = new Model(); // Creating an instance of the Model class
      model.ifcAPI.SetWasmPath("https://unpkg.com/web-ifc@0.0.50/", true); // Setting the Wasm path for the IFC API
      model.init(); // Initializing the model

      console.log("model",model); // Logging the model object to the console

      const walls = new CLAY.Walls(); // Creating an instance of the Walls class from openbim-clay and assigning it to the walls variable
      console.log(walls); // Logging the walls object to the console
      scene.add(walls.offsetFaces.mesh); // Adding the offsetFaces mesh of walls to the scene
      scene.add(walls.offsetFaces.lines.mesh); // Adding the lines mesh of offsetFaces to the scene
      scene.add(walls.offsetFaces.lines.vertices.mesh); // Adding the vertices mesh of lines to the scene

      const settings = {
        // Creating a settings object
        selectionStart: 0, // Property for selection start
        selectionEnd: 0, // Property for selection end
        pointSelectionStart: 0, // Property for point selection start
        pointSelectionEnd: 0, // Property for point selection end
        width: 0.25, // Property for width
        offset: 0, // Property for offset
      };

      walls.offsetFaces.lines.addPoints([
        // Adding points to the lines of offsetFaces
        [1, 0, 0], // Point 0
        [3, 0, 0], // Point 1
        [6, 0, 2], // Point 2
        [3, 0, 4], // Point 3
        [1, 0, 2], // Point 4
      ]);
      // console.log(walls.offsetFaces.lines.points);

      // // Convert the walls.offsetFaces.lines.points object to an array
      // let pointsArray: any = [];
      // for (let point of Object.values(walls.offsetFaces.lines.points)) {
      //   pointsArray.push(point);
      // }

      // const selectWall = function (walls: CLAY.Walls, id: number) {
      //   if (
      //     !walls ||
      //     !walls.offsetFaces ||
      //     !walls.offsetFaces.lines ||
      //     !walls.offsetFaces.lines.points
      //   ) {
      //     console.log("walls.offsetFaces.lines.points is not defined");
      //     return;
      //   }

      //   // Now you can use forEach on pointsArray
      //   pointsArray.forEach((point: any) => {
      //     console.log(
      //   "object in pointArray for eatch",
      //   walls.offsetFaces.lines.points
      //     );
      //     const color = new THREE.Color(0x0000ff); // Create a new color
      //       point.color.set(color); // Set the color of the point

      //     // Assuming point is an object with a start and end property that are Sets
      //   //   for (let startElement of point.start) {
      //   // console.log("array start", pointsArray);
      //   // if (startElement === id) {
      //   //   // Apply your selection logic here
      //   //   // For example, you might change the color of the startElement
      //   //   // startElement.mesh.material.color.set("blue");
      //   //   console.log("startElement mesh", startElement);
      //   // }
      //   //   }

      //   //   for (let endElement of point.end) {
      //   // console.log("array end", pointsArray);
      //   // if (endElement === id) {
      //   //   // Apply your selection logic here
      //   //   // For example, you might change the color of the endElement
      //   //   // endElement.mesh.color.set("blue");
      //   //   console.log("endElement mesh", endElement);
      //   // }
      //   //   }
      //   });
      //   console.log("array", pointsArray);
      // };

      // // Add event listener
      // const handleClick = (event: MouseEvent) => {
      //   // const walls = new CLAY.Walls(); // Creating an instance of the Walls class from openbim-clay and assigning it to the walls variable
      //   // selectWall(walls, 1); // Call the selectWall function with the walls instance and the desired id
      //   console.log("handleClick", event)
      // };

      // const handleClickEventListener = () => {
      //   if (containerRef.current) {
      //     containerRef.current.addEventListener("click", handleClick); // Add event listener to the container element
      //   }

      //   return () => {
      //     if (containerRef.current) {
      //       containerRef.current.removeEventListener("click", handleClick); // Remove event listener when component unmounts
      //     }
      //   };
      // };


      walls.offsetFaces.add([0, 1], 0.25); // Adding an offset face between points 0 and 1 with a width of 0.25
      walls.offsetFaces.add([1, 2], 0.25); // Adding an offset face between points 1 and 2 with a width of 0.25
      walls.offsetFaces.add([2, 3], 0.25); // Adding an offset face between points 2 and 3 with a width of 0.25
      walls.offsetFaces.add([3, 0], 0.25); // Adding an offset face between points 3 and 0 with a width of 0.25
      walls.offsetFaces.add([4, 3], 0.25); // Adding an offset face between points 4 and 3 with a width of 0.25

      walls.regenerate(); // Regenerating the walls

      // handleClickEventListener();


      const gui = new dat.GUI(); // Creating a GUI instance
    }
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full`}
      ref={containerRef}
    ></div>
  );
}
