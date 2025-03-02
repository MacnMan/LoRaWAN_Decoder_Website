/* script.js */
function decodePayload() {
    const hexInput = document.getElementById('hexInput').value.replace(/\s/g, '');
    const jsCode = editor.getValue();
    const outputElement = document.getElementById('output');

    const jsSize = new Blob([jsCode]).size;
    if (jsSize > 40000) {
        outputElement.textContent = 'Error: JS script exceeds 40KB size limit';
        return;
    }

    try {
        const bytes = hexInput.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
        const decodeFunction = new Function('input', jsCode + '\nreturn decodeUplink(input);');
        const result = decodeFunction({ bytes });
        outputElement.innerHTML = `<pre style='color: green;'>${syntaxHighlight(result)}</pre>`;
    } catch (error) {
        outputElement.innerHTML = `<pre style='color: red;'>Error: ${error.message}</pre>`;
    }
}

function syntaxHighlight(json) {
    if (typeof json !== 'string') {
        json = JSON.stringify(json, null, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/(".*?"|\b\d+\b)/g, '<span style="color:blue;">$1</span>');
}
