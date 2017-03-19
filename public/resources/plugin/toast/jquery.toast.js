/*!
 * Toast JavaScript Library v1.0
 *
 * includes: jquery(javascript library), jquery.toast.css(css library)
 * Copyright 2014, LiuJingCheng
 * Date: 2014-8-18
 */

/**
 * open toast: content-toast content, level-0(info)1(warning)2(error), time-sustain time
 * @param content toast content
 * @param leve info(default) warning error success
 * @param time sustain time (default 3000ms)
 */
var toastZIndex = 1090;
var toastThread;
var toastFadeInAnimateTime = 500;
var toastFadeOutAnimateTime = 500;
function openToast(content, level, time){
	// default level
	level = level?level:'info';
	// get the level class
	var levelClass = '';
	if(level=='info') levelClass='text-primary';
	if(level=='warning') levelClass='text-warning';
	if(level=='error') levelClass='text-danger';
	if(level=='success') levelClass='text-success';
	// close other toast div
	clearTimeout(toastThread);
	$('.toast').remove();
	// constructs the html content
	var toastContent = '<div class="toast '+levelClass+'" style="z-index:'+toastZIndex+'">'+content+'</div>';
	// append to the ducoment
	$('body').append(toastContent);
	// set the offset
	var x = $(window).width()/2-$('.toast').width()/2-20;
	//toast(x);
	$('.toast').css("left", x);
	// show the div
	$('.toast').fadeIn(toastFadeInAnimateTime, function(){
		// callback close
		if(time){
			toastThread = setTimeout(removeToast, time);
		}
	});
}
//close an toast
function removeToast(){
	$('.toast').fadeOut(toastFadeOutAnimateTime, function(){
		$('.toast').remove();
	});
}