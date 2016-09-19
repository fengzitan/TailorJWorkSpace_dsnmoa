// T类申明
//T类使用说明
//	1.首先需要实例化
//		var t = new T({	
//			filename:'login.js',   //执行文件名
//			business:'登陆',	   //业务类型
//			document:'',		   //后设   t.document = '签报';
//			switch:false           //t.out()后台打印开关，默认关闭
//		})
//	2.探点
//	统一入口 t.breakpoint(param,request);
//		param:探点类型 hi:js运行开始点
//					   request:发起原系统请求开始点
//					   response:原系统响应结束点
//					   bye:js运行结束点
//						<hi>
//							<request>  //无依赖
//								</response>  //依赖request
//							<request>	//无依赖
//								</response>	 //依赖request
//							</bye>		//依赖hi				   
//
//					   start:调试探点开始点
//					   end:调试探点结束点						
//						<start>		//无依赖
//							</end>  //依赖start						
//		request:只提供于request类型探点一个请求类（fetcher.request）
//	3.生成返回记录结构体t.result();
function T(obj) {
	this.switch = obj.switch || false;
	this.filename = obj.filename || 'notset';
	this.business = obj.business || 'notset';
	this.url  = fetcher.request.url;
	this.method = fetcher.request.method;
	this.requestNum = 1;
	this.account = '';
	this.username = '';
	this.document = '';
	this.doctype = '';
	this.memo = '';
	this.webappid = null;
	this.webappcode = null;
	this.starttime = 0;
	this.endtime = 0;
	this.breakpointnum = 0;
	this.error = null;
	this.reqCode = null;
	this.collecttime = [];
	// 初始化
	this.init = function(obj){
		this.webappid = WEBAPP_ID||'';
		this.webappcode = WEBAPP_CODE||'';
		if(typeof(obj)==='object'){
			this.business = obj.business||this.business;
			this.filename = obj.filename||this.filename;
			this.switch = obj.switch||this.switch;
			return this;
		}
		return this.out('参数错误');
	}
	// 后台打印内容
	this.out = function(a) {
		return this.switch && println(a);
	};
	// 取当前时间戳
	this.now = function() {
		return new Date();
	};
	// 文件处理前打招呼
	this.hi = function() {
		this.starttime = this.now();
		this.out('hi ' + this.filename);
		this.probe('hi');
	};
	// 文件处理完毕再见
	this.bye = function() {
		this.endtime = this.now();
		this.out('bye ' + this.filename);
		this.probe('bye');
	};
	// 文件处理完成时间记录
	this.record = function() {
		if (this.starttime && this.endtime) {
			var a = '--------------------------------------------------\n',
				b = parseInt(this.endtime.getTime() - this.starttime.getTime()),
				c = this.starttime.toTimeString(),
				d = this.endtime.toTimeString();
			return this.out(a + 'starttime ' + c + '\n' + 'endtime ' + d + '\n' + 'time pass ' + b + '毫秒\n' + a);
		} else {
			if (!this.starttime) {
				this.out('please hi first');
			}
			if (!this.endtime) {
				this.out('please bye first');
			}
		}
	};
	// 错误信息
	this.throwerror = function(e) {
		var errormessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		return this.out('Error Message:\n' + errormessage);
	};
	// 断点调试
	this.breakpoint = function(s,r,i) {
		if(s=='hi'||s=='request'||s=='response'||s=='bye'){
			//return this.collecttime.push({name:s,time:this.now().getTime(),request:r&&{url:r.url,method:r.method==='undefined'&&'GET'||r.method}||'',identifier:i||''});
		}
		if(s=='start'){
			return this.out('<start time="'+this.now().getTime()/1000+'">');
		}
		if(s=='end'){
			return this.out('</end time="'+this.now().getTime()/1000+'">');
		}
		return this.out(this.now() + ' ' + this.filename + ' step>>>' + (s || ''+this.breakpointnum++));
	}
	// 探针
	this.probe = function(s,r,i){
		if(s==='hi'||s==='request'||s==='response'||s==='bye'){
			if(s==='hi'){
				this.requestNum = 1;
			}
			if(s==='response'){
				this.reqCode = null;
			}
			return this.collecttime.push({name:s,time:this.now().getTime(),request:r&&{url:r.url,method:r.method==='undefined'&&'GET'||r.method}||'',identifier:this.reqCode&&this.filename+'-'+this.reqCode||i&&this.filename+'-'+i||''}); 
		}
		return this.out('参数错误');
	}
	// 生成时间记录结构体
	this.result = function(){
		if(!TIMELOG_SWITCH){
			this.out('耗时日志记录模式关闭');
			return {};
		}
		this.out(JSON.stringify(this.collecttime));
		var result = this.parsertime();
		result.business = this.business;
		result.url = this.url;
		result.exec_file = this.filename;
		result.user = globalSession.loginAccount||'';
		result.login_account = globalSession.loginUserName||'';
		result.request_method = this.method;
		result.document = this.document;
		result.doc_type = this.doctype;
		result.memo = this.memo;
		result.webapp_id = this.webappid;
		result.webapp_code = this.webappcode;	
		return result;
	}
	// 分析时间集合
	this.parsertime = function(){
		var hi,include,run,request,response,deal,process=[],target,method,identifier,requestnum=0;
		for(i=0;i<this.collecttime.length;i++){
			switch(this.collecttime[i].name){
				case 'hi':
					hi = this.collecttime[i].time;
					break;
				case 'bye':
					run = this.collecttime[i].time;
					break;
				case 'request':
					requestnum++;
					if(requestnum===1){
						include = this.collecttime[i].time;
					}
					request = this.collecttime[i].time;
					identifier = this.collecttime[i].identifier;
					target = this.collecttime[i].request&&this.collecttime[i].request.url||'';
					method = this.collecttime[i].request&&this.collecttime[i].request.method||'';
					response = this.collecttime[++i].time;
					deal = this.collecttime[++i].time;
					if(this.collecttime[i].name==='request'){
						i--;
					}else{
						run = this.collecttime[i].time;
					}
					process.push({
						target_url:target,
						request_time:response-request,
						proces_time:deal-response,
						request_method:method,
						identifier:identifier,
						timestamp:new Date(request).Format("yyyy-MM-dd hh:mm:ss:S")
					});
					break;
			}
		}
		if(requestnum===0){
			include = run;
		}
		return {
			before_time:include-hi,
			run_time:run-include,
			process:process,
			all_time:run-hi
		}
	}
}

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
 * 过滤业务时间日志
 * @param {Object} page 第几页
 * @param {Object} pageSize 每页大小
 */
