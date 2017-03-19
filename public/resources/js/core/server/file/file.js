/** 当前路径 */
var nowPath = '/';
/** 当前选中文件编号 */
var nowFileId = '';
/** 当前选中文件 */
var nowFile = '';
/** 查询出的列表 */
var files;
/** 当前显示的列表 */
var showFiles;

/**
 * 初始化加载文件列表数据
 */
$(function(){
	getFileList(nowPath);
});

/**
 * 获取文件数据，获取成功后调用显示文件方法
 * @param {String} filePath 需要获取的文件路径
 */
function getFileList(filePath){
	$('#path_container').val(nowPath);
	var url = path+'/core/server/file/list';
	var params = new Object();
	params.filePath = filePath;
	sw.showProcessBar();
	sw.ajaxSubmit(url, params, function(data){
		files = data;
		constructFiles();
		sw.hideProcessBar();
	});
}

/**
 * 显示文件
 */
function constructFiles(){
	search();
	showFiles.sort(orderBy);
	nowFileId = '';
	nowFile = '';
	var showType = $('#show_type').val();
	if(showType=='0'){
		var content = '';
		content += '<table class="table">';
		for(var i=0; i<showFiles.length; i++){
			var file = showFiles[i];
			content += '<tr id="file_'+i+'" title="'+file.full_name+'" file_full_name="'+file.full_name+'" file_name="'+file.name+'" class="list-'+(file.is_dir=='1'?'folder':'image')+' file-single '+(file.is_dir=='1'?'type-dir':'type-file')+'">';
			content += '	<td>'+(file.is_dir=='1'?'<i class="fa fa-folder-o"></i>':'<i class="fa fa-image"></i>')+'&nbsp;&nbsp;'+file.full_name+'</td>';
			content += '	<td>'+(file.is_dir=='1'?'-':getFileSize(file.size))+'</td>';
			content += '	<td>'+file.create_time+'</td>';
			content += '</tr>';
		}
		content += '</table>';
		$('#show_files_container').html(content);
	}else{
		var content = '';
		for(var i=0; i<showFiles.length; i++){
			var file = showFiles[i];
			content += '<div id="file_'+i+'" title="'+file.full_name+'" file_full_name="'+file.full_name+'" file_name="'+file.name+'" class="file file-single '+(file.is_dir=='1'?'type-dir':'type-file')+'">';
			content += '	<div class="thumbnail">';
			content += '		<div class="caption">';
			if(file.is_dir=='1'){
				content += '			<h3><i class="fa fa-folder-o"></i></h3>';
			}else{
				content += '			<h3><i class="fa fa-file-o"></i></h3>';
			}
			content += '			<p>'+file.full_name+'</p>';
			content += '		</div>';
			content += '	</div>';
			content += '</div>';
		}
		$('#show_files_container').html(content);
	}
	bindMethod();
}

/**
 * 绑定方法
 */
function bindMethod(){
	//滑入滑出高亮事件
	$('.file-single').mouseover(function(){
		$(this).addClass('file-single-hover');
	}).mouseout(function(){
		$(this).removeClass('file-single-hover');
	});
	//单击高亮，设置文件名事件
	$('.file-single').click(function(){
		$('.file-single').removeClass('file-single-select');
		$(this).addClass('file-single-select');
		nowFileId = this.id.split('_')[1];
		nowFile = $(this).attr('file_full_name');
		$('#file_name').val($(this).attr('file_name'));
	});
	//双击文件夹进入事件
	$('.type-dir').dblclick(function(){
		nowPath += $(this).attr('file_full_name') + '/';
		uploaderParams.nowPath = nowPath;
		uploader.setPostParams(uploaderParams);
		getFileList(nowPath);
	});
	//如果是选择界面则双击文件执行选择
	if(isSelect=='1'){
		$('.type-file').dblclick(function(){
			var result = previewPath + nowPath + $(this).attr('file_full_name');
			sw.getTopWindow(window).model_args['selectFileReturnValue'] = result;
			parent.sw.closeWindow('self');
		});
	}
}

/**
 * 返回到上级目录
 */
function goBack(){
	if(nowPath!='/'){
		nowPath = nowPath.substr(0, nowPath.length-1);
		nowPath = nowPath.substr(0, nowPath.lastIndexOf('/'))+'/';
		uploaderParams.nowPath = nowPath;
		uploader.setPostParams(uploaderParams);
		getFileList(nowPath);
	}
}
/**
 * 刷新数据，重读服务器数据
 */
function refresh(){
	getFileList(nowPath);
}

