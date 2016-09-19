/**
 * 耗时日志记录工具
 *
 * @author Hsin
 */

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.Format = function(fmt) {
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
 * 转化BusinessLog持久纪录为对象
 */
function parseBusinessLogRecord(record) {

	var timelog = new Object();
	timelog.id = record.getString("id");
	timelog.business = record.getString("business");
	timelog.url = record.getString("url");
	timelog.exec_file = record.getString("exec_file");
	timelog.before_time = record.getInt("before_time");
	timelog.run_time = record.getInt("run_time");
	timelog.login_account = record.getString("login_account");
	timelog.request_method = record.getString("request_method");
	timelog.user = record.getString("user");
	timelog.document = record.getString("document");
	timelog.timestamp = record.getString("timestamp");
	timelog.webapp_id = record.getString("webapp_id");
	timelog.webapp_code = record.getString("webapp_code");
	timelog.doc_type = record.getString("doc_type");
	timelog.memo = record.getString("memo");
	return timelog;
}

/**
 * 转化ProcessLog持久纪录为对象
 */
function parseProcessLogRecord(record) {
	var timelog = new Object();
	timelog.id = record.getString("id");
	timelog.target_url = record.getString("target_url");
	timelog.request_time = record.getInt("request_time");
	timelog.proces_time = record.getInt("proces_time");
	timelog.business_timelog_id = record.getString("business_timelog_id");
	timelog.request_method = record.getString("request_method");
	timelog.timestamp = record.getString("timestamp");
	timelog.identifier = record.getString("identifier");
	return timelog;
}

/**
 * 把undefined字段变为""
 */
function hideBlank(str) {
	if ( typeof (str) == "undefined") {
		str = "";
	}
	return str;
}

/**
 * 把undefined字段变为0
 */
function hideZero(num) {
	if ( typeof (num) == "undefined") {
		num = 0;
	}
	return num;
}

var TimeLogger = new Object();

/**
 * 转化统计BusinessLog持久纪录为对象
 */
function parseStatisticalBusinessLogRecord(record) {

	var timelog = new Object();
	timelog.count = record.getInt("count");
	timelog.business = record.getString("business");
	timelog.url = record.getString("url");
	timelog.exec_file = record.getString("exec_file");
	timelog.avg_before_time = record.getInt("avg_before_time");
	timelog.avg_run_time = record.getInt("avg_run_time");
	timelog.login_account = record.getString("login_account");
	timelog.request_method = record.getString("request_method");
	timelog.user = record.getString("user");
	timelog.document = record.getString("document");
	timelog.webapp_id = record.getString("webapp_id");
	timelog.webapp_code = record.getString("webapp_code");
	timelog.doc_type = record.getString("doc_type");
	return timelog;
}

/**
 * 转化统计BusinessLog持久纪录为对象
 */
function parseStatisticalProcessLogRecord(record) {
	var timelog = new Object();
	timelog.target_url = record.getString("target_url");
	timelog.avg_request_time = record.getInt("avg_request_time");
	timelog.avg_proces_time = record.getInt("avg_proces_time");
	timelog.request_method = record.getString("request_method");
	timelog.identifier = record.getString("identifier");
	return timelog;
}

/**
 * 清除日志
 * @param {Object} webapp_id web app id
 */
TimeLogger.clearTimeLogs = function(webapp_id) {
	var oSQLUtilities = new SQLUtilities();
	var oConnection;
	var oPreparedStatement;
	var sql_clear_log = "delete from app_business_timelog where webapp_id = ?";
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(sql_clear_log);
		oPreparedStatement.setString(1, webapp_id);
		oPreparedStatement.executeUpdate();
	} catch(e) {
		println("clear timelog error:" + sql_clear_log);
		println(e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")");
	} finally {
		//释放连接,必须执行
		oSQLUtilities.cleanUp(null, oPreparedStatement, oConnection);
	}

};
/**
 * 统计业务日志
 * @param {Object} filter_value 过滤值
 * @param {Object} filter_type 过滤字段类型
 * @param {Object} page 第几页
 * @param {Object} pageSize 每页大小
 * @param {Object} webapp_id web app id
 */
