import React, { useState, useCallback, forwardRef, FC, useRef } from 'react';
import { useJsApiLoader, GoogleMap, Autocomplete, Marker } from '@react-google-maps/api'

interface Props {
    address: any
}

const center = { lat: -1.3552439, lng: -88.3922403 };
const Map: FC<Props> = ({ address }) => {
    const mapsInput = useRef<HTMLInputElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const [zoom, setZoom] = useState(5);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: [
            'places'
        ]
    });

    if (!isLoaded) return (<>
        Loading Google Maps...
    </>)

    const searchOnMap = () => {
        if (mapsInput.current?.value === '') return;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: mapsInput.current?.value }, (results, status) => {
            if (status === 'OK') {
                if (results?.[0]) {
                    map?.setCenter(results[0].geometry.location);
                    setMarker(new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map
                    }));
                    setZoom(15);
                    address(results[0].formatted_address);
                }
            }
        }
        );
    }

    return (
        <>
            <div>
                <Autocomplete>
                    <input type="text" ref={mapsInput} />
                </Autocomplete>
                <button onClick={searchOnMap}>
                    Search
                </button>
            </div>
            <div style={{ width: 700, height: 500 }}>

                <GoogleMap
                    center={center}
                    zoom={zoom}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    options={{
                        fullscreenControl: false,
                        mapTypeId: 'hybrid',
                        streetViewControl: false,
                        mapTypeControl: false,
                        draggable: false
                    }}
                    onLoad={(map) => { setMap(map) }}
                >
                    {marker ? <>
                        <Marker position={marker.getPosition() || center} />
                    </> : null}
                </GoogleMap>
            </div>
        </>
    );
}

export default Map