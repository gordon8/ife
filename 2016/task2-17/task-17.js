//Tools
//跨浏览器事件绑定
function addEventHandler(el, ev, handler) {
  if(el.addEventListener) {
    el.addEventListener(ev, handler, false);
  } else if (el.attachEvent){
    el.attachEvent('on'+ev, handler);
  } else {
    el['on'+ev] = handler;
  }
}

/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
};

/**
 * 渲染图表
 */
function renderChart() {
  //获取渲染图表区域
  var aqiChartWrap = document.getElementsByClassName('aqi-chart-wrap')[0];
  var color = '',text='';
  for (var key in chartData) {
    color = '#' + Math.random().toString(16).substring(2,8);
    text += '<div title="' + key + ':' + chartData[key] +'" style="height:' + chartData[key] + 'px; background-color:' + color +'"></div>';
  }

  aqiChartWrap.innerHTML = text;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(e) {
  // 确定是否选项发生了变化 
  if (e.target.value === pageState.nowGraTime) {
    return false;
  }
  // 设置对应数据
  pageState.nowGraTime = e.target.value;
  initAqiChartData();

  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  if (this.value === pageState.nowSelectCity) {
    return false;
  }
  // 设置对应数据
  pageState.nowSelectCity = this.value;
  initAqiChartData();

  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var formGraTime = document.getElementById('form-gra-time');
  addEventHandler(formGraTime,'click',graTimeChange);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var citySelect = document.getElementById('city-select');
  var cityList = {};
  for (var i in aqiSourceData) {
    cityList += '<option>' + i + '</option>';
  }
  citySelect.innerHTML = cityList;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  addEventHandler(citySelect,'change',citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var nowCityData = aqiSourceData[pageState.nowSelectCity];
  //nowCityData存储选定城市的2016-01-01~2016-03-31共计91天的aqi指数数组，key是日期，nowCityData[key]是该日aqi值
  
  //设置天
  if (pageState.nowGraTime === 'day') {
    chartData = nowCityData;
  }
  //设置周
  if (pageState.nowGraTime === 'week') {
    chartData = {};
    var aqiWeekSum = 0, dayWeekSum = 0, week = 0;
    for (var key in nowCityData) {
      aqiWeekSum += nowCityData[key];
      dayWeekSum++;
      if (new Date(key).getDay() === 6) {
        week++;
        chartData['第' + week + '周'] = Math.ceil(aqiWeekSum/dayWeekSum);
        aqiWeekSum = 0;
        dayWeekSum = 0;
      }
    }
    //确保最后一周不满七天也计算为一周
    if (dayWeekSum !== 0) {
      week++;
      chartData['第' + week + '周'] = Math.ceil(aqiWeekSum/dayWeekSum);
    }
  }
  //设置月
  if (pageState.nowGraTime === 'month') {
    chartData = {};
    var aqiMonthSum = 0, dayMonthSum = 0, month = 0;
    for (var item in nowCityData) {
      aqiMonthSum += nowCityData[item];
      dayMonthSum++;
      if (new Date(item).getMonth() !== month) {
        month++;
        chartData['第' + month + '月'] = Math.ceil(aqiMonthSum/dayMonthSum);
        aqiMonthSum = 0;
        dayMonthSum = 0;
      }  
    }
    //确保最后一个月也计算在内
    if(dayMonthSum !== 0) {
      month++;
      chartData['第' + month + '月'] = Math.ceil(aqiMonthSum/dayMonthSum);
    }
  }

}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm();
  initCitySelector();
  //开始时展示北京aqi
  if (pageState.nowSelectCity === -1) {
    pageState.nowSelectCity = '北京';
    initAqiChartData();
    renderChart();
  }

}

init();