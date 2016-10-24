//事件绑定函数，浏览器兼容
function addEventHandler(el, ev, handler) {
	if (el.addEventListener) {
		el.addEventListener(ev, handler, false);
	} else if (el.attachEvent) {
		el.attachEvent('on' + ev, handler);
	} else {
		el['on' + ev] = handler;
	}
}

var addInput = {
	init: function () {
		this.attach();
		this.bind();
	},
	attach: function () {
		this.inputWrap = document.getElementById('input-wrap');
		this.buttonList = this.inputWrap.getElementsByTagName('input');
		this.container = document.getElementById('container');
		this.inputDivs = container.getElementsByTagName('div');
		this.inputList = [];
	},
	bind: function () {
		var me = this;
		addEventHandler(this.inputWrap,'click',function (ev) {
			me.judge(ev);
		});
		addEventHandler(this.container,'click',function (ev) {
			me.delete(ev);
		});
	},
	judge: function (ev) {
		if (ev.target === this.buttonList[1] || ev.target === this.buttonList[2]) {
			var inputValue = parseInt(this.buttonList[0].value.replace(/\D/g,""),10);
			if (inputValue > 100 || inputValue < 10) {
				alert("请输入10-100的整数");
				return false;
			} else {
				if (ev.target === this.buttonList[1]) {
					this.unshift(inputValue);
				} else {
					this.push(inputValue);
				}
			}
		} else if (ev.target === this.buttonList[3] || ev.target === this.buttonList[4]) {
			var divsNum = this.inputDivs.length;
			if (divsNum > 0) {
				if (ev.target === this.buttonList[3]) {
					this.shift();
				} else {
					this.pop();
				}
			} else {
				alert('This container is empty!');
			}
		} else if (ev.target === this.buttonList[5]) {
			this.sortBubble();
		} else if (ev.target === this.buttonList[6]) {
			this.random();
		}
	},
	unshift: function (value) {
		this.inputList.unshift(value);
		this.render();
	},
	push: function (value) {
		this.inputList.push(value);
		this.render();
	},
	shift: function () {
		alert(this.inputList[0]);
		this.inputList.shift();
		this.render();
	},
	pop: function () {
		alert(this.inputList[this.inputList.length-1]);
		this.inputList.pop();
		this.render();
	},
	random: function () {
		this.inputList = [];
		for (var i = 0; i < 50; i++) {
			this.inputList[i] = Math.floor(Math.random()*91)+10;
		}
		this.render();
	},
	render: function () {
		var html = '';
		var arr = this.inputList;
		if (arr.length > 60) {
			alert('已经够多了，最多输入60个');
			return false;
		}
		for (var i = 0; i < arr.length; i++) {
			//<div style="height: 200px" title="40" data-index=1></div>
			html += '<div style="height: ' + arr[i]*5 + 'px" title="' + arr[i] +'" data-index=' + i +'></div>';
		}
		this.container.innerHTML = html;
	},
	delete: function (ev) {
		var index = ev.target.getAttribute('data-index');
		if (index === null) {
			return false;
		}
		this.inputList.splice(index, 1);
		this.render();
	},
	sortBubble: function () {
		var me = this, i = 0, j = 1, temp, len = this.inputList.length, timer = null;
		timer = setInterval(function () {
			if (i < len) {
				if (j < len) {
					if (me.inputList[i] > me.inputList[j]) {
						temp = me.inputList[i];
						me.inputList[i] = me.inputList[j];
						me.inputList[j] = temp;
						me.render();
					}
					j++;
				} else {
					i++;
					j = i + 1;
				}
			} else {
				clearInterval(timer);
				return;
			}
		},10);
	}
};

addInput.init();