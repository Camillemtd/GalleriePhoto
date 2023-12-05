import express from 'express';
import authRoutes from "./routes/authRoutes"
import pictureRoutes from './routes/pictureRoute'
const rateLimit = require('express-rate-limit');

const app = express();

app.use(express.json()); 

app.use('/api/auth', authRoutes);

app.use('/api/pictures', pictureRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
