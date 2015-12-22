/*
 *    scriptBook post interface client system
 *
 *
 *
 */

// Yes we will want a whole new client system.

/*

    * system dials back home to get wall posts

    * RATING:

        * no likes, or upvotes/downvotes, but there are "ratings"
        * ratings apply to postings
        * a rating has a value between -1, and 1
        * a rating value of 0 is the same things as unrated
        * a rating count is the number of times the post has been rated by users
        * people can rate there own posts

    * POSTS:

        * all posts:

            * avatar of the person who posted
            * timestamp
            * other relavent info (upvotes ratecount, avgrating)

        * quick canvas posts:

            * visible large thumnail image
            * invisible small thumnail
            * invisible textarea that contains the javascript of the quick canvas post
            * invisible iframe with canvas inside with id "quick_canvas"
            * invisible buttons for run/kill, hide (for starters)

            * when large thumnail is clicked/pressed visible/invisible content toggles
            * when hide button is clicked/pressed visible/invisible content toggles
             
            * run button will be presant if quick canvas has not been started
            * when run button is clicked a script element will be created, 
              the javascript will be injected into it from the textarea, and the 
              quick canvas should start.
            * once the quick canavs starts the run button will change to kill
            * once the kill button is clicked the iframe will reload.


    * site will break without javascript, but this is a sort of site where javacript will be needed anyway.

*/

(function () {

    
    var posts = document.getElementsByClassName('post_container'),

    get = function(id){ return document.getElementById(id)},

    // send a wall post
		sendPost = function (data) {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '');
			xhr.setRequestHeader('wallpost', JSON.stringify(data));

			xhr.onreadystatechange = function () {

				if (this.readyState === 4) {

					//get('query').innerHTML = this.response;
					console.log(JSON.parse(this.response));

				}

			};

			xhr.send();

		},

    quickcanvas = {

        // run of kill the quickcanvas content
        runKill : function(post,button){

            if(button.value === 'RUN'){

                button.value='KILL';
                this.runContent(post);

            }else{

                button.value='RUN';
                this.killContent(post);

            }

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

        }

    };


    // main post click/touch handler
    var postAction = function(e){
        
        console.log(e.target);

        if(e.target.className.indexOf('quickcanvas_icon_large') !== -1){

              postAction_quickcanvas_icon_large(this, e.target);

        }

        if(e.target.className.indexOf('quickcanvas_icon_small') !== -1){

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

            console.log(e.target.className);

            if(e.target.className === 'say_post'){


                var saying = this.getElementsByClassName('say_input')[0].value;

			// client side sanatation
			if (saying === '' || saying === null) {

				console.log('invalid say');

				return;

			}

			sendPost({say:saying});
            }

        });

        get('wall_newpost_quickcanvas').addEventListener('click', function(e){

            console.log(this);
            console.log(e.target.className);

           if(e.target.className === 'quickcanvas_button_runkill'){

               quickcanvas.runKill(this,e.target);

           }

           if(e.target.className === 'quickcanvas_button_post'){

               console.log('POST IT!');



               sendPost({quick:this.getElementsByClassName('quickcanvas_code')[0].value});

           }

/*
           var theQuick = document.getElementById('quick_input').value;

			// no client side sanatation!?
			
			sendPost({quick:theQuick});
*/

        });

    }());





}());



