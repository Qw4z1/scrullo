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
slideshow;

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
SC.prependSlideShow = function() {

	if($('#sc-slide-show').length > 0){
		return false;
	}
	slideshow = $('<div id=\'sc-slide-show\' class=\'hidden\'></div>')[0];
	$(document.body).prepend(slideshow);
}
SC.renderSlideShow = function(listNumber) {
	if($('#sc-perspective-board').length > 0){
		$('#sc-perspective-board').remove();
	}
	SC.prependSlideShow();
	SC.renderLayout(listNumber);
}
SC.renderLayout = function(listNumber) {
	var body = $('<div id=\'sc-body\'></div>')[0];
	$(slideshow).append(body);
	var leftBtn = $('<div id=\'sc-left-btn\'></div>')[0];
	$(body).append(leftBtn);
	var rightBtn = $('<div id=\'sc-right-btn\'></div>')[0];
	$(body).append(rightBtn);
	var ticketList = $('<div id=\'sc-ticket-list\'></div>')[0];
	$(body).append(ticketList);
	$('.list .list-card').each(function(){
		$(this).attr('hej');
	})	
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
   		SC.renderSlideShow(CURR_LIST);
   	}else{
   		$('#sc-slide-show').remove();
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

