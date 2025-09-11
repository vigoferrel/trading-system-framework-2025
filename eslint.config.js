import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        global: "readonly",
        setImmediate: "readonly",
        clearImmediate: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly"
      }
    },
    rules: {
      // Bloquear explícitamente Math.random según reglas del proyecto
      "no-restricted-properties": [
        "error",
        { 
          "object": "Math", 
          "property": "random", 
          "message": "Prohibido. Usa crypto.randomBytes o WebCrypto (kernel RNG)." 
        }
      ],
      // Buenas prácticas adicionales
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error"
    }
  }
];
