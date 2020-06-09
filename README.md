# 🦠🔰 Covid-19 API (Brazil)
[English](https://github.com/jvdutra/covid-19-br-api/blob/master/README-en-US.md)

Ao governo federal mudar seus métodos para divulgar os números da Covid-19 no Brasil, fiz esta API que efetua um web scrapping nas estatísticas do coronavírus nos sites da Secretaria de Saúde de cada* estado.

Por padrão, o scrap acontece todos os dias às 22:00 (horário de Brasília).

Algumas funcionalidades serão desenvolvidas em breve, como a filtragem de resultados.

Note que o objetivo deste projeto não é desenvolver algo profissional ou pronto para produção.

###### * Nem todos, na verdade. Apenas 16 dos 26 estados fornecem sites com os dados públicos, veja-os em ``src/scrapper/sources.json``.

## API
URL principal: ``https://covid-br.herokuapp.com``

- ``GET /get``
  - Retorna os últimos números atualizados
  - Sucesso: 200 - ``OK``
    - https://covid-br.herokuapp.com/get

- `GET /get/{UF}`
  - Retorna os todos os números registrados para uma UF específica
  - Sucesso: 200 - ``OK``
  - Falha: 400 - ``error_invalid_uf``, ``error_uf_is_not_registered``
    - https://covid-br.herokuapp.com/get

## Servidor de desenvolvimento

Clone o projeto:

```git
git clone https://github.com/jvdutra/covid-19-br-api.git
```

Navegue até a pasta do projeto:

```batch
cd covid-19-br-api
```

Instale as dependências:

```batch
npm install
```

Execute

```batch
npm run dev
```

## Licença
[MIT](https://github.com/jvdutra/covid-19-br-api/blob/master/LICENSE)
