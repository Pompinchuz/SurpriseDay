

let scene, camera, renderer;
let balloons = [];
const BALLOON_COUNT = 50;


const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); 
    }
  });
}, {
  threshold: 0.2
});

document.querySelectorAll('.maki').forEach(img => {
  observer.observe(img);
});


function initThree() {
  const container = document.getElementById('three-container');

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xffe0ec, 0.002);
  scene.background = new THREE.Color(0xffe0ec);

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 100);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);


  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 1, 1);
  scene.add(directionalLight);


  const balloonGeometry = new THREE.SphereGeometry(5, 32, 32);
  const threadGeometry = new THREE.CylinderGeometry(0.1, 0.1, 50, 8);

  for (let i = 0; i < BALLOON_COUNT; i++) {
    const color = new THREE.Color(`hsl(${Math.random() * 360}, 70%, 70%)`);
    const material = new THREE.MeshPhongMaterial({ color });
  
    const balloon = new THREE.Mesh(balloonGeometry, material);
  

    const scaleY = 1.3 + Math.random() * 0.5;
    balloon.scale.set(1, scaleY, 1);
  
    const balloonHeight = 5 * 2 * scaleY;
  

    const threadLength = 10 + Math.random() * 10;
  

    const lateralOffset = 2 + Math.random() * 2; 
  
    
    const p1 = new THREE.Vector3(0, -balloonHeight / 2, 0); 
    const p2 = new THREE.Vector3(
      (Math.random() < 0.5 ? -1 : 1) * lateralOffset,
      -balloonHeight / 2 - threadLength / 2,
      (Math.random() < 0.5 ? -1 : 1) * lateralOffset
    );
    const p3 = new THREE.Vector3(0, -balloonHeight / 2 - threadLength, 0); 
  
    const curve = new THREE.CatmullRomCurve3([p1, p2, p3]);
    const points = curve.getPoints(20);
    const threadGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
    const threadMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });
    const thread = new THREE.Line(threadGeometry, threadMaterial);
  
  
    const startX = (Math.random() - 0.5) * 60;
    const startY = -50 + Math.random() * 30;
    const startZ = (Math.random() - 0.5) * 60;
  
    const group = new THREE.Group();
    group.add(balloon);
    group.add(thread);
    group.position.set(startX, startY, startZ);
  
    group.userData = {
      speed: 0.4 + Math.random() * 0.3,
      floatSpeed: 0.05 + Math.random() * 0.02
    };
  
    scene.add(group);
    balloons.push(group);
  }
  
  
  


  window.addEventListener('resize', onWindowResize, false);
}

function animateThree() {
  requestAnimationFrame(animateThree);

  balloons.forEach(group => {

    group.position.y += group.userData.speed;


    group.position.x += Math.sin(group.userData.floatSpeed * group.position.y) * 0.5;


    if (group.position.y > window.innerHeight / 2 + 60) {
      group.position.y = -window.innerHeight / 2 - 60;
    }
  });

  renderer.render(scene, camera);
}




const button = document.getElementById("openButton");
const message = document.getElementById("messageBox");
const music = document.getElementById("bgMusic");

button.addEventListener("click", () => {
  message.classList.add("open");
  message.style.opacity = 1;
  music.play();
  button.style.display = "none";
  launchConfetti();


  setTimeout(() => {
    message.classList.remove("open");
    message.style.opacity = 0;
    music.pause();
    music.currentTime = 0;
    button.style.display = "block";
  }, 180000);
});





function launchConfetti() {
  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDuration = (Math.random() * 3 + 2) + "s";
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;

    confetti.addEventListener("animationend", () => {
      confetti.style.transition = "opacity 1s ease";
      confetti.style.opacity = 0;
      setTimeout(() => confetti.remove(), 1000);
    });

    document.body.appendChild(confetti);
  }
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


initThree();
animateThree();
