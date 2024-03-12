import * as FRAGS from "bim-fragment";
import { IFC4X3 as IFC } from "web-ifc";
import * as THREE from "three";
import { ClayObject } from "./ClayObject";
import { ClayGeometry } from "./ClayGeometry";
import { Element } from "./Element";

export abstract class ElementType<
  T extends Element = Element
> extends ClayObject {
  abstract attributes: IFC.IfcElementType;

  geometries = new Map<number, ClayGeometry>();

  elements = new Map<number, T>();

  fragments = new Map<number, FRAGS.Fragment>();

  abstract addInstance(): T;

  abstract deleteInstance(id: number): void;

  protected newFragment() {
    const geometry = new THREE.BufferGeometry();
    geometry.setIndex([]);
    const fragment = new FRAGS.Fragment(geometry, this.model.material, 0);
    fragment.mesh.frustumCulled = false;
    return fragment;
  }
}
