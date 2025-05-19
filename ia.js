async function analizarEncuestas(datos) {
  const resultados = datos.map(encuesta => {
    const valoresNumericos = [];
    let comentario = "";

    encuesta.forEach((valor, index) => {
      if (index === 9) {
        comentario = valor; // QUESTION_10 es string (comentario)
      } else if (index === 6) {
        // QUESTION_7 es booleano
        valoresNumericos.push(valor ? 1 : 0);
      } else {
        const numero = parseInt(valor);
        if (!isNaN(numero)) {
          valoresNumericos.push(numero);
        }
      }
    });

    if (valoresNumericos.length === 0) {
      return {
        score: "NaN",
        recomendacion: "Datos inválidos o vacíos.",
        comentario
      };
    }

    const promedio = valoresNumericos.reduce((a, b) => a + b, 0) / valoresNumericos.length;

    const recomendacion = promedio >= 3
      ? "Buen servicio. Mantener calidad."
      : "Se necesita mejorar el servicio.";

    return {
      score: promedio.toFixed(2),
      recomendacion,
      comentario
    };
  });

  return { resultados };
}

module.exports = { analizarEncuestas };
