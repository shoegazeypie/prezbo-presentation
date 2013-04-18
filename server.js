var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')
, crypto = require('crypto')
, PATH = require('path');

app.listen(process.env.PORT || 1337);

    
var MIME_TYPES = {

    '.txt': 'text/plain',
	'.md': 'text/plain',
	'': 'text/plain',
	'.html': 'text/html',
	'.css': 'text/css',
	'.js': 'application/javascript',
	'.json': 'application/json',
	'.jpg': 'image/jpeg',
	'.png': 'image/png',
	'.gif': 'image/gif'

};
	
var CONFIG = {
	
	'site_base': '.',
	
	'file_expiry_time': 480, // HTTP cache expiry time, minutes
	
	'directory_listing': true

};

var EXPIRY_TIME = (CONFIG.file_expiry_time * 60).toString();


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
    var headers;
    var etag;
	
	if ( req.method === 'GET' ){
//		Get response object
		handleRequest( req.url, function ( response_object ){
			if ( response_object.data && response_object.data.length > 0 ){
				etag = response_object.getEtag();
				if ( req.headers.hasOwnProperty('if-none-match') && req.headers['if-none-match'] === etag ){
//					Not Modified
					res.writeHead( 304 );
					res.end();
				}
				else {
					headers = {
						'Content-Type': response_object.type,
						'Content-Length' : response_object.data.length,
						'Cache-Control' : 'max-age=' + EXPIRY_TIME,
						'ETag' : etag
					};
					res.writeHead( response_object.status, headers );
					res.end( response_object.data );
				}
			}
			else {
				res.writeHead( response_object.status );
				res.end();
			}
		} );
	}
	else {
//		Forbidden
		res.writeHead( 403 );
		res.end();
	}
}

// Filter server requests by type

function handleRequest( url, callback ){
  console.log("handleRequest " + url);
  
	//remove query params
  var q = url.indexOf('?');
  if(q != -1){url = url.substring(0, q);}
	
	if ( url  === '/' ){
		getFileResponse( '/goaway.html', function ( response_object ){
			callback( response_object );
		} );
	}
	else if ( PATH.extname( url ) === '' ){
		getFileResponse( '/index.html', function ( response_object ){
			callback( response_object );
		} );
	}
	else {
		getFileResponse( url, function ( response_object ){
			callback( response_object );
		} );
	}

}

// Creates a ResponseObject from a local file path

function getFileResponse( path, callback ){

    

//    console.log("getFileResponse " + path);
  path = CONFIG.site_base + path;

    console.log("getFileResponse " + path);

	PATH.exists( path, function ( path_exists ){
		if ( path_exists ){
            console.log("exists");
			fs.readFile( path, function ( error, data ){
				if ( error ){
//					Internal error
					callback( new ResponseObject( {'data': error.stack, 'status': 500} ) );
				}
				else {
					callback( new ResponseObject( {'data': new Buffer( data ), 'type': MIME_TYPES[PATH.extname(path)]} ) );
				}
			} );
		}
		else {
            console.log("not found");
//			Not found
			callback( new ResponseObject( {'status': 404} ) );
		}
	} );

}

// An object representing a server response

function ResponseObject( metadata ){

    this.status = metadata.status || 200;
	this.data = metadata.data || false;
	this.type = metadata.type || false;

}

ResponseObject.prototype.getEtag = function (){
    var hash = crypto.createHash( 'md5' );
	hash.update( this.data );
	return hash.digest( 'hex' );
};



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
				console.log(json);
				if (json.type=='vote'){
            votes[json.data].numVotes ++;
            data = JSON.stringify({ module:'vote', method:'updatevotes', data: votes });
						for (var i=0; i < clients.length; i++) {
								
								clients[i].send(data);
						}   
        }        
				

    });
});

