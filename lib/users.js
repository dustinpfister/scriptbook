var mongoose = require('mongoose'),
Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/users');

var userSchema = new Schema({
    id: Number,
    name: String,
    password: String,
    displayName: String
});

var userRecord = mongoose.model('userrecord', userSchema),
userInfo = mongoose.model('userinfo',new Schema({
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

    userRecord.findOne({'name': username},'id name displayName', function(err,user){

        if(user){
            return done(null, user);
        }else{
            return done(null,null);
        }
    });

};

// create a new user with the given form JSON
exports.createUser = function(formJSON){
    
    var newUser = new userRecord(JSON.parse(formJSON));
    
    userRecord.findOne({'name': newUser.name},'', function(err,user){
    
        if(user){
            console.log('someone tryed to setup an account for a username that is taken');
        }else{
            console.log('NEW USER!');
            
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

                    console.log('did it even change?: ' + info.userCount);

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

        }
    });
};