// 百度地图API功能
var map = new BMap.Map("mapHolder"); // 创建Map实例
var transformFuns = [];
var infoWindowFuns = [];


window.$ && $(function() {
	$('a[href=""], a[href="#"]').click(function(event) {
		/* Act on the event */
		event.preventDefault();
	});
	adjustWindow();
	$('#mapInfoTab').show();
	$(window).resize(function() {
		adjustWindow();
	});

	map.centerAndZoom(new BMap.Point(106.647091, 26.385603), 15);
	map.enableScrollWheelZoom();

	window.openInfoWinFuns = null;

	var options = {
		renderOptions: {
			autoViewport: true
		},
		onSearchComplete: doSearch
	};
	var local = new BMap.LocalSearch(map, options);


	/**
	 * 搜索框回车绑定
	 */
	$('#placeSearch').keypress(function(event) {
		/* Act on the event */
		if (event.which == 13) {
			$('#searchBtn').click();
		};
	});

	/**
	 * 搜索按钮
	 */
	$('#searchBtn').click(function(event) {
		/*搜索接口调用*/
		event.preventDefault();
		var inputVal = $('#placeSearch').val();
		if (!inputVal) return -1;
		local.search(inputVal);
	})


	var popoverTemplate = '<div class="popover" role="tooltip"><a href="#" class="popover-dismiss">&times;</a><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
		/**
		 * 路况工具弹窗
		 */
	$('#trafficTool').popover({
		container: 'body',
		title: '实时路况',
		content: '<div><span class="label level1">严重拥堵</span><span class="label level2">拥挤</span><span class="label level3">缓行</span><span class="label level4">畅通</span></div>',
		html: true,
		template: popoverTemplate,
		placement: 'bottom'
	}).on('shown.bs.popover', function() {
		// 路况信息接口调用
		trafficTool();
		$('#' + $(this).attr('aria-describedby')).find('.popover-dismiss').click(function(event) {
			/* Act on the event */
			event.preventDefault();
			event.stopPropagation();
			$('#trafficTool').popover('hide');
		});
	}).on('hide.bs.popover', function() {
		// 取消路况信息接口
		dismissTrafficTool();
	});


	/**
	 * 全屏
	 */
	$('#toolFullScreen').click(function(event) {
		event.preventDefault();
		fullScrTool();
	});



	/**
	 * 分享
	 */
	ZeroClipboard.config({
		swfPath: "plugins/zeroclipboard/ZeroClipboard.swf"
	});
	$('#toolShare').popover({
		container: 'body',
		title: '分享当前地图上的内容',
		content: '<div class="row">\
	 	<div class="col-xs-9" style="padding-right:0;"><input type="text" class="form-control" id="shareUrl" />\
	 	</div>\
	 	<a href="#" style="line-height:34px;" data-clipboard-target="shareUrl" id="copyShareBtn">复制</a>\
	 	</div>',
		template: popoverTemplate,
		html: true,
		placement: 'bottom'
	}).on('shown.bs.popover', function() {
		// 路况信息接口调用
		shareTool($('#shareUrl'));
		$('#' + $(this).attr('aria-describedby')).find('.popover-dismiss').click(function(event) {
			/* Act on the event */
			event.preventDefault();
			event.stopPropagation();
			$('#toolShare').popover('hide');
		});
		/**
		 * 复制功能
		 */
		var client = new ZeroClipboard($("#copyShareBtn"));
		client.on('ready', function(event) {
			client.on('aftercopy', function(event) {
				console.log('Copied text to clipboard: ' + event.data['text/plain']);
				alert('复制成功！');
			});
		});
	});

	/**
	 * 点选工具
	 */
	$('#toolPointer').click(function(event) {
		event.preventDefault();
		pointerTool();
	});

	/**
	 * 测距工具
	 */
	$('#toolMeasure').click(function(event) {
		event.preventDefault();
		measureTool();
	});

	/**
	 * 左侧栏显隐
	 */
	$('#mapInfoTab').click(function(event) {
		if ($('#mapInfoCon').hasClass('pack')) {
			$(this).children('.glyphicon').addClass('glyphicon-chevron-left').removeClass('glyphicon-chevron-right');
			$('#mapInfoCon').removeClass('pack');
		} else {
			$(this).children('.glyphicon').removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-right');
			$('#mapInfoCon').addClass('pack');
		}
	});

	/**
	 *
	 *
	 *
	 * *****************工具栏功能入口*****************************************************************
	 *
	 *
	 *
	 */
	function trafficTool() {
		console.log('路况信息接口调用');
	}

	function dismissTrafficTool() {
		console.log('路况信息接口取消');
	}

	function fullScrTool() {
		console.log('全屏工具接口调用');
	}

	function pointerTool() {
		console.log('点选工具接口调用');
	}

	function shareTool($inputHandler) {
		$inputHandler.val('分享URL');
		console.log('分享信息接口调用');
	}

	function measureTool() {
		console.log('测距工具接口调用');
	}

	function doSearch(results) {
		// 判断状态是否正确
		console.log('搜索接口调用');
		if (local.getStatus() == BMAP_STATUS_SUCCESS) {

			transformFuns = [];
			var $tbody = $('<tbody></tbody>');
			for (var i = 0; i < results.getCurrentNumPois(); i++) {
				var title = results.getPoi(i).title;
				var marker = addMarker(results.getPoi(i).point, i, title);
				var transformFun = change(results.getPoi(i).point, i, title);
				transformFuns.push(transformFun);
				var $tr = $('<tr></tr>');
				/*console.log(title);*/
				$tr.append("<th></th>")
					.children('th')
					.append('<div class="icon" title="在地图上显示该点"></div>')
					.children('div').attr('id', 'no' + (i + 1))
					.end()
					.end().append('<td></td>')
					.children('td')
					.append('<div class="p-title"><a href="#" class="result-link" tid="' + i + '"></a></div>')
					.find('a.result-link').append(title.replace(new RegExp(results.keyword, "g"), '<strong>' + results.keyword + '</strong>'))
					.end()
					.append('<p class="address">' + results.getPoi(i).address + '</p>');
				$tr.appendTo($tbody);
			}
			$('#poiTableList').html($tbody);
			searchCallback();
		}
	}
})



