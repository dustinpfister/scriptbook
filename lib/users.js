var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var db = mongoose.connect('mongodb://localhost/users');


var userSchema = new Schema({

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
});

/*
var userRecord = mongoose.model('userrecord', userSchema),
userInfo = mongoose.model('userinfo',new Schema({
    infoID: String,
    userCount: Number
}));
*/

var userRecord = db.model('userrecord', userSchema),
userInfo = db.model('userinfo',new Schema({
    infoID: String,
    userCount: Number
}));


// find a user document by the given id
exports.findById = function(id,cb){
    userRecord.findOne({'id': id},'', function(err,user){
        if(user){
           return cb(null, user);
        }else{
            return cb(null,null);
        }
    });
};

// find a user document by the given username
exports.findByUsername = function(username, cb){
    userRecord.findOne({'name': username},'', function(err,user){
        if(user){
            return cb(null, user);
        }else{
            return cb(null,null);
        }
    });
};

// find a user profile by username
exports.findProfile = function(username, done){

    userRecord.findOne({'name': username},'id name displayName DOB admin', function(err,user){

        if(user){
            return done(null, user);
        }else{
            return done(null,null);
        }
    });

};

// get all user names
exports.getUserNames = function(done){

    userRecord.find(function(err, data){
        
        var i = 0, len = data.length, names = []
        while(i < len){
            names.push(data[i].name);
            i++
        }

        done(names);

    });

};

exports.createUser = function(formData){

   console.log(formData.dob_month -1);

   console.log(formData.dob_year);
   var DOB = new Date(formData.dob_year, formData.dob_month -1, formData.dob_day);

   console.log(DOB);

   var newUser = new userRecord({

       id: 0, // need to get the latest id
       name: formData.name,
       password: formData.password,
       admin: false,  // new users always default to non-admin

       // basic info
       displayName: formData.displayName,
       //sex: String,
       DOB: DOB

   });

   //console.log(newUser);

    userRecord.findOne({'name': newUser.name},'', function(err,user){

        if(user){

            // what to do if the user is found

        }else{
            
            // find current user count
            userInfo.findOne({'infoID': 'main'},'', function(err,info){
            
                // we should have info
                if(info){

                    console.log('yes we have main user info:');
                    console.log(info);
                    
                    // save new user?
                    console.log('setting user id...');
                    newUser.id = info.userCount;
                    console.log(newUser);

                    // update user info
                    info.userCount += 1;

                    // save data??
                    newUser.save(function(){

                        console.log('new user data saved!');
                    
                    });

                    info.save(function(){
                       console.log('user info updated!');
                    });

                // we have a problem, or we are starting over with a new database.
                }else{

                    var newInfo = new userInfo({infoID: 'main', userCount: 1});

                    newInfo.save(function(){
                        console.log('saved new main user info record!');
                    });

                }

            });

        } // end if user

    }); // end userRecord.findOne

};
