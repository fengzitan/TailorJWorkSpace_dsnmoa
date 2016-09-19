var LatestFrameYOffset = 0;
/* 数据加载动效输出 */
/**
 * *showLoadingMask(CONTEXT)  调用方式：
 *
 *1.传入结构体参数。
 *showLoadingMask({
 *	showtime: 3000,			//可选，默认：5000，  单位毫秒;关闭按钮展现时间。
 *	callback: function(){},	//可选，回调函数，默认：function(){return fasle}
 *  paras: new object(),				//可选，回调函数参数，默认：{}
 *	context：$(window)		//可选，原先的传入值，上下文Document对象，默认：undefined
 *})
 *
 *2.传入回调函数（可选），默认：function(){return false};此时关闭按钮展现时间默认。
 *showLoadingMask(callback);
 *
 *3.传入数字参数（可选），默认5000
 *showLoadingMask(time);
 *
 *4.保留原先的调用方式，此时关闭按钮展现时间、回调函数默认。
 *showLoadingMask(context);
 */
function showLoadingMask(CONTEXT) {
	var context;
	if ($.isPlainObject(CONTEXT)) {
		context = CONTEXT.context;
	}else if(CONTEXT && typeof(CONTEXT)==='function'){
		context = null;
	}else if(CONTEXT && typeof(CONTEXT)==='number'){
		context = null;
	}else if(CONTEXT && CONTEXT.constructor.toString().indexOf("HTMLDocument") > -1){
		context = CONTEXT;
	}else if(CONTEXT && CONTEXT.addClass){
		context = CONTEXT;
	}else if(!CONTEXT){
		context = null;
	} else {
		throw ('参数错误');
		return false;
	}
	var showtime = CONTEXT && typeof(CONTEXT)==='number' && CONTEXT || $.isPlainObject(CONTEXT) && CONTEXT.showtime || 5000;
	var callback = CONTEXT && typeof(CONTEXT)=='function' && CONTEXT || $.isPlainObject(CONTEXT) && CONTEXT.callback || function(){return false};
	if (isLoadingMaskShown(context)) {
		return;
	}
	var splash = $("<div/>");
	splash.addClass("spinner-layout");
	LatestFrameYOffset = $(window).scrollTop();
	splash.css("top", LatestFrameYOffset + "px");
	
	var close = $('<div>').hide();
	close.addClass("load-close");
	var icon = $("<div/>");
	icon.addClass("load-close-icon");
	icon.appendTo(close);
	close.appendTo(splash);
	
	var c = $("<div/>");
	c.addClass("container");
	var wheel = $("<div/>");
	wheel.addClass("spinner-wheel");
	var spinner = $("<i/>");
	spinner.addClass("fa fa-spinner fa-pulse");
	splash.append(c.append(wheel.append(spinner)));
	if (undefined != context) {
		$("body", context).append(splash);
	} else {
		$("body").append(splash);
	}
	var paras = $.isPlainObject(CONTEXT) && CONTEXT.paras || {};
	setTimeout(function(){
		close.show();
		close.on("click", function(e){
			hideLoadingMask(context);
			callback(paras);
			e.stopPropagation();
		});
	}, showtime);
}
/* 数据加载动效关闭/取消 */
function hideLoadingMask(context) {
	if (isLoadingMaskShown(context))
		if (undefined != context)
			$(".spinner-layout", context).remove();
		else
			$(".spinner-layout").remove();
}
/* 判断加载动效是否存在 */
function isLoadingMaskShown(context) {
	if (undefined != context)
		return $(".spinner-layout", context).size() > 0;
	else
		return $(".spinner-layout").size() > 0;
}
/* 输出INFO消息框，设置关闭框体事件 */
function showMessageDialog1(msg, callback) {
	if (isLoadingMaskShown())
		hideLoadingMask();
	var layout = $("<div/>");
	layout.addClass("dialog-layout");
	var dialog = $("<div/>");
	dialog.addClass("dialog");
	var txt = $("<span/>");
	txt.text(msg);
	var btn = $("<div/>");
	btn.addClass("dialog-btn-m");
	btn.text("确定");
	btn.on("click", function(e) {
		dismissMessageDialog();
		if ("undefined" != typeof(callback) && callback.constructor.toString().indexOf("Function()") > -1)
			callback();
		e.stopPropagation();
	});
	layout.append(dialog.append(txt).append(btn));
	$("body").append(layout);
}
function showMessageDialog(msg, callback) {
	if (isLoadingMaskShown())
		hideLoadingMask();
	var layout = $("<div/>");
	layout.addClass("dialog-layout");
	var dialog = $("<div/>");
	dialog.addClass("dialog");
	var titleP = $("<p/>");
	titleP.addClass("dialog-title");
	titleP.text("移动OA提示");
	dialog.append(titleP);
	var txt = $("<span/>");
	txt.text(msg);
	var btnContainor = $("<div/>");
	var btn = $("<div/>");
	btn.addClass("dialog-btn");
	btn.text("确定");
	btn.on("click", function(e) {
		dismissMessageDialog();
		if ("undefined" != typeof(callback) && callback.constructor.toString().indexOf("Function()") > -1)
			callback();
		e.stopPropagation();
	});
	btnContainor.append(btn);
	layout.append(dialog.append(txt).append(btnContainor));
	$("body").append(layout);
}
/* 输出INFO消息框，设置关闭框体事件  edit by fang 160117*/
function showMessageDialog2(msg) {
	if (isLoadingMaskShown())
		hideLoadingMask();
	var layout = $("<div/>");
	layout.addClass("dialog-layout");
	var lableP = $("<P/>");
	lableP.text("移动OA提示");
	layout.append(lableP);
	var dialog = $("<div/>");
	dialog.addClass("dialog");
	dialog.attr("style", "overflow-y:auto; height:120px");
	dialog.append($("<br/>"));
	var infoTab = $("<table/>");
	var otr = $("<tr/>");
	var otd = $("<td/>");
	otd.attr("style", "height: 40px");
	var ofont = $("<font/>");
	ofont.addClass("filestate");
	ofont.text(msg);
	otd.append(ofont);
	otr.append(otd);
	infoTab.append(otr);
	dialog.append(infoTab);
	layout.append(dialog);
	var btn = $("<div/>");
	btn.addClass("dialog-btn-m");
	btn.text("确定");
	btn.on("click", function(e) {
		dismissMessageDialog();
		if ("undefined" != typeof(loadVerifyCodeImg) && loadVerifyCodeImg.constructor.toString().indexOf("Function()") > -1)
			loadVerifyCodeImg();
		e.stopPropagation();
	});
	layout.append(btn);
	$("body").append(layout);

	//---------------------------------------
	/*
	var txt = $("<span/>");
	txt.text(msg);
	
	var btn = $("<div/>");
	btn.addClass("dialog-btn-m");
	btn.text("确定");
	btn.on("click", function(e){
		dismissMessageDialog();
		if("undefined" != typeof(loadVerifyCodeImg)&&loadVerifyCodeImg.constructor.toString().indexOf("Function()") > -1)
			loadVerifyCodeImg();
		e.stopPropagation();
	});
	
	layout.append(dialog.append(txt).append(btn));
	
	$("body").append(layout);
	*/
}
/* 移除INFO消息框 */
function dismissMessageDialog() {
	$(".dialog-layout").remove();
}
/*
	重写CONFIRM交互消息框 start
	在原始逻辑顺序下不可用，无法实现中断等待
 */
