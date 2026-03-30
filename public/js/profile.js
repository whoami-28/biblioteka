document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('curator_token');
    
    // Если нет токена, отправляем на страницу входа
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }

    try {
        const response = await fetch('/api/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            // Токен просрочен или неверный
            localStorage.removeItem('curator_token');
            window.location.href = 'auth.html';
            return;
        }

        const data = await response.json();
        const user = data.user;
        const orders = data.orders;

        // Заполняем данные пользователя
        const nameEl = document.getElementById('profile-name');
        const emailEl = document.getElementById('profile-email');
        if (nameEl) nameEl.innerText = user.first_name || 'Куратор';
        if (emailEl) emailEl.innerText = user.email;

        // Обновляем счетчик "В коллекции" (считаем количество заказов)
        const countEl = document.getElementById('collection-count');
        if (countEl) countEl.innerText = orders.length;

        // Отрисовываем заказы в таблице
        const ordersContainer = document.getElementById('orders-container');
        if (ordersContainer) {
            if (orders.length === 0) {
                ordersContainer.innerHTML = '<tr><td colspan="4" class="py-12 text-center text-gray-400 text-sm">Ваша коллекция пока пуста. <br> <a href="catalog.html" class="text-primary hover:underline mt-2 inline-block">Перейти в каталог</a></td></tr>';
            } else {
                ordersContainer.innerHTML = '';
                orders.forEach(order => {
                    const date = new Date(order.created_at).toLocaleDateString('ru-RU');
                    const statusMap = { 'pending': 'В обработке', 'completed': 'Доставлен' };
                    const statusStr = statusMap[order.status] || order.status;
                    
                    const tr = `
                        <tr class="group hover:bg-gray-50 transition-colors">
                            <td class="py-6 px-8 font-mono text-sm text-primary font-bold">#MC-${order.id}</td>
                            <td class="py-6 px-8 text-gray-500 text-sm">${date}</td>
                            <td class="py-6 px-8">
                                <span class="inline-flex items-center px-3 py-1 text-[10px] uppercase tracking-widest font-bold bg-gray-100 text-gray-600">
                                    ${statusStr}
                                </span>
                            </td>
                            <td class="py-6 px-8 text-right font-bold text-primary">$${order.total.toFixed(2)}</td>
                        </tr>
                    `;
                    ordersContainer.insertAdjacentHTML('beforeend', tr);
                });
            }
        }
    } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
    }

    // Логика кнопки "Выйти"
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('curator_token');
            window.location.href = 'auth.html';
        });
    }
});