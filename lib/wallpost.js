var mongoose = require('mongoose'),
Schema = mongoose.Schema;
mongoose.createConnection('mongodb://localhost/wallpost');


var Userposts = mongoose.model('userpost', new Schema({
    username : String,
    wallposts : [
        {
            toPage: String,
            type: String,
            json: String
        }
    ]
}));

// post something to a page
exports.postToPage = function(username, toPage, type, json, done ){

    console.log('user '+username+' is posting to wall '+toPage);
    console.log('type '+type+': json '+json);

    Userposts.findOne({'username':username}, '', function(err,userPosts){

        var newUserPosts;

        // if the user made posts before
        if(userPosts){

            console.log('the user made posts before');

            userPosts.wallposts.push(
                JSON.stringify({
                    toPage: toPage,
                    type: type,
                    json: json
                })
           );
           userPosts.save(function(){

               console.log('looks like we might have saved a new one');

           });

        }else{

           console.log('looks like the users first post');

           newUserPosts = new Userposts();
           newUserPosts.username = username;
           newUserPosts.wallposts.push(

                JSON.stringify({
                    toPage: toPage,
                    type: type,
                    json: json
                })

           );

           newUserPosts.save(function(){

               console.log('saved new wallpost record for user' + username);

           });

           

        }

        // call done callback
        done();
    });



};

// get a users posts
exports.getPosts = function(username, done){

   console.log('getting posts for the user ' + username);

   Userposts.findOne({'username':username}, '', function(err,userPosts){

       // return posts, or empty string   
       if(userPosts){

           done(userPosts.wallposts);

       }else{

           done('');

       }
   });

};
