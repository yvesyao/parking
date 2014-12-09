<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <base href="<%=basePath%>">
    
    <title>登出</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    

  <style type="text/css" media="all">
		*{
			margin:0;
			padding:0;
		}
		body{
			font-family: 'Audiowide', cursive, arial, helvetica, sans-serif;
			background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAUElEQVQYV2NkYGAwBuKzQAwDID4IoIgxIikAMZE1oRiArBDdZBSNMIXoJiFbDZYDKcSmCOYimDuNSVKIzRNYrUYOFuQgweoZbIoxgoeoAAcAEckW11HVTfcAAAAASUVORK5CYII=) repeat;
			background-color:#212121;
			color:white;
			font-size: 18px;
			padding-bottom:20px;
		}
		#logo {
			text-align:center;
			margin:0 auto;
			width: 500px;
			clear:both;
			margin-bottom:50px;
		}
		#logo img, #logo h3{
			float:left;
		}
		#logo h3{
			width:auto;
			padding: 0 0 0 10px;
			line-height: 70px;
			font-size:50px;
		}
		#main {
			margin-top:100px;
		}
		#content{
			clear:both;
		}
		h3{
			width: 100%;
			font-size: 25px;
			text-align:center;
			color: white;
			text-shadow: 2px 2px 5px hsl(0, 0%, 61%);
			padding-top:10px;
		}
		.clear{
			float:none;
			clear:both;
		}
		.content{
			text-align:center;
			line-height: 30px;
		}
		.blue {
			color: #9ECDFF;
		}
		a{
			text-decoration: none;
			text-shadow: 0px 0px 2px white;
		}
		a:hover{
			color:white;
		}
    </style>
    <link rel="shortcut icon" href="imgs/favicon.ico">
 </head>
 <body> 

  <div id = "mainframe">
  	<%
   response.setHeader("refresh", "3; URL = '../index.jsp'");  // 定时跳转
   session.invalidate(); // 注销 session 
  %>
  <br />
   <br />
    <br />
    <br />
    <div id = "main">
    	<div id = "logo">
    	<img height="80" src="imgs/logo.png">
    	<h3>PET-CT</h3>
    	<div style="clear:both;"></div>
    	</div>
	  	<div id= "content">
	  	<h3>您已成功退出本系统，<span class="blue">三秒钟</span>后跳转到登陆页</h3>
	  	<h3>如果没有自动跳转，请点击<a class="blue" href="./index.jsp">这里</a></h3>
	  	</div>
  	</div>
  </div>
  
 </body>
</html>