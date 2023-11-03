// Get URL
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson'
// Set the map
let map = L.map("map", {
    center: [
        40.7, -94.5
    ],
    zoom: 4
});
// We create the tile layer that will be the background of our map.

L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
    {
        attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }).addTo(map);

// Create a legend control object.
let legend = L.control({ position: "bottomright" });

// Add legend
legend.onAdd = function (map) {
    let div = L.DomUtil.create("div", "info legend");
    let depth = [-10, 10, 30, 50, 70, 90];

    div.innerHTML += "<h3 style='text-align: center'>Depth</h3>";
    for (let i = 0; i < depth.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depth[i] + 1) + '; width: 20px; height: 20px; display: inline-block;"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(map)


//Fetch JSON data
d3.json(url).then(function (data) {
    L.geoJSON(data, {
        pointToLayer: pointToLayer,
        onEachFeature: onEachFeature


    }).addTo(map);
})

// Create a function to add the circle markes and its properties 
function pointToLayer(geoJsonPoint, latlng) {

    return L.circleMarker(latlng, {
        radius: geoJsonPoint.properties.mag * 3,
        color: getColor(geoJsonPoint.geometry.coordinates[2]),
        fillColor: getColor(geoJsonPoint.geometry.coordinates[2]),
        opacity: .3,
        fillOpacity: .3



    });
}

// Create functions and loop through the depth of the earthquake nand assign color accordingly.
function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
 }
function getColor(depth) {
    let color = "";
    switch (true) {
        case depth > 90:
          return "#ea2c2c";
        case depth > 70:
          return "#ea822c";
        case depth > 50:
          return "#ee9c00";
        case depth > 30:
          return "#eecc00";
        case depth > 10:
          return "#d4ee00";
        default:
          return "#98ee00";
      }
    
    return color;

}
