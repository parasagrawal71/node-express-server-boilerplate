const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('plugins');

const { Schema } = mongoose;

// MAIN SCHEMA
const UserModel = new Schema(
    {
        name: { type: String, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, private: true },
        isVerified: { type: Boolean, default: false },
        otp: { type: String },
    },
    { timestamps: true }
);

// add plugin that converts mongoose to json
UserModel.plugin(toJSON);
UserModel.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
UserModel.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

UserModel.pre('findOneAndUpdate', async function (next) {
    this.options.runValidators = true;
    this.options.new = true;

    if (this._update && this._update.password) {
        const passwordHash = await bcrypt.hash(this._update.password, 10);
        this._update.password = passwordHash;
    }

    if (this._update && this._update.otp) {
        const otpHash = await bcrypt.hash(String(this._update.otp), 10);
        this._update.otp = otpHash;
    }

    next();
});

UserModel.pre('save', async function (next) {
    if (this.password) {
        const passwordHash = await bcrypt.hash(this.password, 10);
        this.password = passwordHash;
    }

    if (this.otp) {
        const otpHash = await bcrypt.hash(String(this.otp), 10);
        this.otp = otpHash;
    }

    next();
});

UserModel.methods.isValidPassword = async function (password) {
    const user = this;
    const comparision = await bcrypt.compare(password, user.password);

    return comparision;
};

UserModel.methods.isValidOtp = async function (otp) {
    const user = this;
    let comparision = false;
    const info = '';

    if (otp && user.otp) {
        comparision = await bcrypt.compare(String(otp), user.otp);
        return [comparision, !comparision ? 'Wrong OTP' : ''];
    }

    return [comparision, info];
};

module.exports = mongoose.model('User', UserModel, 'users');