//百度返回POI坐标添加标注
function addMarker(point, index, name) {
	var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
		offset: new BMap.Size(5, 25),
		imageOffset: new BMap.Size(0, 0 - index * 25)
	});

	var marker = new BMap.Marker(point, {
		icon: myIcon
	});
	//创建检索信息窗口对象
	var searchInfoWindow = null;
	var content = '<div style="margin:0;line-height:20px;padding:2px;">' +
		'地址：人民广场<br/>电话：(010)59928888<br/>简介：沃尔玛。' +
		'</div>';
	searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
		title: name, //标题
		width: 290, //宽度
		height: 105, //高度
		panel: "panel", //检索结果面板
		enableAutoPan: true, //自动平移
		searchTypes: [
			BMAPLIB_TAB_SEARCH, //周边检索
			BMAPLIB_TAB_TO_HERE, //到这里去
			BMAPLIB_TAB_FROM_HERE //从这里出发
		]
	});
	marker.addEventListener("click", function() {
		searchInfoWindow.open(marker);
	});
	map.addOverlay(marker);
	return marker;
}


//点击结果画圆
function change(poi, index, title) {
	return (function() {
		map.clearOverlays();
		var r = getRadius();
		addPoint(poi);
		changeResultsPanel(poi);
		var circle = new BMap.Circle(poi, r, {
			fillColor: "blue",
			strokeWeight: 1,
			fillOpacity: 0.3,
			strokeOpacity: 0.3
		});
		map.panTo(poi);
		var marker = addMarker(poi, index, title);
		map.addOverlay(circle);
	});
}


//点击百度返回POI数据更换结果面板
function changeResultsPanel(poi) {
	var s = [];
	s.push('<div style="font-family: arial,sans-serif; border: 1px solid rgb(153, 153, 153); font-size: 12px;">');
	s.push('<div style="background: none repeat scroll 0% 0% rgb(255, 255, 255);">');
	s.push('<ol style="list-style: none outside none; padding: 0pt; margin: 0pt;">');
	infoWindowFuns = [];
	$(document).ready(function() {
		var lng = Number(poi.lng);
		var lat = Number(poi.lat);
		var radius = getRadius();

		$.get("/Ajax/nearby.ashx", {
			location: lng + ',' + lat,
			radius: radius
		}, function(data, status) {
			$.each(data.contents, function(i, content) {
				if (i == 0) {
					return true;
				}
				var point = new BMap.Point(content.location[0], content.location[1]);
				alert("111111");
				var infoWindowFun = addParkingInfoWindow(point, content.title, content.address);
				infoWindowFuns.push(infoWindowFun);

				s.push('<li id="list' + i + '" style="margin: 2px 0pt; padding: 0pt 5px 0pt 3px; cursor: pointer; overflow: hidden;line-height: 30px;" onclick="infoWindowFuns[' + i + ']()" >');
				s.push('<div style="float:left;width: 3px;background:url("/Images/tcc4.gif") px no-repeat;height:25px;padding-left:20px;margin-right:0.5em;line-height:20px;"> </div>');
				s.push('<span style="color:#00c;text-decoration:underline">' + content.title.replace(new RegExp(content.tags, "g"), '<b>' + content.description + '</b>') + '</span>');
				s.push('<span style="color:#666;"> - ' + content.address + '</span>');
				s.push('</li>');
				s.push('');
			});
		}, "json");
	});
	s.push('</ol></div></div>');
	document.getElementById("r-result").innerHTML = s.join("");
}

