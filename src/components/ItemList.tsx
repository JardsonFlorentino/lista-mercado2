import type { MarketItem } from "../types/market";

type ItemListProps = {
    items: MarketItem[];
    readOnly?: boolean;
    onToggleInCart?: (id: string) => void;
    onChangeQuantity?: (id: string, quantity: number) => void;
    onChangePrice?: (id: string, unitPrice: number) => void;
    onRemoveItem?: (id: string) => void;
};

const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export function ItemList({
    items,
    readOnly = false,
    onToggleInCart,
    onChangeQuantity,
    onChangePrice,
    onRemoveItem,
}: ItemListProps) {
    const total = items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
    );

    if (items.length === 0) {
        return (
            <div className="mt-4 text-sm text-gray-400">
                Nenhum item na lista ainda.
            </div>
        );
    }

    return (
        <div className="mt-4 space-y-3">
            <ul className="space-y-2">
                {items.map(item => {
                    const itemTotal = item.quantity * item.unitPrice;

                    return (
                        <li
                            key={item.id}
                            className="rounded-xl border border-gray-800 bg-gray-900/70 px-3 py-2"
                        >
                            <div className="flex items-center gap-2">
                                {!readOnly && onToggleInCart && (
                                    <input
                                        type="checkbox"
                                        checked={item.inCart}
                                        onChange={() => onToggleInCart(item.id)}
                                        aria-label={`Marcar ${item.name} como no carrinho`}
                                        className="h-4 w-4 accent-blue-500"
                                    />
                                )}

                                <div className="flex-1">
                                    <div
                                        className={`text-sm font-medium ${item.inCart ? "line-through text-gray-500" : "text-gray-100"
                                            }`}
                                    >
                                        {item.name}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {item.quantity} {item.unit}
                                    </div>
                                </div>

                                {!readOnly && onRemoveItem && (
                                    <button
                                        type="button"
                                        onClick={() => onRemoveItem(item.id)}
                                        className="text-xs text-red-400 hover:text-red-300"
                                    >
                                        Remover
                                    </button>
                                )}
                            </div>

                            {!readOnly && (
                                <div className="mt-2 flex items-center gap-2 text-xs">
                                    {onChangeQuantity && (
                                        <input
                                            type="number"
                                            min={0.1}
                                            step={0.1}
                                            aria-label={`Quantidade de ${item.name}`}
                                            placeholder="Qtd"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                onChangeQuantity(
                                                    item.id,
                                                    Math.max(0.1, Number(e.target.value)),
                                                )
                                            }
                                            className="w-20 rounded-lg bg-gray-800 border border-gray-700 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    )}

                                    {onChangePrice && (
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-400">R$</span>
                                            <input
                                                type="number"
                                                min={0}
                                                step={0.01}
                                                aria-label={`Preço unitário de ${item.name}`}
                                                placeholder="0,00"
                                                value={item.unitPrice || 0}
                                                onChange={(e) =>
                                                    onChangePrice(
                                                        item.id,
                                                        Math.max(0, Number(e.target.value)),
                                                    )
                                                }
                                                className="w-24 rounded-lg bg-gray-800 border border-gray-700 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}

                                    {itemTotal > 0 && (
                                        <span className="ml-auto text-gray-300 font-semibold">
                                            {currency.format(itemTotal)}
                                        </span>
                                    )}
                                </div>
                            )}

                            {readOnly && itemTotal > 0 && (
                                <div className="mt-1 text-xs text-gray-300">
                                    Total: {currency.format(itemTotal)}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>

            <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-800">
                <span>Itens: {items.length}</span>
                <span>Total: {currency.format(total)}</span>
            </div>
        </div>
    );
}
