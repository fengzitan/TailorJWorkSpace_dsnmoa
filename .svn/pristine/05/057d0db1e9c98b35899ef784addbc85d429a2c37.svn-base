include('conf.js');
include('util.js');
t.init({
	switch : true,
	business : '公文-提交-验证',
	filename : 'document.submit.verify.js'
});
t.hi();
var response = {
	success : true,
	message : '响应正常',
	data : ''
},html,script;
try{
	var request = fetcher.request;
	request.url = request.url.replace('TailorApi-verify-','');
	request.redirectable = false;
	var response_ = fetcher.fetchStream(request);
	response.data = response_.get('Location')||'';
	//html = buildResultHtml();
	script = '<script>var $ = window.parent.$;$("#list-content").html("");window.parent.getListData(1);$(".slide-in").remove();</script>';
}catch(e){
	response.success = false;
	response.message = '响应异常';
	t.throwerror(e);
}finally{
	t.bye();
	t.record();
	tailor.contentType = 'text/html';
	tailor.setTextResult(script);
}
function buildResultHtml(){
	var el = document.createElement('div');
	var elclass =  response.data ? 'verify-context success' : 'verify-context error';
	el.setAttribute('class',elclass);
	el.innerText = response.data ? '提交成功' : '提交失败';
	var tip = document.createElement('p');
	tip.setAttribute('class','verify-tip');
	tip.innerText = '3秒后自动关闭！';
	el.appendChild(tip);
	return el.outerHTML;
}