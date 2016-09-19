function Verifier(){this.tools=new Tools();this.checkNullField=function(Field){if(Field.value==""){Field.focus();return false;}else{return true;}}
this.checkLawlessChar=function(Field){var srcStr=/[#<>"*/\:@;&*^#@$%:\"\'~+"/\;]/ig;var v=Field.value.match(srcStr);if(v!=null){this.tools.showAlert('check.includeillegalchar');Field.focus();return false;}
else{return true;}}
this.checkEnNumOnly=function(Field){if(Field.value!=""){var flag1=false;var flag2=false;for(i=0;i<Field.value.length;i++){ch=Field.value.charAt(i);if((ch<'0'||ch>'9')&&(ch<'a'||ch>'z')&&(ch<'A'||ch>'Z')){this.tools.showAlert("check.EnNumOnly");Field.focus();return false;}
if(ch>='0'&&ch<='9'){flag1=true;}
if((ch>='a'&&ch<='z')||(ch>='A'&&ch<='Z')){flag2=true;}}
if(flag1&&flag2){return true;}else{this.tools.showAlert("check.EnNumOnly");return false;}}}
this.checkEnNumOnly2=function(Field){if(Field.value!=""){var flag1=false;var flag2=false;var flag3=false;for(i=0;i<Field.value.length;i++){ch=Field.value.charAt(i);if((ch<'0'||ch>'9')&&(ch<'a'||ch>'z')&&(ch<'A'||ch>'Z')&&(ch!='_')){this.tools.showAlert("check.EnNumOnly2");Field.focus();return false;}
if(ch>='0'&&ch<='9'){flag1=true;}
if((ch>='a'&&ch<='z')||(ch>='A'&&ch<='Z')){flag2=true;}}
if(Field.value.indexOf('_')!=-1){flag3=true;}
if(flag1&&flag2&&flag3){return true;}else{this.tools.showAlert("check.EnNumOnly2");return false;}}}
this.checkLawlessCharURL=function(Field){var srcStr=/[#<>"*\@;&*^#@$%:\"\'~+"/\;]/ig;var url="http://";if(Field.value.substring(0,7)==url){var v=Field.value.substring(7,Field.value.length).match(srcStr);if(v!=null){this.tools.showAlert('check.includeillegalchar');Field.focus();return false;}
else{return true;}}else{this.tools.showAlert('check.includeillegalurl');return false;}}
this.CheckInteger=function(Field){this.checkNullField(Field);if(Field.value!=""){for(i=0;i<Field.value.length;i++){ch=Field.value.charAt(i);if((ch<'0'||ch>'9')){Field.focus();return false;}}}
return true;}
this.CheckReal=function(Field){this.checkNullField(Field);if(Field.value!=""){DotNum=0;for(i=0;i<Field.value.length;i++){ch=Field.value.charAt(i);if((ch<'0'||ch>'9')&&ch!='.'){return false;}
if(ch=='.'){DotNum++;if(DotNum>1){return false;}}}}
return true;}
this.CheckEmail1=function(Field){var i=1;var len=Field.value.length;if(len>50){this.tools.showAlert("check.emailformaterr");return false;}
pos1=Field.value.indexOf("@");pos2=Field.value.indexOf(".");pos3=Field.value.lastIndexOf("@");pos4=Field.value.lastIndexOf(".");if((pos1<=0)||(pos1==len-1)||(pos2<=0)||(pos2==len-1)){this.tools.showAlert("check.illegalemail");Field.focus();return false;}
else{if((pos1==pos2-1)||(pos1==pos2+1)||(pos1!=pos3)||(pos4<pos3))
{this.tools.showAlert("check.illegalemail");Field.focus();return false;}}
return true;}
this.CheckEmail=function(Field){this.checkNullField(Field);var e=Field.value;if(e!=""){if(!/(\S)+[@]{1}(\S)+[.]{1}(\w)+/.test(e)){this.tools.showAlert("check.illegalemail");Field.focus();return false;}}}
this.isIPv4=function(Field){this.checkNullField(Field);var reg=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;if(!reg.test(Field.value)){this.tools.showAlert("check.illegalip");return false;}}
this.checkIPAddress=function(Field){this.checkNullField(Field);this.CheckIntegerForIPAddress(Field);var reSpaceCheck=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;if(reSpaceCheck.test(Field.value)){Field.value.match(reSpaceCheck);if(RegExp.$1<=255&&RegExp.$1>=0&&RegExp.$2<=255&&RegExp.$2>=0&&RegExp.$3<=255&&RegExp.$3>=0&&RegExp.$4<=255&&RegExp.$4>=0){return true;}else{this.tools.showAlert("check.illegalip");return false;}}else{this.tools.showAlert("check.illegalip");return false;}}
this.CheckIntegerForIPAddress=function(Field){if(Field.value!=""){for(i=0;i<Field.value.length;i++){ch=Field.value.charAt(i);if((ch<'0'||ch>'9')&&ch!='.'){this.tools.showAlert("check.illegalip");Field.value="";Field.focus();return false;}}}
return true;}
this.checkMobile=function(Field){var reg=/13[0,1,2,3,5,6,7,8,9]\d{8}/;if(Field.value.match(reg)==null){this.tools.showAlert("check.illegalmobile");Field.focus();return false;}
return true;}
this.checkChinese=function(Field){var reg=/^[\u4E00-\u9FA5\uF900-\uFA2D]+$/;var v=Field.value;if(v.match(reg)==null){this.tools.showAlert("chech.onlychinesechar");return false;}}
this.checkEnglish=function(Field){if(Field.value!=""){for(i=0;i<Field.value.length;i++){ch=Field.value.charAt(i);if((ch<'a'||ch>'z')&&(ch<'A'||ch>'Z')&&(ch!='.')){this.tools.showAlert("chech.onlyenglishchar");Field.focus();return false;}}}}
this.checkContext=function(Field){if(Field.value!=""){if(Field.value.substring(0,1)!="/"){this.tools.showAlert("check.startwithbar");}else{for(i=0;i<Field.value.length;i++){ch=Field.value.charAt(i);if((ch<'a'||ch>'z')&&(ch<'A'||ch>'Z')&&(ch!='/')){this.tools.showAlert("chech.onlyenglishchar");Field.focus();return false;}}}}}
this.checkNotChinese=function(Field){if(Field.value!=""){var url="http://";if(Field.value.substring(0,7)==url){for(i=7;i<Field.value.length;i++){ch=Field.value.charAt(i);if((ch<'a'||ch>'z')&&(ch<'A'||ch>'Z')&&(ch!='.')&&(ch<'0'||ch>'9')){this.tools.showAlert("chech.onlyenglishchar");Field.focus();return false;}}}}}
this.checkNotChinese2=function(Field){if(Field.value!=""){for(i=0;i<Field.value.length;i++){ch=Field.value.charAt(i);if((ch<'a'||ch>'z')&&(ch<'A'||ch>'Z')&&(ch!='.')&&(ch<'0'||ch>'9')){this.tools.showAlert("chech.onlyenglishchar");Field.focus();return false;}}}}
this.checkBlankSpace=function(Field){var strlength;var k;var ch;strlength=Field.value.length;for(k=0;k<=strlength;k++){ch=Field.value.substring(k,k+1);if(ch==" "){this.tools.showAlert("check.nospace");return false;}}
return true;}
this.checkPage=function(Field){var str=Field.value;str=str.substring(str.indexOf("."),str.length);if(str!=".jsp"&&str!=".html"&&str!=".htm"){this.tools.showAlert("check.permissivefiletype");return false;}}
this.leftTrim=function(Field){return Field.value.replace(/(^\s*)/g,"");}
this.rightTrim=function(Field){return Field.value.replace(/(\s*$)/g,"");}
this.trim=function(Field){return Field.value.replace(/(^\s*)|(\s*$)/g,"");}
this.trimAll=function(Field){return Field.value.replace(/(\s*)/g,"");}
this.getLeft=function(Field,len){if(isNaN(len)||len==null){len=Field.value.length;}else{if(parseInt(len)<0||parseInt(len)>Field.value.length){len=Field.value.length;}}
return Field.value.substring(0,len);}
this.getRight=function(Field,len){if(isNaN(len)||len==null){len=Field.value.length;}else{if(parseInt(len)<0||parseInt(len)>Field.value.length){len=Field.value.length;}}
return Field.value.substring(Field.value.length-len,Field.value.length);}
this.getCurrentTime=function(){var now=new Date();var year=now.getYear();var month=now.getMonth();var date=now.getDate();var day=now.getDay();var hours=now.getHours();var minutes=now.getMinutes();var seconds=now.getSeconds();var timeValue=year+"年"+month+"月"+date+"日"+switchWeekOfDay(day)+hours;timeValue+=((minutes<10)?":0":":")+minutes;timeValue+=((seconds<10)?":0":":")+seconds;return timeValue;}
function switchWeekOfDay(day){switch(day){case 0:return"星期日";case 1:return"星期一";case 2:return"星期二";case 3:return"星期三";case 4:return"星期四";case 5:return"星期五";case 6:return"星期六";}}
this.getDiffTime=function(date1,date2){var diff=new Date()
diff.setTime(Math.abs(date1.getTime()-date2.getTime()));timediff=diff.getTime();hours=Math.floor(timediff/(1000*60*60));timediff-=hours*(1000*60*60);mins=Math.floor(timediff/(1000*60));timediff-=mins*(1000*60);secs=Math.floor(timediff/1000);timediff-=secs*1000;return hours+":"+mins+":"+secs;}}