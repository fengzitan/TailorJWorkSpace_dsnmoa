include('conf.js');
include('util.js');
t.init({
	switch : true,
	business : '公文-提交-验证',
	filename : 'document.formsubmit.verify.js'
});
t.hi();
var response = {
	success : true,
	message : '响应正常',
	data : ''
};
try{
	var request = fetcher.request;
	request.url = request.url.replace('TailorApi-formsubmit-','');
	var response_ = fetcher.fetchText(request);
	//println(response_.text);
	response.data = response_.text ? "ok" : "no";
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