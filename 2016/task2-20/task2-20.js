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
		this.checkText = this.inputWrap.getElementsByTagName('input')[1];
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
		var re1 = /[^\dA-z\u3007\u4E00-\u9FCB\uE815-\uE864]+/g;
		var newInput = trimStr(this.textarea.value);
		if (newInput === "") {
			return false;
		}
		var newInputList = newInput.split(re1);
		//拼接数组
		this.inputList = this.inputList.concat(newInputList);
		this.textarea.value = "";
		this.render();
	},
	check: function () {
		var checkValue = trimStr(this.checkText.value);
		var newStr = this.inputList.join(';');
		var re1 = /<span>|<\/span>/g;
		newStr = newStr.replace(re1, '');
		//<span>checkValue</span>
		newStr = newStr.replace(new RegExp(checkValue, "g"), '<span>' + checkValue + '</span>');
		this.inputList = newStr.split(';');
		this.checkText.value = '';
		this.render();
	},
	render: function () {
		var arr = this.inputList;
		var html = '';
		for (var i = 0; i < arr.length; i++) {
			//<div>arr[i][/div]
			html +='<div>' + arr[i] + '</div>';
		}
		this.container.innerHTML = html;
	}
};
addCheck.init();