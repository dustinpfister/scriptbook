/*
    /js/posttype.js
    /html/frame_quick_canvas.html

*/

postType.add((function(){

    return {

        postType: 'quickcanvas',

        ui: function(state){

            return '<div class="quickcanvas_icon_large" style="display:none;">'+
                '<img  class="quickcanvas_image_large" src="/img/no_canvas_one.png">'+
            '</div>'+
            '<div class="quickcanvas_icon_small" style="display:block;">'+
                '<img class="quickcanvas_image_small" src="/img/no_canvas_one.png">'+
            '</div>'+
            '<div class="wall_newpost_quickcanvas_content">'+
                '<textarea class="quickcanvas_code">'+
               
                // ALERT! this will work as long as there is at least one json file, and you want the first one
                JSON.parse(state.json[0].json)+

                '<\/textarea>'+
                '<iframe class="quickcanvas_iframe" scrolling="no" seamless="seamless" src="/html/frame_quick_canvas.html"></iframe>'+
            '</div>'+
            '<div class="wall_newpost_quickcanvas_controls">'+
                 '<input class="quickcanvas_button_runkill" type="button" value="RUN">'+
                 '<input class="quickcanvas_button_post" type="button" value="post">'+
             '</div>';

        },

        onAction : {

            ifClass_post_container : function(){

                console.log('okay we have something good');

            },

            ifClass_quickcanvas_image_large: function(){

                console.log('here i am');

            },

            // run kill button
            ifClass_quickcanvas_button_runkill: function(){

                console.log('run kill');

            }

        },

        postTemplate: function(postContent){ return '<p>blank<\/p>'; }
        
    }
}()));