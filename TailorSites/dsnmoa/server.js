include('conf.js');
include('util.js');
include('util.db.js');
var response = {
	success : true,
	message : '更新数据成功',
	data : 'isOK'
}
try{
	var request = fetcher.request;
	var id = request.url.split('id=')[1].split('&')[0];
	var display = request.url.split('display=')[1];
	var usr = application.get("username");
	t.out(usr);
	usr = usr? usr : "";
	if("" != usr){
		updateUserModuleConfig(usr,id,display);
	}else{
		response.success = false;
		response.message = "未登登录或登录超时";
		response.data = 'noOK';
	}
}catch(e){
	t.throwerror(e);
}finally{
	tailor.contentType = 'json';
	tailor.setTextResult(JSON.stringify(response));
}