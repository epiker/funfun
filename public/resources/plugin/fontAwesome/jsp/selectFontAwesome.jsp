<%@ page contentType="text/html;charset=UTF-8"%>
<%@ include file="/resources/include/header.jsp"%>
<html>
<head>
	<title>选择FontAwesome图标</title>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta name="description" content="" />
	<meta name="keywords" content="" />
	<%-- jQuery --%>
	<script type="text/javascript" src="${pageContext.request.contextPath }/resources/plugin/jquery/jquery.min.js"></script>
	<%-- bootstrap --%>
	<script type="text/javascript" src="${pageContext.request.contextPath }/resources/plugin/bootstrap/js/bootstrap.min.js"></script>
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/resources/plugin/bootstrap/css/bootstrap.min.css" />
	<%-- font-awesome --%>
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath }/resources/plugin/fontAwesome/css/font-awesome.min.css" media="all" />
	<%-- FontAwesome --%>
	<script type="text/javascript" src="${pageContext.request.contextPath }/resources/plugin/fontAwesome/js/fontAwesome.js"></script>
	<style type="text/css">
	body{padding:0 15px;}
	.fa-select{font-size:13px;font-family:proxima-nova, "Helvetica Neue", Helvetica, Arial, sans-serif;padding-top:8px;cursor:pointer;}
	.fa-select:hover{color:red;}
	</style>
	<script type="text/javascript">
	//回调方法
	var modalCallback;
	$(function(){
		//加载图标
		var content = '';
		for(var iconGroup in fontAwesomeIcons){
			content += '<div><h3>'+iconGroup+'</h3></div>';
			content += '<div class="row">';
			for(var i=0; i<fontAwesomeIcons[iconGroup].length; i++){
				content += '<div id="'+fontAwesomeIcons[iconGroup][i]+'" class="col-xs-4 col-sm-3 col-md-2 fa-select">';
				content += '	<i class="fa fa-'+fontAwesomeIcons[iconGroup][i]+'"></i>';
				content += '	&nbsp;&nbsp;&nbsp;&nbsp;'+fontAwesomeIcons[iconGroup][i];
				content += '</div>';
			}
			content += '</div>';
		}
		$('#icons').html(content);
		//处理点击事件
		$('.fa-select').click(function(){
			var icon = $(this).attr('id');
			modalCallback(icon);
		});
	});
	</script>
</head>
<body>
<div id="icons"></div>
</body>
</html>
