include("timelog.util.js");
include("ip.router.js");
var oDomParser = new DOMParser();
var ACSII={' ':32,'!':33,'"':34,'#':35,'$':36,'%':37,'&':38,'\'':39,'(':40,')':41,'*':42,'+':43,',':44,'-':45,'.':46,'/':47,'0':48,'1':49,'2':50,'3':51,'4':52,'5':53,'6':54,'7':55,'8':56,'9':57,':':58,';':59,'<':60,'=':61,'>':62,'?':63,'@':64,'A':65,'B':66,'C':67,'D':68,'E':69,'F':70,'G':71,'H':72,'I':73,'J':74,'K':75,'L':76,'M':77,'N':78,'O':79,'P':80,'Q':81,'R':82,'S':83,'T':84,'U':85,'V':86,'W':87,'X':88,'Y':89,'Z':90,'[':91,'\\':92,']':93,'^':94,'_':95,'`':96,'a':97,'b':98,'c':99,'d':100,'e':101,'f':102,'g':103,'h':104,'i':105,'g':106,'k':107,'l':108,'m':109,'n':110,'o':111,'p':112,'q':113,'r':114,'s':115,'t':116,'u':117,'v':118,'w':119,'x':120,'y':121,'z':122,'{':123,'|':124,'}':125,'~':126};
// 自定义口令加解密，初始化秘钥、模
function generateKeyPair(){
	// 秘钥
	var lows = new Array();
	for (var i=0; i<63; i++) {
		// get number in [0, 255]
		var num = Math.floor(Math.random() * 255);
		// convert to BigInt and then to hex
		var hex = biToHex(biFromNumber(num));
		// only reserve low 8 bit
		var low = hex.substr(2);
		//println(i + " is " + low);
		lows.push(low);
	}
	// 模
	var mods = new Array();
	// get random number, greater than 3
	var b = 0;
	do {
		b = Math.floor(Math.random()*10);
	} while(b < 3);
	// decimal reverse to binary
	do {
		mods.push(String(b%2));
		b = parseInt(b/2);
	} while(b > 1);
	mods.push(String(1));
	return {
		"key": lows.join(""),
		"mod": mods.reverse().join("")
	};
}
/**
	自定义口令加密编码
	@param
	key	秘钥，编码原文
	m	模，字符替换步长二进制
	t	口令原文
 */
function encrypt(key, m, t){
	var n=m2d(m);
	var a=new Array();
	var k=t.length;
	for(var i=0;i<k;i++){
		var hex = biToHex(biFromNumber(ACSII[t[i]]));
		var low = hex.substr(2);
		a.push(low);
	}
	var e=key;
	var l=key.length;
	for(var i=n;i<l,a.length>0;i+=n){
		e=e.substr(0,i)+a.shift()+e.substr(i+2);
	}
	e+=biToHex(biFromNumber(k)).substr(2);
	return e;
}
/**
	自定义口令解密编码
	@param
	m	模，字符替换步进二进制
	e	口令密文
 */
function decrypt(m, e){
	var s=e;
	var k=biToDecimal(biFromHex(e.substr(-2)));
	s=s.substr(0, s.length-2);
	var ts=new Array();
	var l=s.length;
	var n=m2d(m);
	for(var i=n;i<l,k>0;i+=n,k--){
		var hex=s.substr(i,2);
		var num = biToDecimal(biFromHex(hex));
		println(hex + ", " + num);
		ts.push(getCharFromAscii(num));
	}
	return ts.join("");
}
/**
	十进制转换二进制
	@param
	m	十进制步长
 */
function m2d(m){
	var m=String(m);
	var n=0;
	for(var i=m.length-1,j=0;i>=0;i--,j++){
		n+=m[j]*Math.pow(2,i);
	}
	return n;
}
/**
	根据十进制编码在ASCII表索引字符，还原口令原文
	@param
	v	字符十进制ASCII编码
 */
function getCharFromAscii(v){
	for(var k in ACSII){
		if(v==ACSII[k])
			return k;
	}
	return null;
}
/**
 根据nodeName属性检索指定元素的父元素
 @param
 node 指定元素
 nodeName 父元素nodeName属性
 */
function findParentByNodeName(node, nodeName) {
	var parentNode = null;
	try {
		var parent = node.parentNode;
		while (parent && 1 == parent.nodeType && nodeName != parent.nodeName.toUpperCase()) {
			parent = parent.parentNode;
		};
		if (parent && nodeName == parent.nodeName.toUpperCase()) {
			parentNode = parent;
		}
	} catch (e) {
		_LOG(e, 3);
		parentNode = null;
	}
	return parentNode;
}

/**
 检索指定元素的后向兄弟文本元素
 @param
 node 指定元素
 */
function findNextTextNode(node) {
	var textNode = null;
	try {
		var nextNode = node.nextSibling;
		while (nextNode && 3 != nextNode.nodeType) {
			nextNode = nextNode.nextSibling;
		};
		if (nextNode && 3 == nextNode.nodeType)
			textNode = nextNode;
	} catch (e) {
		_LOG(e, 3);
		textNode = null;
	}
	return textNode;
}

/**
 检索指定元素的后向指定元素
 @param
 node 指定元素
 nodeName 后向兄弟元素nodeName属性
 */
function findNextSiblingByNodeName(node, nodeName) {
	var nextSiblingNode = null;
	try {
		var nextNode = node.nextSibling;
		while (nextNode && (1 != nextNode.nodeType || nodeName != nextNode.nodeName.toUpperCase())) {
			nextNode = nextNode.nextSibling;
		};
		if (nextNode && 1 == nextNode.nodeType && nodeName == nextNode.nodeName.toUpperCase())
			nextSiblingNode = nextNode;
	} catch (e) {
		_LOG(e, 3);
		nextSiblingNode = null;
	}
	return nextSiblingNode;
}

/**
 检索指定元素的前向指定元素
 @param
 node 指定元素
 nodeName 后向兄弟元素nodeName属性
 */
function findPrevSiblingByNodeName(node, nodeName) {
	var prevSiblingNode = null;
	try {
		var prevNode = node.previousSibling;
		while (prevNode && (1 != prevNode.nodeType || nodeName != prevNode.nodeName.toUpperCase())) {
			prevNode = prevNode.previousSibling;
		};
		if (prevNode && 1 == prevNode.nodeType && nodeName == prevNode.nodeName.toUpperCase())
			prevSiblingNode = prevNode;
	} catch (e) {
		_LOG(e, 3);
		prevSiblingNode = null;
	}
	return prevSiblingNode;
}

/**
	catch捕获信息控制台打印、统计
	@param exp
	Exception
	@param level
	信息等级
	1.DEBUG(default)
	2.INFO
	3.WARN
	4.ERROR
 */
function _LOG(exp, level) {
	var TYPE = level ? (1==level ? "DEBUG" : (2==level ? "INFO" : (3==level ? "WARN" : (4==level ? "ERROR" : "UNKNOWN")))) : "DEBUG";
	var TIMESTAMP = Date.now();
	println("[" + TYPE + " " + TIMESTAMP + "] " + exp.message + " at line " + exp.lineNumber + " in " + exp.fileName);
}

/**
 将键值对形式的JSON对象转换为application/x-www-form-urlencoded形式POST报文
 @param
 nameValue JSON对象
 */
function nameValue2PostEntity(nameValue) {
	var entity = new Array();
	for (var n in nameValue) {
		var v = nameValue[n];
		if (v.constructor.toString().indexOf("Function()") == -1)
			entity.push(n + "=" + encodeURIComponent(v));
	}
	return entity.join("&");
}

/**
 引擎核心方法fetcher.fetchText拓展，支持响应报头Location重定向
 @param
 request HttpServerRequest对象
 */
