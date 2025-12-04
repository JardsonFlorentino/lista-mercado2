// src/types/market.ts

// Unidade de medida do item
export type Unit = 'un' | 'kg';

// Item individual da lista de mercado
export interface MarketItem {
    id: string;
    name: string;
    quantity: number;
    unit: Unit;
    inCart: boolean;
    unitPrice: number; // preço unitário em reais
}

// Uma lista completa (ex: “Compra do mês”)
export interface MarketList {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    items: MarketItem[];
}

// Modos de tela da aplicação
export type AppMode = 'home' | 'create' | 'view' | 'edit';
