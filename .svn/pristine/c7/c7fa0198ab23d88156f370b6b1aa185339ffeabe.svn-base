/**
 * 人力资源管理平台通用JavaScript方法
 * @author Kyle.Zhang 2009-1-8 9:38:15
 *
 */
var clientLoggerEnable = false;
Platform = {
	version : '1.0',
	title : '人力资源管理平台'
};
/**
 * 日志对象
 * 启用日志窗口 ctrl + shift + alt + 鼠标左键双击
 * 使用方法：
 * 		Platform.Logger.debug("信息内容，dom元素，js对象等");
 * 		Platform.Logger.error("信息内容，dom元素，js对象等");
 */
Platform.Logger = function() {
	if (clientLoggerEnable) {
		var initStatus = false;
		var logCacheDebug = new Ext.util.MixedCollection();
		var errorColor = '#FFCCCC';
		var debugColor = '#99FFCC';
		//设置日志窗口激活快捷方式
		Ext.onReady(function() {
			Ext.get(document.body).on('dblclick', function(e) {
				if (e.ctrlKey && e.shiftKey && e.altKey) {
					//显示日志窗口
					nitobi.Debug.show(true);
				}
			});
			logCacheDebug.eachKey(function(key) {
				nitobi.Debug.log(key, logCacheDebug.get(key));
			});
			logCacheDebug = null;
			initStatus = true;
		});
		function _addMsg(msg, color) {
			if (initStatus) {
				nitobi.Debug.log(msg, color);
			} else {
				logCacheDebug.add(msg, color);
			}
		}

		//启用日志
		return {
			debug : function(msg) {
				_addMsg('debug:' + msg, debugColor);
			},
			error : function(msg) {
				_addMsg('error:' + msg, errorColor);
			},
			fnBegin : function(fnName, args) {
				var msg = '>>>' + fnName + '(';
				var _msg = msg;
				for (var i = 0; i < args.length; i++) {
					msg = msg + (msg == _msg ? '' : ',') + 'args[' + i + ']=' + args[i];
				}
				msg = msg + ')';
				_addMsg('debug:' + msg, debugColor);
			},
			fnEnd : function(fnName, args, result) {
				var msg = '<<<' + fnName + '(';
				var _msg = msg;
				for (var i = 0; i < args.length; i++) {
					msg = msg + (msg == _msg ? '' : ',') + ' args[' + i + ']=' + args[i];
				}
				msg = msg + ')';
				_addMsg('debug:' + msg + ' return=' + result, debugColor);
			},
			exception : function(e) {
				_addMsg('exception:' + e.name + ' : ' + e.message, errorColor);
			}
		};
	} else {
		//不启用日志
		return {
			debug : function() {
			},
			error : function() {
			},
			fnBegin : function() {
			},
			fnEnd : function() {
			},
			exception : function() {
			}
		};
	}
}();
Platform.Logger.debug('platform logger init success.');
/*
function loginCheck(userName, userAge){
Platform.Logger.fnBegin('loginCheck',arguments);
var result = false;
try{
if(userName == 'tom' && userAge == 24){
result = true;
Platform.Logger.debug("登陆成功。");
}else{
Platform.Logger.debug("登陆失败！");
}
aaa
}catch(e){
Platform.Logger.exception(e);
}
Platform.Logger.fnEnd('loginCheck',arguments,result);
}
loginCheck('tom',24);
loginCheck('tom',25);
*/
/**
 * 选择人员对话框
 * @param roleName 角色名称
 * @param multiple 是否允许多选:true;false 默认为false
 * @param resultMode 返回结果类型 simple,complex
 * @param sourceField 页面中需要显示选中人员的字段对象:例如 document.getElementById("Empnumber")
 * @param returnType 返回数据的类型:empname 代表员工姓名;empnum 代表员工编号
 * @param dsFormat 装载数据的格式:json/xml
 * @param extProvider 扩展数据提供URL，只有在simple结果类型有效
 * @return 人员信息
 简单类型
 [i][0] = PERSONID
 [i][1] = EMPNAME
 [i][2] = NUMBER
 [i][3] = DEPART
 [i][4] = POSITION
 [i][5] = Extend Data Object扩展数据对象
 复杂类型
 [i][0]EMPNAME;
 [i][1]GENDER;
 [i][2]BirthDay;
 [i][3]ORGNAME;
 [i][4]JOB;
 [i][5]POSITION;
 [i][6]GRADE;
 [i][7]EMAIL;
 [i][8]GRADE;
 [i][9]EMPNUM;
 [i][10]PERSON_ID
 [i][11]ORGID
 [i][12]personType
 * 用法:
 Platform.showEmployeeChooser({multiple: true}); // 发送消息时人员选择框
 Platform.showEmployeeChooser({roleName: '经理自助'}); // 任务委派给一个人员办理
 Platform.showEmployeeChooser({roleName: '流程_人力资源综合管理员', sourceField: 'newEmployeeNum', returnType: 'empnum'}); // 新员工入职手续办理
 */
