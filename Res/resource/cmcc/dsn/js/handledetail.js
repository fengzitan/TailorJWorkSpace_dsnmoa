function handleDetail(data){
	console.log("正文数据是：");
	console.log(data);
	var bizcode = data.postdata.bizCode;
	var url = data.url;
	if (data.url == "" && data.datas.html == "" && data.datas.signTitleValue == "") {//url为空且不组装页面，直接正文页面为空
		//renshishouwen人事收文;ForwardGroup转发集团来文;ColleRecBranch分院收文;partyReceive党办收文;meetingReceiveDoc工会收文
		hideLoadingMask();
		$(".content-detail").html("<li class=\"detail-tips\">此公文没有正文</li>");
	}else if(bizcode == "UpSignReportPart_editword" || bizcode == "signReportManagerPart_editword"){//需要组装页面,样式1
		//UpSignReportPart_editword上报签报(分院);
		var content = createDetailcss1(data.datas);
		$(".content-detail").html(content);
		//$("#Section p").css("color","#000000");
		//对正文内容请求ajax,手动填充
		url = "cmdi-workflow-dm/processconsole/uploadWordHtml.action";
		var urls = tailor + root_dm + "Detail-context-" + url;
		var bizid = data.postdata.bizId;
		getDetailContext(urls,bizid,bizcode);
		detailHtml = $(".content-detail").html();
	}else if(bizcode == "signReportManager_editword"  || bizcode == "zhongjingqianbao_editword"){//需要组装页面，样式2   //xg lm
		//signReportManager_editword院本部签报;
		var html = createDetailcss2(data);
		$(".content-detail").html(html);
		url = "cmdi-workflow-dm/processconsole/uploadWordHtml.action";
		var urls = tailor + root_dm + "Detail-context-" + url;
		var bizid = data.postdata.bizId;
		getDetailContext(urls,bizid,bizcode);
	}else if(bizcode == "renshiqianbao_editword"){//样式3
		//renshiqianbao_editword人事签报;
		var content = createDetailcss3(data.datas);
		$(".content-detail").html(content);
		//$("#Section p").css("color","#000000");
		//对正文内容请求ajax,手动填充
		url = "cmdi-workflow-dm/processconsole/uploadWordHtml.action";
		var urls = tailor + root_dm + "Detail-context-" + url;
		var bizid = data.postdata.bizId;
		getDetailContext(urls,bizid,bizcode);
		detailHtml = $(".content-detail").html();
	}else if(bizcode == "noticeform_editword" || bizcode == "noticeformpart_editword"){//样式4
		//noticeform_editword通知;noticeformpart_editword分院通知
		var url = "cmdi-workflow-dm/processconsole/uploadWordHtml.action";
		var urls = tailor + root_dm + "Detail-context-" + url;
		var content = createDetailcss4();
		$(".content-detail").html(content);
		getDetailContext(urls,data.postdata.bizId,bizcode);
		detailHtml = $(".content-detail").html();
	}else{//有iframe,走正常方式(通过请求iframe的src，得到内容的地址，发起请求，直接将得到的东西填充页面)
		var urls = tailor + root_dm + "View-Detail-" + url.replace(root,"");
		$.ajax({
			url:urls,
			type:'get',
			timeout:30000,
			success:function(result){
				hideLoadingMask();
				if(result.success){
					var bizcode = result.data.bizCode;
					var bizid = result.data.bizId;
					var postUrl = result.posturl;
					getDetailText(postUrl,bizcode,bizid,data);
				}else{
					showMessageDialog(result.message);
				}
			},
			error:function(e){
				hideLoadingMask();
				throw(e);
			}
		});
	};
}

