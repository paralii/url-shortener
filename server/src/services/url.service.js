import Url from "../models/urlModel";
import { nanoid } from "nanoid";
import { MAX_RETRIES } from "../utils/constants";

async function generateUniqueId(){
    return nanoid(8);
};

export const createShortUrl = async(originalUrl) => {
    const url = await Url.findOne({originalUrl: originalUrl})

    if(url){
        return url;
    } else {
    
        for( let attempt = 1; attempt <= MAX_RETRIES; attempt++){
            
            try {
                const shortId = await generateUniqueId();
                return await Url.create({
                    originalUrl,
                    shortId: shortId,
                });

            } catch (error) {
                if (error.code !== 11000) throw error;
            }
        }        
    }

    throw new Error("Could not generate a unique short URL after multiple attempts");
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