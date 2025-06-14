Éfood - Plataforma de Receitas
📖 Sobre o Projeto
O Éfood é uma plataforma web interativa para partilha e descoberta de receitas culinárias. Desenvolvido como parte da disciplina de Desenvolvimento de Interfaces Web, o projeto permite que os utilizadores explorem um vasto livro de receitas, filtrem por categoria, guardem as suas receitas favoritas e adicionem as suas próprias criações. A aplicação foi construída com HTML, CSS e JavaScript puros no frontend, e utiliza o json-server para simular uma API RESTful para persistência de dados.

✨ Funcionalidades Principais
Visualização de Receitas: Página inicial com receitas em destaque e uma lista completa.

Detalhes da Receita: Página dedicada para cada receita, com ingredientes e modo de preparação.

Sistema de Autenticação: Os utilizadores podem criar uma conta e fazer login para aceder a funcionalidades exclusivas.

Área do Utilizador: Painel pessoal onde os utilizadores podem ver os seus dados e receitas favoritas (funciona somente se o usuario estiver logado).

Cadastro de Receitas (CRUD): Utilizadores autenticados podem Criar, Ler, Atualizar e Apagar (CRUD) as suas próprias receitas (funciona somente se o usuario estiver logado).

Filtro e Busca Avançada: Uma página dedicada para explorar receitas, com filtros por nome, categoria e opção de ordenação.

Design Responsivo: Interface adaptada para uma experiência de utilização agradável em desktops, tablets e telemóveis.

🛠️ Tecnologias Utilizadas
Frontend:

HTML5

CSS3 (com Variáveis e Flexbox/Grid)

JavaScript (ES6+)

Bootstrap 5: Para componentes de UI e grelha responsiva.

Chart.js: Para a visualização de gráficos na página inicial.

Font Awesome: Para ícones.

Backend (Simulado):

Node.js

json-server: Para criar uma API RESTful falsa a partir de um ficheiro JSON.

🚀 Instalação e Execução
Para executar este projeto localmente, siga os passos abaixo.

Pré-requisitos
Node.js (que inclui o npm) instalado na sua máquina.

Passos
Clone o repositório para a sua máquina local:

git clone https://github.com/LuisaCampanhaH/Site-de-receitas-.git

Navegue até a pasta do projeto:

cd nome-da-pasta-do-projeto

Entre na pasta codigo:
Toda a lógica da aplicação está dentro desta pasta, então é importante executar os comandos a partir dela.

cd codigo

Instale as dependências do projeto (neste caso, o json-server):

npm install

Inicie o servidor:
Este comando irá iniciar o json-server, que servirá a API a partir do db/db.json e os ficheiros estáticos (HTML, CSS, JS) da pasta public.

npm start

Abra a aplicação no navegador:
Após iniciar o servidor, a aplicação estará disponível em http://localhost:3000.

📁 Estrutura de Pastas
O projeto está organizado da seguinte forma dentro da pasta codigo:

codigo/
├── db/
│   └── db.json         # Base de dados (receitas, utilizadores, favoritos)
├── node_modules/       # Dependências do Node.js
├── public/
│   ├── assets/
│   │   ├── Scripts/    # Ficheiros JavaScript (App.js, main.js, etc.)
│   │   └── styles/     # Ficheiros de estilo CSS
│   ├── images/         # Imagens das receitas
│   └── modulos/        # Sub-pastas para cada funcionalidade (login, cadastro, etc.)
│       ├── cadastro/
│       ├── favoritos/
│       ├── filtro/
│       ├── login/
│       └── MinhaArea/
│   ├── detalhes.html   # Página de detalhes da receita
│   └── index.html      # Página inicial
├── index.js            # Configuração do json-server (não utilizado no start script)
├── package.json        # Definições do projeto e scripts
└── README.md           # Este ficheiro

👤 Autor
Luisa Campanha

GitHub
https://github.com/LuisaCampanhaH
LinkedIn
https://www.linkedin.com/in/luisa-campanha-b54700364/