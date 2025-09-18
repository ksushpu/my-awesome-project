const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null;
openBtn.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal();                               // модальный режим + 
    затемнение
    dlg.querySelector('input,select,textarea,button')?.focus();
});
closeBtn.addEventListener('click', () => dlg.close('cancel'));
form?.addEventListener('submit', (e) => {
    // 1) Сброс кастомных сообщений 
    [...form.elements].forEach(el => el.setCustomValidity?.(''));

    // 2) Проверка встроенных ограничений 
    if (!form.checkValidity()) {
        e.preventDefault();
        // Пример: таргетированное сообщение 
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }
        const date = form.elements.date;
        if (date?.validity.typeMismatch) {
            date.setCustomValidity('Введите корректную дату, например 01.01.2001');
        }
        form.reportValidity(); // показать браузерные подсказки 
        // A11y: подсветка проблемных полей 
        [...form.elements].forEach(el => {
            if (el.willValidate) el.toggleAttribute('aria-invalid',
                !el.checkValidity());
        });
        return;
    }

    // 3) Успешная «отправка» (без сервера) 
    e.preventDefault();

    // Показываем сообщение об успехе
    showSuccessMessage();

    // Закрываем модальное окно через короткую задержку
    setTimeout(() => {
        document.getElementById('contactDialog')?.close('success');
        form.reset();
    }, 2000); // 2 секунды задержки перед закрытием
});

// Функция для показа сообщения об успехе
function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.id = 'successMessage';
    successMessage.textContent = 'Сообщение успешно отправлено!';
    successMessage.setAttribute('role', 'alert');
    successMessage.setAttribute('aria-live', 'assertive');

    // Добавляем сообщение в форму
    const formActions = form.querySelector('.form-actions');
    form.insertBefore(successMessage, formActions);

    // Скрываем кнопки отправки
    formActions.style.display = 'none';
}

// Обработчик закрытия модалки для сброса формы
dlg.addEventListener('close', (e) => {
    // Сбрасываем форму при закрытии
    form.reset();

    // Убираем сообщение об успехе, если оно есть
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.remove();
    }

    // Показываем кнопки отправки снова
    const formActions = form.querySelector('.form-actions');
    formActions.style.display = 'flex';

    lastActive?.focus();
});
const phone = document.getElementById('phone');
phone?.addEventListener('input', () => {
    const digits = phone.value.replace(/\D/g, '').slice(0, 11); // до 11 цифр 
    const d = digits.replace(/^8/, '7');                       // нормализуем 8 → 7
    const parts = [];
    if (d.length > 0) parts.push('+7');
    if (d.length > 1) parts.push(' (' + d.slice(1, 4));
    if (d.length >= 4) parts[parts.length - 1] += ')';
    if (d.length >= 5) parts.push(' ' + d.slice(4, 7));
    if (d.length >= 8) parts.push('-' + d.slice(7, 9));
    if (d.length >= 10) parts.push('-' + d.slice(9, 11));
    phone.value = parts.join('');
});
// Строгая проверка (если задаёте pattern из JS): 
phone?.setAttribute('pattern', '^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$');

dlg.addEventListener('close', () => { lastActive?.focus(); });
// Esc по умолчанию вызывает событие 'cancel' и закрывает <dialog> 