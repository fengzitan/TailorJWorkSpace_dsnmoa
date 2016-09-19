include("conf.js");
include("util.js");

var fileMainPageURL = "";
var contentType = "";
var contentDisposition = "";
var oWebResponse = null;
var TAILOR_DOWNLOAD_FLAG1 = "/$TAILORDOWNLOADFILE$/";
var TAILOR_DOWNLOAD_FLAG2 = "/$file$/";
//var TAILOR_DOWNLOAD_URL = "http://cmtestoa.hq.cmcc:80";
//邮件的附件rul特征字符串
const MAIL_ATTACH_FLG = "rmweb/view.do?func=attach:download";
//dominino公文的附件rul特征字符串
const DOMINO_ATTACH_FLG = "$file";
//bpm公文的附件rul特征字符串
const BPM_ATTACH_FLG = "attachmentaction.do";
try {
	println("hello other") ;
	//var  szContentTypes="application/vnd.ms-excel,application/vnd.ms-powerpoint,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/x-msdownload,application/x-zip,application/x-rar-compressed";
	var szContentTypes = "application/xls,application/ppt,application/doc,application/pdf,application/xlsx,application/docx,application/pptx,application/zip,application/rar";
	fileMainPageURL = application.get("FileMainPageURL");
	var oRequest = fetcher.request;
	var accUrl = oRequest.url;
 	oRequest.url = accUrl.indexOf('$FILE-')!=-1 ? accUrl.replace('$FILE-','') : accUrl;
 	oRequest.url = oRequest.url.indexOf('/image-cmdi-')!=-1 ? oRequest.url.replace('image-','') : oRequest.url; 
	if (oRequest.url.indexOf(TAILOR_DOWNLOAD_FLAG1) == -1) {
		//Url中无下载标记信息
		var urlStr = oRequest.url;
		// println(oRequest.url)
		//oWebResponse = fetcher.fetchHead(oRequest);
		oWebResponse = fetcher.fetchText(oRequest, "utf-8");
		contentType = transformMialAttachmentType(detectContentType(oRequest, oWebResponse));
		println("contentType：" + contentType);
		application.set("attcnt", oWebResponse.text);
		if (contentType.length > 0 && szContentTypes.indexOf(contentType) > -1) {
			//检测出contentType是我们可以处理的附件调附件处理模板
			contentDisposition = detectContentDisposition(oRequest, oWebResponse);
			var szTextResultHtml = includeTemplate("otherAdjunct.jst");
			tailor.contentType = "text/html; charset=UTF-8";
			tailor.setTextResult(szTextResultHtml);
		} else {
			var urlStr = accUrl;
			if (urlStr.indexOf('$FILE')!=-1) {
				application.set("contentType", contentType);
				var szTextResultHtml = includeTemplate("otherTxt.jst");
				tailor.contentType = "text/html; charset=UTF-8";
				tailor.setTextResult(szTextResultHtml);
			} else {
				// //检测出contentType是不可以附件引擎处理的文件，执行下载处理或透传处理。
				oWebResponse = fetcher.fetchStream(oRequest);
				var szContentDisposition = oWebResponse.get("Content-Disposition");
				if (szContentDisposition && szContentDisposition.length > 0) {
					szContentDisposition = decodeURIComponent(szContentDisposition);
					tailor.addResponseHeader("Content-Disposition", szContentDisposition);
				}
				tailor.contentType = oWebResponse.contentType;
				tailor.setStreamResult(oWebResponse.stream);
			}
		}

	} else {
		//Url中有下载标记信息，执行下载处理。
		var szRequestUrl = oRequest.url;
		szRequestUrl = szRequestUrl.substring(szRequestUrl.indexOf(TAILOR_DOWNLOAD_FLAG1) + TAILOR_DOWNLOAD_FLAG1.length, szRequestUrl.indexOf(TAILOR_DOWNLOAD_FLAG2));
		szRequestUrl = urlDecodeBase64(szRequestUrl);
		// szRequestUrl=decodeURIComponent(szRequestUrl);
		// println(szRequestUrl);
		oRequest.url = szRequestUrl;
		oWebResponse = fetcher.fetchStream(oRequest);
		contentType = detectContentType(oRequest, oWebResponse);
		tailor.contentType = contentType + ";charset=UTF-8";
		//println(tailor.contentType);
		tailor.setStreamResult(oWebResponse.stream);
	}
	/*
	var request = fetcher.request;
	var response = fetcher.fetchStream(request);
	tailor.contentType = response.contentType;
	tailor.setStreamResult(response.stream);
	*/
} catch (e) {
	var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
	log.error(fetcher.request.url, szMessage);
	println(szMessage);
	tailor.setTextResult("<div></div>");

}

