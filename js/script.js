var data = [
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Las_Widok_5.JPG',
    title: 'Title 1',
    description: 'My description 1',
    numb: 1,
    coords: {lat: -25.363, lng: 131.044}
  },
  {
    image: 'http://navtur.pl/files/plc_pano/4557.jpg',
    title: 'Title 2',
    description: 'My description 2',
    numb: 2,
    coords: {lat: -20.363, lng: 111.044}
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Las_mlocinski.jpg/240px-Las_mlocinski.jpg',
    title: 'Title 3',
    description: 'My description 3',
    numb: 3,
    coords: {lat: -15.363, lng: 118.044}
  },
  {
    image: 'https://i.imged.pl/obraz-las-zima-piowart.jpg',
    title: 'Title 4',
    description: 'My description 4',
    numb: 4,
    coords: {lat: -13.363, lng: 141.044}
  },
  {
    image: 'https://www.tapeciarnia.pl/tapety/normalne/246355_jez_liscie_drzewo_las_jesien.jpg',
    title: 'Title 5',
    description: 'My description 5',
    numb: 5,
    coords: {lat: -27.363, lng: 111.044}
  }
];
// wyrenderowanie html za pomocą mustache
mustacheRender();

// zmienne do slidera flkty - globalnie, bo używane w funkcji flktySlider() i initMap()
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
  // Następnie zoptymalizujemy drugą z nich, ponieważ tylko ona będzie wykonywana wielokrotnie.
  Mustache.parse(templateItem);
  // Teraz stworzymy zmienną, w której chcemy mieć kod HTML wszystkich produktów.
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

function initMap() {
  // współrzędne z pierwszego slajdu
  var initCoords = data[0]['coords'];
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: initCoords
  });

  for (var i=0; i < data.length;i++) {
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

  // Następnie dodajemy akcję do guzika, dokładnie tak samo jak robiliśmy to w poprzednim module.
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
      console.log(index);
    smoothPanAndZoom(map, 3, data[index].coords);
  });
} 

var smoothPanAndZoom = function(map, zoom, coords){
// Trochę obliczeń, aby wyliczyć odpowiedni zoom do którego ma oddalić się mapa na początku animacji.
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

// Poniższa funkcja działa bardzo podobnie do smoothZoom. Spróbuj samodzielnie ją przeanalizować. 
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
  flktySlider();
  initMap();
})();