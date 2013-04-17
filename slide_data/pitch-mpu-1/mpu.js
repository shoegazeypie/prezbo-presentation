        	
			var can;
			var ctx;
			var canX;
			var canY;
			var mouseIsDown = 0;
		
			can = document.getElementById("canvas");
			ctx = can.getContext("2d");
		 
			can.addEventListener("mousedown", mouseDown, false);
			can.addEventListener("mousemove", mouseXY, false);
			can.addEventListener("touchstart", touchDown, false);
			//can.addEventListener("touchmove", touchXY, true);
			can.addEventListener("touchend", touchUp, false);
		 
			document.body.addEventListener("mouseup", mouseUp, false);
			document.body.addEventListener("touchcancel", touchUp, false);
			
			 
			function mouseUp() {
				mouseIsDown = 0;
				mouseXY();
			}
			 
			function touchUp() {
				mouseIsDown = 0;
			}
			 
			function mouseDown() {
				mouseIsDown = 1;
				mouseXY();
			}
			 
			function touchDown() {
				mouseIsDown = 1;
				touchXY();
			}
			 
			function mouseXY(e) {
				if (!e) var e = event;
				canX = e.pageX - can.offsetLeft;
				canY = e.pageY - can.offsetTop;
                
                if (mouseIsDown){
                    checkCollisions(canX, canY);
                    
                }
                
			}
			 
			function touchXY(e) {
				if (!e) var e = event;
				e.preventDefault();
				canX = e.targetTouches[0].pageX - can.offsetLeft;
				canY = e.targetTouches[0].pageY - can.offsetTop;
                checkCollisions(canX, canY);
			}

            function checkCollisions(x,y){
                var i = 0;
                while (i < world.length)
    			{
                    xDist = Math.abs(x - world[i].x);
                    yDist = Math.abs(y - world[i].y);
                    if (xDist < ((world[i].mySprite.width * world[i].s)) && yDist < ((world[i].mySprite.height * world[i].s))){
                        world[i].kill = 1; 
                        world[i].yspeed = -world[i].yspeed;
                        //pop1.load();
                        pop1.play();
                        redProb += 0.001;
                    }
				    ++i;
				}
            }

		//	function init(){
    		    var world = new Array();
				var current = 0;
				var redC = 100;
				var redProb = 0.01;
				var bonusC = 10;
				var bonusProb = 0.005;
				var invaderC = 22;
				var xacc = 0;
				var yacc = 0;
				var yscroll = -5;
				var numBlobs = 0;
    		    var redProb = 0.02;
                var bridge = new Sprite("slide_data/pitch-mpu-1/img/bridge.png");
                var logo = new Sprite("slide_data/pitch-mpu-1/img/pitch_logo.png");
                var pop = new Sprite("slide_data/pitch-mpu-1/img/ballon_grey_pop.png");

		//}
                //var pop1 = document.getElementById('pop1');
                //pop1.load();
                /*pop1.ended = function(){
                    this.stop();    
                    this.currentTime = 0;
                    alert("!");
                }*/
  


            function Sprite(filename){
                this.mySprite = loadSprite(filename);
            }

			function animate()
			{
				if (Math.random() <= redProb)
				{
					addBalloon(1);
				}
			}

			function addBalloon(numBalloons)
			{
				var i=0;
				while(i < numBalloons){				
					var type = "grey_" + Math.ceil(Math.random() * 4);
					var p = new Balloon(type,'',1);
           
					world.push(p); 
					i++;
				}
        console.log("world length : " + world.length);
			}
			
			function render()
			{
				var i = 0;
				ctx.fillStyle = '#ebece6';
				ctx.fillRect(0,0,300, 300);
				ctx.fillStyle = '#000';
                drawSprite(logo.mySprite, 180, 120, 0, 1);
				while (i < world.length)
				{
                    var xPos = world[i].x +  world[i].wiggle;
                    if(!world[i].kill){
				        drawSprite(world[i].mySprite, xPos, world[i].y, 0, world[i].s);
                    }else{
                        drawSprite(pop.mySprite, xPos, world[i].y, 0, world[i].s);
                        world[i].kill ++;
                        if (world[i].kill > 10){
                            world[i].dead = true;
                        }
                    }
                	++i;
				}
                drawSprite(bridge.mySprite, 180, 319, 0, 1);
	
			}
			
			function move()
			{
				var i = 0;
				while (i < world.length)
				{
				
					var p = world[i];
				
                    p.wiggleOffset += p.wiggleIncrement;
                    p.wiggle = p.wiggleWidth*(Math.sin(world[i].wiggleOffset));
                    p.xspeed += xacc;
					//p.yspeed += yacc;
                    p.x += p.xspeed;
					p.y += p.yspeed;

                    p.xspeed *= 0.95;
                    if (p.x < 0){
                        p.xspeed = -p.xspeed * p.bounce;
                        p.x=0;
					}else if(p.x > 300){
			            p.xspeed = -p.xspeed * p.bounce;
            			p.x=300;
					}

					if (p.type == 'blob')
					{	
            			var lc = p.life;
						var j=1;
				
        				if (p.y < 0){
    					  p.yspeed = -p.yspeed * p.bounce;
    					  p.y=0;
    					}else if(p.y > 300){
    					
    					  p.yspeed = -p.yspeed * p.bounce;
    					  p.y=300;
    					}
    					if (p.y < 0 || p.y > 300){
    					  p.yspeed = -p.yspeed;
    					}
                        
					}else
					{
			
						if (p.y < -100)
						{
							p.dead = true;
						}
					}
					
					if (p.dead == true)
					{
						if (p.type=='blob')
						{
							numBlobs--;
						}
						world.splice(i, 1);
						i--;
					}

					i++;
				}
			}


			
			function run()
			{
					animate();
					move();
					render();
					setTimeout(run, 30);
	
			}
			//init();
			addBalloon(2);
            //var p = new Balloon('red_1','http://www.google.com',4);
            //world.push(p);
			run();
			
			
			function var_dump(obj) {
				 if(typeof obj == "object") {
						return "Type: "+typeof(obj)+((obj.constructor) ? "\nConstructor: "+obj.constructor : "")+"\nValue: " + obj;
				 } else {
						return "Type: "+typeof(obj)+"\nValue: "+obj;
				 }
			}//end function var_dump

			window.ondeviceorientation = function(event) {
								
				xacc = event.gamma / 100;
				yacc = event.beta / 100;

			}