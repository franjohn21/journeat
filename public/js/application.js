
var journeatApp = angular.module('journeatApp', []);

journeatApp.controller('journeatCtrl', function($scope){
  $scope.start = ""
  $scope.end = ""
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
  var map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  directionsDisplay.setMap(map);
  $scope.handleQuery = function(){
    var geocoder = new google.maps.Geocoder();

    var startRequest = {
      address: $scope.start
    }
    var endRequest = {
      address: $scope.end
    }
    geocoder.geocode(startRequest, function(results, status) {
      startlat = results[0].geometry.location.k
      startlng = results[0].geometry.location.D
      });
    geocoder.geocode(endRequest, function(results, status) {
      endlat = results[0].geometry.location.k
      endlng = results[0].geometry.location.D
      });
    var request = {
      origin: $scope.start,
      destination: $scope.end,
      travelMode: google.maps.TravelMode.DRIVING
    }
    directionsService.route(request, function(response, status){
      console.log(response)
      console.log(status)
      if (status == google.maps.DirectionsStatus.OK) {
           directionsDisplay.setDirections(response);
         }
    })
    start = {lat: startlat, lng: startlng};
    end = {lat: endlat, lng: endlng};
    $.ajax({
      url: '/search',
      method: 'POST',
      data: {start: start, end: end}
    }).done(function(data){
      console.log(data)
    })


  }

})
