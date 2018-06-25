var logProxy = require("debug")("kefu:proxy");
var logBypass = require("debug")("kefu:bypass");
var logErr = require("debug")("kefu:error");
var httpProxy = require("http-proxy");

var proxy = httpProxy.createProxyServer();
var proxies = {};


proxy.on("error", function(e){
	logErr(e);
});

function hasOwnProperty(obj, key){
	return Object.prototype.hasOwnProperty.call(obj, key);
}

module.exports = function(app){
	var pattern;
	var ps;
	var method;
	var processor;

	// mock
	for(pattern in proxies){
		if(hasOwnProperty(proxies, pattern)){
			ps = proxies[pattern];
			for(method in ps){
				if(hasOwnProperty(ps, method)){
					processor = ps[method];
					logProxy(method, pattern);
					app[method](pattern, processor);
				}
			}
		}
	}

};
