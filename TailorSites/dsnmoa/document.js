include('conf.js');
include('util.js');
t.init({
    switch: true,
    business: '打开公文-详情-处理单',
    filename: 'document.js'
});
t.hi();
var response = {
    success: true,
    message: '响应正常',
    data: {
        processtitle: '',
        contextRoot: '',
        comment: [],
        commenttable:{
            isHave:false,
            url:'',
            data:[]
        },//cy
        opinion: {
            url: '',
            postdata: {}
        },
        detail: {
            url: '',
            postdata: {},
            datas: {}
        },
        attachment: {
            url: '',
            postdata: ''
        },
        documentsubmit: {
            postdata: '',
            url: ''
        },
        processurl: '',
        number: {
            ishave: false,
            formaction: '',
            fileCode:'',
            setNumberFirst: '',
            data: {}
        }
    }
};
try {
    var request = fetcher.request;
    request.url = request.url.replace('TailorApi=', '');
    println(request.url);
    var dom = fetcher.fetchDocument(request).document;
    var text = dom.innerText; //text = fetcher.fetchText(request).text;
    //stream = fetcher.fetchStream(request).stream;
    var bizcode = dom.evaluate(".//INPUT[@id='bizCode']", dom, "", 1);
    if (bizcode) {
        bizcode = bizcode.getAttribute("value");
    };
    var maincontentdom = dom.evaluate(".//DIV[@id='mainContent']", dom.body, "", 1);
    var commentdom = dom.evaluate(".//TABLE[@class='tr3_bg_table']", maincontentdom, "", 0);
    /*
    var commentdom2 = dom.evaluate(".//TABLE[@id='purchaseSupervision']",maincontentdom,"",1); //xg lm 针对行政类有两个tr3_bg_table样式的情况
    if (bizcode.indexOf("purchase") == -1 && bizcode.indexOf("Purchase") == -1) {   //xg lm
        var arr=[];
       //xg lm
       println("commentdom.length="+commentdom.length);
       if(commentdom.length >1){  //行政类特殊
            println("jin ru createCommentJson3");
            var slice = createCommentJson3(commentdom[1]);              
            arr = arr.concat(slice); //数组合并 ---yy
       }else{
            println("jin ru createCommentJson");
            arr = createCommentJson(commentdom[0]);
       }
      //xg --------------------end
        println("%======"+JSON.stringify(arr));
        response.data.comment = arr;
    }else {
            println("jin ru createCommentJson2");
            response.data.comment = createCommengJson2(commentdom[0]);
            println("%*****"+JSON.stringify(response.data.comment));
    };*/
    var arr=[];
    for(var o = 0,p=commentdom.length;o<p;o++){
        println(commentdom[o].innerHTML);
        var slice = createCommentJson(commentdom[o]);
        arr = arr.concat(slice); //数组合并 ---yy
    }
    response.data.comment = arr;

    //  xg  --cy
    response.data.processtitle = dom.evaluate(".//TR[@class='tr1_bg']", maincontentdom, "", 1).innerText.trim();
    response.data.commenttable.isHave = IsHaveTable(dom);
    response.data.commenttable.url = buildTableUrl(dom);
    response.data.commenttable.data = buildTableDatas(dom);
    //根地址cy
    var urls = buildContextRoot(text);
    response.data.contextRoot = urls.contextRoot;

    //response.data.submiturl = 'cmdi-workflow-dm/sendFileConf/' + buildSubmitUrl();
    //xg   cy
    response.data.submiturl = buildSubmitUrl();
    response.data.documentsubmit = buildSelectJson();
    response.data.issetbizpa = isSetBizParameters(); //是否需要重建地址中bizParameters的值

    //正文 cy
    response.data.detail.url = buildDetailUrl();
    response.data.detail.postdata = buildDetailPostData();
    response.data.detail.datas = buildDetailDatas(response.data.detail.url);
    //意见栏  cy

    response.data.opinion.url = buildOpinionUrl();
    response.data.opinion.postdata = getOpnionPostData();
    //attach 
    response.data.attachment.url = buildAttachUrl();
    //流程跟踪 cy,给response添加了一个字段processurl
    response.data.processurl = buildProcessUrl();
    //生成编号
    response.data.number.ishave = isGetNumber(dom);
    response.data.number.data = buildNumberData();
    response.data.number.formaction = buildFormSubmitUrl();
    response.data.number.setNumberFirst = buildFormData();
    response.data.number.fileCode = buildNumberForFileCode();
    //var savefunction = text.match(/function saveEntity.*?\;/mg);

} catch (e) {
    response.success = false;
    response.message = '响应异常';
    t.throwerror(e);
} finally {
    t.bye();
    t.record();
    tailor.contentType = 'json';
    tailor.setTextResult(JSON.stringify(response));
}
// 构建处理单json数据
function createCommentJson(el) {
    var hidden = getHiddenValues();
    println("jin*******************************************");
    //处理单缺失需要更改获取TD的方式，有部分流程的TD无class-HYY
    var TR = dom.evaluate("./TBODY/TR", el, "", 0),//---yy
    comment = [],
    TD,
    TH,
    IMG,
    TABLE,
    infoNum;
    //xg ----lm   针对公文单有需求分析时，需求分析是显示还是隐藏
    var processStatus = dom.evaluate(".//INPUT[@id='processStatus']",dom,"",1);
    var TR1 = dom.evaluate(".//TR[@class='requireAnalysis']", el, "", 0);
    var l = TR.length,ll = TR1.length;
   if(TR1){
    if(processStatus){
        if(processStatus.value == "1"){
            l = TR.length - ll;
        }
    }
   }
   //xg ---end
    for (var k = 0; k < TR.length; k++) {
        TABLE = dom.evaluate(".//TABLE[@class='tr3_bg_table']",TR[k],"",1);
        if(TABLE){
            TH = dom.evaluate(".//TH",TABLE,"",0);
            TD = dom.evaluate(".//TD",TABLE,"",0);
            for(var t =0 ,tl=TH.length; t<tl ;t++ ){
                var obj = {};
                var input = dom.evaluate(".//INPUT",TD[t],"",1);
                var select = dom.evaluate(".//SELECT/OPTION[@selected='selected']",TD[t],"",1) || dom.evaluate(".//SELECT/OPTION[@selected]",TD[t],"",1);
                obj.title = TH[t].innerText.trim().replace(/\*/g,"");
                if(input){
                    obj.text = input.value;
                }else if(select){
                    obj.text = select.innerText;
                }else{
                    obj.text = TD[t].innerText.trim();
                }
                comment.push(obj);
                //println("内嵌TABLE:"+obj.title + ":"+ obj.text);
            }
            return comment; //取这张表,直接返回---yy
        }
        TD = dom.evaluate(".//TD", TR[k], "", 0);
        TH = dom.evaluate("./TH",TR[k],"",0);
       // println(TH.length);
        infoNum = TD.length;
        if(TR[k].getAttribute("style") == "display:none"){//不显示的跳过
            continue;//---yy
        }
/*        if(TD[0]){//这里显示温馨提示 ---yy
         if(TD[0].getAttribute('colspan') || TD[0].getAttribute('rowspan')){
            if(dom.evaluate("./UL/A",TD[0],"",1)){
                continue;
            }
            var obj = {};
            obj.title = TD[0].innerHTML.replace(/style=\"(.*?)"/g,"").replace(/&nbsp;/g,"")
                                                                    .replace("1","<br>1")
                                                                    .replace(/href=\"(.*?)"/g,"")
                                                                    .replace(/onclick=\"(.*?)"/g,"")
            comment.push(obj);
                continue;//---yy
            }
        }*/
        if(TD[0]){
            if(dom.evaluate("./UL/A",TD[0],"",1)){
                continue;
            }
            if(TD[0].getAttribute("colspan") && dom.evaluate("./SPAN[@style]",TD[0],"",1)){
                continue;
            }
        }
        if(TD[1] && dom.evaluate("./TABLE",TD[1],"",1)){
            println("TD表格处理******************************");
            if(TD[1].getAttribute('colspan') || TD[1].getAttribute('rowspan')){
                var obj = {};
                var table = dom.evaluate("./TABLE",TD[1],"",1);
                var l = dom.evaluate("./TBODY/TR",table,"",0).length;//动态设置表头高度
                var h = l*22+l*10+"px";
                obj.title = "<div class='thead' style='height:"+h+";line-height:"+h+"'>"+TD[0].innerHTML.replace("：","")+"</div>";//外面套一层DIV
                obj.text = TD[1].innerHTML.replace(/style=\"(.*?)"/g,"")
                                            .replace(/：/g,'')
                                            .replace(/&nbsp;/g,"")
                                            .replace(/type/g,"disabled='disabled' type");//禁用input
                comment.push(obj);
                continue;//TD内部嵌套表格处理---yy
            }
        }
        (function(TD, infoNum,TH) {
            println("标准TD处理********************************");
            for (var i = 0; i < infoNum; i+=2) {
                var obj = {};
                if(TH.length != 0){
                    var m = i/2;
                    if(TH[m]){
                        obj.title = TH[m].innerText.replace(/\*/g,"");
                    }
                    var nextEl = TD[m];
                    println("这是TH结构的"+m+":"+obj.title+"*****************************");
                }else{
                    var isFont = dom.evaluate("./FONT",TD[i],"",1);
                    if(isFont){//这也是温馨提示 --yy
                        continue;
                    }
                    IMG = dom.evaluate(".//IMG",TD[i],"",1);
                    if(IMG){// 照片--- yy
                        obj.title = IMG.getAttribute("alt");
                        IMG.style.width = "60%";
                        IMG.style.height = "100%";
                        obj.text = IMG.outerHTML;
                        comment.push(obj);
                        continue;
                    }
                    var showflag = true;//此表格是否显示
                    for (var j=0; j < hidden.length; j++) {
                        if (TD[i].innerHTML.indexOf(hidden[j])!=-1) {
                            showflag = false;
                        };
                    };
                    if (showflag) {
                        obj.title = TD[i].innerText.trim();
                    }else{
                        continue;
                    }
                   println("这是纯TD结构的"+i+":"+obj.title+"****************************");
                var nextEl = TD[i + 1];
                }//有TH的特殊处理 ---yy
                //var nextEl = tddoms[i].nextSibling.nextSibling;---xg
                // 此处情况很多,nextEl.tagName == 'TD'改为nextEl；因为println(nextEl.tagName)这个处来的结果都是td,可是报错，所以去掉这个
                if (nextEl) {
                    var input = dom.evaluate(".//INPUT[@type='text']", nextEl, "", 1);
                    var select = dom.evaluate(".//SELECT", nextEl, "", 1);
                    var radio = dom.evaluate(".//INPUT[@type='radio'][@checked='checked']",nextEl,"",1) || dom.evaluate(".//INPUT[@type='radio'][@checked]",nextEl,"",1);
                    var noChecked = dom.evaluate(".//INPUT[@type='radio'][not(@checked)]",nextEl,"",1);//单选有checked
                    var textarea = dom.evaluate(".//TEXTAREA",nextEl,"",1);
                    var inputp = dom.evaluate(".//INPUT[@id='referenceNumber']", nextEl, "", 1);//单选,没有checked
                    var inputh = dom.evaluate(".//INPUT[@id='hostdeptValue']", nextEl, "", 1); //来文单位xg
                    var inputh2 = dom.evaluate(".//INPUT[@id='arriveUnit']", nextEl, "", 1); //来文单位2xg
                    var inputarriveCode = dom.evaluate(".//INPUT[@id='arriveCode']", nextEl, "", 1); //arriveCode
                    var inputa = dom.evaluate(".//INPUT[@id='attnum']", nextEl, "", 1);
                    var inputr = dom.evaluate(".//INPUT[@id='remark']", nextEl, "", 1);
                    var inputt = dom.evaluate(".//INPUT[@id='approvalTitle']", nextEl, "", 1);
                    var inputphone = dom.evaluate(".//INPUT[@id='phone']", nextEl, "", 1); //phone1
                    var inputphone2 = dom.evaluate(".//INPUT[@id='telephone']", nextEl, "", 1); //xg
                    var inputnum = dom.evaluate(".//INPUT[@id='printNumber']", nextEl, "", 1); //份数1--xg
                    var inputnum2 = dom.evaluate(".//INPUT[@id='printCount']", nextEl, "", 1); //份数2--xg
                    var inputyear = dom.evaluate(".//INPUT[@id='partYear']", nextEl, "", 1); //年份--xg
                    var noticeOrg = dom.evaluate(".//INPUT[@id='noticeOrg']", nextEl, "", 1); //通知单位---xg
                    var attachmentCount = dom.evaluate(".//INPUT[@id='attachmentCount']", nextEl, "", 1); //附件数量---xg
                    var name = dom.evaluate(".//INPUT[@id='inviteName']", nextEl, "", 1); //姓名---yy
                    var leaveCountryTime = dom.evaluate(".//INPUT[@id='leaveCountryTime']", nextEl, "", 1); //出国日期---yy
                    var vocation = dom.evaluate(".//INPUT[@id='vocation']", nextEl, "", 1); //职业---yy
                    var relation = dom.evaluate(".//INPUT[@id='relation']", nextEl, "", 1); //与起草人关系---yy
                    var isTranscribeVideo = dom.evaluate(".//INPUT[@name='isTranscribeVideo'][@checked]",nextEl,"",1);//是否录制视频会议内容---yy
                    var isBroadcastVideo = dom.evaluate(".//INPUT[@name='isBroadcastVideo']",nextEl,"",1);//是否播放电脑中视频---yy
                    var isMainPlace = dom.evaluate(".//INPUT[@name='isMainPlace'][@checked]",nextEl,"",1);//院本部是否是主会场---yy
                    var inputwhetherBudget = dom.evaluate(".//INPUT[@id='whetherBudget']", nextEl, "", 1);//是否在预算内---yy
                    var interactType = dom.evaluate(".//INPUT[@id='interactType']",nextEl,"",1);//互动类型---yy
                    var softwareVersionSelect = dom.evaluate(".//SELECT[@id='softwareVersionSelect']",nextEl,"",1);   //软件版本信息------lm
                    var myPurchaceMethod = dom.evaluate(".//SPAN[@id='myPurchaceMethod']",nextEl,"",1);  //采购方式  -------lm
                    if (input) {
                        obj.text = input.value;
                    }else if(myPurchaceMethod){   //LM
                        println("=========");
                        obj.text = myPurchaceMethod.innerText.trim();
                    }else if(softwareVersionSelect){//LM
                        var softwareVersion = dom.evaluate(".//INPUT[@id='softwareVersion']",dom,"",1);
                        obj.text = softwareVersion.value;  //lm
                    }else if(textarea){
                        println("******textarea*******");
                        obj.text = textarea.innerHTML;
                    } else if (inputh2) { //来文单位2
                        obj.text = inputh2.value;
                    } else if (inputp) { //查找文号
                        obj.text = inputp.value;
                    } else if (inputarriveCode) { //来文号
                        obj.text = inputarriveCode.value;
                    } else if (inputh) { //来文单位
                        obj.text = inputh.value;
                    } else if (inputa) { //附件数量
                        obj.text = inputa.value;
                    } else if (inputr) { //备注
                        obj.text = inputr.value;
                    } else if (inputt) { //标题
                        obj.text = inputt.value;
                    } else if (inputphone) { //电话1
                        obj.text = inputphone.value;
                    } else if (inputphone2) { //电话2--xg
                        obj.text = inputphone2.value;
                    } else if (inputnum) { //份数--xg
                        obj.text = inputnum.value;
                    } else if (inputyear) { //年份--xg
                        obj.text = inputyear.value;
                    } else if (noticeOrg) { //通知单位---xg
                        obj.text = noticeOrg.value;
                    } else if (attachmentCount) { //附件数量---xg
                        obj.text = attachmentCount.value;
                    } else if (inputnum2) { //份数2--xg
                        obj.text = inputnum2.value;
                    } else if (select) {
                        var selected = dom.evaluate("./OPTION[@selected='selected']", select, "", 1) || dom.evaluate("./OPTION[@selected]", select, "", 1) || dom.evaluate("./OPTION", select, "", 1);
                        if (selected) {
                            obj.text = selected.innerText.trim().replace(/\*/g,'');//*号去掉
                        }
                        //特殊处理---cy
                        if (obj.title.match(/月报月份/)) {
                            var month = dom.evaluate(".//SELECT[@name='commonEntity.month']",nextEl,"",1);
                            if (month) {
                                var selectedmonth = dom.evaluate(".//OPTION[@selected='selected']", month, "", 1) || dom.evaluate(".//OPTION[@selected]", month, "", 1) || dom.evaluate(".//OPTION", month, "", 1);
                                if (selectedmonth) {
                                    obj.text += "年" + selectedmonth.getAttribute("value") + "月";
                                };
                            };
                        };
                    } else if (radio){
                        var text = dom.evaluate(".//following-sibling::LABEL[1]",radio,"",1) || dom.evaluate(".//following-sibling::SPAN[1]",radio,"",1);
                        if(text){
                           //println("*******************************");
                           obj.text = text.innerText.trim();
                           //println(text.innerText);
                          // println("*******************************");
                       }
                    } else if(noChecked){
                        println('not checked');
                        obj.text = "";
                    } else if (name) { //姓名
                        obj.text = name.value;
                    } else if (leaveCountryTime) { //出国日期
                        obj.text = leaveCountryTime.value;
                    } else if (vocation) { //职业
                        obj.text = vocation.value;
                    } else if (relation) { //与起草人关系
                        obj.text = relation.value;
                    } else if(interactType){
                        obj.text = interactType.value;
                    } else if(isTranscribeVideo){//是否录制视频会议内容
                        if(isTranscribeVideo.value == "1"){
                            obj.text = "否";
                        }else{
                            obj.text = "是";
                        }
                    } else if(isBroadcastVideo){//是否播放电脑视频
                        if(isBroadcastVideo.getAttribute('checked')){
                            if(isBroadcastVideo.value == "1"){
                                obj.text = "否";
                            }else{
                                obj.text = "是";
                            }
                        }else{
                            obj.text = "";
                        }
                    } else if(isMainPlace){//院本部是否是主会场
                        if(isMainPlace.value == "1"){
                            obj.text = "否";
                        }else{
                            obj.text = "是";
                        }
                    } else if(inputwhetherBudget){//是否在预算内
                        var value = inputwhetherBudget.value;
                        if(inputwhetherBudget.value == "Y"){
                            obj.text = "是";
                        }else if(inputwhetherBudget.value == "N"){  
                            obj.text = "否";
                        }else{
                            obj.text = value;
                        }
                    }else {
                        obj.text = nextEl.innerText.trim().replace(/\*/g,'');
                    }
                }
                //obj.text = obj.text.replace(/\t|\n|\r/mg, '');
                if(/&nbsp;|\s|\t|\n|\r/mg.test(obj.text)){
                    obj.text = obj.text.replace(/&nbsp;|\s\t|\n|\r/mg, '');
                }
                if(obj.title == "&nbsp;"){//title为空,text变为title
                    obj.title = obj.text;
                    obj.text = "";
                }
                if(!obj.title){//title 空 跳过
                    continue;
                }
                println(obj.title +":" +obj.text);
                comment.push(obj);
           };
       })
       (TD, infoNum,TH);
   }
   return comment;
    /*var commentdoms = dom.evaluate(".//TD[@class='commentName']", el, "", 0);
    var comment = [];
    var infoNum = commentdoms.length;
    println(infoNum);
    for (i = 0; i < infoNum; i++) {
        var obj = {};
        obj.title = commentdoms[i].innerText.trim();    
        var nextEl = commentdoms[i].nextSibling.nextSibling;
        // 此处情况很多
        if (nextEl.tagName == 'TD') {
            var input = dom.evaluate(".//INPUT[@type='text']", nextEl, "", 1);
            var select = dom.evaluate(".//SELECT", nextEl, "", 1);
            var inputp = dom.evaluate(".//INPUT[@id='referenceNumber']",nextEl,"",1);
            var inputh = dom.evaluate(".//INPUT[@id='hostdeptValue']",nextEl,"",1)||dom.evaluate(".//INPUT[@id='arriveUnit']",nextEl,"",1);//arriveCode
            var inputarriveCode = dom.evaluate(".//INPUT[@id='arriveCode']",nextEl,"",1);
            var inputa = dom.evaluate(".//INPUT[@id='attnum']",nextEl,"",1);
            var inputr = dom.evaluate(".//INPUT[@id='remark']",nextEl,"",1);
            var inputt = dom.evaluate(".//INPUT[@id='approvalTitle']",nextEl,"",1);
            var inputphone = dom.evaluate(".//INPUT[@id='phone']",nextEl,"",1);//phone
            if (input) {
                obj.text = input.value;
            } else if (select) {
                var selected = dom.evaluate(".//OPTION[@selected='selected']", select, "", 1) || dom.evaluate(".//OPTION[@selected]", select, "", 1) || dom.evaluate(".//OPTION", select, "", 1);
                if (selected) {
                    obj.text = selected.getAttribute('value');
                }
            }else if(inputp){//查找文号
                obj.text =inputp.value;
            }else if(inputarriveCode){//来文号
                obj.text =inputarriveCode.value;
            }else if(inputh){//来文单位
                obj.text =inputh.value;
            }else if(inputa){//附件数量
                obj.text =inputa.value;
            }else if(inputr){//备注
                obj.text =inputr.value;
            }else if(inputt){//标题
                obj.text =inputt.value;
            }else if(inputphone){//电话
                obj.text =inputphone.value;
            }else {
                obj.text = nextEl.innerText.trim();
            }
        }
        obj.text = obj.text.replace(/\t|\n|\r/mg, '');
        comment.push(obj);
    }
    return comment;
    */
}
//得到处理单中被隐藏的数组（id）
function getHiddenValues(){
    var hidden = [], readonly = [], editable = [];
    var FORM_ACL_STATE_EDITABLE;
    var start = text.indexOf('var FORM_ACL_STATE_EDITABLE')!=-1?text.indexOf('var FORM_ACL_STATE_EDITABLE'):null;
    var values = start?text.substring(start,text.length):null;
    if (values) {
        var valuearr = values.split(';')[0];
        if (valuearr) {
            FORM_ACL_STATE_EDITABLE = valuearr.split('=')[1].trim();
        };
    };
    var formFieldAcl = dom.evaluate(".//INPUT[@id='formFieldAcl']", dom, "", 1);
    var formAcl = dom.evaluate(".//INPUT[@id='formAcl']", dom, "", 1);
    if (formFieldAcl) {
        var formFieldAclValue = formFieldAcl.getAttribute('value');
    };
    if (formAcl) {
        var formAclValue = formAcl.getAttribute('value');
    };
    if (typeof formFieldAclValue!='undefined' && formFieldAclValue!=null && formFieldAclValue!='') {
        var formFieldAclArray = formFieldAclValue.split(";");
        for (var i=0;i<formFieldAclArray.length;i++) {
            var keyValueStr = formFieldAclArray[i];
            if (keyValueStr=='') {
                continue;
            }
            var keyValueArray = keyValueStr.split("=");
            var key = keyValueArray[0];
            if (key=='') {
                continue;
            }
            var value = keyValueArray[1];
            switch(value) {
                case "0":
                    hidden.push(key);
                    break;
                case "1":
                    readonly.push(key);
                    break;
                case "2":
                    editable.push(key);
                    break;
            }
        }
    }
    if (typeof formAclValue=='unedfined' || formAclValue==FORM_ACL_STATE_EDITABLE) {
        if (hidden.length>0 || readonly.length>0 || editable.length>0) {
            hidden = hidden;
        } else {
            hidden = [];
            readonly = [];
            editable = [];
        }
    }
    return hidden;
}
//对于采购类的处理单
function createCommengJson2(el) {
    var commentdoms = dom.evaluate(".//TABLE[@class='tr3_bg_table']", maincontentdom, "", 0);
    var table1 = commentdoms[0];
    if (commentdoms.length > 2) {
        el = commentdoms[1];
    };
    var applyId = dom.evaluate(".//INPUT[@id='applyId']", dom, "", 1);
    if (applyId) {
        var applyidValue = applyId.value;
    };
    commentdoms = dom.evaluate(".//TH[@class='commentName']", el, "", 0);
    var comment = [];
    var infoNum = commentdoms.length;
    for (i = 0; i < infoNum; i++) {
        var obj = {};
        obj.title = commentdoms[i].innerText.trim().replace(/\*/g,"");
        var nextEl = commentdoms[i].nextSibling.nextSibling;
        // 此处情况很多
        if (nextEl.tagName == 'TD') {
            var input = dom.evaluate(".//INPUT[@type='text']", nextEl, "", 1);
            var select = dom.evaluate(".//SELECT", nextEl, "", 1);
            var inputp = dom.evaluate(".//INPUT[@id='referenceNumber']", nextEl, "", 1);
            var inputh = dom.evaluate(".//INPUT[@id='hostdeptValue']", nextEl, "", 1) || dom.evaluate(".//INPUT[@id='arriveUnit']", nextEl, "", 1); //arriveCode
            var inputarriveCode = dom.evaluate(".//INPUT[@id='arriveCode']", nextEl, "", 1);
            var inputa = dom.evaluate(".//INPUT[@id='attnum']", nextEl, "", 1);
            var inputr = dom.evaluate(".//INPUT[@id='remark']", nextEl, "", 1);
            var inputt = dom.evaluate(".//INPUT[@id='approvalTitle']", nextEl, "", 1);
            var inputphone = dom.evaluate(".//INPUT[@id='phone']", nextEl, "", 1); //phone
            var requirementDescription = dom.evaluate(".//TEXTAREA[@id='requirementDescription']", nextEl, "", 1);
            var conferenceroomType = dom.evaluate(".//SELECT[@id='conferenceroomType']/OPTION[@selected]",nextEl,"",1);//会议类型---yy
            if (input) {
                obj.text = input.value;
            } else if (select) {
                var selected = dom.evaluate(".//OPTION[@selected='selected']", select, "", 1) || dom.evaluate(".//OPTION[@selected]", select, "", 1) || dom.evaluate(".//OPTION", select, "", 1);
                if (selected) {
                    obj.text = selected.innerText;
                }
            } else if (requirementDescription) {
                obj.text = requirementDescription.innerText;
            } else if (inputp) { //查找文号
                obj.text = inputp.value;
            } else if (inputarriveCode) { //来文号
                obj.text = inputarriveCode.value;
            } else if (inputh) { //来文单位
                obj.text = inputh.value;
            } else if (inputa) { //附件数量
                obj.text = inputa.value;
            } else if (inputr) { //备注
                obj.text = inputr.value;
            } else if (inputt) { //标题
                obj.text = inputt.value;
            } else if (inputphone) { //电话
                obj.text = inputphone.value;
            }else {
                obj.text = nextEl.innerText.trim();
            }
        }
        obj.text = obj.text.replace(/\t|\n|\r/mg, '');
        comment.push(obj);
    }
    var datas = {
        applyId: ""
    };
    if (applyId) {
        datas.applyId = applyidValue;
    };
    comment.push(datas);

    var arr = dealTabel(table1);
    if (arr != null) {
        comment.push(arr);
    };
    return comment;
}
//  xg lm 对于行政类处理单
function createCommentJson3(el){
    var TH = dom.evaluate(".//TH[@class='commentName']", el, "", 0);
    var TR = dom.evaluate(".//TR",el,"",0);
    //不显示的跳过
    for (var i=0; i < TR.length; i++) {
      if(TR[i].getAttribute("style") == "display:none"){
            continue;
        }
    };
    var infoNum = TH.length;
    var comment = [];
    var serialNumber = dom.evaluate(".//INPUT[@id='serialNumber']",dom,"",1);
    var projectName = dom.evaluate(".//INPUT[@id='projectName']",dom,"",1);
    var budgetAmount = dom.evaluate(".//INPUT[@id='budgetAmount']",dom,"",1);
    
    for (var i=0; i < infoNum; i++) {
      var obj = {};
      obj.title = TH[i].innerText.trim();
      var nextEl = TH[i].nextSibling.nextSibling;
       // 此处情况很多
       if(nextEl){
           var mySerialNumber = dom.evaluate(".//SPAN[@id='mySerialNumber']",nextEl,"",1);
           var input = dom.evaluate(".//INPUT[@type='text']",nextEl,"",1);
           var myProjectName = dom.evaluate(".//SPAN[@id='myProjectName']",nextEl,"",1);
           var myBudgetAmount = dom.evaluate(".//SPAN[@id='myBudgetAmount']",nextEl,"",1);
           var myPurchaceMethod = dom.evaluate(".//SPAN[@id='myPurchaceMethod']",nextEl,"",1);
           var questionLink = dom.evaluate("./SELECT[@id='questionLink']/OPTION[@selected]",nextEl,"",1);
           var purchaseAdvice = dom.evaluate(".//TEXTAREA[@id='purchaseAdvice']",nextEl,"",1);
           var serialNumber = dom.evaluate(".//INPUT[@id='serialNumber']",dom,"",1);
           var myPurchaceMethod = dom.evaluate(".//SPAN[@id='myPurchaceMethod']",nextEl,"",1);  //采购方式  -------lm
            if(mySerialNumber){
                obj.text = serialNumber.value;
            }else if(myPurchaceMethod){
                println("==========");
                var purchaseType = dom.evaluate(".//INPUT[@id='purchaseType']",dom,"",1); 
                obj.text = purchaseType.value;
            }else if(input){
                obj.text = input.value;
            }else if(myProjectName){
                obj.text = projectName.value;
            }else if(myBudgetAmount){
                obj.text = budgetAmount.value;
            }else if(myPurchaceMethod){
                obj.text = myPurchaceMethod.innerText.trim();
            }else if(questionLink){
                if(questionLink.innerText.trim() == "请选择"){
                    obj.text = questionLink.innerText.trim().replace("请选择","");
                }else{
                    obj.text = questionLink.innerText.trim();
                }
            }else if(purchaseAdvice){
                obj.text = purchaseAdvice.innerText.trim();
            }else{
                obj.text = nextEl.innerText.trim();
            }   
       }
       comment.push(obj);
    };
    return comment;
}
//xg ----end


