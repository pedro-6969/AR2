window.onload = () => {
  // Esperar a câmera GPS ter uma posição antes de criar os objetos ajuda bastante:
  window.addEventListener('gps-camera-update-position', (e) => {
    const { position } = e.detail; // lat/lng do usuário
    console.log('GPS fix:', position);
    // Cria os lugares uma única vez
    if (!window.__placesRendered) {
      window.__placesRendered = true;
      const places = staticLoadPlaces();
      renderPlaces(places);
    }
  });
};

function staticLoadPlaces() {
  return [
    {
      name: 'Magnemite',
      location: {
        lat: -23.330583,
        lng: -47.868354,
      },
      // Ajuste o caminho do seu GLTF aqui
      modelUrl: './assets/magnemite/scene.gltf',
      scale: '0.5 0.5 0.5',
      rotation: '0 180 0'
    }
  ];
}

function renderPlaces(places) {
  const scene = document.querySelector('a-scene');

  places.forEach((place) => {
    const { lat, lng } = place.location;

    const entity = document.createElement('a-entity');

    // Posiciona por GPS
    entity.setAttribute('gps-entity-place', `latitude: ${lat}; longitude: ${lng};`);

    // Carrega modelo (GLTF/GLB)
    entity.setAttribute('gltf-model', place.modelUrl);

    // Ajustes de exibição
    entity.setAttribute('rotation', place.rotation || '0 0 0');
    entity.setAttribute('scale', place.scale || '1 1 1');

    // (Opcional) animações em modelos com animações embutidas
    entity.setAttribute('animation-mixer', '');

    // Aviso quando o modelo terminar de carregar
    entity.addEventListener('model-loaded', () => {
      console.log('Modelo carregado em', lat, lng);
      // Dispara evento do AR.js (opcional)
      window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'));
    });

    // Erros úteis pra debugar caminho/CORS
    entity.addEventListener('model-error', (e) => {
      console.error('Erro ao carregar modelo:', e.detail);
    });

    scene.appendChild(entity);
  });
}
