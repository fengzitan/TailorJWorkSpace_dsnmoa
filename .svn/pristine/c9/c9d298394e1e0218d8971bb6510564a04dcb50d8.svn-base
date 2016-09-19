//关闭文档
/**
 * 关闭文档,并解锁文件状态 
 * @param {Object} prefix		传入TAILOR_BASE_URL
 * @param {Object} parent		传入当前页面的父页面对象
 * @param {Object} callclose	是否发起关闭文档的ajax请求
 * @param {Object} urlDir		callclose=true的情况下，公文类型的字符串。即公文正文url中类似签报公文路径中/qb.nsf/里的qb，部门收文url中/wswgl.nsf/里的wswgl 
 */
function CloseDoc(prefix, parent, callclose, urlDir) {
	callclose = (callclose != null)? callclose : true;
	urlDir = (urlDir)? urlDir : "";
	//QueryClickToolBar();
	var oaUrl = window.location.href.replace(prefix, "");
	var suboaUrl = oaUrl.substr(oaUrl.indexOf("://") + 3, oaUrl.length);
	//var pathname = (window.location.pathname);
	var pathname = suboaUrl.substr(suboaUrl.indexOf("/"), suboaUrl.length);
	var oaDomain = oaUrl.substr(0, oaUrl.indexOf(pathname) + 1);
	var openerate = document.forms[0].operateType.value;
	var url = window.location.href;
	docunid = document.forms[0].SelfID.value;
	loginuser = getUnicodeString(document.forms[0].LoginUser.value);
	urlstring = document.forms[0].UrlString.value;
	var historys = document.forms[0].historys.value;
	//alert("document.forms[0].historys.value=="+document.forms[0].historys.value);
	var bpos = urlstring.lastIndexOf('&gostep=');

	if (bpos == -1) {
		urlstring = '';
	} else {
		urlstring = urlstring.substring(bpos, urlstring.length);
	}
	document.forms[0].NormallyLeave.value = "1";
	//delete by gaomeng var QS=urlstring+'&DocID='+docunid+'&User='+loginuser+TimeNow();
	//delete by lihj  var QS=urlstring+'&DocID='+docunid+'&User='+loginuser+'&historys='+historys+TimeNow();
	//----------------------批处理特殊处理  begin
	if (self.location.href.indexOf("&ViewPCL") > 0 || self.location.href.indexOf("&Status='ViewPCL'") > 0) {
		var QS = urlstring + '&DocID=' + docunid + '&User=' + loginuser + '&historys=' + historys + '&openerate=' + openerate + TimeNow() + '&ViewPCL=true';
	} else {
		var QS = urlstring + '&DocID=' + docunid + '&User=' + loginuser + '&historys=' + historys + '&openerate=' + openerate + TimeNow();
	}
	//----------------------批处理特殊处理 end
	if (window.location.href.lastIndexOf('&FullTextSearchNotRefreshParentWin') != -1) {
		//搜索打开的文档直接关闭
		window.close();
	} else {
		var newPath = pathname.substring(0, (pathname.lastIndexOf('.nsf') + 5)) + 'CACloseDoc?OpenAgent' + QS;
		newPath = newPath.substr(newPath.indexOf("r\/") + 2, newPath.length);
		//window.location.assign(pathname.substring(0, (pathname.lastIndexOf('.nsf') + 5)) + 'CACloseDoc?OpenAgent' + QS);
		if(urlDir != ""){
			//newPath = prefix + newPath.replace("jrgz.nsf", urlDir + ".nsf");
			newPath = prefix + oaDomain + newPath.replace("jrgz.nsf", urlDir + ".nsf");
			if(callclose){
				//访问关闭地址
				var doUnclock = false;
				if(parent.location.href.indexOf("/jt_dy_morenew.html") > -1 
					|| parent.location.href.indexOf("/jt_dy_wswmore.html") > -1 
					|| parent.location.href.indexOf("/jt_dy_ldmorenew.html") > -1){
					if(confirm("是否标记为已阅？")){
						doUnclock = true;
					}
				}else{
					doUnclock = true;
				}
				if(doUnclock){
					$.ajax({
						method : "GET",
						url : newPath,
						async: true,
						complete : function() {
							
						}
					});
				}
			}
		}
		
		//window.location.assign(newPath);
		if(parent){
			parent.hideLoadingMask();
			parent.closeDocument();
		}
	}
}

