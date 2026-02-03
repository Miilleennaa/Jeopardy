document.addEventListener('DOMContentLoaded', function() {
    // Инициализация состояния кнопок
    initializeGame();
    
    // Обработчики для кнопок вопросов
    document.querySelectorAll('.nav-link.question-btn').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const questionId = this.getAttribute('data-id');
            const href = this.getAttribute('href');
            
            if (!this.classList.contains('answered')) {
                // Сохраняем ID текущего вопроса для передачи на страницу вопроса
                sessionStorage.setItem('currentQuestion', questionId);
                
                // Перенаправляем на страницу вопроса
                window.location.href = href;
            }
        });
    });
    
    // Обработчик для кнопки сброса
    document.getElementById('resetButton').addEventListener('click', resetGame);
    
    // Инициализация игры
    function initializeGame() {
        // Восстанавливаем состояние кнопок из localStorage
        document.querySelectorAll('.nav-link.question-btn').forEach(link => {
            const questionId = link.getAttribute('data-id');
            if (localStorage.getItem(questionId) === 'answered') {
                link.classList.add('answered');
            }
        });
        
        // Добавляем градиенты к кнопкам в зависимости от баллов
        addButtonGradients();
        
        // Проверяем, нужно ли отметить вопрос как отвеченный после возврата
        checkPendingQuestion();
    }
    
    // Проверка ожидающего вопроса
    function checkPendingQuestion() {
        const pendingQuestion = sessionStorage.getItem('pendingQuestion');
        
        if (pendingQuestion) {
            // Отмечаем вопрос как отвеченный
            const link = document.querySelector(`.nav-link.question-btn[data-id="${pendingQuestion}"]`);
            if (link && !link.classList.contains('answered')) {
                link.classList.add('answered');
                localStorage.setItem(pendingQuestion, 'answered');
                
                // Показываем уведомление
                showNotification('Вопрос отмечен как отвеченный!', 'success');
            }
            
            // Очищаем временное хранилище
            sessionStorage.removeItem('pendingQuestion');
        }
    }
    
    // Сброс игры
    function resetGame() {
        // Эффект анимации сброса
        document.body.style.opacity = '0.7';
        
        setTimeout(() => {
            // Очищаем localStorage
            localStorage.clear();
            
            // Очищаем sessionStorage
            sessionStorage.clear();
            
            // Активируем все кнопки
            document.querySelectorAll('.nav-link.question-btn').forEach(link => {
                link.classList.remove('answered');
            });
            
            // Анимация сброса
            document.getElementById('resetButton').style.transform = 'rotate(360deg) scale(1.1)';
            setTimeout(() => {
                document.getElementById('resetButton').style.transform = 'rotate(0deg) scale(1)';
            }, 500);
            
            // Восстанавливаем прозрачность
            document.body.style.opacity = '1';
            
            // Уведомление
            showNotification('Игра сброшена! Все вопросы доступны.', 'success');
        }, 300);
    }
    
    // Добавление градиентов к кнопкам в зависимости от баллов
    function addButtonGradients() {
        document.querySelectorAll('.nav-link.question-btn').forEach(link => {
            const points = parseInt(link.getAttribute('data-points'));
            let gradient;
            
            switch(points) {
                case 10:
                    gradient = 'linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)';
                    break;
                case 15:
                    gradient = 'linear-gradient(135deg, #7209b7 0%, #b5179e 100%)';
                    break;
                case 20:
                    gradient = 'linear-gradient(135deg, #f72585 0%, #ff4d6d 100%)';
                    break;
                case 25:
                    gradient = 'linear-gradient(135deg, #ff9e00 0%, #ffd166 100%)';
                    break;
                default:
                    gradient = 'linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)';
            }
            
            // Добавляем градиент к тексту
            const pointsSpan = link.querySelector('.points');
            if (pointsSpan) {
                pointsSpan.style.background = gradient;
                pointsSpan.style.webkitBackgroundClip = 'text';
                pointsSpan.style.backgroundClip = 'text';
                pointsSpan.style.color = 'transparent';
                pointsSpan.style.textShadow = '0 2px 8px rgba(0,0,0,0.3)';
            }
        });
    }
    
    // Показать уведомление
    function showNotification(message, type) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon, bgColor;
        switch(type) {
            case 'success':
                icon = 'check-circle';
                bgColor = 'linear-gradient(135deg, #38b000 0%, #06d6a0 100%)';
                break;
            case 'info':
                icon = 'info-circle';
                bgColor = 'linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)';
                break;
            case 'warning':
                icon = 'exclamation-triangle';
                bgColor = 'linear-gradient(135deg, #ff9e00 0%, #ffd166 100%)';
                break;
            default:
                icon = 'info-circle';
                bgColor = 'linear-gradient(135deg, #7209b7 0%, #b5179e 100%)';
        }
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        // Добавляем стили
        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: ${bgColor};
            color: white;
            padding: 18px 28px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10000;
            box-shadow: 0 15px 35px rgba(0,0,0,0.4);
            transform: translateX(150%);
            transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            font-weight: 500;
            font-size: 1.1rem;
            max-width: 400px;
        `;
        
        // Добавляем на страницу
        document.body.appendChild(notification);
        
        // Показываем с анимацией
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Удаляем через 4 секунды
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 600);
        }, 4000);
    }
    
    // Добавляем стили для ссылок с ответами
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.question-btn.answered {
            position: relative;
            pointer-events: none;
            opacity: 0.4;
            transform: scale(0.95);
            filter: grayscale(0.8);
        }
        
        .nav-link.question-btn.answered::after {
            content: '✓';
            position: absolute;
            top: 8px;
            right: 8px;
            background: linear-gradient(135deg, #38b000 0%, #06d6a0 100%);
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(6, 214, 160, 0.4);
            z-index: 3;
        }
        
        .nav-link.question-btn.answered .points {
            opacity: 0.5;
        }
        
        .nav-link.question-btn.answered:hover {
            transform: scale(0.95) !important;
            cursor: not-allowed;
        }
        
        /* Анимация пульсации для новых кнопок */
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .nav-link.question-btn:not(.answered) {
            animation: pulse 3s infinite ease-in-out;
        }
        
        /* Задержки для анимации */
        .nav-item:nth-child(1) .nav-link.question-btn { animation-delay: 0s; }
        .nav-item:nth-child(2) .nav-link.question-btn { animation-delay: 0.2s; }
        .nav-item:nth-child(3) .nav-link.question-btn { animation-delay: 0.4s; }
        .nav-item:nth-child(4) .nav-link.question-btn { animation-delay: 0.6s; }
    `;
    document.head.appendChild(style);
});