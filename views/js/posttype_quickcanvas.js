/*
    /js/posttype.js
    /html/frame_quick_canvas.html

*/

postType.add((function(){

    var quickcanvas = {

        // run of kill the quickcanvas content
        runKill : function(post,button){

            if(button.value === 'RUN'){

                button.value='KILL';
                this.runContent(post);

            }else{

                button.value='RUN';

               // get incon from iframe
                this.getIcon(post);   
                this.killContent(post);

            }

        },

        getIcon : function(post){

            var icon = post.getElementsByClassName('quickcanvas_iframe')[0].contentWindow.document.getElementById('icon'),
            img, container;

            // make large icon
            img =  new Image();
            img.src = icon.src;
            img.className = 'quickcanvas_image_large';
            img.width = 320;
            img.height = 240;       

            container = post.getElementsByClassName('quickcanvas_icon_large')[0];
            container.innerHTML = ''; 
            container.appendChild(img);

            // make small icon
            img =  new Image();
            img.src = icon.src;
            img.className = 'quickcanvas_image_small';
            img.width = 64;
            img.height = 64;       

            container = post.getElementsByClassName('quickcanvas_icon_small')[0]; 

            container.innerHTML = '';
            container.appendChild(img);

        },


        // run quick canvas content
        runContent : function(post){

            var code = post.getElementsByClassName('quickcanvas_code')[0].value,
            frame = post.getElementsByClassName('quickcanvas_iframe')[0],
            script = document.createElement('script'),
            doc = frame.contentDocument;

            script.innerHTML = code;
            
            doc.body.appendChild(script);

            console.log(doc.body);

        },

        // kill quick canvas content
        killContent : function(post){

            console.log('okay kill it');
            post.getElementsByClassName('quickcanvas_iframe')[0].contentWindow.location.reload();
        },

        // toggle a quickcanvas post from large icon state to interface, or back
        postToggle : function(post, open){

            // get the quickcanvas container
            var quickEl = post.getElementsByClassName('quickcanvas_container')[0];

            // run threw elements
            [].forEach.call(quickEl.children, function(child){
          
                var large = child.className.indexOf('quickcanvas_icon_large') === -1 ;

                if(!open){
                    large = !large;
                } 

                // show all but large icon
                if(large){
                    child.style.display = 'block';
                }else{

                    child.style.display = 'none';

                }
            });

        },

        updateIcon : function(iframe){

            console.log(iframe);

        }

    };

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
            ifClass_quickcanvas_button_runkill: function(e, post, target){

                console.log('run kill');
                console.log(post);
                console.log(target);
                quickcanvas.runKill(post,target);

            },

            // post button
            ifClass_quickcanvas_button_post: function(){

            }

        },

        postTemplate: function(postContent){ return '<p>blank<\/p>'; }
        
    }
}()));