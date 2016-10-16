//tools 
function addClass(el,newClass) {
  var AClass = el.className.split(" ");
  for (var i in AClass) {
    if (AClass[i] === newClass) {
      return;
    }
  }
  AClass.push(newClass);
  el.className = AClass.join(" ");
}
function removeClass(el,rmClassName) {
  if (el.className !== undefined) {
    var AClass = el.className.split(" ");
    for (var i in AClass) {
      if(AClass[i] === rmClassName) {
        AClass.splice(i,1);
      }
    }
    el.className = AClass.join(" ");
  } else {
    return;
  } 
}
function addEventHandler(el,ev,handler) {
  if (el.addEventListener) {
    el.addEventListener(ev,handler,false);
  } else if (el.attachEvent){
    el.attachEvent("on"+ev,handler);
  } else {
    el["on" + ev] = handler;
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
  var chartWrap = document.getElementsByClassName('aqi-chart-wrap')[0];
  var graCity = pageState.nowSelectCity;
  var graTime = pageState.nowGraTime;

  var graData = chartData[graTime][graCity];

  var html = '';
  var style = 'style="height:{height};background-color:{color}" ';
  var divTitle = 'title="{time}的空气质量数值为 ：{data}"';
  var model = "<div " + style + divTitle +"></div>";

  for (var i in graData) {
    color = "#" + Math.random().toString(16).substring(2,8);
    html += model.replace('{height}',graData[i]+'px')
    .replace('{color}',color).replace('{time}',i)
    .replace('{data}',graData[i]);
  }
  chartWrap.innerHTML = html;

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

  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(e) {
  // 确定是否选项发生了变化 
  if (this.value === pageState.nowSelectCity) {
    return false;
  }

  // 设置对应数据
  pageState.nowSelectCity = this.value;

  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var timeSelect = document.getElementById('form-gra-time');
  var pageRadio = timeSelect.getElementsByTagName('input');
  for (var i = 0; i < pageRadio.length; i++) {
    addEventHandler(pageRadio[i],'click',graTimeChange);
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var citySelect = document.getElementById('city-select');
  var html = '';
  var option = "<option>{city}</option>";
  for (var i in aqiSourceData) {
    html += option.replace('{city}',i) + '<br />';
  }
  citySelect.innerHTML = html;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  addEventHandler(citySelect,'change',citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  var day = {};
  var week = {};
  var weekDays = 0; 
  var weekNum = 0;
  var weekTotal = 0; //一周空气指数总值
  var month = {};
  var monthDays = 0;
  var monthNum = 0;
  var monthTotal = 0; //一个月的空气指数总值
  for (var city in aqiSourceData) {
    var weekData = 0;
    var monthData = 0;
    var keyWeek = '';
    var keyMonth = '';
    day[city] = {};
    week[city] = {};
    month[city] = {};
    for (var date in aqiSourceData[city]) {
      var aqiData = aqiSourceData[city][date];
      //设置每一天的图表数据
      
      day[city][date] = aqiData;

      //设置每周的图表数据
      weekTotal += aqiData;
      weekDays++;
      if (new Date(date).getDay() === 6) {
        weekNum++;
        weekData = Math.ceil(weekTotal/weekDays);
        keyWeek = '第' + weekNum + '周';

        week[city][keyWeek] = weekData;

        weekTotal = 0;
        weekDays = 0;
      }

      //设置每月的图表数据
      monthTotal += aqiData;
      monthDays++;
      if (new Date(date).getMonth() !== monthNum) {
        monthNum++;
        monthData = Math.ceil(monthTotal/monthDays);
        keyMonth = monthNum + '月';
        month[city][keyMonth] = monthData;

        monthTotal = 0;
        monthDays = 0;
      }
    }
    //单独设置最后一周及最后一月
    if (weekDays !== 0) {
      weekNum++;
      keyWeek = '第' + weekNum + '周';
      week[city][keyWeek] = Math.ceil(weekTotal/weekDays);

      weekTotal = 0;
      weekDays = 0;
    }
    if (monthDays !== 0) {
      monthNum++;
      keyMonth = monthNum + '月';
      month[city][keyMonth] = Math.ceil(monthTotal/monthDays);

      monthTotal = 0;
      monthDays = 0;
    }
    //初始化周数和月数
    weekNum = 0;
    monthNum = 0;
  }
  // 处理好的数据存到 chartData 中
  chartData.day = day;
  chartData.week = week;
  chartData.month = month;
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm();
  initCitySelector();
  initAqiChartData();
  if (pageState.nowSelectCity === -1) {
    pageState.nowSelectCity = '北京';
    renderChart();
  }
}

init();
