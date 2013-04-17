var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')
, fu = require("./fu")

app.listen(process.env.PORT || 1337);
//app.listen(1337);


var clients = [ ];
var slideno = 0;
var minslide =0;
var maxslide = 0;

// hardcoded yeah
var votes = [ ];
var options = Array('Yes','No');
for (var i=0; i < options.length; i++) {
	votes.push({
		name: options[i],
		numVotes: 0
	});
}
////


function handler (req, res) {
   //remove query params
   q = req.url.indexOf('?');
   if(q != -1){root = req.url.substring(0, q);}
   else{root=req.url;}
	 //root = req.url;

		console.log("trying to load " + root);
	 
    if (root != "/" && root!="/controller"){
 
        var filename = root.replace("/","");
 
        var content_type = fu.mime.lookupExtension(fu.extname(filename));
 
        fs.readFile(filename, function(err, data) {
            if (err) {
                   
                console.log("Error loading " + filename);
            }
            else {
                var body = String(data);
               
                //body = body.replace("##PORT##",process.env.PORT);
                //body = body.replace("##IP##",process.env.IP);
                var headers = {
                    "Content-Type": content_type,
                    "Content-Length": body.length
                };
                //if (!DEBUG) headers["Cache-Control"] = "public";
 
                res.writeHead(200, headers);
                res.end(req.method === "HEAD" ? "" : body);
            }
        });
    }else{   
        fs.readFile('index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
           
            res.writeHead(200, {'Content-Type': 'text/html', "Content-Length": data.length});
            res.end(data);
        });
    }
}


io.sockets.on('connection', function (socket) {
    var index = clients.push(socket) - 1;
    socket.send(slideno);
    socket.on('message', function (data) {
       try {
            var json = JSON.parse(data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', data);
            return;
        }
				
				// this stuff should eventually live in the modules:
        if(json.module == 'presentation'){
            if(json.method == 'slidevars'){
                minslide = json.data.min;
                maxslide = json.data.max;
            }
            else if(json.method == 'moveslide'){
                if(json.data == 1 && slideno<maxslide){ slideno++;}
                else if(json.data == -1 && slideno > minslide){slideno--;}
								json.data = slideno;
								data = JSON.stringify(json);
                for (var i=0; i < clients.length; i++) {
                    
                    clients[i].send(data);
                }               
            }
        
        }
				if (json.type=='vote'){
            votes[json.data].numVotes ++;
            data = JSON.stringify({ type:'votes', data: votes });
        }        
				

    });
});

