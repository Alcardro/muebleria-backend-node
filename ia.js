// ia.js - Análisis por pregunta

/**
 * Recibe un array de datos, donde cada dato es un array de 10 valores: es un array de 10 valores:
 * - índices 0-5 y 7-8: valores numéricos (strings o números)
 * - índice 6: booleano o "true"/"false"
 * - índice 9: comentario (string)
 *
 * Devuelve un objeto con un array "analisis" de 9 elementos,
 * cada uno con: pregunta, promedio, desviación estándar, conteos por valor y
 * recomendación (excepto para la última pregunta).
 */

function calcularDesviacionEstandar(valores, promedio) {
  const diffs = valores.map(v => Math.pow(v - promedio, 2));
  const mediaDiff = diffs.reduce((a, b) => a + b, 0) / valores.length;
  return parseFloat(Math.sqrt(mediaDiff).toFixed(2));
}

async function analizarEncuestas(datos) {
  const numPreguntas = 9; // Sólo preguntas cuantitativas
  const resultados = [];

  // Inicializar estructura
  for (let i = 0; i < numPreguntas; i++) {
    resultados.push({
      pregunta: i + 1,
      valores: [],
      conteos: {},
      promedio: 0,
      desviacion: 0,
      recomendacion: null
    });
  }

  // Recolectar valores
  encuestas.forEach(encuesta => {
    for (let i = 0; i < numPreguntas; i++) {
      let raw = encuesta[i];
      let valor;
      if (i === 6) {
        // QUESTION_7: booleano a 1/0
        valor = raw === true || raw === 'true' ? 1 : 0;
      } else {
        // Numérico
        valor = parseInt(raw, 10);
        if (isNaN(valor)) valor = 0;
      }
      resultados[i].valores.push(valor);
    }
  });

  // Calcular métricas y recomendaciones
  resultados.forEach(item => {
    const { valores, pregunta } = item;
    const sum = valores.reduce((a, b) => a + b, 0);
    const count = valores.length;
    const avg = count > 0 ? sum / count : 0;
    item.promedio = parseFloat(avg.toFixed(2));
    item.desviacion = calcularDesviacionEstandar(valores, avg);

    // Conteos por valor
    valores.forEach(v => {
      item.conteos[v] = (item.conteos[v] || 0) + 1;
    });

    // Recomendación para preguntas 1-8
    if (pregunta < numPreguntas) {
      item.recomendacion = item.promedio >= 3
        ? 'Buen servicio. Mantener calidad.'
        : 'Se necesita mejorar el servicio.';
    }

    // Limpiar arreglo de valores
    delete item.valores;
  });

  return { analisis: resultados };
}

module.exports = { analizarEncuestas };
