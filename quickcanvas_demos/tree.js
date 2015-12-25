// Christmas Tree Quick Canvas Demo

(function(){

    // get references to the canvas and canvas context
    var canvas = document.getElementById('quickcanvas_canvas'),
    context = canvas.getContext('2d'),
	
    // lights
    lights = {
		
        lights : [],
		
        generate : function(){
			
            this.lights = [];
			
            var l=0, lLen = 100;
            while(l < lLen){
			
                this.lights.push({
					
                    x: Math.floor( Math.random() * (320-5) ),
                    y: Math.floor( Math.random() * (320-5) ),
                    w: 5,
                    h: 5,
                    onTree: false
					
					
                });
				
                l++;
            }
					
        }
		
    },
	
    // draw lights ( after drawing tree )
    lightDraw = function(ctx){
		
        var l = 0, lLen = lights.lights.length, currentLight, imgData, px, pxLen;
		
        while(l < lLen){
		
            currentLight = lights.lights[l];

            imgData = context.getImageData(currentLight.x,currentLight.y,currentLight.w,currentLight.h);

            px = 0; pxLen = imgData.data.length;

            while(px < pxLen){

                var color = [].slice.call(imgData.data, px, px+4);
                if(color[1] > 0 && color[0] === 0 && color[2] === 0){

                    currentLight.onTree = true;
                    break

                }

                px += 4;

            }
        
            ctx.fillStyle = currentLight.onTree ? '#ffff00' : '#222222';
            ctx.fillRect(currentLight.x,currentLight.y,currentLight.w,currentLight.h);
		
		
            l++;
		
        }
		
    },
	

    // start will be called once before running main loop
    start = function(){

        // generate lights
        lights.generate();
	
        loop();

    },

    // what to do on each frame tick
    update = function(){

        lights.generate();
    },

    // what to draw to canvas
    draw = function(ctx){

        // background
        ctx.fillStyle='#000000';
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // draw tree
        ctx.beginPath();

        ctx.moveTo(170,230);

        ctx.lineTo(150, 230);
        ctx.lineTo(150, 180);
        ctx.lineTo(60, 180);
        ctx.lineTo(120, 130);
        ctx.lineTo(80, 130);
        ctx.lineTo(130, 80);
        ctx.lineTo(110, 80);
        
        ctx.lineTo(160,10);

        ctx.lineTo((160-110 + 160), 80);
        ctx.lineTo(160 - 130 + 160, 80);
        ctx.lineTo(160 - 80 + 160, 130);
        ctx.lineTo(160 - 120 + 160, 130);
        ctx.lineTo(160 - 60 + 160, 180);
        ctx.lineTo(160-150+160, 180);
        ctx.closePath();
        
        ctx.stroke();

        ctx.fillStyle="#00af00";
        ctx.fill();

	// draw lights	
        lightDraw(ctx);
    },


    lastUpdate = new Date(),
    // main app loop
    loop = function(){

        requestAnimationFrame(loop);

        if(new Date() - lastUpdate >= 200){
            update();
            draw(context);
            lastUpdate = new Date();
        }

    };

    // start it (click run button to start this demo)
    start();
    

}());
                    