// Quick test script to verify login works
const mongoose = require('mongoose');
const User = require('./models/Schema');
const bcrypt = require('bcrypt');

const MONGODB_URI = 'mongodb+srv://vijaymanda323_db_user:Vijay%403369@cluster0.xhsvyzy.mongodb.net/?appName=Cluster0';

async function testLogin() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        const testEmail = 'vijaymanda323@gmail.com';
        const testPassword = 'vijay123';
        
        console.log('\n=== TESTING LOGIN ===');
        console.log('Email:', testEmail);
        console.log('Password:', testPassword);
        
        const normalizedEmail = testEmail.trim().toLowerCase();
        console.log('Normalized email:', normalizedEmail);
        
        const user = await User.findOne({ email: normalizedEmail });
        
        if (!user) {
            console.log('❌ User not found');
            const userCount = await User.countDocuments();
            console.log('Total users:', userCount);
            const allUsers = await User.find({}, 'email name').limit(5);
            console.log('Sample users:', allUsers.map(u => ({ email: u.email, name: u.name })));
            return;
        }
        
        console.log('✅ User found:', user.email);
        console.log('User name:', user.name);
        console.log('Password hash exists:', !!user.password);
        console.log('Password hash length:', user.password?.length || 0);
        
        console.log('\nComparing password...');
        const isCorrect = await bcrypt.compare(testPassword, user.password);
        console.log('Password match:', isCorrect);
        
        if (isCorrect) {
            console.log('✅✅✅ LOGIN WOULD SUCCEED');
        } else {
            console.log('❌❌❌ LOGIN WOULD FAIL - Password mismatch');
        }
        
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testLogin();









