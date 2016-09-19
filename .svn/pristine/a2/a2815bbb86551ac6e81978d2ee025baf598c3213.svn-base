/**
 * ajax提交form
 * @param {Object} obj 需要提交的form对象
 */
function ajaxSubmitForm(obj) {
	var frm = (obj)? obj : document.forms[0];
	$.ajax({
		url : frm.action,
		type : "POST",
		data : $(frm).serialize(),
		beforeSend : function() {
			showLoadingMask();
		},
		success : function(res) {
			if (res.success && res.success === true) {
				if (res.func === "selectOpinion") {
					//点必选意见
					$("#pathContainer").html(res.rst);
					hideLoadingMask();
				} else if (res.func === "submitOpinion") {
					//请求选人页
					$.ajax({
						method : "GET",
						url : res.rst,
						beforeSend : function() {
							if (!isLoadingMaskShown()) {
								showLoadingMask();
							}
						},
						success : function(result) {
							//$(".wic_ifo_back").html(result);
							$(".wic_ifo_back").show();
							$(".wic_ifo_back .wic_ask_back").html(result);
							$(".wic_ifo_back .wic_ask_back").show();
						},
						error : function(XMLHttpRequest, textStatus, errorThrown) {
							showMessageDialog(textStatus);
						},
						complete : function(XMLHttpRequest, textStatus) {
							hideLoadingMask();
						}
					});

					/*
					 if(res.hiddens && res.hiddens != ""){
					 $("#addhiddens").html(res.hiddens);
					 }
					 if(res.action){
					 $("#hidFrmAction").val(res.action + "&AjaxHandle");
					 }
					 if(res.type && res.type === "confirm"){
					 showConfirmMessageDialog(res.rst);
					 }else{
					 $(".wic").html(res.rst);
					 $("ul[class='one_content']").show();
					 $(".wic").show();
					 }
					 */
				} else if (res.func === "finalsend") {
					$('.wic_ifo_back,.back_yes').html(res.rst);
					$(".wic_ifo_back .wic_ask_back").hide();
					$('.wic_ifo_back,.back_yes').show();
            		//setTimeout("leftSlidOut(\"#doc-panel\");", 3000 );
            		hideLoadingMask();
            		if(window.top.window.location.href.indexOf("message.do") > 1){
            		 	setTimeout("parent.parent.closeDocument();", 3000 );
            		}else{
            			//setTimeout("window.location.replace("<%TAILOR_BASE_URL%><%=portalUrl%>");", 3000 );
            			var prefix = getbaseUrl(window.location.href); // http://xxx:1306
            			prefix += "/tailor/";
            			var portailUrl = getbaseUrl(window.location.pathname);
            			portailUrl += "/app/message.do";
            			portailUrl = prefix + portailUrl;
            			setTimeout("window.location.replace(\"" + portailUrl + "\");", 3000 );
            		}
				}
			} else {
				if(res.rst){
					showMessageDialog(res.rst);
				}else{
					$(".wic_ifo_back").show();
					$(".wic_ifo_back .wic_ask_back").html(res);
					$(".wic_ifo_back .wic_ask_back").show();
					hideLoadingMask();
				}
				hideLoadingMask();
			}
		},
		error : function(xhr, type, error) {
			showMessageDialog(xhr + "; " + type + "; "+ error);
			hideLoadingMask();
		},
		complete : function(XMLHttpRequest, textStatus) {

		}
	});
}

/**
 * 关掉选人区域 
 */
function closeSelPerson(){
	removePathSelStyle();
	if($(".wic").length > 0){
		$(".wic").html("");
		$(".wic").hide();
		if($(".wic_ifo_back").length > 0){
			$(".wic_ifo_back .wic_ask_back").html("");
			$(".wic_ifo_back").hide();
		}
	}
	else{
		leftSlidOut("#doc-panel");
	}
}

/**
 * 去掉路径选择的背景色 
 */
function removePathSelStyle(){
	$(".sele_sign").css("background-color", "inherit");
}
