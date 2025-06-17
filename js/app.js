// Global variables
let currentSection = 'login';
let currentUser = null;
let lastScrollTop = 0;

// Firebase Configuration - Updated with new project settings
const firebaseConfig = {
    apiKey: "AIzaSyBUip9Y8Bo2Mp526aYvRAamFFmmzcDkKW0",
    authDomain: "fc-wolves-team-app.firebaseapp.com",
    databaseURL: "https://fc-wolves-team-app-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fc-wolves-team-app",
    storageBucket: "fc-wolves-team-app.firebasestorage.app",
    messagingSenderId: "21060232227",
    appId: "1:21060232227:web:fc79467f3d299e070e7d96"
};

// Initialize Firebase
function initializeFirebase() {
    try {
        firebase.initializeApp(firebaseConfig);
        window.db = firebase.database();
        window.storage = firebase.storage();
        console.log('🔥 Firebase initialized successfully for FC Wolves!');
        loadInitialData();
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        console.log('Using localStorage as fallback');
        loadInitialData();
    }
}

// Load initial data
function loadInitialData() {
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    if (players.length === 0) {
        const defaultPlayers = [
            {
                id: '1',
                name: 'عبدالسلام علي',
                position: 'حارس',
                number: 1,
                code: 'gk001',
                image: 'https://via.placeholder.com/150',
                description: 'حارس مرمى موهوب ومتميز',
                joinDate: '2024-01-01',
                matches: 15,
                goals: 0
            },
            {
                id: '2',
                name: 'ميلاد خليفه',
                position: 'مدافع',
                number: 2,
                code: 'def001',
                image: 'https://via.placeholder.com/150',
                description: 'مدافع قوي وصلب',
                joinDate: '2024-01-01',
                matches: 14,
                goals: 2
            },
            {
                id: '3',
                name: 'محمد صالح',
                position: 'خط وسط',
                number: 3,
                code: 'mid001',
                image: 'https://via.placeholder.com/150',
                description: 'لاعب خط وسط متميز',
                joinDate: '2024-01-01',
                matches: 13,
                goals: 1
            },
            {
                id: '4',
                name: 'محمد محمود',
                position: 'جناح او خط وسط متمركز',
                number: 4,
                code: 'mid002',
                image: 'https://via.placeholder.com/150',
                description: 'لاعب وسط مبدع ومتميز',
                joinDate: '2024-01-01',
                matches: 15,
                goals: 5
            },
            {
                id: '5',
                name: 'عليوه',
                position: 'صانع العاب',
                number: 5,
                code: 'att001',
                image: 'https://via.placeholder.com/150',
                description: 'صانع ألعاب مبدع',
                joinDate: '2024-01-01',
                matches: 14,
                goals: 8
            },
            {
                id: '6',
                name: 'جهاد سالم',
                position: 'رأس حربه',
                number: 6,
                code: 'att002',
                image: 'https://via.placeholder.com/150',
                description: 'رأس حربة الفريق',
                joinDate: '2024-01-01',
                matches: 12,
                goals: 10
            }
        ];

        // إضافة الاحتياطيين
        const reservePlayers = [
            {
                id: '7',
                name: 'عثمان صالح',
                position: 'مدافع',
                number: 7,
                code: 'def002',
                image: 'https://via.placeholder.com/150',
                description: 'مدافع احتياطي قوي',
                joinDate: '2024-01-01',
                matches: 8,
                goals: 1,
                isReserve: true
            },
            {
                id: '8',
                name: 'محمد لامين',
                position: 'جناح',
                number: 8,
                code: 'wing001',
                image: 'https://via.placeholder.com/150',
                description: 'جناح سريع ومتميز',
                joinDate: '2024-01-01',
                matches: 6,
                goals: 3,
                isReserve: true
            },
            {
                id: '9',
                name: 'اسامه حمد',
                position: 'ليس معروف اين مركزه🤣',
                number: 9,
                code: 'unk001',
                image: 'https://via.placeholder.com/150',
                description: 'لاعب متعدد المراكز 😂',
                joinDate: '2024-01-01',
                matches: 5,
                goals: 2,
                isReserve: true
            }
        ];

        const allPlayers = [...defaultPlayers, ...reservePlayers];
        
        localStorage.setItem('players', JSON.stringify(allPlayers));
        
        if (window.db) {
            db.ref('players').set(allPlayers);
        }
    }
    
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    if (posts.length === 0) {
        const defaultPosts = [
            {
                id: '1',
                author: 'عبدالسلام علي',
                authorImage: 'https://via.placeholder.com/50',
                content: 'مرحباً بالجميع في فريق الذئاب الأسطوري! 🐺⚽',
                timestamp: new Date().toISOString(),
                likes: 5,
                comments: []
            },
            {
                id: '2',
                author: 'جهاد سالم',
                authorImage: 'https://via.placeholder.com/50',
                content: 'متحمس للمباراة القادمة! سنحقق النصر بإذن الله 💪',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                likes: 8,
                comments: []
            }
        ];
        
        localStorage.setItem('posts', JSON.stringify(defaultPosts));
        
        if (window.db) {
            db.ref('posts').set(defaultPosts);
        }
    }
}

// Check access code
function checkAccessCode() {
    const code = document.getElementById('accessCode').value.trim();
    
    if (code === '0011JMFC') {
        showSection('admin');
        loadAdminDashboard();
    } else {
        const players = JSON.parse(localStorage.getItem('players') || '[]');
        const player = players.find(p => p.code === code);
        
        if (player) {
            currentUser = player;
            localStorage.setItem('currentUser', JSON.stringify(player));
            showSection('player');
            initializePlayerDashboard();
        } else {
            showNotification('رمز الدخول غير صحيح', 'error');
        }
    }
    
    document.getElementById('accessCode').value = '';
}

// Show section
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionName + 'Section').classList.add('active');
    currentSection = sectionName;
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showSection('login');
}

