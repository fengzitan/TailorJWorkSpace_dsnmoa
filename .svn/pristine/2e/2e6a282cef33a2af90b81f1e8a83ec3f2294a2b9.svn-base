include('conf.js');
include('util.js');
include('util.db.js');
t.init({
	switch : true,
	business : '设计院-主页',
	filename : 'index.js'
});
var data = new Object();
try{
	t.hi();
	var about4TailorBrowser = '';
	var oClientContext = fetcher.client;
	var oHttpClientRequest = oClientContext.request;
	var oHeaders = oHttpClientRequest.headers;
	for ( var i = 0; i < oHeaders.count; i++) {
		if (oHeaders.getKey(i) == "User-Agent") {
			var szUserAgent = oHeaders.getValue(i);
			if (szUserAgent.indexOf("TailorBrowser") > 0) {
				about4TailorBrowser = '<a href="settings://about" onclick="window.Set.about();return false;"><li class="my-about">关于</li></a>';
			}
			break;
		}
	}
	var usr = application.get("username");
	t.out(usr);
	usr = usr? usr : "";
	if("" != usr){
		var _oModule = getUserModule(application.get("username"), MOA_WEBAPPID);
		data.modules = simplify(_oModule);
	}else{
		data.success = false;
		data.msg = "未登登录或登录超时";
	}
	var models = JSON.stringify(data);
}catch(e){
	t.throwerror(e);
}finally{
	t.bye();
	t.record();
}
function simplify(oModule){
	if (oModule.count > 0) {
		var nModules = new Array();
		var oModules = oModule.module;
		for (var i=0; i<oModules.length; i++) {
			var oOrigin = oModules[i];
			var nModule = new Object();
			nModule["id"] = oOrigin["ID"];
			nModule["displayName"] = oOrigin["DisplayName"];
			nModule["url"] = oOrigin["Url"];
			nModule["icon"] = oOrigin["icon"];
			nModule["isAdded"] = 1 == oOrigin["Display"] ? true : false;
			nModule["isDeployed"] = 1 == oOrigin["IsOnline"] ? true : false;
			nModule["callback"] = oOrigin["callback"];
			nModules.push(nModule);
		}
		return nModules;
	}
	return oModule.module;
}
function getAppsetItems(){
	var app_set_item = "";
	try {
		var oClientContext = fetcher.client;
		var oHttpClientRequest = oClientContext.request;
		var oHeaders = oHttpClientRequest.headers;
		for ( var i = 0; i < oHeaders.count; i++) {
			if (oHeaders.getKey(i) == "User-Agent") {
				var szUserAgent = oHeaders.getValue(i);
				if (szUserAgent.indexOf("TailorBrowser") > 0) {
					var app_set = [
						/*
						{
							"title": "推送设置",
							"href": "settings://notification",
							"onclick": "window.Set.pushSetting();return false;",
							"img": "set_push_news.png"
						},
						*/
						{
							"title": "手势密码",
							"href": "settings://password",
							"onclick": "window.Set.modifyGesture();return false;",
							"img": "gesture.png"
						},
						{
							"title": "关于",
							"href": "settings://about",
							"onclick": "window.Set.about();return false;",
							"img": "about.png"
						}
					];
					for (var i=0; i<app_set.length; i++) {
						/*
						app_set_item += "<a href=\"" + app_set[i].href + "\" onclick=\"" + app_set[i].onclick + "\" rewrited=\"false\">";
						app_set_item += "<div class=\"message\"><img class=\"im\" rewrited=\"" + LOCAL_RESOURCE_USE_PROXY + "\" src=\"" + LOCAL_RESOURCE_URL + "img/" + app_set[i].img + "\">";
						app_set_item += "<p class=\"name\">" + app_set[i].title + "</p>";
						app_set_item += "<img class=\"into\" rewrited=\"" + LOCAL_RESOURCE_USE_PROXY + "\" src=\"" + LOCAL_RESOURCE_URL + "img/sh_06.jpg" + "\">";
						app_set_item += "</div>";
						app_set_item += "</a>";
						*/
						app_set_item += "<a href=\"" + app_set[i].href + "\" onclick=\"" + app_set[i].onclick + "\" rewrited=\"false\">";
						var bgroundImgUrl = LOCAL_RESOURCE_URL + "img/" + app_set[i].img;
						app_set_item += '<li class="listItem">';
						app_set_item += '<div class="itemIcon" style="background-image: url(' + bgroundImgUrl + ');"></div>';
						app_set_item += '<div class="itemTitle">' + app_set[i].title + '</div><div class="itemIndicator"><i class="fa fa-chevron-right"></i></div></li>';
						app_set_item += "</a>";
					}
				}
				break;
			}
		}
	
	} catch (e) {
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":"
				+ e.lineNumber + ")";
		log.error(szLocation, szMessage);
		println(szMessage);
	}
	return app_set_item;
}