function fetch(request) {
	request.redirectable = false;
	var response = fetcher.fetchText(request);
	var statusCode = response.statusLine.statusCode;
	//println("request " + request.url + ", response status code is " + statusCode);
	while (statusCode > 300 && statusCode < 304) {
		if ("POST" == request.method.toUpperCase()) {
			request.method = "GET";
			request.postData = null;
		}
		var redirectedURL = absoluteURL(request.url, response.get("Location"));
		request.url = redirectedURL;
		//println("[redirect info]: " + request.method + " " + request.url);
		response = fetcher.fetchText(request);
		statusCode = response.statusLine.statusCode;
	}
	var o = new Object();
	o.statusCode = statusCode;
	o.contentType = response.contentType;
	o.text = response.text;
	o.url = request.url;
	return o;
}

/**
 在请求报头添加Cookie消息，偶尔出现报头丢失Cookie的情况
 @param
 request HttpServerRequest对象
 */
function addCookieHeader(request) {
	var preparation = new Array();
	var cookies = globalSession.getHttpCookie(_mRequest.url);
	for (var i = cookies.count - 1; i >= 0; i--) {
		var cookieName = cookies.getKey(i);
		var cookieValue = cookies.getValue(i);
		//println("send cookie: " + cookieName + "=" + cookieValue);
		preparation.push(cookieName + "=" + cookieValue);
	}
	if (preparation.length > 0)
		request.addHeader("Cookie", preparation.join("; "));
}

/**
 读取指定名称的Cookie
 @param
 base Cookie集合关联URL
 name 指定Cookie名称
 */
function getCookie(base, name) {
	var cookies = globalSession.getHttpCookie(base);
	for (var i = cookies.count - 1; i >= 0; i--) {
		var cookieName = cookies.getKey(i);
		var cookieValue = cookies.getValue(i);
		if (name == cookieName)
			return cookieValue;
	}
	return null;
}

/**
 URL形式字符串转换为全路径样式的绝对地址
 @param
 baseURL 转换依据，通常为relURL获取来源的URL
 relURL 待转换的URL形式字符串
 */
function absoluteURL(baseURL, relURL) {
	var oParser = new UriParser();
	var oBaseUri = oParser.parse(baseURL);
	var mProtocol = baseURL.indexOf("http:") == 0 ? "http" : baseURL.substr(0, baseURL.indexOf("://"));
	var mDomain = oBaseUri.authority;
	var mPath = oBaseUri.path;
	if (relURL == "") {
		return baseURL;
	} else if (relURL.indexOf("http://") == 0 || relURL.indexOf("https://") == 0) {
		return relURL;
	} else if (relURL.indexOf("/") == 0) {
		mPath = relURL;
	} else if (relURL.indexOf("./") == 0) {
		relURL = relURL.substring(2);
		if ("" == mPath) {
			mPath = "/" + relURL;
		} else if ("/" == mPath) {
			mPath += relURL;
		} else {
			var mGroup = mPath.split("/");
			mGroup.splice(mGroup.length - 1, 1, relURL);
			mPath = mGroup.join("/");
		}
	} else if (relURL.indexOf("../") == 0) {
		relURL = relURL.substring(3);
		if ("" == mPath) {
			mPath = "/" + relURL;
		} else if ("/" == mPath) {
			mPath += relURL;
		} else {
			var mGroup = mPath.split("/");
			if (mGroup.length > 2) {
				mGroup.splice(mGroup.length - 2, 2, relURL);
				mPath = mGroup.join("/");
			} else {
				mPath = "/" + relURL;
			}
		}
	} else {
		if ("" == mPath) {
			mPath = "/" + relURL;
		} else if ("/" == mPath) {
			mPath += relURL;
		} else {
			var mGroup = mPath.split("/");
			mGroup.splice(mGroup.length - 1, 1, relURL);
			mPath = mGroup.join("/");
		}
	}
	return mProtocol + "://" + mDomain + mPath;
}

/**
 从指定数据源截取JavaScript方法定义字符串
 @param
 fName 待截取Function名称
 oStream 数据源字符串
 */
function getFunctionByName(fName, oStream) {
	var pattern = new RegExp("function\\s+" + fName + "\\(");
	var r = pattern.exec(oStream);
	var s = -1;
	if (r) {
		s = oStream.indexOf(r);
	}
	if (s > -1) {
		var oSegment = oStream.substring(s);
		var s = 0;
		var e = 0;
		var bs = -1;
		var l = oSegment.length;
		for (var i = 0; i < l; i++) {
			var c = oSegment.charAt(i);
			if (c == "{") {
				if (bs == -1)
					bs = 0;
				bs++;
			} else if (c == "}") {
				bs--;
			}
			if (0 == bs) {
				e = i;
				break;
			}
		}
		if (e > 0)
			return oSegment.substring(0, e + 1);
	}
	return "";
}

/**
 从指定数据源截取JavaScript方法定义字符串，方法名前置形式
 @param
 fName 待截取Function名称
 oStream 数据源字符串
 */
function getFunctionByNamePre(fName, oStream) {
	var pattern = new RegExp(fName + "\\s*=\\s*function\\(");
	var r = pattern.exec(oStream);
	var s = -1;
	if (r) {
		s = oStream.indexOf(r);
	}
	if (s > -1) {
		var oSegment = oStream.substring(s);
		var s = 0;
		var e = 0;
		var bs = -1;
		var l = oSegment.length;
		for (var i = 0; i < l; i++) {
			var c = oSegment.charAt(i);
			if (c == "{") {
				if (bs == -1)
					bs = 0;
				bs++;
			} else if (c == "}") {
				bs--;
			}
			if (0 == bs) {
				e = i;
				break;
			}
		}
		if (e > 0)
			return oSegment.substring(0, e + 1);
	}
	return "";
}

/**
 从指定数据源截取对象成员方法定义字符串
 @param
 oName 待截取对象名称
 mName 待截取成员方法名称
 oStream 数据源字符串
 */
function getObjectMethodByName(oName, mName, oStream) {
	var pattern = new RegExp(oName + "\\.(?:prototype\\.)?" + mName + "\\s*=\\s*function\\s*\\(", "i");
	var r = pattern.exec(oStream);
	var s = -1;
	if (r) {
		s = oStream.indexOf(r);
	}
	if (s > -1) {
		var oSegment = oStream.substring(s);
		var s = 0;
		var e = 0;
		var bs = -1;
		var l = oSegment.length;
		for (var i = 0; i < l; i++) {
			var c = oSegment.charAt(i);
			if (c == "{") {
				if (bs == -1)
					bs = 0;
				bs++;
			} else if (c == "}") {
				bs--;
			}
			if (0 == bs) {
				e = i;
				break;
			}
		}
		if (e > 0)
			return oSegment.substring(0, e + 1);
	}
	return "";
}

/**
 从指定数据源截取jQuery.ready方法表达式字符串
 @param
 oStream 数据源字符串
 */
