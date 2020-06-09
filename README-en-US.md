# 🦠🔰 Covid-19 API (Brazil)
[Português](https://github.com/jvdutra/covid-19-br-api/blob/master/README.md)

Since the federal government of Brazil changed its methods to share the numbers of the Covid-19 of Brazil, I made this API that scraps the coronavirus statistics from every* state health department website.

It's configured to web scrap every day at 10:00 PM and save the results into a MySQL database.

Some features will be added soon, like filtering results.

Please note that the focus of this project is not to develop a professional or production-ready application.

###### * Not every. Currently, only 16 of 26 states have working source websites, you can see them by navigating to ``src/scrapper/sources.json``.

## API
Main URL: ``https://covid-br.herokuapp.com``

- ``GET /get``
  - Returns all the most recent updated numbers
  - Success: 200 - ``OK``
    - https://covid-br.herokuapp.com/get

- `GET /get/{UF}`
  - Returns all updated numbers from a specific state/UF
  - Success: 200 - ``OK``
  - Fails: 400 - ``error_invalid_uf``, ``error_uf_is_not_registered``
    - https://covid-br.herokuapp.com/get

## Development server

Clone the project:

```git
git clone https://github.com/jvdutra/covid-19-br-api.git
```

Navigate to the project's folder

```batch
cd covid-19-br-api
```

Install dependencies

```batch
npm install
```

Run

```batch
npm run dev
```

## License
[MIT](https://github.com/jvdutra/covid-19-br-api/blob/master/LICENSE)
