// script.test.js
const { TextEncoder, TextDecoder } = require('util');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');


// Charger les fonctions à tester depuis script.js
const { displayRecipes, filterRecipes, addTag } = require('../script');

// Charger le contenu HTML pour les tests basés sur le DOM
const htmlContent = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('Tests pour l\'application de recettes', () => {
    let document;

    beforeAll(() => {
        const { JSDOM } = require('jsdom');
        const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');
        global.document = window.document;
        global.window = window;
    });

    test('La fonction displayRecipes doit afficher correctement les recettes', () => {
        const recipes = [
            { name: 'Pâtes', description: 'Délicieuses pâtes', image: 'pates.jpg', ingredients: [{ ingredient: 'Tomate', quantity: '1', unit: 'pc' }] },
            { name: 'Salade', description: 'Salade fraîche', image: 'salade.jpg', ingredients: [{ ingredient: 'Laitue', quantity: '100', unit: 'g' }] }
        ];
        
        displayRecipes(recipes); // Appeler la fonction d'affichage
        
        const renderedRecipes = document.querySelectorAll('.recette');
        expect(renderedRecipes.length).toBe(2); // Vérifier que deux recettes sont affichées

        // Vérifier le contenu spécifique
        expect(renderedRecipes[0].querySelector('.nom-recette').textContent).toBe('Pâtes');
        expect(renderedRecipes[1].querySelector('.nom-recette').textContent).toBe('Salade');
    });

    test('La fonction filterRecipes doit filtrer les recettes par la requête de recherche', () => {
        const recipes = [
            { name: 'Pâtes', description: 'Délicieuses pâtes', appliance: 'Poêle', ustensils: ['cuillère'], ingredients: [{ ingredient: 'Tomate', quantity: '1', unit: 'pc' }] },
            { name: 'Salade', description: 'Salade fraîche', appliance: 'Bol', ustensils: ['fourchette'], ingredients: [{ ingredient: 'Laitue', quantity: '100', unit: 'g' }] }
        ];

        filters = { ingredients: ['Tomate'], appliances: [], ustensils: [] }; // Filtre actif pour les ingrédients
        const filtered = filterRecipes(recipes); // Appeler la fonction de filtre avec des critères

        expect(filtered.length).toBe(1); // Seule la recette "Pâtes" doit correspondre
        expect(filtered[0].name).toBe('Pâtes');
    });

    test('La fonction addTag doit ajouter un tag et mettre à jour le filtre', () => {
        const filterContainer = document.getElementById('le-filtre');
        filters = { ingredients: [], appliances: [], ustensils: [] };

        addTag('ingredients', 'Tomate');
        
        const tags = filterContainer.querySelectorAll('.filter-item');
        expect(tags.length).toBe(1);
        expect(tags[0].textContent).toContain('Tomate');
        expect(filters.ingredients).toContain('Tomate');
    });
});
