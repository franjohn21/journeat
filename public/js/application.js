var journeatApp = angular.module('journeatApp', []);

journeatApp.controller('journeatCtrl', function($scope) {
  $scope.start = "633 Folsom St, San Francisco, CA";
  $scope.end = "1722 18th Ave, San Francisco, CA";
  $scope.search = ""

  var startlat, startlng, endlat, endlng;

  var addMarkers = function(latlng, name) {
    console.log(name);

    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: name,
      animation: google.maps.Animation.DROP
    });

    var content = '<strong>' + name + '</strong>';
    var infowindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'mouseover', function() {
      infowindow.open(map, marker);
    });

    google.maps.event.addListener(marker, 'mouseleave', function() {
      infowindow.close();
    });
  };

  var mapOptions = {
    center: new google.maps.LatLng(37.7833, -122.4167),
    zoom: 6
  };

  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();

  directionsDisplay.setMap(map);

  $scope.handleQuery = function() {
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
        endlat = response.routes[0].legs[0].end_location.k;
        endlng = response.routes[0].legs[0].end_location.D;

        $.ajax({
          url: '/search',
          method: 'POST',
          data: {
            start_lat: startlat,
            start_lng: startlng,
            end_lat: endlat,
            end_lng: endlng,
            term: $scope.search
          }
        }).done(function(data) {
          for (var i = 0; i < data.length; i++) {
            var latlng = new google.maps.LatLng(data[i].lat, data[i].lng)
            addMarkers(latlng, data[i].name)
          }
        });
      }
    });
  }
});
