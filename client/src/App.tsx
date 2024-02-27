import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import CallRoom from "./pages/callRoom";

function App() {
  return (
    <>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<CallRoom />} path="/:id" />
      </Routes>
    </>
  );
}

export default App;
