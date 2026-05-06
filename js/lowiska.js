// Initialize Google Map with enhanced debugging
let map;
let markers = [];

function initMap() {
    console.log('Initializing Google Map...');

    if (!window.google || !window.google.maps) {
        console.error('Google Maps API failed to load. Check API key, billing, and network.');
        return;
    }

    const polandCenter = { lat: 52.215933, lng: 19.134422 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: polandCenter,
        styles: [
            { featureType: "poi", stylers: [{ visibility: "off" }] },
            { featureType: "transit", stylers: [{ visibility: "off" }] }
        ]
    });

    console.log('Map initialized successfully.');

    fetch('../json/fishingLocations.json')
        .then(response => response.json())
        .then(fishingLocations => {
            window.fishingLocations = fishingLocations;
            displayMarkers(fishingLocations);
        })
        .catch(error => console.error('Error loading fishing locations:', error));

    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
}

function displayMarkers(locations) {
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    locations.forEach(location => {
        console.log(`Adding marker for ${location.name} at [${location.lat}, ${location.lng}]`);
        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.name,
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/fishing.png",
                scaledSize: new google.maps.Size(32, 32)
            }
        });

        const infowindow = new google.maps.InfoWindow({
            content: `
                <h3>${location.name}</h3>
                <p><strong>Okręg:</strong> ${location.district || 'Brak danych'}</p>
                <p><strong>Województwo:</strong> ${location.voivodeship || 'Brak danych'}</p>
                <p><strong>Główne ryby:</strong> ${(location.fish || []).join(', ') || 'Brak danych'}</p>
                <p><strong>Typ:</strong> ${location.type || 'Brak danych'}</p>
            `
        });

        marker.addListener('click', () => {
            infowindow.open(map, marker);
        });

        markers.push(marker);
    });
}

function applyFilters() {
    const nameFilter = document.getElementById('nameFilter').value.toLowerCase();
    const voivodeshipFilter = document.getElementById('voivodeshipFilter').value;
    const fishFilter = document.getElementById('fishFilter').value;

    const filteredLocations = window.fishingLocations.filter(location => {
        const matchesName = nameFilter ? location.name.toLowerCase().includes(nameFilter) : true;
        const matchesVoivodeship = voivodeshipFilter ? location.voivodeship === voivodeshipFilter : true;
        const matchesFish = fishFilter ? (location.fish || []).includes(fishFilter) : true;

        return matchesName && matchesVoivodeship && matchesFish;
    });

    displayMarkers(filteredLocations);
}

function resetFilters() {
    document.getElementById('nameFilter').value = '';
    document.getElementById('voivodeshipFilter').value = '';
    document.getElementById('fishFilter').value = '';
    displayMarkers(window.fishingLocations);
}

window.initMap = initMap;

window.onerror = function(message, url, line, col, error) {
    console.error('Error loading Google Maps:', message, 'URL:', url, 'Line:', line, 'Column:', col, 'Error:', error);
};