import Url from "../models/urlModel.js";
import { nanoid } from "nanoid";
import { MAX_RETRIES } from "../utils/constants.js";
import normalizeUrl from "../utils/urlNormalizer.js";

async function generateUniqueId(){
    return nanoid(8);
};

export const createShortUrl = async(originalUrl) => {

    const normalizedUrl = normalizeUrl(originalUrl);
    const url = await Url.findOne({originalUrl: normalizedUrl})

    if(url){
        return url;
    } else {
    
        for( let attempt = 1; attempt <= MAX_RETRIES; attempt++){
            
            try {
                const shortId = await generateUniqueId();
                return await Url.create({
                    originalUrl: normalizedUrl,
                    shortId: shortId,
                });

            } catch (error) {
                if (error.code !== 11000) throw error;
            }
        }        
    }

    throw new Error("URL generation is failed after max retries");
};

export const resolveShortUrl = async(shortId) => {
    const url = await Url.findOneAndUpdate({
        shortId, 
        isActive: true
    },{
        $inc:{clicks: 1 }
    },{
        new: true
    });

    if(!url){
        return null;
    }


    return url;
};