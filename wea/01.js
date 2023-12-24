//获取元素




function getList(cityName) {
	ajax({
		url: "https://api.oioweb.cn/api/weather/weather?city_name=" + cityName,
		success: (weatherData) => {
			var listdata = weatherData
			render(listdata)
			//更新三日天气
			renderDays(listdata)

		},
		error: function() {
			alert("请输入正确的城市名称")
		}
	})


}
getList("佳木斯")
//天气图片
var weather = {
	rain: "./weaImg/rain.png",
	cloud: "./weaImg/cloud.png",
	snow: "./weaImg/snow.png",
	sun: "./weaImg/sun.png"
}
var isimg = document.querySelectorAll('img')
// console.log(isimg);
var onetext = document.querySelector('.todytext')
var twotext = document.querySelector('.tomorrowtext')
var lasttext = document.querySelector('.lastDaytext')
var todytem = document.querySelector('.todytem')
var tomorrowtem = document.querySelector('.tomorrowtem')
var lastDaytem = document.querySelector('.lastDaytem')
//渲染三日天气
function renderDays(data) {
	// console.log(data);
	today = data.result
	// console.log(today);
	var tomorrow = data.result.forecast_list[2]
	var lastdays = data.result.forecast_list[3]
	// console.log(tomorrow, lastdays);
	//渲染页面
	//今天
	rendertoday(today, isimg[1], onetext, todytem)
	//明天后天
	renderpage(tomorrow, isimg[2], twotext, tomorrowtem)
	renderpage(lastdays, isimg[3], lasttext, lastDaytem)
}


function rendertoday(idName, myimg, mytext, mytem) {
	// console.log(idName);
	var condto = idName.day_condition
	var Htems = idName.dat_high_temperature
	var Ltems = idName.dat_low_temperature
	console.log(condto);
	if (condto == "晴转阴" || condto == "多云转晴" || condto == "多云" || condto == "阴") {
		myimg.src = weather.cloud
	}
	if (condto == "晴") {
		myimg.src = weather.sun
	}
	if (condto.indexOf("雪") != -1) {
		myimg.src = weather.snow
	}
	if (condto.indexOf("雨") != -1) {
		myimg.src = weather.rain
	}
	mytext.innerHTML = condto
	mytem.innerHTML = Ltems + "℃" + '~' + Htems + "℃"
}

function renderpage(idName, myimg, mytext, mytem) {

	var cond = idName.condition
	// console.log(cond);
	var Htem = idName.high_temperature
	var Ltem = idName.low_temperature
	// console.log(Htem, Ltem);
	if (cond == "晴转阴" || cond == "多云转晴" || cond == "多云" || cond == "阴") {
		myimg.src = weather.cloud
	}
	if (cond == "晴") {
		myimg.src = weather.sun
	}
	if (cond.indexOf("雪") != -1) {
		myimg.src = weather.snow
	}
	if (cond.indexOf("雨") != -1) {
		myimg.src = weather.rain
	}
	mytext.innerHTML = cond
	mytem.innerHTML = Ltem + "℃" + '~' + Htem + "℃"

}
var airtext = document.querySelector('.airtext')
//渲染主温度
function render(data) {
	var datalist = data
	var airnum = datalist.result.tomorrow_aqi
	var airtexts = datalist.result.tomorrow_quality_level
	// console.log(airnum, airtexts);
	airtext.innerHTML = airnum + '空气' + airtexts
	document.querySelector('.cityName').innerHTML = datalist.result.city_name
	document.querySelector('.temNum').innerHTML = datalist.result.current_temperature
	document.querySelector('.temCondition').innerHTML = datalist.result.current_condition
	document.querySelector('.newDate').innerHTML = timestampToTime(datalist.result.current_time * 1000)
}

function timestampToTime(timestamp) {
	timestamp = timestamp ? timestamp : null;
	let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let Y = date.getFullYear() + '-';
	let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
	return Y + M + D + h + m + s;
}


var btn = document.querySelector('.cityName')
btn.onclick = function() {
	// console.log(11);
	document.querySelector('.inputName').style.display = "block"
	var timer = setInterval(function() {
		console.log(2222);
		document.querySelector('.inputbox').value = ''
		clearInterval(timer)
	}, 1000)


}
document.querySelector('.btnName').onclick = function() {
	var tete = document.querySelector('.inputbox').value
	// console.log(tete);


	getList(tete)
	document.querySelector('.inputName').style.display = "none"
}