var LatestConfirmSwitch = false;
var LatestConfirmStatus = false;

function checkConfirmResult() {
	var date = new Date();
	var start = date.getTime();
	while (true) {
		if (!LatestConfirmSwitch)
			break;
		var now = new Date();
		var end = now.getTime();
		if (end - start > 15000)
			break;
	}
	return LatestConfirmStatus;
}
function showConfirmMessageDialog(msg) {
	var layout = $("<div/>");
	layout.addClass("message-layout");

	var dialog = $("<div/>");
	dialog.addClass("message-dialog");

	var txt = $("<div/>");
	txt.addClass("message-txt");
	txt.text(msg);
	dialog.append(txt);

	var ok = $("<div/>");
	ok.addClass("left-btn");
	ok.text("确定");
	ok.on("click", function() {
		LatestConfirmStatus = true;
		dismissConfirmMessageDialog();
	});
	dialog.append(ok);

	var cancel = $("<div/>");
	cancel.addClass("right-btn");
	cancel.text("取消");
	cancel.on("click", function() {
		LatestConfirmStatus = false;
		dismissConfirmMessageDialog();
	});
	dialog.append(cancel);

	layout.append(dialog);

	LatestConfirmSwitch = true;
	$("body").append(layout);
	return true;
}
function dismissConfirmMessageDialog() {
	LatestConfirmSwitch = false;
	$(".message-layout").remove();
}
/* 重写CONFIRM交互消息框 end */

