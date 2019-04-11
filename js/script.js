var data = [
  {
    image:  '../images/china.jpg',
    title: 'China',
    description: 'First page',
    numb: 1,
    coords: {lat: 40.363, lng: 88.044}
  },
  {
    image: '../images/sudan.jpg',
    title: 'Sudan',
    description: 'Second page',
    numb: 2,
    coords: {lat: 13.363, lng: 26.044}
  },
  {
    image: '../images/kanguru.jpg',
    title: 'Australia',
    description: 'Third page',
    numb: 3,
    coords: {lat: -15.363, lng: 118.044}
  },
  {
    image: '../images/antarctica.jpg',
    title: 'Antarctica',
    description: 'Fourth page',
    numb: 4,
    coords: {lat: -79.363, lng: 171.044}
  },
  {
    image: '../images/russia.jpg',
    title: 'Russia',
    description: 'Fifth page',
    numb: 5,
    coords: {lat: 66.363, lng: 111.044}
  }
];
var numberOfData = data.length;
// HTML mustache using the mustache to be able to manipulate the slider's html elements.
mustacheRender();

var elem = document.querySelector('.carousel');
var nextButton = document.querySelector('.button-next');
var previousButton = document.querySelector('.button-previous');
var progressBar = document.querySelector('.progress-bar');
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

  for (var i = 0; i < numberOfData; i++) {
    listItems += Mustache.render(templateItem, data[i]);
  }

  var fullList = Mustache.render(templateList, {slider: listItems});
  results.insertAdjacentHTML('beforeend', fullList);
}

function flktySlider() {
  nextButton.addEventListener('click', function() {
    flkty.next();
  });

  previousButton.addEventListener('click', function() {
    flkty.previous();
  });

  flkty.on( 'scroll', function( progress ) {
    progress = Math.max( 0, Math.min( 1, progress ) );
    progressBar.style.width = progress * 100 + '%';
  });
}

function initMap() {
  var initCoords = data[0]['coords'];
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: initCoords
  });

  for (var i=0; i < numberOfData; i++) {
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
    map.panTo(initCoords);
    map.setZoom(10);
  });

  document.getElementById('center-smooth').addEventListener('click', function(event){
    event.preventDefault();
    smoothPanAndZoom(map, 7, initCoords);
  });

  flkty.on( 'change', function(index) {
    smoothPanAndZoom(map, 3, data[index].coords);
  });
} 

function smoothPanAndZoom (map, zoom, coords){
  var jumpZoom = zoom - Math.abs(map.getZoom() - zoom);
  jumpZoom = Math.min(jumpZoom, zoom -1);
  jumpZoom = Math.max(jumpZoom, 3);

  smoothZoom(map, jumpZoom, function(){
    smoothPan(map, coords, function(){
      smoothZoom(map, zoom); 
    });
  });
};

function smoothZoom (map, zoom, callback) {
  var startingZoom = map.getZoom();
  var steps = Math.abs(startingZoom - zoom);

  if (!steps) {
    if (callback) {
      callback();
    }
    return;
  }

  var stepChange = - (startingZoom - zoom) / steps;
  var i = 0;
  var timer = window.setInterval(function(){
    if (++i >= steps) {
      window.clearInterval(timer);
      if (callback) {
        callback();
      }
    }
    map.setZoom(Math.round(startingZoom + stepChange * i));
  }, 80);
};

function smoothPan (map, coords, callback) {
  var mapCenter = map.getCenter();
  coords = new google.maps.LatLng(coords);
  var steps = 12;
  var panStep = {lat: (coords.lat() - mapCenter.lat()) / steps, lng: (coords.lng() - mapCenter.lng()) / steps};
  var i = 0;
  var timer = window.setInterval(function(){
    if (++i >= steps) {
      window.clearInterval(timer);
      if (callback) callback();
    }
    map.panTo({lat: mapCenter.lat() + panStep.lat * i, lng: mapCenter.lng() + panStep.lng * i});
  }, 1000/30);
};

(function(){
  flktySlider();
  initMap();
})();