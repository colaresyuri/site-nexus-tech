// Funcionalidade do carrinho de compras
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartModal = document.getElementById('cart-modal');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    let cart = [];
    
    // Carrega o carrinho do localStorage, se existir
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCartUI();
    }
    
    // Abre o modal do carrinho
    cartBtn.addEventListener('click', () => {
        cartModal.classList.remove('hidden');
    });
    
    // Fecha o modal do carrinho
    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.add('hidden');
    });
    
    // Fecha o modal ao clicar fora dele
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.add('hidden');
        }
    });
    
    // Adiciona produto ao carrinho
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Pega os dados do produto do botão
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const image = btn.getAttribute('data-image'); // Certifique-se que está igual ao src da imagem
            
            // Verifica se o item já está no carrinho
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }
            
            // Salva no localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Atualiza a UI do carrinho
            updateCartUI();
            
            // Mostra notificação
            showToast(`${name} adicionado ao carrinho!`);
        });
    });
    
    // Atualiza a interface do carrinho
    function updateCartUI() {
        // Atualiza o contador de itens
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }
        
        // Atualiza os itens do carrinho
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            checkoutBtn.disabled = true;
        } else {
            emptyCartMessage.classList.add('hidden');
            checkoutBtn.disabled = false;
            
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item-enter glass-card p-3 rounded-lg flex items-center space-x-4';
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                    <div class="flex-grow">
                        <h4 class="font-medium">${item.name}</h4>
                        <div class="flex justify-between items-center mt-1">
                            <span class="text-orange-400 font-bold">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                            <div class="flex items-center space-x-2">
                                <button class="decrease-quantity text-gray-400 hover:text-orange-400" data-id="${item.id}">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity w-6 text-center">${item.quantity}</span>
                                <button class="increase-quantity text-gray-400 hover:text-orange-400" data-id="${item.id}">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button class="remove-item text-gray-400 hover:text-red-400" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }
        
        // Atualiza os totais
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        cartTotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    }
    
    // Handle quantity changes and item removal
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('increase-quantity') || e.target.parentElement.classList.contains('increase-quantity')) {
            const btn = e.target.classList.contains('increase-quantity') ? e.target : e.target.parentElement;
            const id = btn.getAttribute('data-id');
            const item = cart.find(item => item.id === id);
            if (item) {
                item.quantity += 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartUI();
            }
        }
        
        if (e.target.classList.contains('decrease-quantity') || e.target.parentElement.classList.contains('decrease-quantity')) {
            const btn = e.target.classList.contains('decrease-quantity') ? e.target : e.target.parentElement;
            const id = btn.getAttribute('data-id');
            const item = cart.find(item => item.id === id);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartUI();
            }
        }
        
        if (e.target.classList.contains('remove-item') || e.target.parentElement.classList.contains('remove-item')) {
            const btn = e.target.classList.contains('remove-item') ? e.target : e.target.parentElement;
            const id = btn.getAttribute('data-id');
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
            showToast('Item removido do carrinho');
        }
    });
    
    // Botão de checkout
    checkoutBtn.addEventListener('click', () => {
        alert('Compra finalizada com sucesso! Obrigado por comprar na NexusTech.');
        cart = [];
        localStorage.removeItem('cart');
        updateCartUI();
        cartModal.classList.add('hidden');
        showToast('Compra finalizada com sucesso!');
    });
    
    // Mostra notificação
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.remove('translate-y-10', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
        
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-10', 'opacity-0');
        }, 3000);
    }
    
    // Scroll suave para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});