/* 输出状态消息框，成功时开启3秒跳转，失败时设置关闭命令 */
function showResultMessageDialog(result) {
	if (isLoadingMaskShown())
		hideLoadingMask();
	if (result.constructor.toString().indexOf("String()") > -1)
		var _result = eval("(" + result + ")");
	else
		var _result = result;
	var suc = cbSuccess;
	var err = cbFailure;

	var layout = $("<div/>");
	layout.addClass("message-layout");

	var dialog = $("<div/>");
	dialog.addClass("message-dialog");

	var img = $("<i/>");
	var icon = $("<div/>");
	icon.addClass("message-icon");
	if (_result.success) {
		icon.addClass("success");
		img.addClass("fa fa-check");
	} else {
		icon.addClass("false");
		img.addClass("fa fa-times");
	}
	icon.append(img);
	dialog.append(icon);

	var msg = $("<div/>");
	msg.addClass("message-txt");
	msg.text(_result.message);
	dialog.append(msg);

	if (_result.success) {
		var info = $("<div/>")
		info.addClass("message-small-txt");
		info.html("页面在<span id=\"remaining_seconds\">3</span>秒后跳转");
		dialog.append(info);
	} else {
		var btn = $("<div/>");
		btn.addClass("middle-btn");
		btn.text("关闭");
		if (undefined == err || err.constructor.toString().indexOf("Function()") == -1)
			err = dismissResultMessageDialog;
		btn.on("click", {
			f: err
		}, function(event) {
			eval("(" + event.data.f + "())");
		})
		dialog.append(btn);
	}

	layout.append(dialog);
	$("body").append(layout);

	if (_result.success) {
		var ivTimer = setInterval(function() {
			var o = $("#remaining_seconds");
			var seconds = parseInt(o.text());
			o.text(seconds - 1);
		}, 1000);
		var toTimer = setTimeout(function() {
			clearInterval(ivTimer);
			clearTimeout(toTimer);
			if (undefined == suc || suc.constructor.toString().indexOf("Function()") == -1)
				dismissResultMessageDialog();
			else
				eval("(" + suc + "())");
		}, 3000);
	}
}
/* 移除状态消息框 */
function dismissResultMessageDialog() {
	$(".message-layout").remove();
}
/* 模态小视图弹出 */
function showModalWin(url) {
	var frm = $("<iframe/>");
	frm.addClass("modal-frame");
	frm.on("load", function() {
		hideLoadingMask();
		$(this).show();
	});
	frm.attr("src", url);
	showLoadingMask();
	$("body").append(frm);
}
/* 模态小视图移除 */
function dismissModalWin() {
	$(".modal-frame").remove();
}
/* 动态加载TranslateY效果 */
function addTranslateY(node, pixel) {
	node.css("transform", "translateY(" + pixel + "px)");
	node.css("-webkit-transform", "translateY(" + pixel + "px)");
	node.css("-moz-transform", "translateY(" + pixel + "px)");
	node.css("-o-transform", "translateY(" + pixel + "px)");
	node.css("-ms-transform", "translateY(" + pixel + "px)");
}
/* 动态添加form.submit载入位置元素 */
function addFormTargetFrame(name) {
	if ($("iframe[name='" + name + "']").length > 0)
		return;
	var frm = $("<iframe/>");
	frm.attr("name", name);
	frm.css("display", "none");
	$("body").append(frm);
}
/* 退出当前账号对话框弹出 */
function showLogoutDialog(logout, logon) {
	var mask = $("<div/>");
	mask.attr("id", "logoutMask");
	mask.addClass("screen-mask");
	var dialog = $("<div/>");
	dialog.css({
		position: "absolute",
		top: "30%",
		left: "5%",
		width: "90%",
		backgroundColor: "#fff",
		padding: "1.5rem 0",
		borderRadius: "4px"
	})
	var info = $("<p/>");
	info.css({
		textAlign: "center",
		height: "3rem",
		lineHeight: "3rem",
		marginBottom: "0.8rem",
		color: "#74859c"
	});
	info.text("是否退出当前账号？");
	var cancel = $("<div/>");
	cancel.css({
		display: "inline-block",
		width: "35%",
		height: "2.4rem",
		marginLeft: "10%",
		lineHeight: "2.4rem",
		textAlign: "center",
		borderRadius: "2px",
		color: "#74859c",
		backgroundColor: "#e8ecee"
	});
	cancel.text("取消");
	cancel.on("click", function(e) {
		dismissLogoutDialog();
		e.stopPropagation();
	});
	var ok = $("<div/>");
	ok.css({
		display: "inline-block",
		width: "35%",
		height: "2.4rem",
		marginLeft: "10%",
		lineHeight: "2.4rem",
		textAlign: "center",
		borderRadius: "2px",
		color: "#fff",
		backgroundColor: "#0c6cff"
	});
	ok.text("确认");
	ok.on("click", function(e) {
		$.ajax({
			type: "GET",
			url: logout,
			async: true,
			dataType: "json",
			beforeSend: function() {
				dismissLogoutDialog();
				showLoadingMask();
			},
			success: function(o) {},
			error: function(xhr, type, err) {}
		});
		setTimeout(function() {
			hideLoadingMask();
			location.href = logon;
		}, 1000);
		e.stopPropagation();
	});
	dialog.append(info).append(cancel).append(ok);
	mask.append(dialog);
	$("body").append(mask);
}
/* 退出当前账号对话框关闭 */
function dismissLogoutDialog() {
	$("#logoutMask").remove();
}
/* 
	Ajax交互中断回调
	@param xhr
		XMLHttpRequest对象
	@param onreadystatechange
		定制中断回调Function
	@param settings
		Ajax绑定配置
	@author qiushuang
	@date 2016.3.4
 */
