// charity model
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var CharitySchema = new Schema({
    name: String
});

let Charity = mongoose.model('Charity', CharitySchema);
export default Charity;