//得到特殊处理单的第一个表格
function dealTabel(el) {
    var commentdoms = dom.evaluate(".//TH[@class='commentName']", el, "", 0);
    var comment = [];
    var infoNum = commentdoms.length;
    for (i = 0; i < infoNum; i++) {
        var obj = {};
        var nextEl = commentdoms[i].nextSibling.nextSibling;
        // 此处情况很多
        if (nextEl.tagName == 'TD') {
            var projectName = dom.evaluate(".//INPUT[@id='projectName']", nextEl, "", 1); //项目名称
            var projectType = dom.evaluate(".//SPAN[@name='projectType']", nextEl, "", 1); //项目类别
            var projectCode = dom.evaluate(".//SPAN[@name='projectCode']", nextEl, "", 1); //项目编号
            var draftUserName = dom.evaluate(".//SPAN[@name='draftUserName']", nextEl, "", 1); //申请人
            var draftOrgName = dom.evaluate(".//SPAN[@name='draftOrgName']", nextEl, "", 1); //申请部门
            var draftTime = dom.evaluate(".//SPAN[@name='draftTime']", nextEl, "", 1); //申请时间
            var budgetAccount = dom.evaluate(".//SPAN[@name='budgetAccount']", nextEl, "", 1); //预算科目
            var budgetAmount = dom.evaluate(".//SPAN[@name='budgetAmount']", nextEl, "", 1); //预算金额
            var expenditureType = dom.evaluate(".//SPAN[@name='expenditureType']", nextEl, "", 1); //开支类型
            var demandDepartment = dom.evaluate(".//SPAN[@name='demandDepartment']", nextEl, "", 1); //管理部门
            var purchaseType = dom.evaluate(".//SPAN[@name='purchaseType']", nextEl, "", 1); //小额采购
            var decisionForm = dom.evaluate(".//SPAN[@name='decisionForm']", nextEl, "", 1); //决策形式
            var requirementDescription = dom.evaluate(".//SPAN[@name='requirementDescription']", nextEl, "", 1); //需求描述
            if (projectName) {
                obj.title = commentdoms[i].innerText.trim();
                obj.name = "projectName";
            } else if (projectType) {
                obj.title = commentdoms[i].innerText.trim();
                obj.name = "projectType";
            } else if (projectCode) {
                obj.title = commentdoms[i].innerText.trim();
                obj.name = "projectCode";
            } else if (draftUserName) {
                obj.title = commentdoms[i].innerText.trim();
                obj.name = "draftUserName";
            } else if (draftOrgName) {
                obj.title = commentdoms[i].innerText.trim();
                obj.name = "draftOrgName";
            } else if (draftTime) {
                obj.title = commentdoms[i].innerText.trim();
                obj.name = "draftTime";
            } else if (budgetAccount) {
                obj.title = commentdoms[i].innerText.trim();
                obj.name = "budgetAccount";
            } else if (budgetAmount) {
                obj.title = commentdoms[i].innerText.trim();
                obj.name = "budgetAmount";
            } else if (expenditureType) {
                obj.title = commentdoms[i].innerText.trim();
                obj.name = "expenditureType";
            } else if (demandDepartment) {
                obj.title = commentdoms[i].innerText.trim();
                obj.name = "demandDepartment";
            } else if (purchaseType) {
                obj.title = commentdoms[i].innerText.trim();
                obj.name = "purchaseType";
            } else if (decisionForm) {
                obj.title = commentdoms[i].innerText.trim();
                obj.name = "decisionForm";
            } else if (requirementDescription) {
                obj.title = commentdoms[i].innerText.trim();
                obj.name = "requirementDescription";
            } else {}
        }
        comment.push(obj);
    }
    if (comment.length > 0) {
        return comment;
    } else {
        return null;
    };
}
//对于人力资源系统多余表格的处理
function IsHaveTable(obj){
    var flag = false;
    var table = obj.evaluate(".//TABLE[@class='childrenTable']", obj, "", 1);
    if (table) {
        flag = true;
    }
    return flag;
}
//得到人力资源系统多余表格的地址
function buildTableUrl(obj){
    var url;
    if (IsHaveTable(obj)) {
        var table = obj.evaluate(".//TABLE[@class='childrenTable']", obj, "", 1);
        var Ahtml = obj.evaluate(".//TD/A", table, "", 1);
        if (Ahtml) {
            var aHtml = Ahtml.outerHTML;
            var aScripts = aHtml.match(/href=.*showEntity.*;/);
            var aScript = aScripts?aScripts[0].match(/\(.*\)/):null;
            var aCounts = aScript[0].replace("(","").replace(")","");
        }
        if (aCounts) {
            url = "showEntity.action?entityId="+aCounts;
        }
    }
    return url;
}
//得到人力资源系统多余表格中的数据
function buildTableDatas(obj){
    var table = obj.evaluate(".//TABLE[@class='childrenTable']", obj, "", 1);
    var comment = [];
    var commenttitle = new Array();
    if (table) {
        var trs = obj.evaluate(".//TR",table,"",0);
        var trtitle = trs[0];
        var tdstitle = obj.evaluate(".//TD", trtitle, "", 0);
        for (var i=0; i < tdstitle.length; i++) {
            if (tdstitle[i].innerText.trim()!="") {
                commenttitle[i-1] = tdstitle[i].innerText.trim();
            };
        };
        if (trs.length == 1) {
            for (var i=0; i < commenttitle.length; i++) {
                var objs = {};
                objs.title = commenttitle[i] + "：";
                objs.text = '';
                comment.push(objs);
            };
        }else{
            for (var i=1; i < trs.length; i++) {
                var tr = trs[i];
                var tds = obj.evaluate(".//TD", tr, "", 0);
                var infoNum = tds.length;
                if (commenttitle) {
                    for (var i=1; i < infoNum; i++) {
                        var objs = {};
                        var input = obj.evaluate(".//INPUT", tds[i], "", 1);
                        var select = obj.evaluate(".//SELECT", tds[i], "", 1);
                        objs.title = commenttitle[i-1].replace(/\&nbsp;/mg,'')+"：";
                        if (input) {
                            objs.text = input.value||input.getAttribute('value');
                        }else if(select){
                            var selected = obj.evaluate(".//OPTION[@selected='selected']", select, "", 1)||obj.evaluate(".//OPTION[@selected]",select,"",1)||obj.evaluate(".//OPTION",select,"",1);
                            if (selected) {
                                objs.text = selected.innerText;
                            };
                        }else{
                            objs.text = tds[i].innerText.trim();
                        }
                        comment.push(objs);
                    };
                };
            }
        }
    };
    return comment;
}
//查看本公文是否拥有生成编号这个功能--cy
function isGetNumber(obj) {
    var butBtn = obj.evaluate(".//A[@id='but']", dom, "", 1);
    if (butBtn) {
        return true;
    } else {
        return false;
    };
}
//构建生成编号的数据--cy
function buildNumberData() {
    var datas = {
        orgId: '',
        bizCode: '',
        processInstanceId: '',
        particularYear: '',
        fileWord: '',
        serialNumber: '',
        fileWordNumber: '',
        currentStep: '',
        referenceNumber: '',
        valiCode: '',
        valiBizCode: '',
        valiBol: '',
        valiParam: '',
        domainId: ''
    };
    var valiCode = dom.evaluate(".//INPUT[@id='recCodeNameValueValidateFormCodeBizCode']", dom, "", 1);
    var valiBizCode = dom.evaluate(".//INPUT[@id='valiField']", dom, "", 1);
    if (valiBizCode) {
        var valiBol = dom.evaluate(".//INPUT[@id='" + valiBizCode.value + "']", dom, "", 1);
    };
    var valiParam = dom.evaluate(".//INPUT[@id='userDefinedLanguage']", dom, "", 1);
    var domainId = dom.evaluate(".//INPUT[@id='sid']", dom, "", 1);
    var orgId = dom.evaluate(".//INPUT[@id='orgId']", dom, "", 1);
    var bizCode = dom.evaluate(".//INPUT[@id='bizCode']", dom, "", 1);
    var processInstanceId = dom.evaluate(".//INPUT[@id='processId']", dom, "", 1);
    var particularYear = dom.evaluate(".//INPUT[@id='particularYear']", dom, "", 1); //year
    var fileWord = dom.evaluate(".//INPUT[@id='fileWord']", dom, "", 1);
    var serialNumber = dom.evaluate(".//INPUT[@id='serialNumber']", dom, "", 1); //currentValue
    var fileWordNumber = dom.evaluate(".//INPUT[@id='fileWordNumber']", dom, "", 1); //fileNameId
    var currentStep = dom.evaluate(".//INPUT[@id='currentStep']", dom, "", 1);
    var referenceNumber = dom.evaluate(".//INPUT[@id='referenceNumber']", dom, "", 1); //varnumberId
    if (valiCode) {
        datas.valiCode = valiCode.value;
    };
    if (valiBizCode) {
        datas.valiBizCode = valiBizCode.value;
    };
    if (valiBol) {
        datas.valiBol = valiBol.value;
    };
    if (valiParam) {
        datas.valiParam = valiParam.value;
    };
    if (domainId) {
        datas.domainId = domainId.value;
    };
    if (orgId) {
        datas.orgId = orgId.value;
    };
    if (bizCode) {
        datas.bizCode = bizCode.value;
    };
    if (processInstanceId) {
        datas.processInstanceId = processInstanceId.value;
    };
    if (currentStep) {
        datas.currentStep = currentStep.value;
    };
    if (particularYear) {
        datas.particularYear = particularYear.value;
    };
    if (fileWord) {
        datas.fileWord = fileWord.value;
    };
    if (serialNumber) {
        datas.serialNumber = serialNumber.value;
    };
    if (fileWordNumber) {
        datas.fileWordNumber = fileWordNumber.value;
    };
    if (referenceNumber) {
        datas.referenceNumber = referenceNumber.value;
    };
    return datas;
}
function buildNumberForFileCode(){
    var filecode = dom.evaluate(".//INPUT", dom, "", 0);
    var filecodeid = "";
    if (filecode) {
        for (var i=0; i < filecode.length; i++) {
            var filec = filecode[i];
            if (filec.getAttribute('class').indexOf('fileCode')!=-1&&filec.getAttribute('id')!='') {
                filecodeid = filec.getAttribute('id');
            };
        };
    }
    return filecodeid;
}
//构造生成编号的提交地址
function buildFormSubmitUrl() {
    var start = text.indexOf("function saveEntity");
    var saveString = text.substring(start, text.length);
    var start2 = saveString.indexOf("$('#entityForm').submit()");
    var str = saveString.substring(0, start2);
    var arr = str.split(",");
    var actions = arr[1];
    var action = actions.replace(/\'/mg, "").replace(/\)/, "").replace(/;/mg, "").trim();
    return action;
}

//构建根地址
function buildContextRoot() {
    var urljson = {
        contextPath: '',
        contextRoot: ''
    };
    var str = text.substring(text.indexOf('var contextPath'), text.length);
    var strarr = str.split(';');
    var contextPath = strarr[0];
    var paths = contextPath.match(/\'.*\'/);
    contextPath = paths[0].replace(/\'/mg, "").replace("/", "");
    urljson.contextPath = contextPath;
    var str2 = strarr[1].substring(strarr[1].indexOf('var contextRoot'), strarr[1].length);
    var str2arr = str2.split(';');
    var contextRoot = str2arr[0];
    var paths2 = contextRoot.match(/\'.*\'/);
    contextRoot = paths2[0].replace(/\'/mg, "").replace("/", "");
    urljson.contextRoot = contextRoot;
    return urljson;
}

// 构建提交地址
function buildSubmitUrl(isFreeSubmit) {
    var urls = buildContextRoot();
    var contextPath = urls.contextPath;
    var label = dom.evaluate(".//INPUT[@id='label']", dom, "", 1);
    return contextPath + "/" + label.value + "/" + buildBasicUrl(false, true, 'candidate.action', isFreeSubmit) + buildInstanceInfoUrl() + buildWindowParamsUrl(true) + '&random=' + t.now().getTime();
}

//得到setNumberValues()方法中第一个设置的ID值
function buildFormData() {
    var start1 = text.indexOf("function setNumberValues(");
    if (start1) {
        var strs = text.substring(start1, text.length);
    };
    var start2 = strs.indexOf("document.getElementById");
    if (start2) {
        strs = strs.substring(start2, strs.length);
    };
    var strarr = strs.split(";");
    var idname = strarr[0].match(/\".*\"/);
    if (idname) {
        idname = idname[0].replace(/\"/mg, "");
        return idname;
    } else {
        return null;
    };

}

//是否重新构建bizParameters的值//xg cy
function isSetBizParameters() {
    var stateBizParameters = dom.getElementById('stateBizParameters').getAttribute('value');
    var branchInstitutionFlag;
    if (stateBizParameters) {
        var values = stateBizParameters.split(';');
        if (values) {
            for (var i = 0; i < values.length; i++) {
                if (values[i].match('branchInstitution')) {
                    branchInstitutionFlag = values[i].split('=')[1];
                };
            };
        };
    };
    return branchInstitutionFlag;
}

function buildBasicUrl(isDraft, showAppertain, actionName, isFreeSubmit) {
    var url = actionName + '?';
    url += "&bizCode=" + dom.getElementById('bizCode').getAttribute('value');
    url += "&bizId=" + dom.getElementById('bizId').getAttribute('value');
    url += "&label=" + dom.getElementById('label').getAttribute('value');
    url += "&version=" + dom.getElementById('version').getAttribute('value');
    url += "&currentStep=" + dom.getElementById('currentStep').getAttribute('value');
    url += "&stateBizParameters=" + dom.getElementById('stateBizParameters').getAttribute('value');
    url += "&bizParameters=" + dom.getElementById('bizParameters').getAttribute('value');
    url += "&userId=" + dom.getElementById('userId').getAttribute('value');
    url += "&orgId=" + dom.getElementById('orgId').getAttribute('value');
    url += "&positionId=" + dom.getElementById('positionId').getAttribute('value');
    url += "&showAppertain=" + showAppertain;
    url += "&isDraft=" + isDraft;
    if (isFreeSubmit) url += "&isFreeSubmit=" + isFreeSubmit;
    return url;
}

function buildInstanceInfoUrl() {
    var url = "&processId=" + dom.getElementById('processId').getAttribute('value');
    url += "&activityId=" + dom.getElementById('activityId').getAttribute('value');
    url += "&workItemId=" + dom.getElementById('workItemId').getAttribute('value');
    url += "&delegationType=" + dom.getElementById('delegationType').getAttribute('value');
    return url;
}

function buildWindowParamsUrl(showAppertain) {
    if (showAppertain) {
        return "&KeepThis=true&TB_iframe=true&height=580&width=700";
    } else {
        return "&KeepThis=true&TB_iframe=true&height=580&width=700";
    }
}
//测试cy
//正文    cy
function buildDetailUrl() {
    var iframe = dom.evaluate(".//IFRAME[@id='commonEditWordIframe']", dom.body, "", 1);
    return iframe ? iframe.getAttribute('src') : '';
    //var url = iframe ? iframe.getAttribute('src'):'';
    //var start = url.indexOf(":9080/") + 6;
    //url = url.substring(start,url.length);
}
//当正文的iframe为空时，将会运用到
function buildDetailPostData() {
    var bizId = dom.evaluate(".//INPUT[@name='bizId']", dom, "", 1);
    bizId = bizId.getAttribute("value");
    var bizCode = dom.evaluate(".//INPUT[@name='bizCode']", dom, "", 1);
    bizCode = bizCode.getAttribute("value");
    var postdatas = {
        bizId: bizId,
        bizCode: bizCode
    };
    return postdatas;
}

function buildDetailDatas(url) {
    var responsedata = {
        html: "",
        secondOrgValue: "",
        signTitleValue: "",
        signMainSenderValue: "",
        signDeptValue: "",
        signDateValue: "",
        fileNoValue: ""
    };
    var responsedata1 = {
        signDeptTitle: "",
        signTitleValue: "",
        signMainSenderValue: "",
        signDeptValue: "",
        signDateValue: "",
        fileNoValue: "",
        signPersonValue: "",
        copySenderValue: "",
        copyReportValue: "",
        signTiemValue: ""
    };
    //var html = dom.evaluate(".//DIV[@id='uploadWordHtmlSelf_jsp']",dom,"",1);
    var html = dom.evaluate(".//DIV[@class='Section1']", dom, "", 1);
    if (html) {
        var str1 = html.innerText;
        var start1 = 0,
        end1 = 0;
        for (var i = 0; i < str1.length; i++) {
            if (str1.charCodeAt(i) > 127) {
                start1 = i;
                break;
            };
        };
        for (var i = str1.length - 1; i > 0; i--) {
            if (str1.charCodeAt(i) > 127) {
                end1 = i + 1;
                break;
            };
        };
        str1 = str1.substring(start1, end1);
        responsedata.html = str1;
        responsedata1.signDeptTitle = str1;
    };
    var key_secondOrg = dom.evaluate(".//INPUT[@id='key_secondOrg']", dom, "", 1);
    var key_secondOrgValue = "",
    secondOrg = "",
    secondOrgValue = "",
    signDeptValue = "";
    if (key_secondOrg) {
        key_secondOrgValue = key_secondOrg.getAttribute("value");
        secondOrg = dom.evaluate(".//INPUT[@id='" + key_secondOrgValue + "']", dom, "", 1);
        secondOrgValue = secondOrg.getAttribute("value") + "上报签报";
        signDeptValue = "中国移动通信集团设计院有限公司" + secondOrg.getAttribute("value");
    };
    responsedata.secondOrgValue = secondOrgValue;
    var key_signTitle = dom.evaluate(".//INPUT[@id='key_signTitle']", dom, "", 1);
    var key_signTitleValue = "",
    signTitleValue = "";
    if (key_signTitle) {
        key_signTitleValue = key_signTitle.getAttribute("value");
        signTitleValue = dom.evaluate(".//INPUT[@id='" + key_signTitleValue + "']", dom, "", 1).getAttribute("value");
    };
    responsedata.signTitleValue = signTitleValue;
    var key_signMainSender = dom.evaluate(".//INPUT[@id='key_signMainSender']", dom, "", 1);
    var key_signMainSenderValue = "",
    signMainSenderValue = "";
    if (key_signMainSender) {
        key_signMainSenderValue = key_signMainSender.getAttribute("value");
        signMainSenderValue = dom.evaluate(".//INPUT[@id='" + key_signMainSenderValue + "']", dom, "", 1).getAttribute("value");
    };
    responsedata.signMainSenderValue = signMainSenderValue;
    responsedata.signDeptValue = signDeptValue;
    var key_signDateValue = dom.evaluate(".//INPUT[@id='key_signDate']", dom, "", 1);
    if (key_signDateValue) {
        key_signDateValue = key_signDateValue.getAttribute("value");
    };
    var signDateValue = dom.evaluate(".//INPUT[@id='" + key_signDateValue + "']", dom, "", 1);
    if (signDateValue) {
        signDateValue = signDateValue.getAttribute("value");
    };
    var key_fileNoValue = dom.evaluate(".//INPUT[@id='key_fileNo']", dom, "", 1);
    if (key_fileNoValue) {
        key_fileNoValue = key_fileNoValue.getAttribute("value");
    }
    var fileNoValue = dom.evaluate(".//INPUT[@id='" + key_fileNoValue + "']", dom, "", 1);
    if (fileNoValue) {
        fileNoValue = fileNoValue.getAttribute("value");
    };
    responsedata.fileNoValue = fileNoValue;
    var qianbao1 = dom.evaluate(".//INPUT[@id='key_signDept']", dom, "", 1);
    var qianbao = "",
    qianbao2 = "";
    if (qianbao1) {
        qianbao = qianbao1.getAttribute("value");
        qianbao2 = dom.evaluate(".//INPUT[@id='" + qianbao + "']", dom, "", 1);
        qianbao2 = qianbao2.getAttribute("value");
    };

    responsedata1.signDeptValue = qianbao2;
    if (qianbao2 == "中京通信服务中心") {
        responsedata1.signDeptTitle = "中京通信服务中心签报";
    };
    responsedata1.signTitleValue = signTitleValue;
    responsedata1.fileNoValue = fileNoValue;
    responsedata1.signMainSenderValue = signMainSenderValue;
    responsedata1.signDateValue = signDateValue;
    var key_signPerson = dom.evaluate(".//INPUT[@id='key_signPerson']", dom, "", 1);
    if (key_signPerson) {
        var key_signPersonValue = key_signPerson.getAttribute("value");
        var signPerson = dom.evaluate(".//INPUT[@id='" + key_signPersonValue + "']", dom, "", 1);
        responsedata1.signPersonValue = signPerson.getAttribute("value");
    };
    var key_copySender = dom.evaluate(".//INPUT[@id='key_copySender']", dom, "", 1);
    if (key_copySender) {
        var key_copySenderValue = key_copySender.getAttribute("value");
        var copySender = dom.evaluate(".//INPUT[@id='" + key_copySenderValue + "']", dom, "", 1);
        responsedata1.copySenderValue = copySender.getAttribute("value");
    };
    var key_copyReport = dom.evaluate(".//INPUT[@id='key_copyReport']", dom, "", 1);
    if (key_copyReport) {
        var key_copyReportValue = key_copyReport.getAttribute("value");
        var copyReport = dom.evaluate(".//INPUT[@id='" + key_copyReportValue + "']", dom, "", 1);
        responsedata1.copyReportValue = copyReport.getAttribute("value");
    };
    var key_signTiemValue = dom.evaluate(".//INPUT[@id='key_signTiemValue']", dom, "", 1);
    if (key_signTiemValue) {
        var key_signTiemValues = key_signTiemValue.getAttribute("value");
        var signTiemValue = dom.evaluate(".//INPUT[@id='" + key_signTiemValues + "']", dom, "", 1);
        responsedata1.signTiemValue = signTiemValue.getAttribute("value");
    };
    if (url == "") {
        return responsedata;
    } else {
        return responsedata1;
    };
}
//意见   cy
function getOpnionPostData() {
    var processId = dom.evaluate(".//INPUT[@name='processId']", dom, "", 1);
    processId = processId.getAttribute("value");
    var bizId = dom.evaluate(".//INPUT[@name='bizId']", dom, "", 1);
    bizId = bizId.getAttribute("value");
    var bizCode = dom.evaluate(".//INPUT[@name='bizCode']", dom, "", 1);
    bizCode = bizCode.getAttribute("value");
    var label = dom.evaluate(".//INPUT[@name='label']", dom, "", 1);
    label = label.getAttribute("value");
    var version = dom.evaluate(".//INPUT[@name='version']", dom, "", 1);
    version = version.getAttribute("value");
    var moreFlg = 'true';
    //jsondata.moreFlg = moreFlg;
    var start1 = text.lastIndexOf("var moreFlg");
    var end1 = text.indexOf(";", start1 + 1);
    //println(text.substring(start1,end1));
    var moreFlgArr = text.substring(start1, end1).split("=");
    if (moreFlgArr.length > 1) {
        moreFlg = moreFlgArr[1].replace(/ +/g, "").replace(/\'/g, "");
    }
    if (bizCode == "purchasePlanResult") {
        moreFlg = true;
    };
    var postdatas = {
        rowNum: '1000',
        processId: processId,
        bizId: bizId,
        bizCode: bizCode,
        label: label,
        version: version,
        moreFlg: moreFlg
    };
    return postdatas;
}
//构建attachlist地址
function buildAttachUrl() {
    var urls = buildContextRoot();//---cy
    var AttachUrl = dom.evaluate(".//SCRIPT[contains(text(), 'isAnonymous')]", dom, "", 1);
    //xg----cy
    AttachUrl = 'Attach-context-'+urls.contextPath+'/upload/freshAttach.action?foreignId=';
    AttachUrl += dom.getElementById('bizId').getAttribute('value') + '&att.bizCode=';
    AttachUrl += dom.getElementById('bizCode').getAttribute('value') + '&multi=null&readonly=0'; //取得bizCode
    //  t.out(AttachUrl);
    return AttachUrl;
}

function buildOpinionUrl() {
    var urls = buildContextRoot();
    var opinionUrl = urls.contextPath + "/" + "appertain/appertainTwoList.action";
    return opinionUrl;
}
// 构建表单参数json数据
function buildSelectJson() {
    var action = dom.forms[0].action;
    var itemdom = dom.evaluate(".//*[@name]", dom.forms[0], "", 0);
    var infoNum = itemdom.length;
    var result = {};
    for (i = 0; i < infoNum; i++) {
        if (itemdom[i].name && itemdom[i].value !== null && itemdom[i].value !== undefined && itemdom[i].tagName !== 'BUTTON') {
            switch (itemdom[i].tagName) {
                case 'SELECT':
                var opinion = dom.evaluate(".//OPTION[@selected='selected']", itemdom[i], "", 1) || dom.evaluate(".//OPTION[@selected]", itemdom[i], "", 1) || dom.evaluate(".//OPTION", itemdom[i], "", 1);
                result[itemdom[i].name] = opinion.value || '';
                break;
                case 'TEXTAREA'://xg  --cytextarea用value无法取到其内容
                result[itemdom[i].name] = itemdom[i].innerHTML;
                break;
                default:
                result[itemdom[i].name] = itemdom[i].value;
            }
        }
    }
    // deptNotifyValue，deptNotifyInput初始化
    var deptnotifydom = dom.evaluate(".//INPUT[@id='mainSenderValue']", dom.forms[0], "", 1);
    var sex= dom.evaluate(".//INPUT[@radio][@checked]",dom.forms[0],1) || dom.evaluate(".//INPUT[@radio][@checked='*']",dom.forms[0],"",1);
    if(sex){
        println("2");
        result.sex = sex.value == 1 ? "男" : "女";
    }
    println(result.sex);
    result.deptNotifyValue = deptnotifydom ? deptnotifydom.value : '';
    result = {
        url: action,
        postdata: result
    };
    //  t.out(JSON.stringify(result));
    return result;
}
//构建流程跟踪的地址
function buildProcessUrl() {
    //http://cmdioa.di.cmcc:9080/process-web/processplatform/trace.action?processId=12368&SSOUserName=shihuarong&KeepThis=true&
    var processUrl = "/process-web/processplatform/trace.action?";
    var processId = dom.evaluate(".//INPUT[@name='processId']", dom, "", 1);
    processId = processId.getAttribute("value");
    processUrl = processUrl + "processId=" + processId;
    var username = dom.evaluate(".//INPUT[@id='sessionSESSION_USERUserName']", dom, "", 1);
    if (username) {
        processUrl = processUrl + "&SSOUserName=" + username.getAttribute("value") + "&KeepThis=true&";
    } else {
        var str = text.substring(text.indexOf("var userNameParam") + 1, text.length);
        str = str.substring(0, str.indexOf(";"));
        var username = str.substring(str.indexOf("SSOUserName=") + 1, str.length);
        if (username.indexOf("=")) {
            var arr = username.split("=");
            username = arr[1].replace("'", "");
        };
        processUrl = processUrl + "&SSOUserName=" + username + "&KeepThis=true&";
    };
    return processUrl;
}