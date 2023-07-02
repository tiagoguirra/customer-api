# customer-api

## Desenvolvido com

- [NestJs](https://docs.nestjs.com/)
- [NodeJs](https://nodejs.org/en)
- [TypeScript](https://www.typescriptlang.org/)

## Instalação em ambiente de produção

### Requisitos

**Docker**
Para executar a aplicação em modo de produção é necessário ter instalado o [Docker](https://www.docker.com/) na maquina a ser executada.

**Docker compose**
*Como opcional* pode ser utilizado em conjunto com o [Docker compose](https://docs.docker.com/compose/) para facilitar a implantação de todo o ecossistema necessário para execução.

### Variáveis de ambiente

As variáveis de ambiente são necessárias para execução da aplicação no qual através delas é inferido configurações como endereço do servidor `Redis` e porta de execução.

O arquivo contendo as variáveis de ambiente precisa ser criado na pasta raiz onde a aplicação se encontra, o arquivo precisa ser nomeado como `.env`, um arquivo exemplar pode ser encontrado na pasta raiz com o nome `.env.template`.

**Variáveis de ambiente para o projeto**

| Chave | Requerida | Padrão | Descrição|
| ----- | --------- | ------ | -------- |
| API_PORT | Opcional | 3000 | Porta de execução da aplicação |
| REDIS_PORT | Obrigatória | 6379 | Porta da aplicação Redis |
| REDIS_HOST | Obrigatória | - | Endereço da aplicação Redis |
| REDIS_USER | Opcional | default | Nome do usuário de acesso ao Redis |
| REDIS_PASS | Opcional | default | Senha de acesso ao Redis |

**Exemplo do arquivo de variáveis**
```.env
REDIS_PORT=6379
REDIS_HOST=127.0.0.1
REDIS_USER=default
REDIS_PASSWORD=
```

### Instalação via Docker

Após clonar o repositório na maquina, faça o build da imagem da aplicação docker e depois a execute.

**Pré-requisito: Redis**
Como pré-requisito é necessário ter em sua máquina uma instância do [Redis](https://redis.io/) disponível para que a api possa fazer uso, podendo esta estar rodando localmente ou em um servidor na núvem.

Veja aqui um exemplo de como instânciar o Redis usando uma [imagem Docker](https://hub.docker.com/_/redis).

```bash
docker run --name redis -d -p 6379:6379 redis
```

**1 - Build da imagem docker**

```bash
docker build -t customer-api .
```

**2 - Inicializando o container**

```bash
docker run -p 3000:3000 --name customer-api --network host  -it customer-api 
```
> Para simplificar a implantação deste exemplo usaremos o docker com a conexão ancorada a maquina host, recomendo que em um cenário de aplicação real seja criado uma conexão privada para permitir a comunicação entre as aplicações necessárias.

### Instalação via Docker Compose

Após clonar o repositório na maquina, execute do docker compose para que todo ecossistema necessário para execução da aplicação (Redis e Customer Api) seja instânciado.

```bash
docker-compose up
```

Utilizando pelo Docker compose o arquivo com as variáveis de ambiente será o nomeado `.env.compose` e a porta exposta será 3000, caso deseje pode ser modificado no arquivo `docker-compose.yml`.


### Fazendo uso da aplicação

Após a inicialização da aplicação podemos fazer uso da mesma via insomnia ou postman, veja a [documentação da api](./docs/swagger.yml).

O endereço da aplicação será o seu endereço local na porta exposta pelo Docker.


**Autenticação**
A autenticação deve ser feita utilizando o SSO `https://accounts.seguros.vitta.com.br/` 

```curl
curl --request POST \
  --url https://accounts.seguros.vitta.com.br/auth/realms/careers/protocol/openid-connect/token \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data grant_type=client_credentials \
  --data client_id=customers \
  --data client_secret=<client_secret> \
  --data username=<your_address_email> \
  --data password=<your_address_email_base_64> \
  --data scope=openid
```