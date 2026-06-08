import { useState } from "react";
import atomicMass from "../../data/atomicMass";

export default function UnitConverterCard() {
    const [converterType, setConverterType] = useState<"mole" | "temperature" | "pressure" | "molarity">("mole");

    // Mole converter state
    const [formula, setFormula] = useState("");
    const [moles, setMoles] = useState("");
    const [grams, setGrams] = useState("");
    const [liters, setLiters] = useState("");

    // Temperature converter state
    const [celsius, setCelsius] = useState("");
    const [fahrenheit, setFahrenheit] = useState("");
    const [kelvin, setKelvin] = useState("");

    // Pressure converter state
    const [atm, setAtm] = useState("");
    const [mmHg, setMmHg] = useState("");
    const [kPa, setKpa] = useState("");
    const [torr, setTorr] = useState("");

    // Molarity converter state
    const [molarityMoles, setMolarityMoles] = useState("");
    const [molarityVolume, setMolarityVolume] = useState("");
    const [molarityConcentration, setMolarityConcentration] = useState("");

    // Get molar mass from formula (simple parser)
    const getMolarMass = (formulaStr: string): number => {
        let mass = 0;
        for (let i = 0; i < formulaStr.length; i++) {
            const char = formulaStr[i];
            if (char.match(/[A-Z]/)) {
                let element = char;
                if (formulaStr[i + 1]?.match(/[a-z]/)) {
                    element += formulaStr[i + 1];
                    i++;
                }
                let count = 1;
                if (formulaStr[i + 1]?.match(/[0-9]/)) {
                    count = parseInt(formulaStr[i + 1]);
                    i++;
                }
                if (atomicMass[element]) {
                    mass += atomicMass[element] * count;
                }
            }
        }
        return mass;
    };

    const molarMass = formula ? getMolarMass(formula) : 0;

    const handleMolesChange = (val: string) => {
        setMoles(val);
        const molesNum = parseFloat(val);
        if (!isNaN(molesNum) && molarMass) {
            setGrams((molesNum * molarMass).toString());
            setLiters((molesNum * 22.414).toString());
        } else {
            setGrams("");
            setLiters("");
        }
    };

    const handleGramsChange = (val: string) => {
        setGrams(val);
        const gramsNum = parseFloat(val);
        if (!isNaN(gramsNum) && molarMass) {
            const molesNum = gramsNum / molarMass;
            setMoles(molesNum.toString());
            setLiters((molesNum * 22.414).toString());
        } else {
            setMoles("");
            setLiters("");
        }
    };

    const handleLitersChange = (val: string) => {
        setLiters(val);
        const litersNum = parseFloat(val);
        if (!isNaN(litersNum)) {
            const molesNum = litersNum / 22.414;
            setMoles(molesNum.toString());
            if (molarMass) {
                setGrams((molesNum * molarMass).toString());
            }
        } else {
            setMoles("");
            setGrams("");
        }
    };

    // Molarity calculations
    const updateMolarityFromMoles = (val: string) => {
        setMolarityMoles(val);
        const m = parseFloat(val);
        const v = parseFloat(molarityVolume);
        if (!isNaN(m) && !isNaN(v) && v > 0) {
            setMolarityConcentration((m / v).toString());
        } else {
            setMolarityConcentration("");
        }
    };

    const updateMolarityFromVolume = (val: string) => {
        setMolarityVolume(val);
        const v = parseFloat(val);
        const m = parseFloat(molarityMoles);
        if (!isNaN(m) && !isNaN(v) && v > 0) {
            setMolarityConcentration((m / v).toString());
        } else {
            setMolarityConcentration("");
        }
    };

    const updateMolarityFromConcentration = (val: string) => {
        setMolarityConcentration(val);
        const c = parseFloat(val);
        const v = parseFloat(molarityVolume);
        if (!isNaN(c) && !isNaN(v) && v > 0) {
            setMolarityMoles((c * v).toString());
        } else {
            setMolarityMoles("");
        }
    };

    // Temperature conversions
    const updateFromCelsius = (val: string) => {
        setCelsius(val);
        const c = parseFloat(val);
        if (!isNaN(c)) {
            setFahrenheit(((c * 9 / 5) + 32).toString());
            setKelvin((c + 273.15).toString());
        } else {
            setFahrenheit("");
            setKelvin("");
        }
    };

    const updateFromFahrenheit = (val: string) => {
        setFahrenheit(val);
        const f = parseFloat(val);
        if (!isNaN(f)) {
            const c = (f - 32) * 5 / 9;
            setCelsius(c.toString());
            setKelvin((c + 273.15).toString());
        } else {
            setCelsius("");
            setKelvin("");
        }
    };

    const updateFromKelvin = (val: string) => {
        setKelvin(val);
        const k = parseFloat(val);
        if (!isNaN(k)) {
            const c = k - 273.15;
            setCelsius(c.toString());
            setFahrenheit(((c * 9 / 5) + 32).toString());
        } else {
            setCelsius("");
            setFahrenheit("");
        }
    };

    // Pressure conversions
    const updateFromAtm = (val: string) => {
        setAtm(val);
        const a = parseFloat(val);
        if (!isNaN(a)) {
            setMmHg((a * 760).toString());
            setKpa((a * 101.325).toString());
            setTorr((a * 760).toString());
        } else {
            setMmHg("");
            setKpa("");
            setTorr("");
        }
    };

    const updateFromMmHg = (val: string) => {
        setMmHg(val);
        const mm = parseFloat(val);
        if (!isNaN(mm)) {
            setAtm((mm / 760).toString());
            setKpa((mm * 101.325 / 760).toString());
            setTorr(mm.toString());
        } else {
            setAtm("");
            setKpa("");
            setTorr("");
        }
    };

    const updateFromKpa = (val: string) => {
        setKpa(val);
        const k = parseFloat(val);
        if (!isNaN(k)) {
            setAtm((k / 101.325).toString());
            setMmHg((k * 760 / 101.325).toString());
            setTorr((k * 760 / 101.325).toString());
        } else {
            setAtm("");
            setMmHg("");
            setTorr("");
        }
    };

    const updateFromTorr = (val: string) => {
        setTorr(val);
        const t = parseFloat(val);
        if (!isNaN(t)) {
            setAtm((t / 760).toString());
            setMmHg(t.toString());
            setKpa((t * 101.325 / 760).toString());
        } else {
            setAtm("");
            setMmHg("");
            setKpa("");
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="rounded-lg border border-gray-800 bg-black p-6">
                <h1 className="text-xl font-semibold text-white mb-1">Unit Converter</h1>
                <p className="text-gray-400 text-sm mb-5">
                    Convert between chemistry units instantly
                </p>

                {/* Converter Type Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800 pb-3">
                    <button
                        onClick={() => setConverterType("mole")}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${converterType === "mole"
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:bg-gray-900 hover:text-white"
                            }`}
                    >
                        Mole Converter
                    </button>
                    <button
                        onClick={() => setConverterType("molarity")}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${converterType === "molarity"
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:bg-gray-900 hover:text-white"
                            }`}
                    >
                        Molarity
                    </button>
                    <button
                        onClick={() => setConverterType("temperature")}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${converterType === "temperature"
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:bg-gray-900 hover:text-white"
                            }`}
                    >
                        Temperature
                    </button>
                    <button
                        onClick={() => setConverterType("pressure")}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${converterType === "pressure"
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:bg-gray-900 hover:text-white"
                            }`}
                    >
                        Pressure
                    </button>
                </div>

                {/* Mole Converter */}
                {converterType === "mole" && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Chemical Formula
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={formula}
                                    onChange={(e) => {
                                        setFormula(e.target.value);
                                        setMoles("");
                                        setGrams("");
                                        setLiters("");
                                    }}
                                    placeholder="e.g., H2O, NaCl, CO2"
                                    className="flex-1 px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                                />
                                {formula && molarMass > 0 && (
                                    <div className="px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-gray-300 text-sm text-center">
                                        {molarMass.toFixed(4)} g/mol
                                    </div>
                                )}
                            </div>
                        </div>

                        {formula && molarMass > 0 && (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                        Moles (mol)
                                    </label>
                                    <input
                                        type="text"
                                        value={moles}
                                        onChange={(e) => handleMolesChange(e.target.value)}
                                        placeholder="Enter moles"
                                        className="w-full px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                        Grams (g)
                                    </label>
                                    <input
                                        type="text"
                                        value={grams}
                                        onChange={(e) => handleGramsChange(e.target.value)}
                                        placeholder="Enter grams"
                                        className="w-full px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                        Liters at STP (L)
                                    </label>
                                    <input
                                        type="text"
                                        value={liters}
                                        onChange={(e) => handleLitersChange(e.target.value)}
                                        placeholder="Enter liters"
                                        className="w-full px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                                    />
                                    <p className="text-xs text-gray-600 mt-1">
                                        STP = 0°C, 1 atm (22.414 L/mol)
                                    </p>
                                </div>
                            </>
                        )}

                        {formula && molarMass === 0 && (
                            <div className="px-3 py-2 rounded-md bg-red-950/50 border border-red-800 text-red-400 text-sm">
                                Invalid formula or element not found
                            </div>
                        )}
                    </div>
                )}

                {/* Molarity Converter */}
                {converterType === "molarity" && (
                    <div className="space-y-4">
                        <div className="mb-3 p-3 rounded-md bg-gray-900/50 border border-gray-800">
                            <p className="text-sm text-gray-300 text-center">
                                M = moles / liters
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Moles (mol)
                            </label>
                            <input
                                type="text"
                                value={molarityMoles}
                                onChange={(e) => updateMolarityFromMoles(e.target.value)}
                                placeholder="Enter moles"
                                className="w-full px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Volume (L)
                            </label>
                            <input
                                type="text"
                                value={molarityVolume}
                                onChange={(e) => updateMolarityFromVolume(e.target.value)}
                                placeholder="Enter volume in liters"
                                className="w-full px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Molarity (mol/L)
                            </label>
                            <input
                                type="text"
                                value={molarityConcentration}
                                onChange={(e) => updateMolarityFromConcentration(e.target.value)}
                                placeholder="Enter concentration"
                                className="w-full px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            />
                        </div>
                    </div>
                )}

                {/* Temperature Converter */}
                {converterType === "temperature" && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Celsius (°C)
                            </label>
                            <input
                                type="text"
                                value={celsius}
                                onChange={(e) => updateFromCelsius(e.target.value)}
                                placeholder="Enter Celsius"
                                className="w-full px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Fahrenheit (°F)
                            </label>
                            <input
                                type="text"
                                value={fahrenheit}
                                onChange={(e) => updateFromFahrenheit(e.target.value)}
                                placeholder="Enter Fahrenheit"
                                className="w-full px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Kelvin (K)
                            </label>
                            <input
                                type="text"
                                value={kelvin}
                                onChange={(e) => updateFromKelvin(e.target.value)}
                                placeholder="Enter Kelvin"
                                className="w-full px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            />
                        </div>
                    </div>
                )}

                {/* Pressure Converter */}
                {converterType === "pressure" && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Atmosphere (atm)
                            </label>
                            <input
                                type="text"
                                value={atm}
                                onChange={(e) => updateFromAtm(e.target.value)}
                                placeholder="Enter atm"
                                className="w-full px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                mmHg (torr)
                            </label>
                            <input
                                type="text"
                                value={mmHg}
                                onChange={(e) => updateFromMmHg(e.target.value)}
                                placeholder="Enter mmHg"
                                className="w-full px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                kPa
                            </label>
                            <input
                                type="text"
                                value={kPa}
                                onChange={(e) => updateFromKpa(e.target.value)}
                                placeholder="Enter kPa"
                                className="w-full px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                torr
                            </label>
                            <input
                                type="text"
                                value={torr}
                                onChange={(e) => updateFromTorr(e.target.value)}
                                placeholder="Enter torr"
                                className="w-full px-3 py-2 rounded-md border border-gray-700 bg-black text-white placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}