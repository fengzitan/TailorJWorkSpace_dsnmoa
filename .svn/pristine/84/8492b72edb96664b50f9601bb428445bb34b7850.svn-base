//将字符串转换为unicode字符串
function getUnicodeString(sstr) {
	unicodestr = "";
	for ( i = 0; i < sstr.length; i++) {
		unicodestr = unicodestr + sstr.charCodeAt(i) + ";";
	}
	return unicodestr;
}

//获取当前时间

function TimeNow() {
	var d,
	    s = "&Time=";
	var c = ":";
	d = new Date();
	s += d.getHours() + c;
	s += d.getMinutes() + c;
	s += d.getSeconds() + c;
	s += d.getMilliseconds();
	return (s);
}

//去掉\r和\n
function clearrn(str) {
	if (str != "" | str != null) {
		reg = /\n/g;
		var szTemp = str.replace(reg, "");
		reg = /\r/g;
		szTemp = szTemp.replace(reg, "");
		return szTemp;
	} else {
		return str;
	}
}

function trimAll(s1) {
	re = / /g;
	return s1.replace(re, "");
}

/**
 * 打开另外页面时创建的iframe
 * 目前打开其他页面是在当前dom里创建个iframe 把iframe的src设为目标url或者form的target设为这个新的iframe
 * @param {Object} name
 */
function createNewFrm(name) {
	if ($("iframe[name='" + name + "']").length > 0)
		return;
	var frm = $("<iframe/>");
	frm.attr("name", name);
	frm.attr("id", name);
	frm.addClass("document-frame");
	frm.css("display", "none");
	frm.css("top", $(window).scrollTop() + "px");
	showLoadingMask();
	$("body").append(frm);
}

/**
 * 页面加载时从右向左推入的效果
 * @param {Object} selectorOfhide	页面推入时需要隐藏原页面的内容，这个选择器指向需要隐藏的内容的容器
 */
function leftSlidIn(selectorOfhide) {
	parent.hideLoadingMask();
	$(parent.document).find("iframe:last").show();
	$(parent.document).find("iframe:last").addClass("slide-in");
	setTimeout(function() {
		$(parent.document).find(".document-frame").css("top", 0);
		$(parent.document).find(selectorOfhide).hide();
	}, 500);
}

/**
 * 页面关闭时从右向左滑出的效果
 * 页面退出时需要显示上级页面的内容，这个选择器指向需要显示的内容的容器
 * @param {Object} selectorOfshow
 */
function leftSlidOut(selectorOfshow) {
	$(parent.document).find(selectorOfshow).show();
	$(window).scrollTop(LatestFrameYOffset);
	var frm = $(parent.document).find("iframe:last");
	frm.css("top", LatestFrameYOffset + "px");
	frm.addClass("slide-out");
	setTimeout(function() {
		frm.remove();
	}, 500);
}

/**
 * 页面关闭从右向左滑出时跳级显示爷爷页面或者更顶层页面内容
 * @param {Object} selectorOfshow 	这个选择器指向需要显示的内容的容器
 * @param {Object} containerOfshow 	需要显示的内容的容器dom对象
 * @param {Object} selectorOfHid	这个选择器指向需要隐藏的内容的容器
 * @param {Object} containerOfHid	需要隐藏的内容的容器dom对象
 */
function leftSlidOutAndShow(selectorOfshow, containerOfshow, selectorOfHid, containerOfHid) {
	selectorOfHid = (selectorOfHid) ? selectorOfHid : "iframe:last";
	containerOfshow = (containerOfshow) ? containerOfshow : parent;
	containerOfHid = (containerOfHid) ? containerOfHid : parent;
	$(containerOfshow.document).find(selectorOfshow).show();
	$(window).scrollTop(LatestFrameYOffset);
	var frm = $(containerOfHid.document).find(selectorOfHid);
	frm.css("top", LatestFrameYOffset + "px");
	frm.addClass("slide-out");
	setTimeout(function() {
		frm.remove();
	}, 500);
}

/**
 * 查找指定元素的指定tagName的父节点
 * @param {Object} obj   	要查找父节点的元素
 * @param {Object} tagName 	要查找的父节点的标签名，
 * @param {Object} limit	查询的循环最大次数, 不指定默认10次
 */
function findOwerDom(obj, tagName, limit) {
	limit = (limit) ? limit : 10;
	var parent;
	tagName = (tagName) ? tagName.toLowerCase() : "";
	if (obj && tagName != "") {
		parent = obj.parentNode;
		var idx = 0;
		while (idx < limit && parent && parent.nodeName.toLowerCase() != tagName) {
			parent = parent.parentNode;
		}
	}
	return parent;
}

/**
 *从url里取域名部分（http://xxxxx/）格式
 * @param {Object} url
 * @param {Object} withLast  传入true时  返回值会包含最后一个“/”，否则返回值去掉最后一个“/”
 */
function getbaseUrl(url, withLast) {
	var protocol = extractSegment(url, "http", "/");
	var rst = extractSegment(url, protocol + "/", "/");
	rst = (!withLast || withLast == false) ? rst.substr(0, rst.length - 1) : rst;
	return rst;
}

function extractSegment(srcStr, start, end) {
	srcStr = (srcStr) ? srcStr : "";
	var idxs = srcStr.indexOf(start);
	var tmp = srcStr.substr(idxs + start.length);
	var idxe = tmp.indexOf(end);
	tmp = tmp.substr(0, idxe);
	tmp = start + tmp + end;
	return tmp;
}

loadXML = function(xmlString) {
	var xmlDoc = null;
	//判断浏览器的类型
	//支持IE浏览器
	if (!window.DOMParser && window.ActiveXObject) {//window.DOMParser 判断是否是非ie浏览器
		var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
		for (var i = 0; i < xmlDomVersions.length; i++) {
			try {
				xmlDoc = new ActiveXObject(xmlDomVersions[i]);
				xmlDoc.async = false;
				xmlDoc.loadXML(xmlString);
				//loadXML方法载入xml字符串
				break;
			} catch(e) {
			}
		}
	}
	//支持Mozilla浏览器
	else if (window.DOMParser && document.implementation && document.implementation.createDocument) {
		try {
			/* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
			 * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
			 * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
			 * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
			 */
			domParser = new DOMParser();
			xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
		} catch(e) {
		}
	} else {
		return null;
	}

	return xmlDoc;
};
