// charity model
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let CharitySchema = new Schema({
    name: String,
    ein: Number
});

let Charity = mongoose.model('Charity', CharitySchema);
export default Charity;
