include('conf.js');
include('util.js');
t.init({
	switch : true,
	business : '正文JSON数据',
	filename : 'opnioncontext.js'
});
var response = {
	success: true,
	message:'响应正常',
	data:{}
};
t.hi();
try{
	var request = fetcher.request;
	request.url = request.url.replace('Opinion-Text-','');
	var opnionText = fetcher.fetchText(request).text;
	t.out(opnionText);
	if (opnionText) {
		response.data = JSON.parse(opnionText);
	};
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
