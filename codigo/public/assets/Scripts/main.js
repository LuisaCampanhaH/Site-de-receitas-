/**
 * ARQUIVO: main.js - Versão com Busca na Página
 * OBJETIVO: Controlar a página inicial, incluindo carrossel, busca local,
 * lista de receitas e o gráfico de categorias.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Renderiza a navbar, que está na raiz (prefixo './')
    renderNavbar('navbar', './');

    // Elementos da UI
    const carouselInner = document.querySelector('#mainCarousel .carousel-inner');
    const dishesContainer = document.getElementById('dishes');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const chartCanvas = document.getElementById('categoryChart');

    // Armazena todas as receitas para evitar múltiplas chamadas à API
    let allRecipes = [];

    /**
     * Função principal que inicializa todos os componentes da página.
     */
    async function initializePage() {
        try {
            const response = await fetch(`${API_BASE_URL}/recipes`);
            if (!response.ok) {
                throw new Error('Falha ao carregar as receitas do servidor.');
            }
            
            allRecipes = await response.json();

            // Renderiza os componentes com os dados recebidos
            renderCarousel(allRecipes.slice(0, 5));
            renderDishes(allRecipes);
            renderCategoryChart(allRecipes);
            // Configura os listeners de busca após os dados serem carregados
            addSearchListeners();

        } catch (error) {
            console.error('Falha ao inicializar a página:', error);
            dishesContainer.innerHTML = `<p class="text-center text-danger fw-bold">${error.message} Verifique se o servidor local (npm start) está rodando.</p>`;
            if (chartCanvas) chartCanvas.parentElement.style.display = 'none';
        }
    }

    /**
     * Configura os listeners para o formulário de busca da página inicial,
     * permitindo a filtragem em tempo real sem sair da página.
     */
    function addSearchListeners() {
        if (!searchForm || !searchInput) return;

        // Impede que o formulário recarregue a página ao pressionar Enter
        searchForm.addEventListener('submit', (e) => e.preventDefault());

        // Filtra as receitas dinamicamente conforme o usuário digita
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const filteredRecipes = allRecipes.filter(recipe => 
                recipe.titulo.toLowerCase().includes(searchTerm)
            );
            renderDishes(filteredRecipes);
        });
    }

    /**
     * Renderiza os cards de receitas no container principal.
     * @param {Array<Object>} recipes - A lista de receitas a ser exibida.
     */
    function renderDishes(recipes) {
        dishesContainer.innerHTML = '';
        if (recipes.length === 0) {
            dishesContainer.innerHTML = '<p class="text-center">Nenhuma receita encontrada com este termo.</p>';
            return;
        }

        recipes.forEach(recipe => {
            const imagePath = recipe.imagem;
            const card = document.createElement('div');
            card.className = 'dish';
            card.innerHTML = `
                <img src="${imagePath}" alt="${recipe.titulo}" loading="lazy">
                <div class="dish-content">
                    <h3 class="dish-title">${recipe.titulo}</h3>
                    <p class="dish-description">${recipe.descrição.substring(0, 80)}...</p>
                </div>
                <a href="detalhes.html?id=${recipe.id}" class="stretched-link"></a>
            `;
            dishesContainer.appendChild(card);
        });
    }

    /**
     * Renderiza os itens do carrossel de destaque.
     * @param {Array<Object>} recipes - As receitas a serem exibidas no carrossel.
     */
    function renderCarousel(recipes) {
        if (!carouselInner) return;
        carouselInner.innerHTML = '';
        recipes.forEach((recipe, index) => {
            const imagePath = recipe.imagem;
            const item = document.createElement('div');
            item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            item.style.backgroundImage = `url('${imagePath}')`;
            item.innerHTML = `
                <a href="detalhes.html?id=${recipe.id}" class="carousel-link-overlay"></a>
                <div class="carousel-caption d-none d-md-block">
                    <h5>${recipe.titulo}</h5>
                </div>
            `;
            carouselInner.appendChild(item);
        });
    }

    /**
     * Renderiza o gráfico de pizza com a distribuição de receitas por categoria.
     * @param {Array<Object>} recipes - Todas as receitas para análise.
     */
    function renderCategoryChart(recipes) {
        if (!chartCanvas || typeof Chart === 'undefined') {
            console.warn('Elemento do gráfico ou biblioteca Chart.js não encontrados.');
            return;
        }

        const categoryCounts = recipes.reduce((acc, recipe) => {
            const category = recipe.categoria || 'Sem Categoria';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(categoryCounts);
        const data = Object.values(categoryCounts);

        new Chart(chartCanvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nº de Receitas',
                    data: data,
                    backgroundColor: ['#775084', '#a07ab3', '#4c3b54', '#E0F8F0', '#f5b8a6', '#f4a261', '#e76f51'],
                    borderColor: '#FFFFFF',
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: false,
                    }
                }
            }
        });
    }

    // Inicia o carregamento da página
    initializePage();
});