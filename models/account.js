// account model
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// subdocument of Account
var DonationSchema = new Schema({
    account: { type: Schema.Types.ObjectId,  ref: 'Account' },
    amount: { type: Number, min: 0.01},
    date: { type: Date, default: Date.now },
    charity: String, //{ type: Schema.Types.ObjectId, ref: 'Charity' },
    recurring: Boolean

}, { timestamps: true });

// subdocument of Account
var RecurringSchema = new Schema({
    account: { type: Schema.Types.ObjectId,  ref: 'Account' },
    amount: { type: Number, min: 0.01},
    interval: { type: Date, default: Date.now }, // needs to be a more complex way to figure out the interval
    charity: { type: Schema.Types.ObjectId, ref: 'Charity' },

}, { timestamps: true });

// main document
var AccountSchema = new Schema({
    name: {
        first: String,
        last: String
    },
    donations: [DonationSchema],
    recurrings: [RecurringSchema] // templates for recurring donations
});

AccountSchema.virtual('name.full').get(function () {
    return this.name.first + ' ' + this.name.last;
})

let Account = mongoose.model('Account', AccountSchema);
export default Account;
