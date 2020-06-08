# 🦠🔰 Covid-19 API (Brazil)
[English](https://github.com/jvdutra/covid-19-br-api/blob/master/README-en-US.md)

Ao o governo federal mudar seus métodos para divulgar os números da Covid-19 no Brasil, fiz esta API que efetua um web scrapping nas estatísticas do coronavírus nos sites da Secretaria de Saúde de cada* estado.

Por padrão, o scrap acontece todos os dias às 22:00. Note que todas as datas estão em UTC.

A API estará funcionando em breve, e eu irei desenvolver mais funcionalidades, como a filtragem por exemplo.

Note que o objetivo deste projeto não é desenvolver algo profissional ou pronto para produção.

###### * Nem todos, na verdade. Apenas 15 dos 26 estados fornecem sites com os dados públicos, veja-os em ``scrapper/sources.json``.

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