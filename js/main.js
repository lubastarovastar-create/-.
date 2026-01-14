// Глобальные переменные для хранения данных
let allClubs = [];
let filteredClubs = [];

// Загрузка данных о кружках
async function loadClubsData() {
    try {
        const response = await fetch('data/clubs.json');
        allClubs = await response.json();
        return allClubs;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        return [];
    }
}

// Загрузка всех кружков для страницы clubs.html
async function loadAllClubs() {
    const clubs = await loadClubsData();
    filteredClubs = [...clubs];
    displayClubs(clubs);
}

// Отображение кружков
function displayClubs(clubs) {
    const container = document.getElementById('clubs-container');
    const noResults = document.getElementById('no-results');
    
    if (!container) return;
    
    if (clubs.length === 0) {
        container.innerHTML = '';
        if (noResults) {
            noResults.style.display = 'block';
        }
        return;
    }
    
    if (noResults) {
        noResults.style.display = 'none';
    }
    
    container.innerHTML = '';
    clubs.forEach(club => {
        container.appendChild(createClubCard(club));
    });
}

// Загрузка кружков для выпадающего списка
async function loadClubsForSelect() {
    const clubs = await loadClubsData();
    const select = document.getElementById('club-select');
    
    if (!select) return;
    
    // Очищаем, кроме первого варианта
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Добавляем кружки
    clubs.forEach(club => {
        const option = document.createElement('option');
        option.value = club.id;
        option.textContent = club.name;
        select.appendChild(option);
    });
}

// Получение кружка по ID
async function getClubById(id) {
    const clubs = await loadClubsData();
    return clubs.find(club => club.id == id);
}

// Сохранение заявки в LocalStorage
function saveApplication(application) {
    let applications = JSON.parse(localStorage.getItem('clubApplications')) || [];
    
    // Генерируем ID для заявки
    application.id = Date.now();
    application.date = new Date().toISOString();
    application.status = 'pending';
    
    applications.push(application);
    localStorage.setItem('clubApplications', JSON.stringify(applications));
    
    return application.id;
}

// Получение всех заявок
function getAllApplications() {
    return JSON.parse(localStorage.getItem('clubApplications')) || [];
}
