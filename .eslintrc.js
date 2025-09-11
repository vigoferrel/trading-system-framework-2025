module.exports = {
  root: true,
  env: { node: true, es2022: true },
  extends: ["eslint:recommended"],
  parserOptions: { ecmaVersion: 2022, sourceType: "script" },
  rules: {
    // Bloquear explícitamente Math.random según reglas del proyecto
    "no-restricted-properties": [
      "error",
      { "object": "Math", "property": "random", "message": "Prohibido. Usa crypto.randomBytes o WebCrypto (kernel RNG)." }
    ],
    // Sugerir uso del kernel RNG (no bloquea, pero alerta si se usa 'seedrandom' u otros)
    "no-restricted-imports": [
      "warn",
      { "paths": [ { "name": "seedrandom", "message": "No uses generadores pseudoaleatorios. Usa crypto.randomBytes." } ] }
    ],
    // Buenas prácticas adicionales
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error"
  }
};

