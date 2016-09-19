var oSQLUtilities = new SQLUtilities();
/**
	获取用户激活业务模块
	@param {Object} loginAccount 登录账号
	@param {Object} webAppId 应用标识ID
	@param {Object} filterDisplay 是否显示
	@param {Object} filterIsOnline 是否上线
 */
function getUserModule(loginAccount, webAppId, filterDisplay, filterIsOnline) {
	// 取得用户唯一标识ID
	var usrDBId = getUserIDByLoginAccount(loginAccount, webAppId);
	// 无配置记录，则初始化用户配置记录，默认为开通所有权限
	initUserModule(usrDBId, webAppId);
	return getUserModuleJSON(usrDBId, webAppId, filterDisplay, filterIsOnline);
}

/**
	获取用户唯一标识ID
	@param {Object} loginAccount 登录账号
	@param {Object} webAppId 应用标识ID
 */
function getUserIDByLoginAccount(loginAccount, webAppId) {
	var dbid = "";
	var oConnection;
	var oPreparedStatement;
	var oRecordSet;
	var szSql = "select id from app_user where loginaccount = ? and webappid= ? ";
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(szSql);
		oPreparedStatement.setString(1, loginAccount);
		oPreparedStatement.setString(2, webAppId);
		oRecordSet = oPreparedStatement.executeQuery();
		// 新数据查询方式，不支持返回条数，采用next()获取数据
		if (oRecordSet.next()) {
			dbid = oRecordSet.getString("ID");
		}
	} catch(e) {
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		// 释放连接,必须执行
		oSQLUtilities.cleanUp(oRecordSet, oPreparedStatement, oConnection);
	}
	return dbid;
}

/**
	初始化用户个性化业务模块(全部激活)
	@param {Object} usrDBId 用户唯一标识ID
	@param {Object} webAppId 应用标识ID
 */
function initUserModule(usrDBId, webAppId) {
	// 判断是否存在记录
	var json = getUserModuleJSON(usrDBId, webAppId);
	if (0 != json.count) {
		return;
	}
	var oConnection;
	var oPreparedStatement;
	var szSql = "insert into app_ic_user_module(UserID, ModuleID, Display) select ?,m.ID,1 from app_ic_module m where m.webappid = ?";
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(szSql);
		oPreparedStatement.setString(1, usrDBId);
		oPreparedStatement.setString(2, webAppId);
		oPreparedStatement.executeUpdate();
	} catch(e) {
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		// 释放连接,必须执行
		oSQLUtilities.cleanUp(null, oPreparedStatement, oConnection);
	}
}

/**
	根据用户数据库id取其mainportal显示的模块列表json对象
	@param {Object} usrDBId 用户唯一标识ID
	@param {Object} webAppId 应用标识ID
	@param {Object} filterDisplay 空读取全部，1读取全部可显示，非1读取全部不可显示
	@param {Object} filterIsOnline 是否上线
 */
function getUserModuleJSON(usrDBId, webAppId, filterDisplay, filterIsOnline) {
	var statusJson = "";
	var condi = "";
	var webappid = (webAppId) ? webAppId : "";
	if (webappid != "") {
		condi += " and m.webappid = ?";
	}
	if (filterDisplay && (1 === filterDisplay )) {
		condi += " and c.Display=1";
	}
	if (filterIsOnline && (1 === filterIsOnline )) {
		condi += " and m.IsOnline=1";
	}
	var oConnection;
	var oPreparedStatement;
	var oRecordSet;
	var szSql = "select c.ID,c.ModuleID,c.Display,m.Serialnumber,m.DisplayName,m.Annotation,m.Url,m.Page,m.icon,m.previewPic,m.IsOnline,m.callback from app_ic_module as m right outer join  app_ic_user_module as c on m.ID=c.ModuleID where c.UserID = ? " + condi + " order by m.IsOnline desc,m.Serialnumber asc";
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(szSql);
		oPreparedStatement.setString(1, usrDBId);
		if (webappid != "") {
			oPreparedStatement.setString(2, webappid);
		}
		oRecordSet = oPreparedStatement.executeQuery();
		statusJson = parseModuleRecordSet(oRecordSet);
	} catch(e) {
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		// 释放连接,必须执行
		oSQLUtilities.cleanUp(oRecordSet, oPreparedStatement, oConnection);
	}
	return statusJson;
}

/**
	模块配置解析：将数据库RecordSet记录解析成json数组
	@param {Object} oRecordSet 数据库记录
 */
function parseModuleRecordSet(oRecordSet) {
	var statusObj = new Object();
	var statuItem = new Array();
	var count = 0;
	while (oRecordSet.next()) {
		var record = parseModuleRecord(oRecordSet);
		statuItem[count] = record;
		count++;
	}
	statusObj["count"] = count;
	statusObj["module"] = statuItem;
	return statusObj;
}

/**
	模块配置解析：将数据库Record记录解析成json数组中的一个item
	@param {Object} oRecord 数据库Record记录
 */
function parseModuleRecord(oRecord) {
	var jsonObj = new Object();
	jsonObj.ID = oRecord.getInt("ID");
	jsonObj.ModuleID = oRecord.getString("ModuleID");
	jsonObj.Display = oRecord.getInt("Display");
	jsonObj.Serialnumber = oRecord.getString("Serialnumber");
	jsonObj.DisplayName = oRecord.getString("DisplayName");
	jsonObj.Annotation = oRecord.getString("Annotation");
	jsonObj.Url = oRecord.getString("Url");
	jsonObj.Page = oRecord.getString("Page");
	jsonObj.icon = oRecord.getString("icon");
	jsonObj.previewPic = oRecord.getString("previewPic");
	jsonObj.IsOnline = oRecord.getInt("IsOnline");
	jsonObj.callback = oRecord.getString("callback");
	return jsonObj;
}

