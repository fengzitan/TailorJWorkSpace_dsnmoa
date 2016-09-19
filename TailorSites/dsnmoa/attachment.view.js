try {
	include("util.js");
	include("conf.js");
	//println(111);
	var request = fetcher.request;
	var baseUrl = getbaseUrl(request.url);
	
	var mHtml = fetchText(request);
	mHtml = mHtml.replaceAll("alert", "showMessageDialog");
	mHtml = mHtml.replace('imgBase= \'','imgBase= \''+baseUrl+'/attachment/');
	//println(mHtml)
	var domParser = new DOMParser();
	

	dom = domParser.parseFromString(mHtml, "text/html");
	//整理图片地址
	var oImg = dom.evaluate(".//IMG[@id='show_img']", dom.body, "", 1);
	if(oImg){
		var imgSrc = oImg.getAttribute("src");
		imgSrc = baseUrl + "/attachment/" + imgSrc;
		oImg.setAttribute("src", imgSrc);
		println("qqqqqqqqqqqqqqqqqqqqqq2");
				println(oImg.getAttribute("src"));
	}else{
		//整理压缩包解开后的文件列表的地址
		var oRARFileLinkList = dom.evaluate(".//A", dom.body, "", 0);
		for(var i = 0; i < oRARFileLinkList.length; i++){
			var href = oRARFileLinkList[i].getAttribute("href");
			href = baseUrl + "/attachment/" + href;
			oRARFileLinkList[i].removeAttribute('href');
			oRARFileLinkList[i].setAttribute("url", href);
		}
	}
	//不停刷新页面时继续获取页面信息的flg 如果重新加载3次都未成功获取信息就设为false
	var cancontinue = true;
	var loading = dom.evaluate(".//DIV[text()='数据加载中...']",dom,"",1);
	if(loading){
		//如果附件是压缩包的时候解压后转换过程附件引擎可能会出错，此时一直返回一个js重新加载页面，此时我们缓存页面加载的次数，如果超过指定次数则提示用户出错了
		var reloadTimes = application.get("reloadTimes");
		reloadTimes = (reloadTimes)? reloadTimes : "0";
		reloadTimes = parseInt(reloadTimes);
		reloadTimes++;
		application.set("reloadTimes", reloadTimes);
		if(reloadTimes > 3){
			show_html = "<center><div style='font-weight:bold;color:#00d;font-size: 16px; margin-top: 10px; font-family: 微软雅黑;'>附件转换失败，请在PC上查看附件</div><center>";
			application.set("reloadTimes", "0");
			cancontinue = false;
		}
		loading.style.marginTop = '50%';
		loading.style.fontSize = '30px';
		loading.innerHTML = 'Loading··· ···';
	}
	
	if(cancontinue){
		//var dom = fetchDocument(request);
		var show_html = "<center><div style='font-weight:bold;color:#00d;font-size: 16px; margin-top: 10px; font-family: 微软雅黑;'>附件获取失败</div><center>";
		var oMainDiv = dom.evaluate(".//DIV[@id='mainDIV']", dom.body, "", 1);
		if (oMainDiv) {
			var ocntDiv = dom.evaluate(".//DIV[@id='mainDIV']", dom.body, "", 1);
			if (ocntDiv) {
				var obackBtnDivs = dom.evaluate(".//DIV[@onclick='window.history.back()']", ocntDiv, "", 0);
				len = obackBtnDivs.length;
				for (var i = len - 1; i > -1; i--) {
					obackBtnDivs[i].setAttribute("style", "display:none;");
				}
				show_html = ocntDiv.outerHTML;
			}
		} else {
			//println(dom.body.outerHTML)
			var obtns = dom.evaluate(".//DIV[@onclick='window.history.back()']", dom.body, "", 0);
			var len = obtns.length;
			for (var i = len - 1; i > -1; i--) {
				obtns[i].setAttribute("style", "display:none;");
			}
			var obackBtnSpans = dom.evaluate(".//SPAN[@onclick='window.history.back()']", dom.body, "", 0);
			len = obackBtnSpans.length;
			for (var i = len - 1; i > -1; i--) {
				obackBtnSpans[i].setAttribute("style", "display:none;");
			}
			//整理图片地址
			var oImgs = dom.evaluate(".//IMG", dom.body, "", 0);
			for(var i = 0; i < oImgs.length; i++){
				var oImg = oImgs[i];
				var imgSrc = oImg.getAttribute("src");
				//在前面已经转换过一次图片地址了 这里就只处理未转换过的
				if(!imgSrc.startWith(baseUrl)){
					imgSrc = baseUrl + "/attachment/" + imgSrc;
				}
				oImg.setAttribute("src", imgSrc);
				oImg.setAttribute("rewrited","false");
			}
			show_html = dom.innerHTML;
		}
	}
} catch (e) {
	var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
	log.error(fetcher.request.url, szMessage);
	println(szMessage);

}