// account model
import mongoose from 'mongoose';
// import Donation from './donation.js';
// import Recurring from './recurring.js';
const Schema = mongoose.Schema;

var DonationSchema = new Schema({
    account: { type: Schema.Types.ObjectId,  ref: 'Account' },
    amount: { type: Number, min: 0.01},
    date: { type: Date, default: Date.now },
    charity: { type: Schema.Types.ObjectId, ref: 'Charity' },
    recurring: Boolean

}, { timestamps: true });

var RecurringSchema = new Schema({
    account: { type: Schema.Types.ObjectId,  ref: 'Account' },
    amount: { type: Number, min: 0.01},
    date: { type: Date, default: Date.now },
    charity: { type: Schema.Types.ObjectId, ref: 'Charity' },
    recurring: Boolean

}, { timestamps: true });

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

export const Account = mongoose.model('Account', AccountSchema);