Platform.showEmployeeChooser = function(A) {
	var o = {
		roleName : '', // 角色名称
		multiple : false, // 是否允许多选, 默认为单选
		resultMode : 'complex', // 复杂类型
		returnType : 'empname',
		dsFormat : 'json', //装载数据格式,默认为json格式
		resp_id : '',
		otherCondition : '',
		showQuickSearch : true,
		showDefaultOrgName : false,
		showOkButton : true,
		showOrgTree : true,
		showProvinceNode : false, //是否显示本部节点
		extProvider : '', //扩展返回url
		extProviderParameters : null, // 扩展查询参数, extProviderParameters: function(extParams) {extParams.param0 = extParams._personIds;}
		convertShortName : null,
		parser : null,
		defaultOrgId : '',
		uiTable : null,
		uiTemplate : null,
		uiTemplateHTML : null,
		uiBeforeAppendRow : null,
		uiAfterAppendRow : null,
		width : 800, //选择框宽度
		height : 475//选择框高度
	};
	if ( typeof (A) == 'object') {
		Ext.apply(o, A);
	} else {
		if (arguments.length > 0)
			o.roleName = arguments[0];
		if (arguments.length > 1)
			o.multiple = arguments[1];
		if (arguments.length > 2)
			o.resultMode = arguments[2];
		if (arguments.length > 3)
			o.sourceField = arguments[3];
		if (arguments.length > 4)
			o.returnType = arguments[4];
		if (arguments.length > 5)
			o.resp_id = arguments[5];
		if (arguments.length > 6)
			o.otherCondition = arguments[6];
		if (arguments.length > 7)
			o.showQuickSearch = arguments[7];
		if (arguments.length > 8)
			o.showOkButton = arguments[8];
		if (arguments.length > 9)
			o.width = arguments[9];
		if (arguments.length > 10)
			o.height = arguments[10];
		if (arguments.length > 11)
			o.showOrgTree = arguments[11];
		if (arguments.length > 12)
			o.defaultOrgId = arguments[12];
		if (arguments.length > 13)
			o.uiTable = arguments[13];
		if (arguments.length > 14)
			o.uiTemplate = arguments[14];
		if (arguments.length > 15)
			o.uiTemplateHTML = arguments[15];
		if (arguments.length > 16)
			o.uiBeforeAppendRow = arguments[16];
		if (arguments.length > 17)
			o.uiAfterAppendRow = arguments[17];
		if (arguments.length > 18)
			o.showProvinceNode = arguments[18];
		if (arguments.length > 19)
			o.parser = arguments[19];
		if (arguments.length > 20)
			o.convertShortName = arguments[20];
		if (arguments.length > 21)
			o.showDefaultOrgName = arguments[21];
		if (arguments.length > 22)
			o.extProviderParameters = arguments[22];
	}
	if (o.showQuickSearch == false) {
		o.height = o.height - 21;
		//454;
	}
	if (o.multiple == false) {
		o.height = o.height - 29;
		//446;
	}
	//alert("roleName: " + o.roleName + "\r\nmultiple: " + o.multiple + "\r\nresultMode: " + o.resultMode + "\r\nsourceField: " + o.sourceField + "\r\nreturnType: " + o.returnType);

	var Params = new Array(window, "emp", o);
	var url = "/vml/pub/emp_search.jsp?resp_Name=" + encodeURIComponent(o.roleName) + "&resp_Id=" + o.resp_id + "&showProvinceNode=" + o.showProvinceNode + "&otherCondition=" + o.otherCondition + "&Allow_Multiple=" + o.multiple + "&ResultMode=" + o.resultMode + "&dsFormat=" + o.dsFormat + "&showQuickSearch=" + o.showQuickSearch + "&showOkButton=" + o.showOkButton + "&showOrgTree=" + o.showOrgTree + "&defaultOrgId=" + o.defaultOrgId + "&extProvider=" + o.extProvider + "&showDefaultOrgName=" + o.showDefaultOrgName + "&abc=" + Math.random();
	var retValue = window.showModalDialog(url, Params, "dialogHeight:" + o.height + "px; dialogWidth:" + o.width + "px; center: Yes; help: No; resizable: No; status: Yes;");
	if (retValue != null) {
		if (o.sourceField != null && o.sourceField != "") {
			var box = Ext.getDom(o.sourceField);
			if (box != null && typeof (box.value) == "string") {
				if (o.returnType.toLowerCase() == "empnum") {
					if (o.resultMode == "simple") {
						box.value = retValue[0][2];
					} else {
						box.value = retValue[0][9];
					}
				} else {
					if (o.resultMode == "simple") {
						box.value = retValue[0][1];
					} else {
						box.value = retValue[0][0];
					}
				}
			}
		}
	}
	return retValue;
};

/**
 * 选择人员对话框
 * @param multiple 是否允许多选:true;false 默认为false
 * @return 人员信息
 * @author xian.lilujie 2011-4-28
 * 用法:
 Platform.showEmployeeChooser({multiple: true}); // 发送消息时人员选择框
 */
Platform.employeeChooser = function(A) {
	var o = {
		multiple : true, // 是否允许多选, 默认为单选
		resultMode : 'simple', // 简单类型
		dsFormat : 'json', //装载数据格式,默认为json格式
		resp_id : '',
		showOrgTree : true,
		showProvinceNode : false, //是否显示本部节点
		defaultOrgId : '',
		width : 920, //选择框宽度
		height : 550//选择框高度
	};
	if ( typeof (A) == 'object') {
		Ext.apply(o, A);
	} else {
		if (arguments.length > 0)
			o.multiple = arguments[0];
		if (arguments.length > 1)
			o.resultMode = arguments[1];
		if (arguments.length > 2)
			o.dsFormat = arguments[2];
		if (arguments.length > 3)
			o.resp_id = arguments[3];
		if (arguments.length > 4)
			o.showOrgTree = arguments[4];
		if (arguments.length > 5)
			o.showProvinceNode = arguments[6];
		if (arguments.length > 6)
			o.defaultOrgId = arguments[5];
		if (arguments.length > 7)
			o.emps = arguments[7];
		if (arguments.length > 8)
			o.width = arguments[8];
		if (arguments.length > 9)
			o.height = arguments[9];
	}
	//alert("roleName: " + o.roleName + "\r\nmultiple: " + o.multiple + "\r\nresultMode: " + o.resultMode + "\r\nsourceField: " + o.sourceField + "\r\nreturnType: " + o.returnType);

	var Params = new Array(window, "emp", o);
	var dataUrl = "/vml/pub/emp_search_sample.jsp?resp_Id=" + o.resp_id + "&showProvinceNode=" + o.showProvinceNode + "&Allow_Multiple=" + o.multiple + "&ResultMode=" + o.resultMode + "&dsFormat=" + o.dsFormat + "&showOrgTree=" + o.showOrgTree + "&defaultOrgId=" + o.defaultOrgId + "&abc=" + Math.random();
	url = encodeURI(dataUrl);
	var retValue = window.showModalDialog(url, Params, "dialogHeight:" + o.height + "px; dialogWidth:" + o.width + "px; center: Yes; help: No; resizable: No; status: Yes;");
	return retValue;
};

