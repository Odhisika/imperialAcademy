"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-zinc-100 animate-pulse flex items-center justify-center text-zinc-400 min-h-[500px]">
            Loading Map...
        </div>
    )
});

export default function MapWrapper() {
    return <MapComponent />;
}
