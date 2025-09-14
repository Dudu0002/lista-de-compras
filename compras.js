document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.querySelector('.categories');
    const newCategoryInput = document.getElementById('new-category');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const resetBtn = document.getElementById('reset-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    const categoryIcons = {
        'Frutas': 'fa-apple-alt',
        'Laticínios': 'fa-cheese',
        'Padaria': 'fa-bread-slice',
        'Carnes': 'fa-drumstick-bite',
        'Bebidas': 'fa-wine-bottle',
        'Limpeza': 'fa-spray-can',
        'Higiene': 'fa-soap',
        'Congelados': 'fa-snowflake',
        'Padrão': 'fa-shopping-basket'
    };

    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || {
        'Frutas': [{ name: 'Maçã', completed: false }, { name: 'Banana', completed: true }],
        'Laticínios': [{ name: 'Leite', completed: false }],
        'Padaria': [{ name: 'Pão', completed: false }]
    };

    // ---------- TEMA ESCURO ----------
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        updateThemeButton();
    }

    function updateThemeButton() {
        const isDark = document.body.classList.contains('dark-mode');
        themeToggleBtn.innerHTML = isDark
            ? '<i class="fas fa-sun"></i> Modo Claro'
            : '<i class="fas fa-moon"></i> Modo Escuro';
    }

    themeToggleBtn.addEventListener('click', toggleTheme);

    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
    updateThemeButton();
    // ---------------------------------

    function saveToLocalStorage() {
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    }

    function getCategoryIcon(categoryName) {
        for (const category in categoryIcons) {
            if (categoryName.toLowerCase().includes(category.toLowerCase())) {
                return categoryIcons[category];
            }
        }
        return categoryIcons['Padrão'];
    }

    function renderCategories() {
        categoriesContainer.innerHTML = '';

        Object.keys(shoppingList).forEach((categoryName, index) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            categoryDiv.style.animationDelay = `${index * 0.1}s`;

            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';

            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'category-title';

            const icon = document.createElement('i');
            icon.className = `fas ${getCategoryIcon(categoryName)}`;

            const titleText = document.createElement('span');
            titleText.textContent = categoryName;

            categoryTitle.appendChild(icon);
            categoryTitle.appendChild(titleText);

            const deleteCategoryBtn = document.createElement('button');
            deleteCategoryBtn.className = 'delete-category';
            deleteCategoryBtn.innerHTML = '<i class="fas fa-trash"></i> Excluir';
            deleteCategoryBtn.addEventListener('click', () => {
                if (confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"?`)) {
                    delete shoppingList[categoryName];
                    saveToLocalStorage();
                    renderCategories();
                }
            });

            categoryHeader.appendChild(categoryTitle);
            categoryHeader.appendChild(deleteCategoryBtn);

            const itemsList = document.createElement('ul');
            itemsList.className = 'items-list';

            shoppingList[categoryName].forEach((item, index) => {
                const itemLi = document.createElement('li');
                itemLi.className = `item ${item.completed ? 'completed' : ''}`;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item.completed;
                checkbox.addEventListener('change', () => {
                    shoppingList[categoryName][index].completed = checkbox.checked;
                    saveToLocalStorage();
                    renderCategories();
                });

                const itemName = document.createElement('span');
                itemName.textContent = item.name;

                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<i class="fas fa-times-circle"></i>';
                deleteBtn.addEventListener('click', () => {
                    shoppingList[categoryName].splice(index, 1);
                    saveToLocalStorage();
                    renderCategories();
                });

                itemLi.appendChild(checkbox);
                itemLi.appendChild(itemName);
                itemLi.appendChild(deleteBtn);
                itemsList.appendChild(itemLi);
            });

            const addItemDiv = document.createElement('div');
            addItemDiv.className = 'add-item';

            const addItemInput = document.createElement('input');
            addItemInput.type = 'text';
            addItemInput.placeholder = 'Adicionar novo item...';

            const addItemBtn = document.createElement('button');
            addItemBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar';
            addItemBtn.addEventListener('click', () => {
                const newItemName = addItemInput.value.trim();
                if (newItemName) {
                    shoppingList[categoryName].push({ name: newItemName, completed: false });
                    saveToLocalStorage();
                    renderCategories();
                    addItemInput.value = '';
                    addItemInput.focus();
                } else {
                    addItemInput.classList.add('input-error');
                    setTimeout(() => addItemInput.classList.remove('input-error'), 1500);
                }
            });

            addItemInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addItemBtn.click();
                }
            });

            addItemDiv.appendChild(addItemInput);
            addItemDiv.appendChild(addItemBtn);

            categoryDiv.appendChild(categoryHeader);
            categoryDiv.appendChild(itemsList);
            categoryDiv.appendChild(addItemDiv);

            categoriesContainer.appendChild(categoryDiv);
        });
    }

    addCategoryBtn.addEventListener('click', () => {
        const newCategoryName = newCategoryInput.value.trim();
        if (newCategoryName && !shoppingList[newCategoryName]) {
            shoppingList[newCategoryName] = [];
            saveToLocalStorage();
            renderCategories();
            newCategoryInput.value = '';
            newCategoryInput.focus();
        } else {
            newCategoryInput.classList.add('input-error');
            setTimeout(() => newCategoryInput.classList.remove('input-error'), 1500);
        }
    });

    newCategoryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCategoryBtn.click();
        }
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja criar uma nova lista? Isso apagará todos os dados atuais.')) {
            shoppingList = {};
            saveToLocalStorage();
            renderCategories();
        }
    });

    renderCategories();
});
