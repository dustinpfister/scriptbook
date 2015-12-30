/*
    posttype.js

    posttype.js is a scriptbook front-end for handeling the posting, and injecting of wall posts on the client system.

*/

var postType = (function(){

    var state = {

        postTypes : {},
        json:[],
        wallPostContainer: document.body

    },

    setOnAction = function(container){

        (function(){
  
            var pt = container.dataset.posttype;

            container.addEventListener('click', function(e){
                        
                var actionObj = state.postTypes[pt].onAction,
                action = actionObj[String('ifID_'  +e.target.id)] || actionObj[String('ifClass_'  +e.target.className)] ;

                console.log('action');

                // if there is an action for that id, call it
                if(action){action(e, this, e.target);}

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

        addJSON : function(aurgObj){

            state.json.push(aurgObj);
            console.log(state.json);

        },

        injectInterface: function(container){

            var html='';

            // comple interface
            for(var postType in state.postTypes){

                html += '<div data-posttype=\"'+postType+'\" id=\"posttype_interface_'+postType+'\" class=\"posttype_interface\">'+
                state.postTypes[postType].ui(state)+
                '<\/div>';

            }

            // inject interface into container
            container.innerHTML = html;

            // now that we have the html, attach handlers
            for(var postType in state.postTypes){

               setOnAction(_.get('posttype_interface_'+postType));

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

        injectFromDialHome : function(resStack){

            console.log('injecting response stack from dial home...');
            console.log(resStack);

            var self = this;
            resStack.forEach(function(response){

                self.injectPost(response);

            });

        },

        injectPost : function(response){

            console.log('looking good.');
            console.log(response);

            var post_container = document.createElement('div'),
            parrent = _.get('wall_posts');

            post_container.id = 'post_container_'+response._id;
            post_container.className = "post_container";
            post_container.dataset.posttype = response.postType;

            // attach event handler
            setOnAction(post_container);

            post_container.innerHTML = ' <div class=\"post_info\"> var fromUser = \"'+response.postOwner + 
                '\", at = new Date(\"'+ response.postTime +'\"), postType = \"'+response.postType+'\";<\/div>'+

            // rest of content depends on postType
            state.postTypes[response.postType].postTemplate(response.postContent);
                                
            if(parrent.children.length > 0){
                parrent.insertBefore(post_container, parrent.children[0]);
            }

        }

    }

}());