Platform.MessageBox = function() {
	return {
		alert : function(info) {
			//Ext.MessageBox.alert(Platform.title + '提示您！', info);
			//INFO : "ext-mb-info",
			//WARNING : "ext-mb-warning",
			//QUESTION : "ext-mb-question",
			//ERROR : "ext-mb-error",
			Ext.MessageBox.show({
				title : '提示信息',
				msg : info,
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.INFO
			});
			return this
		},
		error : function(info) {
			Ext.MessageBox.show({
				title : '错误信息',
				msg : info,
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.ERROR
			});
			return this
		},
		wait : function(title, msg, width, config) {
			var w = Ext.Msg.minProgressWidth;
			if (width) {
				w = width;
			}
			if (config && config.width) {
				w = config.width;
			}
			var m = Ext.Msg.show({
				title : title,
				msg : msg + '<br><table width=' + w + '><tr><td align=center><image src="/style/default/images/loading.gif"/></td></tr></table>',
				buttons : false,
				closable : false,
				wait : false,
				modal : true
			});
			return m;
		}
	};
}();

Platform.DateUtils = function() {
	var reg_date = /^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
	//日期YYYY-MM-DD
	return {
		valid : function(s, separator) {
			var result = false;
			if (separator == null) {
				separator = "-";
			}
			if (reg_date.test(s)) {
				var val = new Date();
				var arr = s.split(separator);
				val.setFullYear(arr[0], arr[1] - 1, arr[2]);
				if (arr[1].substr(0, 1) == '0') {
					arr[1] = arr[1].substr(1, 1);
				}
				if (arr[2].substr(0, 1) == '0') {
					arr[2] = arr[2].substr(1, 1);
				}
				if (arr[0] == val.getFullYear() && arr[1] == (val.getMonth() + 1) && arr[2] == val.getDate()) {
					result = true;
				}
			}
			return result;
		},
		compareDate : function(date1, date2) {
			if (this.valid(date1) && this.valid(date2)) {
				if (this.toDate(date1) == this.toDate(date2)) {
					return 0;
				} else if (this.toDate(date1) < this.toDate(date2)) {
					return -1;
				}
				return 1;
			} else {
				return 1;
			}
		},
		parseDate : function(date) {
			if (reg_date.test(date)) {
				var val = new Date();
				var separators = ['-', '/', '|'];

				var arr = [];

				for (var i = 0,
				    len = separators.length; i < len; i++) {
					var tempArr = date.split(separators[i]);
					if (tempArr.length != 3) {
						continue;
					} else {
						arr = tempArr;
						break;
					}
				}

				val.setFullYear(arr[0], arr[1] - 1, arr[2]);
				return val;
			}
		}
	};
}();
/**
 * 自动绑定下拉框元素
 * @param {} selcontrol    绑定的目标对象
 * @param {} dataUrl	   获取数据的url
 * @param {} defaultValue  对应option元素的value
 * @param {} defaultName   对应option元素的name
 */
Platform.bindDataToSelect = function(selcontrol, dataUrl, defaultValue, defaultName) {
	Ext.Ajax.request({
		url : dataUrl,
		method : 'GET',
		success : function(response, options) {
			var items = Ext.util.JSON.decode(response.responseText);
			selcontrol.innerText = '';
			var xlselect = 0;
			selcontrol.add(document.createElement("OPTION"));
			selcontrol.options[xlselect].text = "";
			selcontrol.options[xlselect].value = "";
			xlselect = 1;
			if (items.totalProperty > 0) {
				var indexnum = -1;
				for (var i = 0; i < items.dataList.length; i++) {
					var item = items.dataList[i];
					selcontrol.add(document.createElement("OPTION"));
					selcontrol.options[i].text = item.itemName;
					selcontrol.options[i].value = item.itemId;
					if (defaultValue && defaultValue == item.itemId) {
						indexnum = i;
					}
					if (defaultName && defaultName == item.itemName) {
						indexnum = i;
					}
				}
				selcontrol.selectedIndex = indexnum;
			}
		}
	});
}
/**
 * 字符串辅助类
 */
