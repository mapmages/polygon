import React, { useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Polygon,
  TileLayer,
  Map,
  Marker,
  useMapEvents,
} from "react-leaflet";
import { Button, Flex } from "antd";

const Markers = ({ coordinates, handleClick }) => {
  const map = useMapEvents({
    click(e) {
      handleClick(e);
    },
  });

  return (
    <>
      {coordinates.map((coord, i) => {
        <Marker key={i} position={coord} interactive={false} />;
      })}
    </>
  );
};

export default function App() {
  const [coordinates, setCoordinates] = useState([]);
  const [pickingCoordinates, setPickingCoordinates] = useState(false);
  const [polygons, setPolygons] = useState([]);

  const handleMapClick = (e) => {
    if (pickingCoordinates) {
      setCoordinates((prevCoordinates) => [
        ...prevCoordinates,
        [e.latlng.lat, e.latlng.lng],
      ]);
    }
  };

  const handleStartPicking = () => {
    setCoordinates([]); // Clear previously selected coordinates
    setPickingCoordinates(true);
  };

  const handleEndPicking = () => {
    setPickingCoordinates(false);
    setPolygons([...polygons, coordinates]);
    setCoordinates([]);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Flex gap={10}>
        <Button onClick={handleStartPicking} type="primary">
          Start{" "}
        </Button>
        <Button onClick={handleEndPicking} type="primary">
          End{" "}
        </Button>
      </Flex>
      <div style={{ width: "100%", height: "90%" }}>
        <MapContainer
          center={[0, 0]}
          zoom={5}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom={true}

          // onClick={handleMapClick}
        >
          <Markers handleClick={handleMapClick} coordinates={coordinates} />
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {coordinates.length > 0 && <Polygon positions={coordinates} />}

          {polygons.map((polygon) => {
            return <Polygon positions={polygon} />;
          })}
        </MapContainer>
      </div>
    </div>
  );
}
