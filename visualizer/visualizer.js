var mapcenter = { lat: 40.2948281, lng: -74.7305927 };
var map = null;
var markers = [];
var data = [];

var firstnode = -1;
var secondnode = -1;

var lineColor = '#FF0000';

// create the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: mapcenter
    });
}

// connect two selected nodes both visually and backend-ly
function connectNodes() {
    data[firstnode]["neighbors"].push(secondnode);
    data[firstnode]["numnodes"]++;
    data[secondnode]["neighbors"].push(firstnode);
    data[secondnode]["numnodes"]++;

    var edge = new google.maps.Polyline({
        path: [ markers[firstnode].position, markers[secondnode].position ],
        strokeColor: lineColor
    });
    edge.setMap(map);

    resetSelectedNodes();
}

// reset the colors and selected node numbers
function resetSelectedNodes() {
    if (firstnode != -1) {
        markers[firstnode].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        firstnode = -1;
    }

    if (secondnode != -1) {
        markers[secondnode].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        secondnode = -1;
    }
}

// place the nodes on the map and add them to the marker array when the JSON is submitted
function loadJSON() {
    var form = document.getElementById('json');
    var json = form.elements[0].value;

    data = JSON.parse(json);

    data.forEach(function(node, index) {
        var pos = { lat: node["lat"], lng: node["lon"] };
        markers.push(new google.maps.Marker({
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            position: pos,
            map: map
        }));

        // draw the edges that already exist in the JSON
        if (node["numnodes"] > 0) {
            node["neighbors"].forEach(function(neighbor) {
                var edge = new google.maps.Polyline({
                    path: [ pos, { lat: data[neighbor]["lat"], lng: data[neighbor]["lon"] } ],
                    strokeColor: lineColor
                });
                edge.setMap(map);
            });
        }

        // add functionality to click nodes to connect them
        markers[index].addListener('click', function() {
            markers[index].setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
            if (firstnode == -1) {
                firstnode = index;

            } else if (secondnode == -1) {
                secondnode = index;
                connectNodes();
            }
        });
    });
}

// show the current JSON (with edits and all) to the user in a new window
function showJSON() {
    var newWindow = window.open();
    newWindow.document.write(JSON.stringify(data));
}
