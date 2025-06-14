v/**
 * ARQUIVO: user-area.js
 * OBJETIVO: Controlar a página de perfil do usuário, exibindo seus dados e receitas favoritas.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Define o caminho relativo correto para a navbar (subindo dois níveis de diretório)
    renderNavbar('navbar', '../../');

    const user = getLoggedInUser();
    const userNameSpan = document.getElementById('user-name');
    const favoritesContainer = document.getElementById('favorite-dishes');

    // 1. Redireciona se o usuário não estiver logado
    if (!user) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = '../login/login.html';
        return;
    }

    // 2. Exibe o nome do usuário
    if (userNameSpan) {
        userNameSpan.textContent = user.nome;
    }

    /**
     * Busca os favoritos do usuário e os renderiza na página.
     */
    async function loadFavorites() {
        if (!favoritesContainer) return;

        try {
            // Busca os registros de favoritos que pertencem ao usuário logado
            const favResponse = await fetch(`${API_BASE_URL}/favorites?userId=${user.id}`);
            const userFavorites = await favResponse.json();

            if (userFavorites.length === 0) {
                favoritesContainer.innerHTML = "<p>Você ainda não favoritou nenhuma receita. Explore nosso site e encontre suas preferidas!</p>";
                return;
            }

            // Mapeia os IDs para buscar os detalhes completos das receitas em uma única chamada
            const recipeIds = userFavorites.map(fav => `id=${fav.recipeId}`).join('&');
            const recipesResponse = await fetch(`${API_BASE_URL}/recipes?${recipeIds}`);
            const favoriteRecipes = await recipesResponse.json();

            renderFavoriteDishes(favoriteRecipes);

        } catch (error) {
            console.error("Erro ao carregar favoritos:", error);
            favoritesContainer.innerHTML = "<p class='text-danger fw-bold'>Não foi possível carregar seus favoritos. Tente novamente mais tarde.</p>";
        }
    }

    /**
     * Renderiza os cards das receitas favoritas.
     * @param {Array<Object>} recipes - A lista de objetos de receita para renderizar.
     */
    function renderFavoriteDishes(recipes) {
        favoritesContainer.innerHTML = ''; // Limpa o container antes de adicionar os novos cards
        recipes.forEach(recipe => {
            // CORREÇÃO: O caminho da imagem precisa subir dois níveis de diretório para
            // chegar na pasta raiz 'public' e então acessar 'images/'.
            const imagePath = `../../${recipe.imagem}`;

            const dishCard = document.createElement('div');
            dishCard.className = 'dish'; // Reutiliza o estilo dos cards da página principal
            dishCard.innerHTML = `
                <img src="${imagePath}" alt="${recipe.titulo}">
                <div class="dish-content">
                    <h3 class="dish-title">${recipe.titulo}</h3>
                    <p class="dish-description">${recipe.descrição.substring(0, 80)}...</p>
                </div>
                <a href="../../detalhes.html?id=${recipe.id}" class="stretched-link"></a>
            `;
            favoritesContainer.appendChild(dishCard);
        });
    }

    // Inicia o carregamento das receitas favoritas.
    loadFavorites();
});