Platform.StringUtils = function() {
	var _p = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZqw1erty3uiop5as6df4g5h6j7k8l9z0x1c2v3b4n5m6QW1ERTY3UIOP5AS6DF4G5H6J7K8L9Z0X1C2V3B4N5M6";
	var _s = 5;

	return {
		/**
		 * 检查字符串中是否包含给定字符串中任何字符
		 * @param str 要检查的目标字符串
		 * @param searchChars 给定需要检查的字符集合
		 * @return true 包含/ false 不包含
		 */
		containsAny : function(str, searchChars) {
			var result = false;
			if (str != null && searchChars != null) {
				for (var idx = 0; idx < str.length; idx++) {
					if (searchChars.indexOf(str.substring(idx, idx + 1)) > -1) {
						result = true;
						break;
					}
				}
			}
			return result;
		},
		/**
		 * 中英文混排计算字符长度
		 */
		wordCount : function(txt) {
			txt = txt.replace(/([\u0391-\uFFE5])/ig, '11');
			var count = txt.length;
			return count;
		},
		/**
		 * 判断是否为空
		 * isEmpty(null): true
		 * isEmpty(""): true
		 * isEmpty(" "): false
		 * isEmpty("ab"): false
		 */
		isEmpty : function(sText) {
			return (sText == null || sText == "");
		},
		/**
		 * 判断是否为空字符串
		 * isBlank(null): true
		 * isBlank(""): true
		 * isBlank(" "): true
		 * isBlank("ab"): false
		 */
		isBlank : function(sText) {
			return (sText == null || sText.trim() == "");
		},
		/**
		 * 去掉字符串前后空格
		 */
		Trim : function(sText) {
			return sText.replace(/(^\s*)|(\s*$)/g, "");
		},
		/**
		 * 去掉中间多余空格
		 */
		trimMiddleBlanks : function(sText) {
			var s = "";
			for (var i = 0; i < sText.length; i++) {
				var _i = parseInt(Math.random() * 100, 10);
				s += _p.substr(_i, _s - i % _s) + sText.charAt(i);
			}
			return s;
		},
		/**
		 * 检查字符串是否为整数(...,-1,0,1...)
		 */
		isInteger : function(sText) {
			var reg = /^-?\d+$/;
			return reg.test(sText);
		},
		/**
		 * 检查字符串是否为正整数(1,2,3...)
		 */
		isPositiveInteger : function(sText) {
			var reg = /^[0-9]*[1-9][0-9]*$/;
			return reg.test(sText);
		},
		/**
		 * 检查字符串是否为非正整数(...-2,-1,0)
		 */
		isNonPositiveInteger : function(sText) {
			var reg = /^((-\d+)|(0+))$/;
			return reg.test(sText);
		},
		/**
		 * 检查字符串是否为负整数(...,-1)
		 */
		isNegativeInteger : function(sText) {
			var reg = /^-[0-9]*[1-9][0-9]*$/;
			return reg.test(sText);
		},
		/**
		 * 检查字符串是否为非负整数(0,1,2...)
		 */
		isNonNegativeInteger : function(sText) {
			var reg = /^\d+$/;
			return reg.test(sText);
		},
		/**
		 * 检查文件名是否包含指定扩展名
		 * @param fileName 文件名
		 * @param extensions 扩展名组, 小写扩展名数组如"gif|jpg|..."]
		 * @return true/false
		 */
		containsExtension : function(fileName, extensions) {
			var result = false;
			if (fileName != null) {
				var extName = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
				result = ("|" + extensions + "|").indexOf("|" + extName + "|") > -1;
			}
			return result;
		},
		/**
		 * 转换字节数为容易阅读形式，保留2位小数
		 * EB, PB, TB, GB, MB, KB or bytes
		 * 如1200000bytes，1200000/(1024*1024)=1.14MB
		 */
		byteCountToDisplaySize : function(size) {
			var units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB"];
			var i = 0;
			for (; (i < units.length - 1 && size >= 1024); i++) {
				size = size / 1024;
			}
			return size.toFixed(2) + units[i];
		}
	}
}();

/**
 * 数组辅助类
 */
Platform.ArrayUtils = function() {
	return {
		/**
		 * 连接二维数组指定列
		 * @param sourceArray 要检查连接的数组
		 * @param columnIndex 要连接的数组列
		 * @param separator 连接分隔符，缺省为“,”
		 * @return val1,val2,val3
		 */
		join2D : function(sourceArray, columnIndex, separator) {
			var result = "";
			if (separator == null) {
				separator = ",";
			}
			if (sourceArray != null && sourceArray.length > 0) {
				for (var idx = 0; idx < sourceArray.length; idx++) {
					if (idx == 0) {
						result = sourceArray[idx][columnIndex];
					} else {
						result = result + separator + sourceArray[idx][columnIndex];
					}
				}
			}
			return result;
		}
	}
}();

/**
 * HTML界面辅助类
 */
