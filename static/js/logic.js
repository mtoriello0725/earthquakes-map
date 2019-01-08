var query_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

d3.json(query_url, function(data) {
  createFeatures(data.features)
});

function createFeatures(earthquakeData) {
  function onEachFeature(feature, layer) {
    // layer.bindPopup
    console.log(feature.properties.mag)
  }
  var earthquakes = L.geoJSON(earthquakeData, {
    // on each feature, run the function "onEachFeature"

    pointToLayer: function (feature, latlng) {

      function colorFill(radius) {
        if (radius > 6.5) {
          return "rgb(255,0,0)";
        }
        else if (radius > 6.17) {
          return "rgb(210,40,0)";
        }
        else if (radius > 5.83) {
          return "rgb(170,80,0)";
        }
        else if (radius > 5.5) {
          return "rgb(125,125,0)";
        }
        else if (radius > 5.17) {
          return "rgb(80,170,0)";
        }
        else if (radius > 4.83) {
          return "rgb(40,210,0)";
        }
        else {
          return "rgb(0,255,0)";
        }
      }

      var geojsonMarkerOptions = {
        radius: (feature.properties.mag - 4.5) * 20,
        fillColor: colorFill(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
  })

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
  })

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  }

  // Create a new map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control containing our baseMaps
  // Be sure to add an overlay Layer containing the earthquake GeoJSON
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}