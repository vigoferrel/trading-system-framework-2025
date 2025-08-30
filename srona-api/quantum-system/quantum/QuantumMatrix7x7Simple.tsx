import React, { useEffect, useState } from "react";

// Activos y métricas primas
const PRIME_ASSETS = ["BTC", "ETH", "BNB", "SOL", "XRP", "ADA", "DOGE"];
const PRIME_METRICS = [2, 3, 5, 7, 11, 13, 17];

// Vector4D: [valor, intensidad, fase_temporal, coherencia_cuántica]
type Vector4D = [number, number, number, number];

// Generador aleatorio de Vector4D para demo (reemplazar por datos reales si existen)
function randomVector4D(): Vector4D {
  return [
    PHYSICAL_CONSTANTS.QUANTUM_COHERENCE, // valor normalizado 0-1
    PHYSICAL_CONSTANTS.BASE_SCORE,
    PHYSICAL_CONSTANTS.BASE_SCORE,
    PHYSICAL_CONSTANTS.BASE_SCORE
  ];
}

// Genera la matriz 7x7 de valores cuánticos
function generateQuantumMatrix7x7(): number[][] {
  return Array.from({ length: 7 }, () =>
    Array.from({ length: 7 }, () => randomVector4D()[0])
  );
}

const QuantumMatrix7x7Simple: React.FC = () => {
  const [matrix, setMatrix] = useState<number[][]>([]);

  useEffect(() => {
    setMatrix(generateQuantumMatrix7x7());
  }, []);

  return (
    <div style={{ fontFamily: "monospace", background: "#fff", color: "#111" }}>
      <h2>Matriz Cuántica 7x7 (Primos)</h2>
      <table border={1} cellPadding={6} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Asset</th>
            {PRIME_METRICS.map((prime) => (
              <th key={prime}>P{prime}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PRIME_ASSETS.map((asset, i) => (
            <tr key={asset}>
              <td>{asset}</td>
              {matrix[i] &&
                matrix[i].map((val, j) => (
                  <td key={j}>{val.toFixed(3)}</td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuantumMatrix7x7Simple;
