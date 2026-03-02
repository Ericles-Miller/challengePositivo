# 🚀 Challenge Positivo - API de Gerenciamento de Clientes

API RESTful desenvolvida com NestJS para gerenciamento de clientes, utilizando MongoDB como banco de dados e Docker para containerização.

## 📋 Descrição

Este projeto é uma API para gerenciamento de clientes (CRUD), desenvolvida como parte de um desafio técnico. A aplicação possui validação de dados, tratamento de erros, logs estruturados, documentação Swagger e testes unitários.

## ✨ Funcionalidades

- ✅ Criar cliente (POST)
- ✅ Listar todos os clientes com paginação (GET)
- ✅ Buscar cliente por ID (GET)
- ✅ Atualizar cliente parcialmente (PATCH)
- ✅ Atualizar cliente completamente (PUT)
- ✅ Deletar cliente (DELETE)
- ✅ Validação de CPF
- ✅ Validação de dados com class-validator
- ✅ Documentação Swagger/OpenAPI
- ✅ Logs estruturados
- ✅ Testes unitários
- ✅ Containerização com Docker

## 🛠️ Tecnologias Utilizadas

- **Node.js** (v20+)
- **NestJS** (Framework)
- **MongoDB** (Banco de dados)
- **Mongoose** (ODM)
- **Docker & Docker Compose** (Containerização)
- **Swagger** (Documentação)
- **Jest** (Testes)
- **TypeScript**

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 20 ou superior) - [Download](https://nodejs.org/)
- **Yarn** (gerenciador de pacotes) - [Instalação](https://yarnpkg.com/getting-started/install)
- **Docker** (versão 20.10 ou superior) - [Download](https://www.docker.com/get-started)
- **Docker Compose** (versão 2.0 ou superior) - Geralmente já vem com o Docker Desktop

Para verificar se estão instalados corretamente:

```bash
node --version   # Deve mostrar v20.x.x ou superior
yarn --version   # Deve mostrar 1.22.x ou superior
docker --version # Deve mostrar 20.10.x ou superior
docker-compose --version # Deve mostrar v2.x.x ou superior
```

## 🚀 Como Executar o Projeto

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/Ericles-Miller/challengePositivo.git
cd challengePositivo
```

### 2️⃣ Configure as Variáveis de Ambiente

Copie o arquivo de exemplo e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e ajuste as credenciais se necessário:

```env
PORT=3000
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=yourpassword
DATABASE_URL=mongodb://root:yourpassword@mongo:27017
```

### 3️⃣ Opção A: Executar com Docker (Recomendado)

Esta opção roda tanto a API quanto o MongoDB em containers:

```bash
# Builda e inicia todos os containers
docker-compose up -d --build

# Verifica se os containers estão rodando
docker-compose ps

# Visualiza os logs
docker-compose logs -f api
```

A API estará disponível em:
- **Swagger**: http://localhost:3000/api

Para parar os containers:

```bash
docker-compose down
```

### 3️⃣ Opção B: Executar Localmente

Se preferir rodar a API localmente (apenas o MongoDB no Docker):

```bash
# 1. Inicia apenas o MongoDB
docker-compose up -d mongo mongo-express

# 2. Instala as dependências
yarn install

# 3. Roda a aplicação em modo desenvolvimento
yarn start:dev
```

A API estará disponível em http://localhost:3000

## 🧪 Executar Testes

Os testes foram implemntados com intuito de validar os endpoints, DTOs e métodos de client. Sendo assim, todos os arquivos que foram feitos testes unitários tem a cobertura superior a 80%. Essa cobertura de testes pode ser comprovada com os testes coverages.

```bash
# Testes unitários
yarn test

# Testes em modo watch
yarn test:watch

# Testes com coverage
yarn test:cov

# Teste em um único arquivo
yarn test test/src/clients/caminho-do-arquivo/nome-do-arquivo
```

## 📚 Documentação da API

Após iniciar o projeto, acesse a documentação interativa do Swagger:

**http://localhost:3000/api**

Nela você pode:
- Ver todos os endpoints disponíveis
- Testar as requisições diretamente pelo navegador
- Ver os modelos de dados (schemas)
- Ver exemplos de requisições e respostas

### Principais Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/client` | Cria um novo cliente |
| GET | `/client` | Lista todos os clientes (paginado) |
| GET | `/client/:id` | Busca um cliente por ID |
| PATCH | `/client/:id` | Atualiza parcialmente um cliente |
| PUT | `/client/:id` | Atualiza completamente um cliente |
| DELETE | `/client/:id` | Remove um cliente |

## 📁 Estrutura do Projeto

```
src/
├── client/                    # Módulo de clientes
│   ├── dto/                   # Data Transfer Objects
│   │   ├── create-client.dto.ts
│   │   ├── update-client.dto.ts
│   │   ├── pagination.dto.ts
│   │   └── client-response.dto.ts
│   ├── entities/              # Entidades do Mongoose
│   │   └── client.entity.ts
│   ├── repository/            # Camada de repositório
│   │   ├── client.repository.ts
│   │   ├── client.repository.spec.ts
│   │   └── client-repository.interface.ts
│   ├── validators/            # Validadores customizados
│   │   └── cpf.validator.ts
│   ├── client.controller.ts   # Rotas/Endpoints
│   ├── client.service.ts      # Lógica de negócio
│   └── client.module.ts       # Módulo NestJS
├── logger/                    # Sistema de logs
│   ├── logger.interceptor.ts
│   └── all-execptions-filter.ts
├── app.module.ts              # Módulo raiz
└── main.ts                    # Entry point
```

## 🐳 Comandos Docker Úteis

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs apenas da API
docker-compose logs -f api

# Parar os containers
docker-compose down

# Parar e remover volumes (⚠️ apaga os dados do banco)
docker-compose down -v

# Rebuild da aplicação
docker-compose up -d --build api

# Acessar o shell do container
docker-compose exec api sh

# Acessar o MongoDB shell
docker-compose exec mongo mongosh -u root -p
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
yarn start          # Inicia a aplicação
yarn start:dev      # Inicia em modo watch (auto-reload)
yarn start:debug    # Inicia em modo debug

# Build
yarn build          # Compila o projeto

# Produção
yarn start:prod     # Inicia a aplicação compilada

# Linting e Formatação
yarn lint           # Executa o ESLint
yarn format         # Formata o código com Prettier

# Testes
yarn test           # Executa testes unitários
yarn test:watch     # Testes em modo watch
yarn test:cov       # Testes com coverage
```

## 🎯 Arquitetura e Boas Práticas

- **Arquitetura em Camadas**: Controller → Service → Repository
- **Separação de Responsabilidades**: Cada camada com sua responsabilidade específica
- **DTOs**: Validação e transformação de dados
- **Injeção de Dependências**: Usando o sistema do NestJS
- **Validação de Dados**: class-validator e class-transformer
- **Tratamento de Erros**: Exception filters globais
- **Logs Estruturados**: Interceptors para logging de requisições e erros
- **Testes Unitários**: Cobertura das principais funcionalidades
- **Documentação Automática**: Swagger

## 🤖 Uso de IA

**Declaração**: Este projeto foi desenvolvido com o auxílio de ferramentas de Inteligência Artificial (GitHub Copilot) para:
- Sugestões de implementação via auto completed
- Documentação(com exeção da parte técnica)
- Auxílio na implementação de containers

## 📝 Decisões Técnicas

### Por que NestJS?
- Framework maduro e bem documentado
- Arquitetura modular e escalável
- Suporte nativo ao TypeScript
- Integração fácil com Swagger
- Sistema robusto de injeção de dependências
- Familiaridade com Nestjs

### Decisão de Separação de responsablidade e Arquitetura
- Foi escolhida a arquitetura padrão do nestJs por questões de praticidade, facilidade além do desafio ser simples, não vendo a necessidade de escolher arquiteturas mais robustas. Além disso, foi adicionada na estrutura do projeto uma camada a mais de repositories como foi pedido no desafio. 

### Transações entre responsabilidades
- Foi seguido boas práticas e padrões de clean code em todos os métodos. Sendo assim, métodos POST, PUT e PATCH, os dados são enviados do controller para os serviços em Dtos. Algumas validações são feitas em DTOs como dados nulos, ou inválidos como email e document(cpf). 
- Todo método ao ser validado no serviço é enviado para funções de um repository. Esse repository segue um contrato com uma interface definindo quais dados serão enviados e quais serão retornados. Se esse contrato for atendido no repositoty a função está liberada para enviar os dados ao banco de dados. Em caso de sucesso, o repository retorna esses dados ao serviço e é retornado ao usuário.

### Validações e tratamentos de erros 
- Foi tratado todos os campos como nome, email, docuemnt. Foi criado um validador para o document usando uma biblioteca que valida cpfs, evitando erros de lógica do próprio desenvolvedor. 
- Foi validado todos os outros dados com a biblioteca padrão do nest class validator e class transform. Nele são validados dados nulos, emails inválidos, números válidos para o DTO de paginação etc. 
- Foi feito uma validação de erros para todos os métodos do serviço e erros de validação em Dtos. O tratamento nas funções seguem um padrão de tratamentos de erros inesperados(500), não encontrados(404), não certos(400), e números máximos de requisições(429). Caso haja um erro é lançada um erro é retornado ao usuário.

### Logs 
- foi implementado um sistema de logs para ser gerado a cada tipo de status de requisição. Sendo assim, foi desenvolvido um middleware e um filter para mostrar os logs gerados. Para cada requisição será enviado um log de sucesso de erro ou advertência. 
- Foram implementados logs de error warn e success.
- A escolha do middleware para gerar os logs foi tomado com o objetivo de reduzir injeções da classe logger nos serviços . Sendo assim fica definido automáticamente que a cada requisição gera um logger no terminal.
- O filter tem por objetivo filtrar o status das requisições e gerar logs com base no status code. Sendo assim, status maiores que 200 e menores que 300 gera um logger de sucesso. Para status maiores que 400 e menores 500 logs de warn e maiores que 500 status de error.

### Tests
- foram implementados testes unitários voltados apenas para o cliente
- Os testes nas DTOs tem como objetivo testas os inputs e payloads enviados. Sendo assim, eles tem como objetivo validar as regras definidas na Dto como cpfs, emails, nomes, etc válidos
- Já os testes de serviço tem como objetivo testas as funções como validações de email e documentos que já existem, e o envio de dados para o repository
- Os testes de controller testam os inputs enviados para o serviço e esperam que a response esteja de acordo com o que foi definido na função do método. 
- Já os testes de repository testam o envio de dados se está seguindo o contrato da interface e o retorno dos dados após o envio para o banco
- Os testes que foram implementados foram mocados usando o spyon biblioteca do jest, com intuito de simular os dados a serem enviados e recebidos eram válidos, a ponto de não quebrar o método.

### Endpoints 
- Foram implementados todos os endpoints pedidos no desafio. Além disso, foi definido os dados que foram pedidos no desafio. 
- Para o endpoint de POST foi injetado os dados do user como nome document e email. Já o dado createdAt é gerado automaticamente pelo banco ao ser cadadstrado um novo cliente.
- O endpoint GET:id busca um user pelo seu id no banco
- O endpoint GET busca todos os user de forma paginada
- O endpoint PATCH tem como objetivo atualizar parcialmente os dados do cliente. Sendo assim, entendo que email e documento não devem ser alterados em uma Api, vejo como imutáveis. Então nesse método quis simular esse funcionamento.
- Já o endpoint PUT vejo como regra o objetivo de alterar todos os dados do cliente. Então fiz dessa forma, mostrando o funcionamento do método para fins didáticos.
- O dado updateAt é preenchido quando o client é atualizado nos endpoints PUT e PATCH
- O endpoint DELETE serve para deletar um cliente

### Perguntas 
- Caso haja uma dúvida entre em contato comigo


## 👤 Autor

**Ericles Miller**
- GitHub: [@Ericles-Miller](https://github.com/Ericles-Miller)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
