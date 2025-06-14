/**
 * ARQUIVO: detalhes.js
 * OBJETIVO: Carregar e exibir os detalhes de uma receita específica de forma robusta.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Renderiza a navbar e o footer a partir do App.js
    renderNavbar('navbar', './');

    const recipeContentContainer = document.getElementById('recipe-details-content');

    /**
     * Busca e renderiza os detalhes da receita com base no ID da URL.
     */
    async function loadRecipeDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = urlParams.get('id');

        // Validação inicial: verifica se um ID de receita foi fornecido na URL.
        if (!recipeId) {
            recipeContentContainer.innerHTML = '<p class="text-center text-danger fw-bold">Receita não encontrada. Verifique o link de acesso.</p>';
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`);
            if (!response.ok) {
                // Lança um erro se a resposta da API não for bem-sucedida (ex: erro 404)
                throw new Error('Não foi possível encontrar a receita solicitada.');
            }

            const recipe = await response.json();
            document.title = `${recipe.titulo} - Éfood`; // Atualiza o título da página
            renderRecipe(recipe);

        } catch (error) {
            console.error('Falha ao carregar detalhes da receita:', error);
            // Exibe uma mensagem de erro mais informativa para o usuário.
            recipeContentContainer.innerHTML = `<p class="text-center text-danger fw-bold">${error.message} Verifique se o servidor local (npm start) está rodando.</p>`;
        }
    }

    /**
     * Constrói e exibe o conteúdo da receita na página.
     * @param {Object} recipe - O objeto da receita vindo da API.
     */
    function renderRecipe(recipe) {
        // CORREÇÃO: O caminho da imagem deve ser relativo à raiz do site (`public`).
        // O `db.json` já fornece o caminho correto ("images/arquivo.jpg").
        const imagePath = `./${recipe.imagem}`;

        // Converte o array de ingredientes em itens de lista <li>
        const ingredientsHtml = recipe.ingredientes.map(ing => `<li>${ing}</li>`).join('');
        
        // Converte as linhas do modo de preparo em itens de lista ordenada <ol>
        const preparoHtml = recipe.preparo.split('\n').filter(line => line.trim() !== '').map(step => `<li>${step.trim()}</li>`).join('');

        recipeContentContainer.innerHTML = `
            <div class="recipe-header">
                <h1 class="recipe-title">${recipe.titulo}</h1>
                <p class="recipe-description">${recipe.descrição}</p>
            </div>
            <div class="recipe-image-container">
                <img src="${imagePath}" alt="${recipe.titulo}" class="recipe-image">
            </div>
            <div class="recipe-body-grid">
                <div class="ingredients-section">
                    <h2 class="recipe-section-title">Ingredientes</h2>
                    <ul class="ingredients-list">${ingredientsHtml}</ul>
                </div>
                <div class="preparo-section">
                    <h2 class="recipe-section-title">Modo de Preparo</h2>
                    <ol class="preparo-list">${preparoHtml}</ol>
                </div>
            </div>
        `;
    }

    // Inicia o processo de carregamento dos detalhes.
    loadRecipeDetails();
});