var elem = document.querySelector('.carousel');
var flkty = new Flickity(elem, {
  cellAlign: 'left',
  contain: true,
  prevNextButtons: false,
  pageDots: false,
  hash: true,
});

function mustacheRender() {
  var templateList = document.getElementById('template-slider').innerHTML;
  var templateItem = document.getElementById('template-slider-item').innerHTML;

  Mustache.parse(templateItem);
  var listItems = '';

  for(var i = 0; i < data.length; i++){
    listItems += Mustache.render(templateItem, data[i]);
  }

  var fullList = Mustache.render(templateList, {slider: listItems});
  results.insertAdjacentHTML('beforeend', fullList);
}

function flktySlider() {
  var nextButton = document.querySelector('.button-next');
  nextButton.addEventListener('click', function() {
    flkty.next();
  });

  var previousButton = document.querySelector('.button-previous');
  previousButton.addEventListener('click', function() {
    flkty.previous();
  });

  var progressBar = document.querySelector('.progress-bar')

  flkty.on( 'scroll', function( progress ) {
    progress = Math.max( 0, Math.min( 1, progress ) );
    progressBar.style.width = progress * 100 + '%';
  });
}

mustacheRender();
flktySlider();