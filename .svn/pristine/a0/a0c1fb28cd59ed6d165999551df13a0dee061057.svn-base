include('conf.js');
include('util.js');
t.init({
    switch: true,
    business: '处理单的多余表格',
    filename: 'document.commenttable.js'
});
t.hi();
var response = {
    success: true,
    message: '响应正常',
    data: []
};
try {
    var request = fetcher.request;
    request.url = request.url.replace('RENLI-Resource-', '');
    var dom = fetcher.fetchDocument(request).document;
    var text = dom.innerText;
    response.data = buildCommentTable(dom);
} catch (e) {
    response.success = false;
    response.message = '响应异常';
    t.throwerror(e);
} finally {
    t.bye();
    t.record();
    tailor.contentType = 'json';
    tailor.setTextResult(JSON.stringify(response));
}
//得到表格中的数据
function buildCommentTable(dom){
	var comment = [];
	var tds = dom.evaluate(".//TD[@class='commentName']", dom, "", 0);
	var infoNum = tds.length;
	for (var i=0; i < infoNum; i++) {
	  	var obj = {};
	  	obj.title = tds[i].innerText.trim();;
	  	var nextEl = tds[i].nextSibling.nextSibling;
	  	if (nextEl.tagName == 'TD') {
	  		obj.text = nextEl.innerText.trim();
	  	}
	  	comment.push(obj);
	};
	return comment;
}
