/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};
var oTable = document.getElementById('aqi-table');

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var oCity = document.getElementById('aqi-city-input');
	var oValue = document.getElementById('aqi-value-input');
	var nullreg = /[(^\s+)($\s+)]/g;
	var numreg = /^[0-9]+$/;
	var alphareg = /^[\u4e00-\u9fa5A-z]+$/;
	var sCity = oCity.value.replace(nullreg,'');
	var sValue = oValue.value.replace(nullreg,'');

	if (!alphareg.test(sCity)) {
		alert('城市名必须为中英文字符！');
		return ;
	}
	if (!numreg.test(sValue)) {
		alert('空气质量指数必须为整数！');
		return ;
	} 
	aqiData[sCity] = sValue;
	oCity.value = '';
	oValue.value = '';
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var tr = '<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>';
	for (var i in aqiData) {
		tr += '<tr><td>'+i+'</td><td>'+aqiData[i]+'</td><td><button>删除</button></td>';
	}
	oTable.innerHTML = tr;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(oBtn) {
  // do sth.
  // oTable.tBodies[0].removeChild(oBtn.parentNode.parentNode);
  var oTr = oBtn.parentNode.parentNode;
  var sCity = oTr.childNodes[0].innerHTML;
  delete aqiData[sCity];
  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  var oBtn = document.getElementById("add-btn");
  oBtn.onclick = addBtnHandle;
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  oTable.addEventListener('click',function (e) {
  	if (e.target&&e.target.nodeName === 'BUTTON') {
  		delBtnHandle(e.target);
  	}
  });

}

init();
