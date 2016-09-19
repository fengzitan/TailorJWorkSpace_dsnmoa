include('conf.js');
include('util.js');
t.init({
	switch : true,
	business : '上传编号',
	filename : 'updatacurrentnumber.js'
});
t.hi();
var response = {
	success : true,
	message : '响应正常',
	data : ''
}
try{
	var request = fetcher.request;
	request.url = request.url.replace('updateCurrentNumberValue=','');
	var responseText = fetcher.fetchText(request).text;
	t.out(responseText);
	if (responseText) {
		response.data = JSON.parse(responseText);
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