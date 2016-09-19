include('conf.js');
include('util.js');
t.init({
	switch : true,
	business : '打开公文-路由',
	filename : 'haddocument.router.js'
});
t.hi();
var response = {
	success : true,
	message : '响应正常',
	data : ''
}
try{
	var request = fetcher.request;
	var response_ = fetcher.fetchStream(request);
	response.data = response_.get('Location');
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