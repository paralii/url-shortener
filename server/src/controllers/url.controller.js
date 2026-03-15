import { createShortUrl, resolveShortUrl, getUrlStats } from "../services/url.service.js";

export const createShortUrlController = async ( req, res, next ) => {
    try {
        const { originalUrl, expiresIn } = req.body;

        if (!originalUrl) {
            return res.status(400).json({ message: "originalUrl is required" });
        }

        const { url, created } = await createShortUrl(originalUrl, expiresIn);

        res.status(created ? 201 : 200).json({
            originalUrl: url.originalUrl,
            shortId: url.shortId,
            expiresAt: url.expiresAt
        });
    } catch (error) {
        next(error);
    };
};

export const resolveShortUrlController = async ( req, res, next ) => {
    try {
        const { shortId } = req.params;

        if (!/^[a-zA-Z0-9_-]{8}$/.test(shortId)) {
            return res.status(400).json({ message: 'Invalid short URL' });
        }
        
        const url = await resolveShortUrl(shortId);

        if (!url) {
            return res.status(404).json({ message: "Short URL not found or expired" });
        }

        res.redirect(url.originalUrl);
    } catch (error) {
        next(error);
    };
};

export const getUrlStatsController = async ( req, res, next ) => {
    try {
        const { shortId } = req.params;

        if (!/^[a-zA-Z0-9_-]{8}$/.test(shortId)) {
            return res.status(400).json({ message: 'Invalid short ID' });
        }

        const stats = await getUrlStats(shortId);

        if (!stats) {
            return res.status(404).json({ message: "Short URL not found" });
        }

        res.status(200).json(stats);
    } catch (error) {
        next(error);
    };
};
