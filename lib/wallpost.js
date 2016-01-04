var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var db = mongoose.createConnection('mongodb://localhost/wallpost');


var spawn = require('child_process').spawn;


var Userposts = db.model('userpost', new Schema({
    username : String,
    lastPostCheck : Date, // just stores the last time a postcheck was preformed for the users wall
    wallposts : [
        new Schema({
           postTime: String,
           postOwner: String,
           postType: String,
           //postContent: String
           postContent: Object
        })
    ]
}));

// post something to a page
exports.postToUserPage = function(req, done){

    
    //var thePost = JSON.parse(req.get('wallpost')); // parse in the wallpost
    
   var thePost = req.body;

    console.log('the body: {');
    console.log(req.body);
    console.log('}')
    
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

            // espeak but only withs says for dustin

            if(thePost.postTo === 'dustin' && thePost.postType === 'say'){

                //spawn('espeak', [thePost.postContent]);
       
            }

            userPosts.save(function(){

               // call done callback
               done('success', JSON.stringify(userPosts.wallposts[userPosts.wallposts.length-1]));

            });


        // users first post
        }else{

           newUserPosts = new Userposts();
           newUserPosts.username = thePost.postTo;

           newUserPosts.wallposts.push({
                postTime: new Date(),
                postOwner: thePost.postOwner,
                postType: thePost.postType,
                postContent: thePost.postContent
           });

           newUserPosts.save(function(){

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

    //var postCheck = JSON.parse(req.get('postcheck'));
    var postCheck = req.body;

    
    if(postCheck.checkType === 'newposts'){

       // for logged in user? no not always.
       //Userposts.findOne({'username': req.user.name}, '', function(err,user){
       Userposts.findOne({'username': postCheck.forUser}, '', function(err,user){

           if(user){
           var wp = user.wallposts,
           i = wp.length-1,
           newPosts = [];

           // update postcheck Date!
           user.lastPostCheck = new Date();
           user.save();

           while(i >= 0){

               // if latest is found break
              
               if( wp[i]._id.toString() === postCheck.latestID ){

                   break;

               }

               // else it's a new post! push it to new posts.
               newPosts.push(wp[i]);

               i--;
           }

           done({posts: newPosts });
           
           // if not user
           }else{

              done({posts: [] });

           }

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

   
   Userposts.findOne({'username':username}, '', function(err,userPosts){

       // return posts, or empty string   
       if(userPosts){

           done(userPosts.wallposts);

       }else{

           done('');

       }
   });

};