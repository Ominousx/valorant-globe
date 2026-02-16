// Globe visualization configuration
const GLOBE_RADIUS = 200;
const CAMERA_DISTANCE = 600;

// Player data embedded directly
const PLAYER_DATA = {
  "United States": 481,
  "South Korea": 274,
  "Turkey": 245,
  "Brazil": 219,
  "Japan": 173,
  "France": 161,
  "Germany": 154,
  "China": 150,
  "Russia": 148,
  "Spain": 142,
  "Canada": 126,
  "Philippines": 123,
  "United Kingdom": 114,
  "India": 107,
  "Chile": 102,
  "Poland": 101,
  "Thailand": 100,
  "Indonesia": 87,
  "Argentina": 84,
  "Vietnam": 80,
  "Australia": 77,
  "Taiwan": 70,
  "Singapore": 65,
  "Saudi Arabia": 61,
  "Egypt": 60,
  "Mexico": 55,
  "Sweden": 49,
  "Finland": 46,
  "Portugal": 46,
  "Colombia": 46,
  "Czechia": 45,
  "Italy": 45,
  "Malaysia": 37,
  "Denmark": 35,
  "Hungary": 30,
  "Ukraine": 29,
  "Netherlands": 28,
  "Lithuania": 27,
  "Belgium": 26,
  "Hong Kong": 25,
  "Morocco": 22,
  "Cambodia": 19,
  "Ireland": 18,
  "Norway": 18,
  "Peru": 17,
  "Pakistan": 16,
  "Tunisia": 16,
  "Serbia": 15,
  "Mongolia": 15,
  "Kuwait": 15,
  "Jordan": 14,
  "Bulgaria": 13,
  "Algeria": 13,
  "United Arab Emirates": 13,
  "Slovenia": 12,
  "Israel": 11,
  "South Africa": 11,
  "Austria": 10,
  "Greece": 10,
  "Scotland": 10,
  "Belarus": 10,
  "New Zealand": 10,
  "Romania": 9,
  "Guatemala": 9,
  "Latvia": 8,
  "Venezuela": 8,
  "Estonia": 7,
  "Switzerland": 7,
  "Dominican Republic": 7,
  "Wales": 6,
  "Bahrain": 6,
  "North Macedonia": 5,
  "Costa Rica": 5,
  "Puerto Rico": 5,
  "Bangladesh": 5,
  "Iran": 5,
  "Syria": 5,
  "Croatia": 4,
  "Slovakia": 4,
  "Kazakhstan": 4,
  "Qatar": 4,
  "England": 3,
  "Iceland": 3,
  "Kyrgyzstan": 3,
  "Uruguay": 3,
  "Lebanon": 3,
  "Bosnia and Herzegovina": 2,
  "Cuba": 2,
  "Ecuador": 2,
  "Paraguay": 2,
  "Palestine": 2,
  "Cyprus": 1,
  "Moldova": 1,
  "Northern Ireland": 1,
  "Uzbekistan": 1,
  "El Salvador": 1,
  "Panama": 1,
  "Brunei": 1,
  "Laos": 1,
  "Macau": 1,
  "Nepal": 1,
  "Sri Lanka": 1,
  "Iraq": 1,
  "Yemen": 1
};

// Color scheme - heat map gradient
const COLORS = {
    ocean: 0x000000,      // Pure black
    land: 0x000000,       // Pure black for no players
    glow: 0x8b5cf6,
    // Heat gradient colors
    tier0: 0x000000,      // Black - no players
    tier1: 0x2c105c,      // Dark purple - very few players
    tier2: 0x711f81,      // Purple - <50 players
    tier3: 0xb63679,      // Magenta - 50-100 players
    tier4: 0xee605e,      // Red-orange - 100-150 players
    tier5: 0xfdae61,      // Orange - 150-200 players
    tier6: 0xffd166       // Yellow - 200+ players
};

let scene, camera, renderer, globe;
let countryMeshes = [];
let playerData = {};
let isRotating = true;
let hoveredCountry = null;
let raycaster, mouse;

// Map country names from GeoJSON to your data
const countryNameMap = {
    'United States of America': 'United States',
    'South Korea': 'South Korea',
    'Republic of Korea': 'South Korea',
    'Russian Federation': 'Russia',
    'Czechia': 'Czech Republic',
    'Türkiye': 'Turkey'
};

function normalizeCountryName(name) {
    return countryNameMap[name] || name;
}

