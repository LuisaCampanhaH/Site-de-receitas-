/**
 * ARQUIVO: favoritos.js
 * OBJETIVO: Lógica para a página de favoritos, buscando e exibindo as receitas favoritadas pelo usuário.
 */
document.addEventListener('DOMContentLoaded', async () => {
    // A navbar precisa saber que está dois níveis abaixo da raiz
    renderNavbar('navbar', '../../');

    const user = getLoggedInUser();
    const dishesContainer = document.getElementById('dishes');

    // Redireciona para a página de login se o usuário não estiver autenticado.
    if (!user) {
        window.location.href = '../login/login.html';
        return;
    }

    /**
     * Carrega as receitas favoritas do usuário logado.
     */
    const loadFavorites = async () => {
        try {
            // 1. Busca os IDs das receitas favoritas do usuário
            const favResponse = await fetch(`${API_BASE_URL}/favorites?userId=${user.id}`);
            const favorites = await favResponse.json();

            if (favorites.length === 0) {
                dishesContainer.innerHTML = '<p style="text-align:center; width:100%;">Você ainda não favoritou nenhuma receita.</p>';
                return;
            }

            // 2. Cria a query string para buscar todas as receitas favoritas de uma vez
            const recipeIdsQuery = favorites.map(fav => `id=${fav.recipeId}`).join('&');

            // 3. Busca os dados completos das receitas favoritas
            const recipesResponse = await fetch(`${API_BASE_URL}/recipes?${recipeIdsQuery}`);
            const favoriteRecipes = await recipesResponse.json();

            // 4. Renderiza os cards na tela
            renderFavoriteDishes(favoriteRecipes);

        } catch (error) {
            console.error("Erro ao carregar favoritos:", error);
            dishesContainer.innerHTML = '<p style="text-align:center; width:100%;" class="text-danger fw-bold">Erro ao carregar seus favoritos. Verifique sua conexão e se o servidor está ativo.</p>';
        }
    };

    /**
     * Renderiza os cards das receitas na tela.
     * @param {Array<Object>} recipes - Lista de receitas para exibir.
     */
    const renderFavoriteDishes = (recipes) => {
        dishesContainer.innerHTML = '';
        recipes.forEach(recipe => {
            // CORREÇÃO: O caminho da imagem precisa subir 2 níveis para encontrar a pasta de imagens.
            const imagePath = `../../${recipe.imagem}`;

            const dishDiv = document.createElement('div');
            dishDiv.className = 'dish'; // Reutilizando a classe de card
            dishDiv.innerHTML = `
                <img src="${imagePath}" alt="${recipe.titulo}">
                <div class="dish-content">
                    <h3 class="dish-title">${recipe.titulo}</h3>
                    <p class="dish-description">${recipe.descrição.substring(0, 80)}...</p>
                </div>
                <a href="../../detalhes.html?id=${recipe.id}" class="stretched-link"></a>
            `;
            dishesContainer.appendChild(dishDiv);
        });
    }

    loadFavorites();
});