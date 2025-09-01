
// ==========================================
// IMPORTACIÓN DE CONSTANTES UNIFICADAS
// ==========================================
// ✅ CONSTANTES CONSOLIDADAS - Eliminadas duplicaciones de 290+ archivos
// ✅ Fuente única de verdad para todas las constantes del sistema

const {
  QUANTUM_CONSTANTS,
  getConstant,
  getPhysicalConstants,
  getQuantumConstants
} = require('./src/constants/quantum-constants');

// Para compatibilidad backward - mantener PHYSICAL_CONSTANTS disponible
const PHYSICAL_CONSTANTS = getPhysicalConstants();

/**
 * PWA Icon Generator for Quantum Trading Dashboard
 * Generates all required PWA icons in different sizes
 */

const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const iconSizes = [
    { size: 72, name: 'icon-72x72.png' },
    { size: 96, name: 'icon-96x96.png' },
    { size: 128, name: 'icon-128x128.png' },
    { size: 144, name: 'icon-144x144.png' },
    { size: 152, name: 'icon-152x152.png' },
    { size: 192, name: 'icon-192x192.png' },
    { size: 384, name: 'icon-384x384.png' },
    { size: 512, name: 'icon-512x512.png' }
];

// Create SVG template for quantum trading icon
function createSVGIcon(size) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="quantumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#0099cc;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#006699;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.8" />
            <stop offset="70%" style="stop-color:#00d4ff;stop-opacity:0.4" />
            <stop offset="100%" style="stop-color:#006699;stop-opacity:0.1" />
        </radialGradient>
    </defs>
    
    <!-- Background circle -->
    <circle cx="${size/2}" cy="${size/2}" r="${size/2-2}" fill="url(#quantumGradient)" stroke="#003d5c" stroke-width="2"/>
    
    <!-- Quantum symbol - atomic structure -->
    <g transform="translate(${size/2}, ${size/2})">
        <!-- Central core -->
        <circle cx="0" cy="0" r="${size/12}" fill="url(#centerGlow)" stroke="#ffffff" stroke-width="2"/>
        
        <!-- Electron orbits -->
        <ellipse cx="0" cy="0" rx="${size/4}" ry="${size/8}" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8"/>
        <ellipse cx="0" cy="0" rx="${size/4}" ry="${size/8}" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8" transform="rotate(60)"/>
        <ellipse cx="0" cy="0" rx="${size/4}" ry="${size/8}" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8" transform="rotate(120)"/>
        
        <!-- Electrons -->
        <circle cx="${size/4}" cy="0" r="${size/24}" fill="#ffffff" opacity="0.9"/>
        <circle cx="${-size/8}" cy="${size/6}" r="${size/24}" fill="#ffffff" opacity="0.9"/>
        <circle cx="${-size/8}" cy="${-size/6}" r="${size/24}" fill="#ffffff" opacity="0.9"/>
        
        <!-- Trading chart lines -->
        <path d="M ${-size/3} ${size/6} L ${-size/6} ${size/12} L ${size/6} ${-size/12} L ${size/3} ${-size/6}" 
              stroke="#00ff88" stroke-width="3" fill="none" opacity="0.7"/>
        
        <!-- Quantum Q symbol -->
        <text x="0" y="${size/3}" text-anchor="middle" font-family="Arial, sans-serif" 
              font-size="${size/8}" font-weight="bold" fill="#ffffff" opacity="0.9">Q</text>
    </g>
</svg>`;
}

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Generate SVG icons for each size
iconSizes.forEach(({ size, name }) => {
    const svgContent = createSVGIcon(size);
    const svgPath = path.join(imagesDir, name.replace('.png', '.svg'));
    
    try {
        fs.writeFileSync(svgPath, svgContent);
        console.log(`[OK] Generated ${name.replace('.png', '.svg')} (${size}x${size})`);
    } catch (error) {
        console.error(`[ERROR] Error generating ${name}:`, error.message);
    }
});

// Create a simple PNG placeholder (base64 encoded 1x1 transparent pixel)
const transparentPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

// For now, create simple placeholder PNG files
iconSizes.forEach(({ size, name }) => {
    const pngPath = path.join(imagesDir, name);
    
    // Create a simple colored square as PNG placeholder
    const canvas = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="#00d4ff"/>
        <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="#ffffff" opacity="0.8"/>
        <text x="${size/2}" y="${size/2 + size/12}" text-anchor="middle" font-family="Arial" font-size="${size/6}" fill="#006699">Q</text>
    </svg>`;
    
    try {
        // For now, just create the SVG version as PNG won't work without proper image processing
        fs.writeFileSync(pngPath.replace('.png', '_placeholder.svg'), canvas);
        console.log(`[OK] Generated ${name} placeholder (${size}x${size})`);
    } catch (error) {
        console.error(`[ERROR] Error generating ${name}:`, error.message);
    }
});

console.log('\n Icon generation completed!');
console.log(' Icons saved to:', imagesDir);
console.log('\n Note: SVG icons generated. For production, convert to PNG using an image processing tool.');