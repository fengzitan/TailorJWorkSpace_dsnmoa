include('conf.js');
include('util.js');
t.init({
	switch :  true,
	filename : 'todo.js',
	business : '待阅列表'
});
t.hi();
var response = {
	success : true,
	message : '响应正常',
	data : ''
}
try{
	var request = fetcher.request;
	
}catch(e){
	t.throwerror(e);
}finally{
	t.bye();
	t.record();
}