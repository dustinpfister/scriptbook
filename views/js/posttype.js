/*

    posttype.js is a scriptbook front-end for handeling the posting, and injecting of wall posts on the client system. it is part of the wallpost_client front-end collection, and as you would exspect works with the wallpost.js backend.

    
    * comes with NO BUILT IN postTypes, posttype.js must be extened with at least one plugin (such as posttype_say.js)
    * generates and injects a user interface that can be used to post to a users wall
    

    API:

    postType.state

        This is a reference to the inner state object. If you can't work with alything that you should be able to work with via a public method, what you are looking for should be here.

    postType.add(plugin)

        You call this method when writing a plugin. For an example of how to go about writing a plugin for posttype.js take a look at posttype_say.js.

    postType.injectInterface(el)

        Call this method with the given element that will function as a container for the main wallpost user interface.

    postType.setWallPostContainer(el)

        As the name would suggest, use this method to set the container that wall posts are to be injected into.

*/



var postType = (function(){

    var state = {

        postTypes : {},
        wallPostContainer: document.body

    },

    setOnAction = function(container){

        (function(){
  
            var pt = container.dataset.posttype;

            container.addEventListener('click', function(e){
                        
                var action = state.postTypes[pt].onAction['ifClass_'+e.target.className];

                console.log('className: ' + e.target.className);

                // if there is an action for that id, call it
                if(action){action();}

            });

        }());

    };

    return {

        // make state public
        state: state,

        // add plugin method
        add : function(plugin){

            //state.postTypes.push(plugin);
            state.postTypes[plugin.postType] = plugin;

        },

        injectInterface: function(container){

            var html='';

            // comple interface
            for(var postType in state.postTypes){

                html += '<div id=\"posttype_interface_'+postType+'\" class=\"posttype_interface\">'+
                state.postTypes[postType].ui()+
                '<\/div>';

            }

            // inject interface into container
            container.innerHTML = html;

            // now that we have the html, attach handlers
            for(var postType in state.postTypes){

                (function(){

                    var current = document.getElementById('posttype_interface_'+postType),
                    pt = postType;

                    current.addEventListener('click', function(e){
                        
                        var action = state.postTypes[pt].onAction[ 'ifID_' + e.target.id ];

                        // if there is an action for that id, call it
                        if(action){action();}

                    });

                }());

            }

        },

        // attach event handlers to any given posts that may have been generated server side
        attachToGiven : function(){

            var posts = document.getElementsByClassName('post_container');
            [].forEach.call(posts, function(post){

               // set onAction for each server given post
               setOnAction(post);

            });

        },

        setWallPostContainer : function(el){

            state.wallPostContainer = el;

        },

        injectPost : function(response){

            console.log('looking good.');
            console.log(response);

            var post_container = document.createElement('div'),
            parrent = _.get('wall_posts');

            post_container.id = 'post_container_'+response._id;
            post_container.className = "post_container";

            //post_container.addEventListener('click', postAction);
            (function(){
            
                var pt = response.postType;

                post_container.addEventListener('click', function(e){
                        
                    var action = state.postTypes[pt].onAction['ifClass_'+e.target.className];

                    console.log('className: ' + e.target.className);

                    // if there is an action for that id, call it
                    if(action){action();}

                });

           }());


            post_container.innerHTML = ' <div class=\"post_info\"> var fromUser = \"'+response.postOwner + 
                '\", at = new Date(\"'+ response.postTime +'\"), postType = \"'+response.postType+'\";<\/div>'+

            // rest of content depends on postType
            state.postTypes[response.postType].postTemplate(response.postContent);
                //'<div class="post_say"><p>'+response.postContent+'<\/p><\/div>';
                                
            if(parrent.children.length > 0){
                parrent.insertBefore(post_container, parrent.children[0]);
            }

        }

    }

}());