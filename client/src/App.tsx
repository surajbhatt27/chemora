import { Routes, Route } from "react-router-dom";

import ReactionBalancerPage from "./pages/ReactionBalancerPage";
import Home from "./pages/Home";
import MolarMassPage from "./pages/MolarMassPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/balance" element={<ReactionBalancerPage />} />
      <Route path="/molar-mass" element={<MolarMassPage />} />
    </Routes>
  );
}