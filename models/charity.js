// charity model
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var CharitySchema = new Schema({
    name: String
});

export const Charity = mongoose.model('Charity', CharitySchema);
