include('conf.js');
include('util.js');
t.init({
	switch : true,
	business : '正文JSON数据',
	filename : 'number.router.js'
});
var response = {
	success: true,
	message:'响应正常',
	data:{
		tabledatas:{},
		tablevalue:''
	}
};
t.hi();
try{
	var request = fetcher.request;
	request.url = request.url.replace('Create-Number=','');
	var dom = fetcher.fetchDocument(request).document;
	var text = dom.innerText;
	
	var start = text.indexOf('if(true == true)') != -1 ? text.indexOf('if(true == true)') : null;
	var alltext = text.substring(start,text.length);
	var context = alltext.substring(0,alltext.indexOf("}"));
	
	response.data.tabledatas = getTdValues(dom,context);
	var tablevalue = dom.evaluate(".//INPUT[@id='tablevalue']",dom,"",1);
	if (tablevalue) {
		response.data.tablevalue = tablevalue.value;
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
function getTdValues(obj,context){
	var data =　[];
	var hides = searchHideText(context);
	var div = obj.evaluate(".//DIV[@class='tck_table']",obj,"",1);
	var table = obj.evaluate(".//TABLE",div,"",1);
	var tds = obj.evaluate(".//TD",table,"",0);
	var infoNum = tds.length;
	for (var i=0; i < infoNum; i=i+2) {
		var datas = {title:'',value:'',isshow:true};
	  	var td = tds[i];
	  	var nexttd = tds[i+1];
	  	var tdhtml = td.innerText;
	  	if (tdhtml.indexOf("：") != -1 || tdhtml.indexOf(":") != -1 ) {
	  		if (td.outerHTML.indexOf("display: none") != -1) {
	  			datas.isshow = false;
	  		};
	  		if (hides) {
	  			for (var j=0; j < hides.length; j++) {
					if (td.outerHTML.indexOf(hides[j]) != -1) {
						datas.isshow = false;
					};	
				};
	  		};
	  		datas.title = tdhtml;
	  		datas.value = nexttd.innerHTML;
	  		data.push(datas);
	  	};
	};
	return data;
}
function searchHideText(context){
	var hidetexts = [];
	var contexts = context.split("#");
	if (contexts) {
		for (var i=1; i < contexts.length; i++) {
		  	var hides = contexts[i].split('"')[0];
		  	hidetexts.push(hides);
		};
	};
	if (hidetexts) {
		return hidetexts;
	}else{
		return null;
	}
}
