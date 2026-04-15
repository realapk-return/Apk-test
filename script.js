// Dummy Initial Data with Categories
const defaultApps = [
    { id: 1, name: "CyberX Tool", category: "Tools", version: "v3.0", size: "15MB", icon: "https://via.placeholder.com/100/1c1c1e/fff?text=CX", desc: "Advanced modding toolkit.", link: "#" },
    { id: 2, name: "Anime Mod", category: "Entertainment", version: "v1.2", size: "45MB", icon: "https://via.placeholder.com/100/1c1c1e/fff?text=AM", desc: "Ad-free streaming app.", link: "#" }
];

function getApps() {
    let apps = localStorage.getItem('apk_db_v2');
    return apps ? JSON.parse(apps) : defaultApps;
}

function saveApps(apps) {
    localStorage.setItem('apk_db_v2', JSON.stringify(apps));
}

// === 1. HOME PAGE LOGIC ===
if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
    const appListDiv = document.getElementById('appList');
    const searchInput = document.getElementById('searchInput');
    let currentCategory = 'All';

    function renderHomeApps(searchQuery = '') {
        const apps = getApps();
        appListDiv.innerHTML = '';
        
        let filteredApps = apps.filter(app => {
            let matchSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
            let matchCat = currentCategory === 'All' || app.category === currentCategory;
            return matchSearch && matchCat;
        });

        filteredApps.forEach(app => {
            appListDiv.innerHTML += `
                <div class="app-item" onclick="location.href='details.html?id=${app.id}'">
                    <img src="${app.icon}" class="app-icon">
                    <div class="app-info">
                        <h3>${app.name}</h3>
                        <p class="text-muted">${app.category} • ${app.size}</p>
                    </div>
                    <button class="btn-get">GET</button>
                </div>
            `;
        });
    }

    // Category Click Event
    window.setCategory = function(cat, btn) {
        currentCategory = cat;
        document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        renderHomeApps(searchInput.value);
    }

    // Search Event
    searchInput.addEventListener('input', (e) => {
        renderHomeApps(e.target.value);
    });

    renderHomeApps();
}

// === 2. DETAILS PAGE LOGIC ===
if (window.location.pathname.includes('details.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const appId = parseInt(urlParams.get('id'));
    const app = getApps().find(a => a.id === appId);

    if (app) {
        document.title = app.name;
        document.getElementById('appIcon').src = app.icon;
        document.getElementById('appName').innerText = app.name;
        document.getElementById('appMeta').innerText = `${app.category} • ${app.version} • ${app.size}`;
        document.getElementById('appDesc').innerText = app.desc;

        const downloadBtn = document.getElementById('downloadBtn');
        const timerDisplay = document.getElementById('timer');

        downloadBtn.addEventListener('click', () => {
            downloadBtn.style.display = 'none';
            timerDisplay.style.display = 'block';
            let timeLeft = 10;
            
            const countdown = setInterval(() => {
                timerDisplay.innerText = `Preparing download... ${timeLeft}s`;
                timeLeft--;
                if (timeLeft < 0) {
                    clearInterval(countdown);
                    timerDisplay.style.display = 'none';
                    downloadBtn.style.display = 'block';
                    downloadBtn.innerText = "Install APK";
                    downloadBtn.onclick = () => window.location.href = app.link;
                }
            }, 1000);
        });
    }
}

// === 3. ADMIN PANEL LOGIC ===
if (window.location.pathname.includes('admin.html')) {
    let editId = null;

    function renderAdminList() {
        const apps = getApps();
        const listDiv = document.getElementById('adminAppList');
        listDiv.innerHTML = '';
        
        apps.forEach(app => {
            listDiv.innerHTML += `
                <div class="admin-app-card">
                    <div>
                        <strong>${app.name}</strong>
                        <div style="font-size: 12px; color: #8e8e93;">${app.version}</div>
                    </div>
                    <div>
                        <button class="btn-edit" onclick="editApp(${app.id})">Edit</button>
                        <button class="btn-delete" onclick="deleteApp(${app.id})">Del</button>
                    </div>
                </div>
            `;
        });
    }

    window.editApp = function(id) {
        const app = getApps().find(a => a.id === id);
        if(app) {
            editId = id;
            document.getElementById('appName').value = app.name;
            document.getElementById('appCategory').value = app.category;
            document.getElementById('appVersion').value = app.version;
            document.getElementById('appSize').value = app.size;
            document.getElementById('appIcon').value = app.icon;
            document.getElementById('appLink').value = app.link;
            document.getElementById('appDesc').value = app.desc;
            document.getElementById('submitBtn').innerText = "Update App";
            window.scrollTo(0, 0);
        }
    }

    window.deleteApp = function(id) {
        if(confirm("Are you sure?")) {
            let apps = getApps().filter(a => a.id !== id);
            saveApps(apps);
            renderAdminList();
        }
    }

    document.getElementById('addAppForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let apps = getApps();
        
        const appData = {
            id: editId ? editId : Date.now(),
            name: document.getElementById('appName').value,
            category: document.getElementById('appCategory').value,
            version: document.getElementById('appVersion').value,
            size: document.getElementById('appSize').value,
            icon: document.getElementById('appIcon').value,
            desc: document.getElementById('appDesc').value,
            link: document.getElementById('appLink').value
        };

        if (editId) {
            apps = apps.map(a => a.id === editId ? appData : a);
            editId = null;
            document.getElementById('submitBtn').innerText = "Publish App";
        } else {
            apps.push(appData);
        }

        saveApps(apps);
        this.reset();
        renderAdminList();
        alert('Saved Successfully!');
    });

    renderAdminList();
}
