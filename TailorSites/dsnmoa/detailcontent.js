include('conf.js');
include('util.js');
t.init({
	switch : true,
	business : '获取正文',
	filename : 'detailcontent.js'
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
	request.url = request.url.replace('View-Detail-','');
	var doms = fetcher.fetchDocument(request).document;//得到其dom对象
	var texts = doms.innerHTML;//得到全文
	//取得里面隐藏文本框的ID和value值，让其进行Ajax请求
	response.data = getPostDatas(doms);
	//得到Ajax请求的地址
	response.posturl = getPostUrl(texts);
	
	//println(texts);
}catch(e){
	t.success = false;
	t.message = '响应异常';
	t.throwerror(e);
}finally{
	t.bye();
	t.record();
	//responseStr = JSON.stringify(response);
	tailor.contentType = 'json';
	tailor.setTextResult(JSON.stringify(response));
}
//得到发送Ajax请求的数据
function getPostDatas(obj){
	var inputhidden = {
		bizCode:'',
		bizId:''
	};
	var bizcode = doms.evaluate(".//INPUT[@id='bizCode']",doms,"",1);
	inputhidden.bizCode = bizcode.value;	
	var biz = doms.evaluate(".//INPUT[@id='bizId']",doms,"",1);
	inputhidden.bizId = biz.value;
	return inputhidden;	
}
//得到Ajax请求的地址
function getPostUrl(str){
	var start = str.indexOf("<SCRIPT type=\"text/javascript\"");//7474
	var end = str.lastIndexOf("<\/SCRIPT>");//12919
	var scripts = str.substring(start,end);
	var start1 = scripts.indexOf("$.ajax({");//start1=257
	var $_ajax = scripts.substring(start1,scripts.length);
	$_ajax = $_ajax.substring(0,$_ajax.indexOf(","));//url
	var ajaxUrl = $_ajax.substring($_ajax.indexOf("url:")+4,$_ajax.length).replace(/ +/,"").replace(/\'/mg,"");
	return ajaxUrl.replace('/','');
}