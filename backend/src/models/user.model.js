import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userSchema = new Schema({
    userName: {
        type: String,
        required: ['user name is required', true],
        unique: true,
        trim: true,
        lowercase: true,
        index: true // searching purposes only
    },
    email: {
        type: String,
        required: ['user email is required', true],
        unique: true,
        trim: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        required: ['user fullname is required', true],
        unique: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // cloudnary url
        required: true
    },
    coverImage: {
        type: String, // cloudnary url
    },
    watchHistroy: [{
        type: Schema.Types.ObjectId,
        ref: "Video"

    }],
    password: {
        type: String,
        required: [true, 'password is required']
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true })

// encrypt password before saving user
userSchema.pre('save', async function (next) {
    const user = this
    if (!user.isModified('password')) return next();
    this.password = await bcrypt.hash(user.password, 10)
    next()
})

userSchema.methods.comparePassword = async function (userPasssword) {
    const user = this;
    const isMatched = await bcrypt.compare(userPasssword, user.password)
    return isMatched

}

userSchema.methods.generateAccessToken = async function () {
    const user = this;
    const payload = {
        _id: user._id,
    }
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
    return token;
}

export const User = mongoose.model('User', userSchema)