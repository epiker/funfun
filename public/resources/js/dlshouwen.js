/*!
 * Base JavaScript Library v1.2
 *
 * includes: all of other libraries
 * Copyright 2014, http://www.dlshouwen.com
 * Date: 2013-3-6 16:38:51
 */

/** 实例化DLShouWen对象 */
var sw = new DLShouWen();

/** 定义DLShouWen对象为方法体，用于实例化 */
function DLShouWen(){}

/**
 * 获取GUID
 * @returns {String} GUID
 * @example var guid = sw.guid();
 */
DLShouWen.prototype.guid = function(){
	return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    	var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
	});
};

/**
 * 获取顶级页面对象
 * @param {Object} obj 当前页面对象
 * @returns {Object} 当前页面向上查找的最顶级页面对象
 * @example sw.getTopWindow();
 */
DLShouWen.prototype.getTopWindow = function(obj){
	if(obj.parent==obj){
		return obj;
	}else{
		return sw.getTopWindow(obj.parent);
	}
}

/**
 * 打开模态窗口方法
 * @param {Object} option 窗口参数
 * 		{
 * 			{String} id : 窗口编号
 * 			{String} title : 窗口标题
 * 			{String} icon : 图标
 *  		{String} url : 窗口页面展示地址
 *   		{String} height : 页面显示高度
 * 			{Boolean} showCloseButton : 是否显示关闭按钮
 * 			{String} modalType : 模态样式，可选：sm\lg
 * 			{Function} callback : 回调方法
 * 			{Function} closeCallback : 关闭模态回调方法
 * 		}
 * @example sw.openModal({id:'dlshouwen'}, title:'大连首闻科技官方网站', icon:'dlshouwen', url:'http://www.dlshouwen.com', height:'400px', showCloseButton:false, modalType:'lg', callback:function(){}, closeCallback:function(){}});
 */
DLShouWen.prototype.openModal = openModal;

/**
 * 关闭模态窗口
 * @param {String} id 需要关闭的模态窗口编号
 * @param {Object} windowObj 执行关闭模态窗口的对象
 * @example sw.closeModal('dlshouwen', parent);
 */
DLShouWen.prototype.closeModal = closeModal;

/**
 * 打开模态窗口，关闭时刷新列表数据
 * @param {Object} option 窗口参数
 * 		{
 * 			{String} id : 窗口编号
 * 			{String} title : 窗口标题
 * 			{String} icon : 图标
 *  		{String} url : 窗口页面展示地址
 *   		{String} height : 页面显示高度
 * 			{Boolean} showCloseButton : 是否显示关闭按钮
 * 			{String} modalType : 模态样式，可选：sm\lg
 * 			{Function} callback : 回调方法
 * 			{Function} closeCallback : 关闭模态回调方法
 * 		}
 * @param {Object} grid 需要刷新的Grid对象
 * @example sw.updateGrid({id:'dlshouwen'}, title:'大连首闻科技官方网站', icon:'dlshouwen', url:'http://www.dlshouwen.com', height:'400px', showCloseButton:false, modalType:'lg', callback:function(){}, closeCallback:function(){}}, grid);
 */
DLShouWen.prototype.updateGrid = function(option, grid){
	option.closeCallback = function(){
		grid.reload(true);
	};
	openModal(option);
};

/**
 * 提示方法，开发过程中尽量使用此方法替代window.alert，便于统一修改alert样式
 * @param {String} message 提示信息
 * @param {String} type 提示类别，可选：info\warning\success\error
 * @param {String} time 提示守留时间，该参数保留于Toast提示样式
 * @example sw.alert('操作执行成功！', 'success', 3000);
 */
DLShouWen.prototype.alert = function(message, type, time){
	window.alert(message);
};

/**
 * 类似手机的Toast提示
 * @param {String} message 提示信息
 * @param {String} type 提示类别，可选：info\warning\success\error
 * @param {String} time 提示守留时间，该参数保留于Toast提示样式
 * @example sw.toast('操作执行成功！', 'success', 3000);
 */
