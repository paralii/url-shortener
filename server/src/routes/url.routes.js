import express from 'express';
import { createShortUrlController, resolveShortUrlController } from '../controllers/url.controller';
const router = express.Router();

router.post('/urls', createShortUrlController);
router.get('/:shortId([a-zA-Z0-9_-]{8})', resolveShortUrlController);

export default router;