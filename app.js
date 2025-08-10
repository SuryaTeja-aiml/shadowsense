// Global variables
let scene, camera, renderer, sun, earth, sunLight, ambientLight;
let objects = [];
let selectedObject = null;
let raycaster, mouse;
let isDraggingObject = false;
let dragPlane;
let autoSunMovement = false;
let sunMovementDirection = 'clockwise';
let sunMovementSpeed = 1;
let currentScale = 1;
let currentViewpoint = 'front';
let originalCameraPosition = { x: 0, y: 10, z: 20 };

// Initialize the application
function init() {
    // Create scene
    scene = new THREE.Scene();

    // Load space background texture
    const textureLoader = new THREE.TextureLoader();
    const spaceTexture = textureLoader.load('space.png');
    scene.background = spaceTexture;

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('container').appendChild(renderer.domElement);

    // Create raycaster for mouse interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Create invisible plane for dragging objects
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({ visible: false });
    dragPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    dragPlane.rotation.x = -Math.PI / 2;
    scene.add(dragPlane);

    // Create ground
    createGround();

    // Create sun and lighting
    createSun();

    // Create earth (optional visual element)
    createEarth();

    // Create sun path visualization
    createSunPath();

    // Create space environment
    createSpaceEnvironment();

    // Add event listeners
    setupEventListeners();

    // Start animation loop
    animate();
}

function createGround() {
    // Create a more space-themed ground (like a moon or planet surface)
    const groundGeometry = new THREE.PlaneGeometry(50, 50, 32, 32);

    // Add some height variation for a more realistic surface
    const vertices = groundGeometry.attributes.position.array;
    for (let i = 2; i < vertices.length; i += 3) {
        vertices[i] = Math.random() * 0.5; // Small height variations
    }
    groundGeometry.attributes.position.needsUpdate = true;
    groundGeometry.computeVertexNormals();

    const groundMaterial = new THREE.MeshLambertMaterial({
        color: 0x8B7355, // More moon-like color
        transparent: true,
        opacity: 0.9
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add a subtle grid pattern
    const gridHelper = new THREE.GridHelper(50, 20, 0x444444, 0x444444);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    scene.add(gridHelper);
}

function createSun() {
    // Load sun texture
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load('sun.png');

    // Sun visual representation - larger and more visible with texture
    const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
        map: sunTexture,
        color: 0xFFFFAA,
        emissive: 0xFFAA00,
        emissiveIntensity: 0.4,
        transparent: true
    });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);

    // Add a glowing effect around the sun
    const glowGeometry = new THREE.SphereGeometry(2.2, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFF00,
        transparent: true,
        opacity: 0.2
    });
    const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    sun.add(sunGlow);

    scene.add(sun);

    // Sun light with better shadow quality
    sunLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -25;
    sunLight.shadow.camera.right = 25;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    sunLight.shadow.bias = -0.0001;
    scene.add(sunLight);

    // Ambient light for better visibility
    ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    updateSunPosition();
}

function createEarth() {
    // Small earth representation at center
    const earthGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const earthMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 });
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.y = 0.5;
    scene.add(earth);
}

function createSunPath() {
    // Create a circular path to show sun's trajectory
    const pathGeometry = new THREE.RingGeometry(19, 20, 64);
    const pathMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFDD44,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const sunPath = new THREE.Mesh(pathGeometry, pathMaterial);
    sunPath.rotation.x = -Math.PI / 2;
    sunPath.position.y = 10; // Middle height
    scene.add(sunPath);

    // Add path markers for different times
    for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * Math.PI / 180;
        const x = 19.5 * Math.cos(angle);
        const z = 19.5 * Math.sin(angle);

        const markerGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xFFAA00 });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(x, 10, z);
        scene.add(marker);
    }
}

function createSpaceEnvironment() {
    // Create a large sphere for space skybox
    const skyboxGeometry = new THREE.SphereGeometry(200, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const spaceTexture = textureLoader.load('space.png');

    const skyboxMaterial = new THREE.MeshBasicMaterial({
        map: spaceTexture,
        side: THREE.BackSide, // Render on the inside
        transparent: true,
        opacity: 0.8
    });

    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);

    // Add some stars as small points
    createStars();
}

