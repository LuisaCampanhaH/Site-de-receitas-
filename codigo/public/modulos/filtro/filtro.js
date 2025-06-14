/**
 * ARQUIVO: filtro.js - Versão Refatorada e Otimizada
 * OBJETIVO: Controlar a página de filtro, permitindo ao usuário buscar,
 * filtrar por categoria e ordenar as receitas de forma combinada.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Renderiza a navbar, subindo dois níveis de diretório
    renderNavbar('navbar', '../../');

    // --- Seleção de Elementos da UI ---
    const resultsContainer = document.getElementById('filter-results');
    const searchInput = document.getElementById('search-input');
    const categoryContainer = document.getElementById('category-filters');
    const sortSelect = document.getElementById('sort-select');
    const resultsCounter = document.getElementById('results-counter');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    // --- Estado da Página ---
    let allRecipes = []; // Guarda a lista original de receitas para evitar novas buscas
    let filters = {      // Guarda o estado atual dos filtros aplicados
        searchTerm: '',
        categories: [],
        sortBy: 'default'
    };

    /**
     * Função principal que busca os dados e configura a página de filtros.
     */
    async function initializePage() {
        try {
            const response = await fetch(`${API_BASE_URL}/recipes`);
            if (!response.ok) throw new Error("Falha ao carregar as receitas do servidor.");
            
            allRecipes = await response.json();
            
            // Após carregar os dados, configura os componentes da página
            populateCategoryFilters();
            addEventListeners();
            applyFiltersAndRender(); // Renderiza a lista inicial completa

        } catch (error) {
            console.error("Erro ao inicializar a página de filtros:", error);
            resultsContainer.innerHTML = `<p class="text-danger text-center fw-bold w-100">${error.message} Verifique se o servidor local (npm start) está rodando.</p>`;
            resultsCounter.textContent = "Não foi possível carregar as receitas.";
        }
    }

    /**
     * Adiciona os event listeners aos inputs de filtro para reatividade.
     */
    function addEventListeners() {
        searchInput.addEventListener('input', () => {
            filters.searchTerm = searchInput.value.toLowerCase().trim();
            applyFiltersAndRender();
        });

        sortSelect.addEventListener('change', () => {
            filters.sortBy = sortSelect.value;
            applyFiltersAndRender();
        });

        // O 'change' no container captura eventos de todos os checkboxes dentro dele
        categoryContainer.addEventListener('change', () => {
            filters.categories = Array.from(categoryContainer.querySelectorAll('input:checked')).map(cb => cb.value);
            applyFiltersAndRender();
        });
        
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    /**
     * Limpa todos os filtros aplicados e re-renderiza a lista completa.
     */
    function clearAllFilters() {
        filters = { searchTerm: '', categories: [], sortBy: 'default' };
        
        // Reseta os valores nos elementos do formulário
        searchInput.value = '';
        sortSelect.value = 'default';
        Array.from(categoryContainer.querySelectorAll('input:checked')).forEach(cb => cb.checked = false);
        
        applyFiltersAndRender();
    }

    /**
     * Orquestra a filtragem, ordenação e renderização dos resultados.
     */
    function applyFiltersAndRender() {
        let filteredRecipes = [...allRecipes];

        // 1. Aplica filtro por termo de busca
        if (filters.searchTerm) {
            filteredRecipes = filteredRecipes.filter(r => r.titulo.toLowerCase().includes(filters.searchTerm));
        }
        
        // 2. Aplica filtro por categorias selecionadas
        if (filters.categories.length > 0) {
            filteredRecipes = filteredRecipes.filter(r => filters.categories.includes(r.categoria));
        }

        // 3. Aplica ordenação
        if (filters.sortBy === 'az') {
            filteredRecipes.sort((a, b) => a.titulo.localeCompare(b.titulo));
        } else if (filters.sortBy === 'za') {
            filteredRecipes.sort((a, b) => b.titulo.localeCompare(a.titulo));
        }
        
        renderResults(filteredRecipes);
        updateUiComponents(filteredRecipes.length);
    }
    
    /**
     * Atualiza componentes da UI como o contador de resultados e o botão de limpar.
     * @param {number} count - O número de receitas atualmente exibidas.
     */
    function updateUiComponents(count) {
        const hasFilters = filters.searchTerm || filters.categories.length > 0 || filters.sortBy !== 'default';
        
        resultsCounter.textContent = `Exibindo ${count} de ${allRecipes.length} receitas.`;
        clearFiltersBtn.style.display = hasFilters ? 'block' : 'none';
    }

    /**
     * Renderiza os cards das receitas no container de resultados.
     * @param {Array<Object>} recipes - A lista de receitas filtradas e ordenadas.
     */
    function renderResults(recipes) {
        resultsContainer.innerHTML = '';
        if (recipes.length === 0) {
            resultsContainer.innerHTML = `
                <div class="text-center w-100 my-5">
                    <h4>Nenhuma receita encontrada</h4>
                    <p>Tente ajustar ou limpar os filtros para ver mais resultados.</p>
                </div>
            `;
            return;
        }
        recipes.forEach(recipe => {
            // O caminho da imagem precisa subir 2 níveis para chegar na pasta 'public'
            const imagePath = `../../${recipe.imagem}`;
            const card = document.createElement('div');
            // Reutiliza a classe 'dish' do CSS global
            card.className = 'dish'; 
            card.innerHTML = `
                <img src="${imagePath}" alt="${recipe.titulo}" loading="lazy">
                <div class="dish-content">
                    <h3 class="dish-title">${recipe.titulo}</h3>
                    <p class="dish-description">${recipe.descrição.substring(0, 80)}...</p>
                </div>
                <a href="../../detalhes.html?id=${recipe.id}" class="stretched-link"></a>
            `;
            resultsContainer.appendChild(card);
        });
    }

    /**
     * Gera e insere os checkboxes de categoria dinamicamente a partir das receitas.
     */
    function populateCategoryFilters() {
        const categories = [...new Set(allRecipes.map(r => r.categoria).filter(Boolean))].sort();
        
        if (categories.length === 0) {
             categoryContainer.innerHTML = '<p class="text-muted small">Nenhuma categoria encontrada.</p>';
             return;
        }

        categoryContainer.innerHTML = categories.map(cat => `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="${cat}" id="cat-${cat.replace(/\s+/g, '-') }">
                <label class="form-check-label" for="cat-${cat.replace(/\s+/g, '-')}">${cat}</label>
            </div>
        `).join('');
    }

    // Inicia o carregamento da página
    initializePage();
});
