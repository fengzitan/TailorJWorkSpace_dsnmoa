/**
 * 耗时日志服务
 *
 * @author Hsin
 */

include("timelogger.js");
//引入公共配置：如分页大小等
include("timelog.conf.js");

/**
 * 操作类型
 */
var method;
/**
 * 第几页
 */
var page;
/**
 * 业务日志ID
 */
var blogid;

try {
	var oRequest = fetcher.request;
	//请求类型判断
	var _isValidate = "POST" === oRequest.method.toUpperCase();
	if (_isValidate) {//处理post请求，主要处理需要填写表单的请求
		var result = "[]";
		//获取提交的JSON数据
		var data = unEscapeToJson(oRequest);
		if (data.method) {
			switch(data.method) {
			case "gettBusinessLogs":
				if (data.filter_type != null && "" != data.filter_type) {
					//过滤业务日志
					result = JSON.stringify(TimeLogger.filterBusinessLogs(data.filter_value, data.filter_type, data.page, pageSize, webapp_id));
				} else {
					//查询业务日志
					result = JSON.stringify(TimeLogger.listBusinessLogs(data.page, pageSize, webapp_id));
				}
				break;
			case "gettProcessLogs":
				//查询业务子处理日志
				result = JSON.stringify(TimeLogger.listProcessLogs(data.blogid, data.page, pageSize));
				break;
			case "statisticalBusinessLogs":
				//统计业务处理日志
				result = JSON.stringify(TimeLogger.statisticalBusinessLogs(data.filter_value, data.filter_type, data.page, data.pageSize, webapp_id));
				break;
			case "statisticalProcessLogs":
				//统计业务处理详情日志
				result = JSON.stringify(TimeLogger.statisticalProcessLogs(data.filter_value, data.filter_type, data.page, data.pageSize, webapp_id));
				break;
			case "clearTimeLogs":
				TimeLogger.clearTimeLogs(webapp_id);
				result = '{"status":"ok"}';
				break;
			}
		}
		//设置返回类型
		tailor.contentType = "text/json; charset=utf-8";
		//直接返回查询JSON
		//println(result);
		tailor.setTextResult(result);
	}
} catch(e) {
	println("查询业务日志失败！");
	println(e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")");
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
