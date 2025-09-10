/**
 * ESLINT CONFIGURATION - KERNEL RNG ENFORCEMENT
 * =============================================
 * 
 * Configuración de ESLint específica para prohibir Math.random
 * y forzar el uso del Kernel RNG en todo el sistema QBTC.
 * 
 * Reglas implementadas:
 * - Prohibir Math.random (error fatal)
 * - Sugerir alternativas de Kernel RNG
 * - Validar importaciones de random
 * - Detectar patrones de aleatoriedad inseguros
 */

module.exports = {
    extends: [
        'eslint:recommended'
    ],
    
    env: {
        node: true,
        es2022: true
    },
    
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
    },
    
    rules: {
        // PROHIBIR Math.random COMPLETAMENTE
        'no-restricted-globals': [
            'error',
            {
                name: 'Math.random',
                message: '🚫 Math.random() está prohibido. Use kernelRNG.nextFloat() o random() del módulo kernel-rng.'
            }
        ],
        
        // Prohibir propiedades específicas
        'no-restricted-properties': [
            'error',
            {
                object: 'Math',
                property: 'random',
                message: '🚫 Math.random() está prohibido. Alternativas:\n' +
                        '  • kernelRNG.nextFloat() - números [0,1)\n' +
                        '  • kernelRNG.nextInt(max) - enteros [0,max)\n' +
                        '  • kernelRNG.nextNormal(mu, sigma) - distribución normal\n' +
                        '  • kernelRNG.nextBoolean(probability) - booleanos\n' +
                        '  • kernelRNG.choice(array) - selección aleatoria\n' +
                        '  Importe desde: const { kernelRNG } = require("./src/utils/kernel-rng");'
            }
        ],
        
        // Detectar patrones comunes de Math.random()
        'no-restricted-syntax': [
            'error',
            {
                selector: 'CallExpression[callee.type="MemberExpression"][callee.object.name="Math"][callee.property.name="random"]',
                message: '🚫 Math.random() detectado. Use Kernel RNG: kernelRNG.nextFloat()'
            },
            {
                selector: 'MemberExpression[object.name="Math"][property.name="random"]',
                message: '🚫 Referencia a Math.random detectada. Use Kernel RNG: kernelRNG.nextFloat()'
            }
        ]
    },
    
    // Configuración específica para diferentes tipos de archivos
    overrides: [
        // Archivos de test - permitir Math.random solo para testing del RNG
        {
            files: [
                '**/*.test.js',
                '**/*.spec.js',
                '**/test/**/*.js',
                '**/tests/**/*.js',
                '**/src/utils/kernel-rng.js' // Permitir en el propio kernel RNG para comparaciones
            ],
            rules: {
                'no-restricted-globals': 'warn',
                'no-restricted-properties': 'warn',
                'no-restricted-syntax': 'warn'
            }
        },
        
        // Archivos cuánticos - reglas estrictas
        {
            files: [
                '**/quantum/**/*.js',
                '**/src/**/*.js',
                '**/orchestrator/**/*.js'
            ],
            rules: {
                'no-restricted-globals': 'error',
                'no-restricted-properties': 'error', 
                'no-restricted-syntax': 'error',
                
                // Requerir importación explícita de kernel-rng
                'no-undef': 'error'
            }
        },
        
        // Configuraciones para archivos legacy (temporalmente menos estricto)
        {
            files: [
                '**/legacy/**/*.js',
                '**/deprecated/**/*.js'
            ],
            rules: {
                'no-restricted-globals': 'warn',
                'no-restricted-properties': 'warn',
                'no-restricted-syntax': 'warn'
            }
        }
    ],
    
    // Configuración global
    globals: {
        // Definir kernelRNG como global para evitar warnings
        kernelRNG: 'readonly',
        random: 'readonly',
        randomInt: 'readonly',
        randomNormal: 'readonly',
        randomExponential: 'readonly'
    },
    
    // Plugin personalizado para detectar patrones específicos
    plugins: ['kernel-rng-custom']
};

