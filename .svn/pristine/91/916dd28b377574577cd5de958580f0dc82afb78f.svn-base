include('conf.js');
include('util.js');
t.init({
	switch : true,
	business : '打开公文-路由',
	filename : 'document.ishasperson.js'
});
t.hi();
var response = {
	success : true,
	message : '响应正常',
	data : ''
}
try{
	var request = fetcher.request;
	request.url = request.url.replace('TailorApi-ishasperson-','');
	var opnionText = fetcher.fetchText(request).text;
	println(opnionText);
	println(request.postData);
	response.data = opnionText;
	
}catch(e){
	response.success = false;
	response.message = '响应异常';
	t.throwerror(e);
}finally{
	t.bye();
	t.record();
	tailor.contentType = 'json';
	tailor.setTextResult(JSON.stringify(response));
}