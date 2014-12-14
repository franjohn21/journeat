
var journeatApp = angular.module('journeatApp', []);

journeatApp.controller('journeatCtrl', function($scope){
  $scope.start = "633 Folsom St, San Francisco, CA";
  $scope.end = "1722 18th Ave, San Francisco, CA";
  $scope.search = ""
  var marker, infowindow, startlat, startlng, endlat, endlng;

  function addMarkers(results, status)
  {

    if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
          marker = new google.maps.Marker({
          map: map
       });
    marker.setPosition(results[0].geometry.location);
    infowindow = new google.maps.InfoWindow();
    var content = '<strong>' + results[0].formatted_address + '</strong>';
    infowindow.setContent(content);
    infowindow.open(map, marker);
    }
  }

  var mapOptions = {
    center: new google.maps.LatLng(37.7833, -122.4167),
    zoom: 6
  };

  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();

  directionsDisplay.setMap(map);

  $scope.handleQuery = function() {
    var geocoder = new google.maps.Geocoder();

    var startRequest = {
      address: $scope.start
    }

    var endRequest = {
      address: $scope.end
    }

    var request = {
      origin: $scope.start,
      destination: $scope.end,
      travelMode: google.maps.TravelMode.DRIVING
    }

    directionsService.route(request, function(response, status){
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
        }).done(function(data){
          console.log(data)
        });
      }
    });
  }
})
