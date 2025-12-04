import { useEffect, useState } from "react";
import type { AppMode, MarketList, MarketItem } from "./types/market";
import { ItemForm } from "./components/ItemForm";
import { ItemList } from "./components/ItemList";

const STORAGE_KEY = "market-lists-v2";
const THEME_KEY = "market-app-theme";

type Theme = "light" | "dark";

type AppState = {
  mode: AppMode;
  lists: MarketList[];
  currentListId: string | null;
  currentListDraft: MarketItem[];
  currentListName: string;
  isAddingItemInView: boolean;
};

function loadInitialLists(): MarketList[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as MarketList[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function loadInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function buildListText(list: MarketList): string {
  const lines: string[] = [];
  lines.push(`Lista: ${list.name}`);
  lines.push(`Criada em: ${new Date(list.createdAt).toLocaleString("pt-BR")}`);
  lines.push("");
  lines.push("Itens:");

  list.items.forEach((item, index) => {
    const base = `${index + 1}. ${item.name} - ${item.quantity} ${item.unit}`;
    const price =
      item.unitPrice > 0 ? ` | Preço: ${item.unitPrice.toFixed(2)}` : "";
    const inCart = item.inCart ? " | PEG0" : "";
    lines.push(base + price + inCart);
  });

  const total = list.items.reduce(
    (sum, i) => sum + i.quantity * i.unitPrice,
    0
  );
  lines.push("");
  lines.push(
    `Total: ${total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}`
  );

  return lines.join("\n");
}

function App() {
  const [state, setState] = useState<AppState>(() => ({
    mode: "home",
    lists: loadInitialLists(),
    currentListId: null,
    currentListDraft: [],
    currentListName: "",
    isAddingItemInView: false,
  }));

  const [theme, setTheme] = useState<Theme>(() => loadInitialTheme());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lists));
    } catch {
      // ignore localStorage error
    }
  }, [state.lists]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // --- Navegação ---
  const goHome = () =>
    setState((prev) => ({
      ...prev,
      mode: "home",
      currentListId: null,
      currentListDraft: [],
      currentListName: "",
      isAddingItemInView: false,
    }));

  const goCreate = () =>
    setState((prev) => ({
      ...prev,
      mode: "create",
      currentListId: null,
      currentListDraft: [],
      currentListName: "",
      isAddingItemInView: false,
    }));

  const goView = (id: string) =>
    setState((prev) => ({
      ...prev,
      mode: "view",
      currentListId: id,
      currentListDraft: [],
      isAddingItemInView: false,
    }));

  const goEdit = (id: string) =>
    setState((prev) => ({
      ...prev,
      mode: "edit",
      currentListId: id,
      currentListDraft: [],
      isAddingItemInView: false,
    }));

  // --- Funções criar lista ---
  const handleAddDraftItem = (item: MarketItem) => {
    setState((prev) => ({
      ...prev,
      currentListDraft: [...prev.currentListDraft, item],
    }));
  };

  const handleChangeListName = (name: string) => {
    setState((prev) => ({
      ...prev,
      currentListName: name,
    }));
  };

  const handleFinalizeList = () => {
    if (state.currentListDraft.length === 0) return;

    const now = new Date().toISOString();

    const newList: MarketList = {
      id: crypto.randomUUID(),
      name: state.currentListName.trim() || "Lista sem nome",
      createdAt: now,
      updatedAt: now,
      items: state.currentListDraft,
    };

    setState((prev) => ({
      ...prev,
      lists: [newList, ...prev.lists],
      mode: "view",
      currentListId: newList.id,
      currentListDraft: [],
      currentListName: "",
    }));
  };

  // --- Helpers edição lista ---
  const updateCurrentListItems = (
    updater: (items: MarketItem[]) => MarketItem[]
  ) => {
    setState((prev) => {
      if (!prev.currentListId) return prev;
      const lists = prev.lists.map((list) => {
        if (list.id !== prev.currentListId) return list;
        const newItems = updater(list.items);
        return {
          ...list,
          items: newItems,
          updatedAt: new Date().toISOString(),
        };
      });
      return { ...prev, lists };
    });
  };

  const handleToggleInCart = (id: string) => {
    updateCurrentListItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, inCart: !item.inCart } : item
      )
    );
  };

  const handleChangeItemQuantity = (id: string, quantity: number) => {
    if (!Number.isFinite(quantity) || quantity <= 0) return;
    updateCurrentListItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleChangeItemPrice = (id: string, unitPrice: number) => {
    if (!Number.isFinite(unitPrice) || unitPrice < 0) return;
    updateCurrentListItems((items) =>
      items.map((item) => (item.id === id ? { ...item, unitPrice } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    updateCurrentListItems((items) => items.filter((item) => item.id !== id));
  };

  // --- UX extra ---
  const handleMarkAllInCart = () => {
    updateCurrentListItems((items) =>
      items.map((item) => ({ ...item, inCart: true }))
    );
  };

  const handleClearInCart = () => {
    updateCurrentListItems((items) => items.filter((item) => !item.inCart));
  };

  const handleSortPendingFirst = () => {
    updateCurrentListItems((items) =>
      [...items].sort((a, b) => Number(a.inCart) - Number(b.inCart))
    );
  };

  // Deixar o ItemForm visível (modo adicionar item) dentro da tela View
  const openAddItemInView = () => {
    setState((prev) => ({
      ...prev,
      isAddingItemInView: true,
    }));
  };

  const closeAddItemInView = () => {
    setState((prev) => ({
      ...prev,
      isAddingItemInView: false,
    }));
  };

  // Admitir um novo item direto na lista aberta (modo view)
  const handleAddItemInView = (item: MarketItem) => {
    updateCurrentListItems((items) => [...items, item]);
    closeAddItemInView();
  };

  // Duplicar lista
  const handleDuplicateList = (id: string) => {
    const original = state.lists.find((l) => l.id === id);
    if (!original) return;
    const now = new Date().toISOString();

    const dup: MarketList = {
      ...original,
      id: crypto.randomUUID(),
      name: original.name + " (cópia)",
      createdAt: now,
      updatedAt: now,
    };

    setState((prev) => ({
      ...prev,
      lists: [dup, ...prev.lists],
    }));
  };

  // Apagar lista
  const handleDeleteList = (id: string) => {
    setState((prev) => {
      const isCurrent = prev.currentListId === id;
      const lists = prev.lists.filter((list) => list.id !== id);
      return {
        ...prev,
        lists,
        currentListId: isCurrent ? null : prev.currentListId,
        mode: isCurrent ? "home" : prev.mode,
      };
    });
  };

  // Resetar tudo (apagar todas as listas)
  const handleResetAll = () => {
    if (confirm("Tem certeza que deseja apagar todas as listas?")) {
      setState({
        mode: "home",
        lists: [],
        currentListId: null,
        currentListDraft: [],
        currentListName: "",
        isAddingItemInView: false,
      });
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Exportar/copiar lista atual em texto
  const handleExportCurrentList = async () => {
    const current = state.lists.find((l) => l.id === state.currentListId);
    if (!current) return;
    const text = buildListText(current);

    try {
      await navigator.clipboard.writeText(text);
      alert("Lista copiada para a área de transferência!");
    } catch {
      window.prompt("Copie a lista abaixo:", text);
    }
  };

  // --- RENDER ---
  // HOME
  if (state.mode === "home") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900/70 via-blue-900 to-gray-900 px-4 py-6">
        <main className="mx-auto w-full max-w-md">
          <div className="bg-gray-900/80 border border-gray-800 rounded-3xl shadow-2xl px-6 py-6 md:px-8 md:py-8">
            <header className="text-center mb-6 relative">
              <button
                type="button"
                onClick={toggleTheme}
                className="absolute right-0 -top-2 text-xl text-gray-400 hover:text-gray-200"
                aria-label="Alternar tema claro/escuro"
              >
                {theme === "dark" ? "🌙" : "☀️"}
              </button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
                🛒 Lista de Mercado
              </h1>
              <p className="text-gray-400 text-sm">
                {state.lists.length === 0
                  ? "A lista está vazia. Clique em 'Criar Nova Lista' para começar."
                  : `Você tem ${state.lists.length
                  } lista${state.lists.length > 1 ? "s" : ""}.`}
              </p>
            </header>

            <button
              onClick={goCreate}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-6 py-3 rounded-2xl text-lg font-semibold shadow-lg transition transform hover:-translate-y-1"
            >
              ➕ Criar Nova Lista
            </button>

            {state.lists.length > 0 && (
              <>
                <div className="mt-6 space-y-2">
                  <h2 className="text-sm font-semibold text-gray-300 mb-1">
                    Minhas listas
                  </h2>

                  {state.lists.map((list) => (
                    <div
                      key={list.id}
                      className="relative bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-3 text-left"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-semibold text-gray-100">
                            {list.name}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Criada:{" "}
                            {new Date(
                              list.createdAt
                            ).toLocaleDateString("pt-BR")}
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => goView(list.id)}
                            className="text-xs text-blue-400 hover:text-blue-300"
                            title="Abrir lista"
                          >
                            Abrir
                          </button>
                          <button
                            onClick={() => goEdit(list.id)}
                            className="text-xs text-gray-400 hover:text-gray-200"
                            title="Editar lista"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDuplicateList(list.id)}
                            className="text-xs text-green-400 hover:text-green-300"
                            title="Duplicar lista"
                          >
                            Duplicar
                          </button>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  "Tem certeza que deseja apagar esta lista?"
                                )
                              ) {
                                handleDeleteList(list.id);
                              }
                            }}
                            className="text-xs text-red-400 hover:text-red-300"
                            title="Apagar lista"
                          >
                            Apagar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleResetAll}
                  className="mt-6 w-full bg-red-700 hover:bg-red-800 text-white rounded-lg py-2 text-xs font-semibold shadow-lg transition hover:brightness-110"
                >
                  🚨 Resetar todas as listas
                </button>
              </>
            )}
          </div>
        </main>

        {/* Footer em card fixo */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
          <div className="bg-gray-900/90 border border-gray-800 rounded-full px-4 py-2 shadow-lg text-[11px] text-gray-400 backdrop-blur-sm">
            Lista de Mercado – Uso pessoal - Desenvolvido por Jardson Florentino com TypeScript & React.
          </div>
        </div>
      </div>
    );
  }

  // CRIAR LISTA
  if (state.mode === "create") {
    const draftTotal = state.currentListDraft.length;
    const canFinish = draftTotal > 0;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-900/80 border border-gray-800 rounded-3xl shadow-2xl px-6 py-6 md:px-7 md:py-7 space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-1 text-blue-400">
                Criar nova lista
              </h2>
              <p className="text-gray-400 text-sm">
                Dê um nome para a lista e adicione os itens.
              </p>
            </div>

            <input
              type="text"
              placeholder="Nome da lista (opcional)"
              value={state.currentListName}
              onChange={(e) => handleChangeListName(e.target.value)}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <ItemForm onAddItem={handleAddDraftItem} />

            <div className="mt-2 space-y-2 max-h-64 overflow-auto">
              <h3 className="text-sm font-semibold text-gray-300">
                Itens adicionados ({draftTotal})
              </h3>
              <ul className="space-y-1 text-sm">
                {state.currentListDraft.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2"
                  >
                    <span>{item.name}</span>
                    <span className="text-gray-400">
                      {item.quantity} {item.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={handleFinalizeList}
              disabled={!canFinish}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              ✅ Finalizar e ver lista
            </button>

            <button
              onClick={goHome}
              className="block mt-1 text-center text-xs text-gray-400 hover:text-gray-200 underline"
            >
              Voltar para Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // VIEW (tela principal de uso)
  if (state.mode === "view") {
    const current = state.lists.find((l) => l.id === state.currentListId);

    if (!current) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
          <div className="max-w-md w-full text-center">
            <p className="text-gray-400 mb-4 text-sm">Lista não encontrada.</p>
            <button
              onClick={goHome}
              className="text-sm text-blue-400 hover:text-blue-300 underline"
            >
              Voltar para Home
            </button>
          </div>
        </div>
      );
    }

    const itemsInCart = current.items.filter((i) => i.inCart).length;
    const itemsPending = current.items.length - itemsInCart;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
        <main className="w-full max-w-md">
          <div className="bg-gray-900/80 border border-gray-800 rounded-3xl shadow-2xl px-6 py-6 md:px-7 md:py-7 space-y-4">
            <header className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <button
                  onClick={goHome}
                  className="text-xs text-gray-400 hover:text-gray-200 underline"
                >
                  ← Voltar para Home
                </button>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="text-lg text-gray-400 hover:text-gray-200"
                  aria-label="Alternar tema claro/escuro"
                >
                  {theme === "dark" ? "🌙" : "☀️"}
                </button>
              </div>
              <h2 className="text-2xl font-bold text-blue-400">
                {current.name}
              </h2>
              <p className="text-[11px] text-gray-500">
                Criada em{" "}
                {new Date(current.createdAt).toLocaleString("pt-BR")}
              </p>
              <p className="text-xs text-gray-400">
                Itens no carrinho:{" "}
                <span className="text-green-400 font-semibold">
                  {itemsInCart}
                </span>{" "}
                • Pendentes:{" "}
                <span className="text-yellow-400 font-semibold">
                  {itemsPending}
                </span>
              </p>
            </header>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={handleMarkAllInCart}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-shadow shadow hover:shadow-lg"
              >
                Marcar todos comprados
              </button>
              <button
                type="button"
                onClick={handleClearInCart}
                className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-shadow shadow hover:shadow-lg"
              >
                Limpar itens no carrinho
              </button>
              <button
                type="button"
                onClick={handleSortPendingFirst}
                className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-100 transition-shadow shadow hover:shadow-lg"
              >
                Pendentes primeiro
              </button>
              <button
                type="button"
                onClick={() =>
                  state.isAddingItemInView
                    ? closeAddItemInView()
                    : openAddItemInView()
                }
                className="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-shadow shadow hover:shadow-lg"
              >
                {state.isAddingItemInView ? "Cancelar" : "Adicionar item"}
              </button>
              <button
                type="button"
                onClick={handleExportCurrentList}
                className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-shadow shadow hover:shadow-lg"
              >
                Exportar / Copiar
              </button>
            </div>

            {state.isAddingItemInView && (
              <div className="mt-2 bg-gray-900 rounded-lg p-4 border border-gray-700 shadow-md">
                <ItemForm onAddItem={handleAddItemInView} />
              </div>
            )}

            <ItemList
              items={current.items}
              readOnly={false}
              onToggleInCart={handleToggleInCart}
              onChangeQuantity={handleChangeItemQuantity}
              onChangePrice={handleChangeItemPrice}
              onRemoveItem={handleRemoveItem}
            />

            <footer className="text-center mt-2 text-xs text-gray-500 select-none">
              Total da compra:{" "}
              <strong>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(
                  current.items.reduce(
                    (sum, i) => sum + i.quantity * i.unitPrice,
                    0
                  )
                )}
              </strong>
            </footer>
          </div>
        </main>
      </div>
    );
  }

  // EDIT (placeholder para futura config avançada)
  if (state.mode === "edit") {
    const current = state.lists.find((l) => l.id === state.currentListId);

    if (!current) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
          <div className="max-w-md w-full text-center">
            <p className="text-gray-400 mb-4 text-sm">Lista não encontrada.</p>
            <button
              onClick={goHome}
              className="text-sm text-blue-400 hover:text-blue-300 underline"
            >
              Voltar para Home
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-900/80 border border-gray-800 rounded-3xl shadow-2xl px-6 py-6 md:px-7 md:py-7 space-y-4">
            <header className="space-y-1">
              <button
                onClick={goHome}
                className="text-xs text-gray-400 hover:text-gray-200 underline mb-1"
              >
                ← Voltar para Home
              </button>
              <h2 className="text-2xl font-bold text-blue-400">
                Editar configuração: {current.name}
              </h2>
              <p className="text-xs text-gray-400">
                (Futuro: renomear lista, duplicar, limpar lista inteira, etc.)
              </p>
            </header>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
