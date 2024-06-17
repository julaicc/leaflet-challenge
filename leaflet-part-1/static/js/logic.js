
let earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a map and set its initial view
let myMap = L.map('map').setView([0, 0], 2);

// Define base layers
let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
});

let satelliteMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://opentopomap.org/">OpenTopoMap</a> contributors',
    maxZoom: 18,
});

let greyscaleMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 18,
});

// Add the default base layer to the map
streetMap.addTo(myMap);


// URL to fetch the GeoJSON data for earthquakes
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetching our GeoJSON data
d3.json(link).then(function(data) {
    L.geoJson(data, {
        
        
            pointToLayer: function(feature, latlng) {
                // Extract latitude and longitude
                const latitude = latlng.lat;
                const longitude = latlng.lng;


                // Creamos marcaodres ciruclares
                return L.circleMarker([latitude, longitude], {
                    radius: getRadius(feature.properties.mag),
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },

            // Popup
            onEachFeature: (feature, layer) => {
                layer.bindPopup(`
                    <strong>Location:</strong> ${feature.properties.place}<br>
                    <strong>Magnitude:</strong> ${feature.properties.mag}<br>
                    <strong>Depth:</strong> ${feature.geometry.coordinates[2]}<br>
                    <strong>Time:</strong> ${new Date(feature.properties.time).toLocaleString()}
                `);
            }
        }).addTo(myMap);
    });

    //color segun depth 
    function getColor(depth) {
        return depth > 90 ? '#FF0000' :    
               depth > 70 ? '#FF4500' :    
               depth > 50 ? '#FFA500' :    
               depth > 30 ? '#FFD700' :    
               depth > 10 ? '#ADFF2F' :    
                            '#00FF00';      
    }

// Function to get marker radius based on magnitude
function getRadius(magnitude) {
    return magnitude ? magnitude * 4 : 1;
}

// Create legend control and specify its position
let legend = L.control({ position: 'bottomright' });

// Function to add legend to the map
legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'legend'); 

    // Define legend content directly based on depth conditions
    div.innerHTML =
        '<i style="background:#FF0000"></i> 90+<br>' +
        '<i style="background:#FF4500"></i> 70&ndash;90<br>' +
        '<i style="background:#FFA500"></i> 50&ndash;70<br>' +
        '<i style="background:#FFD700"></i> 30&ndash;50<br>' +
        '<i style="background:#ADFF2F"></i> 10&ndash;30<br>' +
        '<i style="background:#00FF00"></i> 0&ndash;10';

    return div; // Return the div element
};

// Add legend to the map
legend.addTo(myMap);