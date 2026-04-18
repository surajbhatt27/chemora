import MolarMassCard from "./components/MolarMassCard"

function App() {

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <div className="p-3 text-center bg-emerald-100">
        <h1 className="text-2xl sm:text-4xl text-cyan-700 font-bold">Chemora</h1>
        <p className="text-cyan-700 mt-1 sm:mt-2 text-xs sm:text-base">We make Chemistry easy for back benchers</p>
      </div>
      <div className="px-3 sm:px-4 py-4 sm:py-6">
        <MolarMassCard/>
      </div>
    </div>
    </>
  )
}

export default App