// Show notification
function showNotification(message, type = 'info') {
    const toast = document.getElementById('notificationToast');
    const icon = toast.querySelector('.toast-icon');
    const messageEl = toast.querySelector('.toast-message');
    
    messageEl.textContent = message;
    toast.className = `notification-toast ${type}`;
    
    switch (type) {
        case 'success':
            icon.className = 'toast-icon fas fa-check-circle';
            break;
        case 'error':
            icon.className = 'toast-icon fas fa-exclamation-circle';
            break;
        case 'warning':
            icon.className = 'toast-icon fas fa-exclamation-triangle';
            break;
        default:
            icon.className = 'toast-icon fas fa-info-circle';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Admin Dashboard Functions
function loadAdminDashboard() {
    showAdminTab('players');
    loadAdminPlayers();
}

function showAdminTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelector(`[onclick="showAdminTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    switch (tabName) {
        case 'players':
            loadAdminPlayers();
            break;
        case 'matches':
            loadAdminMatches();
            break;
        case 'posts':
            loadAdminPosts();
            break;
        case 'notifications':
            loadAdminNotifications();
            break;
    }
}

function showAddPlayerForm() {
    document.getElementById('addPlayerForm').style.display = 'block';
}

function hideAddPlayerForm() {
    document.getElementById('addPlayerForm').style.display = 'none';
    document.querySelector('#addPlayerForm form').reset();
}

function addPlayer(event) {
    event.preventDefault();
    
    const name = document.getElementById('playerName').value.trim();
    const number = parseInt(document.getElementById('playerNumber').value);
    const position = document.getElementById('playerPosition').value;
    const code = document.getElementById('playerCode').value.trim();
    const description = document.getElementById('playerDescription').value.trim();
    const imageFile = document.getElementById('playerImage').files[0];
    
    if (!name || !number || !position || !code) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    
    // Check if number or code already exists
    if (players.some(p => p.number === number)) {
        showNotification('رقم القميص مستخدم بالفعل', 'error');
        return;
    }
    
    if (players.some(p => p.code === code)) {
        showNotification('رمز الدخول مستخدم بالفعل', 'error');
        return;
    }
    
    const newPlayer = {
        id: Date.now().toString(),
        name,
        number,
        position,
        code,
        description: description || 'لاعب متميز في الفريق',
        image: 'https://via.placeholder.com/150',
        joinDate: new Date().toISOString().split('T')[0],
        matches: 0,
        goals: 0
    };
    
    // Handle image upload - Simplified without Cloudinary
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newPlayer.image = e.target.result;
            savePlayer(newPlayer);
        };
        reader.readAsDataURL(imageFile);
    } else {
        savePlayer(newPlayer);
    }
}



function savePlayer(player) {
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    players.push(player);
    localStorage.setItem('players', JSON.stringify(players));
    
    if (window.db) {
        db.ref('players').set(players);
    }
    
    hideAddPlayerForm();
    loadAdminPlayers();
    showNotification('تم إضافة اللاعب بنجاح', 'success');
}

function loadAdminPlayers() {
    const playersList = document.getElementById('playersList');
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    
    playersList.innerHTML = '';
    
    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        playerCard.innerHTML = `
            <div class="player-avatar">
                <img src="${player.image}" alt="${player.name}">
                <div class="player-number">#${player.number}</div>
            </div>
            <h4>${player.name}</h4>
            <p>${player.position}</p>
            <p><strong>رمز الدخول:</strong> ${player.code}</p>
            <div class="player-stats">
                <span>المباريات: ${player.matches}</span>
                <span>الأهداف: ${player.goals}</span>
            </div>
            <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center;">
                <button class="btn btn-secondary" onclick="editPlayer('${player.id}')">
                    <i class="fas fa-edit"></i>
                    تعديل
                </button>
                <button class="btn btn-secondary" onclick="deletePlayer('${player.id}')">
                    <i class="fas fa-trash"></i>
                    حذف
                </button>
            </div>
        `;
        playersList.appendChild(playerCard);
    });
}

function deletePlayer(playerId) {
    if (confirm('هل أنت متأكد من حذف هذا اللاعب؟')) {
        const players = JSON.parse(localStorage.getItem('players') || '[]');
        const updatedPlayers = players.filter(p => p.id !== playerId);
        localStorage.setItem('players', JSON.stringify(updatedPlayers));
        
        if (window.db) {
            db.ref('players').set(updatedPlayers);
        }
        
        loadAdminPlayers();
        showNotification('تم حذف اللاعب بنجاح', 'success');
    }
}

function editPlayer(playerId) {
    // Implementation for editing player
    showNotification('ميزة التعديل قيد التطوير', 'info');
}

function loadAdminMatches() {
    // Implementation for matches management
    document.getElementById('matchesTab').innerHTML = `
        <div class="tab-header">
            <h2>إدارة المباريات</h2>
            <button class="btn btn-primary" onclick="showAddMatchForm()">
                <i class="fas fa-plus"></i>
                إضافة مباراة
            </button>
        </div>
        <div class="form-container">
            <h3>إضافة مباراة جديدة</h3>
            <form onsubmit="addMatch(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label>الفريق المنافس</label>
                        <input type="text" id="matchOpponent" required>
                    </div>
                    <div class="form-group">
                        <label>تاريخ المباراة</label>
                        <input type="date" id="matchDate" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>وقت المباراة</label>
                        <input type="time" id="matchTime" required>
                    </div>
                    <div class="form-group">
                        <label>نوع المباراة</label>
                        <select id="matchType" required>
                            <option value="">اختر نوع المباراة</option>
                            <option value="ودية">ودية</option>
                            <option value="دوري رمضان">دوري رمضان</option>
                            <option value="كوشة">كوشة</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>مكان المباراة</label>
                    <input type="text" id="matchVenue" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i>
                        حفظ المباراة
                    </button>
                </div>
            </form>
        </div>
        <div id="matchesList">
            <!-- Matches list will be loaded here -->
        </div>
    `;
}

function addMatch(event) {
    event.preventDefault();
    
    const opponent = document.getElementById('matchOpponent').value.trim();
    const date = document.getElementById('matchDate').value;
    const time = document.getElementById('matchTime').value;
    const type = document.getElementById('matchType').value;
    const venue = document.getElementById('matchVenue').value.trim();
    
    if (!opponent || !date || !time || !type || !venue) {
        showNotification('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    
    const newMatch = {
        id: Date.now().toString(),
        opponent,
        date,
        time,
        type,
        venue,
        created: new Date().toISOString()
    };
    
    matches.push(newMatch);
    localStorage.setItem('matches', JSON.stringify(matches));
    
    if (window.db) {
        db.ref('matches').set(matches);
    }
    
    document.querySelector('#matchesTab form').reset();
    showNotification('تم إضافة المباراة بنجاح', 'success');
    
    // Send notification to all players
    sendNotificationToPlayers(
        'مباراة جديدة!',
        `مباراة ${type} ضد ${opponent} في ${date} الساعة ${time}`,
        { type: 'match', matchId: newMatch.id }
    );
}

function loadAdminPosts() {
    // Implementation for posts management
    document.getElementById('postsTab').innerHTML = `
        <div class="tab-header">
            <h2>إدارة المنشورات</h2>
        </div>
        <div id="adminPostsList">
            <!-- Posts list will be loaded here -->
        </div>
    `;
    
    const postsList = document.getElementById('adminPostsList');
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    
    postsList.innerHTML = '';
    
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.innerHTML = `
            <div class="post-header">
                <div class="user-avatar">
                    <img src="${post.authorImage}" alt="${post.author}">
                </div>
                <div class="post-info">
                    <div class="post-author">${post.author}</div>
                    <div class="post-time">${formatTime(post.timestamp)}</div>
                </div>
                <button class="btn btn-secondary" onclick="deletePost('${post.id}')">
                    <i class="fas fa-trash"></i>
                    حذف
                </button>
            </div>
            <div class="post-content">${post.content}</div>
        `;
        postsList.appendChild(postCard);
    });
}

function deletePost(postId) {
    if (confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const updatedPosts = posts.filter(p => p.id !== postId);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        
        if (window.db) {
            db.ref('posts').set(updatedPosts);
        }
        
        loadAdminPosts();
        showNotification('تم حذف المنشور بنجاح', 'success');
    }
}

function loadAdminNotifications() {
    // Implementation for notifications management
    document.getElementById('notificationsTab').innerHTML = `
        <div class="tab-header">
            <h2>إرسال الإشعارات</h2>
        </div>
        <div class="form-container">
            <h3>إرسال إشعار جديد</h3>
            <form onsubmit="sendNotification(event)">
                <div class="form-group">
                    <label>عنوان الإشعار</label>
                    <input type="text" id="notificationTitle" required>
                </div>
                <div class="form-group">
                    <label>محتوى الإشعار</label>
                    <textarea id="notificationBody" rows="4" required></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-bell"></i>
                        إرسال الإشعار
                    </button>
                </div>
            </form>
        </div>
    `;
}

function sendNotification(event) {
    event.preventDefault();
    
    const title = document.getElementById('notificationTitle').value.trim();
    const body = document.getElementById('notificationBody').value.trim();
    
    if (!title || !body) {
        showNotification('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    sendNotificationToPlayers(title, body);
    
    document.querySelector('#notificationsTab form').reset();
    showNotification('تم إرسال الإشعار بنجاح', 'success');
}

function sendNotificationToPlayers(title, body, data = {}) {
    const notification = {
        id: Date.now().toString(),
        title,
        body,
        data,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.unshift(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    if (window.db) {
        db.ref('notifications').push(notification);
    }
    
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: '/icon.png',
            badge: '/icon.png',
            tag: notification.id
        });
    }
    
    console.log('Notification sent:', notification);
    return notification;
}

// Player Dashboard Functions
function initializePlayerDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar && currentUser.image) {
        userAvatar.src = currentUser.image;
    }
    
    showPlayerTab('formation');
    setupScrollBehavior();
}

function showPlayerTab(tabName) {
    document.querySelectorAll('.player-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-icon').forEach(icon => {
        icon.classList.remove('active');
    });
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    switch(tabName) {
        case 'formation':
            loadFormationData();
            break;
        case 'posts':
            loadPosts();
            break;
        case 'chat':
            loadChatMessages();
            break;
        case 'profile':
            loadPlayerProfile();
            break;
    }
}

function loadFormationData() {
    loadNextMatch();
    loadPlayersFormation();
    loadPlayersList();
}

function loadNextMatch() {
    const nextMatchDetails = document.getElementById('nextMatchDetails');
    const matchCountdown = document.getElementById('matchCountdown');
    
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    const nextMatch = matches.find(match => new Date(match.date) > new Date());
    
    if (nextMatch) {
        nextMatchDetails.innerHTML = `
            <div class="match-details">
                <p><strong>الخصم:</strong> ${nextMatch.opponent}</p>
                <p><strong>التاريخ:</strong> ${new Date(nextMatch.date).toLocaleDateString('ar-SA')}</p>
                <p><strong>الوقت:</strong> ${nextMatch.time}</p>
                <p><strong>المكان:</strong> ${nextMatch.venue}</p>
                <p><strong>نوع المباراة:</strong> ${nextMatch.type}</p>
            </div>
        `;
        
        startCountdown(nextMatch.date, nextMatch.time);
    } else {
        nextMatchDetails.innerHTML = '<p>لا توجد مباراة مجدولة حالياً</p>';
        matchCountdown.innerHTML = '';
    }
}

function startCountdown(matchDate, matchTime) {
    const matchDateTime = new Date(`${matchDate} ${matchTime}`);
    const countdownElement = document.getElementById('matchCountdown');
    
    function updateCountdown() {
        const now = new Date();
        const timeDiff = matchDateTime - now;
        
        if (timeDiff <= 0) {
            countdownElement.innerHTML = '<div class="countdown-item"><div class="countdown-number">انتهت</div></div>';
            return;
        }
        
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `
            <div class="countdown-item">
                <div class="countdown-number">${days}</div>
                <div class="countdown-label">يوم</div>
            </div>
            <div class="countdown-item">
                <div class="countdown-number">${hours}</div>
                <div class="countdown-label">ساعة</div>
            </div>
            <div class="countdown-item">
                <div class="countdown-number">${minutes}</div>
                <div class="countdown-label">دقيقة</div>
            </div>
            <div class="countdown-item">
                <div class="countdown-number">${seconds}</div>
                <div class="countdown-label">ثانية</div>
            </div>
        `;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function loadPlayersFormation() {
    const playersPositions = document.getElementById('playersPositions');
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const formation = localStorage.getItem('currentFormation') || '2-1-2';
    
    playersPositions.innerHTML = '';
    
    const formations = {
        '2-1-2': [
            { top: '85%', left: '50%' },
            { top: '65%', left: '25%' },
            { top: '65%', left: '75%' },
            { top: '45%', left: '50%' },
            { top: '25%', left: '35%' },
            { top: '25%', left: '65%' }
        ],
        '1-3-1': [
            { top: '85%', left: '50%' },
            { top: '65%', left: '50%' },
            { top: '45%', left: '25%' },
            { top: '45%', left: '75%' },
            { top: '45%', left: '50%' },
            { top: '25%', left: '50%' }
        ],
        '1-2-2': [
            { top: '85%', left: '50%' },
            { top: '65%', left: '50%' },
            { top: '45%', left: '35%' },
            { top: '45%', left: '65%' },
            { top: '25%', left: '35%' },
            { top: '25%', left: '65%' }
        ]
    };
    
    const positions = formations[formation] || formations['2-1-2'];
    
    players.slice(0, 6).forEach((player, index) => {
        if (positions[index]) {
            const playerElement = document.createElement('div');
            playerElement.className = 'field-player';
            playerElement.style.top = positions[index].top;
            playerElement.style.left = positions[index].left;
            playerElement.style.transform = 'translate(-50%, -50%)';
            playerElement.textContent = player.number || (index + 1);
            playerElement.title = `${player.name} - ${player.position}`;
            playersPositions.appendChild(playerElement);
        }
    });
}

function loadPlayersList() {
    const playersList = document.getElementById('playersList');
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    
    playersList.innerHTML = '';
    
    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        playerCard.innerHTML = `
            <div class="player-avatar">
                <img src="${player.image}" alt="${player.name}">
                <div class="player-number">#${player.number}</div>
            </div>
            <h4>${player.name}</h4>
            <p>${player.position}</p>
            <div class="player-stats">
                <span>المباريات: ${player.matches || 0}</span>
                <span>الأهداف: ${player.goals || 0}</span>
            </div>
        `;
        playersList.appendChild(playerCard);
    });
}

function loadPosts() {
    const postsFeed = document.getElementById('postsFeed');
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    
    postsFeed.innerHTML = '';
    
    posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.innerHTML = `
            <div class="post-header">
                <div class="user-avatar">
                    <img src="${post.authorImage}" alt="${post.author}">
                </div>
                <div class="post-info">
                    <div class="post-author">${post.author}</div>
                    <div class="post-time">${formatTime(post.timestamp)}</div>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <button class="btn btn-secondary" onclick="likePost('${post.id}')">
                    <i class="fas fa-heart"></i> ${post.likes || 0}
                </button>
                <button class="btn btn-secondary" onclick="commentPost('${post.id}')">
                    <i class="fas fa-comment"></i> تعليق
                </button>
            </div>
        `;
        postsFeed.appendChild(postCard);
    });
}

function createPost() {
    const postContent = document.getElementById('postContent').value.trim();
    if (!postContent) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    
    const newPost = {
        id: Date.now().toString(),
        author: currentUser.name || 'لاعب مجهول',
        authorImage: currentUser.image || 'https://via.placeholder.com/50',
        content: postContent,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: []
    };
    
    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    
    if (window.db) {
        db.ref('posts').set(posts);
    }
    
    document.getElementById('postContent').value = '';
    loadPosts();
    showNotification('تم نشر المنشور بنجاح!', 'success');
}

function likePost(postId) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        post.likes = (post.likes || 0) + 1;
        localStorage.setItem('posts', JSON.stringify(posts));
        
        if (window.db) {
            db.ref('posts').set(posts);
        }
        
        loadPosts();
    }
}

function commentPost(postId) {
    showNotification('ميزة التعليقات قيد التطوير', 'info');
}

function loadChatMessages() {
    const chatMessages = document.getElementById('chatMessages');
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    
    chatMessages.innerHTML = '';
    
    messages.forEach(message => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const isOwn = message.author === currentUser.name;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isOwn ? 'own' : ''}`;
        messageDiv.innerHTML = `
            <div class="user-avatar">
                <img src="${message.authorImage}" alt="${message.author}">
            </div>
            <div class="message-content">
                <div class="message-author">${message.author}</div>
                <div class="message-text">${message.text}</div>
                <div class="message-time">${formatTime(message.timestamp)}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
    });
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    
    if (!messageText) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    
    const newMessage = {
        id: Date.now().toString(),
        author: currentUser.name || 'لاعب مجهول',
        authorImage: currentUser.image || 'https://via.placeholder.com/35',
        text: messageText,
        timestamp: new Date().toISOString()
    };
    
    messages.push(newMessage);
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    
    if (window.db) {
        db.ref('chatMessages').set(messages);
    }
    
    messageInput.value = '';
    loadChatMessages();
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function loadPlayerProfile() {
    const playerProfile = document.getElementById('playerProfile');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    playerProfile.innerHTML = `
        <img src="${currentUser.image}" alt="${currentUser.name}" class="profile-avatar">
        <div class="profile-name">${currentUser.name}</div>
        <div class="profile-position">${currentUser.position}</div>
        <div class="profile-stats">
            <div class="stat-item">
                <div class="stat-number">${currentUser.number}</div>
                <div class="stat-label">رقم القميص</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${currentUser.matches || 0}</div>
                <div class="stat-label">المباريات</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${currentUser.goals || 0}</div>
                <div class="stat-label">الأهداف</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${new Date().getFullYear() - new Date(currentUser.joinDate || '2024-01-01').getFullYear()}</div>
                <div class="stat-label">سنوات الخبرة</div>
            </div>
        </div>
        <div class="profile-description">
            <h4>نبذة عن اللاعب</h4>
            <p>${currentUser.description || 'لاعب متميز في فريق الذئاب الأسطوري'}</p>
        </div>
    `;
}

function setupScrollBehavior() {
    const topNav = document.getElementById('topNav');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            topNav.classList.add('hidden');
        } else {
            topNav.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Utility Functions
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'الآن';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `منذ ${minutes} دقيقة`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `منذ ${hours} ساعة`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `منذ ${days} يوم`;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFirebase();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});


// ===== نظام الإشعارات داخل التطبيق =====

// متغيرات الإشعارات
let notificationQueue = [];
let isNotificationVisible = false;

// دالة إنشاء إشعار داخل التطبيق
function createInAppNotification(title, message, type = 'info', duration = 5000) {
    const notification = {
        id: Date.now(),
        title,
        message,
        type, // 'info', 'success', 'warning', 'error'
        duration,
        timestamp: new Date().toISOString()
    };
    
    notificationQueue.push(notification);
    
    // حفظ الإشعار في localStorage للمزامنة
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.unshift(notification);
    // الاحتفاظ بآخر 50 إشعار فقط
    if (notifications.length > 50) {
        notifications.splice(50);
    }
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // مزامنة مع Firebase
    if (window.db) {
        db.ref('notifications').set(notifications);
    }
    
    showNextNotification();
    updateNotificationBadge();
}

// دالة عرض الإشعار التالي
function showNextNotification() {
    if (isNotificationVisible || notificationQueue.length === 0) {
        return;
    }
    
    const notification = notificationQueue.shift();
    isNotificationVisible = true;
    
    // إنشاء عنصر الإشعار
    const notificationElement = document.createElement('div');
    notificationElement.className = `in-app-notification ${notification.type}`;
    notificationElement.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                ${getNotificationIcon(notification.type)}
            </div>
            <div class="notification-text">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
            </div>
            <button class="notification-close" onclick="closeNotification(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="notification-progress"></div>
    `;
    
    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notificationElement);
    
    // تأثير الظهور
    setTimeout(() => {
        notificationElement.classList.add('show');
    }, 100);
    
    // شريط التقدم
    const progressBar = notificationElement.querySelector('.notification-progress');
    progressBar.style.animationDuration = `${notification.duration}ms`;
    
    // إخفاء الإشعار تلقائياً
    setTimeout(() => {
        hideNotification(notificationElement);
    }, notification.duration);
}

// دالة إخفاء الإشعار
function hideNotification(element) {
    element.classList.add('hide');
    setTimeout(() => {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
        isNotificationVisible = false;
        showNextNotification(); // عرض الإشعار التالي إن وجد
    }, 300);
}

// دالة إغلاق الإشعار يدوياً
function closeNotification(button) {
    const notification = button.closest('.in-app-notification');
    hideNotification(notification);
}

// دالة الحصول على أيقونة الإشعار
function getNotificationIcon(type) {
    const icons = {
        info: '<i class="fas fa-info-circle"></i>',
        success: '<i class="fas fa-check-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>',
        error: '<i class="fas fa-times-circle"></i>',
        match: '<i class="fas fa-futbol"></i>',
        training: '<i class="fas fa-running"></i>',
        announcement: '<i class="fas fa-bullhorn"></i>'
    };
    return icons[type] || icons.info;
}

// دالة تحديث شارة الإشعارات
function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    const unreadNotifications = JSON.parse(localStorage.getItem('notifications') || '[]')
        .filter(n => !n.read).length;
    
    if (badge) {
        if (unreadNotifications > 0) {
            badge.textContent = unreadNotifications > 99 ? '99+' : unreadNotifications;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// دالة إرسال إشعار للجميع (من واجهة المدرب)
function sendNotificationToAll(title, message, type = 'announcement') {
    const notification = {
        id: Date.now(),
        title,
        message,
        type,
        timestamp: new Date().toISOString(),
        sender: 'المدرب',
        read: false
    };
    
    // حفظ في Firebase للمزامنة مع جميع المستخدمين
    if (window.db) {
        db.ref('globalNotifications').push(notification);
    }
    
    // عرض الإشعار محلياً
    createInAppNotification(title, message, type);
    
    showNotification('تم إرسال الإشعار لجميع اللاعبين', 'success');
}

// دالة مراقبة الإشعارات العامة من Firebase
function listenForGlobalNotifications() {
    if (window.db) {
        db.ref('globalNotifications').on('child_added', (snapshot) => {
            const notification = snapshot.val();
            if (notification && notification.timestamp) {
                // التحقق من أن الإشعار جديد (خلال آخر دقيقة)
                const notificationTime = new Date(notification.timestamp);
                const now = new Date();
                const timeDiff = now - notificationTime;
                
                if (timeDiff < 60000) { // أقل من دقيقة
                    createInAppNotification(
                        notification.title,
                        notification.message,
                        notification.type
                    );
                }
            }
        });
    }
}

// ===== تحسينات نظام المنشورات =====

// دالة إنشاء منشور جديد محسنة
function createPost() {
    const content = document.getElementById('postContent').value.trim();
    const imageFile = document.getElementById('postImage').files[0];
    
    if (!content && !imageFile) {
        showNotification('يرجى كتابة محتوى أو إضافة صورة', 'warning');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    const newPost = {
        id: Date.now().toString(),
        author: currentUser.name || 'لاعب مجهول',
        authorImage: currentUser.image || 'https://via.placeholder.com/50',
        content: content,
        image: null,
        timestamp: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        comments: [],
        type: 'post'
    };
    
    // رفع الصورة إذا كانت موجودة - مبسط بدون Cloudinary
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newPost.image = e.target.result;
            savePost(newPost);
        };
        reader.readAsDataURL(imageFile);
    } else {
        savePost(newPost);
    }
}

// دالة حفظ المنشور
function savePost(post) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.unshift(post); // إضافة في المقدمة
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // مزامنة مع Firebase
    if (window.db) {
        db.ref('posts').set(posts);
    }
    
    // تنظيف النموذج
    document.getElementById('postContent').value = '';
    document.getElementById('postImage').value = '';
    
    // إعادة تحميل المنشورات
    loadPosts();
    
    // إشعار نجاح
    showNotification('تم نشر المنشور بنجاح', 'success');
    
    // إرسال إشعار للآخرين
    createInAppNotification(
        'منشور جديد',
        `${post.author} نشر منشوراً جديداً`,
        'info'
    );
}

// دالة الإعجاب بالمنشور
function likePost(postId) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.id || currentUser.name || 'anonymous';
    
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        const post = posts[postIndex];
        
        if (!post.likedBy) {
            post.likedBy = [];
        }
        
        const userLikedIndex = post.likedBy.indexOf(userId);
        
        if (userLikedIndex === -1) {
            // إضافة إعجاب
            post.likedBy.push(userId);
            post.likes = post.likedBy.length;
        } else {
            // إزالة إعجاب
            post.likedBy.splice(userLikedIndex, 1);
            post.likes = post.likedBy.length;
        }
        
        localStorage.setItem('posts', JSON.stringify(posts));
        
        // مزامنة مع Firebase
        if (window.db) {
            db.ref('posts').set(posts);
        }
        
        loadPosts();
    }
}

