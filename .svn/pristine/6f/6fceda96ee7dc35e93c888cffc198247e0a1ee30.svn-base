/**
 * 设计院配置池
 */

//定义常量 是否在多应用模式下运行
const isMEMAMode = isServerMEMAMode();

// var engineer = 'tanyufeng';
//const engineer = "uat.southbase";// 南基UAT(上线前验证)
const engineer = "release.southbase";// 南基生产环境
// var engineer = 'shilei';
// var engineer = 'gouxinhong';
// var engineer = 'chenyu';
// var engineer = '207';
// var engineer = 'fangqing';
/**************************开发者账号配置开始*********************/
switch (engineer) {
	case 'tanyufeng':
		var BASEURL = 'http://192.168.2.114:1306';
		var BASERES = 'http://192.168.2.114:8080';
		var LOCAL_RESOURCE_USE_PROXY = false;
		break;
	case 'huangyiyang':
		break;
	case '207':
		var BASEURL = 'http://221.130.253.152:9993';
		var BASERES = 'http://10.1.36.207:8088';
		var LOCAL_RESOURCE_USE_PROXY = 'true';
		break;
	case 'uat.southbase':
		var BASEURL = 'https://sjyuat.wmp51.com';
		var BASERES = 'https://sjyuat.wmp51.com';
		var LOCAL_RESOURCE_USE_PROXY = 'false';
		break;
	case 'release.southbase':
		var BASEURL = 'https://sjyuat.wmp51.com';
		var BASERES = 'https://sjyuat.wmp51.com';
		var LOCAL_RESOURCE_USE_PROXY = 'false';
		break;
	case 'fangqing':
		var BASEURL = 'http://192.168.2.197';
		var BASERES = 'http://192.168.2.197:88';
		var LOCAL_RESOURCE_USE_PROXY = false;
		break;
	case 'shilei':
		break;
}

var TAILOR_BASE_URL_ = BASEURL + '/tailor/';
if(isMEMAMode){
	TAILOR_BASE_URL_ = CONST_TAILOR_BASEURL;
}
var TAILOR_BASE_URL = TAILOR_BASE_URL_;

const LOCAL_RESOURCE_URL = BASERES + '/resource/cmcc/dsn/';
/**************************开发者账号配置结束******************/

/*************************环境配置开始************************/
//const SERVER = 'test';
const SERVER = 'formal';
switch (SERVER) {
	case 'test':
		var rooturl = 'http://cmdioa.di.cmcc:9080/';
		var rooturl_dm = 'http://dm.cmdioa.di.cmcc:9080/';
		break;
	case 'formal':
		var rooturl = 'http://one.router.com/';
		var rooturl_dm = rooturl;
		break;
}

const ROOTURL = rooturl;
const ROOTURL_DM = rooturl_dm;
/*************************环境配置结束************************/

/*************************其他常量配置开始************************/
const MOA_WEBAPPID = '63837736-7987-11e6-8990-90e2ba2111bc';
const MOA_WEBAPPCODE = "dsnmoa";
const TIMELOG_SWITCH = true;// 时间日志记录开关

//判断tailor是否运行在多应用方式下
function isServerMEMAMode(){
	var isMEMAMode = false;
	var ServerRunMode = appConfig.get("ServerRunMode");
	ServerRunMode = ServerRunMode? ServerRunMode : "";
	if(ServerRunMode === ""){
		var MEMAMode = appConfig.get("MEMAMode");
		MEMAMode = MEMAMode? MEMAMode.trim().toLocaleLowerCase() : "";
		if(MEMAMode === "on"){
			isMEMAMode = true;
		}
	}else if(ServerRunMode === "MEMA"){
		isMEMAMode = true;
	}
	return isMEMAMode;
}

function getWebappInfo(){
	var rst = new Object();
	rst.webappid = MOA_WEBAPPID;
	rst.webappcode = MOA_WEBAPPCODE;
	var isMEMAMode = isMEMAMode;
	if(isMEMAMode){
		var oClientContext = fetcher.client;
		var oHttpClientRequest = oClientContext.request;
		rst.webappid = oHttpClientRequest.webAppId;
		rst.webappcode = oHttpClientRequest.webAppCode;
	}
	return rst;
}

var webappInfo = getWebappInfo();
const WEBAPP_ID = webappInfo.webappid;
const WEBAPP_CODE = webappInfo.webappcode;

/*************************其他常量配置结束************************/