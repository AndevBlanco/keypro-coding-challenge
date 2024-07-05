import React, { useEffect, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { transform } from "ol/proj";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import { Icon, Style } from "ol/style";
import "../assets/styles/MapComponent.scss";
import AddMarkerModal from "./AddMarkerModal";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import EditMarkerModal from "./EditMarkerModal";

const MapComponent = () => {
  const navigate = useNavigate();
  const [openAddMarkerModal, setOpenAddMarkerModal] = useState(false);
  const [openEditMarkerModal, setOpenEditMarkerModal] = useState(false);
  const [marker, setMarker] = useState({
    description: "",
    longitude: null,
    latitude: null,
  });
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
      setMarkers(data.markers);
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
        center: [0, 0],
        zoom: 2,
        projection: "EPSG:3857",
      }),
    });

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    map.addLayer(vectorLayer);

    const addMarkersToMap = (markers) => {
      markers.forEach((marker) => {
        const coords = transform(
          [marker.longitude, marker.latitude],
          "EPSG:4326",
          "EPSG:3857"
        );

        const markerFeature = new Feature({
          geometry: new Point(coords),
          id: marker.id,
          description: marker.description,
          date: marker.date,
          name: marker.user_name,
          user_id: marker.user_id,
        });

        const markerStyle = new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: "https://maps.gstatic.com/mapfiles/ms2/micons/red.png",
            scale: 0.8,
          }),
        });
        markerFeature.setId(marker._id);
        markerFeature.setStyle(markerStyle);

        vectorSource.addFeature(markerFeature);
      });
    };

    addMarkersToMap(markers);

    map.on("click", (evt) => {
      const coords = evt.coordinate;
      const transformedCoords = transform(coords, "EPSG:3857", "EPSG:4326");
      const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        return feature;
      });
      if (feature) {
        setMarker({
          id: feature.get("id"),
          name: feature.get("name"),
          description: feature.get("description"),
          date: feature.get("date"),
          userId: feature.get("user_id"),
        });
        setOpenEditMarkerModal(true);
      } else {
        setMarker({
          ...marker,
          longitude: transformedCoords[0],
          latitude: transformedCoords[1],
        });
        setOpenAddMarkerModal(true);
      }
    });

    return () => {
      map.setTarget(null);
    };
  }, [markers]);

  const handleCloseAddMarkerModal = () => {
    fetchMarkers();
    setOpenAddMarkerModal(false)
  };
  const handleCloseEditMarkerModal = () => {
    fetchMarkers();
    setOpenEditMarkerModal(false)
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  return (
    <div>
      <div id="map"></div>
      <AddMarkerModal
        open={openAddMarkerModal}
        handleClose={handleCloseAddMarkerModal}
        marker={marker}
        setMarker={setMarker}
      />
      <EditMarkerModal
        open={openEditMarkerModal}
        handleClose={handleCloseEditMarkerModal}
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
