// import { fetchMarkersData } from './getMarkers';

import { swiperMap } from '../../gulp-modules';
import mapStyle from './map-style';

export default function googleMap() {
  window.initMap = function initMap() {
    maps.forEach((mapElement, index) => {
      // ...
    });
  };
}

async function loadGoogleMapsScript() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    let key = '';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap&language=ua`;
    script.async = true;
    script.defer = true;
    script.onerror = reject;
    window.initMap = () => resolve();
    document.head.appendChild(script);
  });
}

const mapContainers = document.querySelectorAll('.map');
const observerOptions = {
  rootMargin: '0px',
  threshold: 0.1,
};

mapContainers.forEach(container => {
  const observer = new IntersectionObserver(async (entries, obs) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        obs.unobserve(container);
        await loadGoogleMapsScript();
        createMap(container);
      }
    }
  }, observerOptions);

  observer.observe(container);

  // 🔽 Додаткова перевірка – чи вже елемент видимий при завантаженні
  if (isElementInViewport(container)) {
    observer.unobserve(container); // на випадок, якщо буде дублювання
    loadGoogleMapsScript().then(() => createMap(container));
  }
});

// 👇 Допоміжна функція
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function createMap(container) {
  const gmarkers = [];
  const center = {
    lat: 50.4220083,  lng: 30.6426015
  };

  const choosedCategories = new Set();
  choosedCategories.add('main');

  const filterItems = document.querySelectorAll('[data-marker]');
  const map = new google.maps.Map(container, {
    zoom: 14.5,
    center,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: true,
    language: 'ua',
    styles: mapStyle(),
  });

  const filterMarkers = function(categoriesArray) {
    gmarkers.forEach(el => {
      if (categoriesArray.has(el.category) || categoriesArray.size === 1) {
        el.setMap(map);
        el.setAnimation(google.maps.Animation.DROP);
      } else {
        el.setMap(null);
      }
    });
  };

  filterItems.forEach(item => {
    item.addEventListener('click', evt => {
      evt.stopImmediatePropagation();
      
      item.classList.toggle('active');
      if (item.classList.contains('active')) {
        choosedCategories.add(item.dataset.category);
      } else {
        choosedCategories.delete(item.dataset.category);
      }
      swiperMap.update();
      filterMarkers(choosedCategories);
    });
  });

  const baseFolder = window.location.href.match(/localhost/)
    ? './assets/images/map/'
    : '/wp-content/themes/3d/assets/images/map/';
  const defaultMarkerSize =
    document.documentElement.clientWidth < 1600
      ? new google.maps.Size(46, 80)
      : new google.maps.Size(56, 90);
  const buildLogoSize = new google.maps.Size(82, 82);

  const markersAdresses = {
    main: `${baseFolder}main.png`,
    mall: `${baseFolder}mall.svg`,
    park: `${baseFolder}park.svg`,
    garden: `${baseFolder}garden.svg`,
    activities: `${baseFolder}activities.svg`,
    pharmacy: `${baseFolder}pharmacy.svg`,
    restaurant: `${baseFolder}restaurant.svg`,
    school: `${baseFolder}school.svg`,
    sport: `${baseFolder}sport.svg`,
    supermarket: `${baseFolder}supermarket.svg`,
    drivingSchool: `${baseFolder}driving-school.svg`,
    post: `${baseFolder}post.svg`,
    aquapark: `${baseFolder}aquapark.svg`,
    petrolStation: `${baseFolder}petrol-station.svg`,
    busStop: `${baseFolder}bus-stop.svg`,
    carWashing: `${baseFolder}car-washing.svg`,
  };

  const markersData = [
    {
      type: 'school',
      icon: { url: markersAdresses.school, scaledSize: defaultMarkerSize },
      position: { lat: 50.41419350589122,  lng: 30.63948276530671 },
      text: 'Ліцей №303',
    },
    {
      type: 'school',
      icon: { url: markersAdresses.school, scaledSize: defaultMarkerSize },
      position: { lat: 50.4181183488088 , lng: 30.645339224477777 },
      text: 'Гімназія №290',
    },
    
    {
      type: 'pharmacy',
      icon: { url: markersAdresses.pharmacy, scaledSize: defaultMarkerSize },
      position: { lat: 50.42622539159608,  lng: 30.646540854361962 },
      text: 'Вузлова лікарня №1 станції "Дарниця"',
    },
    {
      type: 'pharmacy',
      icon: { url: markersAdresses.pharmacy, scaledSize: defaultMarkerSize },
      position: { lat: 50.4245849553108,   lng: 30.64242098176834 },
      text: 'Дніпролаб"',
    },
    {
      type: 'garden',
      icon: { url: markersAdresses.garden, scaledSize: defaultMarkerSize },
      position: { lat: 50.427937463283236,  lng: 30.645222184349088 },
      text: 'Заклад дошкільної освіти №787',
    },
    {
      type: 'garden',
      icon: { url: markersAdresses.garden, scaledSize: defaultMarkerSize },
      position: { lat: 50.42138313747107,  lng: 30.654802010174667 },
      text: 'Заклад дошкільної освіти № 133 "Радосинь"',
    },
    {
      type: 'garden',
      icon: { url: markersAdresses.garden, scaledSize: defaultMarkerSize },
      position: { lat: 50.42083054174973,  lng: 30.644353070903104 },
      text: 'Заклад дошкільної освіти комбінованого типу №138',
    },
    
    {
      type: 'sport',
      icon: { url: markersAdresses.sport, scaledSize: defaultMarkerSize },
      position: { lat: 50.405144485779225,  lng: 30.648642359423445},
      text:
        'АтлетіКо',
    },
    {
      type: 'sport',
      icon: { url: markersAdresses.sport, scaledSize: defaultMarkerSize },
      position: { lat: 50.405171527988955, lng: 30.648678188953394 },
      text: 'Басейн "Крокі"',
    },
    {
      type: 'restaurant',
      icon: { url: markersAdresses.restaurant, scaledSize: defaultMarkerSize },
      position: { lat: 50.42200837722877,  lng: 30.64260158395498 },
      text: 'GAGA',
    },
    {
      type: 'restaurant',
      icon: { url: markersAdresses.restaurant, scaledSize: defaultMarkerSize },
      position: { lat: 50.42146785446494,  lng: 30.63971493587432 },
      text: 'Dellini',
    },
    
    {
      type: 'activities',
      icon: { url: markersAdresses.activities, scaledSize: defaultMarkerSize },
      position: { lat: 50.41454471307626,  lng: 30.651119853809114 },
      text: 'New Way',
    },
    {
      type: 'activities',
      icon: { url: markersAdresses.activities, scaledSize: defaultMarkerSize },
      position: { lat: 50.42331357809371,  lng: 30.63860151668352 },
      text: 'Sport DOG Area',
    },
    {
      type: 'supermarket',
      icon: { url: markersAdresses.supermarket, scaledSize: defaultMarkerSize },
      position: { lat: 50.41942483649471,  lng: 30.631618935451538 },
      text: 'Ашан Рів Гош',
    },
    {
      type: 'main',
      icon: { url: markersAdresses.main, scaledSize: buildLogoSize },
      position: { lat: 50.425288565469636,  lng: 30.639686058688614 },
      text: 'ЖК Brother,  вул. Ревуцького, 1',
    },
  ];

  const infowindow = new google.maps.InfoWindow({ maxWidth: 300 });
  markersData.forEach(marker => {
    const mapMarker = new google.maps.Marker({
      map,
      category: marker.type,
      animation: google.maps.Animation.DROP,
      zIndex: marker.zIndex || 1,
      icon: marker.icon,
      cursor: 'grab',
      position: new google.maps.LatLng(marker.position.lat, marker.position.lng),
    });

    google.maps.event.addListener(mapMarker, 'click', function() {
      infowindow.setContent(marker.text);
      infowindow.open(map, mapMarker);
      map.panTo(this.getPosition());
    });

    mapMarker.name = marker.type;
    gmarkers.push(mapMarker);
  });
}

const mapSingle = document.querySelector('.map-simple');
console.log(mapSingle);
if (mapSingle) {
  await loadGoogleMapsScript();

  const singleMapCenter = { lat: 50.4070791, lng: 30.6098897 };
  const singleMapZoom = 15;
  const singleMapText = 'РІЕЛ – відділ сервісу у Києві';

  const singleMap = new google.maps.Map(mapSingle, {
    zoom: singleMapZoom,
    center: singleMapCenter,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: true,
    styles: mapStyle(),
  });

  const singleMarkerIcon = {
    url: `${
      window.location.href.match(/localhost/)
        ? './assets/images/map/riel.svg'
        : '/wp-content/themes/3d/assets/images/map/riel.svg'
    }`,
    scaledSize:
      document.documentElement.clientWidth < 1600
        ? new google.maps.Size(80, 80)
        : new google.maps.Size(90, 90),
  };

  const singleMarker = new google.maps.Marker({
    position: singleMapCenter,
    map: singleMap,
    icon: singleMarkerIcon,
    animation: google.maps.Animation.DROP,
  });

  const singleInfoWindow = new google.maps.InfoWindow({
    content: singleMapText,
    maxWidth: 300,
  });

  singleMarker.addListener('click', function() {
    singleInfoWindow.open(singleMap, singleMarker);
    singleMap.panTo(singleMarker.getPosition());
  });
}
