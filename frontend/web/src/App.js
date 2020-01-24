import React, { Fragment } from "react";
import "./App.css";
import Home from "./components/home/home";
import RequestProvider from "./components/utility/contexts/requestContext";
import AdminRequestProvider from "./components/utility/contexts/adminRequestContext";

function App() {
  return (
    <Fragment>
      <RequestProvider>
        <AdminRequestProvider>
          <Home />
        </AdminRequestProvider>
      </RequestProvider>
    </Fragment>
  );
}

export default App;

// const position = [51.505, -0.09]
// const map = (
//   <Map center={position} zoom={13}>
//     <TileLayer
//       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
//     />
//     <Marker position={position}>
//       <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
//     </Marker>
//   </Map>
// )

// render(map, document.getElementById('map-container'))
// export default App;
