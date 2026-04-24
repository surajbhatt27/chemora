import { useState, useMemo } from "react";
import ElementRow from "./ElementRow";
import atomicMass from "../data/atomicMass";
import confetti from "canvas-confetti";
import { sounds, vibrate } from '../utils/sound';
import {
        getInterpretations,
        scoreInterpretation
} from "../utils/parser";
import FormulaInput from "./FormulaInput";
import ParsedResult from "./ParsedResult"
import ModeToggle from "./ModeToggle";
import ResultDisplay from "./ResultDisplay";

type Row = {
    element: string;
    quantity: number;
};

export default function MolarMassCard() {

    const [result, setResult] = useState<number |null>(null)
    const [formula, setFormula] = useState<string>("")
    const [error, setError] = useState<string| null>(null)
    const [mode, setMode] = useState<"formula" | "manual">("formula");
    const [isCalculating, setIsCalculating] = useState(false);
    const [displayResult, setDisplayResult] = useState<string>("");
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const playSound = (soundName: 'click' | 'success' | 'pop' | 'error') => {
        if (soundEnabled) {
            sounds[soundName]();
        }
    };

    // Typewriter effect for the result
    const typewriterEffect = useMemo(() => {
    return (text: string, onComplete?: () => void) => {
        let i = 0;
        setDisplayResult("");
        const interval = setInterval(() => {
        if (i < text.length) {
            setDisplayResult(text.slice(0, i + 1));
            i++;
        } else {
            clearInterval(interval);
            onComplete?.();
        }
        }, 30);
        return () => clearInterval(interval);
    };
    }, []);

    // calculate mass
    const calculateMass = async () => {
    if (isCalculating) return;
    
    playSound('click')
    setIsCalculating(true);
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    let total = 0;
    for (const row of displayRows) {
        if (!atomicMass[row.element]) {
            playSound('error')
            vibrate(200)
            setIsCalculating(false);
            return;
        }
        const mass = atomicMass[row.element];
        total += mass * row.quantity;
    }
    
    playSound("success")
    vibrate([100, 50, 100]); 
    // Typewriter effect instead of instant display
    const resultText = `${total.toFixed(4)} g/mol`;
    typewriterEffect(resultText, () => {
        setIsCalculating(false);
    });
    
    setResult(total);
    
    // CONFETTI with typewriter delay
    if (total > 0 && !finalError) {
        playSound("pop")
        setTimeout(() => {
            playSound("pop")
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                startVelocity: 20,
                colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']
            });
        
            setTimeout(() => {
                playSound("pop")
                confetti({
                particleCount: 80,
                spread: 100,
                origin: { y: 0.6, x: 0.2 },
                startVelocity: 25,
                });
                confetti({
                particleCount: 80,
                spread: 100,
                origin: { y: 0.6, x: 0.8 },
                startVelocity: 25,
                });
            }, 100);
            }, 200);
    }
    };

    const [rows, setRows] = useState<Row[]>([])

    // add row
    const addRow = ()=> {
        setRows ([...rows, {element:"", quantity: 1}])
        setError(null)
    }

    // remove row
    const handleRemove = (indexToRemove: number)=> {
        const updateRows = rows.filter((_, index) => index !== indexToRemove)
        setRows(updateRows)
    }

    // changes on element and quantity
    const handleChange = (index: number, field: keyof Row, value: string|number) => {
        const updatedRows = [...rows]
        updatedRows[index][field] = value as never;
        setRows(updatedRows)
    }

    const interpretations = useMemo(() => {
        if (!formula.trim()) return [];

        return getInterpretations(formula)
            .sort(
                (a, b) =>
                    scoreInterpretation(b.tokens) -
                    scoreInterpretation(a.tokens)
            )
            .map((interp, idx) => ({
                ...interp,
                originalIndex: idx,
            }));
    }, [formula]);

    const safeIndex = selectedIndex < interpretations.length ? selectedIndex : 0;
    const best = interpretations[safeIndex];   
    const suggestions = interpretations.filter(
        (i) => i.originalIndex !== selectedIndex
    );
    const displayRows = best?.rows || [];

    const finalError =
    mode === "manual"
        ? error
        : interpretations.length === 0
        ? "Invalid formula"
        : null;

    return (
        <>
            <div className="p-4 sm:p-6 bg-white shadow-xl mt-4 sm:mt-6 w-full max-w-lg mx-auto rounded-2xl border">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">Molar Mass Calculator</h2>
                <button
                onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    if (!soundEnabled) {
                    playSound('click'); // Preview sound when unmuting
                    }
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all active:scale-90"
                >
                {soundEnabled ? '🔊' : '🔇'}
                </button>

                <ModeToggle 
                mode={mode}
                setMode={(m) => setMode(m)}
                playSound={playSound}
                />

                <ParsedResult 
                formula={formula}
                displayRows={displayRows}
                finalError={finalError}
                best={best}
                />

                {mode === "formula" && (
                    <FormulaInput 
                    formula={formula}
                    selectedIndex={selectedIndex}
                    interpretations={interpretations}
                    suggestions={suggestions}
                    playSound={playSound}
                    onFormulaChange={(val) => {
                        setFormula(val);
                        setSelectedIndex(0);
                        setError(null);
                    }}
                    onSelectSuggestion={(index) => {
                        setSelectedIndex(index);
                    }}
                    />
                )}

                {mode === "manual" && (
                <>
                    {rows.length === 0 && (
                        <div className="
                            text-center 
                            py-8 
                            px-4 
                            mt-4
                            bg-gray-50 
                            rounded-xl
                            border-2
                            border-dashed
                            border-gray-200
                            touch-manipulation
                        ">
                            {/* Icon */}
                            <svg 
                            className="
                                w-12 
                                h-12 
                                mx-auto 
                                mb-3 
                                text-gray-400
                                opacity-50
                            " 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                            </svg>
                            
                            <p className="
                            text-gray-500 
                            text-sm 
                            sm:text-base
                            mb-2
                            ">
                            No elements added yet
                            </p>
                            
                            <p className="
                            text-gray-400 
                            text-xs 
                            sm:text-sm
                            ">
                            Click "Add Element" to start building your formula
                            </p>
                        </div>
                    )}

                    <button 
                    onClick={() => {
                        sounds.click();
                        addRow();
                    }} 
                    className="
                        group relative overflow-hidden
                        bg-linear-to-r from-emerald-500 to-teal-500 
                        hover:from-emerald-600 hover:to-teal-600
                        text-white px-4 py-3 rounded-xl transition-all duration-300 
                        w-full mb-3 cursor-pointer text-sm sm:text-base mt-3
                        shadow-lg shadow-emerald-500/30
                        hover:shadow-xl hover:shadow-emerald-500/40
                        active:scale-95 active:duration-100
                        font-semibold
                    "
                    >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        ✨ Add Element 
                        <span className="text-lg group-hover:rotate-90 transition-transform duration-300">+</span>
                    </span>
                    </button>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {rows.map((row, index)=>(
                            <ElementRow 
                            key={index}
                            index={index}
                            row={row}
                            onRemove={handleRemove}
                            onChange={handleChange}
                            />
                        ))}
                    </div>
                </>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 p-3 bg-gray-100 rounded-xl">
                    <button 
                    onClick={calculateMass}
                    disabled={
                        !!finalError ||
                        (mode === "formula" && displayRows.length === 0) ||
                        (mode === "manual" && rows.length === 0) ||
                        isCalculating
                    }
                    className={`
                        relative overflow-hidden
                        px-6 py-3 rounded-xl text-white text-sm sm:text-base font-bold
                        transition-all duration-300 ease-out
                        active:scale-95
                        touch-manipulation
                        flex items-center justify-center gap-2
                        ${finalError || (mode === "formula" && displayRows.length === 0) || (mode === "manual" && rows.length === 0)
                        ? "bg-gray-400 cursor-not-allowed opacity-70" 
                        : "bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 cursor-pointer"
                        }
                    `}
                    >
                    {isCalculating ? (
                        <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Calculating...
                        </>
                    ) : (
                        <>
                        ⚡ Calculate
                        </>
                    )}
                    </button>

                    <ResultDisplay
                    result={result}
                    displayResult={displayResult}
                    isCalculating={isCalculating}
                    />
                    
                </div>
            </div>
        </>
    )
}
