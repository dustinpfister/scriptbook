/*
    user_count.js
    simple script that returns the number of users in the mongodb database 'users'

*/

var mongoose = require('mongoose'),

Schema = mongoose.Schema,

db = mongoose.connect('mongodb://localhost/users'),

userSchema = new Schema({

    // required 
    id: Number,
    name: String,
    password: String,

    // basic info
    displayName: String,
    sex: String,
    DOB: Date,

    // status    
    //lastLogin: Date,
    //lastPost: Date,
    //status: String
}),

userRecord = db.model('userrecord', userSchema),

userInfo = db.model('userinfo',new Schema({
    infoID: String,
    userCount: Number
}));


console.log('********** ********** ********** ********** **********');
userInfo.findOne({'infoID': 'main'},'userCount', function(err, info){

    console.log('number of users: ' + info.userCount);

    // disconnect
    db.disconnect();

    console.log('********** ********** ********** ********** **********');

});
