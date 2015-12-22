var mongoose = require('mongoose'),
Schema = mongoose.Schema;
mongoose.createConnection('mongodb://localhost/wallpost');


var Userposts = mongoose.model('userpost', new Schema({
    username : String,
    wallposts : [
        new Schema({
           postTime: String,
           postOwner: String,
           postType: String,
           postContent: String
        })
    ]
}));

// post something to a page
exports.postToUserPage = function(req, done){

    
    var thePost = JSON.parse(req.get('wallpost')); // parse in the wallpost
    
    // post owner is poster?
    // ALERT! do we even need this in the wallpost object? isn't this always the case?
    if(thePost.postOwner === '?user'){
        thePost.postOwner = req.user.name;
    }

    // posting to poster?
    if(thePost.postTo === '?user'){
        thePost.postTo = req.user.name;
    }
    
    Userposts.findOne({'username': thePost.postTo}, '', function(err,userPosts){

        var newUserPosts;

        // if the user made posts before
        if(userPosts){

           userPosts.wallposts.push({
                //toPage: toPage,
                postTime: new Date(),
                postOwner: thePost.postOwner,
                postType: thePost.postType,
                postContent: thePost.postContent
            });

            userPosts.save(function(){

               // call done callback
               done('success', JSON.stringify(userPosts.wallposts[userPosts.wallposts.length-1]));

            });


        // users first post
        }else{

           console.log('looks like the users first post');

           newUserPosts = new Userposts();
           newUserPosts.username = thePost.postTo;

           console.log('trying to save this:');
           console.log(thePost);

           newUserPosts.wallposts.push({
                postTime: new Date(),
                postOwner: thePost.postOwner,
                postType: thePost.postType,
                postContent: thePost.postContent
           });

           newUserPosts.save(function(){

               console.log('well yes it saves, but yet it does not.');

               // call done callback
               done('success', JSON.stringify(newUserPosts.wallposts[0]));

           });

        }
        
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