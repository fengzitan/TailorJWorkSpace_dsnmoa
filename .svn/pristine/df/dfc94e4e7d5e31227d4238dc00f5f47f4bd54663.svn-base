include('conf.js');
include('util.js');
t.init({
	switch: true,
	business: '获取提交人员树接口',
	filename: 'choicePerson.view.js'
});
t.hi();
var response = {
	success: true,
	message: '响应正常',
	data: {
		path: '',
		common: [],
		selectparams: {}
	}
}
try {
	var request = fetcher.request;
	//println(request.url);
	request.url = request.url.replace('TailorApi=CP-', '');
	//println(request.url);
	var dom = fetcher.fetchDocument(request).document;
	var text = dom.innerText;
	//println(text);

	response.data.path = buildPathScript(text);
	response.data.common = buildCommonJson();
	response.data.selectparams = buildSelectJson(text);
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
// 构建提交路径json数据
function buildPathScript(text) {
	var paths = '';
	var pathArr = text.match(/path[0-9]\..*=.*\;|var path[0-9].*;|paths.push.*;/mg);
	if (pathArr) {
		var infoNum = pathArr.length;
		for (i = 0; i < infoNum; i++) {
			paths += pathArr[i];
		}
	};
	return paths;
}
// 构建常用意见Json数据
function buildCommonJson() {
	var commondom = dom.evaluate(".//SELECT[@id='appertainList']", dom.body, "", 1);
	var options = dom.evaluate(".//OPTION", commondom, "", 0);//xg--cy;常用审批意见显示不全（有些option没有id）
	var infoNum = options.length;
	var result = [];
	for (i = 0; i < infoNum; i++) {
		result.push({
			text: options[i].innerText.trim(),
			value: options[i].getAttribute('value')
		});
	}
	return result;
}
// 构建表单参数json数据
function buildSelectJson() {

	var inputs = dom.evaluate(".//INPUT[@name][@value]", dom.forms[0], "", 0);
	var infoNum = inputs.length;
	var result = {};
	for (i = 0; i < infoNum; i++) {
		if (inputs[i].getAttribute('name')) {
			result[inputs[i].getAttribute('name')] = inputs[i].getAttribute('value');
		}
	}
	var extra = text.match(/var PERSON_PICKER_TREE_DATA_CACHE_TOKEN.*;/g)[0].split("\'")[1];
	result['PERSON_PICKER_TREE_DATA_CACHE_TOKEN'] = extra;
	return result;
}