// Plugin personalizado para reglas adicionales
const kernelRngCustomPlugin = {
    rules: {
        'require-kernel-rng-import': {
            meta: {
                type: 'error',
                docs: {
                    description: 'Requiere importación de kernel-rng cuando se usan funciones aleatorias',
                    category: 'Best Practices',
                    recommended: true
                },
                fixable: 'code',
                schema: []
            },
            
            create(context) {
                const randomFunctions = new Set([
                    'random', 'randomInt', 'randomNormal', 'randomExponential',
                    'randomBoolean', 'randomChoice', 'randomShuffle'
                ]);
                
                let hasKernelRngImport = false;
                let usesRandomFunctions = false;
                
                return {
                    ImportDeclaration(node) {
                        if (node.source.value.includes('kernel-rng')) {
                            hasKernelRngImport = true;
                        }
                    },
                    
                    CallExpression(node) {
                        if (node.callee.type === 'Identifier' && 
                            randomFunctions.has(node.callee.name)) {
                            usesRandomFunctions = true;
                        }
                    },
                    
                    'Program:exit'() {
                        if (usesRandomFunctions && !hasKernelRngImport) {
                            context.report({
                                node: context.getSourceCode().ast,
                                message: '📦 Debe importar kernel-rng cuando usa funciones aleatorias: const { random, randomInt } = require("./src/utils/kernel-rng");',
                                fix(fixer) {
                                    return fixer.insertTextAfterRange([0, 0], 
                                        'const { random, randomInt, randomNormal } = require("./src/utils/kernel-rng");\\n'
                                    );
                                }
                            });
                        }
                    }
                };
            }
        },
        
        'prefer-kernel-rng-methods': {
            meta: {
                type: 'suggestion',
                docs: {
                    description: 'Prefiere métodos específicos de kernel-rng sobre genéricos',
                    category: 'Best Practices'
                },
                fixable: 'code',
                schema: []
            },
            
            create(context) {
                const suggestions = {
                    'Math.floor(Math.random() * n)': 'randomInt(n)',
                    'Math.random() < 0.5': 'randomBoolean()',
                    'Math.random() * 2 - 1': 'randomNormal(0, 1/3)', // Aproximación
                    'array[Math.floor(Math.random() * array.length)]': 'randomChoice(array)'
                };
                
                return {
                    CallExpression(node) {
                        const sourceCode = context.getSourceCode();
                        const code = sourceCode.getText(node);
                        
                        for (const [pattern, replacement] of Object.entries(suggestions)) {
                            if (code.includes('Math.random')) {
                                context.report({
                                    node,
                                    message: `💡 Considere usar ${replacement} en lugar de ${pattern}`,
                                    suggest: [{
                                        desc: `Reemplazar con ${replacement}`,
                                        fix(fixer) {
                                            return fixer.replaceText(node, replacement);
                                        }
                                    }]
                                });
                                break;
                            }
                        }
                    }
                };
            }
        }
    }
};

// Registrar el plugin personalizado
if (typeof module !== 'undefined' && module.exports) {
    // Exportar configuración para uso directo
    module.exports.plugins = {
        'kernel-rng-custom': kernelRngCustomPlugin
    };
}

/**
 * COMANDOS PARA USAR ESTA CONFIGURACIÓN:
 * 
 * 1. Verificar todo el proyecto:
 *    npx eslint . --config .eslintrc-kernel-rng.js
 * 
 * 2. Verificar archivos específicos:
 *    npx eslint quantum/ --config .eslintrc-kernel-rng.js
 * 
 * 3. Auto-fix cuando sea posible:
 *    npx eslint . --config .eslintrc-kernel-rng.js --fix
 * 
 * 4. Solo reportar errores de Math.random:
 *    npx eslint . --config .eslintrc-kernel-rng.js --rule 'no-restricted-properties: error'
 * 
 * 5. Ignorar archivos legacy temporalmente:
 *    npx eslint . --config .eslintrc-kernel-rng.js --ignore-pattern 'legacy/**'
 */
