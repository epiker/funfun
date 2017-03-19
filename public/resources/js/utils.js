/*!
 * Base JavaScript Library v1.2
 *
 * includes: all of other libraries
 * Copyright 2014, http://www.dlshouwen.com
 * Date: 2013-3-6 16:38:51
 */

/**
 * 背景浮动
 * @param {String} isBackgroundFloat 是否背景浮动 0-不浮动 1-浮动
 * @param {Number} backgroundFloatSpeed 背景浮动速度，p/s（像素/秒）
 * @example backgroundFloat('1', 5);
 */
function backgroundFloat(isBackgroundFloat, backgroundFloatSpeed){
	if(isBackgroundFloat=='0'){
		return;
	}
	//获取背景图
	var src = $('body').css('background-image').replace('url(', '').replace(')', '').replace('"', '').replace('"', '');
	//背景图片为空则返回
	if(src==null||src==''){
		return;
	}
	//获取图片大小
	$('body').append('<img id="background_float_temp_image" style="position:absolute;top:-100000px;left:0;" />');
	$("#background_float_temp_image").attr("src", src).load(function() {
		//定义背景真实宽度、高度
		var backgroundFloatImageWidth = this.width;
		var backgroundFloatImageHeight = this.height;
		$('#background_float_temp_image').remove();
		//获取窗口大小
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		//获取当前背景图片位置
		var nowPositionX = $('body').css('background-position-x').replace('px', '');
		var nowPositionY = $('body').css('background-position-y').replace('px', '');
		//获取散点范围
		var xRange = backgroundFloatImageWidth - windowWidth;
		var yRange = backgroundFloatImageHeight - windowHeight;
		//如果没有范围则返回
		if(xRange<=0||yRange<=0){
			return;
		}
		//处理散点
		var x = Math.random()*xRange;
		var y = Math.random()*yRange;
		//获取距离
		var xl = Math.abs(x) - Math.abs(nowPositionX);
		var yl = Math.abs(y) - Math.abs(nowPositionY);
		var l = Math.sqrt(xl*xl+yl*yl);
		//获取时间
		var time = l/parseInt(backgroundFloatSpeed)*1000;
		//执行漂移
		$('body').animate({
			'background-position-x' : Math.abs(x)*(-1),
			'background-position-y' : Math.abs(y)*(-1)
		}, time, 'linear', function(){
			backgroundFloat(isBackgroundFloat, backgroundFloatSpeed);
		});
	});
}

/**
 * 从form中取得元素值封装为参数对象
 * @param {Object} formObject form对象
 * @returns {Object} 参数对象
 * @example var params = getFormParams(document.forms[0]);
 */
function getFormParams(formObject){
	var elements = formObject.elements;
	var params = new Object();
	for(var i=0; i<elements.length; i++){
		var element = elements[i];
		if(element.type.equalsIgnoreCase('text') || element.type.equalsIgnoreCase('hidden') 
			|| element.type.equalsIgnoreCase('textarea') || element.type.equalsIgnoreCase('select-one') 
			|| element.type.equalsIgnoreCase('password')){
			if (element.name != undefined){
				params[element.name] = element.value;
			}
		}else if ((element.type.equalsIgnoreCase('checkbox') || element.type.equalsIgnoreCase('radio')) && element.checked){
			if (element.name != undefined){
				params[element.name] = element.value;
			}
		}
	}
	return params;
}

/**
 * 数字格式化函数[#,0格式]
 * @param {Number} number 要格式化的数字
 * @param {String} pattern 要格式化的格式，支持#、0、,、.等符号
 * @returns {String} 格式化后的字符串
 * @example var n = formatNumber(12138.66, '#,##0.00');
 */