function mAjaxStop(objs) {
	var xmlHttp = $.isPlainObject(objs) && objs.xhr;
	var stateChange = $.isPlainObject(objs) && objs.onreadystatechange || function(){return false;};
	if(undefined != xmlHttp){
		xmlHttp.onreadystatechange = function(){
			stateChange();
			return false;
		};
		xmlHttp.abort();
	}
	var settings = $.isPlainObject(objs) && objs.settings;
	if(undefined != settings){
		settings.success = function(){
			return false;
		};
		settings.error = function(){
			return false;
		};
		settings.complete = function(){
			return false;
		}
	}
}
/* 构造组件显示矩形图标 */
function createRectangle(bfs, rectangle, bw) {
	var figure = $("<div/>");
	figure.addClass("f-rectangle");

	var width = rectangle.w * bfs - 2 * bw;
	var height = rectangle.h * bfs - 2 * bw;
	var marginTop = 0 - (height / 2 + bw);
	var marginLeft = 0 - (width / 2 + bw);
	figure.css({
		width: width + "px",
		height: height + "px",
		marginTop: marginTop + "px",
		marginLeft: marginLeft + "px",
		borderWidth: bw + "px"
	});

	return figure;
}
/* 构造组件显示正方形图标 */
function createSquare(bfs, square, bw) {
	var figure = createRectangle(bfs, {
		w: square.d,
		h: square.d
	}, bw);
	figure.css("line-height", square.d * bfs + "px");

	return figure;
}
/* 构造组件显示圆形图标 */
function createCircle(bfs, circle) {
	var figure = $("<div/>");
	figure.addClass("f-circle");

	var borderWidth = 2;
	var width = circle.w * bfs - 2 * borderWidth;
	var height = circle.h * bfs - 2 * borderWidth;
	var marginTop = 0 - (height / 2 + borderWidth);
	var marginLeft = 0 - (width / 2 + borderWidth);
	figure.css({
		width: width + "px",
		height: height + "px",
		lineHeight: height + "px",
		marginTop: marginTop + "px",
		marginLeft: marginLeft + "px"
	});

	return figure;
}
/* 构造组件显示勾形图标 */
function createCheck(bfs, check) {
	var figure = $("<div/>");
	figure.addClass("f-check");

	var borderWidth = 2;
	var width = check.w * bfs;
	var height = check.h * bfs;
	figure.css({
		width: width + "px",
		height: height + "px",
		marginTop: (0 - (height / 2 + borderWidth)) + "px",
		marginLeft: (0 - (width / 2 + borderWidth)) + "px"
	});

	return figure;
}
/* 数组对象方法拓展，判断元素项是否包含某字符串 */
Array.prototype.contains = function(o) {
	if (this.length < 1)
		return false;
	for (var i = 0; i < this.length; i++) {
		var s = this[i];
		if (null != s && o == s)
			return true;
	}
	return false;
};
/**
 * 显示对话框，第二个参数传入确定按钮点击执行的函数名称,带括号 
 * @param {Object} msg
 * @param {Object} callBackFuncName
 */