// دالة حذف المنشور (للمدرب فقط)
function deletePost(postId) {
    if (confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const filteredPosts = posts.filter(p => p.id !== postId);
        
        localStorage.setItem('posts', JSON.stringify(filteredPosts));
        
        // مزامنة مع Firebase
        if (window.db) {
            db.ref('posts').set(filteredPosts);
        }
        
        loadPosts();
        showNotification('تم حذف المنشور', 'success');
    }
}

// دالة تحميل المنشورات محسنة
function loadPosts() {
    const postsContainer = document.getElementById('postsContainer');
    if (!postsContainer) return;
    
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isAdmin = currentUser.role === 'admin';
    
    postsContainer.innerHTML = '';
    
    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-comments"></i>
                <p>لا توجد منشورات بعد</p>
                <p>كن أول من ينشر شيئاً!</p>
            </div>
        `;
        return;
    }
    
    posts.forEach(post => {
        const userLiked = post.likedBy && post.likedBy.includes(currentUser.id || currentUser.name || 'anonymous');
        
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            <div class="post-header">
                <div class="post-author">
                    <img src="${post.authorImage}" alt="${post.author}" class="author-avatar">
                    <div class="author-info">
                        <div class="author-name">${post.author}</div>
                        <div class="post-time">${formatTime(post.timestamp)}</div>
                    </div>
                </div>
                ${isAdmin ? `
                    <button class="delete-post-btn" onclick="deletePost('${post.id}')" title="حذف المنشور">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
            
            <div class="post-content">
                ${post.content ? `<p>${post.content}</p>` : ''}
                ${post.image ? `<img src="${post.image}" alt="صورة المنشور" class="post-image">` : ''}
            </div>
            
            <div class="post-actions">
                <button class="like-btn ${userLiked ? 'liked' : ''}" onclick="likePost('${post.id}')">
                    <i class="fas fa-heart"></i>
                    <span>${post.likes || 0}</span>
                </button>
                <button class="comment-btn" onclick="toggleComments('${post.id}')">
                    <i class="fas fa-comment"></i>
                    <span>${post.comments ? post.comments.length : 0}</span>
                </button>
                <button class="share-btn" onclick="sharePost('${post.id}')">
                    <i class="fas fa-share"></i>
                    مشاركة
                </button>
            </div>
            
            <div class="comments-section" id="comments-${post.id}" style="display: none;">
                <div class="comments-list" id="commentsList-${post.id}">
                    ${post.comments ? post.comments.map(comment => `
                        <div class="comment">
                            <img src="${comment.authorImage}" alt="${comment.author}" class="comment-avatar">
                            <div class="comment-content">
                                <div class="comment-author">${comment.author}</div>
                                <div class="comment-text">${comment.text}</div>
                                <div class="comment-time">${formatTime(comment.timestamp)}</div>
                            </div>
                        </div>
                    `).join('') : ''}
                </div>
                <div class="add-comment">
                    <input type="text" placeholder="اكتب تعليقاً..." class="comment-input" 
                           onkeypress="handleCommentKeyPress(event, '${post.id}')">
                    <button onclick="addComment('${post.id}')" class="add-comment-btn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        
        postsContainer.appendChild(postElement);
    });
}

