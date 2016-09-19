include('conf.js');
include('util.js');
t.init({
	switch :  true,
	filename : 'logservice.js',
	business : '记录日志'
});
t.hi();
var response = {
	success : true,
	message : '响应正常',
	data : ''
};

const LOGLEVEL_VISIT = 0;	//日志级别 访问日志
const LOGLEVEL_WARR = 1;	//日志级别 警告日志
const LOGLEVEL_WERR = 2;	//日志级别 错误日志
const LOGLEVEL_LOGIN = 3;	//日志级别 登录日志
const LOGLEVEL_ATTACH = 4;	//日志级别 附件访问日志

try{
	var request = fetcher.request;
	var method = request.method.toLowerCase();
	if("post" === method){
		var pdata = request.postData || "{}";
		var odata = JSON.parse(pdata);
		logSubject(odata);
	}
}catch(e){
	t.throwerror(e);
}finally{
	tailor.contentType = 'json';
	tailor.setTextResult("{}");
	t.bye();
	t.record();
}

var logStruc = {
	level : LOGLEVEL_VISIT,
	title : "",
	name : "",
	state : "",
	type : "",
	url : "",
	method : "",
	from : "",
	succ : true,
	msg : "",
	desc : ""
};

function logSubject(oPara) {
	var appPlatform_openDoc = log.applicationPlatformID;
	var wjlx = oPara.name || "";
	var title = oPara.title || "";
	var stat = oPara.state || "";
	var type = oPara.type || "";
	var from = oPara.from || "";
	var url = oPara.url || "";
	var level = oPara.level || "";
	var logCnt = type + "-->" + wjlx + ":" + "《" + title + "》:" + application.get("username") + " log from: " + from;
	log.log(url, appPlatform_openDoc, level, logCnt);
}