/**
	变更用户模块设置
	@param {Object} loginAccount 登录账号
	@param {Object} id 配置id
	@param {Object} display 是否显示
 */
function updateUserModuleConfig(loginAccount, id, display) {
	// 判断是否登录，登录才能更改设置
	if (loginAccount) {
		var oConnection;
		var oPreparedStatement;
		var szSql = "update app_ic_user_module set Display = ? where ID = ?";
		try {
			oConnection = oSQLUtilities.getConnection();
			oPreparedStatement = oConnection.prepareStatement(szSql);
			oPreparedStatement.setInt(1, parseInt(display));
			oPreparedStatement.setInt(2, parseInt(id));
			oPreparedStatement.executeUpdate();
		} catch(e) {
			var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
			log.error(fetcher.request.url, szMessage);
			println(szMessage);
		} finally {
			// 释放连接,必须执行
			oSQLUtilities.cleanUp(null, oPreparedStatement, oConnection);
		}
	}
}

/**
	变更设置常用意见
	@param  {[type]} loginAccount 登录账号
	@param  {[type]} id 配置id
	@param  {[type]} value 变更值
 */
function updateConfRecord(loginAccount, id, value) {
	var oConnection;
	var oPreparedStatement;
	var szSql = "update app_user_conf set value = ? where id = ?";
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(szSql);
		oPreparedStatement.setString(1, value);
		oPreparedStatement.setString(2, id);
		oPreparedStatement.executeUpdate();
	} catch(e) {
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		// 释放连接,必须执行
		oSQLUtilities.cleanUp(null, oPreparedStatement, oConnection);
	}
}

/**
	添加配置记录
	@param {Object} userid 用户id
	@param {Object} type 配置类型
	@param {Object} value 配置值
 */
function addConfRecord(userid, type, value) {
	var oConnection;
	var oPreparedStatement;
	var oRecordSet;
	var hasCount = false;
	var sql_ = "select * from app_user_conf where type= ? and value= ? and userid= ?";
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(sql_);
		oPreparedStatement.setString(1, type);
		oPreparedStatement.setString(2, value);
		oPreparedStatement.setString(3, userid);
		oRecordSet = oPreparedStatement.executeQuery();
		if (oRecordSet.next()) {
			hasCount = true;
		}
	} catch(e) {
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		// 释放连接,必须执行
		oSQLUtilities.cleanUp(oRecordSet, oPreparedStatement, oConnection);
	}
	if (hasCount) {
		return {
			success : 0,
			message : '已存在该记录'
		};
	}
	var id = oSQLUtilities.generateID();
	var szSql = "insert into app_user_conf(id,userid,type,value) values (?,?,?,?)";
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(szSql);
		oPreparedStatement.setString(1, id);
		oPreparedStatement.setString(2, userid);
		oPreparedStatement.setString(3, type);
		oPreparedStatement.setString(4, value);
		oPreparedStatement.executeUpdate();
		var result = new Object();
		result["id"] = id;
		result.success = 1;
		result.message = '新添记录成功';
		return result;
	} catch(e) {
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		// 释放连接,必须执行
		oSQLUtilities.cleanUp(null, oPreparedStatement, oConnection);
	}
}

/**
	查询配置记录
	@param {Object} userid 用户id
	@param {Object} type 配置类型
 */
function selectConfRecordSet(userid, type) {
	var confJson = "";
	var oConnection;
	var oPreparedStatement;
	var oRecordSet;
	var szSql = "select * from app_user_conf where userid = ? and type= ?";
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(szSql);
		oPreparedStatement.setString(1, userid);
		oPreparedStatement.setString(2, type);
		oRecordSet = oPreparedStatement.executeQuery();
		confJson = parseConfRecordSet(oRecordSet);
	} catch(e) {
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		// 释放连接,必须执行
		oSQLUtilities.cleanUp(oRecordSet, oPreparedStatement, oConnection);
	}
	return confJson;
}

/**
	删除配置记录
	@param {Object} id 配置id
	@param {Object} userid 用户id
 */
function deleteConfRecord(id, userid) {
	var oConnection;
	var oPreparedStatement;
	var szSql = "DELETE FROM app_user_conf WHERE id= ? and userid= ?";
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(szSql);
		oPreparedStatement.setString(1, id);
		oPreparedStatement.setString(2, userid);
		oPreparedStatement.executeUpdate();
	} catch(e) {
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		// 释放连接,必须执行
		oSQLUtilities.cleanUp(null, oPreparedStatement, oConnection);
	}
}

/**
	个性化配置解析：将数据库RecordSet记录解析成json数组
	@param {Object} oRecordSet 数据库记录
 */
function parseConfRecordSet(oRecordSet) {
	var confsObj = new Object();
	var item = new Array();
	var count = 0;
	while (oRecordSet.next()) {
		item[count] = parseConfRecord(oRecordSet);
		count++;
	}
	confsObj["count"] = count;
	confsObj["confs"] = item;
	return confsObj;
}

/**
	个性化配置解析：将数据库Record记录解析成json数组中的一个item
	@param {Object} oRecord 数据库Record记录
 */
function parseConfRecord(oRecord) {
	var jsonObj = new Object();
	jsonObj.id = oRecord.getString("id");
	jsonObj.userid = oRecord.getString("userid");
	jsonObj.type = oRecord.getString("type");
	jsonObj.value = oRecord.getString("value");
	return jsonObj;
}
