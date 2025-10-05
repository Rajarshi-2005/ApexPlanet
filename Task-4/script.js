document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Modern Dark UI...");

    // --- SCROLL-TRIGGERED ANIMATION LOGIC ---
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    sections.forEach(section => observer.observe(section));

    // --- VIEW SWITCHING LOGIC ---
    const allViews = document.querySelectorAll('.view');
    const viewButtons = document.querySelectorAll('.view-project-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    const navLinks = document.querySelectorAll('.nav-links a');

    const switchView = (targetId) => {
        allViews.forEach(view => view.classList.remove('active'));
        const targetView = document.getElementById(targetId);
        if (targetView) {
            targetView.classList.add('active');
            window.scrollTo(0, 0);
        }
    };

    viewButtons.forEach(button => button.addEventListener('click', () => switchView(button.getAttribute('data-target'))));
    backButtons.forEach(button => button.addEventListener('click', () => switchView(button.getAttribute('data-target'))));
    
    // --- SMOOTH SCROLL & NAV LOGIC ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    if (document.getElementById('portfolio-view').classList.contains('active')) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        switchView('portfolio-view');
                        setTimeout(() => targetElement.scrollIntoView({ behavior: 'smooth' }), 300);
                    }
                }
                const nav = document.querySelector('.nav-links');
                const burger = document.querySelector('.burger');
                if (nav && nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                }
            }
        });
    });

    // --- BURGER MENU LOGIC ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
    }

    // --- DYNAMIC TEXT LOGIC ---
    const roleTextElement = document.getElementById('role-text');
    if (roleTextElement) {
        const roles = ["Elegant Web Experiences.", "Intuitive User Interfaces.", "Efficient Backend Solutions."];
        let roleIndex = 0; let charIndex = 0;
        const type = () => {
            if (charIndex < roles[roleIndex].length) {
                roleTextElement.textContent += roles[roleIndex].charAt(charIndex++);
                setTimeout(type, 80);
            } else { setTimeout(erase, 2000); }
        };
        const erase = () => {
            if (charIndex > 0) {
                roleTextElement.textContent = roles[roleIndex].substring(0, --charIndex);
                setTimeout(erase, 40);
            } else { roleIndex = (roleIndex + 1) % roles.length; type(); }
        };
        setTimeout(type, 500);
    }

    // --- TO-DO LIST APP LOGIC ---
    const todoForm = document.getElementById('todo-form');
    if (todoForm) {
        const todoInput = document.getElementById('todo-input');
        const taskList = document.getElementById('task-list');
        const saveTasks = () => {
            const tasks = Array.from(taskList.querySelectorAll('li span')).map(span => span.textContent);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        };
        const addTaskToDOM = (taskText) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${taskText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete'; deleteBtn.className = 'delete';
            deleteBtn.onclick = () => { li.remove(); saveTasks(); };
            li.appendChild(deleteBtn); taskList.appendChild(li);
        };
        const loadTasks = () => {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            taskList.innerHTML = ''; tasks.forEach(addTaskToDOM);
        };
        todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (todoInput.value.trim() !== '') {
                addTaskToDOM(todoInput.value.trim()); saveTasks(); todoInput.value = '';
            }
        });
        loadTasks();
    }

    // --- PRODUCT LISTING PAGE LOGIC ---
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        // --- CORRECTED PRODUCT DATA WITH ALL NEW, WORKING IMAGE URLs ---
        const products = [
            { id: 1, name: "Laptop", category: "electronics", price: 1200, imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600" },
            { id: 2, name: "Smartphone", category: "electronics", price: 800, imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=600" },
            { id: 3, name: "JS Book", category: "books", price: 35, imageUrl: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600" },
            { id: 4, name: "T-Shirt", category: "clothing", price: 25, imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600" },
            { id: 5, name: "Headphones", category: "electronics", price: 150, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600" },
            { id: 6, name: "History Book", category: "books", price: 45, imageUrl: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=600" },
            { id: 7, name: "Jeans", category: "clothing", price: 60, imageUrl: "https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=600" },
        ];
        
        const categoryFilter = document.getElementById('category-filter');
        const sortBy = document.getElementById('sort-by');
        
        const renderProducts = (productsToRender) => {
            productGrid.innerHTML = '';
            productsToRender.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-item-card';
                card.innerHTML = `<img src="${product.imageUrl}" alt="${product.name}"><h3>${product.name}</h3><p class="product-price">$${product.price}</p><p class="product-category">${product.category}</p>`;
                productGrid.appendChild(card);
            });
        };
        
        const applyFiltersAndSort = () => {
            let filteredProducts = [...products];
            if (categoryFilter.value !== 'all') {
                filteredProducts = filteredProducts.filter(p => p.category === categoryFilter.value);
            }
            if (sortBy.value === 'price-asc') filteredProducts.sort((a, b) => a.price - b.price);
            if (sortBy.value === 'price-desc') filteredProducts.sort((a, b) => b.price - a.price);
            renderProducts(filteredProducts);
        };
        
        categoryFilter.addEventListener('change', applyFiltersAndSort);
        sortBy.addEventListener('change', applyFiltersAndSort);
        renderProducts(products);
    }
});