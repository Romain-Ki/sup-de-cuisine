import { describe, it, expect, beforeEach } from 'vitest';

// Configuration de l'environnement DOM pour simuler l'HTML de la page
beforeEach(() => {
  document.body.innerHTML = `
    <div id="recettePanel"></div>
    <p id="nombre-recettes"></p>
    <p id="search-message" style="display: none;"></p>
  `;
});

describe('displayRecipes', () => {
  it('doit afficher les recettes correctement dans le conteneur recettePanel', () => {
    const testRecipes = [
      {
        name: 'Recette 1',
        description: 'Description de la recette 1',
        image: 'image1.jpg',
        ingredients: [
          { ingredient: 'Lait', quantity: 100, unit: 'ml' },
          { ingredient: 'Sucre', quantity: 50, unit: 'g' }
        ]
      }
    ];

    // Appel de la fonction via `window`
    window.displayRecipes(testRecipes);

    const recettePanel = document.getElementById('recettePanel');
    expect(recettePanel.children.length).toBe(1);
    expect(recettePanel.children[0].querySelector('.nom-recette').textContent).toBe('Recette 1');
  });
});
