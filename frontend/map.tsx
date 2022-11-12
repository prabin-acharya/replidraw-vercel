import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import type { UndoManager } from "@rocicorp/undo";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Replicache } from "replicache";
import { Collaborator } from "./collaborator";
import { M } from "./mutators";
import {
    useCollaboratorIDs
} from "./subscriptions";

export function Map({
    rep,
    undoManager,
}: {
    rep: Replicache<M>;
    undoManager: UndoManager;
}) {


    const [clicks, setClicks] = React.useState<google.maps.LatLng[]>([]);
    const [zoom, setZoom] = React.useState(3); // initial zoom
    const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
        lat: 44, lng: -80,
    });

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });


    const onClick = (e: google.maps.MapMouseEvent) => {
        // avoid directly mutating state
        setClicks([...clicks, e.latLng!]);
    };

    const onIdle = (m: google.maps.Map) => {
        console.log("onIdle");
        setZoom(m.getZoom()!);
        setCenter(m.getCenter()!.toJSON());
    };

    // 
    // 
    const collaboratorIDs = useCollaboratorIDs(rep);

    const ref = useRef<HTMLDivElement | null>(null);


    const onMouseMove = async ({
        pageX,
        pageY,
    }: {
        pageX: number;
        pageY: number;
    }) => {
        if (ref && ref.current) {
            rep.mutate.setCursor({
                id: await rep.clientID,
                x: pageX,
                y: pageY - ref.current.offsetTop,
            });
        }
    };


    return (<>
        {!isLoaded ? <div>Loading...</div> :
            <>

                <div
                    {...{
                        ref,
                        style: {
                            position: "relative",
                            display: "flex",
                            flex: 1,
                            overflow: "hidden",
                            border: "2px solid green",
                        },
                        onMouseMove,
                    }}
                >

                    <GoogleMap
                        zoom={10}
                        center={center}
                        mapContainerStyle={{ height: "100vh", width: "100%", cursor: "pointer" }}
                        onClick={onClick}
                    // onIdle={onIdle}
                    >

                        {/* <Marker position={{ lat: 44, lng: -80 }} /> */}
                        {clicks.map((latLng, i) => (
                            <Marker key={i} position={latLng} />
                        ))}
                    </GoogleMap>
                    {
                        // collaborators
                        // foreignObject seems super buggy in Safari, so instead we do the
                        // text labels in an HTML context, then do collaborator selection
                        // rectangles as their own independent svg content. Le. Sigh.
                        collaboratorIDs.map((id) => (
                            <Collaborator
                                {...{
                                    key: `key-${id}`,
                                    rep,
                                    clientID: id,
                                }}
                            />
                        ))
                    }
                </div>
            </>
        }

    </>
    );
}

