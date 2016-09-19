(function($) {
	var SlippageUnload = function(obj) {
		console.log("Class Name:SlippageUnload | Version:1.0 | Write By:Fengzi_tan");
		obj = obj && typeof(obj) == 'object' && obj || {};
		this.params = $.extend({
			'show': 'panle', 				//	需要重新展示的父级div的id
			'remove': 'slide-in', 			//	移除自身的class
			'time': 300 					//	移除动画时间
		}, obj);
		this.cover = $('<div id="cover">');
		this.clientWidth = this.params.width || $(window).width();
		this.clientHeight = this.params.height || $(window).height();
		this.parentNode = this.params.parent || $('body');
		this.ancestralNode = this.params.ancestral || $('body', window.parent.document);
		this.removeNode = this.params.removeparent || $('.' + this.params.remove, window.parent.document);
		this.showNode = this.params.showparent || $('#' + this.params.show, window.parent.document);
		// this.render();
		this.init();
	}

	SlippageUnload.prototype = {
		render: function() {
			this.cover.css({
				'position': 'fixed',
				'display': 'block',
				'width': this.clientWidth,
				'height': this.clientHeight,
				'background-color': 'rgba(0,0,0,.5)',
				'top': 0,
				'left': 0,
				'z-index': 9997
			}).hide().appendTo(this.ancestralNode);
		},
		init: function() {
			// this.cover.show();
			this.animate();
		},
		animate: function() {
			var self = this;
			self.showNode.show();
			this.removeNode.animate({
				'margin-left': -this.clientWidth
			}, this.params.time, function() {
				// self.cover.remove();
				self.removeNode.remove();
			});
		}
	}

	window['SlippageUnload'] = SlippageUnload;
})(jQuery);