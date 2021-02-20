# Custo-de-vida
APP em React que consiste em utilizar a interface do Google Maps + a API do iFood para buscar itens numa área próxima e estimar o custo a partir da média dos valores.

## Primeiro passo (definir variáveis de ambiente):

Precisamos definir, como variável de ambiente, a chave de acesso da sua conta do Google Cloud e quais serviços/APIs você irá utilizar. Para isso, basta criar um arquivo no diretório raiz com o nome de `.env` e preenchê-lo da seguinte forma:

```
REACT_APP_GOOGLE_MAPS_API_KEY=<SUA-CHAVE-DE-ACESSO>
REACT_APP_GOOGLE_LIBS="places"
```

*Neste projeto só usamos a biblioteca places.*

## Segundo passo (instalar e inicializar a aplicação):

Como toda app react, para instalar todas as depências e inicializar a aplicação execute `yarn install` e `yarn start` respectivamente.