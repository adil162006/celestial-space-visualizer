mapboxgl.accessToken = maptoken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: issCoordinates,
  zoom: 2
});

new mapboxgl.Marker({ color: 'red' })
  .setLngLat(issCoordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML("<h5>ISS Location</h5>"))
  .addTo(map);