function getFunctionsInReady(oStream) {
	var s = -1;
	var m = oStream.match(/(?:\$|jquery)\(document\)\.ready\(function\(/i);
	if (m) {
		s = oStream.indexOf(m);
	}
	if (s > -1) {
		var oSegment = oStream.substring(s);
		var s = 0;
		var e = 0;
		var bs = -1;
		var l = oSegment.length;
		for (var i = 0; i < l; i++) {
			var c = oSegment.charAt(i);
			if (c == "{") {
				if (bs == -1)
					bs = 0;
				bs++;
			} else if (c == "}") {
				bs--;
			}
			if (0 == bs) {
				e = i;
				break;
			}
		}
		if (e > 0)
			return oSegment.substring(0, e + 1);
	}
	return "";
}

/**
	从指定数据源截取jQuery对象指定事件的方法表达式的字符串
	@param
	selector jQuery对象选择器（保留字符须转义）
	evName 指定事件名称
	oStream 数据源字符串
 */
function getFunctionBindOnJQObj(selector, evName, oStream) {
	var pattern = new RegExp("\\$\\(\"" + selector + "\"\\)\." + evName + "\\(\\s*function\\s*\\(", "i");
	var r = pattern.exec(oStream);
	var s = -1;
	if (r) {
		s = oStream.indexOf(r);
	}
	if (s > -1) {
		var oSegment = oStream.substring(s);
		var s = 0;
		var e = 0;
		var bs = -1;
		var l = oSegment.length;
		for (var i = 0; i < l; i++) {
			var c = oSegment.charAt(i);
			if (c == "{") {
				if (bs == -1)
					bs = 0;
				bs++;
			} else if (c == "}") {
				bs--;
			}
			if (0 == bs) {
				e = i;
				break;
			}
		}
		if (e > 0)
			return oSegment.substring(0, e + 1);
	}
	return "";
}

/**
 Form表单待提交元素序列化，符合数据发送格式
 @param
 form Form表单元素对象
 document Document元素对象
 */
function formSerialize(form, document) {
	var preparation = new Array();
	var inputs = document.evaluate(".//INPUT[@name]", form, "", 0);
	var l = inputs.length;
	for (var i = 0; i < l; i++) {
		var input = inputs.item(i);
		var name = input.getAttribute("name");
		var value = input.getAttribute("value");
		var type = input.getAttribute("type");
		switch (type) {
		case "text":
		case "password":
		case "hidden":
			preparation.push(name + "=" + encodeURIComponent(value));
			break;
		case "radio":
			break;
		case "checkbox":
			break;
		}
	}
	var selects = document.evaluate(".//SELECT[@name]", form, "", 0);
	var l = selects.length;
	for (var i = 0; i < l; i++) {
		var select = selects.item(i);
		var name = select.getAttribute("name");
		var multiple = select.hasAttribute("multiple");
		var options = document.evaluate(".//OPTION", select, "", 0);
		for (var j = 0; j < options.length; j++) {
			var option = options.item(j);
			var value = option.getAttribute("value");
			if (option.hasAttribute("selected")) {
				preparation.push(name + "=" + encodeURIComponent(value));
				break;
			}
		}
	}
	var textareas = document.evaluate(".//TEXTAREA[@name]", form, "", 0);
	var l = textareas.length;
	for (var i = 0; i < l; i++) {
		var textarea = textareas.item(i);
		var name = textarea.getAttribute("name");
		var value = textarea.getAttribute("value");
		if ("" == value) {
			var txt = textarea.textContent;
			if ("" != txt.replace(/\x0d|\x0a|\x20|\x09/g))
				value = txt;
		}
		preparation.push(name + "=" + encodeURIComponent(value));
	}
	return preparation.join("&");
}

/**
 数组对象方法拓展，判断元素项是否包含某字符串
 @param
 o 待比较字符串
 */
Array.prototype.contains = function(o) {
	if (this.length < 1)
		return false;
	for (var i = 0; i < this.length; i++) {
		var s = this[i];
		if (null != s && o == s)
			return true;
	}
	return false;
};

/**
 移除指定标签名的元素
 @param
 tagNames 指定标签名数组
 mHtml 数据源字符串
 */
function removeTags(tagNames, mHtml) {
	if (undefined == tagNames || tagNames.constructor.toString().indexOf("Array()") == -1 || tagNames.length < 1)
		return mHtml;
	// 移除meta标签
	if (tagNames.contains("meta")) {
		mHtml = mHtml.replace(/<meta\s+[^>]*?>/ig, "");
	}
	if (tagNames.contains("script")) {
		// 移除空script标签
		var _m = mHtml.match(/<script[^>]*?>(?:\x0d|\x0a|\x20|\x09)*<\/script>/ig);
		if (_m) {
			for (var i = 0; i < _m.length; i++) {
				var _sTag = _m[i];
				var _mm = _sTag.match(/<script[^>]*src=("|')(.*?)\1>(?:\x0d|\x0a|\x20|\x09)*<\/script>/i);
				if (!_mm)
					mHtml = mHtml.replace(_sTag, "");
			}
		}
		// 移除对象关联script标签
		mHtml = mHtml.replace(/<script\s+[^>]*?for=\w+[^>]*?>(?:.|\x0d|\x0a)*?<\/script>/ig, "");
	}
	// 移除link引用标签
	if (tagNames.contains("link")) {
		mHtml = mHtml.replace(/<link\s+[^>]*?>/ig, "");
	}
	// 移除title标签
	if (tagNames.contains("title")) {
		mHtml = mHtml.replace(/<title[^>]*?>.*?<\/title>/ig, "");
	}
	// 移除style样式标签
	if (tagNames.contains("style")) {
		_m = mHtml.match(/<style[^>]*?>(?:.|\x0d|\x0a)*?<\/style>/ig);
		if (_m) {
			for (var i = 0; i < _m.length; i++) {
				var _sTag = _m[i];
				var _mm = _sTag.match(/<style[^>]*?>((?:.|\x0d|\x0a)*?)<\/style>/i);
				var _sText = _mm[1];
				// 判断是否属于JavaScript表达式片段
				var _bIsJavaScript = false;
				_mm = _sText.match(/\w+\(.*?\)/g);
				if (_mm) {
					for (var j = 0; j < _mm.length; j++) {
						var _s = _mm[j];
						var _mmm = _s.match(/(\w+)\(.*?\)/);
						if ("expression" != _mmm[1]) {
							_bIsJavaScript = true;
							break;
						}
					}
				}
				if (!_bIsJavaScript) {
					mHtml = mHtml.replace(_sTag, "");
				}
			}
		}
	}
	// 移除object标签
	if (tagNames.contains("object")) {
		mHtml = mHtml.replace(/<object\s+[^>]*?>(?:\x0d|\x0a|\x20|\x09)*<\/object>/ig, "");
	}
	// 移除img标签
	if (tagNames.contains("img")) {
		mHtml = mHtml.replace(/<img\s+[^>]*?>/ig, "");
	}
	// 移除iframe标签
	if (tagNames.contains("iframe")) {
		mHtml = mHtml.replace(/<iframe\s+[^>]*?>(?:\x0d|\x0a|\x20|\x09)*<\/iframe>/ig, "");
	}
	return mHtml;
}

/**
 移除指定元素属性
 @param
 attrNames 指定属性名称
 mHtml 数据源字符串
 filterPercentage 是否过滤百分比属性
 */
function removeAttrs(attrNames, mHtml, filterPercentage) {
	// 移除标签style属性，保留hidden状态
	if (attrNames.contains("style")) {
		var _m = mHtml.match(/<\w+\s+[^>]*?style=("|')[^>\1]*?\1/ig);
		if (_m) {
			for (var i = 0; i < _m.length; i++) {
				var _sTag = _m[i];
				var _mm = _sTag.match(/(<\w+\s+[^>]*?)style=("|')([^>\2]*?)\2/i);
				var _sAttr = _mm[3];
				if (_sAttr.match(/display\s*:\s*none/i) 
					|| _sAttr.match(/visibility\s*:\s*hidden/i)) {
					mHtml = mHtml.replace(_sTag, _mm[1] + "style=" + _mm[2] + "display:none;" + _mm[2]);
				} else if (_sAttr.match(/color\s*:\s*#[a-z\d]{3,6}/i) 
					|| _sAttr.match(/color\s*:\s*rgba?\(.*?\)/i) 
					|| _sAttr.match(/color\s*:\s*[a-z]+/i)) {
					var pattern = new RegExp("color\\s*:\\s*(#[a-z\d]{3,6}|rgba?\\(.*?\\)|[a-z]+)", "i");
					var r = pattern.exec(_sAttr);
					if (r) {
						color = r[1];
						if (_mm[1].match(/<hr\s+/i)) {
							// 若HR元素color属性非默认值，且其size属性大于1，则在webkit引擎终端须增加同色background-color属性填充
							mHtml = mHtml.replace(_sTag, _mm[1] + "style=" + _mm[2] + "color:" + color + ";background-color:" + color + ";" + _mm[2]);
						} else {
							mHtml = mHtml.replace(_sTag, _mm[1] + "style=" + _mm[2] + "color:" + color + ";" + _mm[2]);
						}
					}
				} else {
					mHtml = mHtml.replace(_sTag, _mm[1]);
				}
			}
		}
	}
	// 移除标签class属性
	if (attrNames.contains("class")) {
		var _m = mHtml.match(/<\w+\s+[^>]*?class=("|')[^>\1]*?\1/ig);
		if (_m) {
			for (var i = 0; i < _m.length; i++) {
				var _sTag = _m[i];
				var _mm = _sTag.match(/(<(\w+)\s+[^>]*?)class=("|')([^>\3]*?)\3/i);
				if (_mm) {
					var _tagName = _mm[2].toUpperCase();
					var _className = _mm[4];
					if ("bpm-main-table" == _className 
						|| "bpm-text-title" == _className 
						|| "file-process-status" == _className 
						|| "file-number" == _className)
						continue;
					if ("A" == _tagName && "getMailMessage" == _className 
						|| "callBackMail" == _className 
						|| "getBackMessage" == _className)
						continue;
					mHtml = mHtml.replace(_sTag, _mm[1]);
				}
			}
		}
	}
	// 移除标签bgcolor属性
	if (attrNames.contains("bgcolor")) {
		mHtml = mHtml.replace(/(<\w+\s+[^>]*?)bgcolor=("|')[^>\2]*?\2/ig, "$1");
	}
	// 移除标签background属性
	if (attrNames.contains("background")) {
		mHtml = mHtml.replace(/(<\w+\s+[^>]*?)background=("|')[^>\2]*?\2/ig, "$1");
	}
	// 移除标签width属性（若固定宽度）
	if (attrNames.contains("width")) {
		if (filterPercentage)
			mHtml = mHtml.replace(/(<\w+\s+[^>]*?)width=("|')\d+(px|pt|em|rem)?\2/ig, "$1");
		else
			mHtml = mHtml.replace(/(<\w+\s+[^>]*?)width=("|')[^>\2]*?\2/ig, "$1");
	}
	// 移除标签height属性（若固定高度）
	if (attrNames.contains("height")) {
		if (filterPercentage)
			mHtml = mHtml.replace(/(<\w+\s+[^>]*?)height=("|')\d+(px|pt|em|rem)?\2/ig, "$1");
		else
			mHtml = mHtml.replace(/(<\w+\s+[^>]*?)height=("|')[^>\2]*?\2/ig, "$1");
	}
	// 移除标签bordercolorlight属性
	if (attrNames.contains("bordercolorlight")) {
		mHtml = mHtml.replace(/(<\w+\s+[^>]*?)bordercolorlight=("|')[^>\2]*?\2/ig, "$1");
	}
	// 移除标签bordercolordark属性
	if (attrNames.contains("bordercolordark")) {
		mHtml = mHtml.replace(/(<\w+\s+[^>]*?)bordercolordark=("|')[^>\2]*?\2/ig, "$1");
	}
	return mHtml;
}

/**
 移除指定script脚本引用
 @param
 fileNames 引用脚本名数组
 mHtml 数据源字符串
 */
function removeExternalScripts(fileNames, mHtml) {
	for (var i = 0; i < fileNames.length; i++) {
		var pattern = new RegExp("<script\\s+[^>]*?src=(\"|')[^>\\1]*?\\/" + fileNames[i] + "\\.js\\1[^>]*?>(?:\\x0d|\\x0a|\\x20|\\x09)*<\\/script>", "ig");
		mHtml = mHtml.replace(pattern, "");
	}
	return mHtml;
}

/**
 批量删除JavaScript方法定义
 @param
 funcNames 指定JavaScript方法名称
 mHtml 数据源字符串
 */
function deleteJsFunctions(funcNames, mHtml) {
	for (var i = 0; i < funcNames.length; i++) {
		var fName = funcNames[i];
		var func = getFunctionByName(fName, mHtml);
		if ("" != func) {
			mHtml = mHtml.replace(func, "");
		}
	}
	return mHtml;
}

/**
	批量删除重复定义的JavaScript方法，须同IE效果仅最后一个声明有效
	@param
	funcNames	指定JavaScript方法名称
	mHtml		数据源字符串
 */
function deleteDuplicateJsFunctions(funcNames, mHtml) {
	for (var i=0; i<funcNames.length; i++) {
		var fName = funcNames[i];
		var pattern = new RegExp("function\\s+" + fName + "\\(", "g");
		var m = mHtml.match(pattern);
		if (m && m.length > 1) {
			var n = m.length;
			do {
				var func = getFunctionByName(fName, mHtml);
				if ("" != func) {
					--n;
					mHtml = mHtml.replace(func, "");
				}
			} while(n > 1);
		}
	}
	return mHtml;
}

/**
 设置文本input不可编辑
 @param
 xpath 检索规则
 field 检索范围
 document 文档DOM上下文
 */
function setTextInputNotEditable(xpath, field, document) {
	var _oInputs = document.evaluate(xpath, field, "", 0);
	for (var i = 0; i < _oInputs.length; i++) {
		var _oInput = _oInputs.item(i);
		var _sValue = _oInput.getAttribute("value");
		_oInput.setAttribute("type", "hidden");
		if ("" != _sValue) {
			var _oTextNode = document.createTextNode(_sValue);
			_oInput.parentNode.insertBefore(_oTextNode, _oInput);
		}
	}
}

/**
 设置checkbox不可编辑
 @param
 xpath 检索规则
 field 检索范围
 document 文档DOM上下文
 */
function setCheckBoxNotEditable(xpath, field, document) {
	var _oCheckBoxes = document.evaluate(xpath, field, "", 0);
	if (_oCheckBoxes.length > 0) {
		var _oChecked = new Array();
		for (var i = 0; i < _oCheckBoxes.length; i++) {
			var _oCheckBox = _oCheckBoxes.item(i);
			_oCheckBox.setAttribute("style", "display:none");
			var _oTextNode = findNextTextNode(_oCheckBox);
			if (_oTextNode) {
				if (_oCheckBox.hasAttribute("checked")) {
					_oChecked.push(_oTextNode.nodeValue);
				}
				_oTextNode.parentNode.removeChild(_oTextNode);
			}
		}
		if (_oChecked.length > 0) {
			var _oCheckBox = _oCheckBoxes.item(0);
			var _oTextNode = document.createTextNode(_oChecked.join("&nbsp;"));
			_oCheckBox.parentNode.insertBefore(_oTextNode, _oCheckBox);
		}
	}
}

/**
 设置radio不可编辑
 @param
 xpath 检索规则
 field 检索范围
 document 文档DOM上下文
 */
function setRadioNotEditable(xpath, field, document) {
	var _oRadios = document.evaluate(xpath, field, "", 0);
	if (_oRadios.length > 0) {
		var _sChecked = "";
		for (var i = 0; i < _oRadios.length; i++) {
			var _oRadio = _oRadios.item(i);
			_oRadio.setAttribute("style", "display:none");
			var _oTextNode = findNextTextNode(_oRadio);
			if (_oTextNode) {
				if (_oRadio.hasAttribute("checked")) {
					_sChecked = _oTextNode.nodeValue;
				}
				_oTextNode.parentNode.removeChild(_oTextNode);
			}
		}
		if ("" != _sChecked) {
			var _oRadio = _oRadios.item(0);
			var _oTextNode = document.createTextNode(_sChecked);
			_oRadio.parentNode.insertBefore(_oTextNode, _oRadio);
		}
	}
}

/**
 设置textarea不可编辑
 @param
 refer 检索对象依据，XPath或HTMLElement
 field 检索范围
 document 文档DOM上下文
 */
function setTextAreaNotEditable(refer, field, document) {
	if (refer.constructor.toString().indexOf("String()") > -1 && refer.match(/\.\/\/?\w+/)) {
		var _oTextAreas = document.evaluate(refer, field, "", 0);
		for (var i=0; i<_oTextAreas.length; i++) {
			var _oTextArea = _oTextAreas.item(i);
			setSingleTextAreaNotEditable(_oTextArea, document);
		}
	} else if (refer.constructor.toString().indexOf("HTMLTextAreaElement()") > -1) {
		var _oTextArea = refer;
		setSingleTextAreaNotEditable(_oTextArea, document);
	}
}

/**
	设置HTMLTextAreaElement对象不可编辑
	@param
	element HTMLTextAreaElement对象
	document 文档DOM上下文
 */
function setSingleTextAreaNotEditable(element, document) {
	element.setAttribute("style", "display:none");
	var text = element.getAttribute("value");
	if ("" == text) {
		text = element.innerHTML;
	}
	if ("" != text) {
		var textNode = document.createTextNode(text);
		element.parentNode.insertBefore(textNode, element);
	}
}

/**
 设置select选择器不可编辑
 @param
 refer 检索对象依据，XPath或HTMLElement
 field 检索范围
 document 文档DOM上下文
 */
function setSelectNotEditable(refer, field, document) {
	if (refer.constructor.toString().indexOf("String()") > -1 && refer.match(/\.\/\/?\w+/)) {
		var _oSelects = document.evaluate(refer, field, "", 0);
		for (var i=0; i<_oSelects.length; i++) {
			var _oSelect = _oSelects.item(i);
			setSingleSelectNotEditable(_oSelect, document);
		}
	} else if (refer.constructor.toString().indexOf("HTMLSelectElement()") > -1) {
		var _oSelect = refer;
		setSingleSelectNotEditable(_oSelect, document);
	}
}

/**
	设置HTMLSelectElement对象不可编辑
	@param
	element HTMLSelectElement对象
	document 文档DOM上下文
 */
function setSingleSelectNotEditable(element, document) {
	element.setAttribute("style", "display:none");
	var option = document.evaluate("./OPTION[@selected]", element, "", 1);
	if (option) {
		var textNode = document.createTextNode(option.textContent);
		element.parentNode.insertBefore(textNode, element);
	}
}

/**
 批量处理Tools对象成员方法showAlert、showError和showConfirm中
 URL参数绝对化及添加引擎前缀
 @param
 baseURL 绝对化依据，通常为数据源的URL
 html 方法定义数据源
 */
function batchFillUpToolsMethod(baseURL, html) {
	var _showAlert = getFunctionByName("showAlert", html);
	if ("" != _showAlert) {
		var _nShowAlert = _showAlert;
		var _m = _nShowAlert.match(/\x0a(?:\x20|\x09)*\w+\.showAlert\(\w+\s*,\s*\w+\s*,\s*\w+\s*,\s*("|')(.*?)\1/);
		if (_m) {
			var _url = _m[2];
			var _nUrl = TAILOR_BASE_URL + absoluteURL(baseURL, _url);
			_nShowAlert = _nShowAlert.replace(/\x0a((?:\x20|\x09)*)(\w+\.showAlert\(\w+\s*,\s*\w+\s*,\s*\w+\s*,)\s*("|').*?\3/, "\x0a$1$2\"" + _nUrl + "\"");
		}
		if (_nShowAlert != _showAlert) {
			//println(_nShowAlert);
			html = html.replace(_showAlert, _nShowAlert);
		}
	}
	var _showError = getFunctionByName("showError", html);
	if ("" != _showError) {
		var _nShowError = _showError;
		var _m = _nShowError.match(/\x0a(?:\x20|\x09)*\w+\.showError\(\w+\s*,\s*\w+\s*,\s*\w+\s*,\s*("|')(.*?)\1/);
		if (_m) {
			var _url = _m[2];
			var _nUrl = TAILOR_BASE_URL + absoluteURL(baseURL, _url);
			_nShowError = _nShowError.replace(/\x0a((?:\x20|\x09)*)(\w+\.showError\(\w+\s*,\s*\w+\s*,\s*\w+\s*,)\s*("|').*?\3/, "\x0a$1$2\"" + _nUrl + "\"");
		}
		if (_nShowError != _showError) {
			//println(_nShowError);
			html = html.replace(_showError, _nShowError);
		}
	}
	var _showConfirm = getFunctionByName("showConfirm", html);
	if ("" != _showConfirm) {
		var _nShowConfirm = _showConfirm;
		var _m = _nShowConfirm.match(/\x0a(?:\x20|\x09)*return\s+\w+\.showConfirm\(\w+\s*,\s*\w+\s*,\s*\w+\s*,\s*\w+\s*,\s*("|')(.*?)\1/);
		if (_m) {
			var _url = _m[2];
			var _nUrl = TAILOR_BASE_URL + absoluteURL(baseURL, _url);
			_nShowConfirm = _nShowConfirm.replace(/\x0a((?:\x20|\x09)*)(return\s+\w+\.showConfirm\(\w+\s*,\s*\w+\s*,\s*\w+\s*,\s*\w+\s*,)\s*("|').*?\3/, "\x0a$1$2\"" + _nUrl + "\"");
		}
		if (_nShowConfirm != _showConfirm) {
			//println(_nShowConfirm);
			html = html.replace(_showConfirm, _nShowConfirm);
		}
	}
	return html;
}

/* 树状图数据源XML解析 */
function coSelection(node) {
	var oSelection = new Array();
	var children = node.childNodes;
	for (var i = 0; i < children.length; i++) {
		var child = children.item(i);
		if ("ITEM" == child.nodeName.toUpperCase()) {
			oSelection.push(coDepartment(child));
		} else if ("ITEMS" == child.nodeName.toUpperCase()) {
			oSelection.push(coEmployee(child));
		}
	}
	return oSelection;
}

function coDepartment(node) {
	var oDepartment = new Object();
	oDepartment.type = "dept";
	oDepartment.id = node.getAttribute("id");
	oDepartment.level = node.getAttribute("le");
	oDepartment.name = node.getAttribute("name");
	oDepartment.isOpen = false;
	oDepartment.children = coSelection(node);
	return oDepartment;
}

function coEmployee(node) {
	var oEmployee = new Object();
	oEmployee.type = "emp";
	oEmployee.id = node.getAttribute("id");
	oEmployee.name = node.getAttribute("name");
	return oEmployee;
}

function mailSSO(){
	if (application.get("sid")) {
		return;
	}
	var mRequest = new HttpServerRequest();
	mRequest.method = "GET";
	mRequest.url = application.get("mail_entry");
	
	var mResponse = fetch(mRequest);
	var mHtml = mResponse.text;
	
	var url = "";
	var userid = "";
	var appid = "";
	var m = mHtml.match(/<body\s+[^>]*?onload=("|')(.*?)\1/i);
	if (m) {
		var load = m[2].trim();
		var mm = load.match(/reDirectForSMAP\(("|')(.*?)\1\s*,\s*("|')(.*?)\3\s*,\s*("|')(.*?)\5/);
		if (mm) {
			url = mm[2];
			userid = mm[4];
			appid = mm[6];
		}
	}
	
	var smap = "";
	var type = "";
	var m = mHtml.match(/<script\s+[^>]*src=("|')([^\1>]*?\/utils\.js)\1/i);
	if (m) {
		var oRequest = new HttpServerRequest();
		oRequest.method = "GET";
		oRequest.url = absoluteURL(mResponse.url, m[2]);
		
		var oResponse = fetch(oRequest);
		var oHtml = oResponse.text;
		
		var reDirectForSMAP = getFunctionByName("reDirectForSMAP", oHtml);
		if ("" != reDirectForSMAP) {
			var mm = reDirectForSMAP.match(/\x0a(?:\x20|\x09)*url\s*:\s*("|')(.*?)\1/);
			if (mm) {
				smap = mm[2];
				if ("" != smap) {
					smap = absoluteURL(oResponse.url, smap);
				}
			}
			var mm = reDirectForSMAP.match(/\x0a(?:\x20|\x09)*type\s*:\s*("|')(.*?)\1/);
			if (mm) {
				type = mm[2].toUpperCase();
			}
		}
	}
	var sid = "";
	var account = "";
	if ("" == url 
		|| "" == userid 
		|| "" == appid 
		|| "" == smap 
		|| "" == type) {
	} else {
		var query = "userid=" + encodeURIComponent(userid) + "&remoteappid=" + encodeURIComponent(appid);
		var nRequest = new HttpServerRequest();
		nRequest.method = type;
		if ("GET" == type) {
			nRequest.url = smap.indexOf("?") !== false ? smap + "&" + query : smap + "?" + query;
		} else {
			nRequest.url = smap;
			nRequest.postData = query;
		}
		
		var nResponse = fetch(nRequest);
		var nText = nResponse.text;
		
		var request = new HttpServerRequest();
		var nQuery = "SMAP_SESSION_DATA=" + encodeURIComponent(nText.trim());
		request.url = url.indexOf("?") !== false ? url + "&" + nQuery : url + "?" + nQuery;
		
		var response = fetch(request);
		var html = response.text;
		
		var m = html.match(/\ssid\s*:\s*("|')(.*?)\1/);
		if (m) {
			sid = m[2];
		}
		m = html.match(/\sloginName\s*:\s*("|')(.*?)\1/);
		if (m) {
			account = m[2];
		}
	}
	if ("" != sid && "" != account) {
		application.set("sid", sid);
		application.set("account", account);
	}
}
//#########################################################################################

//从字符串解析HTML Dom对象
//author : fang
function getHTMLDomFromText(str) {
	var oDOMParser = new DOMParser();
	var oDocument = oDOMParser.parseFromString(str, "text/html");
	return oDocument;
}

//从字符串解析XML Dom对象
//author : fang
function getXMLDomFromText(str) {
	var oDOMParser = new DOMParser();
	var oDocument = oDOMParser.parseFromString(str, "text/xml");
	return oDocument;
}

//从HTML Document对象里查找指定name的hidden元素
//author : fang
function findHiddenElementByName(name, document) {
	var element = document.evaluate(".//INPUT[@type='hidden' and @name='" + name + "']", document, "", 1);
	return element;
}

//向request.url发送请求，响应结果是document对象
function fetchDocument(request) {
	var oWebResponse = fetcher.fetchDocument(request);
	var oDocument = oWebResponse.document;
	return oDocument;
}

//使用默认编码（UTF-8）向request.url发送请求，响应结果是String
function fetchText(request) {
	var szText = "";
	if (request.url.toLowerCase().endWith(".mht")) {
		var oWebResponse = fetcher.fetchStream(request);
		var oStream = oWebResponse.stream;
		szText = parseMHToHTML(oStream);
	} else {
		var oWebResponse = fetcher.fetchText(request);
		szText = oWebResponse.text;
	}
	return szText;
}

//使用指定编码（UTF-8）向request.url发送请求，响应结果是String
function fetchTextEncoding(request, encoding) {
	var szText = "";
	if (request.url.toLowerCase().endWith(".mht")) {
		var oWebResponse = fetcher.fetchStream(request);
		var oStream = oWebResponse.stream;
		szText = parseMHToHTML(oStream);
	} else {
		var oWebResponse = fetcher.fetchText(request, encoding);
		szText = oWebResponse.text;
	}
	return szText;
}

//检查文档编辑状态是否完成
function checkLotusEditDocumentAccomplished(url, text) {
	var accomplished = false;
	if (url.indexOf("EditDocument") > -1 && text.indexOf("/names.nsf?Login") > -1) {
		accomplished = true;
	}
	return accomplished;
}

//获取指定容器范围里的隐藏元素HTML
/**
 * @param
 *  document: 整个文档的dom
 *  range： 容器对象
 */
function getHiddenParas(document, range) {
	range = (range) ? range : document;
	var paras = "";
	var list = document.evaluate(".//INPUT[@type='hidden']", range, "", 0);
	for (var i = 0; i < list.length; i++) {
		paras += list[i].outerHTML;
	}
	return paras;
}

//获取指定容器范围里的隐藏元素HTML同时将这个元素从dom里清除掉
/**
 * @param
 *  document: 整个文档的dom
 *  range： 容器对象
 */
function clearHiddenParas(document, range) {
	range = (range) ? range : document;
	var paras = getHiddenParas(document, range);
	var oHiddens = document.evaluate(".//INPUT[@type='hidden']", range, "", 0);
	for (var i = 0; i < oHiddens.length; i++) {
		var oHidden = oHiddens[i];
		oHidden.parentNode.removeChild(oHidden);
	}
	return paras;
}

//把表格转换为每行2列的形式
function convertTableWith2td(doc, oTable, firstTdWidth, secondTdWidth, firstTdClass, secondTdClass) {
	if (doc && oTable) {
		firstTdWidth = (firstTdWidth) ? firstTdWidth : "20%";
		secondTdWidth = (secondTdWidth) ? secondTdWidth : "auto";
		firstTdClass = (firstTdClass) ? firstTdClass : "";
		secondTdClass = (secondTdClass) ? secondTdClass : "";
		var newTdWidth;
		var newTdClass;
		var newTable = oTable.cloneNode(false);
		var oTds = doc.evaluate("./TBODY/TR/TD", oTable, "", 0);
		if (oTds) {
			var newTd;
			var oTd;
			var newTR;
			for (var i = 0; i < oTds.length; i++) {
				var add2Table = false;
				oTd = oTds.item(i);
				if (i % 2 == 0) {
					newTdWidth = firstTdWidth;
					newTR = doc.createElement("TR");
					newTdClass = ("" === firstTdClass) ? "" : firstTdClass;
					add2Table = false;
				} else {
					add2Table = true;
					newTdWidth = secondTdWidth;
					newTdClass = ("" === secondTdClass) ? "" : secondTdClass;
				}
				newTd = oTd.cloneNode(true);
				if (i % 2 == 0) {
					var innerHTML = newTd.innerHTML;
					// 移除中文冒号
					if (innerHTML.indexOf("：") > -1)
						innerHTML = innerHTML.replace("：", "");
					// 移除英文冒号，规避影响渲染属性，优先转换
					var hasDisplayStyle = /display\s*:\s*none/.test(innerHTML);
					var hasColorStyle = /color\s*:\s*#\w{3,6}/.test(innerHTML);
					if (hasDisplayStyle)
						innerHTML = innerHTML.replace(/display\s*:\s*none/g, "display|none");
					if (hasColorStyle)
						innerHTML = innerHTML.replace(/color\s*:\s*(#\w{3,6})/g, "color|$1");
					if (innerHTML.indexOf(":") > -1)
						innerHTML = innerHTML.replace(":", "");
					// 渲染属性还原
					if (hasDisplayStyle)
						innerHTML = innerHTML.replace(/display\|none/g, "display:none");
					if (hasColorStyle)
						innerHTML = innerHTML.replace(/color\s*\|\s*(#\w{3,6})/g, "color:$1");
					// 移除占位&nbsp;标示符
					if (innerHTML.indexOf("&nbsp;") > -1)
						innerHTML = innerHTML.replace(/&nbsp;/g, "");
					newTd.innerHTML = innerHTML;
				} else {
					var innerHTML = newTd.innerHTML;
					// 移除占位&nbsp;标示符
					if (innerHTML.indexOf("&nbsp;") > -1)
						innerHTML = innerHTML.replace(/&nbsp;/g, "");
					newTd.innerHTML = innerHTML;
				}
				newTd.removeAttribute("colspan");
				newTd.removeAttribute("rowspan");
				if ("" != newTdClass) {
					newTd.setAttribute("class", newTdClass);
				}
				newTd.removeAttribute("width");
				newTd.setAttribute("width", newTdWidth);
				var oTr = findParentByNodeName(oTd, "TR");
				if (/(display\s*:\s*none;|visibility\s*:\s*hidden;)/.test(oTr.getAttribute("style")))
					newTR.setAttribute("style", "display:none;");
				newTR.appendChild(newTd);
				if (add2Table) {
					newTable.appendChild(newTR);
				}
			}
		}
		return newTable;
	}
}

//将字符串转换为unicode字符串
function getUnicodeString(sstr) {
	sstr = (sstr)? sstr : "";
	unicodestr = "";
	for ( i = 0; i < sstr.length; i++) {
		unicodestr = unicodestr + sstr.charCodeAt(i) + ";";
	}
	return unicodestr;
}

/******************** string 的相关操作扩展 ****************************/

String.prototype.isEmpty = function() {
	return /^\s*$/.test(this);
};

String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
};

String.prototype.ltrim = function() {
	return this.replace(/(^\s*)/g, "");
};

String.prototype.rtrim = function() {
	return this.replace(/(\s*$)/g, "");
};

String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
};

String.prototype.endWith = function(str) {
	if (str == null || str == "" || this.length == 0 || str.length > this.length)
		return false;
	if (this.substring(this.length - str.length) == str)
		return true;
	else
		return false;
	return true;
};

String.prototype.startWith = function(str) {
	if (str == null || str == "" || this.length == 0 || str.length > this.length)
		return false;
	if (this.substr(0, str.length) == str)
		return true;
	else
		return false;
	return true;
};
/******************** end of  string 的相关操作扩展 ****************************/

//清除掉字符串里的/r /n
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

//去掉字符串前后的空格
function allTrim(str) {
	if (str != "" | str != null) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}
}

function trimAll(s1) {
	re = / /g;
	return s1.replace(re, "");
}

//取当前时间
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

/**
 *从url里取域名部分（http://xxxxx/）格式
 * @param {Object} url
 * @param {Object} withLast  传入true时  返回值会包含最后一个“/”，否则返回值去掉最后一个“/”
 */
function getbaseUrl(url, withLast) {
	var oTextShears = new TextShears();
	var protocol = oTextShears.extractSegment(url, "http", "/");
	var rst = oTextShears.extractSegment(url, protocol + "/", "/");
	rst = (!withLast || withLast == false) ? rst.substr(0, rst.length - 1) : rst;
	return rst;
}

//记录业务日志
function logCMCC() {

}

//把表格转换为每行2列的形式,
//convType 转换成每行一列还是每行2列  1： 每行一列  其他值 每行2列
function convertTableWith2td_withTdspan(doc, oTable, firstTdWidth, secondTdWidth, convType, firstTdClass, secondTdClass) {
	var newTable = oTable;
	if (doc && oTable) {
		newTable = oTable.cloneNode(false);
		firstTdWidth = (firstTdWidth) ? firstTdWidth : "20%";
		secondTdWidth = (secondTdWidth) ? secondTdWidth : "auto";
		firstTdClass = (firstTdClass) ? firstTdClass : "";
		secondTdClass = (secondTdClass) ? secondTdClass : "";
		convType = (convType) ? convType : 2;
		convType = (convType > 1) ? 2 : 1;
		var oTrs = doc.evaluate("./TBODY/TR", oTable, "", 0);
		if (oTrs && oTrs.length > 0) {
			var oTR;
			//用第一行判断每行有多少个td
			var colCountPerTr = 0;
			var tmpTds = doc.evaluate("./TD", oTrs[0], "", 0);
			if (tmpTds) {
				var colSpanVal;
				for (var i = 0; i < tmpTds.length; i++) {
					colSpanVal = tmpTds[i].hasAttribute("colspan") ? parseInt(tmpTds[i].getAttribute("colspan")) : 1;
					if (colSpanVal && colSpanVal > 1) {
						colCountPerTr = colCountPerTr + colSpanVal;
					} else {
						colCountPerTr++;
					}
				}
				var newColsVal = 0;
				//列数为偶数才转 否则直接返回原表格
				if (colCountPerTr % 2 == 0 || convType == 1) {
					//如果colCountPerTr大于2 就要判断所有偶数列中最大的colspan值
					if (colCountPerTr > 2) {
						for (var i = 0; i < oTrs.length; i++) {
							var tds = doc.evaluate("./TD", oTrs[i], "", 0);
							if (tds.length % 2 == 0) {
								for (var j = 0; j < tds.length; j++) {
									colSpanVal = tds[j].hasAttribute("colspan") ? parseInt(tds[j].getAttribute("colspan")) : 1;
									//ph modified 130104 tmpTds[j]->tds[j]
									if (colSpanVal && colSpanVal > 1) {
										newColsVal = (colSpanVal > newColsVal) ? colSpanVal : newColsVal;
									}
								}
							} else {
								newColsVal = colCountPerTr - 1;
								break;
							}
						}
						if (convType == 1) {
							newColsVal = colCountPerTr - 0;
						}
					}
					var spanValue = 0;
					for (var j = 0; j < oTrs.length; j++) {
						oTR = oTrs.item(j);
						var newTR;
						//看这行有没有rowspan 如果有就要保留原样
						var rowSpanTds = doc.evaluate("./TD[@rowspan]", oTR, "", 0);
						var maxSpanValInTr = 0;
						for (var k = 0; k < rowSpanTds.length; k++) {
							var ospanval = parseInt(rowSpanTds[k].getAttribute("rowspan"));
							maxSpanValInTr = (ospanval > maxSpanValInTr) ? ospanval : maxSpanValInTr;
						}
						maxSpanValInTr = (maxSpanValInTr > 1) ? maxSpanValInTr : 0;
						spanValue = spanValue + maxSpanValInTr;
						var oTds = doc.evaluate("./TD", oTR, "", 0);
						//如果这行列数为单数,或者还处于rowpan区域就保留原样
						if (oTds.length % 2 != 0 || spanValue > 0) {
							newTR = oTR.cloneNode(true);
							newTable.appendChild(newTR);
							if (spanValue > 0) {
								spanValue--;
							}
						} else {
							for (var i = 0; i < oTds.length; i++) {
								var add2Table = false;
								oTd = oTds.item(i);
								if (convType == 1) {
									add2Table = true;
									newTdWidth = "100%";
									newTdClass = firstTdClass;
									newTR = oTR.cloneNode(false);
								} else {
									if (i % 2 == 0) {//新行
										newTdWidth = firstTdWidth;
										newTdClass = firstTdClass;
										newTR = oTR.cloneNode(false);
										add2Table = false;
									} else {
										add2Table = true;
										newTdWidth = secondTdWidth;
										newTdClass = secondTdClass;
									}
								}
								newTd = oTd.cloneNode(true);
								if (i % 2 == 0) {
									var innerHTML = newTd.innerHTML;
									// 移除中文冒号
									if (innerHTML.indexOf("：") > -1)
										innerHTML = innerHTML.replace("：", "");
									// 移除英文冒号，规避影响渲染属性，优先转换
									var hasDisplayStyle = /display\s*:\s*none/.test(innerHTML);
									var hasColorStyle = /color\s*:\s*#\w{3,6}/.test(innerHTML);
									if (hasDisplayStyle)
										innerHTML = innerHTML.replace(/display\s*:\s*none/g, "display|none");
									if (hasColorStyle)
										innerHTML = innerHTML.replace(/color\s*:\s*(#\w{3,6})/g, "color|$1");
									if (innerHTML.indexOf(":") > -1)
										innerHTML = innerHTML.replace(":", "");
									// 渲染属性还原
									if (hasDisplayStyle)
										innerHTML = innerHTML.replace(/display\|none/g, "display:none");
									if (hasColorStyle)
										innerHTML = innerHTML.replace(/color\s*\|\s*(#\w{3,6})/g, "color:$1");
									// 移除占位&nbsp;标示符
									if (innerHTML.indexOf("&nbsp;") > -1)
										innerHTML = innerHTML.replace(/&nbsp;/g, "");
									newTd.innerHTML = innerHTML;
								} else {
									var innerHTML = newTd.innerHTML;
									// 移除占位&nbsp;标示符
									if (innerHTML.indexOf("&nbsp;") > -1)
										innerHTML = innerHTML.replace(/&nbsp;/g, "");
									// 移除冗余br换行元素
									var pattern = new RegExp("<br\\s*\\/>(?:\\x20|\\x09|\\x0d|\\x0a)*<img\\s+[^>]*?>(?:\\x20|\\x09|\\x0d|\\x0a)*$", "i");
									if (pattern.exec(innerHTML))
										innerHTML = innerHTML.replace(pattern, "");
									pattern = new RegExp("<br\\s*\\/>(?:\\x20|\\x09|\\x0d|\\x0a)*", "i");
									if (pattern.exec(innerHTML))
										innerHTML = innerHTML.replace(pattern, "");
									newTd.innerHTML = innerHTML;
								}
								if (newColsVal > 1 && add2Table == true) {
									newTd.setAttribute("colspan", newColsVal);
								} else {
									newTd.removeAttribute("colspan");
								}
								//newTd.removeAttribute("rowspan");
								newTd.removeAttribute("width");
								newTd.removeAttribute("align");
								newTd.removeAttribute("valign");
								newTd.setAttribute("style", "width:" + newTdWidth);
								newTd.setAttribute("class", newTdClass);
								newTR.appendChild(newTd);
								if (add2Table) {
									newTable.appendChild(newTR);
								}
							}
						}
					}
				} else {
					newTable = oTable;
				}
			}
		}

	}
	return newTable;
}

/**
 * 解码POST参数并转换成JSON字符串
 * @param request 需要解码的字符串所在的request
 * @return {String} 解码后的JSON字符串
 */
function unEscapeToJson(request) {
	var postData = urlDecoder(request.postData, "utf-8").split("&");
	var temp_json = {};
	for (var i = 0; i < postData.length; i++) {
		var temp_text = postData[i];
		var key = temp_text.substring(0, temp_text.indexOf("="));
		var val = temp_text.substring(temp_text.indexOf("=") + 1, temp_text.length);
		temp_json[key] = val;
	}
	return temp_json;
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * @param {Object} fmt
 */
Date.prototype.Format = function(fmt) {//author: meizz
	var o = {
		"M+" : this.getMonth() + 1, //月份
		"d+" : this.getDate(), //日
		"h+" : this.getHours(), //小时
		"m+" : this.getMinutes(), //分
		"s+" : this.getSeconds(), //秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), //季度
		"S" : this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt))
		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

/**
 *将一段html片段解析成htmldom ，方式是使用一个指定的div包裹html代码然后返回这个div的childNodes
 * @param {Object} html
 * @param {Object} selector 查找dom的xpath： 因为DOMParser生成的dom有<html> <body>等标签，需要根据selector来选择元素
 * @param {Object} document 生成对象依附的document，如果不传的话就会使用domparser创建一个document
 * @return  返回HTMLDOM对象，以<HTML></HTML>包裹；生成的dom 放在id=fixed_containerDiv的div里
 */
function parse2Dom(html) {
	var parser = new DOMParser();
	var document = parser.parseFromString(html, "text/html");
	var newDiv = document.createElement("DIV");
	newDiv.setAttribute("id", "fixed_containerDiv");
	newDiv.innerHTML = html;
	document.body.innerHTML = newDiv.outerHTML;
	return document;
}

function logAdjunct(url, message) {
	var szMessage = application.get("LOG.Message.SUBJECT");
	if (szMessage) {
		log.adjunct(url, szMessage + "的附件:" + message + ".");
	} else {
		log.adjunct(url, "附件:" + message + ".");
	}
}

/**
 *HTML编码
 */
function htmlEncode(str) {
	var s = "";
	if (!str.length || str.length == 0)
		return "";
	s = str.replace(/&/g, "&amp;");
	s = s.replace(/ /g, "&nbsp;");
	s = s.replace(/</g, "&lt;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/\'/g, "&#39;");
	s = s.replace(/\"/g, "&quot;");
	s = s.replace(/\n/g, "<br>");
	return s;
}

/*
 函数：把字符串转换为日期对象
 参数：yyyy-mm-dd hh:MM:ss或dd/mm/yyyy形式的字符串
 返回：Date对象
 注：IE下不支持直接实例化日期对象，如new Date("2011-04-06")
 */
Date.prototype.convertDate = function(date) {
	var flag = true;
	var dateParts = date.split(" ");
	var datefrontParts = dateParts[0].split("-");
	if(datefrontParts.length != 3) {
		datefrontParts = dateParts[0].split("/");
		if(datefrontParts.length != 3) {
			return null;
		}
		flag = false;
	}
	var newDate = new Date();
	if(flag) {
		// month从0开始
		newDate.setFullYear(datefrontParts[0], datefrontParts[1] - 1, datefrontParts[2]);
	} else {
		newDate.setFullYear(datefrontParts[2], datefrontParts[1] - 1, datefrontParts[0]);
	}
	if(date.indexOf(":") > -1) {
		var dateBackParts = dateParts[1].split(":");
		var iHour = parseInt(dateBackParts[0], 10);
		var iMinute = parseInt(dateBackParts[1], 10);
		var iSecond = parseInt(dateBackParts[2], 10);
		newDate.setHours(iHour, iMinute, iSecond);
	} else {
		newDate.setHours(0, 0, 0);
	}
	return newDate;
};

/*
 函数：计算两个日期之间的差值
 参数：date是日期对象
 flag：ms-毫秒，s-秒，m-分，h-小时，d-天，M-月，y-年
 返回：当前日期和date两个日期相差的毫秒/秒/分/小时/天
 */
Date.prototype.dateDiff = function(date, flag) {
	var msCount;
	var diff =  this.getTime() -  date.getTime();
	switch (flag) {
		case "ms":
			msCount = 1;
			break;
		case "s":
			msCount = 1000;
			break;
		case "m":
			msCount = 60 * 1000;
			break;
		case "h":
			msCount = 60 * 60 * 1000;
			break;
		case "d":
			msCount = 24 * 60 * 60 * 1000;
			break;
	}
	return Math.floor(diff / msCount);
};

var t = new T({
	filename:'other.js',
	business:'其他'
});
fetcher.fetchDocument_ = fetcher.fetchDocument;
fetcher.fetchText_ = fetcher.fetchText;
fetcher.fetchStream_ = fetcher.fetchStream;

fetcher.fetchDocument = function(request,encoding){
	encode = encoding||'';
	t.probe('request',request,t.reqCode||t.requestNum++);
	iprouter(request);
	var document = fetcher.fetchDocument_(request,encode);
	t.probe('response');
	return document;
}
fetcher.fetchText = function(request,encoding){
	encode = encoding||'';
	t.probe('request',request,t.reqCode||t.requestNum++);
	iprouter(request);
	var text = fetcher.fetchText_(request,'');
	t.probe('response');
	return text;
}
fetcher.fetchStream = function(request,encoding){
	encode = encoding||'';
	t.probe('request',request,t.reqCode||t.requestNum++);
	iprouter(request);
	var stream = fetcher.fetchStream_(request,encode);
	t.probe('response');
	return stream;
}

/**
 * 地址路由
 * @param  {[type]} request [description]
 * @return {[type]}         [description]
 */
function iprouter(request){
	for(key in routerTable){
		var regexp = new RegExp('^'+key);
		if(request.url.match(regexp)){
			t.out('地址路由：'+key+' router to '+routerTable[key]);
			request.url = request.url.replace(key,routerTable[key]);
		}
	}
}