TimeLogger.statisticalProcessLogs = function(filter_value, filter_type, page, pageSize, webapp_id) {
	//过滤字段
	var filter_field = "";
	switch(filter_type) {
	case "0":
		filter_field = "business";
		break;
	case "1":
		filter_field = "doc_type";
		break;
	default:
		filter_field = "business";
	}

	//结果集
	var results = new Array();
	var oSQLUtilities = new SQLUtilities();
	var oConnection;
	var oPreparedStatement;
	var oRecordSet;

	//订阅业务时间日志纪录SQL
	var sql_proces_log = "select result.identifier,result.request_method,result.target_url,avg(result.request_time) as avg_request_time,avg(result.proces_time) as avg_proces_time from (select p.* from app_proces_timelog p inner join (select temp.id from app_business_timelog temp where temp.webapp_id = ? and temp." + filter_field + " like ? limit ?,? ) b on p.business_timelog_id = b.id) result group by result.identifier";
	//判断limit
	var start = page * pageSize;
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(sql_proces_log);
		oPreparedStatement.setString(1, webapp_id);
		oPreparedStatement.setString(2, filter_value);
		oPreparedStatement.setInt(3, start);
		oPreparedStatement.setInt(4, pageSize);
		oRecordSet = oPreparedStatement.executeQuery();

		var i = 0;
		while (oRecordSet.next()) {
			results[i] = parseStatisticalProcessLogRecord(oRecordSet);
			i++;
		}
	} catch(e) {
		println("list proces timelog error:" + sql_proces_log);
		println(e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")");
	} finally {
		//释放连接,必须执行
		oSQLUtilities.cleanUp(oRecordSet, oPreparedStatement, oConnection);
	}
	return results;
};

/**
 * 统计业务日志
 * @param {Object} filter_value 过滤值
 * @param {Object} filter_type 过滤字段类型
 * @param {Object} page 第几页
 * @param {Object} pageSize 每页大小
 * @param {Object} webapp_id web app id
 */
TimeLogger.statisticalBusinessLogs = function(filter_value, filter_type, page, pageSize, webapp_id) {
	//过滤字段
	var filter_field = "";
	switch(filter_type) {
	case "0":
		filter_field = "business";
		break;
	case "1":
		filter_field = "doc_type";
		break;
	default:
		filter_field = "business";
	}

	//结果集
	var results = new Array();
	var oSQLUtilities = new SQLUtilities();
	var oConnection;
	var oPreparedStatement;
	var oRecordSet;

	//订阅业务时间日志纪录SQL
	var sql_business_log = "select count(b.id) as count,b.business,b.url,b.exec_file,avg(b.before_time) as avg_before_time,avg(b.run_time) as avg_run_time,b.login_account,b.request_method,b.user,b.document,b.webapp_id,b.webapp_code,b.doc_type from (select temp.* from app_business_timelog temp where temp.webapp_id = ? and temp." + filter_field + " like ? limit ?,?) b GROUP BY b." + filter_field;
	//判断limit
	var start = page * pageSize;
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(sql_business_log);
		oPreparedStatement.setString(1, webapp_id);
		oPreparedStatement.setString(2, "%" + filter_value + "%");
		//oPreparedStatement.setString(2, filter_value);
		oPreparedStatement.setInt(3, start);
		oPreparedStatement.setInt(4, pageSize);
		oRecordSet = oPreparedStatement.executeQuery();
		var i = 0;
		while (oRecordSet.next()) {
			results[i] = parseStatisticalBusinessLogRecord(oRecordSet);
			i++;
		}
		//println(sql_business_log + "," + filter_value + "," + start + "," + pageSize);
	} catch(e) {
		println("list business timelog error:" + sql_business_log);
		println(e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")");
	} finally {
		//释放连接,必须执行
		oSQLUtilities.cleanUp(oRecordSet, oPreparedStatement, oConnection);
	}
	return results;

};

