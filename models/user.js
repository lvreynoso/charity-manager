// User model
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String, // LOL
    name: {
        first: String,
        last: String
    },
    userId: { type: Number, unique: true},
    accounts: [{ type: Schema.Types.ObjectId, ref: 'Account' }]
});

UserSchema.virtual('name.full').get(function () {
    return this.name.first + ' ' + this.name.last;
})

let User = mongoose.model('User', UserSchema);
export default User;