// دالة التبديل بين إظهار وإخفاء التعليقات
function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    if (commentsSection.style.display === 'none') {
        commentsSection.style.display = 'block';
    } else {
        commentsSection.style.display = 'none';
    }
}

// دالة إضافة تعليق
function addComment(postId) {
    const commentInput = document.querySelector(`#comments-${postId} .comment-input`);
    const commentText = commentInput.value.trim();
    
    if (!commentText) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        if (!posts[postIndex].comments) {
            posts[postIndex].comments = [];
        }
        
        const newComment = {
            id: Date.now().toString(),
            author: currentUser.name || 'لاعب مجهول',
            authorImage: currentUser.image || 'https://via.placeholder.com/35',
            text: commentText,
            timestamp: new Date().toISOString()
        };
        
        posts[postIndex].comments.push(newComment);
        
        localStorage.setItem('posts', JSON.stringify(posts));
        
        // مزامنة مع Firebase
        if (window.db) {
            db.ref('posts').set(posts);
        }
        
        commentInput.value = '';
        loadPosts();
        
        // إعادة فتح قسم التعليقات
        setTimeout(() => {
            document.getElementById(`comments-${postId}`).style.display = 'block';
        }, 100);
    }
}

// دالة التعامل مع ضغط Enter في حقل التعليق
function handleCommentKeyPress(event, postId) {
    if (event.key === 'Enter') {
        addComment(postId);
    }
}

