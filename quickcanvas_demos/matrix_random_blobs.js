// Matrix Random Blobs

(function () {

	// get references to the canvas and canvas context
	var canvas = document.getElementById('quickcanvas_canvas'),
	context = canvas.getContext('2d'),

	// distance formula
	distance = function (x1, y1, x2, y2) {

		// return the distance between the two points
		return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

	},

	// the matrix object
	matrix = {

		width : 32,
		height : 24,
		blobCount : 10,
		cells : [],
		blobs : [],

		// set cell size based on the given canvas
		setCellSize : function (canvas) {

			this.cellWidth = canvas.width / this.width;
			this.cellHeight = canvas.height / this.height;

		},

		// setup blobs based on relavent matrix values
		setBlobs : function () {

			var i = 0, colors = ['r','g','b'];

			this.blobs = [];

			while (i < this.blobCount) {

				this.blobs.push({

					color : colors[ Math.floor(Math.random()*3) ],
					size : 4 + Math.floor(Math.random()*8),
					x : Math.floor(Math.random()*this.width),
					y : Math.floor(Math.random()*this.height)

				});

				i++;

			}

		},

		// draw the matrix to the given context
		draw : function (ctx) {

			var i = 0,
			len = this.cells.length,
			x,
			y,
			c;
			while (i < len) {

				c = this.cells[i];
				x = i % this.width;
				y = Math.floor(i / this.width);

				ctx.fillStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',1)';
				ctx.fillRect(x * this.cellWidth, y * this.cellHeight, this.cellWidth, this.cellHeight);

				i++;
			}

		},

		// set up or clear the cells
		setupCells : function () {

			this.cells = [];

			var i = 0,
			len = this.width * this.height;
			while (i < len) {

				this.cells.push({
					r : 0,
					g : 0,
					b : 0
				});

				i++;
			}

		},

		// set cells to random colors
		randomColors : function () {

			this.cells = [];

			var i = 0,
			len = this.width * this.height;
			while (i < len) {

				this.cells.push({
					r : 0, // Math.floor(Math.random()*256),
					g : Math.floor(Math.random() * 256),
					b : 0 //Math.floor(Math.random()*256)
				});

				i++;
			}

		},

		// set cells to the the current blob values
		setToBlobs : function () {

			var cell,
			x,
			y,
			cellI = 0,
			cellLen = this.cells.length,
			blob,
			blobI,
			blobLen = this.blobs.length;

			this.setupCells();

			cellI = 0;
			cellLen = this.cells.length;

			// loop threw cells
			while (cellI < cellLen) {

				cell = this.cells[cellI];
				x = cellI % this.width;
				y = Math.floor(cellI / this.width);

				// loop threw blobs
				blobI = 0;
				while (blobI < blobLen) {

					blob = this.blobs[blobI];

					var d = distance(x, y, blob.x, blob.y);

					if (d <= blob.size) {
						cell[blob.color] += 255 - Math.floor(255 * (d / blob.size));
					}

					if (cell[blob.color] > 255) {
						cell[blob.color] = 255;
					}

					blobI++;
				}

				cellI++;
			}

			console.log('cells:');
			console.log(this.cells[0]);

		},

		setup : function (canvas) {

			this.setCellSize(canvas);

			this.setBlobs();
			//this.randomColors();

			this.setToBlobs();

		}

	},

	// start will be called once before running main loop
	start = function () {

		matrix.setup(canvas);

		loop();

	},

	// what to do on each frame tick
	update = function () {

		//matrix.setToBlobs();

               matrix.setBlobs();
			
			matrix.setToBlobs()

	},

	// what to draw to canvas
	draw = function (ctx) {

		// background
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		matrix.draw(ctx);

	},

	lt = new Date(),

	// main app loop
	loop = function () {

		requestAnimationFrame(loop);

		if (new Date() - lt >= 1000) {
			update();
			draw(context);
			lt = new Date();
		}

	};

	// start it (click run button to start this demo)
	start();

}
	());