function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
        // Random positions in a large sphere
        const radius = 150 + Math.random() * 50;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.cos(phi);
        positions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const starMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 2,
        transparent: true,
        opacity: 0.8
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

function updateSunPosition() {
    const sunAngle = document.getElementById('sunAngle').value;
    const sunHeight = document.getElementById('sunHeight').value;

    document.getElementById('sunAngleValue').textContent = sunAngle + '°';
    document.getElementById('sunHeightValue').textContent = sunHeight + '°';

    // Update time of day indicator
    updateTimeOfDay(sunAngle, sunHeight);

    const angleRad = (sunAngle * Math.PI) / 180;
    const heightRad = (sunHeight * Math.PI) / 180;

    const distance = 20;
    const x = distance * Math.cos(heightRad) * Math.cos(angleRad);
    const y = distance * Math.sin(heightRad);
    const z = distance * Math.cos(heightRad) * Math.sin(angleRad);

    sun.position.set(x, y, z);
    sunLight.position.copy(sun.position);
    sunLight.target.position.set(0, 0, 0);

    // Adjust light intensity based on height (more realistic)
    sunLight.intensity = 0.8 + (sunHeight / 80) * 0.6;

    updateCompass();
    updateShadowDirections();
}

function updateTimeOfDay(angle, height) {
    let timeOfDay = '';

    if (height < 20) {
        timeOfDay = angle < 180 ? '🌅 Sunrise' : '🌇 Sunset';
    } else if (height < 40) {
        timeOfDay = angle < 180 ? '🌄 Morning' : '🌆 Evening';
    } else if (height < 60) {
        timeOfDay = '☀️ Midday';
    } else {
        timeOfDay = '🌞 High Noon';
    }

    document.getElementById('timeOfDay').textContent = timeOfDay;

    // Update sun intensity indicator
    const intensity = Math.round((height / 80) * 100);
    document.getElementById('sunIntensity').textContent = intensity + '%';
    document.getElementById('intensityBar').style.width = intensity + '%';

    // Change intensity bar color based on sun height
    const intensityBar = document.getElementById('intensityBar');
    if (height < 30) {
        intensityBar.style.background = '#FF8C42'; // Orange for low sun
    } else if (height < 60) {
        intensityBar.style.background = '#FFD23F'; // Yellow for medium sun
    } else {
        intensityBar.style.background = '#FF6B35'; // Red-orange for high sun
    }
}

function updateCompass() {
    const sunAngle = document.getElementById('sunAngle').value;
    const sunHeight = document.getElementById('sunHeight').value;

    // Update sun indicator position on compass
    const sunIndicator = document.getElementById('sun-indicator');
    const compassRadius = 60; // pixels from center
    const sunAngleRad = (sunAngle * Math.PI) / 180;

    // Calculate position on compass (accounting for height)
    const heightFactor = Math.cos((sunHeight * Math.PI) / 180);
    const sunX = compassRadius * heightFactor * Math.sin(sunAngleRad);
    const sunY = -compassRadius * heightFactor * Math.cos(sunAngleRad);

    sunIndicator.style.transform = `translate(calc(-50% + ${sunX}px), calc(-50% + ${sunY}px))`;

    // Update shadow indicator (opposite direction)
    const shadowIndicator = document.getElementById('shadow-indicator');
    const shadowAngle = (parseFloat(sunAngle) + 180) % 360;
    shadowIndicator.style.transform = `translate(-50%, -100%) rotate(${shadowAngle}deg)`;
}

function addObject() {
    const objectGeometry = new THREE.BoxGeometry(1, 2, 1);
    const objectMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    const object = new THREE.Mesh(objectGeometry, objectMaterial);

    // Random position
    object.position.x = (Math.random() - 0.5) * 20;
    object.position.z = (Math.random() - 0.5) * 20;
    object.position.y = 1;

    // Apply current scale
    object.scale.set(currentScale, currentScale, currentScale);

    object.castShadow = true;
    object.userData = { type: 'object', direction: 'N' };

    scene.add(object);
    objects.push(object);
}

