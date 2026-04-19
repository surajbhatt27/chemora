import MolarMassCard from "./components/MolarMassCard"

function App() {

  return (
    <>
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-indigo-800 to-blue-900 animate-gradient">
      <div className="relative z-10 p-3 text-center backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-xl bg-clip-text text-transparent animate-pulse">
        <h1 
        className="text-2xl sm:text-5xl font-bold bg-linear-to-r from-yellow-200 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-pulse"
        >Chemora ⚡
        </h1>
        <p className="text-white/80 mt-1 sm:mt-2 text-xs sm:text-base font-light tracking-wide">We make Chemistry easy for back benchers</p>
      </div>
      <div className="px-3 sm:px-4 py-4 sm:py-6 relative z-10">
        <MolarMassCard/>
      </div>
    </div>
    </>
  )
}

export default App
