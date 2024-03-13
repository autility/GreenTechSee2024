"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as OBC from "openbim-components";
import { IFCREINFORCINGBAR, IFCREINFORCINGELEMENT, IFCTENDONANCHOR } from "web-ifc";
import { downloadZip } from "client-zip";
import Stats from "stats.js";
import * as dat from "lil-gui";

export default function LoadFile() {
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
            components.camera = new OBC.SimpleCamera(components);
            components.raycaster = new OBC.SimpleRaycaster(components);
            components.init();

            renderer.postproduction.enabled = true;
            renderer.postproduction.customEffects.outlineEnabled = true;

            const scene = components.scene.get();

            const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));
            const gridMesh = grid.get();
            renderer.postproduction.customEffects.excludedMeshes.push(gridMesh);


            let fragments = new OBC.FragmentManager(components);
            let fragmentIfcLoader = new OBC.FragmentIfcLoader(components);

            const mainToolbar = new OBC.Toolbar(components, { name: 'Main Toolbar', position: 'bottom' });
            components.ui.addToolbar(mainToolbar);
            const ifcButton = fragmentIfcLoader.uiElement.get("main") as OBC.Button; // Cast ifcButton to Button type
            mainToolbar.addChild(ifcButton);

            const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
            hemiLight.position.set(0, 50, 0);
            scene.add(hemiLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
            dirLight.position.set(-8, 12, 8);
            dirLight.castShadow = true;
            dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
            scene.add(dirLight);


            fragmentIfcLoader.setup();

            const excludedCats = [
                IFCTENDONANCHOR,
                IFCREINFORCINGBAR,
                IFCREINFORCINGELEMENT,
            ];
            for (const cat of excludedCats) {
                fragmentIfcLoader.settings.excludedCategories.add(cat);
            }
            fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
            fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

            const loadIfcAsFragments = async () => {
                const file = await fetch('models/process.ifc');
                const data = await file.arrayBuffer();
                console.log('Data -> ', data);
                const buffer = new Uint8Array(data);
                const model = await fragmentIfcLoader.load(buffer);
                scene.add(model);
            };

            const exportFragments = async () => {
                if (!fragments.groups.length) return;
                const group = fragments.groups[0];
                const data = fragments.export(group);
                const blob = new Blob([data]);
                const fragmentFile = new File([blob], 'test.frag');
                const files = [];
                files.push(fragmentFile);
                const properties = group.getLocalProperties();
                if (properties) {
                    files.push(new File([JSON.stringify(properties)], 'test.json'));
                }
                const result = await downloadZip(files).blob();

                download(result as File);
            };

            const download = function (file: File) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(file);
                link.download = file.name;
                document.body.appendChild(link);
                link.click();
                link.remove();
            }

            const disposeFragments = async function () {
                await fragments.dispose();
            }

            const stats = new Stats();
            stats.showPanel(2);
            document.body.append(stats.dom);
            stats.dom.style.position = 'absolute';
            stats.dom.style.top = '0';
            stats.dom.style.left = '0';

            const gui = new dat.GUI();
            const loadingFolder = gui.addFolder('Loading');
            loadingFolder.add({ loadIfcAsFragments }, 'loadIfcAsFragments').name('Load IFC as Fragments');
            loadingFolder.add({ exportFragments }, 'exportFragments').name('Export Fragments');
            loadingFolder.add({ disposeFragments }, 'disposeFragments').name('Dispose Fragments');

            fragmentIfcLoader.onIfcLoaded.add(async (model) => {
                console.log('Model loaded -> ', model);

                model.position.y = 4;
                model.position.x = 15;
                model.position.z = 15;

                const highlighter = new OBC.FragmentHighlighter(components);
                highlighter.setup();

                highlighter.outlineEnabled = true;
                highlighter.updateHighlight();
                const classifier = new OBC.FragmentClassifier(components);
                const json = await model.toJSON();
                console.log('Local Properties -> ', json);
                model.setLocalProperties(json);
                classifier.byStorey(model);
                classifier.byEntity(model);
                const modelTree = new OBC.FragmentTree(components);
                modelTree.init();
                await modelTree.update(['storeys', 'entities']);
                modelTree.onSelected.add(async ({ items, visible }) => {
                    if (visible) {
                        await highlighter.highlightByID('select', items, true, true);
                    }
                });
                modelTree.onHovered.add(async ({ items, visible }) => {
                    if (visible) {
                        await highlighter.highlightByID('hover', items);
                    }
                });

                const propsProcessor = new OBC.IfcPropertiesProcessor(components);
                const propsManager = new OBC.IfcPropertiesManager(components);
                propsProcessor.propertiesManager = propsManager;
                await propsProcessor.process(model);
                propsManager.onRequestFile.add(async () => {
                    const fetcher = await fetch('models/small.ifc');
                    const buffer = await fetcher.arrayBuffer();
                    const ifc = await propsManager.saveToIfc(model, new Uint8Array(buffer));
                    const a = document.createElement('a');
                    const url = URL.createObjectURL(new Blob([ifc]));
                    a.href = url;
                    a.download = model.name;
                    a.click();
                    URL.revokeObjectURL(url);
                });

                const highlighterEvents = highlighter.events;
                highlighterEvents.select.onClear.add(async () => {
                    await propsProcessor.cleanPropertiesList();
                });
                highlighterEvents.select.onHighlight.add(async (selection) => {
                    console.log('Selection -> ', selection);
                    const fragmentID = Object.keys(selection)[0];
                    console.log('Fragment ID -> ', fragmentID);
                    let expressID = 0;
                    selection[fragmentID].forEach((id) => {
                        expressID = id;
                    });
                    console.log('Express ID -> ', expressID);
                    const fragment = fragments.list[fragmentID];
                    console.log('Fragment -> ', fragment);
                    if (fragment.group) {
                        propsProcessor.renderProperties(fragment.group, expressID);
                    }
                });
                const toolbar = new OBC.Toolbar(components);
                toolbar.addChild(modelTree.uiElement.get('main'), propsProcessor.uiElement.get('main'));
                components.ui.addToolbar(toolbar);

                const renderScene = () => {
                    model.rotation.y += 0.01;
                    stats.update();
                    requestAnimationFrame(renderScene);
                }
                renderScene();

            });

            const handleKeyPress = async (event: KeyboardEvent) => {
                if (event.key === 'Enter') {
                    console.log('Enter pressed');
                    await loadIfcAsFragments();
                }
            }

            document.addEventListener('keydown', handleKeyPress);


            return () => {
                disposeFragments();
                components.dispose();
            };
        }
    }, []);

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full`}
            ref={containerRef}
        ></div>
    );
}