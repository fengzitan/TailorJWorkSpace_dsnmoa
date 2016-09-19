$(function() {
	if (undefined != page.save && page.save == "true") {
		if (undefined != page.usr)
			$("#username").val(page.usr);
		if (undefined != page.pwd)
			$("#password").val(page.pwd);
		if (undefined != page.org)
			$("#province option").each(function(){
				if(page.org!=$(this).val()){$(this).removeAttr("selected");}else{$(this).attr("selected","selected");}
			});
		$("#saveAccount").find(".fa").first().removeClass("fa-square-o").addClass("fa-check-square-o");
	}

	$("#username").on("focus", function() {
		if ($(this).val().length > 0)
			$("#usrClearBtn").show();
	});
	$("#username").on("input", function() {
		if ($(this).val().length > 0)
			$("#usrClearBtn").show();
		else
			$("#usrClearBtn").hide();
	});

	$("#password").on("focus", function() {
		if ($(this).val().length > 0)
			$("#pwdClearBtn").show();
	});
	$("#password").on("input", function() {
		if ($(this).val().length > 0)
			$("#pwdClearBtn").show();
		else
			$("#pwdClearBtn").hide();
	});

	$("#usrClearBtn").on("click", function(e) {
		var usr = $("#username");
		usr.val("");
		$(this).hide();
		usr.focus();
	});
	$("#pwdClearBtn").on("click", function(e) {
		var pwd = $("#password");
		pwd.val("");
		$(this).hide();
		pwd.focus();
	});

	$("#saveAccount").on("click", function() {
		var tag = $(this).find(".fa").first();
		var checked = tag.hasClass("fa-check-square-o");
		if (checked)
			tag.removeClass("fa-check-square-o").addClass("fa-square-o");
		else
			tag.removeClass("fa-square-o").addClass("fa-check-square-o");
	});

	$(".login-btn").on("click", function() {
		if (!check())
			return;
		$.ajax({
			url: TAILOR_BASE_URL + BASE_URL + "/login.do",
			type: "POST",
			data: {
				username: $("#username").val().trim(),
				password: rsaEncrypt($("#password").val()),
				province: $("#province").val(),
				saveAccount: $("#saveAccount").find(".fa").first().hasClass("fa-check-square-o"),
				valicode: ($("#valicode").length > 0)? $("#valicode").val() : ""
			},
			async: true,
			dataType: "json",
			timeout: 15000,
			beforeSend: function(xhr, settings) {
				$(window).scrollTop(0);
				showLoadingMask({
					paras: {
						xhr: xhr,
						settings: settings
					},
					callback: function(args) {
						mAjaxStop(args);
					}
				});
			},
			success: function(o) {
				if (!o) {
					hideLoadingMask();
					showMessageDialog(SERVER_RUNTIME_ERROR_MESSAGE);
				} else {
					var data = o.data;
					if (o.success) {
						hideLoadingMask();
						location.replace(TAILOR_BASE_URL + BASE_URL + "/app/message.do");
					} else if (o.expires) {
						pushInPwdChangeView(data.redirect);
					} else {
						hideLoadingMask();
						$("#password").val("");
						showMessageDialog(data.message);
						chekShowVcode(o);
					}
				}
			},
			error: function(xhr, type, error) {
				hideLoadingMask();
				if ("timeout" == type) {
					showMessageDialog(CONNECTION_TIMEOUT_MESSAGE);
				} else if ("abort" == type) {
					showMessageDialog(CONNECTION_INTERRUPT_MESSAGE);
				}
			}
		});
	});

	/*
	$(document).keydown(function(event){
		if(event.keyCode === 13){
		 	$(".login-btn").click();
		}
	});
	 */
});

function check() {
	var usr = $("#username");
	var pwd = $("#password");
	var valicode = $("#valicode");
	if (valicode.length > 0 && (valicode.val().length == 0 || valicode.val().trim() == "")) {
		showMessageDialog("请填写验证码");
		return false;
	}
	if (usr.val().length == 0 || usr.val().trim() == "") {
		showMessageDialog("用户名不能为空");
		usr.val("");
		return false;
	} else if (pwd.val().length == 0 || pwd.val().trim() == "") {
		showMessageDialog("密码不能为空");
		pwd.val("");
		return false;
	}
	return true;
}

function rsaEncrypt(txt) {
	var oRSA = page.rsa;
	if (oRSA) {
		setMaxDigits(oRSA.max);
		var oKeyPair = new RSAKeyPair(oRSA.pk, "", oRSA.mod);
		return encryptedString(oKeyPair, txt, RSAAPP.NoPadding);
	} else {
		return txt;
	}
}

function pushInPwdChangeView(url) {
	var view = $("<iframe/>");
	view.attr("id", "PwdChangeView");
	view.css({
		position: "absolute",
		top: 0,
		left: $(window).width() + "px",
		width: $(window).width() + "px",
		height: $(window).height() + "px",
		border: 0
	}).hide();
	view.attr("src", TAILOR_BASE_URL + url);
	view.on("load", function() {
		hideLoadingMask();
		$(this).show();
		$(this).addClass("slide-in");
	});
	$("body").append(view);
}

function pushOutPwdChangeView() {
	var view = $("#PwdChangeView");
	view.addClass("slide-out");
	setTimeout(function() {
		view.remove();
	}, 300);
}