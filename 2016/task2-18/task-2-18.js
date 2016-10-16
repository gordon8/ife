//获取按钮列表，为按钮绑定事件
//确定点击的是哪个按钮
/*如果是“左侧入”或“右侧入”，获取input的值，
*判断其是否为整数，若不是，警告请输入整数，若是，判断左，左侧入,判断右，右侧入,
*/
/*如果是“左侧出”或“右侧出”，获取container的值，
*判断其是否有div子集，若无，警告container为空，若有，判断左，左侧出,判断右，右侧出,
*/

//获取container,为container绑定事件
//判断点击目标，哪个被点击删除哪个

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
			var inputValue = this.buttonList[0].value;
			if (/^[0-9]+$/.test(inputValue)) {
				if (ev.target === this.buttonList[1]) {
					this.unshift(inputValue);
				} else {
					this.push(inputValue);
				}

			} else {
				alert('Please input a nonnegative integer!');
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
		}
	},
	unshift: function (value) {
		this.inputList.unshift(value);
		this.inner(this.inputList);
	},
	push: function (value) {
		this.inputList.push(value);
		this.inner(this.inputList);
	},
	shift: function () {
		alert(this.inputList[0]);
		this.inputList.shift();
		this.inner(this.inputList);
	},
	pop: function () {
		alert(this.inputList[this.inputList.length-1]);
		this.inputList.pop();
		this.inner(this.inputList);
	},
	inner: function (arr) {
		var html = '';
		for (var i = 0; i < arr.length; i++) {
			html += '<div data-index=' + i + '>' + arr[i] + '</div>';
		}
		this.container.innerHTML = html;
	},
	delete: function (ev) {
		var index = ev.target.getAttribute('data-index');
		this.inputList.splice(index, 1);
		this.inner(this.inputList);
	}
};

addInput.init();

