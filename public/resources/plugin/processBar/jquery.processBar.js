/*!
 * processBar JavaScript Library v1.0
 *
 * includes: jquery(javascript library), jquery.processBar.css(css library)
 * Copyright 2013, LiuJingCheng
 * Date: 2013-1-5 4:43:23
 */

var processBarThread;
var processWidth;
function showProcessBar(){
	$('.process-bar').remove();
	$('.process-bar-icon').remove();
	clearInterval(processBarThread);
	processWidth = 0;
	var content = '';
	content += '<div class="process-bar bg-primary"></div>';
	content += '<div class="process-bar-icon text-primary"><i class="fa fa-spinner fa-spin"></i></div>';
	$('body').append(content);
	processWidth += Math.random()*(100-processWidth)*0.1;
	$('.process-bar').animate({width:processWidth+'%'}, 200);
	processBarThread = setInterval(function(){
		processWidth += Math.random()*(100-processWidth)*0.1;
		$('.process-bar').animate({width:processWidth+'%'}, 200);
	}, 200);
}
function hideProcessBar(){
	clearInterval(processBarThread);
	$('.process-bar').animate({width:'100%'}, 100, function(){
		$('.process-bar').remove();
		$('.process-bar-icon').remove();
	});
}