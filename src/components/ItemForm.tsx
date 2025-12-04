import { useMemo, useState } from "react";
import type { MarketItem, Unit } from "../types/market";
import { SUGGESTIONS } from "../data/suggestions";

type ItemFormProps = {
    onAddItem: (item: MarketItem) => void;
};

const defaultUnit: Unit = "un";

function capitalizeWords(text: string): string {
    return text
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(" ");
}

export function ItemForm({ onAddItem }: ItemFormProps) {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState<number>(1);
    const [unit, setUnit] = useState<Unit>(defaultUnit);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const normalizedName = name.trim().toLowerCase();

    const filteredSuggestions = useMemo(() => {
        if (!normalizedName) return [];
        return SUGGESTIONS.filter(s =>
            s.name.toLowerCase().includes(normalizedName)
        ).slice(0, 8);
    }, [normalizedName]);

    const handleSelectSuggestion = (suggestionName: string, suggestionUnit: Unit) => {
        setName(suggestionName);
        setUnit(suggestionUnit);
        setShowSuggestions(false);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const trimmed = name.trim();
        if (!trimmed || quantity <= 0) return;

        const formattedName = capitalizeWords(trimmed);

        const newItem: MarketItem = {
            id: crypto.randomUUID(),
            name: formattedName,
            quantity,
            unit,
            inCart: false,
            unitPrice: 0,
        };

        onAddItem(newItem);

        setName("");
        setQuantity(1);
        setUnit(defaultUnit);
        setShowSuggestions(false);
    };

    const isValid = name.trim().length > 0 && quantity > 0;

    return (
        <form onSubmit={handleSubmit} className="space-y-3 relative">
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Nome do item"
                        aria-label="Nome do item"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => {
                            setTimeout(() => setShowSuggestions(false), 120);
                        }}
                        className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full rounded-lg bg-gray-900 border border-gray-700 shadow-lg max-h-56 overflow-y-auto">
                            {filteredSuggestions.map(suggestion => (
                                <button
                                    key={suggestion.name}
                                    type="button"
                                    onClick={() =>
                                        handleSelectSuggestion(suggestion.name, suggestion.unit)
                                    }
                                    className="w-full text-left px-3 py-2 text-sm text-gray-100 hover:bg-blue-600/20 hover:text-blue-200 flex items-center justify-between"
                                >
                                    <span>{suggestion.name}</span>
                                    <span className="text-xs text-gray-400">{suggestion.unit}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    aria-label="Quantidade"
                    placeholder="Qtd"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-20 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as Unit)}
                    aria-label="Unidade"
                    title="Unidade"
                    className="w-20 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="un">un</option>
                    <option value="kg">kg</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={!isValid}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
                ➕ Adicionar item
            </button>
        </form>
    );
}
