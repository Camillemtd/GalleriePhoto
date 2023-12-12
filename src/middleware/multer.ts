import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import path from 'path'; // Importez le module path

// Définition des types MIME autorisés
const MIME_TYPES: { [key: string]: string } = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/webp': 'webp'
};

interface RequestWithCustomError extends Request {
  fileValidationError?: string;
}

// Fonction de filtrage
const fileFilter = (req: RequestWithCustomError, file: Express.Multer.File, callback: FileFilterCallback) => {
    if (MIME_TYPES[file.mimetype]) {
        callback(null, true);
    } else {
        req.fileValidationError = "Type de fichier non autorisé";
        callback(null, false);
    }
};

// Configuration du stockage pour Multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // Utilisez path.join pour construire un chemin absolu
        callback(null, path.join(__dirname, '../../images'));
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Export du middleware Multer configuré avec le filtre
export const upload = multer({ storage: storage, fileFilter: fileFilter }).single('image');
