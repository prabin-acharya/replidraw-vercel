import { Marker, Polygon } from "@react-google-maps/api";
import type { UndoManager } from "@rocicorp/undo";
import { Replicache } from "replicache";
import { CLIENT_RENEG_LIMIT } from "tls";
import { setMarker } from "./marker";
import { M } from "./mutators";
import { usePolygonByID } from "./subscriptions";


export function PolygonController({
    rep,
    id,
    undoManager,
}: {
    rep: Replicache<M>;
    id: string;
    undoManager: UndoManager;
}) {
    const polygon = usePolygonByID(rep, id);
    if (!polygon) {
        console.warn("MarkerController: no marker for id", id);
        return null;
    }


    const onDrag = (e: google.maps.MapMouseEvent) => {
        // console.log("onDrag", e?.latLng?.toJSON());
        const a = JSON.stringify(e?.latLng?.toJSON(), null, 2)
        const b: { lat: number, lng: number } = JSON.parse(a)
        rep.mutate.moveMarker({
            id,
            lat: b.lat,
            lng: b.lng,
        });
    };

    return (
        <>
            {/* <Marker
            key={id}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon="https://maps.google.com/mapfiles/kml/pal2/icon7.png"
            draggable={true}
            onDragEnd={(e) => {
                console.log(e?.latLng?.toJSON())
            }}
            onDrag={(e) => onDrag(e)}
            /> */}
            <Polygon
                path={polygon.path}
                editable={true}
                onMouseUp={(e) => {
                    console.log("onMouseUp", e?.latLng?.toJSON());
                    const a = JSON.stringify(e?.latLng?.toJSON(), null, 2)
                    const b: { lat: number, lng: number } = JSON.parse(a);
                    console.log(b)
                }}
                        
            />

        </>
    )
}

