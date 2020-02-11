import 'leaflet/dist/leaflet.css'
import * as $L from 'leaflet'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = $L.icon({
  iconUrl: icon,
  iconAnchor: [0, 41],
  shadowUrl: iconShadow
});
$L.Marker.prototype.options.icon = DefaultIcon;
const blueIcon = new $L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})
const greyIcon = new $L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const createMap = (divId,options) => {
  let map = $L.map(divId,options)
  return map
}
const createTileLayer = async (map, url, options) => {
  let tileLayer = await $L.tileLayer(url, options)
  tileLayer.addTo(map)
  return tileLayer
}
const createIcon = options => {
  return $L.icon(options);
}
const createMakerByXY = (map, coordinate, options = {}) => {
  let marker = $L.marker($L.latLng(coordinate[0], coordinate[1]), options);
  marker.addTo(map);
  return marker;
}
const createMakerByLatLng = (latLng, options) => {
  return $L.marker(latLng, options);
}
const createMakerCluster = () => {
  return $L.markerClusterGroup()
}

export default { 
  createMap,
  createTileLayer,
  createIcon,
  createMakerByXY,
  createMakerCluster,
  createMakerByLatLng,
  blueIcon,
  greyIcon
}