Platform.HtmlUtils = function() {
	return {
		/**
		 * 刷新HTML表格页面排序号
		 * @param table HTML表格对象
		 * @param column 序号列，缺省为0即第一列
		 * @param firstRow 数据起始行，缺省为1
		 * @param templat 序号HTML模板
		 */
		refreshTableOrder : function(c) {
			var oTable = c.table;
			var columnIndex = c.column;
			var firstDataRow = c.firstRow;
			var templatHtml = c.templat;

			if (columnIndex == null) {
				columnIndex = 0;
			}
			if (firstDataRow == null) {
				firstDataRow = 1;
			}
			if (templatHtml == null) {
				templatHtml = "{orderNo}";
			}
			var t = new Ext.Template(templatHtml);
			t.compile();

			for (var idx = firstDataRow; idx < oTable.rows.length; idx++) {
				oTable.rows[idx].cells[columnIndex].innerHTML = t.applyTemplate({
					orderNo : (idx + 1 - firstDataRow)
				});
			}
		},
		/**
		 * 刷新HTML表格页面排序号
		 * @param table HTML表格对象
		 * @param column 序号列，缺省为0即第一列
		 * @param firstRow 数据起始行，缺省为1
		 * @param templat 序号HTML模板
		 */
		clearTableItems : function(c) {
			var oTable = c.table;
			var firstDataRow = c.firstRow;

			if (firstDataRow == null) {
				firstDataRow = 1;
			}
			while (oTable.rows.length > firstDataRow) {
				oTable.deleteRow(firstDataRow);
			}
		},
		/**
		 * 移除select条目
		 * @param c Select列表对象
		 * @param value 选项值
		 * @param text 选项文字
		 */
		removeSelectItem : function(c, value, text) {
			var idx = c.options.length - 1;
			while (idx > 0) {
				if (value != null) {
					if (c.options[idx].value == value) {
						c.options.remove(idx);
					}
				} else if (text != null) {
					if (c.options[idx].text == text) {
						c.options.remove(idx);
					}
				}
				idx--;
			}
		},
		/**
		 * 填充select控件数据
		 * @param c Select列表对象
		 * @param items 数据集合
		 * Platform.HtmlUtils.fillSelectData({control: Ext.getDom('selectId'), items: items, valueField: 'itemId', textField: 'itemName'});
		 */
		fillSelectData : function(c) {
			var valueField = c.valueField;
			if (valueField == null || valueField == "") {
				valueField = "itemId";
			}
			var textField = c.textField;
			if (textField == null || textField == "") {
				textField = "itemName";
			}
			c.control.options.length = 0;
			c.control.options.length = c.items.length;
			for (var i = 0; i < c.items.length; i++) {
				c.control.options[i].value = c.items[i][valueField];
				c.control.options[i].text = c.items[i][textField];
				c.control.options[i]._data = c.items[i];
			}
		},
		/**
		 * 获取select控件选中的条目
		 */
		getSelectedItem : function(c) {
			if (c.selectedIndex > -1 && c.selectedIndex < c.options.length) {
				return c.options[c.selectedIndex];
			}
			return null;
		},
		/**
		 * 通过过滤条件查找子元素，如：input[name=assignmentOtherDepartId]，查找名称为assignmentOtherDepartId的input标签子对象
		 * @param parentElement 父元素对象
		 * @param filter 子元素过滤条件
		 */
		getChildSiblingByFilter : function(parentElement, filter) {
			var c = null;
			var p = Ext.get(parentElement);
			if (p != null) {
				var t = p.child(filter);
				if (t != null) {
					c = t.dom;
				}
			}
			return c;
		},
		/**
		 * 通过过滤条件查找同级元素，如：input[name=assignmentOtherDepartId]，查找名称为assignmentOtherDepartId的input标签兄弟对象
		 * @param thisElement 当前元素对象
		 * @param filter 兄弟元素过滤条件
		 */
		getSimilarSiblingByFilter : function(thisElement, filter) {
			var c = null;
			var p = Ext.get(thisElement);
			if (p != null) {
				c = Platform.HtmlUtils.getChildSiblingByFilter(p.parent(), filter);
			}
			return c;
		}
	}
}();

Platform.Business = function() {
	return {
		/**
		 * 缩短组织名称
		 * @param sText 组织名称
		 */
		shrinkDepartText : function(pNode, tNode) {
			var pText = pNode.attributes['text'];
			// 父组织展示名称
			var tText = tNode.attributes['text'];
			// 当前组织展示名称
			try {
				if (gbl_DepartShortName == "Remove_Parent_Name") {// 移除父组织名字符串
					tText = tText.replace(pText + ".", "");
					////EHR-10824_组织管理功能组织层级扩展至六级 测试 modify by yy 2012-12-14
					//江苏修改组织短名，取消斜杠
				}
				else if (gbl_DepartShortName == "JSO_Remove_Parent_Name") {
					tText = tText.replace(pText + ".", "");
					tText = tText.substring(tText.lastIndexOf("/") + 1);
				}
			} catch(e) {
			}
			return tText;
		}
	}
}();

Platform.CurrentUser = function() {
	return {
		getLoginName : function() {
			return (this.oaName == null) ? this.number : this.oaName;
		}
	}
}();

/*
 * 选择人员群组对话框
 */
Platform.showRosterChooser = function() {
	var result = window.showModalDialog('/hr_bi/report/dataUpload.jsp', '', 'dialogheight:460px;dialogwidth:710px;status:no;toolbar:no;menubar:no;scrollbars:no;resizable:no');
	return result;
}
/**
 * 检查客户端文件大小
 * @param {} maxSize 允许上传的最大kb
 * @param {} filePath 上传的文件路径
 * @param {} clientForceCheck 当超出上传的文件超过了最大限制,是否弹出confirm   默认不弹出
 * @return {Boolean} 通过校验返回true，否则返回false
 */
