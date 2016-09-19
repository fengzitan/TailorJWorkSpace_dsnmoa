/**
 *应用管理数据库访问工具
 */
/**
 *得到所有用户模块(如果第一次登录，则初始化用户拥有所有模块)
 * JSON结构：
 * {
 "count": 2,
 "module": [
 {
 "ID": "1111",
 "Serialnumber": 1,
 "DisplayName": "disp",
 "Annotation": "ann",
 "Url": "url",
 "Page": "page",
 "Display": 1,
 "icon": "icon",
 "previewPic": "previewPic",
 "IsOnline":"IsOnline"
 },
 {
 "ID": "222",
 "Serialnumber": 2,
 "DisplayName": "disp2",
 "Annotation": "ann2",
 "Url": "url2",
 "Page": "page",
 "Display": 1,
 "icon": "icon2",
 "previewPic": "previewIconCSS2",
 "IsOnline":"IsOnline"
 }
 ]
 }
 * @param {Object} loginAccount 登录账号
 * @param {Object} filterDisplay 是否显示
 */
function getUserModule(loginAccount, filterDisplay, filterIsOnline, webappid) {
	//取得用户唯一ID
	var usrDBId = getUserIDByLoginAccount(loginAccount, webappid);
	//无配置记录，则初始化用户配置记录，默认为开通所有权限
	initUserModule(usrDBId, webappid);
	return getUserModuleJSON(usrDBId, webappid, filterDisplay, filterIsOnline);

}

/**
 *变更 用户模块设置
 * @param {Object} loginAccount 登录账号
 * @param {Object} id 配置id
 * @param {Object} display 是否显示
 */
function updateUserModuleConfig(loginAccount, id, display) {
	//判断是否登录，登录才能更改设置
	if (loginAccount) {
		var oSQLUtilities = new SQLUtilities();
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
			println("update user module display error:");
			println(szSql);
			var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
			log.error(fetcher.request.url, szMessage);
			println(szMessage);
		} finally {
			//释放连接,必须执行
			//println("释放连接");
			oSQLUtilities.cleanUp(null, oPreparedStatement, oConnection);
		}
	}
}

/**
 * 变更设置常用意见
 * @param  {[type]} loginAccount 登录账号
 * @param  {[type]} id 配置id
 * @param  {[type]} value 变更值
 */
function updateConfRecord(loginAccount, id, value) {
	var oSQLUtilities = new SQLUtilities();
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
		println("update user config record error:");
		println(szSql);
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		//释放连接,必须执行
		oSQLUtilities.cleanUp(null, oPreparedStatement, oConnection);
	}
}

//根据用户loginAccount取数据库id
function getUserIDByLoginAccount(loginAccount, webappid) {
	var dbid = "";
	var oSQLUtilities = new SQLUtilities();
	var oConnection;
	var oPreparedStatement;
	var oRecordSet;
	var szSql = "select id from app_user where loginaccount = ? and webappid= ? ";
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(szSql);
		oPreparedStatement.setString(1, loginAccount);
		oPreparedStatement.setString(2, webappid);
		oRecordSet = oPreparedStatement.executeQuery();
		//新数据查询方式，不支持返回条数，采用next()获取数据
		if (oRecordSet.next()) {
			dbid = oRecordSet.getString("ID");
		}
	} catch(e) {
		println("db err");
	} finally {
		//释放连接,必须执行
		oSQLUtilities.cleanUp(oRecordSet, oPreparedStatement, oConnection);
	}
	return dbid;
}

/**
 * 根据用户数据库id初始化取其mainportal显示的模块列表为全部显示
 */
function initUserModule(usrDBId, webappid) {
	//判断是否存在记录
	var json = getUserModuleJSON(usrDBId, webappid);
	if (0 != json.count) {
		return;
	}
	var oSQLUtilities = new SQLUtilities();
	var oConnection;
	var oPreparedStatement;
	var szSql = "insert into app_ic_user_module(UserID, ModuleID, Display) select ?,m.ID,1 from app_ic_module m where m.webappid = ?";
	//println(szSql);
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(szSql);
		oPreparedStatement.setString(1, usrDBId);
		oPreparedStatement.setString(2, webappid);
		oPreparedStatement.executeUpdate();
	} catch(e) {
		println("init user module error:");
		println(szSql);
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		//释放连接,必须执行
		oSQLUtilities.cleanUp(null, oPreparedStatement, oConnection);
	}
}

