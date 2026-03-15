import express from 'express';
import { createShortUrlController, resolveShortUrlController } from '../controllers/url.controller.js';
const router = express.Router();

router.post('/urls', createShortUrlController);
router.get('/:shortId', resolveShortUrlController);

export default router;