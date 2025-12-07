let numPage = 1;
async function loadMore() {
    numPage++;
    const response = await fetch(`/loadRecipes?numPage=${numPage}`);
    const loadedRecipes = await response.json();

    const recipesDiv = document.getElementById("recipesGrid");
    loadedRecipes.forEach(recipe => {
        const recipeButton = document.createElement("div");
        recipeButton.className = "col-xs-12 col-sm-6 col-md-6 col-lg-4";

        recipeButton.innerHTML = `
        <a href="/DetailPage.html/${recipe._id}" class="btn btn-primary" role="button">
            <img class="img-fluid" src="/recipe/${recipe._id}/image" alt="${recipe.name}">
            ${recipe.name}
        </a>
        `;

        recipesDiv.appendChild(recipeButton);
    });
}

async function checkRecipeAvailability() {
    let recipeInput = document.getElementById("Name");
    let recipeName = recipeInput.value;

    const response = await fetch(`/availableRecipe?recipe=${recipeName}`);
    const availableRecipe = await response.json();

    let message = availableRecipe ? "<p>Disponible</p>" : "<p>No disponible</p>";

    const errorDiv = document.getElementById("NameError");
    errorDiv.innerHTML = message;
}
