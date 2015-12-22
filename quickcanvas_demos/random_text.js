// Random Text Quick Canvas Demo
(function(gl){
    
    // get reference to canvas, and canvas 2d context
    var canvas = document.getElementById('quickcanvas_canvas'),
    context = canvas.getContext('2d'),

    // some variables outside the scope of the update function 
    says = [],
    sayRate = 100,
    lastSay = new Date(),

    // start will be called once before running main loop
    start = function(){
        
        loop(); // start main loop

    },

    // update: what to do on each frame tick
    update = function(){

        // inject a new say into the says array if enough time went by
        if(new Date() - lastSay >= sayRate){

            // shift out any old say
            if(says.length >= 10){
                says.shift();
            }

            // push in a new say
            says.push({
                say: '<%= scriptBook %>',
                x: Math.random()*320,
                y: Math.random()*240,
                color: 'yellow'
            });

            // rest the clock
            lastSay = new Date();

        }

    },

    // what to draw to canvas
    draw = function(ctx){

        // draw background
        ctx.fillStyle='black';
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // draw say's
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = '15px arial';

        says.forEach(function(say){
           
            ctx.fillStyle = 'white';
            if(say.color){
                ctx.fillStyle = say.color;
            }

            ctx.fillText(say.say,say.x,say.y);

        });        

    },

    // main app loop
    loop = function(){

        requestAnimationFrame(loop);

        update();
        draw(context);

    };

    // start it (click run button to start this demo)
    start();
    
}(this));
                    