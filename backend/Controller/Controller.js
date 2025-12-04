const mongoose = require('mongoose');
const User = require('../models/Schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');


const createUser = async (req, res) => {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                message: 'Database connection not available. Please check MongoDB Atlas IP whitelist settings.',
                error: 'MongoDB not connected'
            });
        }

        const { name, email, password, height, weight, age, gender, activityLevel, goal, healthConditions, medications, allergies, birthDate, bioData, location, id } = req.body;
        
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user with hashed password
        console.log('Creating user with email:', email);
        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            height, 
            weight, 
            age, 
            gender, 
            activityLevel, 
            goal, 
            healthConditions, 
            medications, 
            allergies, 
            birthDate, 
            bioData, 
            location, 
            id 
        });
        
        console.log('User created successfully:', {
            id: user._id,
            email: user.email,
            name: user.name
        });
        
        res.status(201).json({ 
            message: 'User created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        // Update login streak
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let streakCount = user.streakCount || 0;
        const lastLoginDate = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
        
        if (lastLoginDate) {
            lastLoginDate.setHours(0, 0, 0, 0);
            const daysDiff = Math.floor((today - lastLoginDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 0) {
                // Same day login, no change
            } else if (daysDiff === 1) {
                // Consecutive day, increment streak
                streakCount += 1;
            } else {
                // Streak broken, reset to 1
                streakCount = 1;
            }
        } else {
            // First login
            streakCount = 1;
        }
        
        // Add today's date to loginDates if not already present
        const todayStr = today.toISOString().split('T')[0];
        const loginDates = user.loginDates || [];
        const todayExists = loginDates.some(date => {
            const dateStr = new Date(date).toISOString().split('T')[0];
            return dateStr === todayStr;
        });
        
        if (!todayExists) {
            loginDates.push(today);
        }
        
        // Update user with new streak and login date
        user.streakCount = streakCount;
        user.lastLoginDate = today;
        user.loginDates = loginDates;
        await user.save();
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key');
        res.status(200).json({ 
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                firstName: user.firstName,
                streakCount: user.streakCount
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
}

// Update user profile
const updateProfile = async (req, res) => {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                message: 'Database connection not available. Please check MongoDB Atlas IP whitelist settings.',
                error: 'MongoDB not connected'
            });
        }

        const { email, firstName, surname, sex, birthDate, height, weight, 
                heartSurgery, withinSixMonths, heartSurgeryComment, 
                fractures, withinSixMonthsFracture, fracturesComment } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        let user = await User.findOne({ email });
        if (!user) {
            // If user doesn't exist, create a new user with minimal data
            // This handles the case where user logs in but hasn't registered yet
            const saltRounds = 10;
            const tempPassword = 'temp_password_' + Date.now();
            const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);
            
            user = await User.create({
                email: email,
                name: firstName || 'User',
                password: hashedPassword, // Hashed temporary password
                firstName: firstName,
                surname: surname,
            });
            console.log('Created new user for profile setup:', email);
        }

        // Update profile fields
        if (firstName !== undefined) user.firstName = firstName;
        if (surname !== undefined) user.surname = surname;
        if (sex !== undefined) user.gender = sex;
        if (birthDate !== undefined) user.birthDate = new Date(birthDate);
        if (height !== undefined) user.height = height;
        if (weight !== undefined) user.weight = weight;
        if (heartSurgery !== undefined) user.heartSurgery = heartSurgery;
        if (withinSixMonths !== undefined) user.withinSixMonths = withinSixMonths;
        if (heartSurgeryComment !== undefined) user.heartSurgeryComment = heartSurgeryComment;
        if (fractures !== undefined) user.fractures = fractures;
        if (withinSixMonthsFracture !== undefined) user.withinSixMonthsFracture = withinSixMonthsFracture;
        if (fracturesComment !== undefined) user.fracturesComment = fracturesComment;
        
        // Update name if firstName is provided
        if (firstName) {
            user.name = firstName;
        }

        await user.save();
        
        res.status(200).json({ 
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                surname: user.surname,
                name: user.name,
                email: user.email,
                height: user.height,
                weight: user.weight,
                gender: user.gender,
                birthDate: user.birthDate
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
}

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ 
                message: 'Database connection not available. Please check MongoDB Atlas IP whitelist settings.',
                error: 'MongoDB not connected'
            });
        }

        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            user: {
                id: user._id,
                firstName: user.firstName,
                surname: user.surname,
                name: user.name,
                email: user.email,
                height: user.height,
                weight: user.weight,
                gender: user.gender,
                birthDate: user.birthDate,
                streakCount: user.streakCount || 0,
                lastLoginDate: user.lastLoginDate,
                heartSurgery: user.heartSurgery,
                withinSixMonths: user.withinSixMonths,
                heartSurgeryComment: user.heartSurgeryComment,
                fractures: user.fractures,
                withinSixMonthsFracture: user.withinSixMonthsFracture,
                fracturesComment: user.fracturesComment,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ message: 'Error getting user profile', error: error.message });
    }
}

module.exports = { createUser, loginUser, updateProfile, getUserProfile };