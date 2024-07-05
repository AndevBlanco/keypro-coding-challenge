import React, { useEffect, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import "../assets/styles/MapComponent.scss";
import AddMarkerModal from "./AddMarkerModal";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Modal,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";

const MapComponent = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [marker, setMarker] = useState({ description: "", coords: null });
  const [markers, setMarkers] = useState([]);
  if (!localStorage.getItem("loggedIn")) {
    navigate("/");
  }
  const fetchMarkers = async () => {
    try {
      const response = await fetch("http://localhost:5000/getMarkers");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      setMarkers(data);
    } catch (error) {
      console.error("Error fetching markers:", error);
    }
  };

  useEffect(() => {
    fetchMarkers();
  }, []);

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
      setMarker({ ...marker, coords });
      setOpen(true);
    });

    markers.forEach((marker) => {
      const markerFeature = new Feature({
        geometry: new Point(fromLonLat([marker.longitude, marker.latitude])),
      });

      const markerLayer = new VectorLayer({
        source: new VectorSource({
          features: [markerFeature],
        }),
      });

      map.addLayer(markerLayer);
    });

    return () => {
      map.setTarget("");
    };
  }, [markers]);

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/addMarker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(marker),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Marker saved:", data);
      setOpen(false);
      fetchMarkers();
    } catch (error) {
      console.error("Error saving marker:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  return (
    <div>
      <div id="map"></div>
      <AddMarkerModal
        open={open}
        handleClose={handleClose}
        handleSave={handleSave}
        marker={marker}
        setMarker={setMarker}
      />
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  );
};

export default MapComponent;
