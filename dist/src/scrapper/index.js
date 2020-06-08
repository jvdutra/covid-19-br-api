"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var puppeteer_1 = __importDefault(require("puppeteer"));
var moment_1 = __importDefault(require("moment"));
var connection_1 = __importDefault(require("../database/connection"));
var sources_json_1 = __importDefault(require("./sources.json"));
var calculateTotalData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var currentDay, trx, sumData, confirmed, deaths, recovered, totalData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                currentDay = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
                return [4 /*yield*/, connection_1.default.transaction()];
            case 1:
                trx = _a.sent();
                return [4 /*yield*/, trx('data')
                        .sum({ deaths: 'deaths' })
                        .sum({ confirmed: 'confirmed' })
                        .sum({ recovered: 'recovered' })
                        .where('created', '>=', currentDay)
                        .first()
                        .then(function (row) { return row; })];
            case 2:
                sumData = _a.sent();
                confirmed = sumData.confirmed, deaths = sumData.deaths, recovered = sumData.recovered;
                totalData = {
                    uf: 'BR',
                    confirmed: Number(confirmed),
                    deaths: Number(deaths),
                    recovered: Number(recovered),
                    created: moment_1.default().utc().format("YYYY-MM-DD HH:mm:ss")
                };
                return [4 /*yield*/, trx('data').insert(totalData)];
            case 3:
                _a.sent();
                return [4 /*yield*/, trx.commit()];
            case 4:
                _a.sent();
                console.log("[SUCCESS] Total number inserted!");
                return [2 /*return*/];
        }
    });
}); };
var crawlData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var scrapableSources, browser, i, s, page, content, $, data, parsedData, trx, error_1;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                scrapableSources = sources_json_1.default.filter(function (s) { return s.type === 'scrapable'; });
                return [4 /*yield*/, puppeteer_1.default.launch({ headless: true })];
            case 1:
                browser = _o.sent();
                i = 0;
                _o.label = 2;
            case 2:
                if (!(i < scrapableSources.length)) return [3 /*break*/, 15];
                s = scrapableSources[i];
                _o.label = 3;
            case 3:
                _o.trys.push([3, 13, , 14]);
                return [4 /*yield*/, browser.newPage()];
            case 4:
                page = _o.sent();
                return [4 /*yield*/, page.setRequestInterception(true)];
            case 5:
                _o.sent();
                return [4 /*yield*/, page.setDefaultNavigationTimeout(60000)];
            case 6:
                _o.sent();
                page.on('request', function (req) {
                    if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
                        req.abort();
                    }
                    else {
                        req.continue();
                    }
                });
                return [4 /*yield*/, page.goto(s.url, { waitUntil: 'networkidle0' })];
            case 7:
                _o.sent();
                return [4 /*yield*/, page.content()];
            case 8:
                content = _o.sent();
                $ = cheerio_1.default.load(content);
                data = void 0;
                if (s.property === 'text') {
                    data = {
                        confirmed: $((_a = s.scraping) === null || _a === void 0 ? void 0 : _a.confirmed).text().trim().replace(/(\r\n|\n|\r)/gm, '').split(' ')[0],
                        deaths: $((_b = s.scraping) === null || _b === void 0 ? void 0 : _b.deaths).text().trim().replace(/(\r\n|\n|\r)/gm, '').split(' ')[0],
                        recovered: $((_c = s.scraping) === null || _c === void 0 ? void 0 : _c.recovered).text().trim().replace(/(\r\n|\n|\r)/gm, '').split(' ')[0]
                    };
                }
                else {
                    data = {
                        confirmed: (_e = $((_d = s.scraping) === null || _d === void 0 ? void 0 : _d.confirmed).attr('data-value')) === null || _e === void 0 ? void 0 : _e.trim().replace(/(\r\n|\n|\r)/gm, '').split(' ')[0],
                        deaths: (_g = $((_f = s.scraping) === null || _f === void 0 ? void 0 : _f.deaths).attr('data-value')) === null || _g === void 0 ? void 0 : _g.trim().replace(/(\r\n|\n|\r)/gm, '').split(' ')[0],
                        recovered: (_j = $((_h = s.scraping) === null || _h === void 0 ? void 0 : _h.recovered).attr('data-value')) === null || _j === void 0 ? void 0 : _j.trim().replace(/(\r\n|\n|\r)/gm, '').split(' ')[0]
                    };
                }
                parsedData = {
                    uf: s.uf,
                    confirmed: (data.confirmed && String(data.confirmed) != '0') ? Number((_k = data.confirmed) === null || _k === void 0 ? void 0 : _k.replace(/\./g, '')) : null,
                    deaths: (data.deaths && String(data.confirmed) != '0') ? Number((_l = data.deaths) === null || _l === void 0 ? void 0 : _l.replace(/\./g, '')) : null,
                    recovered: (data.recovered && String(data.confirmed) != '0') ? Number((_m = data.recovered) === null || _m === void 0 ? void 0 : _m.replace(/\./g, '')) : null,
                    created: moment_1.default().utc().format("YYYY-MM-DD HH:mm:ss")
                };
                return [4 /*yield*/, connection_1.default.transaction()];
            case 9:
                trx = _o.sent();
                return [4 /*yield*/, trx('data').insert(parsedData)];
            case 10:
                _o.sent();
                return [4 /*yield*/, trx.commit()];
            case 11:
                _o.sent();
                return [4 /*yield*/, page.close()];
            case 12:
                _o.sent();
                return [3 /*break*/, 14];
            case 13:
                error_1 = _o.sent();
                console.log("Erro [" + s.uf + "]: " + error_1.message);
                return [3 /*break*/, 14];
            case 14:
                i++;
                return [3 /*break*/, 2];
            case 15: return [4 /*yield*/, browser.close()];
            case 16:
                _o.sent();
                console.log("[SUCCESS] Scrap of states concluded!");
                return [2 /*return*/, calculateTotalData()];
        }
    });
}); };
exports.default = crawlData;