/**
 * 对邮箱附件进行特殊处理,进行类型转化为附件引擎可处理格式
 * @param {Object} contentType 原附件格式
 */
function transformMialAttachmentType(contentType) {
	//处理过附件类型的标志,备用
	var transformed = false;
	//println("contentType:" + contentType);
	switch (contentType) {
		case "application/vnd.ms-excel":
		case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
			contentType = "application/xls";
			transformed = true;
			break;
		case "application/msword":
		case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
			contentType = "application/doc";
			transformed = true;
			break;
		case "application/vnd.ms-powerpoint":
		case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
			contentType = "application/ppt";
			transformed = true;
			break;
	}
	return contentType;
}

function detectContentDisposition(webRequest, webResponse) {
	var szContentDisposition = webResponse.get("Content-Disposition");
	if (szContentDisposition && szContentDisposition.indexOf("attachment; filename=") > -1) {
		var szFileExtName = szContentDisposition.toLowerCase();
		szFileExtName = szFileExtName.substr("attachment; filename=".length);
		if (szFileExtName.startWith('"')) {
			szFileExtName = szFileExtName.substr('"'.length);
		}
		if (szFileExtName.endWith('"')) {
			szFileExtName = szFileExtName.substr(0, szFileExtName.length - 1);
		}
		szContentDisposition = szFileExtName;
		//Math.random() + "." + szFileExtName;
	} else {
		var szFileExtName = webRequest.url.toLowerCase();
		szFileExtName = szFileExtName.substr(szFileExtName.lastIndexOf("/") + 1);
		szContentDisposition = szFileExtName;
	}
	//println("szContentDisposition:" + szContentDisposition);
	return szContentDisposition;
}

function detectContentType(webRequest, webResponse) {
	var szContentType = webResponse.contentType;
	//println("szContentTypewwwww:" + szContentType);
	var szContentDisposition = "";
	//println("szContentDisposition=="+szContentDisposition+" szContentType="+szContentType);
	//if (szContentType != "" || szContentType.indexOf("application/msword") > -1 || szContentType.indexOf("application/octet_stream") > -1) {
	szContentDisposition = webResponse.get("Content-Disposition");
	if (szContentDisposition && szContentDisposition.indexOf(".") > -1) {
		var szFileExtName = szContentDisposition.toLowerCase();
		szFileExtName = szFileExtName.substr(szFileExtName.lastIndexOf(".") + 1);
		if (szFileExtName.endWith("\"")) {
			szFileExtName = szFileExtName.substr(0, szFileExtName.length - 1);
		}
		if (szContentType == "application/msword") {
			szContentType = "application/doc";
		} else if (szContentType == "application/vnd.ms-excel") {
			szContentType = "application/xls";
		} else if (szFileExtName == "doc") {
			szContentType = "application/doc";
		} else if (szFileExtName == "xls") {
			szContentType = "application/xls";
		} else if (szFileExtName == "ppt") {
			szContentType = "application/ppt";
		} else if (szFileExtName == "pdf") {
			szContentType = "application/pdf";
		} else if (szFileExtName == "docx") {
			szContentType = "application/docx";
		} else if (szFileExtName == "xlsx") {
			szContentType = "application/xlsx";
		} else if (szFileExtName == "pptx") {
			szContentType = "application/pptx";
		} else if (szFileExtName == "rar") {
			szContentType = "application/rar";
		} else if (szFileExtName == "zip") {
			szContentType = "application/zip";
		} else if ("txt" === szFileExtName) {
			szContentType = "text/plain";
		} else if ("jpg" === szFileExtName) {
			szContentType = "image/jpeg";
		} else if ("png" === szFileExtName) {
			szContentType = "image/png";
		} else if ("gif" === szFileExtName) {
			szContentType = "image/gif";
		}
	} else {
		var szFileExtName = webRequest.url.toLowerCase();
		szFileExtName = szFileExtName.substr(szFileExtName.lastIndexOf(".") + 1);
		//集团生产环境，domino附件链接会在后面加一个“?OpenElement”
		if (szFileExtName.indexOf("?") > 0) {
			szFileExtName = szFileExtName.substr(0, szFileExtName.indexOf("?"));
		}
		if (szFileExtName == "doc") {
			szContentType = "application/doc";
		} else if (szFileExtName == "xls") {
			szContentType = "application/xls";
		} else if (szFileExtName == "ppt") {
			szContentType = "application/ppt";
		} else if (szFileExtName == "pdf") {
			szContentType = "application/pdf";
		} else if (szFileExtName == "docx") {
			szContentType = "application/docx";
		} else if (szFileExtName == "xlsx") {
			szContentType = "application/xlsx";
		} else if (szFileExtName == "pptx") {
			szContentType = "application/pptx";
		} else if (szFileExtName == "rar") {
			szContentType = "application/rar";
		} else if (szFileExtName == "zip") {
			szContentType = "application/zip";
		} else if ("txt" === szFileExtName) {
			szContentType = "text/plain";
		} else if ("jpg" === szFileExtName) {
			szContentType = "image/jpeg";
		} else if ("png" === szFileExtName) {
			szContentType = "image/png";
		} else if ("gif" === szFileExtName) {
			szContentType = "image/gif";
		}
	}
	//}
	if (szContentType.indexOf(";") > -1) {
		var szSplitParts = szContentType.split(";");
		szContentType = szSplitParts[0];
	}
	return szContentType;
}

