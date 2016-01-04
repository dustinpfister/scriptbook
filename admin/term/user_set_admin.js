var mongoose = require('mongoose'),
Schema = mongoose.Schema,

db = mongoose.connect('mongodb://localhost/users'),

userSchema = new Schema({

    // required 
    id: Number,
    name: String,
    password: String,
    admin: Boolean,

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

username = process.argv[2],
setAdmin = process.argv[3]; 

// assume setting admin false if not given
if(setAdmin === undefined){ setAdmin = false;}

// assume dustins account if username is not given, and set admin to true
if(!username){

    username = 'dustin';
    setAdmin = true;

}

console.log('username: ' + username);
console.log('set to admin: ' + setAdmin);

userRecord.findOne({'name': username}, 'admin', function(err, user){

   console.log('current admin status: ' + user.admin);

   user.admin = setAdmin
   user.save(function(){

       console.log('admin status updated to: ' + setAdmin);

       // disconnect
       db.disconnect();

   });



});