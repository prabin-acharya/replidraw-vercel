import { Marker } from "@react-google-maps/api";
import React, { MouseEventHandler, TouchEventHandler } from "react";
import { Replicache } from "replicache";
import { M } from "./mutators";
import { useMarker } from "./smoothie";
import { useMarkerByID } from "./subscriptions";


export function markerPin({
    rep,
    id,
    onMouseDown,
    onTouchStart,
    onMouseEnter,
    onMouseLeave,
}: {
    rep: Replicache<M>;
    id: string;
    onMouseDown?: MouseEventHandler;
    onTouchStart?: TouchEventHandler;
    onMouseEnter?: MouseEventHandler;
    onMouseLeave?: MouseEventHandler;
}) {
    const marker = useMarkerByID(rep, id);
    const points = useMarker(rep, id);
    if (!marker || !points) {
        return null;
    }

    const { lat, lng } = points;
    const enableEvents =
        onMouseDown || onTouchStart || onMouseEnter || onMouseLeave;

    return (
        // <svg
        //     {...{
        //         style: {
        //             position: "absolute",
        //             left: -1,
        //             top: -1,
        //             transform: `translate3d(${x}px, ${y}px, 0) rotate(${r}deg)`,
        //             pointerEvents: enableEvents ? "all" : "none",
        //         },
        //         width: w + 2,
        //         height: h + 2,
        //         onMouseDown,
        //         onTouchStart,
        //         onMouseEnter,
        //         onMouseLeave,
        //     }}
        // >
        //     <rect
        //         {...{
        //             x: 1, // To make room for stroke
        //             y: 1,
        //             strokeWidth: highlight ? "2px" : "0",
        //             stroke: highlightColor,
        //             width: w,
        //             height: h,
        //             fill: highlight ? "none" : shape.fill,
        //         }}
        //     />
        // </svg>
        <Marker position={{ lat, lng }}
            icon="https://maps.google.com/mapfiles/kml/pal3/icon20.png"

        />
    );
}
