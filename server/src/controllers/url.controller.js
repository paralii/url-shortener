import { createShortUrl, resolveShortUrl } from "../services/url.service.js";

export const createShortUrlController = async ( req, res, next ) => {
    try {
        const { originalUrl, expiresIn } = req.body;

        if (!originalUrl) {
            return res.status(400).json({ message: "originalUrl is required" });
        }

        const url = await createShortUrl(originalUrl, expiresIn);

        res.status(201).json({
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

        const url = await resolveShortUrl(shortId);

        if (!url) {
            return res.status(404).json({ message: "Short URL not found or expired" });
        }

        res.redirect(url.originalUrl);
    } catch (error) {
        next(error);
    };
};