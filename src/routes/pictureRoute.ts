import express from 'express';
import { upload } from '../middleware/multer'
import { isAuthenticated } from '../middleware/auth';
import { createPicture, getAllPictures, deletePicture, getPictureById, updatePicture } from '../controllers/picture';

const router = express.Router();


router.post('/', isAuthenticated, upload, createPicture); 
router.get('/', getAllPictures);
router.get('/:id', getPictureById);
router.put('/:id', isAuthenticated, upload, updatePicture);
router.delete('/:id', isAuthenticated, deletePicture);

export default router;