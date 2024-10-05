"use client";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import ChatSection from "./chat";

export default function SideDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [map, setMap] = useState<google.maps.Map | null>(null); // Add correct type for Google Maps

    const [style, setStyle] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap'); // Default map style
    const [terrain, setTerrain] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && !map) {
            // Initialize Google Map
            const mapOptions = {
                center: { lat: 40.712776, lng: -74.005974 }, // New York default location
                zoom: 12,
                mapTypeId: style,
            };
            const mapInstance = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);
            setMap(mapInstance);
        }
    }, [style, map]);

    useEffect(() => {
        if (map) {
            map.setMapTypeId(terrain ? 'terrain' : style);
        }
    }, [terrain, style, map]);

    return (
        <div className="relative min-h-screen">
            {/* Sidebar button */}
            <button
                className="fixed left-0 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-2 py-4 rounded-r-md transform -translate-x-1 hover:translate-x-0 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 z-50"
                onClick={() => setIsOpen(true)}
            >
                <span className="text-sm font-bold vertical-text">Open Chat</span>
            </button>

            {/* Map controls */}
            <div className="flex bg-slate-800 rounded-xl m-2 flex-col justify-start border w-[22%] p-3">
                <h1 className="flex justify-start text-lg ml-4">Map Options</h1>
                <div className="flex flex-row m-3">
                    <button className="ml-1" onClick={() => setStyle('roadmap')}>Roadmap</button>
                    <button className="ml-1" onClick={() => setStyle('satellite')}>Satellite</button>
                    <button className="ml-1" onClick={() => setStyle('hybrid')}>Hybrid</button>
                    <button className="ml-1" onClick={() => setTerrain(!terrain)}>
                        {terrain ? 'Disable Terrain' : 'Enable Terrain'}
                    </button>
                </div>
            </div>

            {/* Map container */}
            <div className="flex w-full h-[500px] justify-center items-center" id="map"></div>

            {/* Drawer */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="left" className="w-[70%] sm:w-[70%]">
                    <div className="w-[100%] mt-10">
                        <ChatSection />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Custom styles for vertical text */}
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
