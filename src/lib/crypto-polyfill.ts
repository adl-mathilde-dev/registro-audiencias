// Polyfill para crypto.randomUUID para compatibilidad con versiones anteriores de Node.js
if (typeof global !== 'undefined' && !global.crypto) {
  const crypto = require('crypto');
  global.crypto = crypto;
}

if (typeof global !== 'undefined' && !global.crypto.randomUUID) {
  const crypto = require('crypto');
  global.crypto.randomUUID = () => {
    return crypto.randomBytes(16).toString('hex').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
  };
}

// Para el navegador
if (typeof window !== 'undefined' && !window.crypto.randomUUID) {
  window.crypto.randomUUID = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
  };
}

export {}; 