$(document).ready(function(){

	$('.loader').css({
		opacity : 0,
		visibility: 'hidden'
	});
	
	$('.nav-open-btn').on('click', function() {
		$('body').toggleClass('no-scroll');
		$('.nav-mob').addClass('active-nav');
	});

	$(document).keyup(function(e) {     
    if(e.keyCode== 27) {
			$('body').removeClass('no-scroll');
			$('.nav-mob').removeClass('active-nav');
    } 
	});

	$("body").click(function(e) {
		if(e.target.id !== 'nav-open-btn'){
			$('.nav-mob').removeClass('active-nav');
		}      
	});

	$('.close-btn').on('click', function() {
		$('body').removeClass('no-scroll');
		$('.nav-mob').removeClass('active-nav');
	});

	$('.gallary-slick').slick( {
		lazyLoad: 'ondemand',
		pauseOnHover: false,
		dots: true
	});

	$('.slick-menu').slick( {
		dots: false,
		autoplay: true
	});

	AOS.init();

	$('#menu-about').click(function() {
		$.scrollTo(document.getElementById('about'), 800);
	});
	$('#menu-menu').click(function() {
		$.scrollTo(document.getElementById('menu'), 800);
	});
	$('#menu-gallery').click(function() {
		$.scrollTo(document.getElementById('gallery'), 800);
	});
	$('#menu-contacts').click(function() {
		$.scrollTo(document.getElementById('site-footer'), 800);
	});
	
	$('#menu-about-m').click(function() {
		$.scrollTo(document.getElementById('about'), 800);
	});
	$('#menu-menu-m').click(function() {
		$.scrollTo(document.getElementById('menu'), 800);
	});
	$('#menu-gallery-m').click(function() {
		$.scrollTo(document.getElementById('gallery'), 800);
	});
	$('#menu-contacts-m').click(function() {
		$.scrollTo(document.getElementById('site-footer'), 800);
	});

	$('#menu-about-s').click(function() {
		$.scrollTo(document.getElementById('about'), 800);
	});
	$('#menu-menu-s').click(function() {
		$.scrollTo(document.getElementById('menu'), 800);
	});
	$('#menu-gallery-s').click(function() {
		$.scrollTo(document.getElementById('gallery'), 800);
	});
	$('#menu-contacts-s').click(function() {
		$.scrollTo(document.getElementById('site-footer'), 800);
	});

});