/*
(function () {

	// wrapping document.getElementById (maybe i should use jquery?)
	var get = function (id) {

		return document.getElementById(id);

	},

        // hide all the children of a given element
        hideAllChildren = function(el){

              var children = el.children,
              i=0, len = children.length;

              while(i<len){

                  // hide
                  children[i].style.display = 'none';

                  i++;
              }

        },

        // get the code span of a given quick canvas post container
        quickCanvasGetCode = function(el){

            var children = el.children,
            i=0,len=children.length;

            while(i < len){

                if(children[i].className === 'quickpost_code'){

                    return children[i];

                }

                i++;
            }

        },

        // inject the quick canvas player
        injectQuickCanvasPlayer = function(el){

            hideAllChildren(el);

            var frame = document.createElement('iframe'),
            doc,
	    canvas = document.createElement('canvas'),
	    context = canvas.getContext('2d'),
	    script = document.createElement('script'),

            codeEl = quickCanvasGetCode(el);

            frame.width = 400;
	    frame.height = 300;
	    canvas.width = 320;
	    canvas.height = 240;

            // ALERT! okay so we have a big problem with more then one id on the same canvas
            // maybe we can just have one canvas that we move around?
            // HEY THIS WILL NOT BE A PROBLEM IF THE CANVAS IS IN ITS OWN IFRAME!
            canvas.id = 'quick_canvas';

            script.innerHTML = codeEl.innerHTML;

            el.appendChild(frame);

            doc = frame.contentDocument;

            // must be a better way to style
		doc.body.style.margin = '0px';
		doc.body.style.padding = '0px';

		doc.body.appendChild(canvas);
		doc.body.appendChild(script);
           
        };

	// run button
	get('quick_run').addEventListener('click', function () {

		var frame = get('quick_iframe'),
		doc = frame.contentDocument,
		canvas = document.createElement('canvas'),
		context = canvas.getContext('2d'),
		script = document.createElement('script');

		canvas.width = 320;
		canvas.height = 240;

		context.fillStyle = '#a0a0a0';
		context.fillRect(0, 0, canvas.width, canvas.height);

		canvas.id = 'quick_canvas';

		// this seems to work in place of eval
		script.innerHTML = get('quick_input').value;

		// must be a better way to style
		doc.body.style.margin = '0px';
		doc.body.style.padding = '0px';

		doc.body.appendChild(canvas);
		doc.body.appendChild(script);

	});

	// kill button
	get('quick_kill').addEventListener('click', function () {

		var frame = get('quick_iframe');

		frame.contentWindow.location.reload();

	});

	// append event listeners to radio buttons
	(function () {

		// get the post type radio buttons
		var pt_radios = document.getElementsByName('post_type'),
		i = 0,
		len = pt_radios.length,

		// hide all post types
		hideAll = function () {

			// be sure to update this array when adding new post types
			var pt_types = ['say', 'quick'],
			i = 0,
			len = pt_types.length;

			// hide all.
			while (i < len) {
				get(pt_types[i] + '_container').style.display = 'none';
				i++;
			}

		};

		// attach events
		while (i < len) {

			// use onchange
			pt_radios[i].addEventListener('change', function (e) {

				// get the relavent container
				var pt_container = get(e.target.value + '_container');

				// hide all containers
				hideAll();

				// show relavent container
				pt_container.style.display = "block";

			})

			i++;
		}

	}
		());

	// POSTING and GETTING to server via XMLHttpRequest()
	(function () {

		// yes we will want to do this client side as well some time
		var getPosts = function () {
			
		},
		
		wallUpdate = function(){
			
			
		},
		
		// dial home and check for new additions to the wall automaticly every so often
		wallCheck = function(){
			
			setTimeout(wallCheck, 60000);
			
			console.log('preforming wall check...');
			
		},

		// send a wall post
		sendPost = function (data) {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '');
			xhr.setRequestHeader('wallpost', JSON.stringify(data));

			xhr.onreadystatechange = function () {

				if (this.readyState === 4) {

					//get('query').innerHTML = this.response;
					console.log(JSON.parse(this.response));

				}

			};

			xhr.send();

		};

		// start wall check loop
		wallCheck();
		
		// attach event for wall_post button
		get('say_post').addEventListener('click', function () {

			var saying = document.getElementById('say_input').value;

			// client side sanatation
			if (saying === '' || saying === null) {

				console.log('invalid say');

				return;

			}

			console.log({
				say : saying
			});

			sendPost({say:saying});

		});

		// attach event for wall_post button
		get('quick_post').addEventListener('click', function () {

			var theQuick = document.getElementById('quick_input').value;

			// no client side sanatation!?
			

			console.log({
				quick : theQuick
			});

			sendPost({quick:theQuick});

		});

                // attach events for all quickpost_icon's
                (function(){

                    var icons = document.getElementsByClassName('quickpost_icon'),
                    i=0,len=icons.length;

                    // attach to all on page
                    while(i < len){

                        icons[i].addEventListener('click', function(e){

                            var _id = e.target.id.replace(/post_icon_/, ''),
                            container = get('post_container_'+_id);

                            // hide all the children in the post
                            //hideAllChildren(container);

                            injectQuickCanvasPlayer(container);

                        });

                        i++;
                    }

                }());


	}());

}());

*/