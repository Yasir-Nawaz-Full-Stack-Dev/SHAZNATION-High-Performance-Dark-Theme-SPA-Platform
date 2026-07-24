/* ==========================================================
   SHAZNATION — 3D WIREFRAME BACKGROUND
   Signature visual element. Kept isolated from UI/interaction
   logic (see main.js) so it can be tuned independently.
   ========================================================== */
(function () {
  const canvas = document.querySelector('#wave-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const geometry = new THREE.PlaneGeometry(120, 120, 60, 60);
  const material = new THREE.MeshStandardMaterial({
    color: 0xa4ff00,
    wireframe: true,
    transparent: true,
    opacity: 0.2,
  });

  const floor = new THREE.Mesh(geometry, material);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -12;
  scene.add(floor);

  const ceiling = floor.clone();
  ceiling.position.y = 12;
  scene.add(ceiling);

  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(0, 0, 15);
  scene.add(light, new THREE.AmbientLight(0xffffff, 0.3));

  camera.position.z = 45;

  const clock = new THREE.Clock();
  const docHeight = () => document.documentElement.scrollHeight - window.innerHeight;

  function animatePlane(mesh, time) {
    const positions = mesh.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] =
        Math.sin(positions[i] * 0.2 + time) * 2 +
        Math.cos(positions[i + 1] * 0.2 + time) * 2;
    }
    mesh.geometry.attributes.position.needsUpdate = true;
  }

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    animatePlane(floor, time);
    animatePlane(ceiling, time);

    const scrollY = window.scrollY;
    camera.position.z = 45 - scrollY * 0.015;
    camera.rotation.z = scrollY * 0.0003;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