/**
 * 过滤业务时间日志
 * @param {Object} filter_value 过滤值
 * @param {Object} filter_type 过滤字段类型
 * @param {Object} page 第几页
 * @param {Object} pageSize 每页大小
 * @param {Object} webapp_id web app id
 */
TimeLogger.filterBusinessLogs = function(filter_value, filter_type, page, pageSize, webapp_id) {
	//过滤字段
	var filter_field = "";
	switch(filter_type) {
	case "0":
		filter_field = "business";
		break;
	case "1":
		filter_field = "doc_type";
		break;
	case "2":
		filter_field = "login_account";
		break;
	default:
		filter_field = "business";
	}

	//结果集
	var results = new Array();
	var oSQLUtilities = new SQLUtilities();
	var oConnection;
	var oPreparedStatement;
	var oRecordSet;

	//订阅业务时间日志纪录SQL
	var sql_business_log = "select * from app_business_timelog where webapp_id = ? and " + filter_field + " like ? order by timestamp desc limit ?,? ";
	//判断limit
	var start = page * pageSize;
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(sql_business_log);
		oPreparedStatement.setString(1, webapp_id);
		oPreparedStatement.setString(2, "%" + filter_value + "%");
		oPreparedStatement.setInt(3, start);
		oPreparedStatement.setInt(4, pageSize);
		oRecordSet = oPreparedStatement.executeQuery();

		var i = 0;
		while (oRecordSet.next()) {
			results[i] = parseBusinessLogRecord(oRecordSet);
			i++;
		}
	} catch(e) {
		println("list business timelog error:" + sql_business_log);
		println(e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")");
	} finally {
		//释放连接,必须执行
		oSQLUtilities.cleanUp(oRecordSet, oPreparedStatement, oConnection);
	}
	return results;
};

/**
 * 列表业务时间日志
 * @param {Object} page 第几页
 * @param {Object} pageSize 每页大小
 * @param {Object} webapp_id web app id
 */
TimeLogger.listBusinessLogs = function(page, pageSize, webapp_id) {
	//结果集
	var results = new Array();
	var oSQLUtilities = new SQLUtilities();
	var oConnection;
	var oPreparedStatement;
	var oRecordSet;

	//订阅业务时间日志纪录SQL
	var sql_business_log = "select * from app_business_timelog where webapp_id = ? order by timestamp desc limit ?,? ";
	//判断limit
	var start = page * pageSize;
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(sql_business_log);
		oPreparedStatement.setString(1, webapp_id);
		oPreparedStatement.setInt(2, start);
		oPreparedStatement.setInt(3, pageSize);
		oRecordSet = oPreparedStatement.executeQuery();

		var i = 0;
		while (oRecordSet.next()) {
			results[i] = parseBusinessLogRecord(oRecordSet);
			i++;
		}
	} catch(e) {
		println("list business timelog error:" + sql_business_log);
		println(e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")");
	} finally {
		//释放连接,必须执行
		oSQLUtilities.cleanUp(oRecordSet, oPreparedStatement, oConnection);
	}
	return results;
};

/**
 * 列表处理流程时间日志
 * @param {Object} business_timelog_id 业务时间日志ID
 * @param {Object} page 第几页
 * @param {Object} pageSize 每页大小
 */