function addPerson() {
    // Create person using cylinder for body and sphere for head
    const personGroup = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 8);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    body.castShadow = true;
    personGroup.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, 8, 8);
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFDBAC });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.75;
    head.castShadow = true;
    personGroup.add(head);

    // Direction indicator (small arrow/cone pointing forward)
    const arrowGeometry = new THREE.ConeGeometry(0.1, 0.3, 4);
    const arrowMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow.position.set(0, 1.75, 0.4);
    arrow.rotation.x = Math.PI / 2;
    personGroup.add(arrow);

    // Random position
    personGroup.position.x = (Math.random() - 0.5) * 20;
    personGroup.position.z = (Math.random() - 0.5) * 20;

    // Apply current scale
    personGroup.scale.set(currentScale, currentScale, currentScale);

    personGroup.userData = { type: 'person', direction: 'N' };

    scene.add(personGroup);
    objects.push(personGroup);
}

function setupEventListeners() {
    // Sun controls
    document.getElementById('sunAngle').addEventListener('input', updateSunPosition);
    document.getElementById('sunHeight').addEventListener('input', updateSunPosition);

    // Mouse events for object interaction
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('click', onMouseClick);

    // Window resize
    window.addEventListener('resize', onWindowResize);

    // Keyboard shortcuts
    window.addEventListener('keydown', onKeyDown);
}

function onMouseDown(event) {
    if (event.button !== 0) return; // Only left mouse button

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects, true);

    if (intersects.length > 0) {
        let clickedObject = intersects[0].object;

        // If clicked on a child of a group, get the parent group
        while (clickedObject.parent && clickedObject.parent.userData && clickedObject.parent.userData.type) {
            clickedObject = clickedObject.parent;
        }

        selectedObject = clickedObject;
        isDraggingObject = true;

        // Prevent camera controls while dragging
        event.stopPropagation();
    }
}

function onMouseMove(event) {
    if (isDraggingObject && selectedObject) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(dragPlane);

        if (intersects.length > 0) {
            selectedObject.position.x = intersects[0].point.x;
            selectedObject.position.z = intersects[0].point.z;
            updateShadowDirections();
        }
    }
}

function onMouseUp(event) {
    isDraggingObject = false;
}

function onMouseClick(event) {
    if (isDraggingObject) return; // Don't show modal if we were dragging

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects, true);

    if (intersects.length > 0) {
        let clickedObject = intersects[0].object;

        // If clicked on a child of a group, get the parent group
        while (clickedObject.parent && clickedObject.parent.userData && clickedObject.parent.userData.type) {
            clickedObject = clickedObject.parent;
        }

        selectedObject = clickedObject;
        showDirectionModal();
    }
}

function showDirectionModal() {
    document.getElementById('directionModal').style.display = 'block';
}

function closeDirectionModal() {
    document.getElementById('directionModal').style.display = 'none';
    selectedObject = null;
}

function setDirection(direction) {
    if (selectedObject) {
        selectedObject.userData.direction = direction;

        // Rotate object based on direction
        const directionAngles = {
            'N': 0, 'NE': Math.PI / 4, 'E': Math.PI / 2, 'SE': 3 * Math.PI / 4,
            'S': Math.PI, 'SW': 5 * Math.PI / 4, 'W': 3 * Math.PI / 2, 'NW': 7 * Math.PI / 4,
            'C': 0
        };

        if (directionAngles[direction] !== undefined) {
            selectedObject.rotation.y = directionAngles[direction];
        }

        updateShadowDirections();
    }
    closeDirectionModal();
}

function updateShadowDirections() {
    objects.forEach(obj => {
        const shadowDirection = calculateShadowDirection(obj);
        obj.userData.shadowDirection = shadowDirection;
    });

    if (selectedObject) {
        showShadowMessage(selectedObject);
    }
}

