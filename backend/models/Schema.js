const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    height:{
        type: String,
        required: false
    },
    weight:{
        type: String,
        required: false
    },
    age:{
        type: String,
        required: false
    },
    gender:{
        type: String,
        required: false
    },
    activityLevel:{
        type: String,
        required: false
    },
    goal:{
        type: String,
        required: false
    },
    healthConditions:{
        type: String,
        required: false
    },
    medications:{
        type: String,
        required: false
    },
    allergies:{
        type: String,
        required: false
    },
    birthDate:{
        type: Date,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    bioData:{
        type: String,
        required: false
    },
    location: {
        longitude: {
            type: Number,
            required: false
        },
        latitude: {
            type: Number,
            required: false
        }
    },
    id: {
        type: String,
        required: false  
    },
    firstName: {
        type: String,
        required: false
    },
    surname: {
        type: String,
        required: false
    },
    // Medical history fields
    heartSurgery: {
        type: Boolean,
        required: false
    },
    withinSixMonths: {
        type: Boolean,
        required: false
    },
    heartSurgeryComment: {
        type: String,
        required: false
    },
    fractures: {
        type: Boolean,
        required: false
    },
    withinSixMonthsFracture: {
        type: Boolean,
        required: false
    },
    fracturesComment: {
        type: String,
        required: false
    },
    // Streak tracking
    streakCount: {
        type: Number,
        default: 0
    },
    lastLoginDate: {
        type: Date,
        required: false
    },
    loginDates: [{
        type: Date
    }]
})

module.exports = mongoose.model('User', userSchema);