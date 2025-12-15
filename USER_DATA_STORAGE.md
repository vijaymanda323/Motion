# User Data Storage Documentation

## 📋 Overview
This document explains what user-specific data is stored in the database after signup and login.

---

## 🔐 **1. SIGNUP (User Registration)**

### Required Fields (Stored Immediately):
- **`name`** (String, Required) - User's full name
- **`email`** (String, Required, Unique) - User's email address (normalized: trimmed & lowercased)
- **`password`** (String, Required) - Hashed password using bcrypt (10 salt rounds)
- **`createdAt`** (Date, Auto-generated) - Account creation timestamp

### Optional Fields (Can be provided during signup):
- `height` (String) - User's height
- `weight` (String) - User's weight
- `age` (String) - User's age
- `gender` (String) - User's gender
- `activityLevel` (String) - Activity level
- `goal` (String) - Fitness/health goal
- `healthConditions` (String) - Health conditions
- `medications` (String) - Medications
- `allergies` (String) - Allergies
- `birthDate` (Date) - Birth date
- `bioData` (String) - Biographical data
- `location` (Object) - Location coordinates
  - `longitude` (Number)
  - `latitude` (Number)
- `id` (String) - Custom ID

---

## 🔑 **2. LOGIN (User Authentication)**

### Data Updated/Stored During Login:
- **`streakCount`** (Number, Default: 0) - Login streak counter
  - Increments by 1 for consecutive daily logins
  - Resets to 1 if streak is broken
  - Set to 1 on first login
- **`lastLoginDate`** (Date) - Date of last login (updated each login)
- **`loginDates`** (Array of Dates) - History of all login dates
  - Today's date is added if not already present

### Login Response (Not Stored, Returned to Frontend):
- JWT `token` - Authentication token
- User object with:
  - `id` - User's MongoDB ID
  - `name` - User's name
  - `email` - User's email
  - `firstName` - User's first name (if available)
  - `streakCount` - Current login streak

---

## 📝 **3. PROFILE SETUP (Profile Completion)**

### Data Stored When User Completes Profile Setup:

#### Personal Information:
- **`firstName`** (String) - First name
- **`surname`** (String) - Last name/surname
- **`gender`** (String) - Sex/Gender (Male, Female, Other)
- **`birthDate`** (Date) - Birth date (formatted as dd-mm-yyyy)
- **`height`** (Number) - Height in cm
- **`weight`** (Number) - Weight in kg
- **`name`** (String) - Updated to firstName if provided

#### Medical History:
- **`heartSurgery`** (Boolean) - Whether user had heart surgery
- **`withinSixMonths`** (Boolean) - Heart surgery within last 6 months
- **`heartSurgeryComment`** (String) - Details about heart surgery
- **`fractures`** (Boolean) - Whether user has/had fractures
- **`withinSixMonthsFracture`** (Boolean) - Fractures still recovering or within last 6 months
- **`fracturesComment`** (String) - Details about fractures

---

## 📊 **Complete User Schema Fields**

### Authentication & Basic Info:
1. `name` (String, Required) - Full name
2. `email` (String, Required, Unique) - Email address
3. `password` (String, Required) - Hashed password
4. `firstName` (String, Optional) - First name
5. `surname` (String, Optional) - Last name

### Physical Metrics:
6. `height` (String/Number, Optional) - Height
7. `weight` (String/Number, Optional) - Weight
8. `age` (String, Optional) - Age
9. `gender` (String, Optional) - Gender/Sex
10. `birthDate` (Date, Optional) - Birth date

### Activity & Goals:
11. `activityLevel` (String, Optional) - Activity level
12. `goal` (String, Optional) - Fitness/health goal

### Health Information:
13. `healthConditions` (String, Optional) - Health conditions
14. `medications` (String, Optional) - Medications
15. `allergies` (String, Optional) - Allergies