// دالة مشاركة المنشور
function sharePost(postId) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    if (post && navigator.share) {
        navigator.share({
            title: 'منشور من فريق FC Wolves',
            text: post.content,
            url: window.location.href
        });
    } else {
        // نسخ رابط المنشور
        const url = `${window.location.href}#post-${postId}`;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('تم نسخ رابط المنشور', 'success');
        });
    }
}

// تهيئة نظام الإشعارات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // بدء مراقبة الإشعارات العامة
    listenForGlobalNotifications();
    
    // تحديث شارة الإشعارات
    updateNotificationBadge();
    
    // مراقبة تغييرات Firebase للمنشورات
    if (window.db) {
        db.ref('posts').on('value', (snapshot) => {
            if (snapshot.exists()) {
                const posts = snapshot.val();
                localStorage.setItem('posts', JSON.stringify(posts));
                if (document.getElementById('postsContainer')) {
                    loadPosts();
                }
            }
        });
    }
});


// ===== نظام الإشعارات المتقدم والجبار ===== 

// متغيرات الإشعارات المتقدمة
let notificationQueue = [];
let isNotificationVisible = false;
let notificationSound = null;

// تهيئة صوت الإشعارات
function initializeNotificationSound() {
    // إنشاء صوت إشعار بسيط باستخدام Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function createNotificationSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    notificationSound = createNotificationSound;
}