DLShouWen.prototype.toast = openToast;

/**
 * 显示进度条
 * @param {String} message 提示信息
 * @example sw.showProcessBar('正在加载，请稍后...');
 */
DLShouWen.prototype.showProcessBar = showProcessBar;

/**
 * 隐藏滚动条
 * @example sw.hideProcessBar();
 */
DLShouWen.prototype.hideProcessBar = hideProcessBar;

/**
 * 获取表单所有参数
 * @param {Object} formObject form对象
 * @return {Object} 参数对象
 * @example var params = sw.getFormParams(document.forms[0]);
 */
DLShouWen.prototype.getFormParams = getFormParams;

/**
 * 重置表单信息
 * @param {int} formIndex 表单索引号，当前页面中从0开始
 * @example sw.doReset(0);
 */
DLShouWen.prototype.doReset = function(formIndex){
	document.forms[formIndex].reset();
};

/**
 * HTML转义
 * @param {String} str 待转义的字符串
 * @returns {String} 转义后的字符串
 * @example var he = sw.htmlEncode('<div>dlshouwen</div>');
 */
DLShouWen.prototype.htmlEncode = htmlEncode;

/**
 * HTML反转义
 * @param {String} str 待反转义的字符串
 * @returns {String} 反转义后的字符串
 * @example var he = sw.htmlDecode('&gt;');
 */
DLShouWen.prototype.htmlDecode = htmlDecode;

/**
 * 初始化表格按钮权限
 * @param {String} urls 需要判断的URL地址列表
 * @param {String} showButtonWhenNoLimit 无权限时依然显示按钮
 * @return {Object} 按钮权限
 * @example sw.initGridButtonLimit(urls, '0');
 */
DLShouWen.prototype.initGridButtonLimit = function(urls, showButtonWhenNoLimit){
	var url = path + '/core/base/limit';
	var params = new Object();
	params.urls = urls;
	sw.ajaxSubmit(url, params, function(data){
		for(var key in data){
			var url = key;
			var isHasLimit = data[key];
			if(!isHasLimit){
				if(showButtonWhenNoLimit=='0'){
					$('button[limit="'+url+'"]').addClass('hide');
				}
				if(showButtonWhenNoLimit=='1'){
					$('button[limit="'+url+'"]').attr('disabled', 'disabled');
					$('button[limit="'+url+'"]').attr('title', '您无权执行该操作');
				}
			}
		}
	});
};

/**
 * Ajax提交
 * @param {String} url Ajax提交地址
 * @param {Object} params Ajax提交参数
 * @param {Function} successFunc 调用成功时的执行方法
 * @param {Function} errorFunc 调用失败时的执行方法
 * @param {Boolean} async 是否同步，默认false
 * @example sw.ajaxSubmit(url, params);
 */
DLShouWen.prototype.ajaxSubmit = function(url, params, successFunc, errorFunc, async){
	$.ajax({
		type:'post',
		url:url,
		data:params,
		async:(async==undefined?true:async),
		contentType: "application/x-www-form-urlencoded; charset = utf-8",
		beforeSend: function(xhr) {xhr.setRequestHeader("__REQUEST_TYPE__", "AJAX_REQUEST");},
		success:function(data){
			if(data=='__AJAX_REQUEST_NO_LIMIT__'){
				sw.toast('您无权限执行此操作。', 'error', 3000);
				sw.hideProcessBar();
				return;
			}
			if(data=='__AJAX_REQUEST_SESSION_OUT__'){
				sw.alert('由于您长时间未操作，您需要重新登录本系统。');
				sw.getTopWindow(window).location.href = path + '/core/base/login';
				return;
			}
			if(data=='__AJAX_REQUEST_FORCE_OUTLINE__'){
				sw.alert('您已经被强制下线。');
				sw.getTopWindow(window).location.href = path + '/core/base/login';
				return;
			}
			try{
				sw.hideProcessBar();
				successFunc(data);
			}catch(e){};
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			try{
				sw.hideProcessBar();
				if(errorFunc){
					try{errorFunc();}catch(e){};
				}else{
					sw.toast('系统出现错误。', 'error', 3000);
				}
			}catch(e){};
		}
	});
};

