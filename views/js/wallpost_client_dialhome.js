(function(){

    //var get = function(id){ return document.getElementById(id)},

    // post check thread
    var postCheck = function(){

        setTimeout(postCheck, 15000);

        console.log('dialing home...');

        // get the newest post id
        var posts = _.get('wall_posts'),
        latestID =  posts.children[0].id.replace(/post_container_/,''),
        oldestID = posts.children[posts.children.length-1].id.replace(/post_container_/,'');
    
        myHttp.sendPostCheck(
            {
                checkType: 'newposts',
                forUser: _.get('wall_username').innerHTML,
                latestID: latestID,
                oldestID: oldestID
            }, 
            function(res){

                if(res.posts.length > 0 ){

                    console.log('new posts!');

                    //postType.injectpost(res.posts[0]);
                    postType.injectFromDialHome(res.posts);

                }else{

                    console.log('no new posts.');
                }


            }
        );

    };

    postCheck();
}());

/*
(function(){

    //var get = function(id){ return document.getElementById(id)},

    // post check thread
    var postCheck = function(){

        setTimeout(postCheck, 10000);

        console.log('dialing home...');

        // get the newest post id
        var posts = get('wall_posts'),
        latestID =  posts.children[0].id.replace(/post_container_/,''),
        oldestID = posts.children[posts.children.length-1].id.replace(/post_container_/,'');
    
        myHttp.sendPostCheck(
            {
                checkType: 'newposts',
                forUser: get('wall_username').innerHTML,
                latestID: latestID,
                oldestID: oldestID
            }, 
            function(res){

                if(res.posts.length > 0 ){

                    console.log('new posts recived, injecting them...');

                    postType.injectpost(res.posts[0]);

                }else{

                    console.log('no new posts.');
                }


            }
        );

    };

    postCheck();
}());

*/