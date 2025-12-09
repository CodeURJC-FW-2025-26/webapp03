// Infinite Scroll functions
let numPage = 1;
let isLoading = false;
async function loadMore() {
    if(isLoading) return;
    isLoading = true;

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

    isLoading = false;
};

async function initInfiniteScroll(){
    window.addEventListener("scroll", () => {
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;

        if ((scrollTop + windowHeight >= documentHeight - 50)) {
            loadMore();
        }
    });
}

document.addEventListener("DOMContentLoaded", function(){
    const pageVars = document.getElementById("page-vars");
    const isSearch = pageVars.dataset.search === "true";
    if(!isSearch) {
        initInfiniteScroll();
    }
});

// Edit ingredient functions
async function editIngredient(recipe_id, ingredient_id){
    const response = await fetch(`/getIngredient?recipe_id=${recipe_id}&ingredient_id=${ingredient_id}`);
    const ingredient = await response.json();

    let gluten = ingredient.allergens?.includes("Gluten");
    let crustacean = ingredient.allergens?.includes("Crustáceos");
    let eggs = ingredient.allergens?.includes("Huevo");
    let fish = ingredient.allergens?.includes("Pescado");
    let peanuts = ingredient.allergens?.includes("Cacahuetes");
    let soya = ingredient.allergens?.includes("Soja");
    let dairy = ingredient.allergens?.includes("Lacteos");
    let nuts = ingredient.allergens?.includes("Frutos con cáscara");
    let celery = ingredient.allergens?.includes("Apio");
    let mustard = ingredient.allergens?.includes("Mostaza");
    let sesame = ingredient.allergens?.includes("Sésamo");
    let sulfites = ingredient.allergens?.includes("Sulfitos");
    let lupin = ingredient.allergens?.includes("Altramuces");
    let mollusk = ingredient.allergens?.includes("Moluscos");

    const ingredientSection = document.getElementById("ingredient-" + ingredient_id);
    ingredientSection.innerHTML = `
        <h1> Editar ingrediente: </h1>

        <form role="form" method="post" action="/EditIngredient/${recipe_id}/${ingredient_id}" enctype="multipart/form-data">
            <div class="form-group">
                <label for="Name"><strong> Nombre: </strong></label>
                <input type="text" class="form-control" name="name" id="Name" value="${ingredient.name}" placeholder="Nombre del ingrediente..." required> 
            </div>  

            <div class="row">
                <label for="Allergens"><strong> Alérgenos: </strong></label>
                <div class="col">
                    <label><input type="checkbox" name="allergens" value="Gluten" ${gluten ? "checked" : ""}> Gluten. </label><br>
                    <label><input type="checkbox" name="allergens" value="Crustáceos" ${crustacean ? "checked" : ""}> Crustáceos. </label><br>
                    <label><input type="checkbox" name="allergens" value="Huevo" ${eggs ? "checked" : ""}> Huevo. </label><br>
                    <label><input type="checkbox" name="allergens" value="Pescado" ${fish ? "checked" : ""}> Pescado. </label><br>
                    <label><input type="checkbox" name="allergens" value="Cacahuetes" ${peanuts ? "checked" : ""}> Cacahuetes. </label><br>
                    <label><input type="checkbox" name="allergens" value="Soja" ${soya ? "checked" : ""}> Soja. </label><br>
                    <label><input type="checkbox" name="allergens" value="Lacteos" ${dairy ? "checked" : ""}> Lacteos. </label><br>
                </div>

                <div class="col">
                    <label><input type="checkbox" name="allergens" value="Frutos con cáscara" ${nuts ? "checked" : ""}> Frutos con cáscara. </label><br>
                    <label><input type="checkbox" name="allergens" value="Apio" ${celery ? "checked" : ""}> Apio. </label><br>
                    <label><input type="checkbox" name="allergens" value="Mostaza" ${mustard ? "checked" : ""}> Mostaza. </label><br>
                    <label><input type="checkbox" name="allergens" value="Sésamo" ${sesame ? "checked" : ""}> Sésamo. </label><br>
                    <label><input type="checkbox" name="allergens" value="Sulfitos" ${sulfites ? "checked" : ""}> Sulfitos. </label><br>
                    <label><input type="checkbox" name="allergens" value="Altramuces" ${lupin ? "checked" : ""}> Altramuces. </label><br>
                    <label><input type="checkbox" name="allergens" value="Moluscos" ${mollusk ? "checked" : ""}> Moluscos. </label><br>
                </div>
            </div>

            <div class="form-group">
                <label for="Price"><strong> Precio: </strong></label>
                <input type="text" class="form-control" id="Price" name="price" value="${ingredient.price}" placeholder="Precio del ingrediente. (X,XX €) Ej: 1,65 €" required pattern="^\\d{1,3},\\d{2} €\\.?$"> 
            </div>  

            <div class="form-group">
                <label for="Description"><strong> Descripción: </strong></label>
                <textarea class="form-control" name="description" id="Description" rows="3"> ${ingredient.description} </textarea>
            </div>

            <div class="form-group">
                <label for="Image"><strong> Imagen: (opcional, si no se incluye se mantendrá la anterior) </strong></label>
                <input type="file" class="form-control" name="image" id="Image" accept="image/*">
            </div>

            <div class="form-group mb-0">
                <input type="hidden" name="recipe_id" value="${recipe_id}">
                <button type="submit" class="btn btn-primary"> <i class="bi bi-plus-lg"></i> Guardar </button>
            </div>
        </form>
        `;
}

// Validation functions
async function checkRecipeAvailability() {
    let recipeInput = document.getElementById("Name");
    let recipeName = recipeInput.value;

    const response = await fetch(`/availableRecipe?recipe=${recipeName}`);
    const availableRecipe = await response.json();

    let message = availableRecipe ? "<p>Disponible</p>" : "<p>No disponible</p>";

    const errorDiv = document.getElementById("NameError");
    errorDiv.innerHTML = message;
}

async function upperLetter() {
    let nameInput = document.getElementById("Name");
    let name = nameInput.value;

    const response = await fetch(`/upperLetter?recipe=${name}`);
    const upperLetter = await response.json();

    let errorDiv = document.getElementById("NameError");

    if (upperLetter.upper) {
        errorDiv.innerHTML = "<p>Todo Correcto</p>";
        nameInput.classList.remove("is-invalid");
        nameInput.classList.add("is-valid");
        return true;
    }   else {
        errorDiv.innerHTML = "<p>La primera letra debe ser mayuscula</p>";
        nameInput.classList.remove("is-valid");
        nameInput.classList.add("is-invalid");
        return false;
    }

}

//Formulary validation!!!!

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("recipeForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let ok = await upperLetter();

    if (ok) {
      event.target.submit();
    }
  });
});