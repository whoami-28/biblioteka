document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-items-container');
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    const actionBtn = document.getElementById('checkout-action-btn');
    
    let currentStep = 1;
    let orderTotal = 0;
    const shippingCost = 15.00;

    function renderCart() {
        if (!cartContainer) return;
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartContainer.innerHTML = '';
        let totalSum = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="text-gray-500 py-8">Ваша корзина пуста.</p>';
            subtotalElement.innerText = '$0.00';
            totalElement.innerText = '$0.00';
            if (actionBtn) actionBtn.disabled = true;
            return;
        }

        cart.forEach((item, index) => {
            totalSum += item.price * item.quantity;
            const imageUrl = item.image_url || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800';
            const itemHTML = `
                <div class="flex items-center justify-between border-b border-gray-200 py-6">
                    <div class="flex items-center space-x-6">
                        <div class="w-20 h-28 bg-gray-100 overflow-hidden">
                            <img src="${imageUrl}" alt="${item.title}" class="w-full h-full object-cover grayscale">
                        </div>
                        <div>
                            <h3 class="font-serif font-bold text-lg text-primary">${item.title}</h3>
                            <p class="text-sm text-gray-500 mb-2">${item.author}</p>
                            <button data-index="${index}" class="remove-btn text-xs text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">Удалить</button>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-lg font-bold text-primary mb-2">$${(item.price * item.quantity).toFixed(2)}</div>
                        <div class="text-sm text-gray-500">Кол-во: ${item.quantity}</div>
                    </div>
                </div>
            `;
            cartContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        orderTotal = totalSum + shippingCost;
        subtotalElement.innerText = `$${totalSum.toFixed(2)}`;
        totalElement.innerText = `$${orderTotal.toFixed(2)}`;

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemIndex = e.target.getAttribute('data-index');
                let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
                currentCart.splice(itemIndex, 1);
                localStorage.setItem('cart', JSON.stringify(currentCart));
                renderCart();
            });
        });
    }

    renderCart();

    if (actionBtn) {
        actionBtn.addEventListener('click', async () => {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (currentStep === 1) {
                if (cart.length === 0) return alert('Корзина пуста!');
                document.getElementById('step-1-content').classList.add('hidden');
                document.getElementById('step-2-content').classList.remove('hidden');
                actionBtn.innerText = 'Перейти к оплате';
                currentStep = 2;
            } else if (currentStep === 2) {
                document.getElementById('step-2-content').classList.add('hidden');
                document.getElementById('step-3-content').classList.remove('hidden');
                actionBtn.innerText = 'Оплатить заказ';
                currentStep = 3;
            } else if (currentStep === 3) {
                
                // Проверяем, авторизован ли пользователь перед оплатой
                const token = localStorage.getItem('curator_token');
                if (!token) {
                    alert('Для оформления заказа необходимо войти в аккаунт.');
                    window.location.href = 'auth.html';
                    return;
                }

                actionBtn.innerText = 'Обработка...';
                actionBtn.disabled = true;

                const addressData = {
                    fullName: document.querySelector('#step-2-content input[type="text"]').value || 'Не указано',
                    email: document.querySelector('#step-2-content input[type="email"]').value || 'Не указано'
                };

                try {
                    const response = await fetch('/api/orders', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` // <--- Передаем токен!
                        },
                        body: JSON.stringify({ items: cart, total: orderTotal, address: addressData })
                    });

                    const result = await response.json();

                    if (result.success) {
                        document.getElementById('step-3-content').classList.add('hidden');
                        document.getElementById('step-4-content').classList.remove('hidden');
                        document.getElementById('checkout-sidebar').classList.add('hidden');
                        localStorage.removeItem('cart');
                        
                        const successText = document.querySelector('#step-4-content p');
                        if(successText) successText.innerHTML = `Благодарим за заказ. Номер вашей квитанции <strong class="text-primary font-bold">#MC-${result.orderId}</strong>.`;
                    } else {
                        throw new Error(result.error);
                    }
                } catch (error) {
                    alert('Ошибка при оформлении: Вы не авторизованы или сессия истекла.');
                    window.location.href = 'auth.html';
                }
            }
        });
    }
});