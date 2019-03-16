var map;
function mustacheRender() {
  var templateList = document.getElementById('template-slider').innerHTML;
  var templateItem = document.getElementById('template-slider-item').innerHTML;

  Mustache.parse(templateItem);
  var listItems = '';

  for (var i = 0; i < data.length; i++){
    listItems += Mustache.render(templateItem, data[i]);
  }

  var fullList = Mustache.render(templateList, {slider: listItems});
  results.insertAdjacentHTML('beforeend', fullList);
}

function flktySlider() {
  var elem = document.querySelector('.carousel');
  var flkty = new Flickity(elem, {
    cellAlign: 'left',
    contain: true,
    prevNextButtons: false,
    pageDots: false,
    hash: true,
  });
  var nextButton = document.querySelector('.button-next');
  nextButton.addEventListener('click', function() {
    flkty.next();
  });

  var previousButton = document.querySelector('.button-previous');
  previousButton.addEventListener('click', function() {
    flkty.previous();
  });

  var progressBar = document.querySelector('.progress-bar')

  flkty.on('scroll', function(progress) {
    progress = Math.max( 0, Math.min( 1, progress ) );
    progressBar.style.width = progress * 100 + '%';
  });

  flkty.on('change', function(index) {
    smoothPanAndZoom(map, 7, data[index].coords );
  });
}

function initMap() {
  // coordinates from the first slide
  var initCoords = data[0]['coords'];
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: initCoords
  });

  for (var i = 0; i < data.length; i++) {
    var marker = new google.maps.Marker({
        position: data[i]['coords'],
        map: map
      });

    (function(i) {
      google.maps.event.addListener(marker, 'click', function() {
        flkty.select(i);
      });
    })(i);
  }

  document.getElementById('center-map').addEventListener('click', function(event){
    event.preventDefault();
    map.panTo(sydney); 
    map.setZoom(10);
  });

  document.getElementById('center-smooth').addEventListener('click', function(event){
    event.preventDefault();
    smoothPanAndZoom(map, 7, uluru);
  });
} 

var smoothPanAndZoom = function(map, zoom, coords){
var jumpZoom = zoom - Math.abs(map.getZoom() - zoom);
jumpZoom = Math.min(jumpZoom, zoom -1);
jumpZoom = Math.max(jumpZoom, 3);
 
smoothZoom(map, jumpZoom, function(){
  smoothPan(map, coords, function(){
    smoothZoom(map, zoom); 
  });
});
};

var smoothZoom = function(map, zoom, callback) {
  var startingZoom = map.getZoom();
  var steps = Math.abs(startingZoom - zoom);

  if(!steps) {
    if(callback) {
      callback();
    }
    return;
  }

  var stepChange = - (startingZoom - zoom) / steps;

  var i = 0;
  var timer = window.setInterval(function(){
    if(++i >= steps) {
      window.clearInterval(timer);
      if(callback) {
        callback();
      }
    }
    map.setZoom(Math.round(startingZoom + stepChange * i));
  }, 80);
};

var smoothPan = function(map, coords, callback) {
  var mapCenter = map.getCenter();
  coords = new google.maps.LatLng(coords);

  var steps = 12;
  var panStep = {lat: (coords.lat() - mapCenter.lat()) / steps, lng: (coords.lng() - mapCenter.lng()) / steps};

  var i = 0;
  var timer = window.setInterval(function(){
    if(++i >= steps) {
      window.clearInterval(timer);
      if(callback) callback();
    }
    map.panTo({lat: mapCenter.lat() + panStep.lat * i, lng: mapCenter.lng() + panStep.lng * i});
  }, 1000/30);
};

(function(){
  mustacheRender();
  initMap();
  flktySlider();
})();
