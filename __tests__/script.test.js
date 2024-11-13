/**
 * @jest-environment jsdom
 */

const { filterRecipes, addTag } = require('./script');

// Définir des données de test pour les recettes
const testRecipes = [
    {
        name: "Pancakes",
        description: "Délicieux pancakes maison",
        ingredients: [{ ingredient: "Farine", quantity: 200, unit: "g" }],
        appliance: "Poêle",
        ustensils: ["spatule"],
    },
    {
        name: "Salade",
        description: "Salade fraîche",
        ingredients: [{ ingredient: "Tomate", quantity: 3, unit: "" }],
        appliance: "Saladier",
        ustensils: ["couteau", "bol"],
    },
];

describe("filterRecipes", () => {
    it("devrait retourner toutes les recettes si aucun filtre n'est appliqué", () => {
        const filters = { ingredients: [], appliances: [], ustensils: [] };
        const result = filterRecipes(testRecipes, filters, "");
        expect(result.length).toBe(2); // Toutes les recettes devraient être renvoyées
    });

    it("devrait filtrer les recettes par ingrédient", () => {
        const filters = { ingredients: ["farine"], appliances: [], ustensils: [] };
        const result = filterRecipes(testRecipes, filters, "");
        expect(result.length).toBe(1);
        expect(result[0].name).toBe("Pancakes");
    });

    it("devrait filtrer par appareil", () => {
        const filters = { ingredients: [], appliances: ["saladier"], ustensils: [] };
        const result = filterRecipes(testRecipes, filters, "");
        expect(result.length).toBe(1);
        expect(result[0].name).toBe("Salade");
    });

    it("devrait filtrer par ustensile", () => {
        const filters = { ingredients: [], appliances: [], ustensils: ["spatule"] };
        const result = filterRecipes(testRecipes, filters, "");
        expect(result.length).toBe(1);
        expect(result[0].name).toBe("Pancakes");
    });

    it("devrait retourner aucune recette si les filtres ne correspondent pas", () => {
        const filters = { ingredients: ["poulet"], appliances: [], ustensils: [] };
        const result = filterRecipes(testRecipes, filters, "");
        expect(result.length).toBe(0);
    });
});

describe("addTag", () => {
    it("devrait ajouter un tag et mettre à jour les filtres", () => {
        document.body.innerHTML = `<div id="le-filtre"></div>`;
        
        const filters = { ingredients: [], appliances: [], ustensils: [] };
        addTag("ingredients", "farine", filters);

        expect(filters.ingredients).toContain("farine");
        const filterItem = document.querySelector(".filter-item");
        expect(filterItem).not.toBeNull();
        expect(filterItem.textContent).toContain("farine");
    });
});

describe("displayRecipes", () => {
    it("devrait afficher le nombre de recettes correct", () => {
        document.body.innerHTML = `<div id="recettePanel"></div><p id="nombre-recettes"></p>`;
        
        displayRecipes(testRecipes);

        const recettePanel = document.getElementById("recettePanel");
        const nombreRecettesElement = document.getElementById("nombre-recettes");
        
        expect(recettePanel.children.length).toBe(2);
        expect(nombreRecettesElement.textContent).toBe("2 recettes");
    });

    it("devrait afficher un message si aucune recette n'est trouvée", () => {
        document.body.innerHTML = `<div id="recettePanel"></div><p id="search-message"></p>`;

        displayRecipes([]);

        const searchMessage = document.getElementById("search-message");
        expect(searchMessage.textContent).toBe("Aucune recette ne contient ‘’");
        expect(searchMessage.style.display).toBe("block");
    });
});