TimeLogger.listProcessLogs = function(business_timelog_id, page, pageSize) {
	//结果集
	var results = new Array();
	var oSQLUtilities = new SQLUtilities();
	var oConnection;
	var oPreparedStatement;
	var oRecordSet;

	//订阅业务时间日志纪录SQL
	var sql_proces_log = "select * from app_proces_timelog where business_timelog_id=? order by timestamp limit ?,? ";
	//判断limit
	var start = page * pageSize;
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(sql_proces_log);
		oPreparedStatement.setString(1, business_timelog_id);
		oPreparedStatement.setInt(2, start);
		oPreparedStatement.setInt(3, pageSize);
		oRecordSet = oPreparedStatement.executeQuery();

		var i = 0;
		while (oRecordSet.next()) {
			results[i] = parseProcessLogRecord(oRecordSet);
			i++;
		}
	} catch(e) {
		println("list proces timelog error:" + sql_proces_log);
		println(e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")");
	} finally {
		//释放连接,必须执行
		oSQLUtilities.cleanUp(oRecordSet, oPreparedStatement, oConnection);
	}
	return results;
};

/**
 * 耗时日志记录
 * @param {Object} timelog 返回储存后的timelog (带主键ID)
 */
TimeLogger.log = function(timelog) {
	var oSQLUtilities = new SQLUtilities();
	var oConnection;
	var oPreparedStatement;
	//生成业务时间日志ID
	timelog.id = oSQLUtilities.generateID();
	//订阅业务时间日志纪录SQL
	var sql_business_log = "insert into app_business_timelog(id,business,url,exec_file,before_time,run_time,login_account,request_method,user,document,timestamp,webapp_id,webapp_code,doc_type,memo) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(sql_business_log);
		oPreparedStatement.setString(1, timelog.id);
		oPreparedStatement.setString(2, hideBlank(timelog.business));
		oPreparedStatement.setString(3, hideBlank(timelog.url));
		oPreparedStatement.setString(4, hideBlank(timelog.exec_file));
		oPreparedStatement.setInt(5, hideZero(timelog.before_time));
		oPreparedStatement.setInt(6, hideZero(timelog.run_time));
		oPreparedStatement.setString(7, hideBlank(timelog.login_account));
		oPreparedStatement.setString(8, hideBlank(timelog.request_method));
		oPreparedStatement.setString(9, hideBlank(timelog.user));
		oPreparedStatement.setString(10, hideBlank(timelog.document));
		oPreparedStatement.setString(11, new Date().Format("yyyy-MM-dd hh:mm:ss.S"));
		oPreparedStatement.setString(12, hideBlank(timelog.webapp_id));
		oPreparedStatement.setString(13, hideBlank(timelog.webapp_code));
		oPreparedStatement.setString(14, hideBlank(timelog.doc_type));
		oPreparedStatement.setString(15, hideBlank(timelog.memo));
		oPreparedStatement.executeUpdate();

	} catch(e) {
		println("insert business timelog error:" + sql_business_log);
		println(e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")");
	} finally {
		//释放连接,必须执行
		oSQLUtilities.cleanUp(null, oPreparedStatement, oConnection);
	}
	var process_length = timelog.process.length;
	//判断是否存在子处理日志
	if (process_length > 0) {
		var sql_process_log = "insert into app_proces_timelog(id,target_url,request_time,proces_time,business_timelog_id,request_method,timestamp,identifier) values ";
		for (var i = 0; i < process_length; i++) {
			//生成业务子处理时间日志ID
			timelog.process[i].id = oSQLUtilities.generateID();
			var proces = timelog.process[i];
			sql_process_log = sql_process_log + "('" + proces.id + "','" + hideBlank(proces.target_url) + "'," + hideZero(proces.request_time) + "," + hideZero(proces.proces_time) + ",'" + timelog.id + "','" + hideBlank(proces.request_method) + "','" + hideBlank(proces.timestamp) + "','" + hideBlank(proces.identifier) + "')";
			if (i < process_length - 1) {
				sql_process_log = sql_process_log + ",";
			}
		}
		try {
			oSQLUtilities.execute(sql_process_log);
		} catch(e) {
			println("insert proces timelog error:" + sql_process_log);
			println(e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")");
		}
	}
	return timelog;
};
