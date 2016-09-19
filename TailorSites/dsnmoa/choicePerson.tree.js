include('conf.js');
include('util.js');
t.init({
	switch : true,
	business : '提交人员树',
	filename : 'choicePerson.tree.js'
});
t.hi();
var response = {
	success : true,
	message : '响应正常',
	data : {}
}
try{
	var request = fetcher.request;
	request.url = request.url.replace('Tailor-Api=Tree-','');
	var text = fetcher.fetchText(request).text;
	response.data = JSON.parse(text);
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