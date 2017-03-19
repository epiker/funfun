<%@page import="java.io.File"%>
<%@ page import="com.dlshouwen.core.base.extra.ueditor.ActionEnter"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<%

    request.setCharacterEncoding( "utf-8" );
	response.setHeader("Content-Type" , "text/html");
	
	String rootPath = application.getRealPath(File.separator);
	
	out.write( new ActionEnter( request, rootPath ).exec() );
	
%>