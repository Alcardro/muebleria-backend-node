// ia.js

// Aquí importas TensorFlow.js (en backend era tfjs-node o tfjs)
const tf = require('@tensorflow/tfjs-node');  

async function analizarEncuestas(datos) {
  // Convertir datos a tensores
  const entradas = datos.map(d => d.satisfaccion);
  const inputTensor = tf.tensor2d(entradas, [entradas.length, 1]);

  // Definición de un modelo secuencial muy simple
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [1], units: 1 }));
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

  // Etiquetas de ejemplo (satisfacción > 3 → 1, else 0)
  const etiquetas = tf.tensor2d(entradas.map(x => x > 3 ? 1 : 0), [entradas.length, 1]);

  // Entrenamiento
  await model.fit(inputTensor, etiquetas, { epochs: 10 });

  // Predicción de ejemplo (¿qué pasaría con un 4?)
  const resultado = model.predict(tf.tensor2d([[4]])).dataSync()[0];

  return {
    recomendacion: resultado > 0.5
      ? "Los clientes están satisfechos."
      : "Se necesita mejorar el servicio.",
    score: resultado.toFixed(2)
  };
}

module.exports = { analizarEncuestas };
