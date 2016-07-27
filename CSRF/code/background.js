chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	$.ajax({
		url: message.action,
		type: (message.parameter == "")?'get':'post',
		dataType: 'html',
		data: (message.parameter == "")?'':message.parameter,
		async: false,
	})
	.done(function(data) {
		sendResponse({status: data.length})
	})
})