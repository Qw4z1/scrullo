(function($){
	$.isEmpty = function(value){
		if(typeof value == 'undefined'){
			return true;
		}
		$.trim(value);
		if(		value == null
			|| 	value == 'null'
			|| 	value ==  0
			|| 	value == '') 
		{
			return true;

		}
		return false;
	}
	$.isDocumentInFullScreenMode = function() {  
  		// Note that the browser fullscreen (triggered by short keys) might  
  		// be considered different from content fullscreen when expecting a boolean  
  		return ((document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard methods  
      			(document.webkitIsFullScreen));
	}  
	$.check3dState = function(element) {
		var transformProperty = $(this).css('-webkit-transform');
		var regEx = /(\d+px)/g;
		return transformProperty.match(regEx);
	}	
})(jQuery);


if(typeof SC == 'undefined') {
	var SC = {};
}

var CURR_LIST,
CURR_INDEX = 0,
MAX_CARDS,
currentTimer,
board;

SC.renderCardNumberAndPointBadge = function() {
	$('.list-card').each(function(){
		
		//Check if there is already cards
		if($('.sc-card-number', this).length > 0){
			return true;//continue
		}

		//Get card number and points
		var card = $(this),
		cardNumber = card.find('.list-card-title span').text(),
		points = card.find('.list-card-title').text();
		
		var regEx = /\(\d+\)/;
		if(!$.isEmpty(points)) {	
			points = points.match(regEx) + '';
			if(!$.isEmpty(points)) {	

				//Format points
				points = points.match(/\d+/);
				var pointBadge = SC.pointBadge.createPointBadge(points);
			
				//Append points to badges
				var badges = $(this).find('.badges');
				badges.prepend(pointBadge);
			}
		}
		
		//Create elements
		var cardNumberElement = $('<span class=\'sc-card-number\'>'+cardNumber+' </span>')[0];
		//Add card number to paragraph
		var p = $(this).find('.list-card-title');
		p.prepend(cardNumberElement);
	});
}
SC.pointBadge = {
	createPointBadge: function(points){
		var pointBadge = $('<div class=\'badge point-badge\'></div>')[0];
		$(pointBadge).click(SC.pointBadge.savePoints);
		var span = $('<span class=\'app-icon small-icon\'></span>')[0];
		$(pointBadge).append(span);
		var contentEditable = $('<span class=\'sc-point-input\'contentEditable=\'true\'>'+points+'</span>')[0];
		$(pointBadge).append(contentEditable);
		return pointBadge;
	},
	savePoints: function(){

	}
}
SC.checkBoardURL = function() {
	var regEx = /^https:\/\/trello.com\/board/;
	return regEx.test(window.location.href);
}
SC.createTabs = function() {
	if($('#board-header .sc-tab').length > 0){
		return false;
	}
	var tabContainer = $('<div id=\'sc-tab-container\'></div>')[0];
	$('#board-header .board-title').append(tabContainer);

	var burnDownChart = $('<div class=\'sc-tab burn-down-chart intial\'><a>Burn-down chart</a></div>')[0];
	$(tabContainer).append(burnDownChart);

/*	var slideShow = $('<div class=\'sc-tab slide-show intial\'><a>Slideshow</a></div>')
	$(tabContainer).append(slideShow);*/

	var cards = $('<div class=\'sc-tab cards active intial\'><a>Cards</a></div>')
	$(tabContainer).append(cards);

	window.setTimeout(function(){ 
		$('.sc-tab').addClass('final')
		.removeClass('intial');
		var showBurndDownChart = function(){
			SC.showBurndDownChart(this);
		}
		$(burnDownChart).click(SC.showBurndDownChart);
	}, 0);

	


}
SC.showBurndDownChart = function(HTML_OBJ) {
	/*$('#sc-perspective-wrapper #sc-wrapper').addClass('half-hidden').removeClass('intial');
	$('#sc-chart').addClass('revealed').removeClass('hidden');*/
	$(HTML_OBJ).unbind()
}
SC.wrapBody = function() {

	if($('#sc-perspective-wrapper').length > 0){
		return false;
	}
	var perspectiveWrapper = $('<div id=\'sc-perspective-wrapper\'></div>')[0];
	var wrapper = $('<div id=\'sc-wrapper\' class=\'initial\'></div>')[0];
	$(perspectiveWrapper).append(wrapper);
	$(document.body).prepend(perspectiveWrapper);
	$(wrapper).append($('#surface'));
}
SC.prependChart = function() {

	if($('#sc-chart').length > 0){
		return false;
	}
	var chart = $('<div id=\'sc-chart\' class=\'hidden\'></div>')[0];
	$(document.body).prepend(chart);
}
SC.renderTickets = function(listNumber) {
	if($('#sc-perspective-board').length > 0){
		$('#sc-perspective-board').remove();
	}

	SC.prependChart();
	var perspectiveBoard = $('<div id=\'sc-perspective-board\'></div>')[0];
	$('#sc-chart').append(perspectiveBoard);
	board = $('<ul id=\'sc-board\'></ul>')[0];
	$(perspectiveBoard).append(board);
	var col = 0,
	n = 1,
	top,
	left;
	$('.list:eq('+listNumber+') .list-card').each(function(){

		var title = $(this).find('.list-card-title').text(),
		removalOfPointsRegEx = /(#\d+)/g,
		pointsRegEx = /#\d+/,
		points = title.match(pointsRegEx),
		title = points + ' ' + $.trim(title.replace(removalOfPointsRegEx, '')),
		ticket = $('<li class=\'sc-ticket blurred\'>'+title+'</li>')[0];
		$(board).append(ticket);
		var rest = n%3, 
		translate3d;
		var x = col * 350;
		switch(rest){
			case 0:
				left = x;
				top = 660;
				col++;
				break;
			case 1:
				left = x;
				top = 0;
				break;
			case 2:
				left = x;
				top = 350;
				break;
		}
		$(ticket).css('top', top).css('left', left);
		n++;
	});
	MAX_CARDS = n;
}
SC.attachFullScreenRequest = function() {
	var n = -1;
	$('.list-icon').each(function() {
		$(this).click(function(){
			var
          	el = document.documentElement
        	, rfs =
               el.requestFullScreen
            || el.webkitRequestFullScreen
    		;
    		rfs.call(el);
    		CURR_LIST = $(this).attr('list-number');
		})
		.attr('list-number', n);
		n++;
	});
}
SC.focusTicket = function(ticketNumber) {
	var ticket = $('.sc-ticket:eq('+ticketNumber+')')[0];
	$('.sc-ticket').addClass('blurred')
	.removeClass('focused');
	$('.sc-ticket:eq('+ticketNumber+')').addClass('focused').removeClass('blurred')
	var n = ticketNumber + 1;
	var rest = n%3, 
	translate3d;
	var rest2 = ticketNumber % 3;
	var col = (ticketNumber - rest2) / 3;
	var x = col * 620;
	SC.focusCamera(ticket)
}
SC.focusCamera = function(ticket) {
	var top = (parseInt($(ticket).css('top').replace('px', ''), 10) - 200) + 'px';
	var left = $(ticket).css('left');
	$(board).css('margin-left','-'+left).css('margin-top', '-'+top).css('-webkit-transform-origin', left + ' 0px');
}
SC.tipBoard = function(leftOrRight) {
	if(leftOrRight == 'right'){
		board.style.webkitTransform = 'rotateY('+50+'deg)';
	}else{
		board.style.webkitTransform = 'rotateY(-'+50+'deg)';
	}
	$('#sc-board')[0].style.webkitTransformDuration = '330ms';
	if(currentTimer){
		clearTimeout(currentTimer);
	}
	currentTimer = setTimeout(function(){
		board.style.webkitTransform = 'rotateY(0deg)';
		board.style.webkitTransformDuration = '5s';
	}, 330);
}
if(SC.checkBoardURL) {
	var t = window.setInterval(function(){
		if($('.list').length > 0) {
			window.setTimeout(function(){
				SC.renderCardNumberAndPointBadge();
				SC.wrapBody();
				SC.attachFullScreenRequest();
			}, 500);
		}
	}, 300);
}
document.addEventListener("webkitfullscreenchange", function(e){
   	if($.isDocumentInFullScreenMode()){
   		SC.renderTickets(CURR_LIST);
   	}else{
   		$('#sc-chart').remove();
   	}
}, false);
$(window).bind('keydown', function(){
	if (!e) var e = window.event;
	var keyCode = e.which || e.keyCode;
	var newIndex,
	focus = true;
	switch(keyCode){
		case 37:
		newIndex = CURR_INDEX - 3;//left
		CURR_INDEX = (newIndex < 0) ? CURR_INDEX : newIndex; 
		SC.tipBoard('left'); 
		break;
		case 38://up
		newIndex = CURR_INDEX - 1;
		CURR_INDEX = (newIndex < 0) ? CURR_INDEX : newIndex; 
		break;
		case 39://right
		newIndex = CURR_INDEX + 3;
		CURR_INDEX = (newIndex > MAX_CARDS - 1) ? CURR_INDEX : newIndex;
		SC.tipBoard('right'); 
		break;
		case 40://down
		newIndex = CURR_INDEX + 1;
		CURR_INDEX = (newIndex > MAX_CARDS - 1) ? CURR_INDEX : newIndex; 
		break;
		default: 
		focus = false
		break;
	}
	if(focus){
		SC.focusTicket(CURR_INDEX);
	}
})

