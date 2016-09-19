/**
 *邮件与服务器通信相关函数，需放在jquery后
 */

/**
 *首页事件绑定：初始化数据，点击变更数据
 *  * @param {Object} mail_service_url 服务地址
 * @param {Object} mail_content_url 内容连接
 * @param {Object} resource_url 资源连接
 */
function bindingIndexPage() {
	$(document).on("click", '#unread', function() {
		$('#wrapper > #scroller > ul').data('page', 1);
		refreshMailList("unread", "refresh");
		$('INPUT[name=fid]').val(0);
		$('INPUT[name=keywords]').val("");
		if (iScorll) {
			iScorll.scrollTo(0, 0, 0);
		}
	});
	$(document).on("click", '#inbox', function() {
		$('#wrapper > #scroller > ul').data('page', 1);
		refreshMailList("inbox", "refresh");
		$('INPUT[name=fid]').val(1);
		$('INPUT[name=keywords]').val("");
		if (iScorll) {
			iScorll.scrollTo(0, 0, 0);
		}
	});
	$(document).on("click", '#draft', function() {
		$('#wrapper > #scroller > ul').data('page', 1);
		refreshMailList("draft", "refresh");
		$('INPUT[name=fid]').val(2);
		$('INPUT[name=keywords]').val("");
		if (iScorll) {
			iScorll.scrollTo(0, 0, 0);
		}
	});
	$(document).on("click", '#sendout', function() {
		$('#wrapper > #scroller > ul').data('page', 1);
		refreshMailList("sendout", "refresh");
		$('INPUT[name=fid]').val(3);
		$('INPUT[name=keywords]').val("");
		if (iScorll) {
			iScorll.scrollTo(0, 0, 0);
		}
	});
	$(document).on("click", '#delete', function() {
		$('#wrapper > #scroller > ul').data('page', 1);
		refreshMailList("delete", "refresh");
		$('INPUT[name=fid]').val(4);
		$('INPUT[name=keywords]').val("");
		if (iScorll) {
			iScorll.scrollTo(0, 0, 0);
		}
	});
	$(document).on("click", '#suspicious', function() {
		$('#wrapper > #scroller > ul').data('page', 1);
		refreshMailList("suspicious", "refresh");
		$('INPUT[name=fid]').val(5);
		$('INPUT[name=keywords]').val("");
		if (iScorll) {
			iScorll.scrollTo(0, 0, 0);
		}
	});
	$(document).on("click", '.right', function() {
		$('.wic').hide();
		$('.seek_page').hide();
		$('#wrapper > #scroller > ul').data('page', 1);
		refreshMailList("search", "refresh");
		if (iScorll) {
			iScorll.scrollTo(0, 0, 0);
		}
	});
}

/*******************************************格式化工具**********************************************/
/**
 *格式化邮件联系人
 */
function formatMailFrom(from) {
	return from.replace("/\"/g", "").split("<",1)[0];
}

/**
 *格式化邮件发件日期
 * @param {Object} date 需要格式化的日期字符串
 */
