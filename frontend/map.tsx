import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";


export function Map() {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    const center = useMemo(() => ({ lat: 44, lng: -80 }), [])

    return (<>
        {!isLoaded ? <div>Loading...</div> :

            <GoogleMap
                zoom={10}
                center={center}
                mapContainerStyle={{ height: "100vh", width: "100%" }}
            >

                <Marker position={{ lat: 44, lng: -80 }} />
            </GoogleMap>
        }

    </>
    );
}

