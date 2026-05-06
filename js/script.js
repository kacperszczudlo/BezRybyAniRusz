// script.js
const originalAlert = window.alert;
window.alert = function(message) { return null; };

let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCountElement = document.getElementById('cart-count');

window.saveCart = function() {
  localStorage.setItem('cart', JSON.stringify(cart));
  window.updateCartCount();
  if (typeof window.updateCartModal === 'function') {
    window.updateCartModal();
  }
};

window.updateCartCount = function() {
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
  if (cartCountElement) {
    cartCountElement.textContent = totalItems >= 0 ? totalItems : '0';
  }
};

window.updateCartCount();

window.toggleCart = function(productId, productName, productPrice, button) {
  const productIndex = cart.findIndex(item => item.id === productId);

  if (productIndex === -1) {
    // Dodaj produkt do koszyka
    cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
    button.textContent = 'Usuń z koszyka';
    button.style.backgroundColor = '#dc3545'; // Czerwony kolor
  } else {
    // Usuń produkt z koszyka
    cart.splice(productIndex, 1);
    button.textContent = 'Dodaj do koszyka';
    button.style.backgroundColor = '#007BFF'; // Niebieski kolor
  }

  window.saveCart();
  window.updateCartButtons(); // Synchronizuj przyciski
};

window.updateCartButtons = function() {
  const buttons = document.querySelectorAll('.add-to-cart-button');
  buttons.forEach(button => {
    const productId = button.getAttribute('data-product-id');
    const isInCart = cart.some(item => item.id === productId);

    if (isInCart) {
      button.textContent = 'Usuń z koszyka';
      button.style.backgroundColor = '#dc3545'; // Czerwony kolor
    } else {
      button.textContent = 'Dodaj do koszyka';
      button.style.backgroundColor = '#007BFF'; // Niebieski kolor
    }
  });
};

