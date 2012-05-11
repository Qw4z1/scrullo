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
})(jQuery);


if(typeof SC == 'undefined') {
	var SC = {};
}
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
if(SC.checkBoardURL) {
	var t = window.setInterval(function(){
		if($('.list').length > 0) {
			window.setTimeout(function(){
				SC.renderCardNumberAndPointBadge();
				SC.popStateHandler();
			}, 500);
		}
	}, 300);
}

