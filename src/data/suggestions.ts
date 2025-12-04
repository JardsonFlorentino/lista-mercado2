import type { Unit } from "../types/market";

export type Suggestion = {
    name: string;
    unit: Unit;
};

export const SUGGESTIONS: Suggestion[] = [
    // GRÃOS E BÁSICOS (TODOS UN)
    { name: "Arroz Branco", unit: "un" },
    { name: "Arroz Integral", unit: "un" },
    { name: "Arroz Parboilizado", unit: "un" },
    { name: "Feijão Carioca", unit: "un" },
    { name: "Feijão Preto", unit: "un" },
    { name: "Feijão Branco", unit: "un" },
    { name: "Macarrão Espaguete", unit: "un" },
    { name: "Macarrão Fusilli", unit: "un" },
    { name: "Macarrão Penne", unit: "un" },
    { name: "Farinha de Trigo", unit: "un" },
    { name: "Farinha de Milho", unit: "un" },
    { name: "Açúcar Cristal", unit: "un" },
    { name: "Açúcar Refinado", unit: "un" },
    { name: "Açúcar Mascavo", unit: "un" },
    { name: "Sal Refinado", unit: "un" },
    { name: "Sal Grosso", unit: "un" },
    { name: "Café em Pó", unit: "un" },
    { name: "Café em Grão", unit: "un" },
    { name: "Chá", unit: "un" },

    // CARNES (KG)
    { name: "Frango Inteiro", unit: "kg" },
    { name: "Peito de Frango", unit: "kg" },
    { name: "Coxa de Frango", unit: "kg" },
    { name: "Salsicha", unit: "kg" },
    { name: "Linguiça Calabresa", unit: "kg" },
    { name: "Linguiça Toscana", unit: "kg" },
    { name: "Carne Moída", unit: "kg" },
    { name: "Alcatra", unit: "kg" },
    { name: "Patinho", unit: "kg" },
    { name: "Coxão Mole", unit: "kg" },
    { name: "Picanha", unit: "kg" },
    { name: "Filé Mignon", unit: "kg" },
    { name: "Costela", unit: "kg" },
    { name: "Acém", unit: "kg" },
    { name: "Carne de Porco", unit: "kg" },
    { name: "Carne", unit: "kg" },

    // PEIXES (KG)
    { name: "Tilápia", unit: "kg" },
    { name: "Sardinha", unit: "kg" },
    { name: "Atum em Lata", unit: "un" },
    { name: "Salmão", unit: "kg" },

    // FRIOS E LATICÍNIOS
    { name: "Leite Integral", unit: "un" },
    { name: "Leite Desnatado", unit: "un" },
    { name: "Leite Sem Lactose", unit: "un" },
    { name: "Iogurte Natural", unit: "un" },
    { name: "Iogurte Grego", unit: "un" },
    { name: "Queijo Muçarela", unit: "kg" },
    { name: "Queijo Prato", unit: "kg" },
    { name: "Queijo Minas", unit: "kg" },
    { name: "Queijo Parmesão Ralado", unit: "un" },
    { name: "Presunto", unit: "kg" },
    { name: "Mortadela", unit: "kg" },
    { name: "Manteiga", unit: "un" },
    { name: "Requeijão Cremoso", unit: "un" },
    { name: "Cream Cheese", unit: "un" },

    // HORTIFRUTI (KG exceto folhas)
    { name: "Tomate", unit: "kg" },
    { name: "Cebola", unit: "kg" },
    { name: "Alho", unit: "kg" },
    { name: "Batata", unit: "kg" },
    { name: "Batata Doce", unit: "kg" },
    { name: "Cenoura", unit: "kg" },
    { name: "Abobrinha", unit: "kg" },
    { name: "Chuchu", unit: "kg" },
    { name: "Abóbora", unit: "kg" },
    { name: "Maçã Fuji", unit: "kg" },
    { name: "Banana Nanica", unit: "kg" },
    { name: "Banana Prata", unit: "kg" },
    { name: "Laranja Pera", unit: "kg" },
    { name: "Limão Taiti", unit: "kg" },
    { name: "Alface Americana", unit: "un" },
    { name: "Alface Crespa", unit: "un" },
    { name: "Coentro", unit: "un" },
    { name: "Cebolinha", unit: "un" },
    { name: "Salsinha", unit: "un" },
    { name: "Pepino", unit: "kg" },

    // BEBIDAS
    { name: "Água com Gás", unit: "un" },
    { name: "Refrigerante", unit: "un" },
    { name: "Suco", unit: "un" },
    { name: "Chá Gelado", unit: "un" },
    { name: "Cerveja", unit: "un" },
    { name: "Vinho", unit: "un" },
    { name: "Espumante", unit: "un" },
    { name: "Energetico", unit: "un" },
    { name: "Agua Mineral", unit: "un" },
    { name: "Achocolatado", unit: "un" },
    { name: "Bebida Láctea", unit: "un" },




    // LIMPEZA
    { name: "Detergente Líquido", unit: "un" },
    { name: "Sabão em Pó", unit: "un" },
    { name: "Sabão em Liquido", unit: "un" },
    { name: "Sabão em Barra", unit: "un" },
    { name: "Desinfetante", unit: "un" },
    { name: "Amaciante", unit: "un" },
    { name: "Água Sanitária", unit: "un" },
    { name: "Esponja de Aço", unit: "un" },
    { name: "Pano Multiuso", unit: "un" },
    { name: "Lixinho Plástico", unit: "un" },

    // HIGIENE PESSOAL
    { name: "Sabonete ", unit: "un" },
    { name: "Shampoo", unit: "un" },
    { name: "Condicionador", unit: "un" },
    { name: "Pasta de Dente ", unit: "un" },
    { name: "Escova de Dente", unit: "un" },
    { name: "Fio Dental", unit: "un" },
    { name: "Papel Higiênico ", unit: "un" },
    { name: "Papel Toalha", unit: "un" },
    { name: "Desodorante Rexona", unit: "un" },
    { name: "Absorvente", unit: "un" },
    { name: "Enxaguante Bucal", unit: "un" },

    // PANIFICAÇÃO E CONFEITARIA
    { name: "Pão Francês", unit: "un" },
    { name: "Pão de Forma", unit: "un" },
    { name: "Pão Integral", unit: "un" },
    { name: "Biscoito Cream Cracker", unit: "un" },
    { name: "Biscoito Maisena", unit: "un" },
    { name: "Bolacha Negresco", unit: "un" },
    { name: "Chocolate Nestlé", unit: "un" },
    { name: "Chocolate ao Leite", unit: "un" },

    // ENLATADOS E MOLHOS
    { name: "Milho Verde", unit: "un" },
    { name: "Ervilha", unit: "un" },
    { name: "Molho de Tomate", unit: "un" },
    { name: "Extrato de Tomate", unit: "un" },
    { name: "Maionese Hellmann's", unit: "un" },
    { name: "Ketchup", unit: "un" },
    { name: "Mostarda", unit: "un" },
    { name: "Catchup", unit: "un" },


    // OVOS E DERIVADOS
    { name: "Ovos Brancos", unit: "un" },
    { name: "Ovos Marrons", unit: "un" },

    // BEBIDAS NÃO ÁLCOOLICAS
    { name: "Nescau", unit: "un" },
    { name: "Todo Dia", unit: "un" },
    { name: "Mel", unit: "un" },

    // EXTRAS
    { name: "Fermento Químico", unit: "un" },
    { name: "Fermento Biológico", unit: "un" },
    { name: "Bicarbonato de Sódio", unit: "un" },
    { name: "Leite em Pó", unit: "un" },
];
