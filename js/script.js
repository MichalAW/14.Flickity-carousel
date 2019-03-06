var elem = document.querySelector('.carousel');
var flkty = new Flickity( elem, {
  // options
 	cellAlign: 'left',
 	contain: true,
  	prevNextButtons: false,
	pageDots: false,
	hash: true,
});

var flkty = new Flickity('.carousel');

var previousButton = document.querySelector('.button-previous');
previousButton.addEventListener( 'click', function() {
  flkty.previous();
});

var progressBar = document.querySelector('.progress-bar')

flkty.on( 'scroll', function( progress ) {
  progress = Math.max( 0, Math.min( 1, progress ) );
  progressBar.style.width = progress * 100 + '%';
});
