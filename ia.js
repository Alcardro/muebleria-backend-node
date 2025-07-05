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
  const numPreguntas = 9;
  const resultados = [];

  for (let i = 0; i < numPreguntas; i++) {
    resultados.push({
      pregunta: i + 1,
      valores: [],
      conteos: {},
      promedio: 0,
      desviacion: 0,
      recomendacion: "No se encontraron problemas relevantes"
    });
  }

  // Recolectar valores
  datos.forEach(dato => {
    for (let i = 0; i < numPreguntas; i++) {
      let raw = dato[i];
      let valor;

      if (i === 6) {
        valor = raw === true || raw === "true" ? 1 : 0;
      } else {
        valor = parseInt(raw, 10);
        if (isNaN(valor)) valor = 0;
      }

      resultados[i].valores.push(valor);
    }
  });

  // Asignar recomendaciones por pregunta
  resultados.forEach(item => {
    const { valores, pregunta } = item;
    const sum = valores.reduce((a, b) => a + b, 0);
    const count = valores.length;
    const avg = count > 0 ? sum / count : 0;
    item.promedio = parseFloat(avg.toFixed(2));
    item.desviacion = calcularDesviacionEstandar(valores, avg);

    valores.forEach(v => {
      item.conteos[v] = (item.conteos[v] || 0) + 1;
    });

    // Recomendaciones personalizadas por pregunta
    if (pregunta <= numPreguntas) {
      if (avg < 3) {
        switch (pregunta) {
          case 1:
            item.recomendacion = "Mejorar la calidad de los productos ofrecidos.";
            break;
          case 2:
            item.recomendacion = "Revisar la relación entre precio y calidad percibida.";
            break;
          case 3:
            item.recomendacion = "Reducir tiempos de entrega o espera.";
            break;
          case 4:
            item.recomendacion = "Capacitar al personal en empatía y atención personalizada.";
            break;
          case 5:
            item.recomendacion = "Reforzar el conocimiento del personal sobre los productos.";
            break;
          case 6:
            item.recomendacion = "Fortalecer el soporte postventa y seguimiento de reclamos.";
            break;
          case 7:
            item.recomendacion = "Monitorear y mejorar la interacción directa con el cliente.";
            break;
          case 8:
            item.recomendacion = "Mejorar la limpieza y presentación de la tienda.";
            break;
          default:
            item.recomendacion = "Área crítica. Revisión necesaria.";
        }
      } else if (item.desviacion > 1) {
        item.recomendacion = "Aunque el promedio es aceptable, hay alta variabilidad. Investigue diferencias entre clientes.";
      } else {
        item.recomendacion = "Buen servicio. Mantener calidad.";
      }
    }

    delete item.valores;
  });

  return { analisis: resultados };
}

module.exports = { analizarEncuestas };
