// // Define earthquakes plates GeoJSON url variable
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL
d3.json(queryURL).then(function(data){
  // Once it get a response, send the data.features and data.features object to the createFeatures function.
  createFeatures(data.features);
});


function createFeatures(earthquakeData, platesData){

// popup displays the place and time of the earthquakes
  function onEachFeature(feature, layer){
      layer.bindPopup(`<h3>Where: ${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}
      </p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Number of "Felt" Reports: ${feature.properties.magType}`);
  }


// Create a GeoJSON layer containing the features array on the earthquakeData object
  function createCircleMarker(feature, latlng){
    let options = {
     radius:feature.properties.mag*5,
     fillColor: chooseColor(feature.properties.mag),
     color: chooseColor(feature.properties.mag),
     weight: 1,
     opacity: 0.8,
     fillOpacity: 0.35
    } 
    return L.circleMarker(latlng,options);
  }

// Create a variable for earthquakes to house latlng, each feature for popup, and cicrle radius/color/weight/opacity
     let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: createCircleMarker
  });
      // Send earthquakes layer to the createMap function
      createMap(earthquakes);
    }

//data markers reflect magnitude and depth base on size and color
function chooseColor(mag){
  switch(true){
      case(1.0 <= mag && mag <= 2.5):
          return "#43c92b"; 
      case (2.5 <= mag && mag <=4.0):
          return "#2a7e1b";
      case (4.0 <= mag && mag <=5.5):
          return "#0571BB";
      case (5.5 <= mag && mag <= 8.0):
          return "#BC3500";
      case (8.0 <= mag && mag <=20.0):
          return "#E71837";
      default:
          return "#E2FFAE";
  }
}

//create legend
let legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [1.0, 2.5, 4.0, 5.5, 8.0];
    var labels = [];
    var legendInfo = "<h4>Magnitude</h4>";

    div.innerHTML = legendInfo
   
    for (var i = 0; i < grades.length; i++) {
      labels.push('<ul style="background-color:' + chooseColor(grades[i] + 1) + '"> <span>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '' : '+') + '</span></ul>');
    }

// add each label list item to the div under the <ul> tag
  div.innerHTML += "<ul>" + labels.join("") + "</ul>";

return div;
};


//create tile base layers
function createMap(earthquakes){
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

//topographical layer
var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

//create baseMaps object
var baseMaps = {
  "Open Street Map": osm,
  "Topographical Map": OpenTopoMap
};

// //create overlay layer
var overlayMap = {
   "Earthquakes": earthquakes
};

// //create the map
var myMap = L.map("map", {
  center: [37.09, 95.71],
  zoom: 5,
  layers: [osm, earthquakes]
});

 // add layer control to map
L.control.layers(baseMaps, overlayMap, {
  collapsed: false
}).addTo(myMap);
legend.addTo(myMap);
}