// Инициализация фильтрации
document.addEventListener('DOMContentLoaded', function() {
    initFilters();
    initSearch();
    initSort();
    initResetButton();
});

// Инициализация фильтров по категориям
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Применяем фильтр
            applyFilters();
        });
    });
}

// Инициализация поиска
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput) {
        // Поиск при вводе
        searchInput.addEventListener('input', function() {
            applyFilters();
        });
        
        // Поиск по кнопке
        if (searchBtn) {
            searchBtn.addEventListener('click', applyFilters);
        }
    }
}

// Инициализация сортировки
function initSort() {
    const sortSelect = document.getElementById('sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
}

// Кнопка сброса фильтров
function initResetButton() {
    const resetBtn = document.getElementById('reset-filters');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Сбрасываем поиск
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.value = '';
            
            // Сбрасываем фильтры
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => {
                if (btn.dataset.filter === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Сбрасываем сортировку
            const sortSelect = document.getElementById('sort-select');
            if (sortSelect) sortSelect.value = 'name-asc';
            
            // Применяем сброс
            applyFilters();
        });
    }
}

// Применение всех фильтров
async function applyFilters() {
    const clubs = await loadClubsData();
    let filtered = [...clubs];
    
    // 1. Фильтрация по категории
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter && activeFilter.dataset.filter !== 'all') {
        filtered = filtered.filter(club => club.category === activeFilter.dataset.filter);
    }
    
    // 2. Поиск по названию
    const searchInput = document.getElementById('search-input');
    if (searchInput && searchInput.value.trim() !== '') {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filtered = filtered.filter(club => 
            club.name.toLowerCase().includes(searchTerm) ||
            club.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // 3. Сортировка
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        switch (sortSelect.value) {
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'popular':
                filtered.sort((a, b) => (b.members || 0) - (a.members || 0));
                break;
        }
    }
    
    // Сохраняем отфильтрованный список
    filteredClubs = filtered;
    
    // Отображаем результат
    displayClubs(filtered);
}

// Получение активного фильтра
function getActiveFilter() {
    const activeBtn = document.querySelector('.filter-btn.active');
    return activeBtn ? activeBtn.dataset.filter : 'all';
}
