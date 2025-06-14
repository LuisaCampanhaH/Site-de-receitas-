// Arquivo: index.js
// Importa a biblioteca json-server.
const jsonServer = require('json-server');
// Cria o servidor.
const server = jsonServer.create();

// Define o caminho para o arquivo de banco de dados JSON.
// Este será o nosso "banco de dados" fake para a API.
const router = jsonServer.router('./codigo/db/db.json');

// Carrega os middlewares padrão do json-server (logging, cors, etc.).
// A opção noCors: true foi adicionada para evitar problemas de CORS durante o desenvolvimento.
const middlewares = jsonServer.defaults({ noCors: true });

// Adiciona os middlewares ao servidor.
server.use(middlewares);
// Adiciona o roteador da API ao servidor.
server.use(router);

// Inicia o servidor na porta 3000.
server.listen(3000, () => {
  console.log(`JSON Server is running em http://localhost:3000`);
});