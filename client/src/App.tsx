import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/homePage";
import CallRoom from "./pages/callRoom";
import Navbar from "./components/navbar";

function App() {
  const location = useLocation();
  return (
    <div className="relative bg-primary overflow-hidden h-screen">
    <div className="bg-cover bg-no-repeat bg-center">
    {location.pathname === "/" && <Navbar />}
    </div>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<CallRoom />} path="/:roomid" />
      </Routes>
    </div>
  );
}

export default App;
