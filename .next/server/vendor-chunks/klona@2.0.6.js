"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/klona@2.0.6";
exports.ids = ["vendor-chunks/klona@2.0.6"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/klona@2.0.6/node_modules/klona/json/index.mjs":
/*!**************************************************************************!*\
  !*** ./node_modules/.pnpm/klona@2.0.6/node_modules/klona/json/index.mjs ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   klona: () => (/* binding */ klona)\n/* harmony export */ });\nfunction klona(val) {\n\tvar k, out, tmp;\n\n\tif (Array.isArray(val)) {\n\t\tout = Array(k=val.length);\n\t\twhile (k--) out[k] = (tmp=val[k]) && typeof tmp === 'object' ? klona(tmp) : tmp;\n\t\treturn out;\n\t}\n\n\tif (Object.prototype.toString.call(val) === '[object Object]') {\n\t\tout = {}; // null\n\t\tfor (k in val) {\n\t\t\tif (k === '__proto__') {\n\t\t\t\tObject.defineProperty(out, k, {\n\t\t\t\t\tvalue: klona(val[k]),\n\t\t\t\t\tconfigurable: true,\n\t\t\t\t\tenumerable: true,\n\t\t\t\t\twritable: true,\n\t\t\t\t});\n\t\t\t} else {\n\t\t\t\tout[k] = (tmp=val[k]) && typeof tmp === 'object' ? klona(tmp) : tmp;\n\t\t\t}\n\t\t}\n\t\treturn out;\n\t}\n\n\treturn val;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0va2xvbmFAMi4wLjYvbm9kZV9tb2R1bGVzL2tsb25hL2pzb24vaW5kZXgubWpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSIsInNvdXJjZXMiOlsiRTpcXHRlc1xcbm9kZV9tb2R1bGVzXFwucG5wbVxca2xvbmFAMi4wLjZcXG5vZGVfbW9kdWxlc1xca2xvbmFcXGpzb25cXGluZGV4Lm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24ga2xvbmEodmFsKSB7XG5cdHZhciBrLCBvdXQsIHRtcDtcblxuXHRpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG5cdFx0b3V0ID0gQXJyYXkoaz12YWwubGVuZ3RoKTtcblx0XHR3aGlsZSAoay0tKSBvdXRba10gPSAodG1wPXZhbFtrXSkgJiYgdHlwZW9mIHRtcCA9PT0gJ29iamVjdCcgPyBrbG9uYSh0bXApIDogdG1wO1xuXHRcdHJldHVybiBvdXQ7XG5cdH1cblxuXHRpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG5cdFx0b3V0ID0ge307IC8vIG51bGxcblx0XHRmb3IgKGsgaW4gdmFsKSB7XG5cdFx0XHRpZiAoayA9PT0gJ19fcHJvdG9fXycpIHtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG91dCwgaywge1xuXHRcdFx0XHRcdHZhbHVlOiBrbG9uYSh2YWxba10pLFxuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG91dFtrXSA9ICh0bXA9dmFsW2tdKSAmJiB0eXBlb2YgdG1wID09PSAnb2JqZWN0JyA/IGtsb25hKHRtcCkgOiB0bXA7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBvdXQ7XG5cdH1cblxuXHRyZXR1cm4gdmFsO1xufVxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/klona@2.0.6/node_modules/klona/json/index.mjs\n");

/***/ })

};
;