function TianXieYiJianT(TianXieYiJianUrl) {
	if(beforetijiao()){
		showLoadingMask();
		document.forms[0].saveStatus.value = "saveExit";
		document.forms[0].hidPostFormAction.value = "PostFormAction";
		document.forms[0].action = TianXieYiJianUrl;
		var frmName = "submit2opintionFrm";
		document.forms[0].target = frmName;
		createNewFrm(frmName);
		document.forms[0].submit();
	}
}

function beforetijiao() {
	var thisform = document.forms[0];
	var CurHjKycz = thisform.CurHjKycz.value;
	CurHjKycz = new String(CurHjKycz);
	var Wjlx = thisform.Wjlx.value;
	if(Wjlx && (Wjlx=="中国移动通信有限公司函" || Wjlx=="公司函发文" || Wjlx=="公司发文")){
		CurHjKycz = new String(new String(thisform.HJkycz.value));
	}
	CurHjKycz = CurHjKycz.toString();
	//if(CurHjKycz.indexOf("发送") >= 0 && thisform.TxWjbh.value != "" && thisform.Wjlx.value != "审计意见") {
	if(checkFasong(CurHjKycz) && thisform.Wjlx.value != "审计意见"){
		if(thisform.TxFsbz.value != "1") {
			if(!confirm("此文件没有发送，提交下一处理后将无法再发送，是否继续提交？")) {
				return false;
			}
		}
	}
	
	if(ItemIsEmpty()){
		return false;
	}
	
	if(CurHjKycz.indexOf("归档") >= 0) {
		if(thisform.TxSfgd.value != "1") {
			showMessageDialog("请归档文件！");
			return false;
		}
	}
	
	var checkCode = checkCodeHiddenValInPage();
	if (CurHjKycz.indexOf("填写文号") >= 0 && checkCode) {
		var TxWjbh = document.getElementById("TxWjbh");
		TxWjbh = (TxWjbh)? TxWjbh : document.getElementsByName("TxWjbh")[0];
		if (TxWjbh != undefined) {
			num1 = document.all.TxWjbh.value;
			if (num1 == "" && ("<%=wjlx%>" === "签报" && "<%=gongwenObj.zhuangtai%>" != "综合部拟办")) {
				showMessageDialog("请填写文件编号!");
				return;
			}
			else if(num1 == "" ){
				showMessageDialog("请填写文件编号!");
				return;
			}
		}
	}
	return true;
}

//因为有些文种的编号判断未能包括在下面的判断逻辑里，此处正对未判断到的文种单独处理
function checkCodeHiddenValInPage(){
	var withoutCode = false;	//是否在页面隐藏字段中有编号值
	if("<%=wjlx%>" === "中国移动通信有限公司（批复）"){
		var TxWjnf = document.forms[0].TxWjnf.value;
		if(TxWjnf && TxWjnf.trim() != ""){
			withoutCode = false;
		}
	}
	return withoutCode;
}

//判断指定域是否为空
function ItemIsEmpty() {
	CantEmptyItem = document.all.HJbwky.value + ";";
	if(CantEmptyItem != "") {
		while(CantEmptyItem.indexOf(";") > 0) {
			valueb = CantEmptyItem.substring(0, CantEmptyItem.indexOf(";"));
			CantEmptyItem = CantEmptyItem.substring(CantEmptyItem.indexOf(";") + 1);
			valuec = valueb.substring(0, valueb.indexOf("&"));
			valueb = valueb.substring(valueb.indexOf("&") + 1);
			if(document.all.item(valuec) != null) {
				if(document.all.item(valuec).value == "") {
					showMessageDialog(valueb);
					if(document.all.item(valuec).type != "hidden")
						document.all.item(valuec).focus();
					return true;
				}
			}
			return false;
		}
	}
}

function checkFasong(CurHjKycz){
	var thisform = document.forms[0];
	var conditionArr = new Array();
	conditionArr[0] = CurHjKycz.indexOf("发送") >= 0 && thisform.TxWjbh.value != "";
	conditionArr[1] = thisform.WFclhj.value=="会议纪要起草人发送" && thisform.TxFsbz.value !="1";
	for(var i = 0; i < conditionArr.length; i++){
		if(conditionArr[i]){
			return true;
		}
	}
	
}
