postType.add((function(){

    return {

        postType: 'say',

        ui: function(){

            return  '<label>Say:</label>'+
                '<input id="say_input" type="text">'+
                '<input id="say_post" type="submit" value="post">';

        },
        onAction : {

            ifClass_post_container : function(){

                console.log('so this is where you could do somthing for when the post container is clicked');

            },

            ifID_say_input: function(){

                console.log('input!')

            },

            ifID_say_post: function(){
         
                var saying = _.get('say_input').value;
                
                if(saying === ''){
                    console.log('invalid say.');
                    return;
                }

                // send home new say.
                myHttp.sendWallPost(
                    {
                        postOwner: '?user', // ALERT! the post owner should always just be the logged in user, this is not needed.
                        postTo: _.get('wall_username').innerHTML, // ALERT! this can be discorvered server side as well by looking at the namespace.
                        postType: 'say',  // let the server know the posttype
                        postContent: saying
                    },

                    postType.injectPost

                    /*
                    function(response){
                        console.log('looks like it worked, not we just need to inject');
                        console.log(response);
                    }
                    */
                );
                

            }

        },
        postTemplate: function(postContent){ return '<div class="post_say"><p>' + postContent + '<\/p><\/div>';}
    }
}()));