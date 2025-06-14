/**
 * ARQUIVO: App.js - Versão Refatorada e Otimizada
 * OBJETIVO: Conter funções globais e utilitários para todo o site,
 * como renderização de componentes (Navbar, Footer) e autenticação.
 */

// URL base da API para ser usada em todos os scripts que a necessitam.
const API_BASE_URL = 'http://localhost:3000';

/**
 * Retorna os dados do usuário logado a partir do sessionStorage.
 * @returns {Object|null} O objeto do usuário ou null se não houver ninguém logado.
 */
function getLoggedInUser() {
    try {
        const user = sessionStorage.getItem('loggedInUser');
        // A conversão para JSON só acontece se o item existir.
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Erro ao ler dados da sessão do usuário:", error);
        // Limpa a sessão em caso de dados corrompidos.
        sessionStorage.removeItem('loggedInUser');
        return null;
    }
}

/**
 * Renderiza a barra de navegação de forma dinâmica em um container específico.
 * @param {string} containerId - O ID do elemento <nav> onde a navbar será inserida.
 * @param {string} pathPrefix - O prefixo do caminho relativo para links (ex: './' na raiz, '../../' em subpastas).
 */
function renderNavbar(containerId, pathPrefix = './') {
    const user = getLoggedInUser();
    const navbarContainer = document.getElementById(containerId);

    if (!navbarContainer) {
        console.error(`O container da navbar com ID '${containerId}' não foi encontrado.`);
        return;
    }

    // Estrutura de links para usuários logados
    const loggedInLinks = `
        <li class="nav-item"><a class="nav-link" href="${pathPrefix}index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="${pathPrefix}modulos/filtro/filtro.html">Explorar Receitas</a></li>
        <li class="nav-item"><a class="nav-link" href="${pathPrefix}modulos/cadastro/cadastro.html">Cadastrar Receita</a></li>
        <li class="nav-item"><a class="nav-link fw-bold" href="${pathPrefix}modulos/MinhaArea/user-area.html">Minha Área</a></li>
        <li class="nav-item"><a id="logout-btn" class="btn btn-outline-danger ms-lg-2" href="#">Sair</a></li>
    `;

    // Estrutura de links para visitantes
    const loggedOutLinks = `
        <li class="nav-item"><a class="nav-link" href="${pathPrefix}index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="${pathPrefix}modulos/filtro/filtro.html">Explorar Receitas</a></li>
        <li class="nav-item"><a class="nav-link" href="${pathPrefix}modulos/login/login.html">Login</a></li>
        <li class="nav-item"><a class="btn btn-primary ms-lg-2" href="${pathPrefix}modulos/login/cadastro-user.html" role="button">Cadastre-se</a></li>
    `;

    navbarContainer.innerHTML = `
        <div class="container-fluid">
            <a class="navbar-brand" href="${pathPrefix}index.html"><i class="fa-solid fa-burger me-2" id="nav_logo"></i>ÉFOOD</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                    ${user ? loggedInLinks : loggedOutLinks}
                </ul>
            </div>
        </div>
    `;

    // Adiciona o evento de logout apenas se o botão existir
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('loggedInUser');
            // Redireciona para a página inicial após o logout
            window.location.href = `${pathPrefix}index.html`;
        });
    }
}

/**
 * Renderiza o rodapé padrão em um container específico.
 * @param {string} containerId - O ID do elemento <footer> onde o conteúdo será inserido.
 */
function renderFooter(containerId) {
    const footerContainer = document.querySelector(containerId);
    if (!footerContainer) {
        console.error(`O container do footer com seletor '${containerId}' não foi encontrado.`);
        return;
    }
    footerContainer.innerHTML = `
        <div class="container footer-content">
            <div>
                <h4>ÉFOOD</h4>
                <p>Sua plataforma de receitas para todos os gostos. Descubra, cozinhe e compartilhe.</p>
            </div>
            <div>
                <h5>Navegação</h5>
                <ul class="list-unstyled">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Sobre Nós</a></li>
                    <li><a href="#">Contato</a></li>
                </ul>
            </div>
            <div>
                <h5>Siga-nos</h5>
                <p>Fique por dentro das novidades em nossas redes sociais.</p>
            </div>
        </div>
        <div class="text-center py-3 border-top border-secondary border-opacity-25">
            <p class="mb-0">&copy; ${new Date().getFullYear()} Éfood. Todos os direitos reservados.</p>
        </div>
    `;
}

// Adiciona o carregamento do rodapé a todas as páginas que incluem este script.
// O seletor '.footer' é genérico para ser aplicado ao elemento <footer>.
document.addEventListener('DOMContentLoaded', () => {
    renderFooter('.footer');
});
