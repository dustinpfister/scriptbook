/*
 *    scriptBook post interface client system
 *
 *
 *
 */

(function () {

	// wrapping document.getElementById (maybe i should use jquery?)
	var get = function (id) {

		return document.getElementById(id);

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

	}
		());

}
	());