window.updateCartModal = function() {
  const cartItemsContainer = document.getElementById('cartItems');
  const totalAmountElement = document.querySelector('.total-amount');

  if (!cartItemsContainer || !totalAmountElement) return;

  cartItemsContainer.innerHTML = '';
  let totalAmount = 0;

  cart.forEach(item => {
    const listItem = document.createElement('li');
    listItem.classList.add('cart-item');
    listItem.innerHTML = `
      <span>${item.name}</span>
      <div class="cart-item-controls">
        <button class="decrease-btn" data-product-id="${item.id}">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="increase-btn" data-product-id="${item.id}">+</button>
        <span class="price">${(item.price * item.quantity).toFixed(2)} PLN</span>
      </div>
    `;
    cartItemsContainer.appendChild(listItem);

    totalAmount += item.price * item.quantity;
  });

  totalAmountElement.textContent = `${totalAmount.toFixed(2)} PLN`;

  // Obsługa przycisków "+" i "-"
  document.querySelectorAll('.increase-btn').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-product-id');
      const product = cart.find(item => item.id === productId);
      if (product) {
        product.quantity++;
        window.saveCart();
        window.updateCartModal();
      }
    });
  });

  document.querySelectorAll('.decrease-btn').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-product-id');
      const product = cart.find(item => item.id === productId);
      if (product) {
        product.quantity--;
        if (product.quantity <= 0) {
          cart = cart.filter(item => item.id !== productId);
        }
        window.saveCart();
        window.updateCartModal();
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const staticReviews = [
    { name: "Jan Kowalski", body: "Świetna wędka, bardzo dobrze leży w ręce i jest wytrzymała. Polecam każdemu wędkarzowi!", avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}` },
    { name: "Anna Nowak", body: "Przynęta działa rewelacyjnie, ryby biorą jak szalone. Na pewno kupię więcej!", avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}` },
    { name: "Piotr Wiśniewski", body: "Produkt godny polecenia, jakość wykonania na wysokim poziomie. Idealny na długie wyprawy.", avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}` },
    { name: "Katarzyna Zielińska", body: "Trochę droga, ale warta swojej ceny. Sprawdza się na każdym łowisku!", avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}` },
    { name: "Marek Dudek", body: "Super sprzęt, łatwy w obsłudze i skuteczny. Ryby same się proszą o złapanie!", avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}` },
    { name: "Ewa Malinowska", body: "Bardzo szybka dostawa, a produkt dokładnie taki, jak w opisie. Jestem zadowolona.", avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}` },
    { name: "Tomasz Lewandowski", body: "Solidna konstrukcja, nic się nie psuje nawet po wielu użyciach. Polecam!", avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}` },
    { name: "Magdalena Kwiatkowska", body: "Najlepsza przynęta, jaką miałam. Efekty widoczne od razu po zarzuceniu!", avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}` },
  ];

  function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('reviews-container');
    if (reviewsContainer) {
      reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review';
        reviewElement.innerHTML = `
          <img src="${review.avatar}" alt="${review.name}">
          <p><strong>${review.name}:</strong> ${review.body}</p>
        `;
        reviewsContainer.appendChild(reviewElement);
      });
    }
  }

  displayReviews(staticReviews);

  const scrollTrack = document.getElementById('scroll-track');
  const scrollLeftBtn = document.getElementById('scroll-left');
  const scrollRightBtn = document.getElementById('scroll-right');

  if (scrollTrack && scrollLeftBtn && scrollRightBtn) {
    const itemWidth = 320;
    let currentPosition = 0;
    const maxPosition = (scrollTrack.children.length - 3) * itemWidth;

    function updateButtons() {
      scrollLeftBtn.classList.toggle('hidden', currentPosition <= 0);
      scrollRightBtn.classList.toggle('hidden', currentPosition >= maxPosition);
    }

    scrollLeftBtn.addEventListener('click', () => {
      currentPosition = Math.max(currentPosition - itemWidth, 0);
      scrollTrack.style.transform = `translateX(-${currentPosition}px)`;
      updateButtons();
    });

    scrollRightBtn.addEventListener('click', () => {
      currentPosition = Math.min(currentPosition + itemWidth, maxPosition);
      scrollTrack.style.transform = `translateX(-${currentPosition}px)`;
      updateButtons();
    });

    updateButtons();
  }

  const fish = document.getElementById('fish');
  const navbar = document.querySelector('.navbar');
  if (fish && navbar) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let fishX = mouseX;
    let fishY = mouseY;
    let isFlipped = false;

    fish.style.transformOrigin = 'center center';
    fish.style.position = 'absolute';

    document.addEventListener('mousemove', (e) => {
      mouseX = e.pageX;
      mouseY = e.pageY;
    });

    function animateFish() {
      const fishWidth = fish.offsetWidth || 50;
      const fishHeight = fish.offsetHeight || 30;
      const navbarHeight = navbar.offsetHeight || 0;
      const footer = document.querySelector('.footer');
      const footerHeight = footer ? footer.offsetHeight : 0;
      const footerTop = footer ? footer.offsetTop : window.innerHeight;

      fishX += (mouseX - fishX) * 0.1;
      fishY += (mouseY - fishY) * 0.1;

      fishX = Math.max(0, Math.min(fishX, window.innerWidth - fishWidth));
      fishY = Math.max(navbarHeight + 20, Math.min(fishY, footerTop - fishHeight));

      const deltaX = mouseX - fishX;
      const threshold = 5;
      if (deltaX > threshold) {
        isFlipped = true;
      } else if (deltaX < -threshold) {
        isFlipped = false;
      }

      fish.style.left = `${fishX}px`;
      fish.style.top = `${fishY}px`;
      fish.style.transform = `scaleX(${isFlipped ? -1 : 1})`;

      requestAnimationFrame(animateFish);
    }

    fish.style.left = `${window.innerWidth / 2}px`;
    fish.style.top = `${window.innerHeight / 2}px`;
    animateFish();
  }

  const loginIcon = document.getElementById('loginIcon');
  const loginModal = document.getElementById('loginModal');
  const closeLoginModal = document.querySelector('#loginModal .close');
  const logoutModal = document.createElement('div');
  logoutModal.id = 'logoutModal';
  logoutModal.className = 'modal';
  logoutModal.innerHTML = `
    <div class="modal-content">
      <span class="close">×</span>
      <div class="modal-header">Wylogowanie</div>
      <div class="modal-body">
        <p>Czy na pewno chcesz się wylogować?</p>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" id="logout-cancel">Anuluj</button>
        <button class="logout-btn" onclick="logout()">Wyloguj</button>
      </div>
    </div>
  `;
  document.body.appendChild(logoutModal);

  const loginError = document.createElement('p');
  loginError.style.color = 'red';
  loginError.style.textAlign = 'center';
  loginError.id = 'login-error';

  if (loginIcon && loginModal && closeLoginModal) {
    loginModal.querySelector('.modal-body').appendChild(loginError);

    const openLoginModal = () => {
      loginModal.style.display = 'block';
      loginError.textContent = '';
    };

    const openLogoutModal = () => {
      logoutModal.style.display = 'block';
    };

    loginIcon.addEventListener('click', () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        openLogoutModal();
      } else {
        openLoginModal();
      }
    });

    closeLoginModal.addEventListener('click', () => {
      loginModal.style.display = 'none';
      loginError.textContent = '';
    });

    logoutModal.querySelector('.close').addEventListener('click', () => {
      logoutModal.style.display = 'none';
    });

    logoutModal.querySelector('#logout-cancel').addEventListener('click', () => {
      logoutModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
      if (event.target === loginModal) {
        loginModal.style.display = 'none';
        loginError.textContent = '';
      }
      if (event.target === logoutModal) {
        logoutModal.style.display = 'none';
      }
    });

    window.signIn = function() {
      const usernameInput = document.querySelector('#loginModal .modal-body input[type="text"]');
      const passwordInput = document.querySelector('#loginModal .modal-body input[type="password"]');
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (!username || !password) {
        loginError.textContent = 'Proszę wypełnić wszystkie pola.';
        return;
      }

      const storedUsername = localStorage.getItem('username');
      const storedPassword = localStorage.getItem('password');

      if (storedUsername && storedPassword) {
        if (storedUsername === username && storedPassword === password) {
          localStorage.setItem('isLoggedIn', 'true');
          loginModal.style.display = 'none';
          loginError.textContent = '';
          updateUserInterface();
        } else {
          loginError.textContent = 'Nieprawidłowa nazwa użytkownika lub hasło.';
        }
      } else {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        localStorage.setItem('isLoggedIn', 'true');
        loginModal.style.display = 'none';
        loginError.textContent = '';
        updateUserInterface();
      }
    };

    function updateUserInterface() {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        loginIcon.src = '../images/user-logged-in.png';
        loginIcon.alt = 'Wyloguj';
      } else {
        loginIcon.src = '../images/user.png';
        loginIcon.alt = 'Login';
      }
    }

    window.logout = function() {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      logoutModal.style.display = 'none';
      updateUserInterface();
    };

    updateUserInterface();
  }

  const registerBtn = document.querySelector('#loginModal .register-btn');
  const registerModal = document.getElementById('registerModal');
  const closeRegisterModal = document.querySelector('#registerModal .close');
  const registerError = document.createElement('p');
  registerError.style.color = 'red';
  registerError.style.textAlign = 'center';
  registerError.id = 'register-error';

  if (registerBtn && registerModal && closeRegisterModal) {
    registerModal.querySelector('.modal-body').appendChild(registerError);

    let repeatPasswordInput = registerModal.querySelector('input[placeholder="Powtórz hasło"]');
    if (!repeatPasswordInput) {
      repeatPasswordInput = document.createElement('input');
      repeatPasswordInput.type = 'password';
      repeatPasswordInput.placeholder = 'Powtórz hasło';
      repeatPasswordInput.required = true;
      registerModal.querySelector('.modal-body').insertBefore(repeatPasswordInput, registerModal.querySelector('.modal-footer'));
    }

    registerBtn.addEventListener('click', () => {
      loginModal.style.display = 'none';
      registerModal.style.display = 'block';
      registerError.textContent = '';
    });

    closeRegisterModal.addEventListener('click', () => {
      registerModal.style.display = 'none';
      registerError.textContent = '';
    });

    const cancelRegisterBtn = registerModal.querySelector('.cancel-btn');
    if (cancelRegisterBtn) {
      cancelRegisterBtn.addEventListener('click', () => {
        registerModal.style.display = 'none';
        registerError.textContent = '';
      });
    }

    window.addEventListener('click', (event) => {
      if (event.target === registerModal) {
        registerModal.style.display = 'none';
        registerError.textContent = '';
      }
    });

    window.register = function() {
      const usernameInput = document.querySelector('#registerModal .modal-body input[type="text"]');
      const emailInput = document.querySelector('#registerModal .modal-body input[type="email"]');
      const passwordInput = document.querySelector('#registerModal .modal-body input[type="password"]');
      const repeatPasswordInput = document.querySelector('#registerModal .modal-body input[placeholder="Powtórz hasło"]');
      const username = usernameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      const repeatPassword = repeatPasswordInput.value.trim();

      if (!username || !email || !password || !repeatPassword) {
        registerError.textContent = 'Proszę wypełnić wszystkie pola.';
        return;
      }

      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      localStorage.setItem('isLoggedIn', 'true');
      registerModal.style.display = 'none';
      registerError.textContent = '';
      updateUserInterface();
    };
  }

  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }
});