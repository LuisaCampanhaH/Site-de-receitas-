// Arquivo: cadastro.js
// Lógica completa para CRIAR, LER (para edição), ATUALIZAR e DELETAR receitas.

document.addEventListener('DOMContentLoaded', () => {
    // Renderiza a navbar, informando que estamos a dois níveis da raiz
    renderNavbar('navbar', '../../');

    const recipeForm = document.getElementById('recipe-form');
    const formTitle = document.getElementById('form-title');
    const recipeIdField = document.getElementById('recipeId');
    const deleteBtn = document.getElementById('delete-btn');

    // Pega o ID da receita da URL (se estiver no modo de edição)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // MODO EDIÇÃO: Se um ID for encontrado na URL
    if (id) {
        formTitle.textContent = 'Editar Receita';

        // Busca os dados da receita para preencher o formulário (READ)
        fetch(`${API_BASE_URL}/recipes/${id}`)
            .then(res => res.json())
            .then(recipe => {
                recipeIdField.value = recipe.id;
                document.getElementById('titulo').value = recipe.titulo;
                document.getElementById('descricao').value = recipe.descrição;
                document.getElementById('imagem').value = recipe.imagem;
                document.getElementById('categoria').value = recipe.categoria;
                // Converte o array de ingredientes de volta para texto com quebra de linha
                document.getElementById('ingredientes').value = recipe.ingredientes.join('\n');
                document.getElementById('preparo').value = recipe.preparo;

                // Mostra o botão de excluir
                deleteBtn.style.display = 'inline-block';
            })
            .catch(error => console.error('Erro ao carregar receita para edição:', error));
    }

    // Evento de submissão do formulário (CREATE ou UPDATE)
    recipeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Coleta os dados do formulário
        const recipeData = {
            titulo: document.getElementById('titulo').value,
            descrição: document.getElementById('descricao').value,
            imagem: document.getElementById('imagem').value,
            categoria: document.getElementById('categoria').value,
            // Converte o texto dos ingredientes em um array
            ingredientes: document.getElementById('ingredientes').value.split('\n').filter(line => line.trim() !== ''),
            preparo: document.getElementById('preparo').value,
        };

        const currentId = recipeIdField.value;
        const method = currentId ? 'PUT' : 'POST'; // Se tem ID, é UPDATE, senão é CREATE
        const url = currentId ? `${API_BASE_URL}/recipes/${currentId}` : `${API_BASE_URL}/recipes`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipeData),
            });

            if (response.ok) {
                alert('Receita salva com sucesso!');
                window.location.href = '../../index.html'; // Redireciona para a home
            } else {
                throw new Error('Falha ao salvar a receita.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Não foi possível salvar a receita. Tente novamente.');
        }
    });

    // Evento para o botão de exclusão (DELETE)
    deleteBtn.addEventListener('click', async () => {
        const currentId = recipeIdField.value;
        if (!currentId) return;

        if (confirm('Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.')) {
            try {
                const response = await fetch(`${API_BASE_URL}/recipes/${currentId}`, { method: 'DELETE' });
                if (response.ok) {
                    alert('Receita excluída com sucesso!');
                    window.location.href = '../../index.html';
                } else {
                    throw new Error('Falha ao excluir a receita.');
                }
            } catch (error) {
                console.error('Erro ao excluir:', error);
                alert('Não foi possível excluir a receita. Tente novamente.');
            }
        }
    });
});