var readByDownloadUrl = "";
var readByOnlineUrl = "";

try {
	var requestUrl = fetcher.request.url;
	readByOnlineUrl = fetchFileContent(requestUrl, contentType);
	println('readByOnlineUrl'+readByOnlineUrl);
	var szContentDisposition = "";
	if (contentDisposition) {
		if (contentDisposition.indexOf("filename=") > -1) {
			szContentDisposition = contentDisposition.substr(contentDisposition.lastIndexOf("filename=") + "filename=".length);
		} else {
			szContentDisposition = contentDisposition;
		}
	} else {
		szContentDisposition = requestUrl.substr(requestUrl.lastIndexOf("/") + 1);
	}

	logAdjunct(fetcher.request.url, decodeURIComponent(szContentDisposition));
	szContentDisposition = decodeURIComponent(szContentDisposition);
	szContentDisposition = encodeURIComponent(szContentDisposition);
	//moa不提供下载
	//readByDownloadUrl = TAILOR_BASE_URL + TAILOR_DOWNLOAD_URL + TAILOR_DOWNLOAD_FLAG1 + urlEncodeBase64(requestUrl) + TAILOR_DOWNLOAD_FLAG2 + szContentDisposition;

} catch (e) {
	var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
	log.error(fetcher.request.url, szMessage);
	println(szMessage);

}