outerFor:
for(var i = 0;i < $("form").length;i++){
	var formDom = $("form").eq(i);
	var imageFileSuffix = ['.jpg','.png','.jpge','.ico','.gif','.bmp'];
	var placeholderFilterKeyword = ['跳','搜','查','找','登陆','注册','search'];
	var actionFilterKeyword = ['search','find','login','reg',"baidu.com","google.com","so.com","bing.com","soso.com","sogou.com"];
	var actionCache,actionPath;
	var actionvParameter = "";
	var ajaxParameter = "";
	//去除类似搜索、页面跳转等无用的form表单
	if(formDom.attr("action") != undefined){
		var actionCheck = actionFilterKeyword.some(function(item,index){
			return (formDom.attr("action").toLowerCase().indexOf(item)  != "-1");
		})
		if(actionCheck){
			continue;
		}
	}else{
		continue;
	}
	for(var x = 0;x < formDom.find(":text").length;x++){
		var inputTextCheck;
		var inputText =  formDom.find(":text").eq(x);
		if(inputText.attr("placeholder") == undefined){
			continue;
		}
		inputTextCheck = placeholderFilterKeyword.some(function(item,index){
			return (inputText.attr("placeholder").toLowerCase().indexOf(item)  != "-1");
		})
		if(inputTextCheck){
			continue outerFor;
		}
	}
	//去除没有提交按钮的form表单
	if(formDom.find(":submit").length < 1){
		continue outerFor;
	}
	//去除具有token的form表单
	var iframe = document.createElement('iframe');
	$("html").append("<iframe id='tokenCheck' src='about:blank' style='display:none;'></iframe>");
	$.ajax({
		url: location.href,
		type: 'get',
		dataType: 'html',
		async:false,
	})
	.done(function(data){
		$("#tokenCheck").contents().find("body").html($(data).find("form"));
	})
	if(formDom.find(":hidden").length > 0){
    	for(var j = 0;j < formDom.find(":hidden").length;j++){
			var tokenInputValue = formDom.find(":hidden").eq(j).val();
			if($($("#tokenCheck").contents()['context']['forms'][i]).find(":hidden").eq(j).val() != tokenInputValue){
				continue outerFor;
			}
		}
	}
	//去除带有验证码的form表单
	if(formDom.find("img").length > 0){
		var imageCheck;
		for(var z = 0;z < formDom.find("img").length;z++){
			var img = formDom.find("img").eq(z);
			var imgSrc = img.attr("src")
			if(!!imgSrc){
				if(imgSrc.indexOf("?") != "-1"){
					imgSrc = imgSrc.slice(0,imgSrc.indexOf("?"));
				}
		        imgSrc = imgSrc.substr(imgSrc.lastIndexOf("."),imgSrc.length);
		        imageCheck = imageFileSuffix.some(function(item,index){
		        	return (imgSrc == item);
		        })
		        if(!imageCheck){
		        	continue outerFor;
		        }
			}
		}
	}
	//去除“检测对方开启了Referer检测机制”的form表单
	actionCache = formDom.attr("action");
	switch(actionCache[0]){
		case "#":
			actionPath = location.href + actionCache;
			break;
		case "/":
			actionPath = location.origin + actionCache;
			break;
		case ".":
			if(actionCache.indexOf("?") != "-1"){
				actionvParameter = "?" + actionCache.split("?")[1];
				actionCache = actionCache.slice(0,actionCache.indexOf("?"));
			}
			if(location.href.split("/").pop().split(".").length == 1){
				actionPath = location.href + actionCache.substr(1,actionCache.length-1) + actionvParameter;
			}else{
				actionPath = location.href.substr(location.href,location.href.lastIndexOf(location.href.split("/").pop())) + actionCache.substring(1,actionCache.length) + actionvParameter;
			}
			break;
		default:
			if(location.protocol == "http:" || location.protocol == "https:"){
				actionPath = location.href;
				break;
			}
			if(location.href.split("/").pop().split(".").length == 1){
				actionPath = location.href + "/" + actionCache;
			}else{
				actionPath = location.href.substr(location.href,location.href.lastIndexOf(location.href.split("/").pop())) + actionCache;
			}
			break;
	}
	for(var v = 0;v < formDom.find(":text").length;v++){
		var input = formDom.find(":text").eq(v);
		if(input.attr("name") != ""){
			if(input.val() == ""){
				ajaxParameter += input.attr("name") + "=" + "15874583485&";
			}else{
				ajaxParameter += input.attr("name") + "=" + input.val() + "&";
			}
		}else{
			continue;
		}
	}
	ajaxParameter = ajaxParameter.substring(0,ajaxParameter.length-1)
	$.ajax({
		url: actionPath,
		type: (formDom.attr("method") == undefined)?'get':'post',
		dataType: 'html',
		data: (formDom.attr("method") == undefined) || (formDom.attr("method") == 'get')?'':ajaxParameter,
		async: false,
	})
	.done(function(data){
		var firstAjax = data.length;
		var formCache = formDom;
		chrome.runtime.sendMessage({action: actionPath, parameter: (formDom.attr("method") == undefined) || (formDom.attr("method") == 'get')?'':ajaxParameter},function (response) {
			if(Math.abs(firstAjax - response.status) < 10){
				formCache.attr("style","border: 1px red solid;")
			}
		});
	})
}