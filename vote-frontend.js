
console.log("LOADED VOTE FRONTEND JS");


function Vote(options){
        
    /*var votes = [ ];
    //var options = Array('Yes','No');
        
    for (var i=0; i < options.length; i++) {
        votes.push({
          name: options[i],
          numVotes: 0
        });
    }*/
}

Vote.prototype.onMessage = function(json){
    if (json.type=='message'){
        //log(json.type);
        log(json.data);
    }
    
    if (json.type=='votes'){
        this.updateVotes(json.data);            
    }   
};

Vote.prototype.updateVotes = function(votes){
    
		console.log(votes);
		
    ctx.fillStyle = "#eee";
    ctx.fillRect(0,0,300,300);

    var barWidth = 300 / votes.length;
    
    var totalVotes = 0;
    for (var i=0; i < votes.length; i++) {
        totalVotes += votes[i].numVotes;
    }
		
    
    for (var i=0; i < votes.length; i++) {
    
        var pct = votes[i].numVotes / totalVotes;
        var barHeight = 300 * pct;
        document.getElementById('vote' + votes[i].name).innerHTML = votes[i].numVotes + ' (' + (pct * 100) + '%)';
    
				console.log(pct);
		
        ctx.fillStyle = colours[i];
        ctx.fillRect((i*barWidth) + 10,(300 - barHeight),barWidth - 20,barHeight);
    
    }
  
};

Vote.prototype.vote = function(option) {
    if (socket && socket.socket.connected) {
        
        socket.send(JSON.stringify({ type:'vote', data: option }));
    } else {
        log('Not connected.');
    }
};
/*
Vote.prototype.init = function(){
    var can = document.getElementById("vote-canvas");
    var ctx = can.getContext("2d");
    var colours = new Array('#FF0000','0000FF','#00FF00','FF00FF','#FFFF00','00FFFF');
    ctx.fillStyle = "#eee";
    ctx.fillRect(0,0,350,350);
   
};*/

var options = new Array ("Yes","No");
var voteExample = new Vote(options);


var can = document.getElementById("vote-canvas");
var ctx = can.getContext("2d");
var colours = new Array('#FF0000','0000FF','#00FF00','FF00FF','#FFFF00','00FFFF');
ctx.fillStyle = "#eee";
ctx.fillRect(0,0,300,300);
