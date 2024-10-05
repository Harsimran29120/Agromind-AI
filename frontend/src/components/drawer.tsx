"use client";

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

export default function SideDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [style, setStyle] = useState<"roadmap" | "satellite" | "hybrid">("roadmap");
    const [terrain, setTerrain] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);
    const isSelectingRef = useRef(isSelecting);
    const [selectedPoints, setSelectedPoints] = useState<google.maps.LatLng[]>([]);
    const [circles, setCircles] = useState<google.maps.Circle[]>([]);
    const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [isPolygonFinalized, setIsPolygonFinalized] = useState(false);

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
            setShowPopup(false);
            console.log("Polygon drawn with points: ", selectedPoints);
        }
    };

    const resetSelection = () => {
        if (polygon) {
            polygon.setMap(null);
        }
        circles.forEach(circle => circle.setMap(null));
        setSelectedPoints([]);
        setCircles([]);
        setPolygon(null);
        setIsSelecting(false);
        setShowPopup(false);
        setIsPolygonFinalized(false);
        console.log("Selection reset");
    };

    const finalizePolygon = () => {
        setIsPolygonFinalized(true);
        console.log("Polygon finalized");
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
        <div className="relative h-[90vh] overflow-hidden">
            {/*<button*/}
            {/*    className="fixed left-0 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-2 py-4 rounded-r-md transform -translate-x-1 hover:translate-x-0 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 z-50"*/}
            {/*    onClick={() => setIsOpen(true)}*/}
            {/*>*/}
            {/*    <span className="text-sm font-bold vertical-text">Open Chat</span>*/}
            {/*</button>*/}

<div className={'flex flex-row space-x-2  h-[90vh]'}>
    <div  className="ml-4 w-1/5 rounded-3xl h-full" id={'chatbot'} >
        <ChatSection />
    </div>
<div className={'relative w-3/5 h-full'}>
    <div className="absolute top-4 left-4    rounded-xl p-4 mx-auto from-white/20 to-black  shadow-lg ring-1 ring-black/5 backdrop-blur-sm bg-gradient-to-br  z-10">
        <h1 className="text-lg font-semibold text-white mb-2">Map Options</h1>
        <div className="flex flex-col space-y-2">
            <button
                className="bg-blue-500 text-white px-3 py-2 rounded-md"
                onClick={() => {
                    if (map) setStyle("roadmap");
                }}
                disabled={isPolygonFinalized}
            >
                Roadmap
            </button>
            <button
                className="bg-blue-500 text-white px-3 py-2 rounded-md"
                onClick={() => {
                    if (map) setStyle("satellite");
                }}
                disabled={isPolygonFinalized}
            >
                Satellite
            </button>
            <button
                className="bg-blue-500 text-white px-3 py-2 rounded-md"
                onClick={() => {
                    if (map) setStyle("hybrid");
                }}
                disabled={isPolygonFinalized}
            >
                Hybrid
            </button>
            <button
                className="bg-blue-500 text-white px-3 py-2 rounded-md"
                onClick={() => {
                    if (map) setTerrain(!terrain);
                }}
                disabled={isPolygonFinalized}
            >
                {terrain ? "Disable Terrain" : "Enable Terrain"}
            </button>

            <button
                className="bg-green-500 text-white px-3 py-2 rounded-md"
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
                className="bg-yellow-500 text-white px-3 py-2 rounded-md"
                onClick={drawPolygon}
                disabled={selectedPoints.length < 3 || isPolygonFinalized}
            >
                Draw Region
            </button>

            <button
                className="bg-red-500 text-white px-3 py-2 rounded-md"
                onClick={resetSelection}
            >
                Reset Selection
            </button>
        </div>
    </div>
    <div className="  absolute inset-0 p-4 rounded-lg" id="map"></div>
</div>
    <div  className="mr-4 w-1/5 rounded-3xl h-full" id={'chatbot'} >
        <ChatSection />
    </div>


</div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="left" className="w-[70%] sm:w-[70%]">
                    <div className="w-[100%] mt-10">
                    </div>
                </SheetContent>
            </Sheet>

            {showPopup && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-black p-4 rounded-lg shadow-lg z-20">
                    You are in selecting mode! Right-click or double-tap to add points.
                </div>
            )}

            {polygon && !isPolygonFinalized && (
                <button
                    className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-12 py-12 rounded-md"
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