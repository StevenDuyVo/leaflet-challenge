var map = L.map('map').setView([37.7749, -122.4194], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

function chooseColor(depth) {
    if (depth > 90) return '#FF0000'; 
    else if (depth > 70) return '#FF4500';
    else if (depth > 50) return '#FF8C00';
    else if (depth > 30) return '#FFD700';
    else if (depth > 10) return '#ADFF2F';
    else return '#7FFF00';
}

d3.json(link).then(function(data) {
    function radius(magnitude) {
        return magnitude * 4;
    }
    function mapStyle(feature) {
      return {
      radius: radius(feature.properties.mag),  
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      color: "#000",
      weight: 0.5,
      opacity: 1,
      fillOpacity: 1
    };
    }
    function quakeInfo(feature, layer) {
        layer.bindPopup('<h3>' + feature.properties.place +
        '<p>Magnitude: ' + feature.properties.mag + '</p>' +
        '<p>Depth: ' + feature.geometry.coordinates[2] + ' km</p>');
    }
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
        },
        style: mapStyle,
        onEachFeature: quakeInfo
    }).addTo(map);
});

//Assisted by ChatGPT
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
        '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(map);