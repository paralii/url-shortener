import express from 'express';
import { createShortUrlController, resolveShortUrlController, getUrlStatsController } from '../controllers/url.controller.js';
const router = express.Router();

router.post('/urls', createShortUrlController);
router.get('/urls/:shortId/stats', getUrlStatsController);
router.get('/:shortId', resolveShortUrlController);
export default router;