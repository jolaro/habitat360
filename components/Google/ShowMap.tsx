import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { FC, useRef, useState } from 'react';
import STYLE from './style.module.scss';

interface Props {
    address: string
}

const centerEC = { lat: -1.3552439, lng: -88.3922403 };
const libraries = ['places']
const ShowMap: FC<Props> = ({ address }) => {
    let libRef: any = useRef(libraries)
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const [zoom, setZoom] = useState(5);
    const [loaded, setLoaded] = useState(false);
    const [center, setCenter] = useState<any>(centerEC);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: libRef.current,
    });

    if (!isLoaded) return (<div className={`${STYLE['map']} ${STYLE['loading']}`}>
        Loading Google Maps...
    </div>)

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
            if (results?.[0]) {
                setMarker(new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map
                }));
                setCenter(results[0].geometry.location);
                setZoom(16);
                setLoaded(true);
            }
        }
    });

    if (!loaded) return (<div className={`${STYLE['map']} ${STYLE['loading']}`}>
        Loading Google Maps...
    </div>)

    return (
        <>
            <div className={STYLE['map']}>
                <GoogleMap
                    center={center}
                    zoom={zoom}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    options={{
                        fullscreenControl: false,
                        mapTypeId: 'hybrid',
                        mapTypeControl: false,
                    }}
                    onLoad={(map) => { setMap(map) }}
                >
                    {marker ? <>
                        <Marker position={marker.getPosition() || center} />
                    </> : null}
                </GoogleMap>
            </div>
        </>
    )
}

export default ShowMap