// Mustache
var templateList = document.getElementById('template-slider').innerHTML;
var templateItem = document.getElementById('template-slider-item').innerHTML;

// Optimaize the second one, becouse it it will be performed repeatedly.
Mustache.parse(templateItem);
// Now we will create a variable in which we want to have the HTML code of all products.
var listItems = '';

for(var i = 0; i < data.length; i++){
	listItems += Mustache.render(templateItem, data[i]);
}

var fullProductList = Mustache.render(templateList, {slider: listItems});
results.insertAdjacentHTML('beforeend', fullProductList);

//////////////

var elem = document.querySelector('.carousel');
var flkty = new Flickity( elem, {
  // our options
 	cellAlign: 'left',
 	contain: true,
  	prevNextButtons: false,
	pageDots: false,
	hash: true,
});

var nextButton = document.querySelector('.button-next');
nextButton.addEventListener( 'click', function() {
  flkty.next();
});

var previousButton = document.querySelector('.button-previous');
previousButton.addEventListener( 'click', function() {
  flkty.previous();
});

var progressBar = document.querySelector('.progress-bar')

flkty.on( 'scroll', function( progress ) {
  progress = Math.max( 0, Math.min( 1, progress ) );
  progressBar.style.width = progress * 100 + '%';
});
