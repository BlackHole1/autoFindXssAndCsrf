(function(){
	var onlyString = 'woainixss<>"';
	var protocol = window.location.protocol;
	var host = window.location.host;
	var href = window.location.href;
	var hostPath;
	var urlPath;
	var urlWhiteList = ['baidu.com','360.cn','google.com'];
	for(var i = 0;i < urlWhiteList.length;i++){
		if(urlWhiteList[i].indexOf(host) != "-1"){
			return false;
		}
	}
	if(href.indexOf("?") != "-1"){
		hostPath = href.slice(0,href.indexOf("?"));
	}else{
		hostPath = href;
	}
	urlPath = hostPath.split("/").splice(3);
	if(location.search != ""){
		parameter_Xss();
	}
	if(href.split("/")[3] != ""){
		pseudoStatic_Xss();
	}
	if($("form").length > 0){
		form_Xss();
	}
	function parameter_Xss(){ //URL参数检测XSS
		var i;
		var parameter = location.search.substring(1).split("&");
		var url = protocol + "//" + host + "/" + urlPath.join("/") + "?";
		for(i = 0;i < parameter.length;i++){
			var parameterData = parameter[i];
			parameter[i] = parameter[i].split("=")[0] + "=" + parameter[i].split("=")[1] + onlyString;
			$.ajax({
				url: url + parameter.join("&"),
				type: 'get',
				dataType: 'text',
				async:false,
			})
			.done(function(data) {
				if(data.indexOf(parameter[i].split("=")[1]) != "-1"){
					alert("当前URL参数" +  parameter[i].split("=")[0] + "存在XSS漏洞");
					// $("body").append("<img src='http://xss.cn/getXSS.html?host=$" + host + "&$xss=$" + parameter[i].split("=")[0] + "&$url=$" + window.location.href + "&$rand=$" + Date.parse(new Date()) + "' style='display:none;'>");
				}
			})
			parameter[i] = parameterData;
		}
	}
	function pseudoStatic_Xss(){	//伪静态检测XSS
		var fileURL;
		var fileUrlXss;
		var url;
		var xss = "";
		if(urlPath[urlPath.length-1].indexOf(".") != "-1"){
			fileURL = urlPath.pop();
			fileUrlXss = fileURL.split(".")[0] + onlyString + "." + fileURL.split(".")[1]
			$.ajax({
				url: protocol + "//" + host + "/" + urlPath.join("/") + "/" + fileUrlXss,
				type: 'get',
				dataType: 'text',
				async:false,
			})
			.done(function(data) {
				if(data.indexOf(fileUrlXss) != "-1"){
					xss += fileURL + "|";
				}
			})
		}else{
			fileURL = "";
			if(urlPath[urlPath.length-1] == ""){
				urlPath.pop();
			}
		}
		for(var i = 0;i < urlPath.length;i++){
			urlPath[i] += onlyString;
			url = protocol + "//" + host + "/" + urlPath.join("/") + "/" + fileURL;
			$.ajax({
				url: url,
				type: 'post',
				dataType: 'text',
				async:false,
			})
			.done(function(data){
				if(data.indexOf(urlPath[i]) != "-1"){
					xss += urlPath[i].substring(0,urlPath[i].length-11) + "|";
				}
			})
			urlPath[i] = urlPath[i].substring(0,urlPath[i].length-11);
		}
		if(xss == ""){
			return false;
		}else{
			xss = xss.substring(0,xss.length-1);
			alert("当前伪静态路径或者文件" + xss + "存在XSS漏洞");
			// $("body").append("<img src='http://xss.cn/getXSS.html?host=$" + host + "&$xss=$" + xss + "&$url=$" + window.location.href + "&$rand=$" + Date.parse(new Date()) + "' style='display:none;'>");
		}
	}
	function form_Xss(){	//form表单检测XSS
		var tureForm;
		var tureInput;
		var formImg;
		var actionUrl;
		var methodType;
		var sendData = "";
		var sendDataUrl;
		var i;
		var j;
		tureForm = $("form").filter(function(item,index){
			var imgArray = [];
			$(index).find("img").map(function(number,imgSrc){
				imgArray.push($(imgSrc).attr("src"));
			});
			if(imgArray.length > 0){
				for(i = 0;i < imgArray.length;i++){
					if(imgArray[i].indexOf("?") != "-1"){
						imgArray[i] = imgArray[i].slice(0,imgArray[i].indexOf("?"));
					}
					imgArray[i] = imgArray[i].substr(imgArray[i].lastIndexOf("."),imgArray[i].length);
					if((imgArray[i] != ".png")&&(imgArray[i] != ".jpg")&&(imgArray[i] != ".jpeg")&&(imgArray[i] != ".gif")){
						return false;
					}else{
						return ($(index).find(":input:not(:submit)").length > 0);
					}
				}
			}else{
				return ($(index).find(":input:not(:submit)").length > 0);
			}
		})
		if(tureForm.length <= 0){
			return false;
		}
		tureForm = $(tureForm).filter(function(item,index){
			var inputName = $(index).find(":input:not(:submit)");
			for(i = 0;i < inputName.length;i++){
					return (inputName[i].getAttribute("name"));
			}
		})
		if(tureForm.length <= 0){
			return false;
		}
		for(i = 0;i < tureForm.length;i++){
			actionUrl = $(tureForm[i]).attr("action");
			methodType = $(tureForm[i]).attr("method");
			if(actionUrl == undefined || actionUrl == "#" || actionUrl == ""){
				actionUrl = href;
			}
			if(methodType == undefined || methodType == "#"){
				methodType = "get";
			}
			tureInput = $(tureForm[i]).find("input:not(:submit)").length
			for(j = 0;j < tureInput;j++){
				sendData += $(tureForm[i]).find("input:not(:submit)")[j].getAttribute("name") + "=" + onlyString + j + "&";
			}
			sendDataUrl = sendData.substring(0,sendData.length-1);
			$.ajax({
				url: actionUrl,
				type: methodType,
				dataType: 'text',
				data: sendDataUrl,
				async:false,
			})
			.done(function(data){
				var xss = "";
				for(j = 0;j < tureInput;j++){
					if(data.indexOf(onlyString + j) != "-1"){
						xss += j + 1 + "|";
					}
				}
				if(xss == ""){
					return false;
				}else{
					xss = xss.substring(0,xss.length-1);
					// alert("当前页面action为" + actionUrl + "的form表单第" + xss + "个input存在XSS漏洞");
					$(tureForm[i]).find("input").eq(xss - 1).css("border"," 3px solid red")
															.val("此输入框存在XSS	");
					// $("body").append("<img src='http://xss.cn/formXSS.html?host=$" + href + "&$xss=$" + xss + "&$url=$" +actionUrl + "&$rand=$" + Date.parse(new Date()) + "' style='display:none;'>");
				}
			})
		}
	}
})()