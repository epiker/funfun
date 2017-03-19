/**
 * 取消队列
 * @param {Object} instance 文件上传实例
 */
function cancelQueue(instance) {
	document.getElementById(instance.customSettings.cancelButtonId).disabled = true;
	instance.stopUpload();
	var stats;
	
	do {
		stats = instance.getStats();
		instance.cancelUpload();
	} while (stats.files_queued !== 0);
	
}

/**
 * 文件上传对话框开始监听方法
 */
function fileDialogStart() {
}

/**
 * 文件被追加到队列时的监听方法
 * @param {Object} file 被追加到队列的文件对象
 */
function fileQueued(file) {
	try {
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setStatus("等候上传...");
		progress.toggleCancel(true, this);
	} catch (e) {
		this.debug(e);
	}
}

/**
 * 文件队列发生错误
 * @param {Object} file 发生错误的文件
 * @param {String} errorCode 错误代码
 * @param {String} message 错误提示信息
 */
function fileQueueError(file, errorCode, message) {
	try {
		if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
			sw.toast("上传文件超过预定数量（"+this.getSetting('file_upload_limit')+"个）。", 'warning', 3000);
			return;
		}
		
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setError();
		progress.toggleCancel(false);

		switch (errorCode) {
		case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
			progress.setStatus("文件超过 "+uploadPicMaxSize+" KB，禁止上传");
			break;
		case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
			progress.setStatus("无法上传空文件");
			break;
		case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
			progress.setStatus("不支持的文件类型（支持"+uploadPicPattern+"）");
			break;
		case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
			sw.toast("上传文件超过预定数量（"+this.getSetting('file_upload_limit')+"个）。", 'warning', 3000);
			break;
		default:
			if (file !== null) {
				progress.setStatus("未知错误");
			}
			break;
		}
	} catch (e) {
        this.debug(e);
    }
}

/**
 * 文件对话框加载完成监听事件
 * @param {int} numFilesSelected 选中文件数量
 * @param {int} numFilesQueued 队列文件数量
 */
function fileDialogComplete(numFilesSelected, numFilesQueued) {
	try {
		if (this.getStats().files_queued > 0) {
			document.getElementById(this.customSettings.cancelButtonId).disabled = false;
		}
	} catch (e)  {
        this.debug(e);
	}
}

/**
 * 文件开始上传监听事件
 * @param {Object} file 正在上传的文件
 * @returns {Boolean} 是否上传成功
 */
function uploadStart(file) {
	try {
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setStatus("开始上传...");
		progress.toggleCancel(true, this);
	}
	catch (e) {
	}
	return true;
}

/**
 * 文件正在上传监听事件
 * @param {Object} file 正在上传的文件对象
 * @param {Float} bytesLoaded 加载的字节数
 * @param {Float} 需要上传的字节数
 */
function uploadProgress(file, bytesLoaded, bytesTotal) {
	try {
		var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);

		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setProgress(percent);
		progress.setStatus("正在上传...");
	} catch (e) {
		this.debug(e);
	}
}

/**
 * 文件上传成功监听事件
 * @param {Object} file 上传成功的文件对象
 * @param {Object} serverData 服务器返回数据
 */
function uploadSuccess(file, serverData) {
	try {
		var data = $.parseJSON(serverData);
		if(data.success=='1'){
			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setComplete();
			progress.setStatus("上传完成");
			progress.toggleCancel(false);
		}else{
			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setError();
			progress.setStatus(data.message);
			progress.toggleCancel(false);
		}
	} catch (e) {
		this.debug(e);
	}
}

/**
 * 文件上传完成的监听事件
 * @param {Object} file 上传完成的文件对象
 */
function uploadComplete(file) {
	try {
		if (this.getStats().files_queued === 0) {
			document.getElementById(this.customSettings.cancelButtonId).disabled = true;
			refresh();
		} else {	
			this.startUpload();
		}
	} catch (e) {
		this.debug(e);
	}

}

/**
 * 文件上传失败的监听事件
 * @param {Object} file 上传四百的文件对象
 * @param {String} errorCode 错误代码
 * @param {String} message 错误提示信息
 */
function uploadError(file, errorCode, message) {
	try {
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setError();
		progress.toggleCancel(false);

		switch (errorCode) {
		case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
			progress.setStatus("上传错误: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
			progress.setStatus("配置错误。");
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
			progress.setStatus("上传失败。");
			break;
		case SWFUpload.UPLOAD_ERROR.IO_ERROR:
			progress.setStatus("服务器IO异常。");
			break;
		case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
			progress.setStatus("安全禁止。");
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
			progress.setStatus("上传受限。");
			break;
		case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
			progress.setStatus("文件未找到。");
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
			progress.setStatus("错误的验证方式，上传跳过。");
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
			if (this.getStats().files_queued === 0) {
				document.getElementById(this.customSettings.cancelButtonId).disabled = true;
			}
			progress.setStatus("已取消");
			progress.setCancelled();
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
			progress.setStatus("已停止");
			break;
		default:
			progress.setStatus("未能捕获的异常: " + error_code);
			break;
		}
	} catch (e) {
        this.debug(e);
    }
}