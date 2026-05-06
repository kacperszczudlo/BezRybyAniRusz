// cart.js
document.addEventListener('DOMContentLoaded', function () {
  const cartCountElement = document.getElementById('cart-count');
  const cartItemsElement = document.getElementById('cartItems');
  const cartSummaryContainer = document.querySelector('.cart-summary');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const cartModal = document.getElementById('cartModal');
  const closeBtn = cartModal?.querySelector('.close');
  const cartBtn = document.getElementById('cartBtn');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartSummary();
    updateCartButtons();
  }

  function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    if (cartCountElement) {
      cartCountElement.textContent = totalItems > 0 ? totalItems : '0';
    }
  }

  function updateCartSummary() {
    if (!cartSummaryContainer) return;

    const totalAmount = cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
    cartSummaryContainer.innerHTML = `
      <p>Łączna kwota do zapłaty:</p>
      <p class="total-amount">${totalAmount.toFixed(2)} PLN</p>
    `;
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
  }

  function renderCartItems() {
    if (!cartItemsElement) return;

    cartItemsElement.innerHTML = '';
    cart.forEach(item => {
      const li = document.createElement('li');
      li.classList.add('cart-item');
      li.innerHTML = `
        <span>${item.name}</span>
        <div class="cart-item-controls">
          <button class="decrease-btn" data-product-id="${item.id}">-</button>
          <span class="quantity">${item.quantity || 1}</span>
          <button class="increase-btn" data-product-id="${item.id}">+</button>
          <span class="price">${(item.price * (item.quantity || 1)).toFixed(2)} PLN</span>
          <button class="remove-item" data-product-id="${item.id}">
            <img src="../images/trash.png" alt="Usuń" class="trash-icon">
          </button>
        </div>
      `;
      cartItemsElement.appendChild(li);

      const removeButton = li.querySelector('.remove-item');
      removeButton.addEventListener('click', () => removeFromCart(item.id));

      const increaseButton = li.querySelector('.increase-btn');
      increaseButton.addEventListener('click', () => {
        item.quantity = (item.quantity || 1) + 1;
        saveCart();
        renderCartItems();
      });

      const decreaseButton = li.querySelector('.decrease-btn');
      decreaseButton.addEventListener('click', () => {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          removeFromCart(item.id);
          return;
        }
        saveCart();
        renderCartItems();
      });
    });

    if (cart.length === 0) {
      cartItemsElement.innerHTML = '<li>Twój koszyk jest pusty.</li>';
    }
  }

  function updateCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart-button');
    console.log('Updating buttons, cart:', cart);
    buttons.forEach(button => {
      const productId = button.getAttribute('data-product-id');
      const inCart = cart.some(item => String(item.id) === String(productId));
      console.log(`Button productId: ${productId}, inCart: ${inCart}`);
      button.textContent = inCart ? 'Usuń z koszyka' : 'Dodaj do koszyka';
      button.style.backgroundColor = inCart ? '#dc3545' : '#007BFF'; // Nowy odcień niebieskiego
      button.style.transition = 'background-color 0.3s';
      button.dataset.inCart = inCart;
    });
  }

  window.toggleCart = function (productId, productName, productPrice, button) {
    console.log('toggleCart called with:', { productId, productName, productPrice });
    const existingItemIndex = cart.findIndex(item => String(item.id) === String(productId));
    if (existingItemIndex === -1) {
      cart.push({ id: String(productId), name: productName, price: parseFloat(productPrice), quantity: 1 });
    } else {
      cart.splice(existingItemIndex, 1);
    }
    saveCart();
    updateCartButtons();
  };

  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      renderCartItems();
      cartModal.style.display = 'block';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      cartModal.style.display = 'none';
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Koszyk jest pusty!');
        return;
      }
      const checkoutModal = document.createElement('div');
      checkoutModal.className = 'modal';
      checkoutModal.id = 'checkoutModal';
      checkoutModal.innerHTML = `
        <div class="modal-content">
          <span class="close">×</span>
          <div class="modal-header">Potwierdzenie zamówienia</div>
          <div class="modal-body">
            <p>Dziękujemy za zakupy! Twoje zamówienie zostało przyjęte.</p>
            <p>Łączna kwota: ${cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0).toFixed(2)} PLN</p>
          </div>
          <div class="modal-footer">
            <button id="confirmCheckout">OK</button>
          </div>
        </div>
      `;
      document.body.appendChild(checkoutModal);
      checkoutModal.style.display = 'block';

      const closeCheckout = checkoutModal.querySelector('.close');
      const confirmCheckout = checkoutModal.querySelector('#confirmCheckout');

      closeCheckout.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
        document.body.removeChild(checkoutModal);
      });

      confirmCheckout.addEventListener('click', () => {
        cart = [];
        saveCart();
        renderCartItems();
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'none';
        document.body.removeChild(checkoutModal);
      });

      window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
          checkoutModal.style.display = 'none';
          document.body.removeChild(checkoutModal);
        }
      });
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      cartModal.style.display = 'none';
    }
  });

  updateCartCount();
  updateCartSummary();
  updateCartButtons();
});