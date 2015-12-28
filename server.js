var express = require('express'),
app = express(),
passport = require('passport'),
Strategy = require('passport-local').Strategy,
expressLayouts = require('express-ejs-layouts'),

users = require('./lib/users.js'),
wallpost = require('./lib/wallpost.js'),

server,

siteWide = express.Router();

// use passport local strategy
// followinf example at : https://github.com/passport/express-4.x-local-example/blob/master/server.js
passport.use(new Strategy(
  function(username, password, cb) {
    users.findByUsername(username, function(err, user) {

      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());

//app.use(bodyParser.json({limit: '5mb'}));
//app.use(bodyParser.urlencoded({limit: '5mb'}));
app.use(require('body-parser').json({limit: '5mb'}));
app.use(require('body-parser').urlencoded({ extended: true, limit: '5mb'}));
//app.use(require('body-parser').urlencoded({ extended: true}));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false, limit:'5mb' }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// lets try EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('views')); // must do this to get external files

// Content-Security-Policy
app.use(function(req,res,next){

    /*    i have been running into problems with content-Security-Policy when hosting on a local network
     *    the project seems to work fine in edge, but perhaps becuase of lax security
     *    hopfully the problem will go away in chrome, and other effected browsers if this gets hosted 
     *    in a top level domain.
     */
             
    // trust self at least yes? I would also like inline scripts for now, might change that.
    //res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' http://192.168.1.235:3000");

    //console.log('CSP: ' + res.get("Content-Security-Policy"));

    return next();

});

// site wide get
app.get('*', function(req,res,next){

    // if visiter is not logged in the visiter can only go to login, and signup
    if(req.user === undefined){

        // if at login or signup all is well
        if(req.url === '/login' || req.url === '/signup'){

            next();

        // else redirect
        }else{

            res.redirect('/login');

        }


    // else if the user is logged in...
    }else{


        next();

    }

});

// root namespace
app.get('/', function(req,res){

    res.render('index', { 
        username: req.user.name
    });

});
app.post('/', function(req,res){

    res.send(null);

});

// login namespace
app.get('/login', function(req,res){

    //res.writeHead(200, {"Content-Type": "text/html"});
    //res.end("<script>alert('inline!')<\/script>");
    //res.end('hello world');
    res.render('login', {})

});
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

// logout namespace
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
});

// signup namespace
app.get('/signup', function(req,res){

    res.render('signup', {});

});
app.post('/signup', function(req, res) {
        
    
    console.log('okay so this is what we get for reg.body here: '+JSON.stringify(req.body));

    users.createUser( JSON.stringify(req.body) );

    res.redirect('/login');

});

// search namespace
app.get('/search', function(req,res){

    res.render('search', {});

});
app.post('/search', function(req, res) {
        
    console.log('search query: ');
    console.log(req.get('search'));

    var search = JSON.parse(req.get('search'));

    users.findProfile(search.name, function(err, user){

        console.log('sending user data:');
        console.log(user);
        res.send(JSON.stringify(user));

    });

});

// the user namespace ( /user /user/ /user/username )
app.get(/wall(\/.*)?/, function(req, res){

    var username;

    // if visiter is logged in
    if(req.user){
        
        // if username ( /user/username )
        if(req.url.length > 6){

            username = req.url.replace(/\/wall\//,'');

            users.findProfile(username, function(err,user){

                // if user found
                if(user){

                    // find the users profile
    users.findProfile(username, function(err,user){

        // do they have posts?
        wallpost.getPosts(user.name, function(wallposts){

            var len,i,html,currentPost;

            if(wallposts !== ''){

                 // render posts
                 len = wallposts.length;
                 i = len;
                 html='';
                
                 // render all posts for now
                 while(i--){

                     // html context that will be in all posts
                     html += '<div id="post_container_'+wallposts[i]._id+'" class=\"post_container\">'+
                        //' <div class=\"post_info\">'+wallposts[i].postOwner+'<\/div>'
                        ' <div class=\"post_info\"> var fromUser = \"'+wallposts[i].postOwner + '\", at = new Date(\"'+ wallposts[i].postTime +'\");<\/div>';

                     // say post
                     if(wallposts[i].postType === 'say'){

                        html += '<div class="post_say"><p>'+wallposts[i].postContent+'<\/p><\/div>';

                     }

                     // quick canvas post
                     if(wallposts[i].postType === 'quickcanvas'){
                         
                        html += '<div class=\"quickcanvas_container\">'+
                             '<div class=\"quickcanvas_icon_large\"><img class=\"quickcanvas_image_large\" src=\"'+wallposts[i].postContent.thum+'\"><\/div>'+
                             '<div class=\"quickcanvas_icon_small\"><img class=\"quickcanvas_image_small\" src=\"'+wallposts[i].postContent.thum+'\"><\/div>'+
                             '<div class=\"quickcanvas_content\">'+
                                 '<textarea class=\"quickcanvas_code\">'+ wallposts[i].postContent.code +'<\/textarea>'+
                                 '<iframe class=\"quickcanvas_iframe\" scrolling=\"no\" seamless=\"seamless\" src=\"\/html\/frame_quick_canvas.html\"><\/iframe>'+
                             '<\/div>'+
                             '<div class=\"quickcanvas_controls\">'+
                                 '<input class=\"quickcanvas_button_runkill\" type=\"button\" value=\"RUN\">'+
                                 '<input class=\"quickcanvas_button_hide\" type=\"button\" value=\"hide\">'+
                             '<\/div>'+
                       '<\/div>';

                     }

                     // end post container
                     html += '<\/div><!-- end post -->';
                 }

                 // render
                 res.render('userwall',{
                     username: req.user.name,
                     wallusername : user.name,
                     inject_wall_posts: html 

                 });

            }else{

                 res.render('userwall', { 
                     username: req.user.name,
                     wallusername : user.name,
                     inject_wall_posts: '<div>why not post something<\/div>' 
                 });

            }

        });        

    });

                }else{

                    res.render('usernotfound', {});

                }
            });

        // if root space ( /wall )    
        }else{

            users.getUserNames(function(names){
                res.render('userhome', {
                    username : req.user.name,
                    otherUsers : names
                });
            });
        }

    }

});
app.post(/wall(\/.*)?/, function(req,res){

    console.log('post from /wall');
    console.log(req.get('scriptbook-post'));

    // if wall post
    //if(req.get('wallpost')){
    if(req.get('scriptbook-post') === 'wallpost'){
   // var thePost = JSON.parse(req.get('wallpost'));
    //var postType = 'none';

    wallpost.postToUserPage(req, function(status, post){

        // if success send back the wallpost object
        if(status === 'success'){

            res.send(post);

        // send null if not sucess
        }else{

            res.send(null);

        }

    });

    // else if not a wall post
    }else{

        //if(req.get('postcheck')){
        if(req.get('scriptbook-post') === 'postcheck'){

           // res.send(JSON.stringify({postcheck: 'sure i will get on that.'}));
           //res.send(req.get('postcheck'));
           wallpost.postCheck(req, function(post){

               res.send(JSON.stringify(post));

           });


        }else{    

            res.send(JSON.stringify({nullpost:true}));

        }

    }

});

// the user namespace ( /user /user/ /user/username )
app.get(/user(\/.*)?/, function(req, res){

    var username;

    // if visiter is logged in
    if(req.user){
        
        // if username ( /user/username )
        if(req.url.length > 6){

            username = req.url.replace(/\/user\//,'');

            users.findProfile(username, function(err,user){

                if(user){

                    res.render('userprofile', {

                        id : user.id,
                        name: user.name,
                        displayname: user.displayName

                    });

                }else{

                    res.render('usernotfound', {});

                }
            });

        // if root userspace ( /user )    
        }else{

            users.getUserNames(function(names){
                res.render('userhome', {
                    username : req.user.name,
                    otherUsers : names
                });
            });
        }

    }

});
app.post(/user(\/.*)?/, function(req, res){

});

// start the server
server = app.listen(3000, function () {
  var host = server.address().address,
  port = server.address().port;

  console.log('it lives.');
  console.log('scriptbook listening at http://%s:%s', host, port);

});
