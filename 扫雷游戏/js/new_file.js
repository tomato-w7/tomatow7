document.getElementById("target").on({
	touchstart: function(e) {
		// 长按事件触发    
		timeOutEvent = setTimeout(function() {
			timeOutEvent = 0;
			alert('你长按了');
		}, 400);
		//长按400毫秒     
		// e.preventDefault();      
	},
	touchmove: function() {
		clearTimeout(timeOutEvent);
		timeOutEvent = 0;
	},
	touchend: function() {
		clearTimeout(timeOutEvent);
		if (timeOutEvent != 0) {
			// 点击事件    
			// location.href = '/a/live-rooms.html';    
			alert('你点击了');
		}
		return false;
	}
})