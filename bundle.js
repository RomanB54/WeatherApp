/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/apis.ts":
/*!*********************!*\
  !*** ./src/apis.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   WeatherAPI: () => (/* binding */ WeatherAPI)\n/* harmony export */ });\nclass WeatherAPI {\n  storeID = 'historyCities';\n  localStorage = (() => localStorage)();\n  constructor(dataDB) {\n    this.storeID = dataDB;\n  }\n  async readCities() {\n    const tempData = this.localStorage.getItem(this.storeID);\n    if (tempData) {\n      return JSON.parse(tempData);\n    } else {\n      return [];\n    }\n  }\n  async createCity(value) {\n    const tempArr = await this.readCities();\n    if (tempArr.includes(value)) {\n      tempArr.splice(tempArr.indexOf(value), 1);\n      tempArr.unshift(value);\n    } else {\n      tempArr.push(value);\n    }\n    this.localStorage.setItem(this.storeID, JSON.stringify(tempArr));\n  }\n  async getLocationInfo() {\n    try {\n      const response = await fetch('https://ipinfo.io/json?token=7ce0407bb7be70');\n      const jsonResponse = await response.json();\n      if (jsonResponse && jsonResponse.city && jsonResponse.loc) {\n        const splittedCoord = jsonResponse.loc.split(',');\n        const locationObject = {\n          city: jsonResponse['city'],\n          coordinates: [splittedCoord[1], splittedCoord[0]]\n        };\n        return locationObject;\n      } else {\n        return \"Failed to get location\";\n      }\n    } catch (e) {\n      console.log('Failed to get location', e);\n      return \"Failed to get location\";\n    }\n  }\n  async getWeatherInfo(city) {\n    try {\n      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=50e9562e52bdc95310309ebf4c74c77c&units=metric&lang=en`);\n      const data = await response.json();\n      if (data && data.cod === 200 && data.name && data.main.temp && data.coord && data.weather[0].icon) {\n        const weatherObject = {\n          city: data.name,\n          temperature: Math.round(data.main.temp),\n          coordinates: [data.coord.lon, data.coord.lat],\n          icon: data.weather[0].icon\n        };\n        return weatherObject;\n      } else {\n        return 'Unknown information';\n      }\n    } catch (e) {\n      console.log('Failed to get weather information', e);\n      return 'Unknown information';\n    }\n  }\n}\n\n//# sourceURL=webpack://weatherapp/./src/apis.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _weatherView__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./weatherView */ \"./src/weatherView.ts\");\n/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.css */ \"./src/style.css\");\n/* harmony import */ var _apis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./apis */ \"./src/apis.ts\");\n\n\n\nconst mainPageView = document.querySelector('.app');\nnew _apis__WEBPACK_IMPORTED_MODULE_2__.WeatherAPI('historyCities');\nnew _weatherView__WEBPACK_IMPORTED_MODULE_0__.View(mainPageView);\n\n//# sourceURL=webpack://weatherapp/./src/index.ts?");

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://weatherapp/./src/style.css?");

/***/ }),

/***/ "./src/weatherBlockTemplate.html":
/*!***************************************!*\
  !*** ./src/weatherBlockTemplate.html ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n// Module\nvar code = `<p class=\"show-weather\">Weather info</p>\n<ul class=\"info-weather\">\n  <li class=\"info-city\">{{city}}</li>\n  <li class=\"info-temp\">{{temperature}}°C</li>\n</ul>\n<div class=\"icon-weather\">\n  <img src=\"https://openweathermap.org/img/wn/{{icon}}@2x.png\" />\n</div>\n`;\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);\n\n//# sourceURL=webpack://weatherapp/./src/weatherBlockTemplate.html?");

/***/ }),

/***/ "./src/weatherView.ts":
/*!****************************!*\
  !*** ./src/weatherView.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   View: () => (/* binding */ View)\n/* harmony export */ });\n/* harmony import */ var _weatherBlockTemplate_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./weatherBlockTemplate.html */ \"./src/weatherBlockTemplate.html\");\n\nclass View {\n  constructor(el) {\n    this.el = el;\n    el.innerHTML = `<div class=\"layer1\">\n            <div class=\"layer2\">\n                <input class=\"input-for-city\" placeholder=\"Enter a city name...\">\n                <button class=\"button-enter\">Submit</button><br></br>\n                <img class=\"map-city\" src=''/>\n            </div>\n            <div class=\"layer3\">\n            </div>\n            <div class=\"layer4\">\n                <p class=\"show-weather\">History</p>\n                <ul class=\"history-city\">\n                </ul>\n            </div>\n        </div>`;\n  }\n  addWeatherTemplate(template, object) {\n    const pattern = /\\{\\{(\\w+)}}/gm;\n    template = template.replace(pattern, (match, key) => {\n      if (key in object) {\n        return object[key].toString();\n      } else {\n        return '';\n      }\n    });\n    return template;\n  }\n  addWeather(objectWeather) {\n    this.el.querySelector('.layer3').innerHTML = this.addWeatherTemplate(_weatherBlockTemplate_html__WEBPACK_IMPORTED_MODULE_0__[\"default\"], objectWeather);\n  }\n  updateMapLink(coordinates) {\n    const imageSource = this.el.querySelector('.map-city');\n    imageSource.src = `https://static-maps.yandex.ru/v1?lang=ru_RU&ll=${coordinates}&spn=0.3,0.3&size=400,400&apikey=e091f93b-1d71-4a7d-ae59-8369de3754d8`;\n  }\n  renderHistoryList(cities) {\n    if (cities) {\n      for (let i = 0; i < cities.length && i <= 9; i++) {\n        const cityName = cities[i];\n        this.el.querySelector('.history-city').innerHTML += `<li class='li-history'>${cityName}</li>`;\n      }\n    }\n  }\n  addOneCity(city) {\n    const arrayHistoryCities = this.el.querySelectorAll('.li-history');\n    for (let i = 0; i < arrayHistoryCities.length; i++) {\n      if (arrayHistoryCities[i].innerHTML === city) {\n        this.el.querySelectorAll('.li-history')[i].remove();\n      }\n    }\n    if (this.el.querySelectorAll('.li-history').length == 10) {\n      this.el.querySelectorAll('.li-history')[9].remove();\n    }\n    const li = document.createElement('li');\n    li.innerHTML = city;\n    li.className = 'li-history';\n    this.el.querySelector('.history-city').prepend(li);\n  }\n}\n\n//# sourceURL=webpack://weatherapp/./src/weatherView.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;