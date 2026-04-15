import MolarMassCard from "./components/MolarMassCard"

function App() {

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <div className="p-3 text-center bg-emerald-100">
        <h1 className="text-4xl text-cyan-700">Chemora</h1>
        <p className="text-cyan-700 mt-2 text-sm sm:text-base">We make Chemistry easy for back benchers</p>
      </div>
      <div className="px-4">
        <MolarMassCard/>
      </div>
    </div>
    </>
  )
}

export default App
