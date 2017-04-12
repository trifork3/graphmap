var mapcenter = { lat: 40.2948281, lng: -74.7305927 };
var map = null;
var markers = [];

// create the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: mapcenter
    });
}

// place the nodes on the map and add them to the marker array when the JSON is submitted
function loadJSON() {
    form = document.getElementById('json');
    json = form.elements[0].value;

    var data = JSON.parse(json);

    data.forEach(function(node) {
        pos = { lat: node["lat"], lng: node["lon"] };
        markers.push(new google.maps.Marker({
            position: pos,
            map: map
        }));
    });
}
