import { Marker } from "@react-google-maps/api";
import type { UndoManager } from "@rocicorp/undo";
import { Replicache } from "replicache";
import { M } from "./mutators";
import { useMarkerByID } from "./subscriptions";
import { setMarker } from "./marker";


export function MarkerController({
    rep,
    id,
    undoManager,
}: {
    rep: Replicache<M>;
    id: string;
    undoManager: UndoManager;
}) {
    const marker = useMarkerByID(rep, id);
    if (!marker) {
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
        <Marker
            key={id}
            position={{ lat: marker.lat, lng:marker.lng }}
            icon="https://maps.google.com/mapfiles/kml/pal2/icon7.png"
            draggable={true}
            onDrag={(e) =>onDrag(e)}
        />
    )
}