/**
 * 搜索功能回调函数
 */
function searchCallback() {
	/**
	 * 搜索结果hover事件
	 */
	$('#poiTableList tr').hover(function() {
		/*do something...*/
		$(this).addClass('focus-over');
	}, function() {
		$(this).removeClass('focus-over');
	}).click(function(event) {
		/* 搜索结果点击事件 */
		$(this).find('a.result-link').click();
	});

	/**
	 * 搜索结果点击事件处理入口
	 */
	$('#poiTableList a.result-link').click(function(event) {
		event.preventDefault();
		event.stopPropagation();
		var tid = $(this).attr('tid');
		transformFuns[tid]();
		console.log('result' + tid + 'clicked');
	})

	$('#areaSearch').hide().prev('#searchResult').show();
}

function changeResultsPanel(poi) {
	var s = [];
	s.push('<div style="font-family: arial,sans-serif; border: 1px solid rgb(153, 153, 153); font-size: 12px;">');
	s.push('<div style="background: none repeat scroll 0% 0% rgb(255, 255, 255);">');
	s.push('<ol style="list-style: none outside none; padding: 0pt; margin: 0pt;">');
	infoWindowFuns = [];
	var lng = Number(poi.lng);
	var lat = Number(poi.lat);
	var radius = getRadius();

	$.get("/Ajax/nearby.ashx", {
		location: lng + ',' + lat,
		radius: radius
	}, function(data, status) {
		$.each(data.contents, function(i, content) {
			if (i == 0) {
				return true;
			}
			var point = new BMap.Point(content.location[0], content.location[1]);
			alert("111111");
			var infoWindowFun = addParkingInfoWindow(point, content.title, content.address);
			infoWindowFuns.push(infoWindowFun);

			s.push('<li id="list' + i + '" style="margin: 2px 0pt; padding: 0pt 5px 0pt 3px; cursor: pointer; overflow: hidden;line-height: 30px;" onclick="infoWindowFuns[' + i + ']()" >');
			s.push('<div style="float:left;width: 3px;background:url("/Images/tcc4.gif") px no-repeat;height:25px;padding-left:20px;margin-right:0.5em;line-height:20px;"> </div>');
			s.push('<span style="color:#00c;text-decoration:underline">' + content.title.replace(new RegExp(content.tags, "g"), '<b>' + content.description + '</b>') + '</span>');
			s.push('<span style="color:#666;"> - ' + content.address + '</span>');
			s.push('</li>');
			s.push('');
			s.push('</ol></div></div>');
			document.getElementById("r-result").innerHTML = s.join("");
		});
	}, "json");
}


//添加停车位纯文本信息框
function addParkingInfoWindow(poi, title, address) {
	return (function() {
		//窗口选项
		var opts = {
			width: 200, //窗口宽度
			height: 100, //窗口高度
			title: title,
			eanbleMessage: false, //设置不允许信息窗口发送信息
		}
		var infoWindow = new BMap.InfoWindow(address, opts);
		map.openInfoWindow(infoWindow, poi);
		return infoWindow;
	});
}

//停车位坐标标注（根据返回status判断标注颜色）
function addParkingMarker(poi, title, address) {
	//if (status == "") {
	var myIcon = new BMap.Icon("/Images/tcc1.gif", new BMap.Size(23, 25));
	var parkingMarker = new BMap.Marker(poi, {
		icon: myIcon
	});
	//} 

	parkingMarker.addEventListener("click", function() {
		var infoWindow = addParkingInfoWindow(poi, title, address)();
	});
	map.addOverlay(parkingMarker);
	return parkingMarker;

}

//接口返回数据标记到地图中
function addPoint(poi) {
	$(document).ready(function() {
		var lng = Number(poi.lng);
		var lat = Number(poi.lat);
		var radius = getRadius();

		$.get("/Ajax/nearby.ashx", {
			location: lng + ',' + lat,
			radius: radius
		}, function(data, status) {
			$.each(data.contents, function(i, content) {
				if (i == 0) {
					return true;
				}
				var point = new BMap.Point(content.location[0], content.location[1]);
				var parkingMarker = addParkingMarker(point, content.title, content.address);
			});
		}, "json")
	});
}

//获得选定检索半径
function getRadius() {
	var r = $("#sel option:selected").val();
	return r;
}

function adjustWindow() {
	var _height = document.body.clientHeight - document.getElementById('searchWrapper').clientHeight - document.getElementById('toolsContainer').clientHeight;
	document.getElementById('mapHolder').style.height = _height + 'px';
	document.getElementById('mapInfoCon').style.height = _height + 'px';
	document.getElementById('shad').style.height = _height + 'px';
}