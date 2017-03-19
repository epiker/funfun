/** 定义上传对象 */
var uploader;
/** 定义上传参数对象 */
var uploaderParams = new Object();

/** 设置当前路径 */
uploaderParams.nowPath = nowPath;
/** 设置当前Session编号 */
uploaderParams.sessionId = sessionId;
/** 设置当前用户编号 */
uploaderParams.userId = userId;

/** 定义上传组件配置对象 */
var settings = {
	flash_url : path+"/resources/plugin/swfUpload/swfupload.swf",
	upload_url: path+"/core/server/image/upload",
	post_params: uploaderParams,
	file_size_limit : uploadPicMaxSize,
	file_types : uploadPicPattern,
	file_types_description : "All Files",
	file_upload_limit : 0,
	file_queue_limit : 0,

	debug: false,

	button_image_url: path+"/resources/plugin/swfUpload/button.png",
	button_placeholder_id: "button_placeholder",
	button_width: "85",
	button_height: "27",
	
	file_dialog_start_handler : fileDialogStart,
	file_queued_handler : fileQueued,
	file_queue_error_handler : fileQueueError,
	file_dialog_complete_handler: fileDialogComplete,
	upload_start_handler : uploadStart,
	upload_progress_handler : uploadProgress,
	upload_error_handler : uploadError,
	upload_success_handler : uploadSuccess,
	upload_complete_handler : uploadComplete,
	
	custom_settings : {
		progressTarget : "upload_container",
		cancelButtonId : "cancel_upload"
	}
};

/**
 * 初始化加载上传组件对象初始化程序
 */
$(function(){
	uploader = new SWFUpload(settings);
});