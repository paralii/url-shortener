import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true, unique: true, trim: true },
    shortId: { type: String, required: true, unique: true, index: true },
    clicks: { type: Number, default: 0},
    isActive: { type: Boolean, default: true},
    expiresAt: { type: Date, default: null},
},
    { timestamps : true});

const Url = mongoose.model('Url', urlSchema);
export default Url;