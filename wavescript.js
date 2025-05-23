// Определяем функции WaveScript в глобальной области
window.dw = prompt;
window.msg = alert;
window.cons = { print: console.log };

// Функция транспиляции
function transpileWaveScript(code) {
    const replacements = {
        "\\bcons\\.print\\b": "console.log",
        "\\bper\\b": "let",
        "\\bcon\\b": "const",
        "\\bfunc\\b": "function",
        "\\bdw\\b": "prompt",
        "\\bmsg\\b": "alert",
        "\\belif\\b": "else if",
        "\\bdoc\\.getElementId\\b": "document.getElementById",
        "\\bdoc\\.getElementsClassName\\b": "document.getElementsByClassName",
        "\\bdoc\\.getElementsTagName\\b": "document.getElementsTagName",

    };

    let jsCode = code;
    for (const [ws, js] of Object.entries(replacements)) {
        jsCode = jsCode.replace(new RegExp(ws, "g"), js);
    }
    jsCode = jsCode.replace(/==/g, "===");
    return jsCode;
}

// Обработка встроенных скриптов
function processInlineScripts() {
    document.querySelectorAll('script[type="text/wavescript"]').forEach(script => {
        const newScript = document.createElement('script');
        newScript.textContent = transpileWaveScript(script.textContent);
        script.replaceWith(newScript);
    });
}

// Функция для загрузки .ws файлов
async function loadExternalWS(script) {
  try {
    const response = await fetch(script.src);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const wsCode = await response.text();
    const jsCode = transpileWaveScript(wsCode);
    
    const newScript = document.createElement('script');
    newScript.textContent = jsCode;
    script.replaceWith(newScript);
  } catch (error) {
    console.error('Ошибка загрузки WaveScript:', error);
  }
}

// Обработка всех скриптов
document.addEventListener('DOMContentLoaded', () => {
  const scripts = document.querySelectorAll('script[type="text/wavescript"]');
  scripts.forEach(script => {
    if (script.src) {
      loadExternalWS(script);  // Для внешних файлов
    } else {
      const jsCode = transpileWaveScript(script.textContent);
      const newScript = document.createElement('script');
      newScript.textContent = jsCode;
      script.replaceWith(newScript);
    }
  });
});
