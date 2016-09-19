(function($) {
	var SlippageLoad = function(obj) {
		console.log("Class Name:SlippageLoad | Version:1.0 | Write By:Fengzi_tan");
		obj = obj && typeof(obj) == 'object' && obj || {};
		this.params = $.extend({
			'time': 300, 		//	动画时间
			'state': 0, 		//	1：动画后加载页面，0：动画前加载页面
			'url': '' 			//	加载页面地址
		}, obj);
		this.clientWidth = this.params.width || $(window).width();
		this.clientHeight = this.params.height || $(window).height();
		this.delay = this.params.delay||0;
		this.parentNode = this.params.parent || $('body');
		this.hideNode = $(this.params.hide) || $('#panle');
		this.loading = this.params.loading || $('<div class="loading">');
		this.structNode = $('<div class="slide-in">');
		this.iframe = $('<iframe>');
		this.render();
		this.init();
	}

	SlippageLoad.prototype = {
		init: function() {
			var self = this;
			this.loading.show();
			if (this.params.state) {
				this.animate(self, self.load);
			} else {
				this.load(self, self.animate);
			}
		},
		render: function() {
			var clientWidth = this.clientWidth,
				clientHeight = this.clientHeight,
				parentNode = this.parentNode,
				commoncss = {
					'width': clientWidth + 'px',
					'height': clientHeight + 'px',
					'position': 'fixed',
					'top': 0,
					'left': 0
				},
				structNode = this.structNode;
			this.loading.css($.extend({}, commoncss, {
				'background-color': 'rgba(0,0,0,.3)',
				'z-index': '10001'
			})).hide().append($('<div>').css({
				'width': '36px',
				'height': '36px',
				'position': 'absolute',
				'top': '50%',
				'left': '50%',
				'margin-top': '-18px',
				'margin-left': '-18px',
				'color': '#10a0ea',
				'text-align': 'center',
				'font-size': '26px',
				'line-height': '36px'
			}).append($('<i class="fa fa-spinner fa-pulse">'))).appendTo(parentNode);
			structNode.css($.extend({}, commoncss, {
				'z-index': '9999',
				'left': '100%',
				'background-color': 'rgba(0,0,0,0)'
			})).hide().appendTo(parentNode);
			this.iframe.css($.extend({}, commoncss, {
				'position': 'absolute',
				'z-index': '9999'
			})).attr({
				'frameborder': '0',
				'scrolling': '0'
			}).appendTo(structNode);
		},
		animate: function(self, fun) {
			var callback = fun && typeof(fun) == 'function' && fun || function() {};
			self.structNode.show().animate({
				'left': 0
			}, self.params.time, function(){
				self.hideNode.fadeOut();
				callback(self);
			});
		},
		load: function(self, fun) {
			var callback = fun && typeof(fun) == 'function' && fun || function() {};
			self.iframe.attr('src', this.params.url);
			self.iframe.on('load', function() {
				if(self.delay){
					window.setTimeout(function(){
						self.loading.remove();
						callback(self);
					},self.delay)
				}else{
					self.loading.remove();
					callback(self);	
				}
			});
		}
	}
	window['SlippageLoad'] = SlippageLoad;
})(jQuery);