// Initialize the scene
function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);  // Pure black

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        2000
    );
    camera.position.z = CAMERA_DISTANCE;

    // Renderer setup
    const canvas = document.getElementById('globe-canvas');
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Create globe group
    globe = new THREE.Group();
    scene.add(globe);

    // Create ocean sphere - pure black
    const oceanGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const oceanMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,  // Pure black
        shininess: 50,
        transparent: false,
        opacity: 1.0
    });
    const oceanMesh = new THREE.Mesh(oceanGeometry, oceanMaterial);
    globe.add(oceanMesh);

    // Add atmosphere glow
    const glowGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.1, 64, 64);
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            coefficient: { value: 0.5 },
            power: { value: 3.5 },
            glowColor: { value: new THREE.Color(0x8b5cf6) }
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float coefficient;
            uniform float power;
            uniform vec3 glowColor;
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vec3 viewVector = normalize(cameraPosition - vPosition);
                float intensity = pow(coefficient + dot(viewVector, vNormal), power);
                gl_FragColor = vec4(glowColor, intensity * 0.5);
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    globe.add(glowMesh);

    // Load data and create globe
    loadDataAndCreateGlobe();

    // Mouse interaction
    setupInteraction();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

// Convert lat/lon to 3D coordinates
function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    
    return new THREE.Vector3(x, y, z);
}

// Load player data and create globe
async function loadDataAndCreateGlobe() {
    try {
        console.log('Starting data load...');
        
        // Use embedded player data
        playerData = PLAYER_DATA;
        console.log('✓ Loaded player data:', Object.keys(playerData).length, 'countries');

        // Create canvas texture for painting countries
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        
        // Fill with pure black
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Load world map
        console.log('Loading world atlas...');
        const worldData = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
        console.log('✓ Loaded world atlas');
        
        const countries = topojson.feature(worldData, worldData.objects.countries);
        console.log('✓ Processed countries:', countries.features.length);

        // Get player count range for color scaling
        const counts = Object.values(playerData);
        const maxCount = Math.max(...counts);

        // Set up projection to canvas
        const projection = d3.geoEquirectangular()
            .fitSize([canvas.width, canvas.height], { type: 'Sphere' });
        const pathGenerator = d3.geoPath(projection, ctx);

        // Draw each country
        countries.features.forEach(feature => {
            const countryName = normalizeCountryName(feature.properties.name);
            const playerCount = playerData[countryName] || 0;

            if (playerCount > 0) {
                const color = getColorForCount(playerCount, maxCount);
                const hexColor = '#' + color.toString(16).padStart(6, '0');
                
                ctx.fillStyle = hexColor;
                ctx.globalAlpha = 0.85;
                ctx.beginPath();
                pathGenerator(feature);
                ctx.fill();
                
                // Draw border
                ctx.strokeStyle = hexColor;
                ctx.globalAlpha = 1.0;
                ctx.lineWidth = 2;
                ctx.beginPath();
                pathGenerator(feature);
                ctx.stroke();
            }
        });

        console.log('✓ Painted countries on texture');

        // Apply texture to globe
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        // Create a semi-transparent overlay sphere with the country texture
        const overlayGeometry = new THREE.SphereGeometry(GLOBE_RADIUS + 0.5, 64, 64);
        const overlayMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            transparent: true,
            opacity: 0.9,
            emissive: 0xffffff,
            emissiveIntensity: 0.2,
            shininess: 40
        });
        const overlayMesh = new THREE.Mesh(overlayGeometry, overlayMaterial);
        globe.add(overlayMesh);

        // Create interactive country markers for hover
        countries.features.forEach(feature => {
            const countryName = normalizeCountryName(feature.properties.name);
            const playerCount = playerData[countryName] || 0;

            if (playerCount > 0) {
                const centroid = d3.geoCentroid(feature);
                const [lon, lat] = centroid;
                
                if (!isNaN(lat) && !isNaN(lon)) {
                    const position = latLonToVector3(lat, lon, GLOBE_RADIUS + 1);
                    const color = getColorForCount(playerCount, maxCount);
                    
                    // Create invisible hitbox for interaction
                    const hitboxGeometry = new THREE.SphereGeometry(15, 8, 8);
                    const hitboxMaterial = new THREE.MeshBasicMaterial({
                        color: color,
                        transparent: true,
                        opacity: 0, // Invisible but interactive
                    });
                    
                    const hitbox = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
                    hitbox.position.copy(position);
                    hitbox.userData = {
                        country: countryName,
                        playerCount: playerCount,
                        originalColor: color,
                        overlayMesh: overlayMesh
                    };
                    
                    globe.add(hitbox);
                    countryMeshes.push(hitbox);
                }
            }
        });

        console.log('✓ Created interactive markers');

        // Update top countries list
        updateTopCountries();

        // Hide loading indicator
        document.getElementById('loading').style.display = 'none';

    } catch (error) {
        console.error('Error loading data:', error);
        const loadingEl = document.getElementById('loading');
        loadingEl.innerHTML = `
            <div style="color: #ff4d6d;">Error Loading Globe</div>
            <div style="font-size: 14px; margin-top: 10px; color: #8b92b0;">
                ${error.message || 'Unknown error'}
            </div>
            <div style="font-size: 12px; margin-top: 10px; color: #8b92b0;">
                Check browser console (F12) for details
            </div>
        `;
    }
}