function getDetailContext(url,bizid,bizcode){
	$.ajax({
		url:url,
		type:'POST',
		async:false,
		data:{bizCode:bizcode,bizId:bizid},
		success:function(result){
		//对正文内容填充
			console.log(result);
			$("#uploadWordHtml").html(result.data.message);
			$("#uploadWordHtml p").css("color","#000000");
		},
		error:function(e){
			throw(e);
		}
	});
}
//获得正文的内容
function getDetailText(url,bizcode,bizid,datas){
	console.log(datas);
	var urls = tailor + root_dm + "Detail-context-" + url;
	$.ajax({
		url:urls,
		type:'post',
		data:{bizCode:bizcode,bizId:bizid},
		success:function(result){
			console.log(result);
			hideLoadingMask();
			if(result.success){
				if (result.data.message) {
					createDetail(result.data.message);
				}else{
					$(".content-detail").html("<li class=\"detail-tips\">此公文没有正文</li>");
				};
			}else{
				showMessageDialog(result.message);
			}
			
		},
		error:function(e){
			hideLoadingMask();
			throw(e);
		}
	});
}
//组装正文的内容
function createDetail(html){
	$(".content-detail").html(html);
	$(".content-detail").find("table").attr("width","100%");
	$(".content-detail").find("table").css("width","100%");
	$(".Section1").css("padding","0 11px");
	$(".content-detail").find("img").hide();
	var tables = document.getElementsByTagName("table");
	if (tables.length > 0) {
		var table1 = tables[0];
		if(table1 != null){
			for (var i=0; i < table1.rows[0].cells.length; i++) {
				//$("table:eq(0) tr:first td:eq(1)").attr("display","none");//---xg
				//$("table:eq(0) tr:first td:eq(1)").css("display","none");//---xg
				//$("table:eq(0) tr:first td:eq(1)").attr("width","10px");
				//$("table:eq(0) tr:first td:eq(1)").css("width","10pt");
				//对标题显示的修改
				$("table:eq(0) tr:first td:eq(1) p").css('margin-right','0px');
			};//对标题显示的修改
			$("table:eq(0) tr:eq(1) td:eq(0)").css('padding','0.2cm 5.4pt 0cm 5.4pt');
		}else{
			console.log("空");
		}
	}else{
		console.log("两个空");
	};
	//特殊情况，输出了些应该被隐藏的东西
	var adoms = document.getElementsByTagName("a");
	for (var i=0; i < adoms.length; i++) {
	  	if(adoms[i].getAttribute("name")=="securityDemand"){
			adoms[i].parentNode.setAttribute("style","display:none");
		}else if(adoms[i].getAttribute("name")=="instancyLevel"){
			adoms[i].parentNode.setAttribute("style","display:none");
		}else{};
	};
	//修改span标签下的字体
	var spans = document.getElementsByTagName("span");
	var spanslength = spans.length;
	for (var i=0; i < spanslength; i++) {
	  	var sizeValue = spans[i].style.getPropertyValue("font-size");
	  	var start = sizeValue.indexOf("pt");
	  	if (start > 0) {
	  		var newsizeValue = sizeValue.substring(0,start);
	  		if (parseInt(newsizeValue) > 32) {
	  			newsizeValue = 26;
	  		};
	  		spans[i].style.fontSize = newsizeValue + "px";
	  	};
	};
	detailHtml = $(".content-detail").html();
}
//url地址为空时，组装正文的内容；样式1
function createDetailcss1(htmls){
	var html = "";
	html += "<div id=\"Section\"  style=\"width: 100%; margin: 20px auto;\" >";
	html += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" id=\"jianLiNo\"  style=\"border-collapse: collapse; border: none\" >";
	html += "<tr><td style=\"width: 37%; border: none windowtext 1.0pt;\" valign=\"top\" width=\"40%\">";
	html += "<p id=\"title1\" style=\"color:red;\">"+htmls.html+"</p>";
	html += "</td><td style=\"width: 50%; border: none windowtext 1.0pt; border-left: none;\" valign=\"top\" width=\"298\">";
	html += "<p><b><span id=\"secondOrgValue\" style=\"font-size: 20pt; font-family: 华文中宋; color: red; letter-spacing: -1.0pt\" >"+htmls.secondOrgValue+"</span></b></p></td></tr>";
	html += "</table>";
	html += "<hr style=\"width: 100%; color: black;margin-top:40px;\"/>";
	html += "<p align=\"center\" style=\"text-align: center\"><b><span style=\"font-size: 14.0pt; font-family: 宋体; color: black\" id=\"signTitleValue\">"+htmls.signTitleValue+"</span> </b></p>";
	var depts = "";
	if (htmls.signMainSenderValue != "") {
		depts = htmls.signMainSenderValue+":";
	};
	html += "<p style=\"margin-left:0;\"><span style=\"font-size: 12.0pt; font-family: 仿宋_GB2312\" id=\signMainSenderValue\">"+depts+"</span></p>";
	html += "<div id=\"uploadWordHtml\" style=\"color:#000\"></div><hr style=\"width: 100%; color: black;margin-top:20px;\"/>";
	html += "<span style=\"font-size: 12.0pt; font-family: 仿宋_GB2312\" id=\"signDeptValue\">"+htmls.signDeptValue+"</span>";
	html += "<p style=\"text-align:right;\" align=\"right\"><span lang=\"EN-US\" style=\"font-size: 14.0pt; font-family: 仿宋_GB2312\" id=\"signDateValue\">"+htmls.signDateValue+"</span></p>";
	html += "<div>";
	return html;
}
//当请求内容ajax时返回的内容为空时；样式2
function createDetailcss2(data){
	var html = "";
	html += "<div id=\"Section\"  style=\"width: 100%; margin: 20px auto;\" >";
	html += "<p style=\"text-align:center\"><span style=\"font-size: 22.0pt; font-family: 宋体; color: red;\" id=\"signDeptTitle\">"+data.datas.signDeptTitle+"</span></p>";
	html += "<p style=\"text-align:center\"><span style=\"font-size: 16.0pt; font-family: 宋体;\" id=\"fileNoValue\">"+data.datas.fileNoValue+"</span></p>";
	html += "<hr style=\"width: 100%; color: black;margin-top:40px;\"/>";
	html += "<p align=\"center\" style=\"text-align: center\"><b><span style=\"font-size: 14.0pt; font-family: 宋体; color: black\" id=\"signTitleValue\">"+data.datas.signTitleValue+"</span> </b></p>";
	html += "<p style=\"margin-left:0;\"><span style=\"font-size: 12.0pt; font-family: 仿宋_GB2312\" id=\signMainSenderValue\">"+data.datas.signMainSenderValue+":"+"</span></p>";
	html += "<div id=\"uploadWordHtml\" style=\"color:#000\"></div><hr style=\"width: 100%; color: black;margin-top:20px;\"/>";
	html += "<span style=\"font-size: 12.0pt; font-family: 仿宋_GB2312\" id=\"signDeptValue\">"+data.datas.signDeptValue+"</span>";
	html += "<p style=\"text-align:right;\" align=\"right\"><span lang=\"EN-US\" style=\"font-size: 14.0pt; font-family: 仿宋_GB2312\" id=\"signDateValue\">"+data.datas.signDateValue+"</span></p>";
	html += "<div>";
	detailHtml = html;
	return html;
}
//样式3
function createDetailcss3(htmls){
	var html = "";
	html += "<div id=\"Section\"  style=\"width: 100%; margin: 20px auto;\" >";
	html += "<p class=\"MsoNormal\" align=\"center\" style=\"text-align: center\">";
	html += "<b><span style=\"font-size: 20.0pt; font-family: 宋体; color: red;\">";
	html += htmls.signDeptTitle + "</b></span></p>";
	html += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" id=\"jianLiNo\"  style=\"border-collapse: collapse; border: none;margin-top:25px;\" >";
	html += "<tr><td style=\"width: 20%; border: none windowtext 1.0pt;\"></td><td style=\"width: 40%; border: none windowtext 1.0pt;\">";
	html += "<p id=\"fileNoValue\">"+htmls.fileNoValue+"</p>";
	html += "</td><td style=\"width: 40%; border: none windowtext 1.0pt; border-left: none;\" valign=\"top\" width=\"298\">";
	html += "<p><b><span id=\"signPersonValue\" style=\"font-size: 14pt; font-family: 华文中宋;\" >"+"签发人:"+htmls.signPersonValue+"</span></b></p></td></tr>";
	html += "</table>";
	html += "<hr style=\"width: 100%; color: black;margin-top:10px;\"/>";
	html += "<p align=\"center\" style=\"text-align: center\"><b><span style=\"font-size: 14.0pt; font-family: 宋体; color: black\" id=\"signTitleValue\">"+htmls.signTitleValue+"</span> </b></p>";
	var depts = "";
	if (htmls.signMainSenderValue != "") {
		depts = htmls.signMainSenderValue+":";
	};
	html += "<p style=\"margin-left:0;\"><span style=\"font-size: 12.0pt; font-family: 仿宋_GB2312\" id=\signMainSenderValue\">"+depts+"</span></p>";
	html += "<div id=\"uploadWordHtml\" style=\"color:#000\"></div>";
	html += "<p style=\"margin-left:0;margin-top:20px\"><span style=\"font-size: 12.0pt; font-family: 仿宋_GB2312\" id=\"copySenderValue\">抄送:"+htmls.copySenderValue+"</span></p>";
	html += "<p style=\"margin-left:0;\"><span style=\"font-size: 12.0pt; font-family: 仿宋_GB2312\" id=\"copyReportValue\">抄送:"+htmls.copyReportValue+"</span></p>";
	html += "<hr style=\"width: 100%; color: black;margin-top:20px;\"/>";
	html += "<span style=\"font-size: 12.0pt; font-family: 仿宋_GB2312\" id=\"signDeptValue\">"+htmls.signDeptValue+"</span>";
	html += "<p style=\"text-align:right;\" align=\"right\"><span lang=\"EN-US\" style=\"font-size: 14.0pt; font-family: 仿宋_GB2312\" id=\"signDateValue\">"+htmls.signDateValue+"</span></p>";
	html += "<div>";
	return html;
}
function createDetailcss4(){
	var html = "";
	html += "<p style=\"margin-left:0;\"><span>通知内容:</span></p>";
	html += "<div id=\"uploadWordHtml\"></div>";
	return html;
}