function calculateShadowDirection(object) {
    const sunAngle = document.getElementById('sunAngle').value;

    // Shadow direction is opposite to sun direction
    let shadowAngle = (parseFloat(sunAngle) + 180) % 360;

    // Convert to compass direction
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(shadowAngle / 45) % 8;

    return directions[index];
}

function showShadowMessage(object) {
    const shadowDirection = object.userData.shadowDirection;
    const objectDirection = object.userData.direction;
    const objectType = object.userData.type;

    let message = `${objectType === 'person' ? 'Person' : 'Object'} facing ${getDirectionName(objectDirection)} - Shadow pointing ${getDirectionName(shadowDirection)}`;

    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.style.display = 'block';

    // Highlight the shadow direction on compass
    highlightCompassDirection(shadowDirection);

    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 4000);
}

function highlightCompassDirection(direction) {
    // Add visual feedback to compass
    const shadowIndicator = document.getElementById('shadow-indicator');
    shadowIndicator.style.background = '#ff4444';
    shadowIndicator.style.boxShadow = '0 0 10px #ff4444';

    setTimeout(() => {
        shadowIndicator.style.background = 'red';
        shadowIndicator.style.boxShadow = 'none';
    }, 2000);
}

function getDirectionName(direction) {
    const names = {
        'N': 'North', 'NE': 'North-East', 'E': 'East', 'SE': 'South-East',
        'S': 'South', 'SW': 'South-West', 'W': 'West', 'NW': 'North-West'
    };
    return names[direction] || direction;
}

function resetScene() {
    objects.forEach(obj => {
        scene.remove(obj);
    });
    objects = [];

    document.getElementById('message').style.display = 'none';
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Auto sun movement
    if (autoSunMovement) {
        const sunAngleSlider = document.getElementById('sunAngle');
        let currentAngle = parseFloat(sunAngleSlider.value);

        const increment = sunMovementDirection === 'clockwise' ? sunMovementSpeed : -sunMovementSpeed;
        currentAngle += increment;

        // Wrap around 360 degrees
        if (currentAngle >= 360) currentAngle = 0;
        if (currentAngle < 0) currentAngle = 359;

        sunAngleSlider.value = currentAngle;
        updateSunPosition();
    }

    // Rotate the sun for a more dynamic effect
    if (sun) {
        sun.rotation.y += 0.01;
    }

    // Slowly rotate the stars for a dynamic space effect
    scene.children.forEach(child => {
        if (child.type === 'Points') { // Stars
            child.rotation.y += 0.0005;
        }
    });

    renderer.render(scene, camera);
}

function toggleAutoSun() {
    autoSunMovement = !autoSunMovement;
    const btn = document.getElementById('autoSunBtn');

    if (autoSunMovement) {
        btn.textContent = '⏸️ Pause';
        btn.style.background = '#FF6B35';
    } else {
        btn.textContent = '▶️ Auto';
        btn.style.background = '#4CAF50';
    }
}

function changeSunDirection() {
    sunMovementDirection = document.getElementById('sunDirection').value;
}

function changeSunSpeed(speed) {
    sunMovementSpeed = parseFloat(speed);
    document.getElementById('sunSpeed').textContent = `${speed}x`;
}

function setSunPreset(preset) {
    const sunAngleSlider = document.getElementById('sunAngle');
    const sunHeightSlider = document.getElementById('sunHeight');

    // Stop auto movement when setting presets
    if (autoSunMovement) {
        toggleAutoSun();
    }

    switch (preset) {
        case 'sunrise':
            sunAngleSlider.value = 90;  // East
            sunHeightSlider.value = 15;
            break;
        case 'noon':
            sunAngleSlider.value = 180; // South
            sunHeightSlider.value = 70;
            break;
        case 'sunset':
            sunAngleSlider.value = 270; // West
            sunHeightSlider.value = 15;
            break;
        case 'night':
            sunAngleSlider.value = 0;   // North (behind)
            sunHeightSlider.value = 10;
            break;
    }

    updateSunPosition();

    // Show message about the preset
    const messageElement = document.getElementById('message');
    const presetNames = {
        'sunrise': '🌅 Sunrise - Sun in the East',
        'noon': '☀️ High Noon - Sun overhead in the South',
        'sunset': '🌇 Sunset - Sun in the West',
        'night': '🌙 Night - Sun below horizon'
    };

    messageElement.textContent = presetNames[preset];
    messageElement.style.display = 'block';

    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000);
}

