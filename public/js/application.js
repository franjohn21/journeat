var journeatApp = angular.module('journeatApp', []);

journeatApp.controller('journeatCtrl', function($scope) {
  $scope.start = "633 Folsom St, San Francisco, CA";
  $scope.end = "1722 18th Ave, San Francisco, CA";
  $scope.search = ""

  var startlat, startlng, endlat, endlng;
  var markers = [];

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
      '<img class="info-rating" src="' + data.rating + '" />',
      '<p class="info-text">' + data.snippet + '</p>',
      '</div>'
    ].join('');

    var infowindow = new google.maps.InfoWindow({
      content: content,
      maxWidth: 300
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });

    markers.push(marker);
  };

  var mapOptions = {
    center: new google.maps.LatLng(37.7833, -122.4167),
    zoom: 12
  };

  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  var numrequests = 15
  directionsDisplay.setMap(map);

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
        console.log(response)
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