// دالة إنشاء إشعار متقدم
function createAdvancedNotification(title, message, type = 'info', duration = 6000, actions = []) {
    const notification = {
        id: Date.now() + Math.random(),
        title,
        message,
        type,
        duration,
        actions,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    // إضافة إلى قائمة الانتظار
    notificationQueue.push(notification);
    
    // حفظ في localStorage
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.unshift(notification);
    if (notifications.length > 100) {
        notifications.splice(100);
    }
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // مزامنة مع Firebase
    if (window.db) {
        db.ref('notifications').set(notifications);
    }
    
    // تشغيل صوت الإشعار
    if (notificationSound && type !== 'silent') {
        try {
            notificationSound();
        } catch (error) {
            console.log('Could not play notification sound');
        }
    }
    
    showNextAdvancedNotification();
    updateNotificationBadge();
    
    return notification.id;
}

// دالة عرض الإشعار المتقدم
function showNextAdvancedNotification() {
    if (isNotificationVisible || notificationQueue.length === 0) {
        return;
    }
    
    const notification = notificationQueue.shift();
    isNotificationVisible = true;
    
    // إنشاء عنصر الإشعار المتقدم
    const notificationElement = document.createElement('div');
    notificationElement.className = `advanced-notification ${notification.type}`;
    notificationElement.innerHTML = `
        <div class="notification-header">
            <div class="notification-icon">
                ${getAdvancedNotificationIcon(notification.type)}
            </div>
            <div class="notification-meta">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-time">${formatNotificationTime(notification.timestamp)}</div>
            </div>
            <button class="notification-close" onclick="closeAdvancedNotification(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="notification-body">
            <div class="notification-message">${notification.message}</div>
            ${notification.actions.length > 0 ? `
                <div class="notification-actions">
                    ${notification.actions.map(action => `
                        <button class="notification-action-btn ${action.style || 'primary'}" 
                                onclick="${action.callback}('${notification.id}')">
                            ${action.icon ? `<i class="${action.icon}"></i>` : ''}
                            ${action.text}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        </div>
        <div class="notification-progress"></div>
    `;
    
    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notificationElement);
    
    // تأثير الظهور المتقدم
    setTimeout(() => {
        notificationElement.classList.add('show');
    }, 100);
    
    // شريط التقدم المتحرك
    const progressBar = notificationElement.querySelector('.notification-progress');
    progressBar.style.animationDuration = `${notification.duration}ms`;
    
    // إخفاء الإشعار تلقائياً
    setTimeout(() => {
        hideAdvancedNotification(notificationElement);
    }, notification.duration);
}

// دالة إخفاء الإشعار المتقدم
function hideAdvancedNotification(element) {
    element.classList.add('hide');
    setTimeout(() => {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
        isNotificationVisible = false;
        showNextAdvancedNotification();
    }, 400);
}

// دالة إغلاق الإشعار يدوياً
function closeAdvancedNotification(button) {
    const notification = button.closest('.advanced-notification');
    hideAdvancedNotification(notification);
}

// دالة الحصول على أيقونة الإشعار المتقدمة
function getAdvancedNotificationIcon(type) {
    const icons = {
        info: '<i class="fas fa-info-circle"></i>',
        success: '<i class="fas fa-check-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>',
        error: '<i class="fas fa-times-circle"></i>',
        match: '<i class="fas fa-futbol"></i>',
        training: '<i class="fas fa-running"></i>',
        announcement: '<i class="fas fa-bullhorn"></i>',
        player: '<i class="fas fa-user-plus"></i>',
        formation: '<i class="fas fa-chess-board"></i>',
        goal: '<i class="fas fa-trophy"></i>',
        celebration: '<i class="fas fa-star"></i>'
    };
    return icons[type] || icons.info;
}

// دالة تنسيق وقت الإشعار
function formatNotificationTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'الآن';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `منذ ${minutes} دقيقة`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `منذ ${hours} ساعة`;
    } else {
        return date.toLocaleDateString('ar-SA');
    }
}

// دالة إرسال إشعار للجميع من واجهة المدرب
function sendAdvancedNotificationToAll(title, message, type = 'announcement') {
    const notification = {
        id: Date.now() + Math.random(),
        title,
        message,
        type,
        timestamp: new Date().toISOString(),
        sender: 'المدرب',
        read: false,
        global: true
    };
    
    // حفظ في Firebase للمزامنة مع جميع المستخدمين
    if (window.db) {
        db.ref('globalNotifications').push(notification);
    }
    
    // عرض الإشعار محلياً
    createAdvancedNotification(title, message, type, 8000, [
        {
            text: 'تم الاستلام',
            style: 'success',
            icon: 'fas fa-check',
            callback: 'acknowledgeNotification'
        }
    ]);
    
    showNotification('تم إرسال الإشعار لجميع اللاعبين بنجاح! 🚀', 'success');
}

// دالة الاعتراف بالإشعار
function acknowledgeNotification(notificationId) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const notificationIndex = notifications.findIndex(n => n.id == notificationId);
    
    if (notificationIndex !== -1) {
        notifications[notificationIndex].read = true;
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        if (window.db) {
            db.ref('notifications').set(notifications);
        }
        
        updateNotificationBadge();
    }
}

// دالة مراقبة الإشعارات العامة المتقدمة
function listenForAdvancedGlobalNotifications() {
    if (window.db) {
        db.ref('globalNotifications').on('child_added', (snapshot) => {
            const notification = snapshot.val();
            if (notification && notification.timestamp) {
                const notificationTime = new Date(notification.timestamp);
                const now = new Date();
                const timeDiff = now - notificationTime;
                
                // عرض الإشعارات الجديدة فقط (خلال آخر دقيقتين)
                if (timeDiff < 120000) {
                    createAdvancedNotification(
                        notification.title,
                        notification.message,
                        notification.type,
                        8000,
                        [
                            {
                                text: 'عرض التفاصيل',
                                style: 'primary',
                                icon: 'fas fa-eye',
                                callback: 'viewNotificationDetails'
                            }
                        ]
                    );
                }
            }
        });
    }
}

