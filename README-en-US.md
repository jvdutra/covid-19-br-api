# 🦠🔰 Covid-19 API (Brazil)
[Português](https://github.com/jvdutra/covid-19-br-api/blob/master/README.md)

Since the federal government of Brazil changed its methods to share the numbers of the Covid-19 of Brazil, I made this API that scraps the coronavirus statistics from every* state health department website.

It's configured to web scrap every day at 10:00 PM and save the results into a MySQL database. Please note that all times are in UTC.

This API will be running soon and I'll develop more features, like filtering for example.

Please note that the focus of this project is not to develop a professional or production-ready application.

###### * Not every. Currently, only 15 of 26 states have working source websites, you can see them by navigating to ``src/scrapper/sources.json``.

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