function setScale(scale) {
    currentScale = scale;
    
    // Update all objects in the scene
    objects.forEach(obj => {
        obj.scale.set(scale, scale, scale);
    });
    
    // Update sun scale
    if (sun) {
        sun.scale.set(scale, scale, scale);
    }
    
    // Update earth scale
    if (earth) {
        earth.scale.set(scale, scale, scale);
    }
    
    // Update UI
    document.getElementById('currentScale').textContent = scale + 'x';
    
    // Update active button
    document.querySelectorAll('.scale-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseFloat(btn.dataset.scale) === scale) {
            btn.classList.add('active');
        }
    });
    
    // Show message
    const messageElement = document.getElementById('message');
    messageElement.textContent = `Scale set to ${scale}x`;
    messageElement.style.display = 'block';
    
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 2000);
}

function setViewpoint(viewpoint) {
    currentViewpoint = viewpoint;
    
    // Define viewpoint positions
    const viewpoints = {
        'front': { x: 0, y: 10, z: 20 },
        'back': { x: 0, y: 10, z: -20 },
        'left': { x: -20, y: 10, z: 0 },
        'right': { x: 20, y: 10, z: 0 },
        'top': { x: 0, y: 30, z: 0 },
        'bottom': { x: 0, y: -10, z: 10 }
    };
    
    const targetPosition = viewpoints[viewpoint];
    
    // Animate camera to new position
    animateCamera(targetPosition);
    
    // Update active button
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find and activate the correct button
    const viewButtons = {
        'front': '👁️',
        'left': '⬅️',
        'right': '➡️',
        'top': '⬆️',
        'bottom': '⬇️'
    };
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        if (btn.textContent === viewButtons[viewpoint]) {
            btn.classList.add('active');
        }
    });
    
    // Show message
    const messageElement = document.getElementById('message');
    const viewNames = {
        'front': 'Front View',
        'back': 'Back View', 
        'left': 'Left View',
        'right': 'Right View',
        'top': 'Top View',
        'bottom': 'Bottom View'
    };
    
    messageElement.textContent = `Switched to ${viewNames[viewpoint]}`;
    messageElement.style.display = 'block';
    
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 2000);
}

function animateCamera(targetPosition) {
    const startPosition = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };
    
    const duration = 1000; // 1 second
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-in-out)
        const easeProgress = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        camera.position.x = startPosition.x + (targetPosition.x - startPosition.x) * easeProgress;
        camera.position.y = startPosition.y + (targetPosition.y - startPosition.y) * easeProgress;
        camera.position.z = startPosition.z + (targetPosition.z - startPosition.z) * easeProgress;
        
        camera.lookAt(0, 0, 0);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// Global functions for HTML buttons
window.addObject = addObject;
window.addPerson = addPerson;
window.resetScene = resetScene;
window.setDirection = setDirection;
window.closeDirectionModal = closeDirectionModal;
window.toggleAutoSun = toggleAutoSun;
window.changeSunDirection = changeSunDirection;
window.changeSunSpeed = changeSunSpeed;
window.setSunPreset = setSunPreset;
window.setScale = setScale;
window.setViewpoint = setViewpoint;
window.scaleUp = scaleUp;
window.scaleDown = scaleDown;

