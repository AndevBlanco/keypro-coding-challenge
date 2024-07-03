import React from "react";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import MapComponent from "./components/MapComponent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/map" element={<MapComponent />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
