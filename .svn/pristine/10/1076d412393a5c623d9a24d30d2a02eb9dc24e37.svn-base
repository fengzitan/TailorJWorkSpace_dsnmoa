function DeviceAPI(){}
/**
用户信息初始化
@param usr 用户账号
@param pwd 口令md5
@param province 组织机构ID
*/
DeviceAPI.prototype.setUserInfo=function(usr, pwd, org){
	Set.setUserInfo(usr, pwd, org);
}
//集团访客申请调用
DeviceAPI.prototype.accessApplication=function(){
	Set.openNfc();
}
//消息通知设置
DeviceAPI.prototype.setNotification=function(){
	Set.pushSetting();
}
// 手势密码设置
DeviceAPI.prototype.setGesturePassword=function(){
	Set.modifyGesture();
}
// 应用信息查看
DeviceAPI.prototype.appInfo=function(){
	Set.about();
}