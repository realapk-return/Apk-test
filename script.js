// Dummy Initial Data
const defaultApps = [
    { id: 1, name: "CyberX Mod", version: "v2.1", size: "45MB", icon: "https://via.placeholder.com/100/00ffcc/000?text=CX", desc: "Premium unlocked, No ads.", link: "#" }
];

// Initialize Database in LocalStorage
function getApps() {
    let apps = localStorage.getItem('apk_db');
    return apps ? JSON.parse(apps) : defaultApps;
}

function saveApps(apps) {
    localStorage.setItem('apk_db', JSON.stringify(apps));
}

// 1. Home Page Logic
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    const appGrid = document.getElementById('appGrid');
    const apps = getApps();
    
    appGrid.innerHTML = '';
    apps.forEach(app => {
        appGrid.innerHTML += `
            <div class="glass-panel app-card" onclick="location.href='details.html?id=${app.id}'">
                <img src="${app.icon}" class="app-icon neon-border">
                <h3 style="font-size: 14px;">${app.name}</h3>
                <p style="font-size: 12px; color: #888;">${app.version}</p>
            </div>
        `;
    });
}

// 2. Details Page Logic (Playstore Style & Timer)
if (window.location.pathname.endsWith('details.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const appId = parseInt(urlParams.get('id'));
    const apps = getApps();
    const app = apps.find(a => a.id === appId);

    if (app) {
        document.getElementById('appIcon').src = app.icon;
        document.getElementById('appName').innerText = app.name;
        document.getElementById('appMeta').innerText = `${app.version} • ${app.size}`;
        document.getElementById('appDesc').innerText = app.desc;

        const downloadBtn = document.getElementById('downloadBtn');
        const timerDisplay = document.getElementById('timer');

        downloadBtn.addEventListener('click', () => {
            downloadBtn.style.display = 'none';
            timerDisplay.style.display = 'block';
            let timeLeft = 10; // 10 Second Waiting Timer
            
            timerDisplay.innerText = `Generating link in ${timeLeft}s...`;
            
            const countdown = setInterval(() => {
                timeLeft--;
                timerDisplay.innerText = `Generating link in ${timeLeft}s...`;
                if (timeLeft <= 0) {
                    clearInterval(countdown);
                    timerDisplay.style.display = 'none';
                    downloadBtn.style.display = 'block';
                    downloadBtn.innerText = "Download Now";
                    downloadBtn.onclick = () => window.location.href = app.link;
                }
            }, 1000);
        });
    } else {
        document.getElementById('appName').innerText = "App Not Found!";
    }
}

// 3. Admin Panel Logic
if (window.location.pathname.endsWith('admin.html')) {
    document.getElementById('addAppForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const apps = getApps();
        
        const newApp = {
            id: Date.now(),
            name: document.getElementById('appName').value,
            version: document.getElementById('appVersion').value,
            size: document.getElementById('appSize').value,
            icon: document.getElementById('appIcon').value,
            desc: document.getElementById('appDesc').value,
            link: document.getElementById('appLink').value
        };

        apps.push(newApp);
        saveApps(apps);
        alert('App Posted Successfully!');
        this.reset();
    });
}
