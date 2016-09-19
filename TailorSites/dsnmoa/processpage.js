include('conf.js');
include('util.js');
t.init({
	switch : true,
	business : '获取流程',
	filename : 'processpage.js'
});
t.hi();
var response = {
	success : true,
	message : '响应正常',
	data : '',
	posturl:''
};
try{
	var request = fetcher.request;
	//var stream = fetcher.fetchStream(request).stream;
	//tailor.contentType = stream.contentType;
	//tailor.setStreamResult(stream);
	request.url = request.url.replace("/ProcessURL-","");
	var text = fetcher.fetchText(request).text;
	var str = buildXMLUrl(text);
	response.posturl = str;
	
}catch(e){
	t.success = false;
	t.message = '响应异常';
	t.throwerror(e);
}finally{
	t.bye();
	t.record();
	tailor.contentType = 'json';
	tailor.setTextResult(JSON.stringify(response));
}

//得到请求xml文件的地址
function buildXMLUrl(text){
	var start = text.indexOf('<script type="text/javascript">');
	var end = text.indexOf('<body');
	var scripts = text.substring(start,end);
	var start1 = scripts.indexOf('oXML.load(');
	scripts = scripts.substring(start1+10,end);
	var end1 = scripts.indexOf(');');
	var loadurl = scripts.substring(0,end1).replace(/\'/g,'').replace(/\"/g,'');
	return loadurl;
}