/**
 * Ajax提交，直接提交JSON对象，通过Spring MVC可直接转换为后台Controller参数对象
 * @param {String} url Ajax提交地址
 * @param {Object} params Ajax提交参数
 * @param {Function} successFunc 调用成功时的执行方法
 * @param {Function} errorFunc 调用失败时的执行方法
 * @param {Boolean} async 是否同步，默认false
 * @example sw.ajaxSubmitJSON(url, params);
 */
DLShouWen.prototype.ajaxSubmitJSON = function(url, params, successFunc, errorFunc, async){
	$.ajax({
		type:'post',
		url:url,
		data:JSON.stringify(params),
		async:(async==undefined?true:async),
		contentType:"application/json",
		dataType:"json",
		beforeSend: function(xhr) {xhr.setRequestHeader("__REQUEST_TYPE__", "AJAX_REQUEST");},
		success:function(data){
			if(data=='__AJAX_REQUEST_NO_LIMIT__'){
				sw.toast('您无权限执行此操作。', 'error', 3000);
				sw.hideProcessBar();
				return;
			}
			if(data=='__AJAX_REQUEST_SESSION_OUT__'){
				sw.alert('由于您长时间未操作，您需要重新登录本系统。');
				sw.getTopWindow(window).location.href = path + '/core/base/login';
				return;
			}
			if(data=='__AJAX_REQUEST_FORCE_OUTLINE__'){
				sw.alert('您已经被强制下线。');
				sw.getTopWindow(window).location.href = path + '/core/base/login';
				return;
			}
			try{
				sw.hideProcessBar();
				successFunc(data);
			}catch(e){};
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			try{
				sw.hideProcessBar();
				if(errorFunc){
					try{errorFunc();}catch(e){};
				}else{
					sw.toast('系统出现错误。', 'error', 3000);
				}
			}catch(e){};
		}
	});
};

/**
 * 调用Ajax方法，调用成功后刷新Grid表格数据
 * @param {String} url Ajax提交地址
 * @param {Object} params Ajax提交参数
 * @param {Object} grid Grid表格对象
 * @example sw.ajaxSubmitRefreshGrid(url, params, grid);
 */
DLShouWen.prototype.ajaxSubmitRefreshGrid = function(url, params, grid){
	sw.ajaxSubmit(url, params, function(data){
		sw.ajaxSuccessCallback(data);
		grid.reload(true);
	});
};

/**
 * 推荐的调用Ajax方法成功后的回调方法，对应服务器端AjaxResponse对象，
 * 若需要获取AjaxResponse对象中的data属性，请在JavaScript中使用data.data调用
 * @param {Object} data Ajax回调数据
 * @param {Function} successFunc 操作成功的回调方法
 * @param {Function} warningFunc 操作警告的回调方法
 * @param {Function} errorFunc 操作错误的回调方法
 * @example sw.ajaxSuccessCallback(data);
 */
DLShouWen.prototype.ajaxSuccessCallback = function(data, successFunc, warningFunc, errorFunc){
	try{
		if(data.success){
			sw.toast(data.successMessage, 'success', 3000);
			if(successFunc)
				try{successFunc(data);}catch(e){};
		}
		if(data.warning){
			sw.toast(data.warningMessage, 'warning', 3000);
			if(warningFunc)
				try{warningFunc(data);}catch(e){};
		}
		if(data.error){
			sw.toast(data.errorMessage, 'error', 3000);
			if(errorFunc)
				try{errorFunc(data);}catch(e){};
		}
	}catch(e){};
};