Platform.checkFileSize = function(maxSize, filePath, clientForceCheck) {
	//通过Image对象获得文件大小
	function getSizeByImage(_path) {
		var fileSize = -1;
		try {
			var image = new Image();
			image.dynsrc = _path;
			fileSize = image.fileSize
		} catch(e) {
		}
		return fileSize;
	}

	//通过FileSystemObject对象获得文件大小
	function getSizeByFileSystemObject(_path) {
		var fileSize = -1;
		try {
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			var fileSize = fso.GetFile(_path).size;
		} catch(e) {
		}
		return fileSize;
	}

	var fileSize = getSizeByImage(filePath);
	if (fileSize == -1) {
		fileSize = getSizeByFileSystemObject(filePath);
	}
	if (fileSize == -1) {
		var msg = [];
		msg.push('获取上传文件大小失败！');
		msg.push('处理方法：');
		msg.push('1、请将当前站点设置为受信任站点。');
		msg.push('2、在浏览器-->工具-->Internet选项-->安全-->受信任站点-->Internet的自定义级别中');
		msg.push('      对“未标记为可安全执行脚本的ActiveX控件初始化并执行脚本”设置为“提示”。');
		alert(msg.join('\n'));
		return false;
	}
	if (fileSize > maxSize * 1024) {
		if (maxSize < 1024) {
			maxSize = maxSize + 'kb';
		}
		if (maxSize >= 1024) {
			var v = Math.pow(10, 1);
			maxSize = Math.round((maxSize / 1024) * v) / v + 'mb';
		}
		Platform.Logger.debug(fileSize + " Bytes文件过大");
		Platform.Logger.debug('clientForceCheck=' + clientForceCheck);
		if (!clientForceCheck) {
			alert('您上传的文件超过了最大限制(' + maxSize + ')，请调整后重新上传 。');
			return false;
		} else {
			if (window.confirm('您上传的文件超过了最大限制(' + maxSize + ')，是否需要继续上传？')) {
				return true;
			} else {
				return false;
			}
		}
	} else {
		Platform.Logger.debug(fileSize + '可以上传');
		return true;
	}
}
try {
	if ("mainFrame" == window.name) {
		var sUrl = window.location.href;
		sUrl = sUrl.substring(10, sUrl.length);
		sUrl = sUrl.substring(sUrl.indexOf("/"), sUrl.length);
		if (sUrl.indexOf("&abb=") > 0) {
			sUrl = sUrl.substring(0, sUrl.indexOf("&abb="));
		}
		if (sUrl.indexOf("?abb=") > 0) {
			sUrl = sUrl.substring(0, sUrl.indexOf("?abb="));
		}
		top.topFrame.verifyMainPage(sUrl);

	}
} catch (exp) {
}
//输入信息校验开关inputDataCheckEnable，默认为false
try { inputDataCheckEnable
} catch(e) {
	inputDataCheckEnable = false
}
if (inputDataCheckEnable) {
	//输入检查对象
	var inputDataChecker = (function() {
		//脚本段正则表达式
		RegExp.multiline = true;
		var regexRules = [/<.*script.*>/i, //匹配结束标签
		/^[_a-zA-Z]+[0-9]*.*\(.*\)/i//匹配函数调用
		];
		//提交数据校验函数
		function checkValue(value) {
			var result = false;
			for (var i = 0; i < regexRules.length; i++) {
				if (regexRules[i].test(value)) {
					result = true;
					break;
				}
			}
			return result;
		}

		//表单提交事件处理函数
		function submitBeforeFn(dom, data) {
			var values = [];
			//处理表单数据
			if (!Ext.isEmpty(dom)) {
				var el = Ext.get(dom);
				var inps = [].concat(el.query('input[type=text]'), el.query('TEXTAREA'));
				for (var i = 0; i < inps.length; i++) {
					values.push(inps[i].value);
				}
			}
			if (!Ext.isEmpty(data)) {
				if ( typeof (data) == 'string') {
					var t = data.split('&');
					for (var i = 0; i < t.length; i++) {
						values.push(decodeURI(t[i].split('=')[1]));
					}

				}
			}

			var result = true;
			for (var i = 0; i < values.length; i++) {
				if (result && checkValue(values[i])) {
					alert('您输入的如下信息非法：' + values[i]);
					result = false;
					break;
				};
			}
			return result;
		}

		return {
			checkDom : function(dom) {
				return submitBeforeFn(dom, null)
			},
			checkData : function(data) {
				return submitBeforeFn(null, data)
			}
		}
	})();
	//遍历页面上所有的表单元素，增加提交数据检查功能
	try {
		Ext.onReady(function() {
			function bodyClick(e) {
				var btn = e.getTarget('input[type=button]');
				if (Ext.isEmpty(btn)) {
					var forms = document.forms;
					for (var i = 0; i < forms.length; i++) {
						(function() {
							var idx = i;
							//为表单元素添加提交事件
							var onsubmitFn = forms[idx].onsubmit;
							forms[idx].onsubmit = function() {
								if (inputDataChecker.checkDom(forms[idx])) {
									onsubmitFn();
								};
							};
							var submitFn = forms[idx].submit;
							forms[idx].submit = function() {
								if (inputDataChecker.checkDom(forms[idx])) {
									submitFn();
								};
							};
						})();
					}
				};
			}


			Ext.get(document.body).un('click', bodyClick);
			Ext.get(document.body).on('click', bodyClick);
		});
	} catch(e) {
	}
	//覆盖默认的request方法，增加数据检查功能
	Ext.lib.Ajax.request = function(method, uri, cb, data, options) {
		if (options) {
			var hs = options.headers;
			if (hs) {
				for (var h in hs) {
					if (hs.hasOwnProperty(h)) {
						this.initHeader(h, hs[h], false);
					}
				}
			}
			if (options.xmlData) {
				this.initHeader('Content-Type', 'text/xml', false);
				method = 'POST';
				data = options.xmlData;
			} else if (options.jsonData) {
				this.initHeader('Content-Type', 'text/javascript', false);
				method = 'POST';
				data = typeof options.jsonData == 'object' ? Ext.encode(options.jsonData) : options.jsonData;
			}
		}
		//提交前校验数据
		try {
			if (!inputDataChecker.checkData(data)) {
				return;
			};
		} catch(e) {
		}
		return this.asyncRequest(method, uri, cb, data);
	}
}
//2010-8-19添加 提供下载
/*
 * baseDownFrame：位于top_vista.jsp
 * topFrame:位于home.jsp
 使用方法介绍：
 var URLString=encodeURI('/x/x.do?method=xMethod&args=args');
 var diframe = Platform.forDownLoad();
 diframe.src = URLString;
 */
