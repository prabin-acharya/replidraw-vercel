import { Marker } from "@react-google-maps/api";
import type { UndoManager } from "@rocicorp/undo";
import { Replicache } from "replicache";
import { M } from "./mutators";
import { useMarkerByID } from "./subscriptions";


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
    console.log("++++++++++++++++++++++++++++++++++++++++++", marker)
    if (!marker) {
        console.warn("MarkerController: no marker for id", id);
        return null;
    }
    return (
        <Marker
            key={id}
            position={{ lat: marker.lat, lng:marker.lng }}
            icon="https://maps.google.com/mapfiles/kml/pal2/icon7.png"
            draggable={true}
            onDragEnd={(e) => {
                console.log(e?.latLng?.toJSON())
            }}
        />
    )
}

