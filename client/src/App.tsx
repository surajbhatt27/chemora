import MolarMassCard from "./components/molarMass/MolarMassCard";
import ReactionBalancer from "./components/ReactionBalancer/ReactionBalancer";

function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 to-black">
      <div className="relative z-10 p-3 text-center border-b border-zinc-700">
<h1 className="text-2xl sm:text-4xl font-bold text-indigo-400">
  Chemora 🧪
</h1>
        <p className="text-zinc-200 mt-1 text-xs sm:text-sm font-light">
          Your chemistry companion
        </p>
      </div>
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        <MolarMassCard />
        <ReactionBalancer />
      </div>
    </div>
  );
}

export default App;