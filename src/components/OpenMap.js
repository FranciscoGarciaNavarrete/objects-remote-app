import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import '../common/styles/OpenMap.scss';


const OpenMap = (props) => {
    const [map, setMap] = useState(null);
    const [lat, setLat] = useState(props.lat);
    const [long, setLong] = useState(props.long);
    const [points, setPoints] = useState([]);

    const noResults = new L.Popup().setContent("<h2>There are no points using that filter</h2>");

    const Markers = () => {
        return points.map( point =>
            <Marker position={[point.latitude, point.longitude]}>
                <Popup>
                    <div>
                        <h3>{point.name}</h3>
                    </div>
                </Popup>
            </Marker>
        );
    }

    const disableMap = () => {
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        if (map.tap) map.tap.disable();
    }

    const enableMap = () => {
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
        if (map.tap) map.tap.enable();
    }

    useEffect(() => {
        setLat(props.lat);
        setLong(props.long);
    }, [props.lat, props.long]);

    useEffect(() => {
        setPoints(props.points);
    }, [props.points]);

    useEffect(() => {
        if(map){
            if(props.loadingPoints){
                disableMap();
            } else{
                enableMap();
                if(props.points.length > 0){
                    const bounds = new L.LatLngBounds(props.points.map((point) => {
                        return [point.latitude, point.longitude];
                    }));
                    map.fitBounds(bounds);
                    map.closePopup();
                } else{
                    noResults.setLatLng(map.getCenter()).openOn(map);
                }
            }
            
        }        
    }, [props.loadingPoints]);

    return (
        <MapContainer center={[lat, long]} zoom={6} scrollWheelZoom={true} ref={setMap}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Markers></Markers>
        </MapContainer>
    );
}

export default OpenMap;