"use client"
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import ChatSection from "./chat";
import Report from "./report";

export default function SideDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [style, setStyle] = useState<"roadmap" | "satellite" | "hybrid">("roadmap");
    const [terrain, setTerrain] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);
    const [isDrawn, setIsDrawn] = useState(false);
    const isSelectingRef = useRef(isSelecting);
    const [selectedPoints, setSelectedPoints] = useState<google.maps.LatLng[]>([]);
    const [circles, setCircles] = useState<google.maps.Circle[]>([]);
    const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [isPolygonFinalized, setIsPolygonFinalized] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState<"roadmap" | "satellite" | "hybrid">("roadmap");
    const [isDrawingPossible, setIsDrawingPossible] = useState(false);
    const [area, setArea] = useState<number | null>(null);
    const [subRegions, setSubRegions] = useState<google.maps.Polygon[]>([]);
    const [selectedSubRegion, setSelectedSubRegion] = useState<number | null>(null);
    const [subRegionLabels, setSubRegionLabels] = useState<google.maps.Marker[]>([]);
    const [selectedTileCenter, setSelectedTileCenter] = useState<google.maps.LatLng | null>(null);


    const calculateArea = (path: google.maps.LatLng[]): number => {
        return google.maps.geometry.spherical.computeArea(path);
    };

    const divideIntoSubRegions = (mainPolygon: google.maps.Polygon, targetArea: number) => {
        const bounds = new google.maps.LatLngBounds();
        mainPolygon.getPath().forEach((point) => bounds.extend(point));

        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        const latDiff = ne.lat() - sw.lat();
        const lngDiff = ne.lng() - sw.lng();

        const gridSize = Math.ceil(Math.sqrt(calculateArea(mainPolygon.getPath().getArray()) / targetArea)) * 2; // Doubled for smaller tiles

        const latStep = latDiff / gridSize;
        const lngStep = lngDiff / gridSize;

        const subRegions: google.maps.Polygon[] = [];
        const labels: google.maps.Marker[] = [];

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const cellBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(sw.lat() + i * latStep, sw.lng() + j * lngStep),
                    new google.maps.LatLng(sw.lat() + (i + 1) * latStep, sw.lng() + (j + 1) * lngStep)
                );

                if (google.maps.geometry.poly.containsLocation(cellBounds.getCenter(), mainPolygon)) {
                    const subRegion = new google.maps.Polygon({
                        paths: [
                            cellBounds.getNorthEast(),
                            new google.maps.LatLng(cellBounds.getNorthEast().lat(), cellBounds.getSouthWest().lng()),
                            cellBounds.getSouthWest(),
                            new google.maps.LatLng(cellBounds.getSouthWest().lat(), cellBounds.getNorthEast().lng()),
                        ],
                        strokeColor: "#0000FF",
                        strokeOpacity: 0.8,
                        strokeWeight: 1,
                        fillColor: "#0000FF",
                        fillOpacity: 0.35,
                    });

                    const tileNumber = subRegions.length + 1;

                    // Add click listener
                    subRegion.addListener("click", () => {
                        const center = cellBounds.getCenter();
                        setSelectedTileCenter(center);
                        if (selectedSubRegion === tileNumber) {
                            setSelectedSubRegion(null);
                            subRegion.setOptions({ fillColor: "#0000FF", fillOpacity: 0.35 });
                        } else {
                            if (selectedSubRegion !== null) {
                                const prevSubRegion = subRegions[selectedSubRegion - 1];
                                prevSubRegion.setOptions({ fillColor: "#0000FF", fillOpacity: 0.35 });
                            }
                            setSelectedSubRegion(tileNumber);
                            subRegion.setOptions({ fillColor: "#0000FF", fillOpacity: 0.7 });
                        }
                        console.log(`Tile ${tileNumber} center coordinates:`, center.lat(), center.lng());
                    });
                    // Add hover listeners
                    subRegion.addListener("mouseover", () => {
                        if (selectedSubRegion !== tileNumber) {
                            subRegion.setOptions({ fillColor: "#FFFF00", fillOpacity: 0.7 });
                        }
                    });

                    subRegion.addListener("mouseout", () => {
                        if (selectedSubRegion !== tileNumber) {
                            subRegion.setOptions({ fillColor: "#0000FF", fillOpacity: 0.35 });
                        }
                    });

                    subRegions.push(subRegion);

                    // Add label
                    const label = new google.maps.Marker({
                        position: cellBounds.getCenter(),
                        label: {
                            text: tileNumber.toString(),
                            color: "white",
                            fontSize: "10px",
                        },
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 0,
                        },
                    });

                    labels.push(label);
                }
            }
        }

        setSubRegionLabels(labels);
        return subRegions;
    };


    useEffect(() => {
        isSelectingRef.current = isSelecting;
    }, [isSelecting]);

    useEffect(() => {
        if (typeof window !== "undefined" && !map && google) {
            const mapOptions = {
                center: { lat: 40.712776, lng: -74.005974 },
                zoom: 12,
                mapTypeId: style,
                draggable: !isPolygonFinalized,
            };
            const mapInstance = new google.maps.Map(
                document.getElementById("map") as HTMLElement,
                mapOptions
            );
            setMap(mapInstance);

            mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
                if (isSelectingRef.current && event.latLng?.lng()) {
                    const newPoint = event.latLng;
                    console.log("Point selected by left-click: ", newPoint.toString());
                } else {
                    console.log("Left-click detected but not in selecting mode or event.latLng is null");
                    console.log("Event details:", event);
                    console.log("Event details lng:", event.latLng?.lng());
                }
            });

            mapInstance.addListener("contextmenu", (event: google.maps.MapMouseEvent) => {
                setTimeout(() => {
                    if (isSelectingRef.current && event.latLng) {
                        const newPoint = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());

                        // Add a circle at the right-click location
                        const circle = new google.maps.Circle({
                            center: newPoint,
                            radius: 5,
                            fillColor: "#FF0000",
                            fillOpacity: 0.8,
                            strokeColor: "#FF0000",
                            strokeOpacity: 0.8,
                            strokeWeight: 0.5,
                            map: mapInstance,
                        });

                        setCircles((prevCircles) => [...prevCircles, circle]);
                        setSelectedPoints((prevPoints) => [...prevPoints, newPoint]);
                        console.log("Point selected by right-click: ", newPoint.toString());
                    } else {
                        console.log("Right-click detected but not in selecting mode or event.latLng is null");
                        console.log("Event details:", event);
                    }
                });
            });

            mapInstance.addListener("dblclick", (event: google.maps.MapMouseEvent) => {
                if (isSelectingRef.current && event.latLng) {
                    const newPoint = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());

                    // Add a circle at the double-click location
                    const circle = new google.maps.Circle({
                        center: newPoint,
                        radius: 10,
                        fillColor: "#FF0000",
                        fillOpacity: 0.8,
                        strokeColor: "#FF0000",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        map: mapInstance,
                    });

                    setCircles((prevCircles) => [...prevCircles, circle]);
                    setSelectedPoints((prevPoints) => [...prevPoints, newPoint]);
                    console.log("Point selected by double-click: ", newPoint.toString());
                } else {
                    console.log("Double-click detected but not in selecting mode or event.latLng is null");
                    console.log("Event details:", event);
                }
            });
        }
    }, [style, map, isPolygonFinalized]);

    useEffect(() => {
        if (map) {
            map.setMapTypeId(terrain ? "terrain" : style);
            map.setOptions({ draggable: !isPolygonFinalized });
        }
    }, [terrain, style, map, isPolygonFinalized]);

    useEffect(() => {
        setIsDrawingPossible(selectedPoints.length >= 3);
    }, [selectedPoints]);

    const drawPolygon = () => {
        console.log("Drawing polygon with points: ", selectedPoints);
        if (map && selectedPoints.length > 2) {
            if (polygon) {
                polygon.setMap(null);
            }
            const newPolygon = new google.maps.Polygon({
                paths: selectedPoints,
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
            });
            newPolygon.setMap(map);
            setPolygon(newPolygon);
            setIsSelecting(false);
            setIsDrawn(true);
            setShowPopup(false);
            console.log("Polygon drawn with points: ", selectedPoints);
        }
    };


    const finalizePolygon = () => {
        if (polygon) {
            const polygonArea = calculateArea(polygon.getPath().getArray());
            setArea(polygonArea);

            if (polygonArea > 1000000) { // 1000 km² in m²
                const newSubRegions = divideIntoSubRegions(polygon, 1000000);
                setSubRegions(newSubRegions);
                newSubRegions.forEach(subRegion => subRegion.setMap(map));
                subRegionLabels.forEach(label => label.setMap(map));
            }

            const polygonBounds = new google.maps.LatLngBounds();
            polygon.getPath().forEach((point) => polygonBounds.extend(point));



            setIsPolygonFinalized(true);
            console.log("Polygon finalized");
        }
    };
    const resetSelection = () => {
        if (polygon) {
            polygon.setMap(null);
        }
        circles.forEach(circle => circle.setMap(null));
        subRegions.forEach(subRegion => subRegion.setMap(null));
        subRegionLabels.forEach(label => label.setMap(null));
        setSelectedPoints([]);
        setCircles([]);
        setPolygon(null);
        setSubRegions([]);
        setSubRegionLabels([]);
        setSelectedSubRegion(null);
        setIsSelecting(false);
        setShowPopup(false);
        setIsDrawn(false);
        setIsPolygonFinalized(false);
        setArea(null);
        console.log("Selection reset");
    };

    useEffect(() => {
        if (isSelecting) {
            setShowPopup(true);
        }
    }, [isSelecting]);

    if (typeof window === "undefined" || !google || !google.maps) {
        return <div>Loading Google Maps...</div>;
    }

    return (
        <div className="md:relative md:h-[88vh] py-4 overflow-hidden ">
            <div className={'flex md:flex-row flex-col md:space-x-4 space-y-4 h-full'}>
                <div  className="md:ml-4 md:w-1/5 w-full rounded-3xl md:h-full h-1/5" id={'chatbot'} >
                    <ChatSection />
                </div>
                <div className={'md:relative md:w-3/5 w-full md:h-full h-3/5'}>
                    {showPopup && (
                        <div className="md:absolute top-12 right-2 bg-yellow-500 text-black p-4 rounded-lg shadow-lg z-20">
                            You are in selecting mode! Right-click to draw the region.
                        </div>
                    )}
                    {area && (
                        <div className="md:absolute top-20 right-2 bg-white text-black p-4 rounded-lg shadow-lg z-20">
                            <p>Area: {(area / 1000000).toFixed(2)} km²</p>
                            <p>Selected Tile: {selectedSubRegion !== null ? selectedSubRegion : 'None'}</p>
                            {/*{selectedTileCenter && (*/}
                            {/*    <p>*/}
                            {/*        Tile Center: {selectedTileCenter.lat().toFixed(6)}, {selectedTileCenter.lng().toFixed(6)}*/}
                            {/*    </p>*/}
                            {/*)}*/}
                        </div>
                    )}
                    <div className="md:absolute top-4 max-sm:h-full left-4 rounded-xl p-4 mx-auto from-white/20 to-black shadow-lg ring-1 ring-black/5 backdrop-blur-sm bg-gradient-to-br z-10">
                        <h1 className="text-lg font-semibold text-white mb-2">Map Options</h1>
                        <div className="flex flex-col space-y-2">
                            <button
                                className={`bg-transparent ${selectedStyle === 'roadmap' ? 'text-black' : 'text-white' } px-3 py-2 rounded-md ${selectedStyle === "roadmap" ? "bg-white" : ""}`}
                                onClick={() => {
                                    if (map) {
                                        setStyle("roadmap");
                                        setSelectedStyle("roadmap");
                                    }
                                }}
                                disabled={isPolygonFinalized}
                            >
                                Roadmap
                            </button>
                            <button
                                className={`bg-transparent ${selectedStyle === 'satellite' ? 'text-black' : 'text-white' } px-3 py-2 rounded-md ${selectedStyle === "satellite" ? "bg-white" : ""}`}
                                onClick={() => {
                                    if (map) {
                                        setStyle("satellite");
                                        setSelectedStyle("satellite");
                                    }
                                }}
                                disabled={isPolygonFinalized}
                            >
                                Satellite
                            </button>
                            <button
                                className={`bg-transparent ${selectedStyle === 'hybrid' ? 'text-black' : 'text-white' } px-3 py-2 rounded-md ${selectedStyle === "hybrid" ? "bg-white" : ""}`}
                                onClick={() => {
                                    if (map) {
                                        setStyle("hybrid");
                                        setSelectedStyle("hybrid");
                                    }
                                }}
                                disabled={isPolygonFinalized}
                            >
                                Hybrid
                            </button>
                            <button
                                className="bg-transparent text-white px-3 py-2 rounded-md"
                                onClick={() => {
                                    if (map) setTerrain(!terrain);
                                }}
                                disabled={isPolygonFinalized}
                            >
                                {terrain ? "Disable Terrain" : "Enable Terrain"}
                            </button>

                            <button
                                className={`bg-transparent text-white px-3 py-2 rounded-md ${isSelecting ? "bg-yellow-500" : ""}`}
                                onClick={() => {
                                    if (map) {
                                        setIsSelecting(true);
                                        console.log("Selecting mode enabled");
                                    }
                                }}
                                disabled={isPolygonFinalized}
                            >
                                Select a Region
                            </button>

                            <button
                                className={`bg-transparent ${isDrawingPossible && !isPolygonFinalized && !isDrawn ? "border border-white" : ''} text-white px-3 py-2 rounded-md ${isDrawingPossible ? "bg-green-500" : ""}`}
                                onClick={drawPolygon}
                                disabled={!isDrawingPossible || isPolygonFinalized}
                            >
                                Draw Region
                            </button>

                            <button
                                className={`bg-transparent ${isSelecting || isDrawn ? "border border-2 text-red-900 border-red-900" : '' } text-white px-3 py-2 rounded-md`}
                                onClick={resetSelection}
                            >
                                Reset Selection
                            </button>
                            <button
                                className={`bg-transparent ${isSelecting || isDrawn ? "border border-2 text-red-900 border-red-900" : '' } text-white px-3 py-2 rounded-md`}
                                onClick={resetSelection}
                            >
                                Reverse search
                            </button>
                        </div>
                    </div>
                    <div className="md:absolute max-sm:h-full inset-0 p-4 rounded-lg" id="map"></div>
                </div>
                <div  className="md:mr-4 md:w-1/5 w-full rounded-3xl md:h-full h-1/5" id={'chatbot'} >
                    <Report />
                </div>
            </div>

            {polygon && !isPolygonFinalized && (
                <button
                    className="fixed bottom-8 w-1/3 left-1/2 shadow-2xl  transform -translate-x-1/2 bg-green-500 text-white px-12 py-2 rounded-md"
                    onClick={finalizePolygon}
                >
                    Submit
                </button>
            )}



            <style jsx global>{`
              .vertical-text {
                writing-mode: vertical-rl;
                text-orientation: mixed;
                transform: rotate(180deg);
                white-space: nowrap;
              }
            `}</style>
        </div>
    );
}