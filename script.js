function hexToBytes(hex) {
  return hex.trim().split(/\s+/).map(byte => parseInt(byte, 16));
}

function formatHexInput(hex) {
  // Remove all non-hex characters
  const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
  let result = '';
  for (let i = 0; i < cleanHex.length; i += 2) {
    if (i > 0) result += ' ';
    result += cleanHex.substr(i, 2);
  }
  return result.trim();
}

function validateHexInput(hex) {
  const bytes = hex.trim().split(/\s+/);
  return bytes.every(byte => /^[0-9A-Fa-f]{2}$/.test(byte));
}

function runDecoder() {
  const hexInput = document.getElementById('hexInput');
  const userCode = window.editor.getValue();
  const rawHex = hexInput.value;
  const formattedHex = formatHexInput(rawHex);
  const outputElement = document.getElementById('output');

  hexInput.value = formattedHex; // auto format input

  if (!validateHexInput(formattedHex)) {
    outputElement.textContent = 'Invalid byte(s) detected. Please enter valid hex bytes (e.g., "00 02 04").';
    return;
  }

  const byteArray = hexToBytes(formattedHex);

  try {
    const fullCode = `
      ${userCode}
      decodeUplink({bytes: ${JSON.stringify(byteArray)}});
    `;
    const result = eval(fullCode);
    outputElement.textContent = JSON.stringify(result, null, 2);
  } catch (err) {
    outputElement.textContent = 'Error:\n' + err;
  }
}

// Auto-format input as user types
const hexInputField = document.getElementById('hexInput');
hexInputField.addEventListener('input', (e) => {
  const formatted = formatHexInput(e.target.value);
  e.target.value = formatted;
});
