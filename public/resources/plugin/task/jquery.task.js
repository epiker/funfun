/*!
 * task JavaScript Library v1.1
 *
 * includes: jquery(javascript library), jquery.task.css(css library)
 * Copyright 2016, 大连首闻科技有限公司
 * Date: 2016-6-8 10:43:08
 */

/**
 * 定义数量
 */
var taskCount = 0;
/**
 * 系统定时器的启动方法
 * @param pageObj 页面对象
 */
function systemTaskListener(){
	var url = path + '/core/base/extra/task/listener';
	sw.ajaxSubmit(url, null, function(taskList){
		for(var i=0; i<taskList.length; i++){
			taskListener(taskList[i].task_id);
		}
	});
}
/**
 * 定时任务管理机制
 * @param taskId 任务编号
 */
function taskListener(taskId){
	var url = path + '/core/base/extra/task/listener/'+taskId+'/info';
	sw.ajaxSubmit(url, null, function(task){
		if(task.isShow=='1'){
			if(task.isHideOnThisSession!='1'){
				try{showTask(task);}catch(e){}
			}
			if(task.is_once!='1'){
				setTimeout(function(){taskListener(taskId);}, task.time_space);
			}
		}else{
			$('#header_task_'+task.task_id).remove();
			if(task.is_once!='1'){
				setTimeout(function(){taskListener(taskId);}, task.time_space);
			}
		}
	});
}
/**
 * 显示任务
 * @param task 任务信息
 */
function showTask(task){
	var content = '';
	if($('#header_task_'+task.task_id).length>0){
		content += '<a href="javascript:;" onclick="detonateTask(\''+task.url+'\');">'+task.message+'</a>';
		content += '<a href="javascript:;" class="hide-on-this-session" title="点此此条任务本次登录内不再提示" onclick="hideOnThisSession(\''+task.task_id+'\')"><i class="fa fa-trash-o"></i></a>';
		$('#header_task_'+task.task_id).html(content);
	}else{
		content += '<li id="header_task_'+task.task_id+'">';
		content += '	<a href="javascript:;" onclick="detonateTask(\''+task.url+'\');">'+task.message+'</a>';
		content += '	<a href="javascript:;" class="hide-on-this-session" title="点此此条任务本次登录内不再提示" onclick="hideOnThisSession(\''+task.task_id+'\')"><i class="fa fa-trash-o"></i></a>';
		content += '</li>';
		$('.dropdown-task').append(content);
		taskCount++;
		setTaskCount();
	}
}
/**
 * 本次会话不显示
 * @param taskId 任务编号
 */
function hideOnThisSession(taskId){
	var url = path + '/core/base/extra/task/listener/'+taskId+'/hide';
	sw.ajaxSubmit(url, null, function(){
		$('#header_task_'+taskId).remove();
		taskCount--;
		setTaskCount();
	});
}
/**
 * 处理数量
 */
function setTaskCount(){
	if(taskCount<=0){
		$('#header_task_count_container').removeClass('noft-danger').addClass('noft-success');
		$('.dropdown-task').html('<li id="header_task_nothing"><a href="javascript:;">当前无待办任务...</a></li>');
	}else{
		$('#header_task_nothing').remove();
		$('#header_task_count_container').removeClass('noft-success').addClass('noft-danger');
	}
	$('#header_task_count_container').html(taskCount);
}
/**
 * 点击进入任务功能点
 * @param url 功能地址
 */
function detonateTask(url){
	window.location.href = path + '/' + url;
}