/**
 * 刷新数据，不重读服务器数据，以当前数据为准
 */
function fakeRefresh(){
	constructFiles();
}

/**
 * 执行文件查询
 */
function search(){
	showFiles = new Array();
	var searchContent = $('#search_content').val();
	if(searchContent!=''){
		for(var i=0; i<files.length; i++){
			var file = files[i];
			if(file.full_name.indexOf(searchContent)!=-1){
				showFiles.push(file);
			}
		}
	}else{
		showFiles = files;
	}
}

/**
 * 文件排序比较方法，用于JavaScript中Array的sort方法回调
 * @param {Object} file1 需要比对的文件
 * @param {Object} file2 需要比对的文件
 * @return {int} 比较结果
 */
function orderBy(file1, file2){
	var order = $('#order').val();
	var orderType = $('#order_type').val();
	var result = 0;
	if(order=='0'){
		if(file1.is_dir=='1'&&file2.is_dir=='0'){
			result = -1;
		}else if(file1.is_dir=='0'&&file2.is_dir=='1'){
			result = 1;
		}else{
			result = file1.name.localeCompare(file2.name);
		}
	}
	if(order=='1'){
		result = file1.size - file2.size;
	}
	if(order=='2'){
		result = file1.create_time_long - file2.create_time_long;
	}
	if(orderType=='1'){
		result = -1*result;
	}
	return result;
}

/**
 * 执行新建文件夹操作
 */
function addFolder(){
	var url = path+'/core/server/file/add';
	var params = new Object();
	params.nowPath = nowPath;
	params.fileName = $('#file_name').val();
	sw.showProcessBar();
	sw.ajaxSubmit(url, params, function(data){
		if(data.success=='0'){
			sw.toast(data.message, 'warning', 3000);
		}else{
			var file = new Object();
			file.name = data.name;
			file.full_name = data.full_name;
			file.extension = data.extension;
			file.is_dir = data.is_dir;
			file.size = data.size;
			file.create_time_long = data.create_time_long;
			file.create_time = data.create_time;
			files.push(file);
			fakeRefresh();
			sw.toast(data.message, 'success', 3000);
		}
		sw.hideProcessBar();
	});
}

/**
 * 执行重命名文件或文件夹操作
 */
function modifyFileName(){
	if(nowFileId==''){
		sw.toast('请选择需要重命名的文件或文件夹！', 'warning', 3000);
		return;
	}
	var url = path+'/core/server/file/rename';
	var params = new Object();
	params.nowPath = nowPath;
	params.nowFile = nowFile;
	params.fileName = $('#file_name').val();
	sw.showProcessBar();
	sw.ajaxSubmit(url, params, function(data){
		if(data.success=='0'){
			sw.toast(data.message, 'warning', 3000);
		}else{
			var file = new Object();
			file.name = data.name;
			file.full_name = data.full_name;
			file.extension = data.extension;
			file.is_dir = data.is_dir;
			file.size = data.size;
			file.create_time_long = data.create_time_long;
			file.create_time = data.create_time;
			files.splice(nowFileId, 1, file);
			fakeRefresh();
			sw.toast(data.message, 'success', 3000);
		}
		sw.hideProcessBar();
	});
}

/**
 * 执行删除或删除文件夹操作
 */
function deleteFile(){
	if(nowFileId==''){
		sw.toast('请选择需要删除的文件或文件夹！', 'warning', 3000);
		return;
	}
	if(!confirm('确定要删除此文件吗？')){
		return;
	}
	var url = path+'/core/server/file/delete';
	var params = new Object();
	params.nowPath = nowPath;
	params.nowFile = nowFile;
	sw.showProcessBar();
	sw.ajaxSubmit(url, params, function(data){
		if(data.success=='0'){
			sw.toast(data.message, 'warning', 3000);
		}else{
			files.splice(nowFileId, 1);
			fakeRefresh();
			sw.toast(data.message, 'success', 3000);
		}
		sw.hideProcessBar();
	});
}

/**
 * 回调方法
 */
var modalCallback;

/**
 * 选择文件
 */
function selectFile(){
	if($('.file-single-select').hasClass('type-dir')){
		sw.toast('您不能选择文件夹，请选择文件。', 'warning', 3000);
		return;
	}
	var file = $('.file-single-select').attr('file_full_name');
	modalCallback(file);
	closeModal('selectFile', parent);
}

/**
 * 清空文件
 */
function clearFile(){
	modalCallback('');
	closeModal('selectFile', parent);
}