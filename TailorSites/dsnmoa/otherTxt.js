try {
	var request = fetcher.request;
	request.url = request.url;
	//println(request.url);
	//var txt = "暂不支持该类型的附件";
	var txt = "<center><div style='font-weight:bold;color:#00d;font-size: 16px; margin-top: 10px; font-family: 微软雅黑;'>暂不支持该类型的附件</div><center>";
	var url = request.url.toLowerCase();
	var cntType = application.get("contentType"); 
	//if(cntType === "text/plain" && url.toLowerCase().endWith("txt")){	//text/plain 的情况只支持txt文件
	if(cntType === "text/plain"){
		txt = application.get("attcnt");
		txt = txt? txt : "";
		//if(txt === ""){
			var enc = "gb2312";
			txt = fetchTextEncoding(request,enc);
			println("txt==========" + txt)	
		//}
	}else if(cntType.startWith("image/")){	
		txt = "<img src='" + request.url.replace('/cmdi-','/image-cmdi-')  + "'/>";
		//println(txt);
	}
} catch (e) {
	var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
	log.error(fetcher.request.url, szMessage);
	println(szMessage);
}