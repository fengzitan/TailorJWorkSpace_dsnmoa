include('conf.js');
include('util.js');
t.init({
	switch : true,
	filename : 'login.js',
	business : '登录-post'
});
var response = {
	success : true,
	data : '',	// isOk 登陆成功，noOk 登陆失败
	message : '响应正常'
};
var json = new Object();
try {
	t.hi();
	var request = fetcher.request;
	var method = request.method.toLowerCase();
	if("post" === method){
		try{
			//过滤自定义不允许登录的用户名
			var _mPostParams = new PostParameters(request.postData, "utf-8");
			include("unauthorizedUsr.js");
			var usrAccount = _mPostParams["userName"];
			var pwd = _mPostParams["password"];
			// 口令解密
			var _mPrivateKey = application.get("private_key");
			var _oRSASecurity = new RSASecurity();
			_mPostParams.add("password", _oRSASecurity.decrypt(pwd, _mPrivateKey), true);
			
			request.postData = _mPostParams.encodeToString("utf-8");
			var filterRst = filterAuthorizedUsr(usrAccount);
			if(filterRst.succ){
				var dom = fetcher.fetchDocument(request).document;
				/**
				 * @todo 未处理密码错误/密码过期/其他未知异常的情况 
				 */
				var otitle = dom.evaluate(".//TITLE", dom, "", 1);
				var title = "";
				if(otitle){
					title = otitle.innerText;
				}
				if(title === '首页'){	//登录成功
					response.data = 'isOk';
					if(usrAccount.indexOf("%") > -1){
						usrAccount = urlDecoder(usrAccount, "utf-8");
					}
					application.set("username", usrAccount);
					//将用户账户传给tailor以便在app_user表中自动添加用户信息
					globalSession.loginAccount = usrAccount;
					var userCNName = usrAccount;
					var url = rooturl + "/workbench/workbench/toTop.action?aid=5&loginType=2";
					request.url = url;
					request.method = "GET";
					var odoc = fetcher.fetchDocument(request).document;
					if(odoc){
						var oDD = odoc.evaluate(".//DD[@class='dt_dd1']", odoc, "", 1);
						if(oDD){
							var oTextShears = new TextShears();
							userCNName = oTextShears.extractSegmentInner(oDD.innerText, "你好!", "   今天是");
							userCNName = userCNName.replaceAll("你好", "").replaceAll("您好", "").replaceAll(",", "").replaceAll("，", "").replaceAll("!", "").replaceAll("！", "");
						}
					}
					globalSession.loginUserName = userCNName;
					//如果是单企业模式则手动添加用户
					if(!isMEMAMode){
						logUser2DB(usrAccount, userCNName);
					}else{
						// 统计登录成功
						log.login(request.url, "success");
					}
					
					if (_mPostParams["saveAccount"]) {
						application.set("username", usrAccount);
						application.set("password", _mPostParams["password"]);
					}
					application.set("save_account", _mPostParams["saveAccount"]);
				}else{
					response.data =	'noOk';
				}
			}else{
				response.data =	'noOk';
				response.success = false;
				response.data =	'noOk';
				response.message = filterRst.msg;
			}
		}catch(ex){
			response.success = false;
			response.data =	'noOk';
			response.message = "服务器内部错误！";
			response.detail = ex.name + ": " + ex.message;
			t.throwerror(ex);
		}finally{
			tailor.contentType = 'json';
			tailor.setTextResult(JSON.stringify(response));
			t.bye();
			t.record();
		}
	}else{	//get请求
		globalSession.clearCookie();
		//设置了保存密码的情况下取用户密码
		json.usr = application.get("username");
		json.pwd = application.get("password");
		json.save = application.get("save_account");
		
		//rsa加密相关
		//RSA加密证书位数
		var certLength = 512;
		//RSA密钥最大位数(证书位数*2/进制+1)
		var maxDigits = certLength * 2 / 16 + 1;
		var _oRSASecurity = new RSASecurity();
		var _oRSAKeyPair = _oRSASecurity.generateRSAKey(certLength, new Date().getTime());
		var _oRSA = {
			"pk" : _oRSAKeyPair.getPublicexponent(),
			"mod" : _oRSAKeyPair.getPublicmodulus(),
			"max" : maxDigits
		};
		json.rsa = _oRSA;
		application.set("private_key", _oRSAKeyPair.getPrivatekey());
		json = JSON.stringify(json);
	}
} catch (e) {
	response.success = false;
	response.data =	'noOk';
	response.message = "服务器内部错误！";
	response.detail = e.name + ": " + e.message;
	t.throwerror(e);
} finally {
	t.bye();
	t.record();
}

/**
 * 记录登录的用户到app_user里，无管理系统支撑时使用
 * @param {Object} account
 * @param {Object} cnName
 */
function logUser2DB(account, cnName) {
	account = account || "";
	include("app.util.db.js");
	if("" != account && "" === getUserIDByLoginAccount(account, WEBAPP_ID)){
		var oSQLUtilities = new SQLUtilities();
		var oConnection;
		var oPreparedStatement;
		var szSql = "insert into app_user(ID, uid, LoginAccount, cn, `status`, webappid, CreatedTime, ModifiedTime) values (?, ?, ?, ?, ?, ?, ?, ?)";
		var guid = randomUUID();
		var now = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
		try {
			oConnection = oSQLUtilities.getConnection();
			oPreparedStatement = oConnection.prepareStatement(szSql);
			oPreparedStatement.setString(1, guid);
			oPreparedStatement.setString(2, guid);
			oPreparedStatement.setString(3, account);
			oPreparedStatement.setString(4, cnName);
			oPreparedStatement.setInt(5, 1);
			oPreparedStatement.setString(6, WEBAPP_ID);
			oPreparedStatement.setString(7, now);
			oPreparedStatement.setString(8, now);
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
}
