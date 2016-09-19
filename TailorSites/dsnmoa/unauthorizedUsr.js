//add by fang 定义登录用户黑名单，定义在unauthorizedUsrs数组里 
function filterAuthorizedUsr(account) {
	var rst = new Object();
	rst.succ = false;
	rst.msg = authorAtt_UNAUTHORIZED_USR + account;
	account = account.trim() ? account : "";
	if (account != "") {
		var flg = true;
		for (var i = unauthorizedUsrs.length - 1; i > -1; i--) {
			if (account === unauthorizedUsrs[i]) {
				flg = false;
				break;
			}
		}
		if (flg) {
			rst.succ = flg;
			rst.msg = "";
		}
	}
	return rst;
}

var authorAtt_UNAUTHORIZED_USR = "未授权访问:";
var unauthorizedUsrs = ["administrator", "admin"];