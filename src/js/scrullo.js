

var SCRULLO = (function($){


	var C = {},


	/*
	-------------------------------------------------------
	Private variables
	-------------------------------------------------------
	*/

	// Attached slide show handler
  ATTACHED_SLIDE_SHOW_HANDLER = false,

  // Reference to the interval
  INTERVAL_REFERENCE,

	// Current list that is showing in slide show
	CURR_LIST,

	// Current index
	CURR_INDEX = 0,

	// Maximum index for the number of tickets
	MAX_INDEX,

	// Slide show object
	SLIDE_SHOW_ELEMENT,

  // Body height
  BODY_HEIGHT,

  // Initial body width
  INITIAL_BODY_WIDTH,

	// BOOL Demo state
	SLIDE_SHOW_DEMO_STATE = false;



	/*
	-------------------------------------------------------
	Public variables
	-------------------------------------------------------
	*/

	// Ticket text show in slide show
	C.ticket;

	// Ticket list shown
	C.ticketList;

  // Iframe container
  C.iframeContainer;

	/**
	 *  @object
	 * 	Slideshow, Slideshow object contains different methods
	 *  @method
	 *	showCard
	 *  @method
	 *      showNextCard
	 *  @method
	 *	showPrevCard
	 *  @method
	 *	exit
	 */
	C.slideshow = {
    showCard: function (card) {

  		var text = $(card).text();
  		C.ticket.innerHTML = text;
  		$('.sc-list-item').css('border', '3px solid #666');
  		$(card).css('border', '3px solid #08c');
  		CURR_INDEX = parseInt($(card).attr('sc-index'), 10);

      var url = this._getURL($('.sc-list-item:eq('+CURR_INDEX+')', C.ticketList));

      if(!url) {
          if(SLIDE_SHOW_DEMO_STATE)
              this.undemo();
          return false;
      }

      this._createIFrame(url);


    },
    showNextCard: function () {

  		if(CURR_INDEX + 1 < MAX_INDEX){
        CURR_INDEX++;
        C.slideshow.showCard($('.sc-list-item:eq('+CURR_INDEX+')', C.ticketList));
  		}
    },
    showPrevCard: function () {

  		if(CURR_INDEX - 1 >= 0){
        CURR_INDEX--;
        C.slideshow.showCard($('.sc-list-item:eq('+CURR_INDEX+')', C.ticketList));
  		}
    },
    demo: function () {

      var url= this._getURL($('.sc-list-item:eq('+CURR_INDEX+')', C.ticketList));

      if(!url) {
        return false;
      }

  		if(SLIDE_SHOW_DEMO_STATE) {
        return false;
  		}
  		SLIDE_SHOW_DEMO_STATE = true;

  		var currentBodyWidth = $('#sc-body').width();
  		$('#sc-body')
  		.css('width', currentBodyWidth)
  		.css('-webkit-transition', 'width 1s');

      setTimeout(function(){
        var topHelperAnimationHeight = 0.3 * BODY_HEIGHT - 10,
        bottomHelperAnimationHeight = BODY_HEIGHT - topHelperAnimationHeight - 400;
        setTimeout(function () {
          $('#sc-body').css('width', 300);
          $('#sc-top-helper-animation').css('height', topHelperAnimationHeight);
          $('#sc-bottom-helper-animation').css('height', bottomHelperAnimationHeight);
          $('#sc-ticket-list').css('left', -340);
          var ticket = $('#sc-ticket'),
          width = ticket.width(),
          scaleFacator = 260 / width;
          ticket.css('-webkit-transform', 'scale('+scaleFacator+','+scaleFacator+')');
        }, 0);
      }, 0);


      if(!C.iframeContainer) {
        this._createIFrame(url);
      }
    },
    undemo: function () {

      if(!SLIDE_SHOW_DEMO_STATE) {
        return false;
      }

      $('#sc-body')
      .css('width', INITIAL_BODY_WIDTH)
      $('#sc-top-helper-animation').css('height', 0);
      $('#sc-bottom-helper-animation').css('height', 0);
      $('#sc-ticket-list').css('left', '');
      $('#sc-ticket').css('-webkit-transform', 'scale(1, 1)');
      $('#sc-body').bind('webkitTransitionEnd', function() {
        setTimeout(function() {
        }, 100);
        $(this).unbind();
      });

      SLIDE_SHOW_DEMO_STATE = false;
    },
    exit: function () {
		  $.refreshBrowser();
		  SLIDE_SHOW_DEMO_STATE = false;
    },


    // Private functions
    _getURL: function (card) {
      var text = $(card).text();
      var regEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

      var url = text.match(regEx);
      if(url != null){
          return url[0];
      }else{
          return false;
      }
    },

    _createIFrame: function (url) {

        // Iframe container
        $(C.iframeContainer).remove();
        C.iframeContainer = $('<div id=\'sc-iframe-container\'></div>')[0];
        $('#sc-body').append(C.iframeContainer);
        $(C.iframeContainer)
        .css('height', '100%')
        .css('width', '1200px');

        var iframe = $('<iframe id=\'sc-iframe\'></iframe>')[0];

        iframe.src = url;
        $(C.iframeContainer).append(iframe);

        $(C.iframe)
        .css('height', '100%')
        .css('width', '1200px');
    }
	}


	/**
	 *  @object
	 *      pointBadge, contains different methods about point badge
	 *  @method
	 *      createPointBadge,
	 */
	C.pointBadge = {
    createPointBadge: function(points) {
      var pointBadge = $('<div class=\'badge point-badge\'>'+points+'p</div>')[0];
		  $(pointBadge).click(C.pointBadge.savePoints);
		  return pointBadge;
    },
    savePoints: function(){}
	}

	/*
	-------------------------------------------------------
	Constructor
	-------------------------------------------------------
	*/


	/**
	 *  @constructor
	 */
	C.constructor = function() {

    if(C.checkBoardURL) {
		  INTERVAL_REFERENCE = setInterval(function(){
        if($('.list').length > 0) {
			    setTimeout(function(){
            C.renderCardNumberAndPointBadge();
            C.renderTotalListPoints();
            C.wrapBody();
     			}, 500);
          if (!ATTACHED_SLIDE_SHOW_HANDLER) {
             C.attachSlideshowHandler();
             ATTACHED_SLIDE_SHOW_HANDLER = true;
          }
        }
		  }, 300);
    }

    // Bind window key events
    $(window).bind('keydown', function(){
    	if (!e) var e = window.event;
      var keyCode = e.which || e.keyCode;
	   	switch(keyCode){
        case 37:// Left
          C.slideshow.showPrevCard();
          break;
        case 38:// Up
          C.slideshow.showPrevCard();
          break;
        case 39:// Right
          C.slideshow.showNextCard();
          break;
        case 40:// Down
          C.slideshow.showNextCard();
    			break;
        case 68:// Letter D
          if(!SLIDE_SHOW_DEMO_STATE) C.slideshow.demo();
          else C.slideshow.undemo();
          break;
      }
    });
	}

	/*
	-------------------------------------------------------
	Private methods
	-------------------------------------------------------
	*/


	/*
	-------------------------------------------------------
	Public methods
	-------------------------------------------------------
	*/


	/**
	 *  @method
	 *      renderCardNumberAndPointBadge, render card number and points
	 *  @result
	 *      void
	 */
	C.renderCardNumberAndPointBadge = function () {
    $('.list-card').each(function(){

  		//Check if there is already cards
  		if($('.sc-card-number', this).length > 0){
        return true;//continue
  		}

  		//Get card number and points
  		var card = $(this),
  		cardNumber = card.find('.list-card-title span').text(),
  		points = card.find('.list-card-title').text();

  		var regEx = /\(\d+[\.|,]?\d*\)/;
  		if(!$.isEmpty(points)) {
        points = points.match(regEx) + '';
        if(!$.isEmpty(points)) {

          //Format points
          points = points.match(/\d+[\.|,]?\d*/);
          var pointBadge = C.pointBadge.createPointBadge(points);

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

  /**
   *  Render all tickets points
   */
  C.renderTotalListPoints = function () {
    $('.list').each(function() {

      //Check if there is already cards
      if(!$('.sc-sum-points', this).length){
        var sumElement = $('<div class=\'sc-sum-points\'></div>')[0];
        $('.list-title', this).append(sumElement);
      } else {
        var sumElement = $('.sc-sum-points', this)[0];
      }
      var sum = 0;
      $('.badge.point-badge', this).each(function(){
        var points = $(this).text();
        points = parseFloat(points.replace('p', ''));
        sum += points;
      });

      sumElement.innerHTML = sum;

    });
  }

	/**
	 * 	@method
	 *    checkBoardURL, check if we are in a board right now
	 *	@result
	 * 	  BOOL
	 */
	C.checkBoardURL = function() {
    var regEx = /^https:\/\/trello.com\/board/;
    return regEx.test(window.location.href);
	}


	/**
	 * 	@method
	 *    wrapBody, Wrap the body of the board page
	 *	@result BOOL or void
	 */
	C.wrapBody = function() {

    if($('#sc-perspective-wrapper').length > 0){
      return false;
    }
    var perspectiveWrapper = $('<div id=\'sc-perspective-wrapper\'></div>')[0];
    var wrapper = $('<div id=\'sc-wrapper\' class=\'initial\'></div>')[0];
    $(perspectiveWrapper).append(wrapper);
    $(document.body).prepend(perspectiveWrapper);
    $(wrapper).append($('#surface'));
	}


	/**
   *  @public method
   *    Sets the app icon
   *  @result void
   */
	C.setAppIconImage = function(context) {
	  $('.small-icon.list-icon', context).css({
	    'background': 'url('+chrome.extension.getURL('/resources/images/slide-show-btn.png')+') no-repeat',
	    'background-position': 'top left'
	  });
	}


	/**
	 * 	@method renderSlideShow, Prepends a slideshow to the wrapper of the body
   *	@param listNumber
   *    The used index for list
   *	@result void
	 */
	C.renderSlideShow = function(listNumber) {
    if($('#sc-slide-show').length > 0){
    	$('#sc-slide-show').remove();
    }
    C.prependSlideShow();
    C.renderLayout();
    C.createList(listNumber);
	}


	/**
	 *  @method
	 *   prependSlideShow, Prepends a slideshow to the wrapper of the body
	 *  @result
	 *   BOOL or void
	 */
	C.prependSlideShow = function () {

    if($('#sc-slide-show').length > 0){
        return false;
    }
    SLIDE_SHOW_ELEMENT = $('<div id=\'sc-slide-show\' class=\'hidden\'></div>')[0];
    $(document.body).prepend(SLIDE_SHOW_ELEMENT);
	}


	/**
	 *  @method
	 *    renderLayout, render the layout of the slideshow
	 *  @result
	 *    BOOL or void
	 */
	C.renderLayout = function() {
		if($('#sc-body').length > 0){
			return false;
		}

    clearInterval(INTERVAL_REFERENCE);

    // Body
		var body = $('<div id=\'sc-body\'></div>')[0];
		$(SLIDE_SHOW_ELEMENT).append(body);
    INITIAL_BODY_WIDTH = $(body).width();
    BODY_HEIGHT = $(window).height();

    // Ticket
    C.ticket = $('<div id=\'sc-ticket\'></div>')[0];
    $(C.ticket).css('top', window.innerHeight * 0.3);
		$(body).append(C.ticket);

    // Helper animation
    C.topHelperAnimation = $('<div id=\'sc-top-helper-animation\' class=\'helper-animation\'></div>')[0];
    $(body).append(C.topHelperAnimation);
    C.bottomHelperAnimation = $('<div id=\'sc-bottom-helper-animation\' class=\'helper-animation\'></div>')[0];
    $(body).append(C.bottomHelperAnimation);

    // Buttons
    C.leftBtn = $('<div id=\'sc-left-btn\'></div>')[0];
		$(body).append(C.leftBtn);
		$(C.leftBtn).click(C.slideshow.showPrevCard);
		C.rightBtn = $('<div id=\'sc-right-btn\'></div>')[0]
		$(body).append(C.rightBtn);
		$(C.rightBtn).click(C.slideshow.showNextCard);
		C.ticketList = $('<ul id=\'sc-ticket-list\'></ul>')[0];
		$(body).append(C.ticketList);

    // Exit button
		C.exitBtn = $('<img id=\'sc-exit-btn\'></img>')[0]
		C.exitBtn.src = chrome.extension.getURL('/resources/images/exit-btn.png');
		$(C.exitBtn).click(C.slideshow.exit);
		$(SLIDE_SHOW_ELEMENT).append(C.exitBtn);

		//Unbind for performance
		$('.list-icon').unbind();
	}


	/**
	 *  @method getTitle, gets the title of a card
	 *  @param card
	 *  @result
	 *    string title
	 */
	C.getTitle = function(card){

    var title = $(card).find('.list-card-title').text(),
    removalOfPointsRegEx = /(#\d+)/g,
    pointsRegEx = /#\d+/,
    points = title.match(pointsRegEx),
    title = points + ' ' + $.trim(title.replace(removalOfPointsRegEx, ''));
    return title;
	}


	/**
	 *  @method
	 *      createList, gets the title of a card
	 *  @param listNumber
	 *  @result
	 *      void
	 */
	C.createList = function(listNumber) {
		var n = 0;
		$('.list:eq('+listNumber+') .list-card').each(function(){
			var title = C.getTitle(this);
			listCard = $('<li class=\'sc-list-item\' sc-index=\''+n+'\'>'+title+'</li>')
			.appendTo(C.ticketList)
			.click(function(){
				C.slideshow.showCard(this);
			});

			// Show first card
			if(n == 0)
				C.slideshow.showCard(listCard);
			n++;
		});
		MAX_INDEX = n;

		//Remove list for performance
		setTimeout(function () {
			$('.list').remove();
		}, 0);

	}


	/**
	 *  @method
	 *      attachSlideshowHandler, attach slideshowhandler
	 *  @result
	 *      void
	 */
	C.attachSlideshowHandler = function() {

		var n = -1;
		$('.list-icon').each(function() {
			$(this).click(function(){
        CURR_LIST = $(this).attr('list-number');
        C.renderSlideShow(CURR_LIST);
        $(this).unbind();
			})
			.attr('list-number', n);
			n++;
		});
	}


	// Dont touch this!
	C.constructor();
	return C;

})(jQuery);



