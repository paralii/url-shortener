import BadRequestError from "./errors/BadRequestError.js";

const normalizeUrl = (input) => {
    if (!input || typeof input !== "string") {
        throw new BadRequestError("Invalid URL");
    }

    let value = input.trim();

    if (!/^https?:\/\//i.test(value)) {
        value = "https://" + value;
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(value);
    } catch {
        throw new BadRequestError("Invalid URL");
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new BadRequestError("Invalid URL");
    }

    parsedUrl.hostname = parsedUrl.hostname.toLowerCase();

    if (parsedUrl.pathname !== "/" && parsedUrl.pathname.endsWith("/")) {
        parsedUrl.pathname = parsedUrl.pathname.slice(0, -1);
    }

    return parsedUrl.toString();
};

export default normalizeUrl;
