//tools
function addEventHandler(el, ev, handler) {
	if (el.addEventListener) {
		el.addEventListener(ev, handler, false);
	} else if (el.attachEvent) {
		el.attachEvent('on' + ev, handler);
	} else {
		el['on' + ev] = handler;
	}
}
function trimStr(str) {
	return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

var addCheck = {
	init: function () {
		this.attach();
		this.bind();
	},
	attach: function () {
		this.inputWrap = document.getElementById('input-wrap');
		this.container = document.getElementById('container');
		this.textarea = this.inputWrap.getElementsByTagName('textarea')[0];
		this.submitBtn = this.inputWrap.getElementsByTagName('input')[0];
		this.checkValue = this.inputWrap.getElementsByTagName('input')[1];
		this.checkBtn = this.inputWrap.getElementsByTagName('input')[2];
		this.inputList = [];
	},
	bind: function () {
		var me = this;
		addEventHandler(this.submitBtn, 'click', function () {
			me.submit();
		});
		addEventHandler(this.checkBtn, 'click', function () {
			me.check();
		});
	},
	submit: function () {
		var re1 = /[^\dA-z\u3007\u4E00-\u9FCB\uE815-\uE864]+/;
		var newInput = trimStr(this.textarea.value);
		var newInputList = newInput.split(re1).filter(function (e) {
			if (e !== null && e.length > 0) {
				return true;
			} else {
				return false;
			}
		});
		//拼接数组
		this.inputList = this.inputList.concat(newInputList);
		this.textarea.value = "";
		this.render();
	},
	check: function () {
		var str = trimStr(this.checkValue.value);
		this.render(str);
	},
	render: function (str) {
		this.container.innerHTML = this.inputList.map(function (d) {
			if (str !== undefined && str.length > 0) {
				d = d.replace(new RegExp(str, 'g'), "<span>" + str + "</span>");
			}
			return '<div>' + d + '</div>';
		}).join('');
	}
};
addCheck.init();