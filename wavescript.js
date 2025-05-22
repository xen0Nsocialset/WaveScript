const fs = require("fs");

// Таблица замены WaveScript → JS (с учётом границ слов)
const replacements = {
    "\\bcns\\.print\\b": "console.log",  // `cns.print` → `console.log`
    "\\bper\\b": "let",                   // `per` → `let` (но не затронет `person`)
    "\\bcon\\b": "const",                 // `con` → `const` (но не затронет `console`)
    "\\bfunc\\b": "function",             // `func` → `function`
    "\\bdw\\b": "prompt",                 // `dw` → `prompt`
    "\\belif\\b": "else if",              // `elif` → `else if`
    "\\bdoc\\.getElementId\\b": "document.getElementById",
    "\\bdoc\\.getElementsClassName\\b": "document.getElementsByClassName",
};

// Транспилируем код
function transpile(code) {
    let jsCode = code;
    
    // Заменяем ключевые слова с учётом границ слов
    for (const [ws, js] of Object.entries(replacements)) {
        jsCode = jsCode.replace(new RegExp(ws, "g"), js);
    }

    // Доп. правки (например, == → ===)
    jsCode = jsCode.replace(/(if\s*\(.*?)\s*==\s*(.*?\))/g, "$1 === $2");

    return jsCode;
}

// Чтение файла .ws и преобразование в .js
function compileFile(inputFile, outputFile) {
    const wsCode = fs.readFileSync(inputFile, "utf-8");
    const jsCode = transpile(wsCode);
    fs.writeFileSync(outputFile, jsCode);
    console.log(`✅ Скомпилировано: ${inputFile} → ${outputFile}`);
}

// Пример использования
compileFile("example.ws", "example.js");