// Get color based on player count using heat gradient
function getColorForCount(count, maxCount) {
    if (count === 0) return COLORS.tier0;
    
    // Heat gradient tiers
    if (count >= 200) return COLORS.tier6;  // Yellow: 200+ (USA, Korea, Turkey, Brazil)
    if (count >= 150) return COLORS.tier5;  // Orange: 150-200 (Japan, France, Germany, China)
    if (count >= 100) return COLORS.tier4;  // Red-orange: 100-150 (Russia, Spain, Canada, etc)
    if (count >= 50) return COLORS.tier3;   // Magenta: 50-100
    if (count >= 10) return COLORS.tier2;   // Purple: 10-50
    return COLORS.tier1;                    // Dark purple: <10 (barely visible)
}

// Update top countries list
function updateTopCountries() {
    const topList = document.getElementById('top-list');
    const sorted = Object.entries(playerData)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    topList.innerHTML = sorted.map(([country, count], index) => `
        <div class="country-item">
            <span class="country-rank">#${index + 1}</span>
            <span class="country-name">${country}</span>
            <span class="country-count">${count}</span>
        </div>
    `).join('');
}

// Setup mouse interaction
function setupInteraction() {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    const tooltip = document.getElementById('tooltip');

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    // Mouse move handler
    function onMouseMove(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        if (!isDragging) {
            // Raycasting for hover
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(countryMeshes);

            if (intersects.length > 0) {
                const object = intersects[0].object;
                if (object.userData.playerCount > 0) {
                    // Clear previous hover
                    if (hoveredCountry && hoveredCountry !== object) {
                        const overlay = hoveredCountry.userData.overlayMesh;
                        if (overlay) {
                            overlay.material.emissiveIntensity = 0.2;
                        }
                    }

                    hoveredCountry = object;
                    
                    // Brighten the overlay
                    const overlay = object.userData.overlayMesh;
                    if (overlay) {
                        overlay.material.emissiveIntensity = 0.5;
                    }

                    tooltip.innerHTML = `
                        <div class="tooltip-country">${object.userData.country}</div>
                        <div class="tooltip-count">${object.userData.playerCount} players</div>
                    `;
                    tooltip.style.left = event.clientX + 15 + 'px';
                    tooltip.style.top = event.clientY + 15 + 'px';
                    tooltip.classList.add('visible');
                } else {
                    clearHover();
                }
            } else {
                clearHover();
            }
        }

        // Rotation on drag
        if (isDragging) {
            isRotating = false;
            const deltaX = event.clientX - previousMousePosition.x;
            const deltaY = event.clientY - previousMousePosition.y;

            globe.rotation.y += deltaX * 0.005;
            globe.rotation.x += deltaY * 0.005;

            // Limit vertical rotation
            globe.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, globe.rotation.x));

            previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    }

    function onMouseDown(event) {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
    }

    function onMouseUp() {
        isDragging = false;
        setTimeout(() => { isRotating = true; }, 2000);
    }

    function clearHover() {
        tooltip.classList.remove('visible');
        if (hoveredCountry) {
            const overlay = hoveredCountry.userData.overlayMesh;
            if (overlay) {
                overlay.material.emissiveIntensity = 0.2;
            }
            hoveredCountry = null;
        }
    }

    // Zoom with mouse wheel
    function onMouseWheel(event) {
        event.preventDefault();
        const delta = event.deltaY;
        camera.position.z += delta * 0.5;
        camera.position.z = Math.max(300, Math.min(1000, camera.position.z));
    }

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', () => {
        isDragging = false;
        clearHover();
    });
    renderer.domElement.addEventListener('wheel', onMouseWheel, { passive: false });
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Auto-rotate globe
    if (isRotating) {
        globe.rotation.y += 0.002;
    }

    renderer.render(scene, camera);
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
