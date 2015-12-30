/*
 *    scriptBook post interface client system
 *
 *
 *
 */

    var posts = document.getElementsByClassName('post_container'),

    get = function(id){ return document.getElementById(id)},

    getImageDataURL = function(img) {
        
        // Create an empty canvas element
        var canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;

        // Copy the image contents to the canvas
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        console.log(dataURL.length);

        // return the data-URL formatted image
        //return dataURL.substr(0,90000);

        //return 'the new shit'

        return dataURL;//dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    },

    postType = {
    injectpost : function(response){

        console.log(response.postType);

        // inject the post
        this['injectpost_'+response.postType](response);

    },

    injectpost_say : function(response){

        var post_container = document.createElement('div'),
        parrent = get('wall_posts');

                                //'<div id="post_container_'+response._id+'" class=\"post_container\">'+
        post_container.id = 'post_container_'+response._id;
        post_container.className = "post_container";
        post_container.addEventListener('click', postAction);

        post_container.innerHTML = ' <div class=\"post_info\"> var fromUser = \"'+response.postOwner + 
            '\", at = new Date(\"'+ response.postTime +'\");<\/div>'+
            '<div class="post_say"><p>'+response.postContent+'<\/p><\/div>';
                                
        if(parrent.children.length > 0){
            parrent.insertBefore(post_container, parrent.children[0]);
        }

    },

    injectpost_quickcanvas : function(response){

        console.log('hello');
        console.log(response.postContent);

        var post_container = document.createElement('div'),
                                parrent = get('wall_posts');

                         // '<div id="post_container_'+response._id+'" class=\"post_container\">'+
                         post_container.id = 'post_container_'+response._id;
                         post_container.className = "post_container";
                         post_container.addEventListener('click', postAction);

                                post_container.innerHTML = ' <div class=\"post_info\"> var fromUser = \"'+response.postOwner + '\", at = new Date(\"'+ response.postTime +'\");<\/div>'+

                                    //'<div class="post_say"><p>'+response.postContent+'<\/p><\/div>'

                                    '<div class=\"quickcanvas_container\">'+
                             '<div class=\"quickcanvas_icon_large\"><img class=\"quickcanvas_image_large\" src=\"'+response.postContent.thum+'\"><\/div>'+
                             '<div class=\"quickcanvas_icon_small\"><img class=\"quickcanvas_image_small\" src=\"'+response.postContent.thum+'\"><\/div>'+
                             '<div class=\"quickcanvas_content\">'+
                                 '<textarea class=\"quickcanvas_code\">'+ response.postContent.code +'<\/textarea>'+
                                 '<iframe class=\"quickcanvas_iframe\" scrolling=\"no\" seamless=\"seamless\" src=\"\/html\/frame_quick_canvas.html\"><\/iframe>'+
                             '<\/div>'+
                             '<div class=\"quickcanvas_controls\">'+
                                 '<input class=\"quickcanvas_button_runkill\" type=\"button\" value=\"RUN\">'+
                                 '<input class=\"quickcanvas_button_hide\" type=\"button\" value=\"hide\">'+
                             '<\/div>'+
                       '<\/div>';

                                if(parrent.children.length > 0){
                                    parrent.insertBefore(post_container, parrent.children[0]);
                                }

                                // bookmark: but then we need to attach the event handler!



    },

},

    quickcanvas = {

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


    // main post click/touch handler
    var postAction = function(e){
        
        console.log(e.target);

        if(e.target.className.indexOf('quickcanvas_icon_large') !== -1){

              postAction_quickcanvas_icon_large(this, e.target);

        }

        if(e.target.className.indexOf('quickcanvas_image_large') !== -1){

              postAction_quickcanvas_icon_large(this, e.target);

        }

        if(e.target.className.indexOf('quickcanvas_icon_small') !== -1){

              postAction_quickcanvas_icon_small(this, e.target);

        }

        if(e.target.className.indexOf('quickcanvas_image_small') !== -1){

              postAction_quickcanvas_icon_small(this, e.target);

        }

        if(e.target.className.indexOf('quickcanvas_button_hide') !== -1){

              postAction_quickcanvas_button_hide(this, e.target);

        }
       
        if(e.target.className.indexOf('quickcanvas_button_runkill') !== -1){

              postAction_quickcanvas_button_runkill(this, e.target);

        }

    },

    // hide large icon, run threw post, make hidden elements appear
    postAction_quickcanvas_icon_large = function(post, icon){

        quickcanvas.postToggle(post, true);

    },

    postAction_quickcanvas_icon_small = function(post, icon){
    
        // hide
        quickcanvas.postToggle(post, false);
    },

     postAction_quickcanvas_button_hide = function(post, button){
    
        // hide
        quickcanvas.postToggle(post, false);

    },

    postAction_quickcanvas_button_runkill = function(post, button){

        // run or kill content
        quickcanvas.runKill(post,button);

    };

   



    // attach to all posts
    [].forEach.call(posts, function(post){

        post.addEventListener('click', postAction);

    });


    // new post interface
    (function () {

        // get the post type radio buttons
	var pt_radios = document.getElementsByName('wall_posttype'),
	i = 0,
	len = pt_radios.length,
 
        // hide all post types
	hideAll = function () {

			// be sure to update this array when adding new post types
			var pt_types = ['say', 'quickcanvas'],
			i = 0,
			len = pt_types.length;

			// hide all.
			while (i < len) {
				get('wall_newpost_'+pt_types[i]).style.display = 'none';
				i++;
			}

		};

		// attach events
		while (i < len) {

			// use onchange
			pt_radios[i].addEventListener('change', function (e) {

				// get the relavent container
				var pt_container = get('wall_newpost_'+e.target.value);

				// hide all containers
				hideAll();

				// show relavent container
				pt_container.style.display = "block";

			})

			i++;
		}

        get('wall_newpost_say').addEventListener('click', function(e){

            if(e.target.className === 'say_post'){

                var saying = this.getElementsByClassName('say_input')[0].value;

                // client side sanatation
		if (saying === '' || saying === null) {

		    console.log('invalid say');

                    return;

                }

                //var img = new Image();
               
               // img.addEventListener('load', function(e){

               //     console.log('oh goodie');
               //     console.log(img);

                // send wall post
		myHttp.sendWallPost(
                    {
                        postOwner: '?user', // if posting from /, both the post owner, and the post page should belong to the logged in user
                        //postTo: '?user',
                        postTo:get('wall_username').innerHTML,
                        postType: 'say',
                        // postContent:saying
                        // postContent: getImageDataURL(img)
                        postContent: saying
                    },

                    // what to do with the response
                    function(response){

                        postType.injectpost_say(response);

                    }

                );

               // }); // end image load
               
              //  img.src = '/img/no_canvas_one.png';


            }

        });

        get('wall_newpost_quickcanvas').addEventListener('click', function(e){

           if(e.target.className === 'quickcanvas_button_runkill'){

               quickcanvas.runKill(this,e.target);

           }

           if(e.target.className === 'quickcanvas_button_post'){

               //var img = new Image();
               //img.src = '/img/no_canvas_one.png';

               var img = new Image();
               var self = this;
               img.addEventListener('load', function(e){

               // send wall post
	       myHttp.sendWallPost(
                   {
                       postOwner: '?user', // if posting from /, both the post owner, and the post page should belong to the logged in user
                       postTo: get('wall_username').innerHTML,
                       postType: 'quickcanvas',
                       //postContent: getImageDataURL(img)
                       //postContent: self.getElementsByClassName('quickcanvas_code')[0].value
                       postContent: {
                           thum: getImageDataURL(img),
                           code: self.getElementsByClassName('quickcanvas_code')[0].value
                       }
                      
                   },
                   function(response){

                       postType.injectpost_quickcanvas(response);                         

                   }
               );

               });

               //img.src = '/img/no_canvas_one.png';
               // ALERT! assuming that img 0 is the large one
               img.src = this.getElementsByTagName('img')[0].src;

               //console.log(this.getElementsByTagName('img')[0].src);


           }

        });

    }());
