var mapcenter = { lat: 40.2948281, lng: -74.7305927 };
var map = null;
var markers = [];
var data = [];

var numnodes = 0;

var firstnode = -1;
var secondnode = -1;

var lineColor = '#FF0000';

// create the map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: mapcenter
    });

    // create a new node on the map
    map.addListener('rightclick', function(e) {
        var name = prompt("Name of node?", "node" + numnodes);
        data.push({ id: numnodes,
                    name: name,
                    lat: e.latLng.lat(),
                    lon: e.latLng.lng(),
                    numnodes: 0,
                    neighbors: [] });

        createMarker(data[numnodes], numnodes);

        numnodes++;
    });
}

function createMarker(node, index) {
    var pos = { lat: node["lat"], lng: node["lon"] };
    markers.push(new google.maps.Marker({
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        position: pos,
        map: map,
        title: node["name"]
    }));

    // add functionality to right-click nodes to connect them
    markers[index].addListener('rightclick', function() {
        markers[index].setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
        if (firstnode == -1) {
            firstnode = index;

        } else if (secondnode == -1) {
            secondnode = index;
            connectNodes();
        }
    });

    // add functionality to click and delete the node
    markers[index].addListener('click', function() {
        if (confirm("Do you want to delete " + data[index]["name"] + "?") == true) {
            //console.log(data[index]);
            //console.log(markers[index]);

            // first delete the node and marker
            //data.splice(index, 1);
            markers[index].setMap(null);
            //markers.splice(index, 1);
            data[index]["id"] = -1;

            console.log(data[index]);
            //console.log(markers[index]);

            // delete all connections to the node
            data.forEach(function(i) {
                data[i]["neighbors"].replace(" " + index, "");
                data[i]["neighbors"].replace(index + " ", "");
                data[i]["neighbors"].replace(index, "");
            });
        }
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
        createMarker(node, index);

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

        numnodes++;
    });
}

// show the current JSON (with edits and all) to the user in a new window
function showJSON() {
    data.forEach(function(node, index) {
        if (node["id"] == -1) {
            data.splice(index, 1);
        }
    });

    var newWindow = window.open();
    newWindow.document.write(JSON.stringify(data));
}