function formatMailDate(date) {
	// 对Date的扩展，将 Date 转化为指定格式的String
	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
	// 例子：
	// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
	// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
	Date.prototype.Format = function(fmt) {//author: meizz
		var o = {
			"M+" : this.getMonth() + 1, //月份
			"d+" : this.getDate(), //日
			"h+" : this.getHours(), //小时
			"m+" : this.getMinutes(), //分
			"s+" : this.getSeconds(), //秒
			"q+" : Math.floor((this.getMonth() + 3) / 3), //季度
			"S" : this.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	};
	return new Date((Number)(date + "000")).Format("yyyy-MM-dd hh:mm:ss");
}

/****************************************变量********************************************/
var mail_service_url;
var mail_content_url;
var resource_url;
var mail_send_url;
var LOCAL_RESOURCE_USE_PROXY;

/**
 *初始化服务URL地址
 * @param {Object} mail_service 邮件服务基础地址
 * @param {Object} mail_content 邮件内容详情地址
 * @param {Object} resource 素材资源地址
 * @param {Object} mail_send 邮件发送服务地址
 */
function initServiceURL(mail_service, mail_content, resource, mail_send, LOCAL_RESOURCE_USE_PROXY_FLG) {
	mail_service_url = mail_service;
	mail_content_url = mail_content;
	resource_url = resource;
	mail_send_url = mail_send;
	LOCAL_RESOURCE_USE_PROXY = "true";
}

/****************************************翻页刷新相关********************************************/
/**
 *得到刷新邮件的类型
 */
function getRefreshMailType() {
	var fid = $('INPUT[name=fid]').val();
	var type = "unread";
	switch(fid) {
	case "0":
		type = "unread";
		break;
	case "1":
		type = "inbox";
		break;
	case "2":
		type = "draft";
		break;
	case "3":
		type = "sendout";
		break;
	case "4":
		type = "delete";
		break;
	case "5":
		type = "suspicious";
		break;
	}
	return type;
}

var iScorll;

/**
 *初始化滑动
 * @param {Object} mail_type 初始化邮件类型
 */
function initIScroll(mail_type, LOCAL_RESOURCE_USE_PROXY_FLG) {
	LOCAL_RESOURCE_USE_PROXY_FLG = LOCAL_RESOURCE_USE_PROXY_FLG? LOCAL_RESOURCE_USE_PROXY_FLG : "true";
	LOCAL_RESOURCE_USE_PROXY = LOCAL_RESOURCE_USE_PROXY_FLG;
	if (!iScorll) {
		ajaxMailList(mail_type, 1, function() {
			iScorll = new IScrollPullUpDown('wrapper', {
				probeType : 2,
				bounceTime : 250,
				bounceEasing : 'quadratic',
				mouseWheel : false,
				scrollbars : false,
				fadeScrollbars : false,
				click : true,
				momentum : false,
				interactiveScrollbars : false
			}, pullDownAction, pullUpAction);
			iScorll.refresh();
		});
	}
}

/**
 *上拉下拉刷新组件
 */
var IScrollPullUpDown = function(wrapperName, iScrollConfig, pullDownActionHandler, pullUpActionHandler) {
	var iScrollConfig,
	    pullDownActionHandler,
	    pullUpActionHandler,
	    pullDownEl,
	    pullDownOffset,
	    pullUpEl,
	    scrollStartPos;
	var pullThreshold = 5;
	var me = this;

	function showPullDownElNow(className) {
		// Shows pullDownEl with a given className
		pullDownEl.style.transitionDuration = '';
		pullDownEl.style.marginTop = '';
		pullDownEl.className = 'pullDown ' + className;
	}

	var hidePullDownEl = function(time, refresh) {
		// Hides pullDownEl
		pullDownEl.style.transitionDuration = (time > 0 ? time + 'ms' : '');
		pullDownEl.style.marginTop = '';
		pullDownEl.className = 'pullDown scrolledUp';

		// If refresh==true, refresh again after time+10 ms to update iScroll's "scroller.offsetHeight" after the pull-down-bar is really hidden...
		// Don't refresh when the user is still dragging, as this will cause the content to jump (i.e. don't refresh while dragging)
		if (refresh)
			setTimeout(function() {
				me.myScroll.refresh();
			}, time + 10);
	};

	function init() {
		var wrapperObj = document.querySelector('#' + wrapperName);
		var scrollerObj = wrapperObj.children[0];

		if (pullDownActionHandler) {
			// If a pullDownActionHandler-function is supplied, add a pull-down bar at the top and enable pull-down-to-refresh.
			// (if pullDownActionHandler==null this iScroll will have no pull-down-functionality)
			pullDownEl = document.createElement('div');
			pullDownEl.className = 'pullDown scrolledUp';
			pullDownEl.innerHTML = '<span class="pullDownIcon"></span><span class="pullDownLabel">下拉刷新...</span>';
			scrollerObj.insertBefore(pullDownEl, scrollerObj.firstChild);
			pullDownOffset = pullDownEl.offsetHeight;
		}
		if (pullUpActionHandler) {
			// If a pullUpActionHandler-function is supplied, add a pull-up bar in the bottom and enable pull-up-to-load.
			// (if pullUpActionHandler==null this iScroll will have no pull-up-functionality)
			pullUpEl = document.createElement('div');
			pullUpEl.className = 'pullUp';
			pullUpEl.innerHTML = '<span class="pullUpIcon"></span><span class="pullUpLabel">上拉加载更多...</span>';
			scrollerObj.appendChild(pullUpEl);
		}

		me.myScroll = new IScroll(wrapperObj, iScrollConfig);

		me.myScroll.on('refresh', function() {
			if ((pullDownEl) && (pullDownEl.className.match('loading'))) {
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
				if (this.y >= 0) {
					// The pull-down-bar is fully visible:
					// Hide it with a simple 250ms animation
					hidePullDownEl(250, true);

				} else if (this.y > -pullDownOffset) {
					// The pull-down-bar is PARTLY visible:
					// Set up a shorter animation to hide it

					// Firt calculate a new margin-top for pullDownEl that matches the current scroll position
					pullDownEl.style.marginTop = this.y + 'px';

					// Calculate the animation time (shorter, dependant on the new distance to animate) from here to completely 'scrolledUp' (hidden)
					// Needs to be done before adjusting the scroll-positon (if we want to read this.y)
					var animTime = (250 * (pullDownOffset + this.y) / pullDownOffset);

					// Set scroll positon to top
					// (this is the same as adjusting the scroll postition to match the exact movement pullDownEl made due to the change of margin-top above, so the content will not "jump")
					this.scrollTo(0, 0, 0);

					// Hide pullDownEl with the new (shorter) animation (and reset the inline style again).
					setTimeout(function() {// Do this in a new thread to avoid glitches in iOS webkit (will make sure the immediate margin-top change above is rendered)...
						hidePullDownEl(animTime, true);
					}, 0);

				} else {
					// The pull-down-bar is completely off screen:
					// Hide it immediately
					hidePullDownEl(0, true);
					// And adjust the scroll postition to match the exact movement pullDownEl made due to change of margin-top above, so the content will not "jump"
					this.scrollBy(0, pullDownOffset, 0);
				}
			}
			if ((pullUpEl) && (pullUpEl.className.match('loading'))) {
				pullUpEl.className = 'pullUp';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
			}
		});

		me.myScroll.on('scrollStart', function() {
			scrollStartPos = this.y;
			// Store the scroll starting point to be able to track movement in 'scroll' below
		});

		me.myScroll.on('scroll', function() {
			if (pullDownEl || pullUpEl) {
				if ((scrollStartPos == 0) && (this.y == 0)) {
					// 'scroll' called, but scroller is not moving!
					// Probably because the content inside wrapper is small and fits the screen, so drag/scroll is disabled by iScroll

					// Fix this by a hack: Setting "myScroll.hasVerticalScroll=true" tricks iScroll to believe
					// that there is a vertical scrollbar, and iScroll will enable dragging/scrolling again...
					this.hasVerticalScroll = true;

					// Set scrollStartPos to -1000 to be able to detect this state later...
					scrollStartPos = -1000;
				} else if ((scrollStartPos == -1000) && (((!pullUpEl) && (!pullDownEl.className.match('flip')) && (this.y < 0)) || ((!pullDownEl) && (!pullUpEl.className.match('flip')) && (this.y > 0)))) {
					// Scroller was not moving at first (and the trick above was applied), but now it's moving in the wrong direction.
					// I.e. the user is either scrolling up while having no "pull-up-bar",
					// or scrolling down while having no "pull-down-bar" => Disable the trick again and reset values...
					this.hasVerticalScroll = false;
					scrollStartPos = 0;
					this.scrollBy(0, -this.y, 0);
					// Adjust scrolling position to undo this "invalid" movement
				} else {
					//解决上划bug,预留拉到顶部200个像素
					var fixHeight = 200 - this.scroller.offsetHeight;
					if (this.y < 0 && this.y <= fixHeight) {
						if (fixHeight > 0) {
							this.scrollBy(0, -this.y, 0);
						} else {
							this.scrollBy(0, fixHeight - this.y, 0);
						}

					}
				}
			}

			if (pullDownEl) {
				if (this.y > pullDownOffset + pullThreshold && !pullDownEl.className.match('flip')) {
					showPullDownElNow('flip');
					this.scrollBy(0, -pullDownOffset, 0);
					// Adjust scrolling position to match the change in pullDownEl's margin-top
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '松开刷新...';
				} else if (this.y < 0 && pullDownEl.className.match('flip')) {// User changes his mind...
					hidePullDownEl(0, false);
					this.scrollBy(0, pullDownOffset, 0);
					// Adjust scrolling position to match the change in pullDownEl's margin-top
					pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
				}
			}
			if (pullUpEl) {
				var scroll_hight = this.y - this.maxScrollY;
				if (scroll_hight < 600 && !pullUpEl.className.match('flip')) {
					pullUpEl.className = 'pullUp flip';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开加载更多...';
				} else if (scroll_hight > 600 && pullUpEl.className.match('flip')) {
					pullUpEl.className = 'pullUp';
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
				}
			}
		});

		me.myScroll.on('scrollEnd', function() {
			if ((pullDownEl) && (pullDownEl.className.match('flip'))) {
				showPullDownElNow('loading');
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
				pullDownActionHandler(this);
				// Execute custom function (ajax call?)
			}
			if ((pullUpEl) && (pullUpEl.className.match('flip'))) {
				pullUpEl.className = 'pullUp loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
				pullUpActionHandler(this);
				// Execute custom function (ajax call?)
			}
			if ( scrollStartPos = -1000) {
				// If scrollStartPos=-1000: Recalculate the true value of "hasVerticalScroll" as it may have been
				// altered in 'scroll' to enable pull-to-refresh/load when the content fits the screen...
				this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;
			}
		});

	}

	init();
	return me.myScroll;
};

function pullDownAction(theScroller) {
	refreshMailList(getRefreshMailType(), 'refresh');
	$('#wrapper > #scroller > ul').data('page', 1);
	theScroller.refresh();
}

function pullUpAction(theScroller) {
	if ($('#wrapper > #scroller > ul').data('page')) {
		var next_page = parseInt($('#wrapper > #scroller > ul').data('page')) + 1;
	} else {
		var next_page = 2;
	}
	refreshMailList(getRefreshMailType(), 'refresh', next_page);
	$('#wrapper > #scroller > ul').data('page', next_page);
	theScroller.refresh();
}

/**
 *加载邮件列表
 * @param {Object} mail_type 加载邮件类型,unread,
 * @param {Object} refresh 是否刷新操作
 * @param {Object} next_page 邮件翻页的页码
 */
function refreshMailList(mail_type, refresh, next_page) {
	if (!refresh) {
		// 加载初始化内容
		ajaxMailList(mail_type);
	} else if (refresh && !next_page) {
		// 刷新内容
		$('#wrapper > #scroller > ul').html('');
		ajaxMailList(mail_type);
	} else if (refresh && next_page) {
		// 加载下一页内容
		ajaxMailList(mail_type, next_page);
	}
}

/**
 *Ajax加载邮件列表
 * @param {Object} mail_type 邮件类型
 * @param {Object} next_page 页码
 * @param {Object} callback 回调方法
 */
function ajaxMailList(mail_type, next_page, callback) {
	$.ajax({
		type : "get",
		url : mail_service_url,
		data : {
			type : mail_type,
			page : next_page ? next_page : 1,
			key : $('INPUT[name=keywords]').val(),
			fid : $('INPUT[name=fid]').val()
		},
		dataType : "json",
		success : function(data) {
			renderMailList(data.data, mail_type);
			if ("unread" === mail_type) {
				//未读邮件数
				var unreadConunt = data.stats.messageCount;
				if (unreadConunt > 0) {
					$("#unread>.num").text(unreadConunt);
				} else {
					$("#unread>.num").text();
				}
			}
			//如果需要回调，则回调
			if (callback) {
				callback();
			}
			// 如果只有一页，则隐藏下拉div
			($('#wrapper ul > li').length < 10) ? $('#wrapper .pullUp').hide() : $('#wrapper .pullUp').show();
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	});
}

/**
 *把邮件列表JSON 列表数据渲染为HTML片段
 *  @param {Object} mails 邮件列表JSON对象
 *  @param {Object} mail_type 邮件类型
 */

function renderMailList(mails, mail_type) {
	//是否为草稿邮件，草稿邮件需要特殊处理，点击打开编辑，并且草稿箱邮件列表显示收件人
	var isDraft = false;
	if ("draft" === mail_type) {
		isDraft = true;
	}
	if ("search" === mail_type && "draft" === getRefreshMailType()) {
		isDraft = true;
	}
	var isSendOut = false;
	if ("sendout" === mail_type) {
		isSendOut = true;
	}
	var renderHTML = "";
	var mail_people = "";
	var link = "";
	var mails_length = mails.length;
	for (var i = 0; i < mails_length; i++) {
		link = isDraft ? (mail_send_url + "?mid=" + mails[i].mid + "&type=restore") : (mail_content_url + "?mid=" + mails[i].mid);
		renderHTML += "<li href=\"" + link + "\"><div class=\"ma\"> <div class=\"com\"><p class=\"tit\">" + (mails[i].subject ? mails[i].subject.replace("&<{", "<font color=\"red\">").replace("}>&", "</font>") : "无主题");
		mail_people = isDraft || isSendOut ? mails[i].to : mails[i].from;
		mail_people = "" === mail_people ? "空" : mail_people;
		var collect = (mails[i].flags.starFlag && 1 == mails[i].flags.starFlag) ? "<span class=\"s_b\"><img rewrited=\"" + LOCAL_RESOURCE_USE_PROXY + "\" src=\"" + resource_url + "img/mail_collect_yes_03.png\"></span>" : "";
		renderHTML += "</p>" + collect + "<p class=\"name\"><img rewrited=\"" + LOCAL_RESOURCE_USE_PROXY + "\" src=\"" + resource_url + "/img/2_03.png\"> <span>" + formatMailFrom(mail_people);
		renderHTML += "</span> </p><p class=\"time\"><img rewrited=\"" + LOCAL_RESOURCE_USE_PROXY + "\" src=\"" + resource_url + "/img/2_05.png\"> <span>" + formatMailDate(mails[i].sendDate);
		renderHTML += "</span> </p></div> <div class=\"com_less_go\"> <img rewrited=\"" + LOCAL_RESOURCE_USE_PROXY + "\" src=\"" + resource_url + "/img/mail_r_03.png\"></div></div></li>";
		$('#wrapper > #scroller > ul').append(renderHTML);
		renderHTML = "";
	}
	if ($('#wrapper > #scroller > ul > li').size() < 1) {
		$('#wrapper > #scroller > ul').append("<li style=\"text-align: center;margin-top: 15px;\"><div class=\"ma\"><div class=\"com\"><p class=\"tit\">邮件为空</p></li>");
		if ("unread" === mail_type) {
			$("#unread>.num").text("");
		}
	}
	if (iScorll) {
		iScorll.refresh();
	};
}

document.addEventListener('touchmove', function(e) {
	e.preventDefault();
}, false);