// دالة عرض تفاصيل الإشعار
function viewNotificationDetails(notificationId) {
    // يمكن توسيع هذه الدالة لعرض تفاصيل أكثر
    createAdvancedNotification(
        'تفاصيل الإشعار',
        'تم عرض تفاصيل الإشعار بنجاح',
        'info',
        3000
    );
}

// ===== نظام المنشورات المتقدم والتفاعلي =====

// دالة إنشاء منشور متقدم
function createAdvancedPost() {
    const content = document.getElementById('postContent').value.trim();
    const imageFile = document.getElementById('postImage').files[0];
    
    if (!content && !imageFile) {
        createAdvancedNotification(
            'خطأ في النشر',
            'يرجى كتابة محتوى أو إضافة صورة للمنشور',
            'warning',
            4000
        );
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    const newPost = {
        id: Date.now().toString() + Math.random(),
        author: currentUser.name || 'لاعب مجهول',
        authorImage: currentUser.image || 'https://via.placeholder.com/50',
        authorPosition: currentUser.position || '',
        content: content,
        image: null,
        timestamp: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        comments: [],
        shares: 0,
        type: 'post',
        reactions: {
            like: 0,
            love: 0,
            laugh: 0,
            angry: 0,
            sad: 0
        },
        reactedBy: {}
    };
    
    // معالجة الصورة إذا كانت موجودة
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newPost.image = e.target.result;
            saveAdvancedPost(newPost);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveAdvancedPost(newPost);
    }
}

// دالة حفظ المنشور المتقدم
function saveAdvancedPost(post) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.unshift(post);
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // مزامنة مع Firebase
    if (window.db) {
        db.ref('posts').set(posts);
    }
    
    // تنظيف النموذج
    document.getElementById('postContent').value = '';
    if (document.getElementById('postImage')) {
        document.getElementById('postImage').value = '';
    }
    
    // إعادة تحميل المنشورات
    loadAdvancedPosts();
    
    // إشعار نجاح متقدم
    createAdvancedNotification(
        'تم النشر بنجاح! 🎉',
        'تم نشر منشورك وسيراه جميع أعضاء الفريق',
        'success',
        5000,
        [
            {
                text: 'عرض المنشور',
                style: 'primary',
                icon: 'fas fa-eye',
                callback: 'scrollToPost'
            }
        ]
    );
    
    // إرسال إشعار للآخرين
    createAdvancedNotification(
        'منشور جديد من الفريق! ⚽',
        `${post.author} نشر منشوراً جديداً في مجتمع FC Wolves`,
        'info',
        6000
    );
}

// دالة التمرير إلى المنشور
function scrollToPost(postId) {
    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    if (postElement) {
        postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        postElement.classList.add('highlight-post');
        setTimeout(() => {
            postElement.classList.remove('highlight-post');
        }, 3000);
    }
}

// دالة التفاعل مع المنشور (إعجاب متقدم)
function reactToPost(postId, reactionType = 'like') {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.id || currentUser.name || 'anonymous';
    
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        const post = posts[postIndex];
        
        // تهيئة التفاعلات إذا لم تكن موجودة
        if (!post.reactions) {
            post.reactions = { like: 0, love: 0, laugh: 0, angry: 0, sad: 0 };
        }
        if (!post.reactedBy) {
            post.reactedBy = {};
        }
        
        // إزالة التفاعل السابق إذا كان موجوداً
        const previousReaction = post.reactedBy[userId];
        if (previousReaction) {
            post.reactions[previousReaction]--;
        }
        
        // إضافة التفاعل الجديد أو إزالته إذا كان نفس التفاعل
        if (previousReaction === reactionType) {
            delete post.reactedBy[userId];
        } else {
            post.reactions[reactionType]++;
            post.reactedBy[userId] = reactionType;
        }
        
        // تحديث العدد الإجمالي للإعجابات
        post.likes = Object.values(post.reactions).reduce((sum, count) => sum + count, 0);
        
        localStorage.setItem('posts', JSON.stringify(posts));
        
        // مزامنة مع Firebase
        if (window.db) {
            db.ref('posts').set(posts);
        }
        
        loadAdvancedPosts();
        
        // إشعار تفاعل
        if (post.reactedBy[userId]) {
            createAdvancedNotification(
                'تم التفاعل! 👍',
                `تفاعلت مع منشور ${post.author}`,
                'success',
                2000
            );
        }
    }
}

