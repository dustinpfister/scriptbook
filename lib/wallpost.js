var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var db = mongoose.createConnection('mongodb://localhost/wallpost');


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

// check for new posts and return any new ones
/*
    {
        checkType: 'newposts',
        latestID: latestID,
        oldestID: oldestID
    }

*/
exports.postCheck = function(req, done){

    var postCheck = JSON.parse(req.get('postcheck'));

    if(postCheck.checkType === 'newposts'){

        console.log('checking for new posts for user: '+req.user.name);
        console.log('checking for later than: '+postCheck.latestID);



       Userposts.findOne({'username': req.user.name}, '', function(err,user){

           var wp = user.wallposts,
           i = wp.length-1,
           newPosts = [];
           while(i >= 0){

               // if latest is found break
              
               if( wp[i]._id.toString() === postCheck.latestID ){

                   console.log('latest found at: ' + i);

                   break;

               }

               // else it's a new post! push it to new posts.
               newPosts.push(wp[i]);

               i--;
           }

           done({posts: newPosts });
           

       });


/*
        Userposts.findOne({'_id': postCheck.latestID}, '', function(err,post){

            done(post);

        });
*/
    }else{

        done(null);

    }

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