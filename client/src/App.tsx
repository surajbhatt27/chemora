import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import ReactionBalancerPage from "./pages/ReactionBalancerPage";
import MolarMassPage from "./pages/MolarMassPage";
import PeriodicTablePage from "./pages/PeriodicTablePage";

export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/balance" element={<ReactionBalancerPage />} />
        <Route path="/molar-mass" element={<MolarMassPage />} />
        <Route path="/periodic-table" element={<PeriodicTablePage />} />
      </Routes>
    </div>
  );
}