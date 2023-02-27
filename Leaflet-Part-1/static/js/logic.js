//get the Geojson URL
var earthquakesQeryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  // Create our map initialization
  var myMap =  L.map('map', {
    center: [37.0902, 95.7129],
    zoom: 6,
  });

// Perform a GET request to the query URL
d3.json(earthquakesQeryURL).then(function(data){
  L.geoJson(data,{
    pointToLayer: function (feature, latlng) {
        // Create a circle marker
        return L.circleMarker(latlng, {
            radius: getRadius(feature.properties.mag),
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            stroke: true,
            fillOpacity: 0.8
        });
    },
    onEachFeature: function(feature, layer){
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><span>Magnitude: ${feature.properties.mag}</span>`)
  }
}).addTo(myMap);
 

// Circles color palette based on mag (feature) data marker
// data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. 
//Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
function chooseColor(depth){
    switch(true){
        case depth > 90:
            return "red";
          case depth > 70:
            return "orangered";
          case depth > 50:
            return "orange";
          case depth > 30:
            return "gold";
          case depth > 10:
            return "yellow";
          default:
            return "lightgreen";   
    }
}

function getRadius(mag){
    return mag * 4;
};

// Create map legend to provide context for map data
var legend = L.control({position: "bottomright"});

legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend");
    var depth = [-10, 10, 30, 50, 70, 90];
    var labels = [];
    var legendInfo = "<h4>Magnitude</h4>";

    div.innerHTML += "<h4>Earthquake Depth</h4><hr>"

    //go through each magnitude item to label and color the legend
   // push to labels array as list item
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
        '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
        depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
});
// Create map
   // Define street map and topographical map
   var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
//}
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "OpenStreetMap": osm,
    "TopographicalMap": topo
  };

  // Add the layer control to the map
  L.control.layers(baseMaps).addTo(myMap);


