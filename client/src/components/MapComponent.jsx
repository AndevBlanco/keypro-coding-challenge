import React, { useEffect, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "../assets/styles/MapComponent.scss";
import AddMarkerModal from "./AddMarkerModal";
import { fromLonLat } from "ol/proj";

const MapComponent = () => {
  const [open, setOpen] = useState(false);
  const [point, setPoint] = useState({ name: "", description: "", coords: null });

  useEffect(() => {
    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    map.on("click", (evt) => {
      const coords = evt.coordinate;
      setPoint({ ...point, coords });
      setOpen(true);
    });

    return () => {
      map.setTarget("");
    };
  }, [point]);

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    console.log("Point saved:", point);
    setOpen(false);
  };

  return (
    <div>
      <div id="map"></div>
      <AddMarkerModal
        open={open}
        handleClose={handleClose}
        handleSave={handleSave}
        point={point}
        setPoint={setPoint}
      />
    </div>
  );
};

export default MapComponent;
