// variables to the fltor slider - globally, because used in the flktSlider () and initMap () functions
var elem = document.querySelector('.carousel');
var flkty = new Flickity(elem, {
  // options
  cellAlign: 'left',
  contain: true,
  prevNextButtons: false,
  pageDots: false,
  hash: true,
});

function mustacheRender() {
  var templateList = document.getElementById('template-slider').innerHTML;
  var templateItem = document.getElementById('template-slider-item').innerHTML;

  // Then we will optimize the second one, because only it will be performed repeatedly.
  Mustache.parse(templateItem);
  // Now we will create a variable in which we want to have the HTML code of all products.
  var listItems = '';

  for (var i = 0; i < data.length; i++){
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

function initMap() {
  // coordinates from the first slide
  var initCoords = data[0]['coords'];
  var map = new google.maps.Map(document.getElementById('map'), {
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

  // Then we add the action to the button, exactly the same as we did in the previous module.
  document.getElementById('center-map').addEventListener('click', function(event){
    event.preventDefault();
    // First, we use the panTo method in the map object to move the coordinates of the map:
    map.panTo(sydney);
    
    // And then we change the magnification of the map:
    map.setZoom(10);
  });

  document.getElementById('center-smooth').addEventListener('click', function(event){
    event.preventDefault();
    smoothPanAndZoom(map, 7, uluru);
  });
} 

var smoothPanAndZoom = function(map, zoom, coords){
// A little calculation to calculate the appropriate zoom to which the map at the beginning of the animation should move away.
var jumpZoom = zoom - Math.abs(map.getZoom() - zoom);
jumpZoom = Math.min(jumpZoom, zoom -1);
jumpZoom = Math.max(jumpZoom, 3);

// We start from the distance of the map to the calculated magnification. 
smoothZoom(map, jumpZoom, function(){
  // Then, move the map to the desired coordinates.
  smoothPan(map, coords, function(){
    // At the end, we enlarge the map to the desired magnification.
    smoothZoom(map, zoom); 
  });
});
};

var smoothZoom = function(map, zoom, callback) {
  var startingZoom = map.getZoom();
  var steps = Math.abs(startingZoom - zoom);

  // If steps == 0, so startingZoom == zoom
  if(!steps) {
    // If the third argument is given
    if(callback) {
      // Call the function given as the third argument.
      callback();
    }
    // Exit the function
    return;
  }

  // A bit of mathematics, thanks to which we get -1 or 1, depending on whether startingZoom is smaller than zoom
  var stepChange = - (startingZoom - zoom) / steps;

  var i = 0;
  // We call setInterval, which will execute the function every X milliseconds (X given as the second argument, in our case 80)
  var timer = window.setInterval(function(){
    // If the right number of steps has been taken
    if(++i >= steps) {
      // Clear the timer, i.e., stop the function given in the setInterval above
      window.clearInterval(timer);
      // If the third argument is given
      if(callback) {
        // Execute the function given as the third argument
        callback();
      }
    }
    // Use the setZoom method of the map object to change the magnification to the rounded result of the calculation below
    map.setZoom(Math.round(startingZoom + stepChange * i));
  }, 80);
};

// The following function works very much like smoothZoom. Try to analyze it yourself.
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
// rendering the html with a mustache
mustacheRender();
flktySlider();
initMap();