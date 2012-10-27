// JavaScript Document

var flashwindow = Class.create();	
flashwindow.prototype = {
	swf : null,
	src : null,
	vars : null,
	pagePosition : {
		x : 0,
		y : 0
	},
	pageDimensions : {
		width : null,
		height : null
	},
	browserDimensions : {
		width : null,
		height : null
	},
	
	initialize : function($swf, $src, $vars) {
		this.swf = $swf;
		this.src = $src;
		this.vars = $vars;
		this.toggleTroubleElements('hidden');
		this.getScroll();
		this.getPageDimensions();
		this.getBrowserDimensions();
		this.convertPaths();
		this.create();
		this.display('block', 'visible');		
	},
	
	create : function() {	
		var overlay = Element.extend(window.top.document.createElement('div'));					
		overlay.setAttribute('id', 'flashwindow_overlay');
		
		var fw = window.top.document.createElement('div');
		fw.setAttribute('id', 'flashwindow');
		
		var body = window.top.document.getElementsByTagName('body')[0];
		body.appendChild(overlay);
		overlay.appendChild(fw);

		Element.setStyle(overlay, {position:'fixed', top:'0px', left:'0px',	width:'100%', height:'100%', zIndex: '999', overflow:'visible'});
		
		var add = "background_width:\'" + this.browserDimensions.width + "\',background_height:\'" + this.browserDimensions.height + "\'"
		this.vars = this.vars.substr(0,this.vars.length-1);
		if (this.vars.length > 2) this.vars = this.vars+","+add+"}"
		else this.vars = "{"+add+"}";
	
		var flashvars = {};
		flashvars.src  = this.src;
		flashvars.vars = this.vars;		
		
		var params = {};
		params.quality = "high";
		params.wmode = "transparent";
		params.scale = "noscale";
		params.salign = "lt";		
		
		var attributes = {};
		attributes.id = "FlashPopupWindow";
		attributes.name = "FlashPopupWindow";
		if (window.top != window) swfobject.setWindow(window.top);
		swfobject.embedSWF(this.swf, "flashwindow", this.browserDimensions.width, this.browserDimensions.height, "9.0.0","expressInstall.swf", flashvars, params, attributes);		
	},
	
	
	display : function(display, visibility) {
		var overlay = window.top.document.getElementById("flashwindow_overlay");
		overlay.style.display = display;
		overlay.style.visibility = visibility;		
	},	
	
	deactivate : function(){		
		this.display('none', 'visible');
		this.toggleTroubleElements('visible');
		var overlay = window.top.document.getElementById("flashwindow_overlay");
		Element.remove(overlay);
	},
	
	toggleTroubleElements : function(visibility){		
		var iframes = window.top.document.getElementsByTagName('iframe');
		for (i = 0; i != iframes.length; i++) {
			iframes[i].style.visibility = visibility;
		}
	},	
	
	getScroll : function(){
      	if(typeof(window.top.pageYOffset) == 'number') {
        	this.pagePosition.x = window.top.pageXOffset;
        	this.pagePosition.y = window.top.pageYOffset;
      	} else if(window.top.document.body && (window.top.document.body.scrollLeft || window.top.document.body.scrollTop)) {
	       	this.pagePosition.x = window.top.document.body.scrollLeft;
        	this.pagePosition.y = window.top.document.body.scrollTop;
		} else if(window.top.document.documentElement) {
        	this.pagePosition.x = window.top.document.documentElement.scrollLeft;
        	this.pagePosition.y = window.top.document.documentElement.scrollTop;
      	}
	},
	
	getPageDimensions : function() {
		var xScroll, yScroll;
		if (window.top.innerHeight && window.top.scrollMaxY) {	
			xScroll = window.top.document.body.scrollWidth;
			yScroll = window.top.innerHeight + window.top.scrollMaxY;
		} else if (window.top.document.body.scrollHeight > window.top.document.body.offsetHeight){ 
			xScroll = window.top.document.body.scrollWidth;
			yScroll = window.top.document.body.scrollHeight;
		} else { 
			xScroll = window.top.document.body.offsetWidth;
			yScroll = window.top.document.body.offsetHeight;
		}

		var windowWidth, windowHeight;
		if (self.innerHeight) {	
			windowWidth = self.innerWidth;
			windowHeight = self.innerHeight;
		} else if (window.top.document.documentElement && window.top.document.documentElement.clientHeight) { 
			windowWidth = window.top.document.documentElement.clientWidth;
			windowHeight = window.top.document.documentElement.clientHeight;
		} else if (window.top.document.body) { 
			windowWidth = window.top.document.body.clientWidth;
			windowHeight = window.top.document.body.clientHeight;
		}	

		if(yScroll < windowHeight){
			this.pageDimensions.height = windowHeight;
		} else { 
			this.pageDimensions.height = yScroll;
		}

		if(xScroll < windowWidth){	
			this.pageDimensions.width = windowWidth;
		} else {
			this.pageDimensions.width = xScroll;
		}
	},
	
	getBrowserDimensions : function() {
		if (Prototype.Browser.IE) {
            this.browserDimensions.height = window.top.document.documentElement.clientHeight;			
            this.browserDimensions.width = window.top.document.documentElement.clientWidth;   
        } else {
            this.browserDimensions.height = window.top.innerHeight;
            this.browserDimensions.width = window.top.document.width || window.top.document.body.offsetWidth;
        }
	},
	
	convertPaths : function() {
		if (this.swf.indexOf("http:") == -1) this.swf = absPath(this.swf);
		var src = this.src;
		var src_abs = "", path = "", abs_path = "", b = 0, e = 0, i = 0;
		while (b != 4) {
			b = src.indexOf("img:\'", i) + 5;
			if (b != 4) {
				e = src.indexOf("\'", b);
				path = src.substring(b, e);
				if (path.indexOf("http:") == -1) abs_path = absPath(path)
				else abs_path = path;
				src_abs = src_abs + src.substring(i, b) + abs_path;				
				i = e;
			}
		}	
		src_abs = src_abs + src.substring(i, src.length);
		this.src = src_abs;
	}
}

var FlashPopupWindow = null;
function openFlashWindow($swf, $src, $vars) {
	FlashPopupWindow = new flashwindow($swf, $src, $vars);
}
function closeFlashWindow() {
	FlashPopupWindow.deactivate();
}
function absPath($url){
	var Loc = location.href;	
	Loc = Loc.substring(0, Loc.lastIndexOf('/'));
	while (/^\.\./.test($url)){		 
		Loc = Loc.substring(0, Loc.lastIndexOf('/'));
		$url= $url.substring(3);
	}
	return Loc + '/' + $url;
}