include("conf.js");
include("util.js");

t.init({
	filename : 'login.js',
	business : '登录-退出'
});
t.probe('hi');

var json = new Object();
json.success = false;

try {
	var _mRequest = fetcher.request;
	
	_mRequest.url = application.get("logout_url");
	
	addCookieHeader(_mRequest);
	
	t.reqCode = '退出登录';
	//var _mResponse = fetch(_mRequest);
	fetcher.fetchStream(_mRequest);
	json.success = true;
	
	tailor.contentType = "text/json";
	tailor.setTextResult(JSON.stringify(json));
} catch (e) {
	println(e.message);
} finally {
	t.probe('bye');
	TimeLogger.log(t.result());
}