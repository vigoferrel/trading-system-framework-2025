export interface Matrix6x8Cell {
  asset: string; // e.g., 'BTC'
  metric: string; // e.g., 'impliedVolatility'
  value: number; // Valor actual normalizado
  transformedValue: number; // Valor después de la transformación con números primos
  // Añadir más propiedades cuánticas si es necesario para la visualización
  quantum: {
    coherence: number;
    entanglement: number;
    momentum: number;
    density: number;
    temperature: number;
    frequency: number;
    amplitude: number;
    phase: number;
  };
}

export interface Matrix6x8 {
  rows: string[]; // Nombres de los activos (BTC, ETH, ...)
  cols: string[]; // Nombres de las métricas (IV, Volume, ...)
  cells: Matrix6x8Cell[][]; // La matriz real [activo][metrica]
}

export interface Matrix6x9Cell extends Matrix6x8Cell {
  // Hereda todas las propiedades de Matrix6x8Cell
}

export interface Matrix6x9 extends Matrix6x8 {
  cols: [
    'impliedVolatility',
    'volume24h',
    'openInterest',
    'putCallRatio',
    'delta',
    'gamma',
    'theta',
    'vega',
    'sentimientoAkashico'
  ];
  cells: Matrix6x9Cell[][];
}

export interface Matrix8x6Cell {
  metric: string; // e.g., 'impliedVolatility'
  asset: string; // e.g., 'BTC'
  value: number;
  transformedValue: number;
  // Propiedades cuánticas para la celda transpuesta
  quantum: {
    coherence: number;
    entanglement: number;
    momentum: number;
    density: number;
    temperature: number;
    frequency: number;
    amplitude: number;
    phase: number;
  };
}

export interface Matrix8x6 {
  rows: string[]; // Nombres de las métricas
  cols: string[]; // Nombres de los activos
  cells: Matrix8x6Cell[][]; // La matriz transpuesta [metrica][activo]
}
