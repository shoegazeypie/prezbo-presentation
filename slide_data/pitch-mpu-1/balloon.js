function Balloon(type, url, size){

    this.balloonType = type;
    

    this.x = Math.random() * 350;
	this.y = 380;
	this.s = size;
	this.t = 1;
	this.attraction = 1;
    this.kill = 0;
    this.dead = false;
    this.bounce = 0.9;
    this.xspeed = 0;
	this.yspeed = (Math.random() * -2);
    this.wiggle = 0;
    this.wiggleOffset = 0;
    this.wiggleWidth = (Math.random() * (5 * -this.yspeed)) + 5;
    this.wiggleIncrement = (Math.random() / 5);
    this.url = url;
 
    this.mySprite = loadSprite("slide_data/pitch-mpu-1/img/ballon_" + this.balloonType + ".png");

    

}

Balloon.prototype.onClick = function(evt) {
  alert("click");
};
