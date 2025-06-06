// index.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { analizarEncuestas } = require('./ia');

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert({
    ...serviceAccount,
    private_key: serviceAccount.private_key.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/analizar', async (req, res) => {
  try {
    const snapshot = await db.collection('encuesta').get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'No se encontraron datos de encuestas' });
    }

    const datos = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log("Documento crudo:", data);
      return [
        parseInt(data.question_1) || 0,
        parseInt(data.question_2) || 0,
        parseInt(data.question_3) || 0,
        parseInt(data.question_4) || 0,
        parseInt(data.question_5) || 0,
        parseInt(data.question_6) || 0,
        data.question_7 === true || data.question_7 === "true",
        parseInt(data.question_8) || 0,
        parseInt(data.question_9) || 0,
        typeof data.question_10 === "string" ? data.question_10 : ""
      ];
    });

    console.log("Datos procesados para análisis:", datos);

    const resultado = await analizarEncuestas(datos);

    res.json(resultado);

  } catch (error) {
    console.error('Error al analizar encuestas:', error);
    res.status(500).json({ error: error.message });
  }
});

// Definir puerto para el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
