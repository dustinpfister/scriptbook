/*
    /js/posttype.js
    /html/frame_quick_canvas.html

*/

postType.add((function(){

    return {

        postType: 'quickcanvas',

        ui: function(){

            return '<p>please make an interface for this posttype<\/p>';

        },

        onAction : {

            ifClass_post_container : function(){

                console.log('okay we have something good');

            },

            ifClass_quickcanvas_image_large: function(){

                console.log('here i am');

            }

        },

        postTemplate: function(postContent){ return '<p>blank<\/p>'; }
        
    }
}()));