function showMessageDialogWithCallBackName(msg, callBackFuncName) {
	if (isLoadingMaskShown())
		hideLoadingMask();
	var layout = $("<div/>");
	layout.addClass("dialog-layout");
	var dialog = $("<div/>");
	dialog.addClass("dialog");
	var titleP = $("<p/>");
	titleP.addClass("dialog-title");
	titleP.text("移动OA提示");
	dialog.append(titleP);
	var txt = $("<span/>");
	txt.text(msg);
	var btnContainor = $("<div/>");
	var btn = $("<div/>");
	btn.addClass("dialog-btn");
	btn.text("确定");
	btn.on("click", function(e) {
		dismissMessageDialog();
		//if("undefined" != typeof(callBackFuncName)&&callBackFuncName.constructor.toString().indexOf("Function()") > -1)
		if ("undefined" != typeof(callBackFuncName)) {
			eval(callBackFuncName);
		} else {
			if ("undefined" != typeof(loadVerifyCodeImg) && loadVerifyCodeImg.constructor.toString().indexOf("Function()") > -1)
				loadVerifyCodeImg();
		}
		e.stopPropagation();
	});
	btnContainor.append(btn);
	layout.append(dialog.append(txt).append(btnContainor));
	$("body").append(layout);
}

String.prototype.startWith=function(str){     
  var reg=new RegExp("^"+str);     
  return reg.test(this);        
}  

String.prototype.endWith=function(str){     
  var reg=new RegExp(str+"$");     
  return reg.test(this);        
}

String.prototype.startsWith=function(str){     
  var reg=new RegExp("^"+str);     
  return reg.test(this);        
}  

String.prototype.endsWith=function(str){     
  var reg=new RegExp(str+"$");     
  return reg.test(this);        
}