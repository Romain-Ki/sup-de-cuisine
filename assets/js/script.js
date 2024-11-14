// Variables globales
let globalRecipes = [];  // Stocke toutes les recettes pour le filtrage
let filters = { ingredients: [], appliances: [], ustensils: [] };  // Garde la trace des filtres actifs
let searchQuery = '';  // Stocke la requête de recherche

// Fonction pour afficher les recettes dans le panel et afficher un message si aucune recette ne correspond
function displayRecipes(recipes) {
    const recettePanel = document.getElementById('recettePanel');
    const searchMessage = document.getElementById('search-message');  // Conteneur pour le message de recherche
    recettePanel.innerHTML = '';  // Vide le panel avant d'ajouter les nouvelles recettes

    // Affiche le message si aucune recette ne correspond et que la recherche a au moins 3 caractères
    if (recipes.length === 0 && searchQuery.length >= 3) {
        searchMessage.textContent = `Aucune recette ne contient ‘${searchQuery}’`;
        searchMessage.style.display = 'block';
    } else {
        searchMessage.style.display = 'none';  // Cache le message si des recettes sont trouvées
    }

    // Affiche chaque recette
    recipes.forEach(recipe => {
        const recetteDiv = document.createElement('div');
        recetteDiv.classList.add('recette');
    
        // Créer une liste d'ingrédients formatée
        const ingredientsList = recipe.ingredients
            .map(ing => `<li><strong>${ing.ingredient}</strong> : ${ing.quantity || ''} ${ing.unit || ''}</li>`)
            .join('');

        recetteDiv.innerHTML = `
            <div class="image-recette">
                <img src="assets/images/${recipe.image}" alt="${recipe.name}">
            </div>
            <div class="description-recette">
                <h2 class="nom-recette">${recipe.name}</h2>
                <p class="recette-nom">Recette</p>
                <p class="preparation">${recipe.description}</p>
                <p class="ingredient">Ingrédients</p>
                <ul class="description-ingredient">${ingredientsList}</ul> <!-- Utilise <ul> et <li> pour la liste d'ingrédients -->
            </div>
        `;
    
        document.getElementById('recettePanel').appendChild(recetteDiv);
    });

    // Met à jour le nombre de recettes affichées
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

    // Trie et ajoute les ingrédients uniques dans le sélecteur
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

    // Trie et ajoute les appareils uniques dans le sélecteur
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

    // Trie et ajoute les ustensiles uniques dans le sélecteur
    const uniqueUstensils = Array.from(ustensilsSet).sort();
    const selectElementUstensil = document.getElementById('ustensil-options');

    uniqueUstensils.forEach(ustensil => {
        const option = document.createElement('option');
        option.value = ustensil;
        option.textContent = ustensil.charAt(0).toUpperCase() + ustensil.slice(1);
        selectElementUstensil.appendChild(option);
    });
}

// Fonction pour filtrer les recettes en fonction des tags actifs et de la recherche
function filterRecipes(recipes) {
    return recipes.filter(recipe => {
        // Filtrer par ingrédients
        const matchIngredient = filters.ingredients.length === 0 ||
            filters.ingredients.every(filter => 
                recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === filter)
            );

        // Filtrer par appareil
        const matchAppliance = filters.appliances.length === 0 ||
            filters.appliances.includes(recipe.appliance.toLowerCase());

        // Filtrer par ustensile
        const matchUstensil = filters.ustensils.length === 0 ||
            filters.ustensils.every(filter => 
                recipe.ustensils.includes(filter)
            );

        // Filtrer par recherche (au moins 3 caractères requis)
        const matchSearch = searchQuery.length < 3 ||  // Ignore si moins de 3 caractères
            recipe.name.toLowerCase().includes(searchQuery) ||
            recipe.description.toLowerCase().includes(searchQuery) ||
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(searchQuery));

        return matchIngredient && matchAppliance && matchUstensil && matchSearch;
    });
}

// Fonction pour mettre à jour les recettes affichées en fonction des filtres actifs
function updateRecipes() {
    const filteredRecipes = filterRecipes(globalRecipes); // Filtre les recettes avec les tags actifs et la recherche
    displayRecipes(filteredRecipes);
}

// Fonction pour ajouter un tag dans "filtre-select" et activer le filtrage
function addTag(category, value) {
    const filterContainer = document.getElementById('le-filtre');
    const filterItem = document.createElement('div');
    filterItem.classList.add('filter-item');
    filterItem.textContent = value.charAt(0).toUpperCase() + value.slice(1);

    // Ajoute un bouton de suppression au tag
    const removeButton = document.createElement('button');
    removeButton.textContent = "X";
    removeButton.classList.add('remove-button');
    filterItem.appendChild(removeButton);
    filterContainer.appendChild(filterItem);

    // Ajoute le filtre au tableau des filtres actifs
    filters[category].push(value);

    // Supprime le tag et met à jour les recettes lorsque le bouton "X" est cliqué
    removeButton.addEventListener('click', () => {
        filters[category] = filters[category].filter(f => f !== value); // Retire le filtre du tableau
        filterContainer.removeChild(filterItem); // Enlève le tag visuellement
        updateRecipes(); // Met à jour les recettes
    });

    updateRecipes(); // Met à jour les recettes
}

// Fonction pour configurer les sélecteurs et créer les tags correspondants
function setupFilterSelectors() {
    document.getElementById('ingredient-options').addEventListener('change', (event) => {
        const value = event.target.value;
        if (value && !filters.ingredients.includes(value)) {
            addTag('ingredients', value);
        }
        event.target.selectedIndex = 0;
    });

    document.getElementById('appliance-options').addEventListener('change', (event) => {
        const value = event.target.value;
        if (value && !filters.appliances.includes(value)) {
            addTag('appliances', value);
        }
        event.target.selectedIndex = 0;
    });

    document.getElementById('ustensil-options').addEventListener('change', (event) => {
        const value = event.target.value;
        if (value && !filters.ustensils.includes(value)) {
            addTag('ustensils', value);
        }
        event.target.selectedIndex = 0;
    });
}

// Fonction pour configurer la barre de recherche et activer le filtrage des recettes
function setupSearch() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.toLowerCase();  // Stocke la recherche active
        updateRecipes();  // Met à jour les recettes en fonction des filtres actifs et de la recherche
    });
}

// Fonction principale pour charger les données et configurer les filtres
async function loadRecipes() {
    try {
        const response = await fetch('https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json');
        globalRecipes = await response.json(); // Charge les recettes dans une variable globale

        displayRecipes(globalRecipes);      // Affiche toutes les recettes au départ
        loadIngredients(globalRecipes);     // Charge les ingrédients dans le sélecteur
        loadAppliances(globalRecipes);      // Charge les appareils dans le sélecteur
        loadUstensils(globalRecipes);       // Charge les ustensiles dans le sélecteur
        setupFilterSelectors();             // Configure les sélecteurs de filtre pour créer des tags
        setupSearch();                      // Configure la recherche dynamique
    } catch (error) {
        console.error("Erreur lors du chargement des données JSON :", error);
    }
}

// Charger les recettes lorsque la page est prête
document.addEventListener('DOMContentLoaded', loadRecipes);

// Exporter les fonctions pour les tests
module.exports = {
    displayRecipes,
    filterRecipes,
    addTag
};