/**
 * 根据用户数据库id取其mainportal显示的模块列表json对象
 * @param {Object} usrDBId 用户数据库id
 * @param {Object} filterDisplay filterDisplay  如果 传1 表示取要显示的模块 如果不传值 表示取全部， 如果传不为1的值 表示取不显示的模块
 * @param {Object} filterDisplay filterIsOnline 过滤模块是否上线
 */
function getUserModuleJSON(usrDBId, webappid, filterDisplay, filterIsOnline) {
	var statusJson = "";
	var condi = "";
	webappid = (webappid) ? webappid : "";
	if (webappid != "") {
		condi += " and m.webappid = ?";
	}
	if (filterDisplay && (1 === filterDisplay )) {
		condi += " and c.Display=1";
	}
	if (filterIsOnline && (1 === filterIsOnline )) {
		condi += " and m.IsOnline=1";
	}
	var oSQLUtilities = new SQLUtilities();
	var oConnection;
	var oPreparedStatement;
	var oRecordSet;
	var szSql = "select c.ID,c.ModuleID,c.Display,m.Serialnumber,m.DisplayName,m.Annotation,m.Url,m.Page,m.icon,m.previewPic,m.IsOnline,m.callback from app_ic_module as m right outer join  app_ic_user_module as c on m.ID=c.ModuleID where c.UserID = ? " + condi + " order by m.IsOnline desc,m.Serialnumber asc";
	//println(szSql);
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
		println("module select error:");
		println(szSql);
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		//释放连接,必须执行
		oSQLUtilities.cleanUp(oRecordSet, oPreparedStatement, oConnection);
	}
	//println("statusJson:" + JSON.stringify(statusJson));
	return statusJson;
}

/**
 * 模块配置解析：将数据库RecordSet记录解析成json数组中的一个item
 * @param {Object} oRecordSet 数据库记录
 */
function parseModuleRecordSet(oRecordSet) {
	var authority = application.get("authority") ? application.get("authority") : "";
	var statusObj = new Object();
	var statuItem = new Array();
	var count = 0;
	while (oRecordSet.next()) {
		var record = parseModuleRecord(oRecordSet);
		if ("" === authority || authority.indexOf("[" + record.ModuleID + "]") > -1) {
			statuItem[count] = record;
			count++;
		}
	}
	statusObj["count"] = count;
	statusObj["module"] = statuItem;
	return statusObj;
}

/**
 * 模块配置解析：将数据库Record记录解析成json数组中的一个item
 * @param {Object} oRecord 数据库Record记录
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
 *添加配置记录
 *  @param {Object} userid 用户id
 *  @param {Object} type 配置类型
 *  @param {Object} value 配置值
 */
function addConfRecord(userid, type, value) {
	var oSQLUtilities = new SQLUtilities();
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
		println("select count error:");
		println(sql_);
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		//释放连接,必须执行
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
	//println(szSql);
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
		println("insert user conf error:");
		println(szSql);
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		//释放连接,必须执行
		oSQLUtilities.cleanUp(null, oPreparedStatement, oConnection);
	}
}

/**
 *查询配置记录
 *  @param {Object} userid 用户id
 *  @param {Object} type 配置类型
 */
function selectConfRecordSet(userid, type) {
	var confJson = "";
	var oSQLUtilities = new SQLUtilities();
	var oConnection;
	var oPreparedStatement;
	var oRecordSet;
	var szSql = "select * from app_user_conf where userid = ? and type= ?";
	//println(szSql);
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(szSql);
		oPreparedStatement.setString(1, userid);
		oPreparedStatement.setString(2, type);
		oRecordSet = oPreparedStatement.executeQuery();
		confJson = parseConfRecordSet(oRecordSet);
	} catch(e) {
		println("conf select error:");
		println(szSql);
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		//释放连接,必须执行
		oSQLUtilities.cleanUp(oRecordSet, oPreparedStatement, oConnection);
	}
	return confJson;
}

/**
 *删除配置记录
 *  @param {Object} id 配置id
 *  @param {Object} userid 用户id
 */
