import { useState, useEffect } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function EventMap({ evt }) {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewport, setViewport] = useState({
    latitude: 40.712772,
    longitude: -73.935242,   
    zoom: 18
  });
  useEffect(() => {
    fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        evt.attributes.address
      )}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_MAP_API_KEY}`
    )
      .then((response) => response.json())
      .then((result) => {
        const { lat, lon } = result.features[0].properties;
        setLat(lat);
        setLng(lon);
        setViewport({ ...viewport, latitude: lat, longitude: lon });
        setLoading(false);
      })
      .catch((error) => console.log("error", error));
  }, []);

  if (loading) return false;

  return (
    <Map
      initialViewState={{
      ...viewport
      }}
      style={{ width: 800, height: 600 }}
      mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
      mapboxAccessToken={
        process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN
      }
     
    >
      <Marker longitude={lng} latitude={lat} color="red" />
    </Map>
  );
}
