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
async function editIngredient(_id){
    const ingredientSection = document.getElementById("ingredient-" + _id);
    ingredientSection.innerHTML = `
        <form role="form" method="post" action="{{#isEdit}}/EditIngredient/{{recipe._id}}/{{ingredient._id}}{{/isEdit}}{{^isEdit}}/NewIngredient{{/isEdit}}" enctype="multipart/form-data">
            <div class="form-group">
                <label for="Name"><strong> Nombre: </strong></label>
                <input type="text" class="form-control" name="name" id="Name" value="{{ingredient.name}}" placeholder="Nombre del ingrediente..." required> 
            </div>  

            <div class="row">
                <label for="Allergens"><strong> Alérgenos: </strong></label>
                <div class="col">
                    <label><input type="checkbox" name="allergens" value="Gluten" {{#gluten}}checked{{/gluten}}> Gluten. </label><br>
                    <label><input type="checkbox" name="allergens" value="Crustáceos" {{#crustacean}}checked{{/crustacean}}> Crustáceos. </label><br>
                    <label><input type="checkbox" name="allergens" value="Huevo" {{#eggs}}checked{{/eggs}}> Huevo. </label><br>
                    <label><input type="checkbox" name="allergens" value="Pescado" {{#fish}}checked{{/fish}}> Pescado. </label><br>
                    <label><input type="checkbox" name="allergens" value="Cacahuetes" {{#peanuts}}checked{{/peanuts}}> Cacahuetes. </label><br>
                    <label><input type="checkbox" name="allergens" value="Soja" {{#soya}}checked{{/soya}}> Soja. </label><br>
                    <label><input type="checkbox" name="allergens" value="Lacteos" {{#dairy}}checked{{/dairy}}> Lacteos. </label><br>
                </div>

                <div class="col">
                    <label><input type="checkbox" name="allergens" value="Frutos con cáscara" {{#nuts}}checked{{/nuts}}> Frutos con cáscara. </label><br>
                    <label><input type="checkbox" name="allergens" value="Apio" {{#celery}}checked{{/celery}}> Apio. </label><br>
                    <label><input type="checkbox" name="allergens" value="Mostaza" {{#mustard}}checked{{/mustard}}> Mostaza. </label><br>
                    <label><input type="checkbox" name="allergens" value="Sésamo" {{#sesame}}checked{{/sesame}}> Sésamo. </label><br>
                    <label><input type="checkbox" name="allergens" value="Sulfitos" {{#sulfites}}checked{{/sulfites}}> Sulfitos. </label><br>
                    <label><input type="checkbox" name="allergens" value="Altramuces" {{#lupin}}checked{{/lupin}}> Altramuces. </label><br>
                    <label><input type="checkbox" name="allergens" value="Moluscos" {{#mollusk}}checked{{/mollusk}}> Moluscos. </label><br>
                </div>
            </div>

            <div class="form-group">
                <label for="Price"><strong> Precio: </strong></label>
                <input type="text" class="form-control" id="Price" name="price" value="{{ingredient.price}}" placeholder="Precio del ingrediente. (X,XX €) Ej: 1,65 €" required pattern="^\d{1,3},\d{2} €\.?$"> 
            </div>  

            <div class="form-group">
                <label for="Description"><strong> Descripción: </strong></label>
                <textarea class="form-control" name="description" id="Description" rows="3"> {{ingredient.description}} </textarea>
            </div>

            <div class="form-group">
                <label for="Image"><strong> Imagen: {{#isEdit}} (opcional, si no se incluye se mantendrá la anterior) {{/isEdit}} </strong></label>
                <input type="file" class="form-control" name="image" id="Image" accept="image/*" {{^isEdit}}required{{/isEdit}}>
            </div>

            <div class="form-group mb-0">
                <input type="hidden" name="recipe_id" value="{{recipe._id}}">
                <button type="submit" class="btn btn-primary"> <i class="bi bi-plus-lg"></i> {{#isEdit}}Guardar{{/isEdit}}{{^isEdit}}Crear{{/isEdit}} </button>
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
//quitar ajax de aqui 
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

async function lettersDescription() {
    let descriptionInput = document.getElementById("Description");
    let description = descriptionInput.value;
    let descriptionError = document.getElementById("DescriptionError");

    if (!description) { 
        descriptionError.innerHTML = "<p>La descripcion es obligatoria</p>";
        descriptionInput.classList.remove("is-valid");
        descriptionInput.classList.add("is-invalid");
        return false;
    }   else if(description && (description.length < 10 || description.length > 500)){
        descriptionError.innerHTML = "<p>La descripcion debe tener entre 10 y 500 caracteres</p>";
        descriptionInput.classList.remove("is-valid");
        descriptionInput.classList.add("is-invalid");
        return false
    }   else if(description && (description.length >= 10 || description-length <= 500)){
        descriptionError.innerHTML = "<p>La descripcion es correcta</p>";
        descriptionInput.classList.remove("is-invalid");
        descriptionInput.classList.add("is-valid");
        return true;
    }

}






//Formulary validation!!!!

document.addEventListener("DOMContentLoaded", () => {
//variables
let nameInput = document.getElementById("Name") 
let descriptionInput = document.getElementById("Description")

//needs (blur)
nameInput.addEventListener("blur", async () => {
    await upperLetter();
});

descriptionInput.addEventListener("blur", async () => {
    await lettersDescription();
});

//final validation  
document.getElementById("recipeForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let ok = await upperLetter() && lettersDescription();

    if (ok) {
      event.target.submit();
    }
  });
});