//下载附件返回流
function returnObjStream(_mRequest) {
	var _mResponse = fetcher.fetchStream(_mRequest);
	var _mStream = _mResponse.stream;
	var _sContentType = _mResponse.get("Content-Type");
	tailor.contentType = _sContentType;
	// IMAGE缓存30天
	if (_sContentType && /^image\//.test(_sContentType))
		tailor.addResponseHeader("Cache-Control", "max-age=2592000");
	tailor.setStreamResult(_mStream);
}

function fetchFileContent(url, content_Type) {
	var szUrl = "";
	try {
		var oXMLHttpRequest = new XMLHttpRequest();
		var szAdjunctEngineServiceUrl = appConfig.get("AdjunctEngineServiceUrl");
		println('szAdjunctEngineServiceUrl'+szAdjunctEngineServiceUrl);
		oXMLHttpRequest.open("POST", szAdjunctEngineServiceUrl, false);
		oXMLHttpRequest.onreadystatechange = function() {
			if (oXMLHttpRequest.readyState == 4) {
				szUrl = oXMLHttpRequest.responseText;
			}
		};
		var szSession = "";
		var szXml = "";
		szXml += "<FileRequest>";
		szXml += "<Credential type='cookie'> ";
		szXml += "<Session>" + urlEncoder(getSession(url), "UTF-8") + "</Session>";
		szXml += "</Credential>";
		szXml += "<TargetUrl>" + urlEncoder(url, "UTF-8") + "</TargetUrl>";
		szXml += "<ContentType>" + urlEncoder(content_Type, "UTF-8") + "</ContentType>";
		szXml += "</FileRequest>";
		oXMLHttpRequest.send(szXml);
	} catch (e) {
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
	}
	return szUrl;
};

function getSession(url) {
	var szSession = "";
	//println("here 3:" + url);
	var oNameValueCollection = globalSession.getHttpCookie(url);
	//  println("here 3:" + oNameValueCollection);
	for (var i = 0; i < oNameValueCollection.count; i++) {
		var szKey = oNameValueCollection.getKey(i);
		var szValue = oNameValueCollection[szKey];
		if (szSession == "") {
			szSession += szKey + "=" + szValue;
		} else {
			szSession += "; " + szKey + "=" + szValue;
		}
	}
	return szSession;
}