/**
 * ARQUIVO: auth.js - Versão Refatorada e Segura
 * OBJETIVO: Controlar a lógica de login e registo de utilizadores com validações
 * e feedback de erro aprimorados.
 */
document.addEventListener('DOMContentLoaded', () => {
    // A URL base da API é definida no App.js, mas para autossuficiência do módulo:
    const API_BASE_URL = 'http://localhost:3000';

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorMessageDiv = document.getElementById('error-message');

    /**
     * Exibe uma mensagem de erro na div designada.
     * @param {string} message - A mensagem de erro a ser exibida.
     */
    const showErrorMessage = (message) => {
        if (errorMessageDiv) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.style.display = 'block';
        }
    };

    /**
     * Limpa a mensagem de erro.
     */
    const clearErrorMessage = () => {
        if (errorMessageDiv) {
            errorMessageDiv.textContent = '';
            errorMessageDiv.style.display = 'none';
        }
    };

    // --- LÓGICA DE LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrorMessage(); // Limpa erros anteriores

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            if (!email || !senha) {
                showErrorMessage('Por favor, preencha todos os campos.');
                return;
            }

            try {
                // 1. Busca o utilizador apenas pelo e-mail
                const response = await fetch(`${API_BASE_URL}/users?email=${email}`);
                const users = await response.json();

                if (users.length > 0) {
                    const user = users[0];
                    // 2. Compara a senha fornecida com a senha no "banco de dados"
                    if (user.senha === senha) {
                        // Sucesso: Salva os dados na sessão
                        sessionStorage.setItem('loggedInUser', JSON.stringify({ id: user.id, nome: user.nome, email: user.email }));
                        window.location.href = '../../index.html'; // Redireciona para a home
                    } else {
                        // Senha incorreta
                        showErrorMessage('E-mail ou senha inválidos.');
                    }
                } else {
                    // Utilizador não encontrado
                    showErrorMessage('E-mail ou senha inválidos.');
                }
            } catch (error) {
                console.error("Erro no login:", error);
                showErrorMessage('Ocorreu um erro ao tentar fazer login. Tente novamente.');
            }
        });
    }

    // --- LÓGICA DE REGISTO ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrorMessage();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            if (!nome || !email || !senha) {
                showErrorMessage('Por favor, preencha todos os campos.');
                return;
            }

            try {
                // 1. Verifica se o e-mail já existe
                const emailCheckResponse = await fetch(`${API_BASE_URL}/users?email=${email}`);
                const existingUsers = await emailCheckResponse.json();

                if (existingUsers.length > 0) {
                    showErrorMessage('Este e-mail já está registado. Tente fazer login.');
                    return;
                }

                // 2. Se o e-mail não existir, cria o novo utilizador
                const newUser = { nome, email, senha };
                const registerResponse = await fetch(`${API_BASE_URL}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser),
                });

                if (registerResponse.ok) {
                    alert('Registo realizado com sucesso! Agora pode fazer login.');
                    window.location.href = './login.html'; // Redireciona para a página de login
                } else {
                    throw new Error('Falha ao registar o utilizador.');
                }
            } catch (error) {
                console.error("Erro no registo:", error);
                showErrorMessage('Ocorreu um erro ao tentar registar. Tente novamente.');
            }
        });
    }
});