TimeLogger.filterBusinessLogs = function(business, page, pageSize) {
	//结果集
	var results = new Array();
	var oSQLUtilities = new SQLUtilities();
	var oConnection;
	var oPreparedStatement;
	var oRecordSet;

	//订阅业务时间日志纪录SQL
	var sql_business_log = "select * from app_business_timelog where business like ? limit ?,? ";
	//判断limit
	var start = page * pageSize;
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(sql_business_log);
		oPreparedStatement.setString(1, "%" + business + "%");
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
 * 列表业务时间日志
 * @param {Object} page 第几页
 * @param {Object} pageSize 每页大小
 */
TimeLogger.listBusinessLogs = function(page, pageSize) {
	//结果集
	var results = new Array();
	var oSQLUtilities = new SQLUtilities();
	var oConnection;
	var oPreparedStatement;
	var oRecordSet;

	//订阅业务时间日志纪录SQL
	var sql_business_log = "select * from app_business_timelog limit ?,? ";
	//判断limit
	var start = page * pageSize;
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(sql_business_log);
		oPreparedStatement.setInt(1, start);
		oPreparedStatement.setInt(2, pageSize);
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
	if(!TIMELOG_SWITCH){
		return false;
	}
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
		var now = new Date();
		oPreparedStatement.setString(11, now.Format("yyyy-MM-dd hh:mm:ss") + ":" + now.getMilliseconds());
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
// 响应结构体类申明
var RESPONSE = function(){
	return {
		success:true,
		message:'响应成功',
		data:{}
	};
}