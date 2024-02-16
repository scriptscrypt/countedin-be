const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  // unique id for each user
  keyAppUserId: {
    type: String,
    required: true,
    unique: true,
  },
  keyEmail: {
    type: String, 
    required: true,
    unique: [true, "Email should be unique"]
  },
  keyUsername: {
    type: String,
    required: true,
    unique: [true, "Username cannot be blank"]
  },
  keyPassword: {
    type: String, 
    // required: [true, "Password cannot be blank"]
  },
  keyPhoneNumber:{
    type: Number, 
    default: 0
  },
  keyUSN:{
    type: String, 
    default: ""
  },
  keyEmpId:{
    type: String, 
    default: ""
  },
  keyYearOfStudy:{
    type: Number, 
    default: 0
  },
  keyDepartment:{
    type: String, 
    default: 0
  },
  keyIsAdmin:{
    type: Boolean,
    default: false,
  },
  keyRole:{
    type: String,
    default: "student",
  },
  keyCreatedAt:{
    type: Date,
    default : Date.now(),
    required: true
  },
  keyUpdatedAt:{
    type: Date,
    default : Date.now(),
    required: true
  },
});
 
// Create the User model
const User = mongoose.model('collUsers', userSchema);

module.exports = User;