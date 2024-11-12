const jsonFilePath = 'recipes.json';  // Remplacez par le chemin vers votre fichier JSON

// Fonction pour afficher les recettes dans le panel
function displayRecipes(recipes) {
    const recettePanel = document.getElementById('recettePanel');
    recettePanel.innerHTML = ''; // Vider le panel avant d'ajouter les recettes filtrées

    recipes.forEach(recipe => {
        const recetteDiv = document.createElement('div');
        recetteDiv.classList.add('recette');

        const ingredientsList = recipe.ingredients
            .map(ing => `${ing.ingredient}: ${ing.quantity || ''} ${ing.unit || ''}`)
            .join(', ');

        recetteDiv.innerHTML = `
            <div class="image-recette">
                <img src="JSON-recipes/${recipe.image}" alt="${recipe.name}">
            </div>
            <div class="description-recette">
                <h2 class="nom-recette">${recipe.name}</h2>
                <p class="recette-nom">Recette</p>
                <p class="preparation">${recipe.description}</p>
                <p class="ingredient">Ingrédients</p>
                <p class="description-ingredient">${ingredientsList}</p>
            </div>
        `;
        
        recettePanel.appendChild(recetteDiv);
    });

    const numberOfRecipes = recettePanel.getElementsByClassName('recette').length;
    const nombreRecettesElement = document.getElementById('nombre-recettes');
    nombreRecettesElement.textContent = `${numberOfRecipes} recettes`;
}

// Fonction pour charger les ingrédients uniques dans le sélecteur
function loadIngredients(recipes) {
    const ingredientsSet = new Set();
    
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            ingredientsSet.add(ingredient.ingredient.toLowerCase());
        });
    });

    const uniqueIngredients = Array.from(ingredientsSet).sort();
    const selectElement = document.getElementById('ingredient-options');

    uniqueIngredients.forEach(ingredient => {
        const option = document.createElement('option');
        option.value = ingredient;
        option.textContent = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);
        selectElement.appendChild(option);
    });
}

// Fonction pour charger les appareils uniques dans le sélecteur
function loadAppliances(recipes) {
    const appliancesSet = new Set();

    recipes.forEach(recipe => {
        if (recipe.appliance) {
            appliancesSet.add(recipe.appliance.toLowerCase());
        }
    });

    const uniqueAppliances = Array.from(appliancesSet).sort();
    const selectElementAppliance = document.getElementById('appliance-options');

    uniqueAppliances.forEach(appliance => {
        const option = document.createElement('option');
        option.value = appliance;
        option.textContent = appliance.charAt(0).toUpperCase() + appliance.slice(1);
        selectElementAppliance.appendChild(option);
    });
}

// Fonction pour charger les ustensiles uniques dans le sélecteur
function loadUstensils(recipes) {
    const ustensilsSet = new Set();

    recipes.forEach(recipe => {
        recipe.ustensils.forEach(ustensil => {
            ustensilsSet.add(ustensil.toLowerCase());
        });
    });

    const uniqueUstensils = Array.from(ustensilsSet).sort();
    const selectElementUstensil = document.getElementById('ustensil-options');

    uniqueUstensils.forEach(ustensil => {
        const option = document.createElement('option');
        option.value = ustensil;
        option.textContent = ustensil.charAt(0).toUpperCase() + ustensil.slice(1);
        selectElementUstensil.appendChild(option);
    });
}

// Fonction pour configurer la barre de recherche et filtrer les recettes
function setupSearch(recipes) {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredRecipes = recipes.filter(recipe => {
            return recipe.name.toLowerCase().includes(query) ||
                   recipe.description.toLowerCase().includes(query) ||
                   recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(query));
        });

        displayRecipes(filteredRecipes);
    });
}

// Fonction pour gérer l'ajout et la suppression de filtres
function setupFilterSelectors() {
    const filterContainer = document.getElementById('le-filtre');
    const ingredientSelect = document.getElementById('ingredient-options');
    const applianceSelect = document.getElementById('appliance-options');
    const ustensilSelect = document.getElementById('ustensil-options');

    // Vérifie que les éléments sont bien présents avant d'ajouter les événements
    if (!ingredientSelect || !applianceSelect || !ustensilSelect || !filterContainer) {
        console.error('Un ou plusieurs éléments HTML sont manquants.');
        return;
    }

    // Fonction pour ajouter un filtre à la liste
    function addFilter(value, category) {
        const filterItem = document.createElement('div');
        filterItem.classList.add('filter-item');
        filterItem.textContent = value;

        // Créer le bouton de suppression
        const removeButton = document.createElement('button');
        removeButton.textContent = "X";
        removeButton.classList.add('remove-button');
        
        // Ajouter le bouton de suppression au filtre
        filterItem.appendChild(removeButton);
        
        // Ajouter le filtre au container
        filterContainer.appendChild(filterItem);

        // Lorsqu'on clique sur le bouton de suppression, retirer le filtre et réactiver l'option correspondante
        removeButton.addEventListener('click', () => {
            // Réactiver l'option correspondante dans le selecteur
            const selectElement = document.getElementById(category + '-options');
            const optionToReactivate = selectElement.querySelector(`option[value="${value}"]`);
            if (optionToReactivate) {
                optionToReactivate.disabled = false;
            }

            // Supprimer le filtre du container
            filterContainer.removeChild(filterItem);
        });

        // Désactiver l'option correspondante dans le select
        const selectElement = document.getElementById(category + '-options');
        const optionToDisable = selectElement.querySelector(`option[value="${value}"]`);
        if (optionToDisable) {
            optionToDisable.disabled = true;
        }
    }

    // Ajouter les filtres selon les sélections
    ingredientSelect.addEventListener('change', (event) => {
        const selectedValue = event.target.value.trim(); // Enlever les espaces excédentaires
        if (selectedValue) {
            addFilter(selectedValue, 'ingredient');  // Ajouter un filtre pour les ingrédients
            ingredientSelect.selectedIndex = 0; // Réinitialiser la sélection
        }
    });

    applianceSelect.addEventListener('change', (event) => {
        const selectedValue = event.target.value.trim(); // Enlever les espaces excédentaires
        if (selectedValue) {
            addFilter(selectedValue, 'appliance');  // Ajouter un filtre pour les appareils
            applianceSelect.selectedIndex = 0; // Réinitialiser la sélection
        }
    });

    ustensilSelect.addEventListener('change', (event) => {
        const selectedValue = event.target.value.trim(); // Enlever les espaces excédentaires
        if (selectedValue) {
            addFilter(selectedValue, 'ustensil');  // Ajouter un filtre pour les ustensiles
            ustensilSelect.selectedIndex = 0; // Réinitialiser la sélection
        }
    });
}










// Fonction principale pour charger les données et configurer les filtres
async function loadRecipes() {
    try {
        const response = await fetch(jsonFilePath);
        const recipes = await response.json();

        displayRecipes(recipes);       // Affiche toutes les recettes au départ
        loadIngredients(recipes);      // Charge les ingrédients dans le sélecteur
        loadAppliances(recipes);       // Charge les appareils dans le sélecteur
        loadUstensils(recipes);        // Charge les ustensiles dans le sélecteur
        setupSearch(recipes);          // Configure la recherche dynamique
        setupFilterSelectors(recipes)
    } catch (error) {
        console.error("Erreur lors du chargement des données JSON :", error);
    }
}

// Charger les recettes lorsque la page est prête
document.addEventListener('DOMContentLoaded', loadRecipes);
