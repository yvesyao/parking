window.$ && $(function() {
	$('a[href=""], a[href="#"]').click(function(event) {
		/* Act on the event */
		event.preventDefault();
	});
	$('header').load('header.html', function() {
		$headerLinks = $('header #headerMenu a');
		var selfUrl = window.location.href;
		for (var i = 0; i < $headerLinks.length; ++i) {
			var $link = $($headerLinks[i]);
			if (selfUrl.indexOf($link.attr('href') >= 0)) {
				var $parentLi = $link.closest('li');
				if ($parentLi.hasClass('active')) break;
				$parentLi.addClass('active').siblings('li').removeClass('active');
				break;
			}
		};
		$('#headerMenu a.active').click(function(e) {
			e.preventDefault();
		});
	});
	$('footer').load('footer.html');
});