function formatNumber(number, pattern){
	var negFlag = 'false';
	var str = Number(number).toString();
	if (str.indexOf('-')==0){
		negFlag = 'true';
		str = str.replace('-', '');
		number = -number;
	}
	var strInt;
	var strFloat;
	var formatInt;
	var formatFloat;
	if(str=='')
		return '';
	//判断模式串是否有小数格式
	if(/\./g.test(pattern)){
		formatInt = pattern.split('.')[0];
		formatFloat = pattern.split('.')[1];
	}else{
		formatInt = pattern;
		formatFloat = null;
	}
	if(/\./g.test(str)){
		//如果字符串有小数
		if(formatFloat!=null){
			var tempFloat = Math.round(parseFloat('0.'+str.split('.')[1])*Math.pow(10,formatFloat.length))/Math.pow(10,formatFloat.length);
			strInt = (Math.floor(number)+Math.floor(tempFloat)).toString();
			strFloat = /\./g.test(tempFloat.toString())?tempFloat.toString().split('.')[1]:'0';
		}else{
			strInt = Math.round(number).toString();
			strFloat = '0';
		}
	}else{
		strInt = str;
		strFloat = '0';
	}
	//处理整数数位的格式化
	if(formatInt!=null){
		var outputInt = '';
		var zero = formatInt.match(/0*$/)[0].length;
		var comma = null;
		if(/,/g.test(formatInt)){
			comma = formatInt.match(/,[^,]*/)[0].length-1;
		}
		var newReg = new RegExp('(\\d{'+comma+'})','g');
		if(strInt.length<zero){
			outputInt = new Array(zero+1).join('0')+strInt;
			outputInt = outputInt.substr(outputInt.length-zero,zero);
		}else{
			outputInt = strInt;
		}
		outputInt = outputInt.substr(0,outputInt.length%comma)+outputInt.substring(outputInt.length%comma).replace(newReg,(comma!=null?',':'')+'$1');
		outputInt = outputInt.replace(/^,/,'');
		strInt = outputInt;
	}
	//处理小数位的格式化
	if(formatFloat!=null){
		var outputFloat = '';
		var zero = formatFloat.match(/^0*/)[0].length;
		if(strFloat.length<zero){
			outputFloat = strFloat+new Array(zero+1).join('0');
			var outputFloat1 = outputFloat.substring(0,zero);
			var outputFloat2 = outputFloat.substring(zero,formatFloat.length);
			outputFloat = outputFloat1+outputFloat2.replace(/0*$/,'');
		}else{
			//如果小数是0，而且模式串的小数格式中也不包含0，则只保留整数部分。
			if(strFloat==0&&zero==0)
				outputFloat = '';
			else
			outputFloat = strFloat.substring(0,formatFloat.length);
		}
		strFloat = outputFloat;
	}else{
		if(pattern!='' || (pattern=='' && strFloat=='0'))
			strFloat = '';
	}
	if(negFlag == 'true')
		return '-' + strInt+(strFloat==''?'':'.'+strFloat);
	else
		return strInt+(strFloat==''?'':'.'+strFloat);
}

/**
 * 获取文件大小
 * @param {int} value 文件大小原值，单位为B
 * @returns {String} 文件大小，包含单位，B、KB、MB、GB等
 * @example var fileSize = getFileSize(12138);
 */
