import React from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Polygon, Marker} from 'react-google-maps/lib';

const PublicationMap = withScriptjs(withGoogleMap((props) => {
    const styles = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
    };
    const geoCoords = props.coordinates.split(' ').map(item => (
        {
            lng: Number(item.split(',')[0]),
            lat: Number(item.split(',')[1])
        }
    ));

    const minLngPoint = geoCoords.reduce((min, point) => point.lng < min ? point.lng : min, geoCoords[0].lng);
    const maxLngPoint = geoCoords.reduce((max, point) => point.lng > max ? point.lng : max, geoCoords[0].lng);
    const minLatPoint = geoCoords.reduce((min, point) => point.lat < min ? point.lat : min, geoCoords[0].lat);
    const maxLatPoint = geoCoords.reduce((max, point) => point.lat > max ? point.lat : max, geoCoords[0].lat);
    const defaultCenter = {lng: (maxLngPoint + minLngPoint) / 2, lat: (minLatPoint + maxLatPoint) / 2};
    const pointZoom = 15;
    const polygonZoom = 13;

    const bounds = new window.google.maps.LatLngBounds();
    geoCoords.map((coord) => {
        bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
    });

    return (
        <GoogleMap
            defaultZoom={geoCoords.length === 1 ? pointZoom : polygonZoom}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?${!!process.env.GOOGLE_MAP_KEY ? process.env.GOOGLE_MAP_KEY : ''}v=3.exp&libraries=geometry,drawing,places`}
            defaultCenter={defaultCenter}
            ref={(map) => {map && bounds && geoCoords.length > 1 && map.fitBounds(bounds);}}>
            {
                geoCoords.length > 1 &&
                <Polygon paths={geoCoords} options={styles} />
            }
            {
                geoCoords.length === 1 &&
                <Marker position={geoCoords[0]} />
            }
        </GoogleMap>
    );
}));

export default PublicationMap;
