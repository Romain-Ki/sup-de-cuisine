// Chemin de votre fichier JSON
const jsonFilePath = 'recipes.json';  // Remplacez par le chemin vers votre fichier JSON

// Fonction pour afficher les recettes dans le panel
function displayRecipes(recipes) {
    const recettePanel = document.getElementById('recettePanel');
    recettePanel.innerHTML = ''; // Vider le panel avant d'ajouter les recettes filtrées

    // Boucler sur chaque recette et créer le contenu
    recipes.forEach(recipe => {
        const recetteDiv = document.createElement('div');
        recetteDiv.classList.add('recette');

        const ingredientsList = recipe.ingredients
        .map(ing => `${ing.ingredient}: ${ing.quantity  || ''} ${ing.unit || ''}`)
        .join(', ');

        // Insérer le contenu de la recette dans la div
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
        
        // Ajouter la div de recette au conteneur principal
        recettePanel.appendChild(recetteDiv);
    });

    // Mettre à jour le nombre de recettes affichées
    const numberOfRecipes = recettePanel.getElementsByClassName('recette').length;
    const nombreRecettesElement = document.getElementById('nombre-recettes');
    nombreRecettesElement.textContent = `${numberOfRecipes} recettes`;
}

// Fonction pour charger et afficher les recettes
async function loadRecipes() {
    try {
        // Récupérer les données JSON
        const response = await fetch(jsonFilePath);
        const recipes = await response.json();

        // Afficher toutes les recettes au départ
        displayRecipes(recipes);

        // Sélectionner la barre de recherche
        const searchInput = document.getElementById('searchInput');

        // Filtrer les recettes en fonction de la recherche
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase(); // Récupère la valeur entrée et la met en minuscule
            const filteredRecipes = recipes.filter(recipe => {
                // Vérifie si le nom de la recette ou la description contient le texte de recherche
                return recipe.name.toLowerCase().includes(query) || recipe.description.toLowerCase().includes(query) ||
                    recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(query)); // Recherche aussi dans les ingrédients
            });

            // Afficher les recettes filtrées
            displayRecipes(filteredRecipes);
        });

    } catch (error) {
        console.error("Erreur lors du chargement des données JSON :", error);
    }
}

// Charger les recettes lorsque la page est prête
document.addEventListener('DOMContentLoaded', loadRecipes);
