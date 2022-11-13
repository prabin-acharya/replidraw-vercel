import { GoogleMap, Marker, Polygon, useLoadScript } from "@react-google-maps/api";
import { UndoManager } from "@rocicorp/undo";
import { nanoid } from "nanoid";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Replicache } from "replicache";
import { Collaborator } from "./collaborator";
import { putMarker } from "./marker";
import { MarkerController } from "./marker-controller";
import { M } from "./mutators";
import { useCursor } from "./smoothie";
import {
    useCollaboratorIDs, useMarkerByID, useMarkerIDs, useSelectedMarkerID
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


    const onClick = async (e: google.maps.MapMouseEvent) => {
        // avoid directly mutating state
        setClicks([...clicks, e.latLng!]);
        console.log("clicks", clicks);
        const a = JSON.stringify(e?.latLng?.toJSON(), null, 2)
        const b: { lat: number, lng: number } = JSON.parse(a)
        rep.mutate.createMarker({
            id: nanoid(),
            lat: b.lat,
            lng: b.lng,
            animate: true
        })
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



    const onMouseMove2 = (e: any) => {
        const a = JSON.stringify(e.latLng.toJSON(), null, 2)
        const b: { lat: number, lng: number } = JSON.parse(a)
        onMouseMove({ pageX: b.lat, pageY: b.lng })
    }


    // 
    //
    //

    const markerIds = useMarkerIDs(rep);
    console.log("------++++", markerIds)


    const selectedID = useSelectedMarkerID(rep);

    const move = async (
        dx: number = 0,
        dy: number = 0,
        animate: boolean = true
    ) => {
        await rep.mutate.moveShape({ id: selectedID, dx, dy, animate });
    };


    // 
    //
    // User editable shapes
    let redCoords = [
        { lat: 44.5, lng: -80.6 },
        { lat: 44.01, lng: -79.08 },
        { lat: 44.03, lng: -80 }
    ];




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
                        // onMouseMove,
                    }}
                >

                    <GoogleMap
                        zoom={10}
                        center={{ lat: 44, lng: -80 }}
                        mapContainerStyle={{ height: "100vh", width: "100%", cursor: "pointer" }}
                        onClick={onClick}
                        onMouseMove={(e) => onMouseMove2(e)}
                    // onIdle={onIdle}
                    >

                        <Marker position={{ lat: 44, lng: -80 }}
                        />


                        {/* <Marker position={{ lat: 44, lng: -80 }} /> */}
                        {/* {clicks.map((latLng, i) => (
                            <Marker key={i} position={latLng}
                                icon="https://maps.google.com/mapfiles/kml/pal2/icon7.png"
                                draggable={true}
                                onDragEnd={(e) => {
                                    console.log(e?.latLng?.toJSON())
                                }}
                            />
                        ))} */}


                        {/* 
                        User editable shapes
                        */}
                        <Polygon path={redCoords} editable={true} />



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

                        {
                            // markers
                            markerIds.map((id) => (
                                <MarkerController
                                    {...{
                                        key: `marker-${id}`,
                                        rep,
                                        id,
                                        undoManager,
                                    }}
                                />
                            ))


                        }
                    </GoogleMap>

                </div>
            </>
        }

    </>
    );
}



