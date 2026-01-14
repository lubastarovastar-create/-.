// Инициализация формы
document.addEventListener('DOMContentLoaded', function() {
    initForm();
});

function initForm() {
    const form = document.getElementById('join-form');
    if (!form) return;
    
    // Валидация в реальном времени
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });
    
    // Обработка отправки формы
    form.addEventListener('submit', handleSubmit);
    
    // Кнопка "Подать ещё одну заявку"
    const newAppBtn = document.getElementById('new-application');
    if (newAppBtn) {
        newAppBtn.addEventListener('click', showForm);
    }
}

// Валидация поля
function validateField(e) {
    const field = e.target;
    const fieldId = field.id;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch(fieldId) {
        case 'full-name':
            if (value.length < 2) {
                errorMessage = 'Введите имя';
                isValid = false;
            } else if (!value.includes(' ')) {
                errorMessage = 'Введите фамилию и имя';
                isValid = false;
            }
            break;
            
        case 'group':
            if (value.length < 3) {
                errorMessage = 'Введите номер группы';
                isValid = false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Введите корректный email';
                isValid = false;
            }
            break;
            
        case 'club-select':
            if (!value) {
                errorMessage = 'Выберите кружок';
                isValid = false;
            }
            break;
            
        case 'motivation':
            if (value.length < 20) {
                errorMessage = 'Расскажите подробнее о своих мотивах (минимум 20 символов)';
                isValid = false;
            }
            break;
            
        case 'agreement':
            if (!field.checked) {
                errorMessage = 'Необходимо согласие';
                isValid = false;
            }
            break;
    }
    
    showError(fieldId, errorMessage);
    return isValid;
}

// Очистка ошибки
function clearError(e) {
    const fieldId = e.target.id;
    showError(fieldId, '');
}

// Показать ошибку
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Валидация всей формы
function validateForm() {
    let isValid = true;
    
    // Проверяем все обязательные поля
    const requiredFields = ['full-name', 'group', 'email', 'club-select', 'motivation', 'agreement'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // Имитируем событие blur для валидации
            const event = new Event('blur');
            field.dispatchEvent(event);
            
            // Проверяем, есть ли ошибка
            const errorElement = document.getElementById(`${fieldId}-error`);
            if (errorElement && errorElement.textContent) {
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Обработка отправки формы
async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        alert('Пожалуйста, исправьте ошибки в форме');
        return;
    }
    
    // Собираем данные формы
    const application = {
        fullName: document.getElementById('full-name').value.trim(),
        group: document.getElementById('group').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        clubId: parseInt(document.getElementById('club-select').value),
        experience: document.getElementById('experience').value.trim(),
        motivation: document.getElementById('motivation').value.trim()
    };
    
    // Получаем название кружка
    const clubs = await loadClubsData();
    const selectedClub = clubs.find(c => c.id == application.clubId);
    application.clubName = selectedClub ? selectedClub.name : '';
    
    // Сохраняем заявку
    const applicationId = saveApplication(application);
    
    // Показываем сообщение об успехе
    showSuccessMessage(applicationId);
    
    // Сбрасываем форму
    e.target.reset();
}

// Показать сообщение об успехе
function showSuccessMessage(applicationId) {
    const form = document.getElementById('join-form');
    const successMessage = document.getElementById('success-message');
    const applicationIdElement = document.getElementById('application-id');
    
    if (form && successMessage && applicationIdElement) {
        form.style.display = 'none';
        successMessage.style.display = 'block';
        applicationIdElement.textContent = `#${applicationId}`;
    }
}

// Показать форму снова
function showForm() {
    const form = document.getElementById('join-form');
    const successMessage = document.getElementById('success-message');
    
    if (form && successMessage) {
        form.style.display = 'block';
        successMessage.style.display = 'none';
    }
}