### Medical History (Profile Setup):
16. `heartSurgery` (Boolean, Optional) - Heart surgery history
17. `withinSixMonths` (Boolean, Optional) - Heart surgery within 6 months
18. `heartSurgeryComment` (String, Optional) - Heart surgery details
19. `fractures` (Boolean, Optional) - Fracture history
20. `withinSixMonthsFracture` (Boolean, Optional) - Recent fractures
21. `fracturesComment` (String, Optional) - Fracture details

### Tracking & Analytics:
22. `streakCount` (Number, Default: 0) - Login streak counter
23. `lastLoginDate` (Date, Optional) - Last login date
24. `loginDates` (Array of Dates, Optional) - Login history

### Additional:
25. `bioData` (String, Optional) - Biographical data
26. `location` (Object, Optional) - Location coordinates
    - `longitude` (Number)
    - `latitude` (Number)
27. `id` (String, Optional) - Custom ID
28. `createdAt` (Date, Auto-generated) - Account creation date

---

## 🔄 **Data Flow Summary**

### Signup Flow:
```
User Signs Up
  ↓
Stores: name, email, password (hashed), createdAt
  ↓
Optional: height, weight, age, gender, etc.
```

### Login Flow:
```
User Logs In
  ↓
Updates: streakCount, lastLoginDate, loginDates
  ↓
Returns: token, user info (id, name, email, firstName, streakCount)
```

### Profile Setup Flow:
```
User Completes Profile
  ↓
Stores: firstName, surname, gender, birthDate, height, weight
  ↓
Stores: heartSurgery, withinSixMonths, heartSurgeryComment
  ↓
Stores: fractures, withinSixMonthsFracture, fracturesComment
  ↓
Updates: name (to firstName)
```

---

## 🔒 **Security Notes**

1. **Password**: Never stored in plain text. Always hashed using bcrypt with 10 salt rounds.
2. **Email**: Normalized (trimmed and lowercased) for consistent lookups.
3. **JWT Token**: Generated on login, contains user ID, expires based on JWT_SECRET configuration.
4. **Sensitive Data**: Medical history and personal information stored securely in MongoDB.

---

## 📱 **Frontend Usage**

### After Signup:
- User can immediately login with email/password
- Basic account created with minimal data

### After Login:
- If `firstName` exists → Navigate to HomeScreen
- If no `firstName` → Navigate to ProfileSetup

### After Profile Setup:
- All profile data saved to backend
- User navigated to HomeScreen
- Profile data available in AboutYouScreen

---

## 🗄️ **Database**

- **Database**: MongoDB (MongoDB Atlas)
- **Collection**: `users`
- **Model**: User schema (defined in `backend/models/Schema.js`)
- **Indexes**: Email is unique (prevents duplicate accounts)

---

## 📝 **Example User Document**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Vijay",
  "email": "vijaymanda323@gmail.com",
  "password": "$2b$10$hashedpassword...",
  "firstName": "Vijay",
  "surname": "Manda",
  "height": 175,
  "weight": 70,
  "gender": "Male",
  "birthDate": "1990-01-15T00:00:00.000Z",
  "heartSurgery": false,
  "fractures": false,
  "streakCount": 5,
  "lastLoginDate": "2025-12-07T00:00:00.000Z",
  "loginDates": [
    "2025-12-03T00:00:00.000Z",
    "2025-12-04T00:00:00.000Z",
    "2025-12-05T00:00:00.000Z",
    "2025-12-06T00:00:00.000Z",
    "2025-12-07T00:00:00.000Z"
  ],
  "createdAt": "2025-12-01T10:30:00.000Z"
}
```

---

## ✅ **Summary**

**After Signup**: Basic account with name, email, password (hashed), and creation date.

**After Login**: Streak tracking updated (streakCount, lastLoginDate, loginDates).

**After Profile Setup**: Complete profile with personal info, metrics, and medical history.

**All data persists** in MongoDB and is retrieved when user logs in again.