function getFileSize(value){
	if (value === 0)
		return '0 B';
	var k = 1000,
		sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
		i = Math.floor(Math.log(value) / Math.log(k));
	return (value / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

/**
 * 获取文件类型图标
 * @param {String} fileType 文件类型
 * @returns {String} Font Awesome对应图标字符
 * @example var fileTypeIcon = getFileTypeIcon('rar');
 */
function getFileTypeIcon(fileType){
	var types = [
	             ['rar', 'zip', 'tar', 'taz', 'tbz', 'tbz2', 'tgz', 'cab', 'uue', 'jar', 'iso', 'z', '7-zip', 'ace', 'lzh', 'arj', 'gzip', 'bz2'],
	             ['jpg', 'gif', 'png', 'bmp', 'jpeg', 'tif', 'tiff', 'ico', 'psd'],
	             ['wav', 'mp3', 'midi', 'mid', 'mmf', 'wma', 'amr', 'aac'],
	             ['3gp', 'asf', 'avi', 'flv', 'mkv', 'mov', 'mp4', 'mpeg', 'aspx', 'navi', 'rmvb', 'wmv', 'swf', 'rm'],
	             ['txt'],
	             ['html', 'htm', 'css', 'js', 'c', 'java', 'jsp', 'asp', 'aspx', 'php', 'xml', 'tld', 'sql', 'vbs', 'bat'],
	             ['doc', 'docx'],
	             ['xls', 'xlsx'],
	             ['ppt', 'pptx'],
	             ['pdf']
	             ];
	for(var i=0; i<types.length; i++){
		for(j=0; j<types[i].length; j++){
			if(fileType.equalsIgnoreCase(types[i][j])){
				if(i==0) return 'file-archive-o';
				if(i==1) return 'file-image-o';
				if(i==2) return 'file-audio-o';
				if(i==3) return 'file-movie-o';
				if(i==4) return 'file-text-o';
				if(i==5) return 'file-code-o';
				if(i==6) return 'file-word-o';
				if(i==7) return 'file-excel-o';
				if(i==8) return 'file-powerpoint-o';
				if(i==9) return 'file-pdf-o';
			}
		}
	}
	return 'file-o';
}

/**
 * HTML转义
 * @param {String} str 待转义的字符串
 * @returns {String} 转义后的字符串
 * @example var he = htmlEncode('<div>dlshouwen</div>');
 */
function htmlEncode(str) {
	var s = '';
	if (!str||str.length == 0) return '';
	s = str.replace(/&/g, '&amp;');
	s = s.replace(/</g, '&lt;');
	s = s.replace(/>/g, '&gt;');
	s = s.replace(/ /g, '&nbsp;');
	s = s.replace(/\'/g, '&#39;');
	s = s.replace(/\'/g, '&quot;');
	s = s.replace(/\n/g, '<br>');
	return s;
}

/**
 * HTML反转义
 * @param {String} str 待反转义的字符串
 * @returns {String} 反转义后的字符串
 * @example var he = htmlDecode('&gt;');
 */
function htmlDecode(str) {
	var s = '';
	if (!str||str.length == 0) return '';
	s = str.replace(/&amp;/g, '&');
	s = s.replace(/&lt;/g, '<');
	s = s.replace(/&gt;/g, '>');
	s = s.replace(/&nbsp;/g, ' ');
	s = s.replace(/&#39;/g, '\'');
	s = s.replace(/&quot;/g, '\'');
	s = s.replace(/<br>/g, '\n');
	return s;
}

/**
 * 日期对象格式化方法
 * @param {String} format 日期格式：y-年、M-月、d-日、h-时、m-分、s-秒、S-毫秒
 * @returns {String} 格式化后的日期字符串
 * @example var d = new Date().format('yyyy-MM-dd hh:mm:ss S');
 */
Date.prototype.format = function(format){
	var o = {
		'M+' : this.getMonth()+1,
		'd+' : this.getDate(),
		'h+' : this.getHours(),
		'm+' : this.getMinutes(),
		's+' : this.getSeconds(),
		'q+' : Math.floor((this.getMonth()+3)/3),
		'S' : this.getMilliseconds()
	};
	if(/(y+)/.test(format)) format=format.replace(RegExp.$1, (this.getFullYear()+'').substr(4 - RegExp.$1.length));
	for(var k in o)if(new RegExp('('+ k +')').test(format))
		format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ('00'+ o[k]).substr((''+ o[k]).length));
	return format;
};

/**
 * 取得两个日期相差的天数，date1-date2
 * @param {String} date1 日期字符串，格式：yyyy{任意字符}MM{任意字符}dd
 * @param {String} date2 日期字符串，格式：yyyy{任意字符}MM{任意字符}dd
 * @returns {int} 相差天数
 * @example var dd = getDateDiff('2015-10-01', '2015-09-18');
 */
function getDateDiff(date1, date2){
	var re = /^(\d{4})\S(\d{1,2})\S(\d{1,2})$/;
	var dt1 = 0;
	var dt2 = 0;
	if(re.test(date1))
		dt1 = new Date(RegExp.$1,RegExp.$2 - 1,RegExp.$3);
	if(re.test(date2))
		dt2 = new Date(RegExp.$1,RegExp.$2 - 1,RegExp.$3);
	return Math.floor((dt1-dt2)/(1000 * 60 * 60 * 24));
};

/**
 * 字符串不区分大小写的比较
 * @param {String} str 被比较的字符串
 * @returns {Boolean} 比较结果
 * @example var isEquals = 'dlshouwen'.equalsIgnoreCase('DLSHOUWEN');
 */
String.prototype.equalsIgnoreCase = function(str){
	return (new String(this.toLowerCase())==(new String(str)).toLowerCase());
};

/**
 * 取得字符串的长度，双字节按照两个长度计算
 * @returns {int} 字符串长度
 * @example var length = '大连首闻科技有限公司'.lengthb();
 */
String.prototype.lengthb = function(){
	return this.replace(/[^\x00-\xff]/g, '**').length;
};

/**
 * 字符串比较
 * @param {String} str 被比较的字符串
 * @returns {Boolean} 比较结果
 * @example var isEquals = 'dlshouwen'.equals('dlshouwen');
 */
String.prototype.equals = function(str){
	return (this.toString()==str.toString());
};

/**
 * 去掉字符串两边的空格
 * @returns {String} 去掉两边空格后的字符串
 * @example var str = '  dlshouwen  '.trim();
 */
String.prototype.trim = function(){
	return this.replace(/^\s+|\s+$/g, '');
};

/**
 * 去掉字符串左边的空格
 * @returns {String} 去掉左边空格后的字符串
 * @example var str = '  dlshouwen  '.ltrim();
 */
String.prototype.ltrim = function(){
	return this.replace(/^\s+/, '');
};

/**
 * 去掉字符串右边的空格
 * @returns {String} 去掉右边空格后的字符串
 * @example var str = '  dlshouwen  '.rtrim();
 */
String.prototype.rtrim = function(){
	return this.replace(/\s+$/, '');
};

/**
 * 判断字符串是否从offset位置开始以prefix开头
 * @param {String} prefix 进行匹配的前缀字符
 * @param {int} offset 开始匹配的位置，默认为0
 * @returns {Boolean} 是否从offset位置开始以prefix开头
 * @example var isStart = '大连首闻科技有限公司'.startsWith('首闻', 2);
 */
String.prototype.startsWith = function(prefix, offset){
	if(offset==undefined)
		offset=0;
	if(prefix==undefined)
		return false;
	if(this.indexOf(prefix)==offset){
		return true;
	}
	return false;
};

/**
 * 把字符串转换为Date对象，字符串的格式：yyyy-MM-dd或yyyy/MM/dd
 * @returns {Date} 转换后的Date对象
 * @example var d = '2015-01-01'.toDate();
 */
String.prototype.toDate = function(){
	return new Date(Date.parse(this.replace(/-/g, '/')));
};

/**
 * 判断字符串是否以suffix结束
 * @param {String} suffix 后缀字符串
 * @reruans {Booolean} 是否以suffix结束
 * @example var isEnd = '大连首闻科技有限公司'.endsWith('公司');
 */
String.prototype.endsWith = function(suffix){
	if(suffix==undefined)
		return false;
	if(this.lastIndexOf(suffix)==this.length-suffix.length)
		return true;
	return false;
};

/**
 * 把字符串中的s1替换为s2
 * @param {String} s1 匹配的字符串
 * @param {String} s2 替换为的字符串
 * @returns {String} 替换后的字符串
 * @example var isEnd = 'dlshouwen'.replaceAll('l', 'o');
 */
String.prototype.replaceAll = function(s1, s2){
	return this.replace(new RegExp(s1, 'gm'),s2);
};

/**
 * 判断字符串是否是整型字符串
 * @returns {Boolean} 是否是整型字符串
 * @example var isInt = '12138'.isInt();
 */
String.prototype.isInt = function(){
	return /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/.test(this);
};

/**
 * 判断字符串是否是浮点型字符串
 * @returns {Boolean} 是否是浮点型字符串
 * @example var isDouble = '12138.66'.isDouble();
 */
String.prototype.isDouble = function(){
	return /^[-\+]?\d+(\.\d+)?$/.test(this);
};

/**
 * 判断字符串是否是数字，不包含-和.
 * @returns {Boolean} 是否是数字
 * @example var isNumber = '0012138'.isNumber();
 */
String.prototype.isNumber = function(){
	return /^\d+$/.test(this);
};

/**
 * 判断字符串是否是纯英文
 * @returns {Boolean} 是否是纯英文
 * @example var isOnlyEnglish = 'dlshouwen'.isOnlyEnglish();
 */
String.prototype.isOnlyEnglish = function(){
	return /^[A-Za-z]+$/.test(this);
};

/**
 * 判断字符串是否是纯中文
 * @returns {Boolean} 是否是纯中文
 * @example var isOnlyChinese = '大连首闻科技有限公司'.isOnlyChinese();
 */
String.prototype.isOnlyChinese = function(){
	return /^[\u0391-\uFFE5]+$/.test(this);
};

/**
 * 判断字符串是否是空字符串
 * @returns {Boolean} 是否空字符串
 * @example var isEmpty = ''.isEmpty();
 */
String.prototype.isEmpty = function(){
	var tp = this.trim();
	if(tp == '')
		return true;
	else
		return false;
};

/**
 * 把半角字符转换为全角字符
 * @returns {String} 转换为全角的字符串
 * @example var s = '[]\\{}|:";\'<>?,./'.toCase();
 */
String.prototype.toCase = function(){
	var tmp = '';
	for(var i=0;i<this.length;i++){
		if(this.charCodeAt(i)>0&&this.charCodeAt(i)<255)
			tmp += String.fromCharCode(this.charCodeAt(i)+65248);
		else
			tmp += String.fromCharCode(this.charCodeAt(i));
	}
	return tmp;
};

/**
 * 判断字符串是否是日期格式，格式：yyyy-MM-dd、yyyy/MM/dd、yyyy-MM-dd hh:mm:ss、yyyy/MM/dd hh:mm:ss
 * @returns {Boolean} 否是日期格式
 * @example var isDate = '2014-10-01'.isDate();
 */
String.prototype.isDate = function(){
	return this.isLongDate()||this.isShortDate();
};

/**
 * 判断字符串是否是短日期格式：格式：yyyy-MM-dd、yyyy/MM/dd
 * @returns {Boolean} 否是短日期格式
 * @example var isShortDate = '2014-10-01'.isShortDate();
 */
String.prototype.isShortDate = function(){
	var r = this.replace(/(^\s*)|(\s*$)/g, '').match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
	if(r==null)
		return false;
	var d = new Date(r[1], r[3]-1, r[4]);
	return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
};

/**
 * 判断字符串是否是长日期格式：格式：yyyy-MM-dd hh:mm:ss、yyyy/MM/dd hh:mm:ss
 * @returns {Boolean} 否是长日期格式
 * @example var isLongDate = '2014-10-01 10:10:10'.isLongDate();
 */
String.prototype.isLongDate = function(){
	var r = this.replace(/(^\s*)|(\s*$)/g, '').match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
	if(r==null)
		return false;
	var d = new Date(r[1], r[3]-1, r[4], r[5], r[6], r[7]);
	return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]&&d.getHours()==r[5]&&d.getMinutes()==r[6]&&d.getSeconds()==r[7]);
};

/**
 * 判断字符串是否是ip地址
 * @returns {Boolean} 是否是ip地址
 * @example var isIP = '192.168.1.1'.isIP();
 */
String.prototype.isIP = function(){
	var reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
	if (reSpaceCheck.test(this)) {
		this.match(reSpaceCheck);
		if (RegExp.$1 <= 255 && RegExp.$1 >= 0 && RegExp.$2 <= 255 && RegExp.$2 >= 0
			&& RegExp.$3 <= 255 && RegExp.$3 >= 0 && RegExp.$4 <= 255 && RegExp.$4 >= 0)
			return true;
		else
		return false;
	} else {
		return false;
	}
};

/**
 * 得到左边的字符串
 * @param {int} length 截取长度
 * @returns {String} 截取后的字符串
 * @example var s = 'dlshouwen'.left(2);
 */
String.prototype.left = function(length){
	if(isNaN(length)||length==null)
		length = this.length;
	else
		if(parseInt(length)<0||parseInt(length)>this.length)
			length = this.length;
	return this.substr(0, length);
};

/**
 * 得到右边的字符串
 * @param {int} length 截取长度
 * @returns {String} 截取后的字符串
 * @example var s = 'dlshouwen'.right(7);
 */
String.prototype.right = function(length){
	if(isNaN(length)||length==null)
		length = this.length;
	else
		if(parseInt(length)<0||parseInt(length)>this.length)
			length = this.length;
	return this.substring(this.length-length, this.length);
}