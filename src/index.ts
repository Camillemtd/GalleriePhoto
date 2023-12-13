import express from 'express';
require('dotenv').config();
const cors = require('cors');
import authRoutes from "./routes/authRoutes"
import pictureRoutes from './routes/pictureRoute'
const rateLimit = require('express-rate-limit');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', // Et ajoutez ici l'URL de votre front-end en production
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pictures', pictureRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});