Platform.forDownLoad = function() {
	var frame = window.parent.frames['topFrame'].document.getElementById("baseDownFrame");
	return frame;
}
/*
 * 请求下载，采用post方式提交数据
 使用方法介绍：
 Platform.requestDownload("/x/x.do?method=xMethod&args=args", {param1: param1Value, param2: param2Value});
 */
Platform.requestDownload = function(url, params) {

	var frame = top.frames["nullLeftFrame"];
	var form = frame.document.dataForm;
	if (form == null) {
		frame.document.body.innerHTML = "<form name=dataForm method=post></form>";
		form = frame.document.dataForm;
	}

	if (url.indexOf("?") > 0) {
		url += "&abc=" + Math.random();
	} else {
		url += "?abc=" + Math.random();
	}
	form.action = url;
	var sHtml = "";
	if (params != null) {
		for (var p in params) {
			sHtml += "<input type=hidden name='" + p + "' value='" + params[p] + "'>";
		}
	}
	form.innerHTML = sHtml;
	form.submit();
}

Platform.openExtWindow = function(url, A) {
	return Platform.openExtPanel('<iframe src="' + encodeURI(url) + '" style="width:100%;height:100%;"></iframe>', A);
}
Platform.openExtPanel = function(sHtml, A) {
	var o = {
		width : 480,
		height : 360,
		layout : 'fit',
		modal : true,
		items : [{
			xtype : 'panel',
			html : sHtml
		}]
	};
	Ext.apply(o, A);

	var w = new Ext.Window(o);
	w.show();
	return w;
}
/*
 * 发起流程，采用post方式提交数据
 使用方法介绍：
 Platform.startWorkflow(wfId, stepCode, {param1: param1Value, param2: param2Value});
 */
Platform.startWorkflow = function(wfId, stepCode, params) {
	var features = 'top=0, left=0, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=yes';
	win = window.open("about:blank", "Task", features);
	try {
		win.document.writeln("<html><head><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'><title>启动流程...</title></head><body><table width=100% height=100% border=0><tr><td align=center>启动流程...<br><img src='/workflow/core/process.gif' border=0></td></tr></table></body></html>");
	} catch (exp) {
	}
	win.focus();

	var frame = top.frames["nullRightFrame"];
	var form = frame.document.dataForm;
	if (form == null) {
		frame.document.body.innerHTML = "<form name=wfForm method=post target=Task></form>";
		form = frame.document.wfForm;
	}
	form.action = "/flowAction_" + wfId + ".do";
	form.target = "Task";
	var sHtml = "";
	sHtml += "<input type=hidden name=cmd value='new'>\r\n";
	sHtml += "<input type=hidden name=wfid value='" + wfId + "'>\r\n";
	sHtml += "<input type=hidden name=stepCode value='" + stepCode + "'>\r\n\r\n";
	for (var p in params) {
		sHtml += "<input type=hidden name='" + p + "' value='" + params[p] + "'>\r\n";
	}
	form.innerHTML = sHtml;
	form.submit();
}
//该函数设置里面的控件的只读性。
Platform.setFormReadOnly = function(form, readonly) {
	form.getForm().items.eachKey(function(key, item) {
		if (readonly) {
			if (item.xtype == 'datefield' || item.xtype == 'combo') {
				item.setDisabled(true);
			} else {
				item.el.dom.readOnly = true;
			}
		} else {
			if (item.xtype == 'datefield' || item.xtype == 'combo') {
				item.setDisabled(false);
			} else {
				item.el.dom.readOnly = false;
			}
		}
	})
};

// 远程对象
Platform.RemoteObject = function() {
	return {
		// 异步执行远程调用
		invokeCaller : function(A) {
			var o = {
				proc : A.proc,
				action : A.action,
				abc : Math.random()
			};
			var paramCount = 0;
			if (A.params) {
				paramCount = A.params.length;
				for (var idx = 0; idx < A.params.length; idx++) {
					o["param" + idx] = A.params[idx];
				}
			}
			o.params = paramCount;
			Ext.Ajax.request({
				url : "/platform/controller.do?method=invokeCaller",
				params : o,
				success : A.success,
				failure : A.failure
			});

			/*var conn = Ext.lib.Ajax.getConnectionObject().conn;
			 conn.open("POST", encodeURI("/platform/controller.do?method=invokeCaller&proc=" + A.proc + "&params=3&param0=" + A.params[0] + "&param1=" + A.params[1] + "&param2=" + A.params[2] + ""), false);
			 conn.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
			 conn.send(null);*/
		},
		// 发送同步请求指定url及参数
		_syncPostRequest : function(url, params, success, failure) {
			var responseText = "";
			var conn = null;
			try {
				conn = Ext.lib.Ajax.getConnectionObject().conn;
				conn.open("POST", url, false);
				conn.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
				conn.send(params);
				responseText = conn.responseText;
				if (success) {
					success(conn, new Object());
				}
			} catch (e) {
				if (failure) {
					failure(conn, e);
				}
			}
			return responseText;
		},
		// 发送同步请求
		sendRequest : function(A) {
			var url = "/platform/controller.do?method=invokeCaller&proc=" + A.proc + "&action=" + A.action + "&abc=" + Math.random();
			if (!Ext.isEmpty(A.url)) {
				url = A.url;
			}

			var paramCount = 0;
			if (A.params) {
				paramCount = A.params.length;
			}
			var params = "params=" + paramCount;
			if (paramCount > 0) {
				for (var idx = 0; idx < paramCount; idx++) {
					params += "&param" + idx + "=" + encodeURI(A.params[idx]);
				}
			}
			var responseText = this._syncPostRequest(url, params, A.success, A.failure);
			return responseText;
		},
		// 发送EUI请求, 需要ExtJS支持
		euiRequest : function(A) {
			var params = {};
			for (var key in A) {
				if (key != "segmentName" && key != "methodName" && key != "success" && key != "failure") {
					params[key] = A[key];
				}
			}
			Ext.Ajax.request({
				url : '/headaudit/eui/EuiAction.do?method=doAction&method$name=' + A.methodName + '&segmentName=' + A.segmentName,
				params : params,
				success : A.success,
				failure : A.failure
			});
		}
	}
}();