// Add camera controls for better interaction
function setupCameraControls() {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    renderer.domElement.addEventListener('mousedown', (event) => {
        if (event.button === 2) { // Right mouse button
            isDragging = true;
            previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    });

    renderer.domElement.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const deltaMove = {
                x: event.clientX - previousMousePosition.x,
                y: event.clientY - previousMousePosition.y
            };

            const deltaRotationQuaternion = new THREE.Quaternion()
                .setFromEuler(new THREE.Euler(
                    toRadians(deltaMove.y * 0.5),
                    toRadians(deltaMove.x * 0.5),
                    0,
                    'XYZ'
                ));

            camera.quaternion.multiplyQuaternions(deltaRotationQuaternion, camera.quaternion);
            previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    });

    renderer.domElement.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Prevent context menu on right click
    renderer.domElement.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

    // Mouse wheel for zoom
    renderer.domElement.addEventListener('wheel', (event) => {
        const zoomSpeed = 0.1;
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        if (event.deltaY > 0) {
            camera.position.add(direction.multiplyScalar(-zoomSpeed));
        } else {
            camera.position.add(direction.multiplyScalar(zoomSpeed));
        }

        event.preventDefault();
    });
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function onKeyDown(event) {
    switch (event.key) {
        case ' ': // Spacebar to toggle auto movement
            event.preventDefault();
            toggleAutoSun();
            break;
        case 'r': // R to reverse direction
        case 'R':
            const directionSelect = document.getElementById('sunDirection');
            directionSelect.value = directionSelect.value === 'clockwise' ? 'counterclockwise' : 'clockwise';
            changeSunDirection();
            break;
        case '1': // Number keys for presets
            setSunPreset('sunrise');
            break;
        case '2':
            setSunPreset('noon');
            break;
        case '3':
            setSunPreset('sunset');
            break;
        case '4':
            setSunPreset('night');
            break;
        case 'ArrowLeft': // Arrow keys for manual sun movement
            event.preventDefault();
            adjustSunAngle(-5);
            break;
        case 'ArrowRight':
            event.preventDefault();
            adjustSunAngle(5);
            break;
        case 'ArrowUp':
            event.preventDefault();
            adjustSunHeight(5);
            break;
        case 'ArrowDown':
            event.preventDefault();
            adjustSunHeight(-5);
            break;
        case '=': // Plus key for scale up
        case '+':
            event.preventDefault();
            scaleUp();
            break;
        case '-': // Minus key for scale down
        case '_':
            event.preventDefault();
            scaleDown();
            break;
        case 'v': // V for viewpoint cycling
        case 'V':
            event.preventDefault();
            cycleViewpoint();
            break;
    }
}

function adjustSunAngle(delta) {
    const sunAngleSlider = document.getElementById('sunAngle');
    let newAngle = parseFloat(sunAngleSlider.value) + delta;

    if (newAngle >= 360) newAngle = 0;
    if (newAngle < 0) newAngle = 359;

    sunAngleSlider.value = newAngle;
    updateSunPosition();
}

function adjustSunHeight(delta) {
    const sunHeightSlider = document.getElementById('sunHeight');
    let newHeight = parseFloat(sunHeightSlider.value) + delta;

    newHeight = Math.max(10, Math.min(80, newHeight)); // Clamp between 10-80

    sunHeightSlider.value = newHeight;
    updateSunPosition();
}

function scaleUp() {
    const scales = [0.5, 1, 2, 3];
    const currentIndex = scales.indexOf(currentScale);
    if (currentIndex < scales.length - 1) {
        setScale(scales[currentIndex + 1]);
    }
}

function scaleDown() {
    const scales = [0.5, 1, 2, 3];
    const currentIndex = scales.indexOf(currentScale);
    if (currentIndex > 0) {
        setScale(scales[currentIndex - 1]);
    }
}

function cycleViewpoint() {
    const viewpoints = ['front', 'right', 'back', 'left', 'top', 'bottom'];
    const currentIndex = viewpoints.indexOf(currentViewpoint);
    const nextIndex = (currentIndex + 1) % viewpoints.length;
    setViewpoint(viewpoints[nextIndex]);
}

// Initialize when page loads
window.addEventListener('load', () => {
    init();
    setupCameraControls();
});