// دالة تحميل المنشورات المتقدمة
function loadAdvancedPosts() {
    const postsContainer = document.getElementById('postsContainer');
    if (!postsContainer) return;
    
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isAdmin = currentUser.role === 'admin';
    
    postsContainer.innerHTML = '';
    
    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="no-posts">
                <div class="no-posts-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <h3>لا توجد منشورات بعد</h3>
                <p>كن أول من ينشر شيئاً في مجتمع FC Wolves!</p>
                <button class="btn btn-primary" onclick="focusPostInput()">
                    <i class="fas fa-plus"></i>
                    إنشاء منشور
                </button>
            </div>
        `;
        return;
    }
    
    posts.forEach(post => {
        const userReaction = post.reactedBy && post.reactedBy[currentUser.id || currentUser.name || 'anonymous'];
        
        const postElement = document.createElement('div');
        postElement.className = 'advanced-post-card';
        postElement.setAttribute('data-post-id', post.id);
        postElement.innerHTML = `
            <div class="post-header">
                <div class="post-author-info">
                    <img src="${post.authorImage}" alt="${post.author}" class="author-avatar">
                    <div class="author-details">
                        <div class="author-name">${post.author}</div>
                        ${post.authorPosition ? `<div class="author-position">${post.authorPosition}</div>` : ''}
                        <div class="post-timestamp">${formatAdvancedTime(post.timestamp)}</div>
                    </div>
                </div>
                <div class="post-menu">
                    ${isAdmin ? `
                        <button class="post-menu-btn" onclick="togglePostMenu('${post.id}')">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <div class="post-menu-dropdown" id="menu-${post.id}">
                            <button onclick="deleteAdvancedPost('${post.id}')" class="menu-item danger">
                                <i class="fas fa-trash"></i>
                                حذف المنشور
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="post-content">
                ${post.content ? `<p class="post-text">${post.content}</p>` : ''}
                ${post.image ? `<img src="${post.image}" alt="صورة المنشور" class="post-image" onclick="openImageModal('${post.image}')">` : ''}
            </div>
            
            <div class="post-reactions">
                <div class="reaction-buttons">
                    <button class="reaction-btn ${userReaction === 'like' ? 'active' : ''}" 
                            onclick="reactToPost('${post.id}', 'like')" title="إعجاب">
                        <i class="fas fa-thumbs-up"></i>
                        <span>${post.reactions?.like || 0}</span>
                    </button>
                    <button class="reaction-btn ${userReaction === 'love' ? 'active' : ''}" 
                            onclick="reactToPost('${post.id}', 'love')" title="حب">
                        <i class="fas fa-heart"></i>
                        <span>${post.reactions?.love || 0}</span>
                    </button>
                    <button class="reaction-btn ${userReaction === 'laugh' ? 'active' : ''}" 
                            onclick="reactToPost('${post.id}', 'laugh')" title="ضحك">
                        <i class="fas fa-laugh"></i>
                        <span>${post.reactions?.laugh || 0}</span>
                    </button>
                    <button class="comment-btn" onclick="toggleAdvancedComments('${post.id}')">
                        <i class="fas fa-comment"></i>
                        <span>${post.comments ? post.comments.length : 0}</span>
                    </button>
                    <button class="share-btn" onclick="shareAdvancedPost('${post.id}')">
                        <i class="fas fa-share"></i>
                        مشاركة
                    </button>
                </div>
            </div>
            
            <div class="advanced-comments-section" id="comments-${post.id}" style="display: none;">
                <div class="comments-list" id="commentsList-${post.id}">
                    ${post.comments ? post.comments.map(comment => `
                        <div class="advanced-comment">
                            <img src="${comment.authorImage}" alt="${comment.author}" class="comment-avatar">
                            <div class="comment-bubble">
                                <div class="comment-author">${comment.author}</div>
                                <div class="comment-text">${comment.text}</div>
                                <div class="comment-time">${formatAdvancedTime(comment.timestamp)}</div>
                            </div>
                        </div>
                    `).join('') : ''}
                </div>
                <div class="add-advanced-comment">
                    <img src="${currentUser.image || 'https://via.placeholder.com/35'}" alt="أنت" class="comment-input-avatar">
                    <div class="comment-input-container">
                        <input type="text" placeholder="اكتب تعليقاً..." class="advanced-comment-input" 
                               onkeypress="handleAdvancedCommentKeyPress(event, '${post.id}')">
                        <button onclick="addAdvancedComment('${post.id}')" class="add-comment-btn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        postsContainer.appendChild(postElement);
    });
}

// دالة تنسيق الوقت المتقدم
function formatAdvancedTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'الآن';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `منذ ${minutes} دقيقة`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `منذ ${hours} ساعة`;
    } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `منذ ${days} يوم`;
    } else {
        return date.toLocaleDateString('ar-SA');
    }
}

// دالة التبديل بين إظهار وإخفاء التعليقات المتقدمة
function toggleAdvancedComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    if (commentsSection.style.display === 'none') {
        commentsSection.style.display = 'block';
        commentsSection.classList.add('slide-down');
    } else {
        commentsSection.style.display = 'none';
        commentsSection.classList.remove('slide-down');
    }
}

// دالة إضافة تعليق متقدم
function addAdvancedComment(postId) {
    const commentInput = document.querySelector(`#comments-${postId} .advanced-comment-input`);
    const commentText = commentInput.value.trim();
    
    if (!commentText) {
        createAdvancedNotification(
            'تعليق فارغ',
            'يرجى كتابة تعليق قبل الإرسال',
            'warning',
            3000
        );
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        if (!posts[postIndex].comments) {
            posts[postIndex].comments = [];
        }
        
        const newComment = {
            id: Date.now().toString() + Math.random(),
            author: currentUser.name || 'لاعب مجهول',
            authorImage: currentUser.image || 'https://via.placeholder.com/35',
            text: commentText,
            timestamp: new Date().toISOString(),
            likes: 0
        };
        
        posts[postIndex].comments.push(newComment);
        
        localStorage.setItem('posts', JSON.stringify(posts));
        
        // مزامنة مع Firebase
        if (window.db) {
            db.ref('posts').set(posts);
        }
        
        commentInput.value = '';
        loadAdvancedPosts();
        
        // إعادة فتح قسم التعليقات
        setTimeout(() => {
            document.getElementById(`comments-${postId}`).style.display = 'block';
        }, 100);
        
        // إشعار نجاح التعليق
        createAdvancedNotification(
            'تم إضافة التعليق! 💬',
            'تم نشر تعليقك بنجاح',
            'success',
            3000
        );
    }
}

// دالة التعامل مع ضغط Enter في حقل التعليق المتقدم
function handleAdvancedCommentKeyPress(event, postId) {
    if (event.key === 'Enter') {
        addAdvancedComment(postId);
    }
}

// دالة مشاركة المنشور المتقدمة
function shareAdvancedPost(postId) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        // تحديث عداد المشاركات
        post.shares = (post.shares || 0) + 1;
        localStorage.setItem('posts', JSON.stringify(posts));
        
        if (window.db) {
            db.ref('posts').set(posts);
        }
        
        if (navigator.share) {
            navigator.share({
                title: 'منشور من فريق FC Wolves',
                text: post.content,
                url: window.location.href
            });
        } else {
            // نسخ رابط المنشور
            const url = `${window.location.href}#post-${postId}`;
            navigator.clipboard.writeText(url).then(() => {
                createAdvancedNotification(
                    'تم نسخ الرابط! 🔗',
                    'تم نسخ رابط المنشور إلى الحافظة',
                    'success',
                    3000
                );
            });
        }
        
        loadAdvancedPosts();
    }
}

// دالة حذف المنشور المتقدم
function deleteAdvancedPost(postId) {
    if (confirm('هل أنت متأكد من حذف هذا المنشور؟ لا يمكن التراجع عن هذا الإجراء.')) {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const filteredPosts = posts.filter(p => p.id !== postId);
        
        localStorage.setItem('posts', JSON.stringify(filteredPosts));
        
        // مزامنة مع Firebase
        if (window.db) {
            db.ref('posts').set(filteredPosts);
        }
        
        loadAdvancedPosts();
        
        createAdvancedNotification(
            'تم حذف المنشور',
            'تم حذف المنشور بنجاح من مجتمع الفريق',
            'success',
            4000
        );
    }
}

// دالة التبديل بين قائمة المنشور
function togglePostMenu(postId) {
    const menu = document.getElementById(`menu-${postId}`);
    const allMenus = document.querySelectorAll('.post-menu-dropdown');
    
    // إغلاق جميع القوائم الأخرى
    allMenus.forEach(m => {
        if (m !== menu) {
            m.style.display = 'none';
        }
    });
    
    // تبديل القائمة الحالية
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// دالة فتح مودال الصورة
function openImageModal(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <span class="image-modal-close" onclick="closeImageModal(this)">&times;</span>
            <img src="${imageSrc}" alt="صورة مكبرة" class="modal-image">
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// دالة إغلاق مودال الصورة
function closeImageModal(closeBtn) {
    const modal = closeBtn.closest('.image-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

// دالة التركيز على حقل إدخال المنشور
function focusPostInput() {
    const postInput = document.getElementById('postContent');
    if (postInput) {
        postInput.focus();
        postInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// تهيئة النظام المتقدم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة صوت الإشعارات
    initializeNotificationSound();
    
    // بدء مراقبة الإشعارات العامة المتقدمة
    listenForAdvancedGlobalNotifications();
    
    // تحديث شارة الإشعارات
    updateNotificationBadge();
    
    // مراقبة تغييرات Firebase للمنشورات المتقدمة
    if (window.db) {
        db.ref('posts').on('value', (snapshot) => {
            if (snapshot.exists()) {
                const posts = snapshot.val();
                localStorage.setItem('posts', JSON.stringify(posts));
                if (document.getElementById('postsContainer')) {
                    loadAdvancedPosts();
                }
            }
        });
    }
    
    // إغلاق قوائم المنشورات عند النقر خارجها
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.post-menu')) {
            const allMenus = document.querySelectorAll('.post-menu-dropdown');
            allMenus.forEach(menu => {
                menu.style.display = 'none';
            });
        }
    });
});

