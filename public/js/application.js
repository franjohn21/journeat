var journeatApp = angular.module('journeatApp', []);

journeatApp.controller('journeatCtrl', function($scope) {
  $scope.start = "";
  $scope.end = "";
  $scope.search = ""

  var startlat, startlng, endlat, endlng;
  var markers = [];
  var infowindows = []
  var addMarkers = function(latlng, data) {
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: data.name,
      animation: google.maps.Animation.DROP
    });
    var content = [
      '<div class="info-window">',
      '<img class="info-image" src="' + data.image + '" />',
      '<a href="' + data.url + '" target="_blank" class="info-name">' + data.name + '</a>',
      '<br />',
      '<button class="routebutton" data-lat="'+latlng.lat()+'" data-long="'+latlng.lng()+'">Hot Route! </button>',
      '<br />',
      '<img class="info-rating" src="' + data.rating_image + '" />',
      '<p class="info-text">' + data.snippet + '</p>',
      '</div>'
    ].join('');

    var infowindow = new google.maps.InfoWindow({
      content: content,
      maxWidth: 300
    });
    infowindows.push(infowindow)
    google.maps.event.addListener(marker, 'click', function() {
      clearInfoWindows();
      infowindow.open(map, marker);
    });

    markers.push(marker);
  };
  var reRoute = function(data)
  {
    waylat = $(this).attr("data-lat")
    waylong = $(this).attr("data-long")
    var request = {
      origin: $scope.start,
      destination: $scope.end,
      waypoints: [{location: waylat +" "+ waylong, stopover:true  }],
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
    clearInfoWindows();

  }

  $('body').on('click', '.routebutton', reRoute)
  // google.maps.event.addListener(document.getElementsByClassName('.routebutton'), 'click', reRoute)
  var mapOptions = {
    center: new google.maps.LatLng(37.7833, -122.4167),
    zoom: 12
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  var numrequests = 10
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions-panel'));
  var clearInfoWindows = function(){
    for(var k=0; k < infowindows.length; k++){
      infowindows[k].close();
    }
  }
  var clearMarkers = function() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  };

  $scope.handleQuery = function() {
    clearMarkers();
    var request = {
      origin: $scope.start,
      destination: $scope.end,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        startlat = response.routes[0].legs[0].start_location.k;
        startlng = response.routes[0].legs[0].start_location.D;
        var coords = [
          {latitude: startlat, longitude: startlng}
        ]
        var radius = 1000
        for(var i = Math.floor(response.routes[0].overview_path.length/numrequests); i < response.routes[0].overview_path.length; i += Math.floor(response.routes[0].overview_path.length/numrequests))
        {
          console.log(i)
          var latitude = response.routes[0].overview_path[i].k
          var longitude = response.routes[0].overview_path[i].D
          coords.push({latitude: latitude, longitude: longitude})
        }
        endlat = response.routes[0].legs[0].end_location.k;
        endlng = response.routes[0].legs[0].end_location.D;
        coords.push({latitude: endlat, longitude: endlng})

        $.ajax({
          url: '/search',
          method: 'POST',
          data: {
            coords: coords,
            radius: radius,
            term: $scope.search
          }
        }).done(function(data) {
          for (var i = 0; i < data.length; i++) {
            var latlng = new google.maps.LatLng(data[i].lat, data[i].lng)
            addMarkers(latlng, data[i])
          }
        });
      }
    });
  }
});


