var map;
var markerForPizza;
var markerForHome = null;
var directionsDisplay;
var pointPizza = new google.maps.LatLng(50.464379,30.519131);
var directionsService = new google.maps.DirectionsService();
var order = require('./OrderValid');


function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var mapProp = {
        center: pointPizza,
        zoom: 11
    };
    var html_element = document.getElementById("googleMap");
    map = new google.maps.Map(html_element, mapProp);
    directionsDisplay.setMap(map);
    directionsDisplay.setOptions( { suppressMarkers: true } );
    markerPizza();
    addLisner();
}

function geocodeLatLng(latlng, callback){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location':	latlng}, function(results, status)	{
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[1])	{
            var address = results[1].formatted_address;
            $('#inputAdress').val(address);
            $('.order-summery-adress').html('<b>Адреса доставки:</b> '+address);
            callback(null, address);
        }else{
            callback(new Error("Can't find adress"));
        }
    });
}

function addLisner(){
    google.maps.event.addListener(map,
        'click',function(me){
            var  coordinates	=	me.latLng;
            geocodeLatLng(coordinates, function(err, adress){
                if(!err){
                    markerHome(coordinates);
                    order.setValidateAddressTrue();

                }else{
                    console.log("Немає адреси")
                }
            })
        });
}

function markerPizza() {
    markerForPizza = new google.maps.Marker({
        position: pointPizza,
        map: map,
        icon: "assets/images/map-icon.png"
    });
}

function markerHome(point) {
    if(markerForHome!=null) markerForHome.setMap(null);
    markerForHome = new google.maps.Marker({
        position: point,
        map: map,
        icon: "assets/images/home-icon.png"
    });
    calculateRoute(pointPizza, point);
}

function calculateRoute(A_latlng, B_latlng)	{
    var request = {
        origin:A_latlng,
        destination:B_latlng,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
            var leg = result.routes[0].legs[0];
            $('.order-summery-time').html('<b>Приблизний час доставки:</b> '+leg.duration.text);
        }else{
            console.log("Немає адреси");
        }
    });
}

function geocodeAddress(address,	 callback)	{
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[0])	{
            var coordinates	= results[0].geometry.location;
            markerHome(coordinates);
            calculateRoute(pointPizza,coordinates);
            callback(null,	coordinates);
        }else{
            callback(new Error("Can	not	find the address"));
        }
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

exports.geocodeAddress=geocodeAddress;
exports.calculateRoute=calculateRoute;
exports.pointPizza = pointPizza;