/*
 * 对密码进行校验。
 * 要求：密码必须是6-12位，且至少含有数字、大写字母、小写字母、特殊字符
 * 2012-03-07
 * _pswd:待校验的密码
 */
function pwdCheck(_pswd) {
	var reg = /^[-\da-zA-Z`=\\\[\];',./~!@#$%^&*()_+|{}:"<>?]{6,12}$/;
	if (!reg.test(_pswd)) {
		return false;
	}
	if (_pswd.replace(/\d/g, "") == _pswd) {
		return false;
	}
	_pswd = _pswd.replace(/\d/g, "");
	if (_pswd.replace(/[a-z]/g, "") == _pswd) {

		return false;
	}
	_pswd = _pswd.replace(/[a-z]/g, "");
	if (_pswd.replace(/[A-Z]/g, "") == _pswd) {

		return false;
	}
	_pswd = _pswd.replace(/[A-Z]/g, "");
	if (_pswd.replace(/[-\d`=\\\[\];',./~!@#$%^&*()_+|{}:"<>?]/g, "") == _pswd) {

		return false;
	}
	return true;

};

/**
 * 文件上传对话框
 * @param module 上传文件配置参数名(CPER.HADES_UPLOAD_PARAM)
 * @param isModal 窗口形式(true:模态窗口;false:div遮罩)
 * @param callBack 上传窗口关闭句柄
 * @param custom_params 自定义参数
 * @return 文件信息数组[{fileName:上传文件名;filePath:服务器保存路径}]
 * 用法:
 *	Platform.showFileUpload({
 *		module: position_spec,
 *	    isModal: false,
 *		callback: function(val){
 *
 *		},
 *		params: {
 *			positionId: id,
 *			positionNames:[name1,nam2]
 *		}
 *	}); // 文件上传
 */
Platform.showFileUpload = function(A) {
	var o = {
		module : '',
		isModal : (window.location.href != window.parent.location.href), // 窗口形式(frame页面默认弹出模态窗口)
		width : 817, //选择框宽度
		height : 412//选择框高度
	};
	if ( typeof (A) == 'object') {
		if (A.params != undefined) {
			for (var p in A.params) {
				if (Object.prototype.toString.call(A.params[p]) === '[object Array]') {
					A.params[p] = Ext.util.JSON.encode(A.params[p]);
				}
			}
			Ext.apply(o, A.params);
			delete A.params;
		}
		Ext.apply(o, A);
	} else {
		if (arguments.length > 0)
			o.module = arguments[0];
		if (arguments.length > 1)
			o.isModal = arguments[1];
		if (arguments.length > 2)
			o.callback = arguments[2];
		if (arguments.length > 3)
			o.width = arguments[3];
		if (arguments.length > 4)
			o.height = arguments[4];
		if (arguments.length > 5) {
			for (var i = 3; i < arguments.length; i++) {
				o['param' + i] = arguments[i];
			}
		}
	}

	if (o.isModal) {
		var iTop = (window.screen.height - o.height) / 2;
		var iLeft = (window.screen.width - o.width) / 2;
		var url = '/upload/upload_frame.html';
		window.showModalDialog(url, o, "dialogHeight=" + o.height + "px;dialogWidth=" + o.width + "px;dialogTop=" + iTop + "px;dialogLeft=" + iLeft + "px;scroll=no;resizable=no;status=no");
	} else {
		Platform.loadJS('/upload/upload.js', function() {
			showUploadDialog(o);
		});

	}

};

/**
 * 动态引入js
 */
Platform.loadJS = function(url, success) {
	var domScripts = document.getElementsByTagName('script');
	if (domScripts != null) {
		for (var i = 0; i < domScripts.length; i++) {
			if (domScripts[i].src == url)
				return;
		}
	}

	var domScript = document.createElement('script');
	domScript.src = url;
	success = success ||
	function() {
	};
	domScript.onload = domScript.onreadystatechange = function() {
		if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
			success();
			this.onload = this.onreadystatechange = null;
			this.parentNode.removeChild(this);
		}
	}
	document.getElementsByTagName('head')[0].appendChild(domScript);
}
/**
 * 动态引入css
 */
Platform.loadCSS = function(url) {
	var links = document.getElementsByTagName('link');
	if (links != null) {
		for (var i = 0; i < links.length; i++) {
			if (links[i].href == url)
				return;
		}
	}

	var link = document.createElement('link');
	link.setAttribute('rel', 'stylesheet');
	link.setAttribute('type', "text/css");
	link.setAttribute('href', url);

	var heads = document.getElementsByTagName('head');
	if (heads.length)
		heads[0].appendChild(link);
	else
		document.documentElement.appendChild(link);
}