function deleteConfRecord(id, userid) {
	var oSQLUtilities = new SQLUtilities();
	var oConnection;
	var oPreparedStatement;
	var szSql = "DELETE FROM app_user_conf WHERE id= ? and userid= ?";
	//println(szSql);
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(szSql);
		oPreparedStatement.setString(1, id);
		oPreparedStatement.setString(2, userid);
		oPreparedStatement.executeUpdate();
	} catch(e) {
		println("delete user conf error:");
		println(szSql);
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		//释放连接,必须执行
		oSQLUtilities.cleanUp(null, oPreparedStatement, oConnection);
	}
}

/**
 * 个性化配置解析：将数据库RecordSet记录解析成json数组中的一个item
 * @param {Object} oRecordSet 数据库记录
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
 * 个性化配置解析：将数据库Record记录解析成json数组中的一个item
 * @param {Object} oRecord 数据库Record记录
 */
function parseConfRecord(oRecord) {
	var jsonObj = new Object();
	jsonObj.id = oRecord.getString("id");
	jsonObj.userid = oRecord.getString("userid");
	jsonObj.type = oRecord.getString("type");
	jsonObj.value = oRecord.getString("value");
	return jsonObj;
}

/**
 *通过用户名取得用户手势相关信息
 * @param {Object} loginaccount 用户名
 */
function getUserPatternInfo(loginaccount) {
	var user_pattern_info;
	var oSQLUtilities = new SQLUtilities();
	var oConnection;
	var oPreparedStatement;
	var oRecordSet;
	var szSql = "select ID,LoginAccount,pattern_switch,pattern_pwd,pattern_timestamp from app_user where loginaccount = ?";
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(szSql);
		oPreparedStatement.setString(1, loginaccount);
		oRecordSet = oPreparedStatement.executeQuery();
		if (oRecordSet.next()) {
			user_pattern_info = new Object();
			user_pattern_info.id = oRecordSet.getString("ID");
			user_pattern_info.account = oRecordSet.getString("LoginAccount");
			user_pattern_info.pattern_switch = oRecordSet.getString("pattern_switch");
			user_pattern_info.pattern_pwd = oRecordSet.getString("pattern_pwd");
			user_pattern_info.pattern_timestamp = oRecordSet.getString("pattern_timestamp");
		}
	} catch(e) {
		println("delete user conf error:");
		println(szSql);
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		//释放连接,必须执行
		oSQLUtilities.cleanUp(oRecordSet, oPreparedStatement, oConnection);
	}

	//println(szSql);
	return user_pattern_info;
}

/**
 *更新用户手势相关信息
 * @param {Object} loginaccount 用户名
 * @param {Object} pattern_switch 手势开关
 * @param {Object} pattern_pwd 手势密码
 */
function updateUserPatternInfo(loginaccount, pattern_switch, pattern_pwd) {
	var user_pattern_info;
	var oSQLUtilities = new SQLUtilities();
	var oConnection;
	var oPreparedStatement;
	var szSql = "update app_user set pattern_timestamp=\"" + new Date().getTime() + "\"";
	if (pattern_switch) {
		szSql += ",pattern_switch= ?";
	}
	if (pattern_pwd) {
		szSql += ",pattern_pwd= ?";
	}
	szSql += " where loginaccount = ?";
	try {
		oConnection = oSQLUtilities.getConnection();
		oPreparedStatement = oConnection.prepareStatement(szSql);
		var p_count = 0;
		if (pattern_switch) {
			p_count += 1;
			oPreparedStatement.setString(p_count, pattern_switch);

		}
		if (pattern_pwd) {
			p_count += 1;
			oPreparedStatement.setString(p_count, pattern_pwd);
		}
		oPreparedStatement.setString(p_count + 1, loginaccount);
		oPreparedStatement.executeUpdate();
	} catch(e) {
		println(szSql);
		var szMessage = e.name + ": " + e.message + "\n at (" + e.fileName + ":" + e.lineNumber + ")";
		log.error(fetcher.request.url, szMessage);
		println(szMessage);
	} finally {
		//释放连接,必须执行
		oSQLUtilities.cleanUp(null, oPreparedStatement, oConnection);
	}
	//println(szSql);
	user_pattern_info = getUserPatternInfo(loginaccount);
	return user_pattern_info;
}
