//images function

async function previewImage(event) {
    let file = event.target.files[0]; //event.target = input type file, files[0] first file selected 
    let previewImg = document.getElementById("ImagePreview");
    let dropArea = document.getElementById("DropArea");

    previewImg.innerHTML = "";

    if (file) {
        let img = document.createElement("img"); //create a element img in memory
        img.src = URL.createObjectURL(file);   // create a url that aim to the file of your pc
        img.style.maxWidth = "200px";
        img.classList.add("img-thumbnail");    // bootstrap styles
        previewImg.appendChild(img);

    //button of delete

    let buttonImg = document.getElementById("ImageButton");
    buttonImg.style.display = "block";
    dropArea.style.display = "none";
  }
}

async function DeleteImage() {
    let imageInput = document.getElementById("Image");
    let imagePreview = document.getElementById("ImagePreview");
    let imageButton = document.getElementById("ImageButton");
    let dropArea = document.getElementById("DropArea");
    let deleteEdit = document.getElementById("EditDeleteImage");

    imageInput.value = "";
    imagePreview.innerHTML = "";
    imageButton.style.display = "none";
    dropArea.style.display = "block"

    deleteEdit.value = "true";

}

document.addEventListener("DOMContentLoaded", () => {
    let dropArea = document.getElementById("DropArea");
    let inputImg = document.getElementById("Image");

    dropArea.ondragover = (event) => event.preventDefault(); //execute this when u drag an img on the area, and the event.preventdefault forbide open the file

    dropArea.ondrop = (event) => {  //same but when u drop
        event.preventDefault();

        inputImg.files = event.dataTransfer.files; //event.dataTransfer.files have the list of file that u drag, and the file go to image
        dropArea.style.display = "none"
        previewImage({ target: inputImg }); //preview
    };
    
});










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
    const recipeInput = document.getElementById("Name");
    const recipeName = recipeInput.value;
    const errorDiv = document.getElementById("NameError");

    if (!recipeName) {
        errorDiv.textContent = "El nombre no puede estar vacío";
        recipeInput.classList.remove("is-valid");
        recipeInput.classList.add("is-invalid");
        return false;
    }

    const response = await fetch(`/availableRecipe?recipe=${recipeName}`);
    const availableRecipe = await response.json();

    if (availableRecipe) {
        errorDiv.innerHTML = "<p>Disponible</p>";
        recipeInput.classList.remove("is-invalid");
        recipeInput.classList.add("is-valid");
        return true;
    } else {
        errorDiv.innerHTML = "<p>No disponible</p>";
        recipeInput.classList.remove("is-valid");
        recipeInput.classList.add("is-invalid");
        return false;
    }
}

//check if the first letter of the name is capital
async function upperLetter() {
    let nameInput = document.getElementById("Name");
    let name = nameInput.value;
    let errorDiv = document.getElementById("NameError2");
    let firstLetter = name.charAt(0);

    if (!name || name.length === 0) {
        errorDiv.innerHTML = "<p>La primera letra debe ser mayuscula</p>";
        nameInput.classList.remove("is-valid");
        nameInput.classList.add("is-invalid");
        return false;
    }   else if (checkRecipeAvailability() && (firstLetter === firstLetter.toUpperCase())) {;
        errorDiv.innerHTML = "";
        nameInput.classList.remove("is-invalid");
        nameInput.classList.add("is-valid");
        return true;
    }   else {
        errorDiv.innerHTML = "<p>La primera letra debe ser mayúscula</p>";
        nameInput.classList.remove("is-valid");
        nameInput.classList.add("is-invalid");
        return false;
    }

}

//description validation
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
    }   else if(description && (description.length >= 10 || description.length <= 500)){
        descriptionError.innerHTML = "";
        descriptionInput.classList.remove("is-invalid");
        descriptionInput.classList.add("is-valid");
        return true;
    }

}

//steps validation
async function lettersSteps() {
    let stepsInput = document.getElementById("Steps");
    let steps = stepsInput.value;
    let stepsError = document.getElementById("StepsError");

    if (!steps) { 
        stepsError.innerHTML = "<p>Los pasos de la receta son obligatorios</p>";
        stepsInput.classList.remove("is-valid");
        stepsInput.classList.add("is-invalid");
        return false;
    }   else if(steps && (steps.length < 10 || steps.length > 2000)){
        stepsError.innerHTML = "<p>Los pasos deben tener entre 10 y 2000 caracteres</p>";
        stepsInput.classList.remove("is-valid");
        stepsInput.classList.add("is-invalid");
        return false
    }   else if(steps && (steps.length >= 10 || steps.length <= 2000)){
        stepsError.innerHTML = "";
        stepsInput.classList.remove("is-invalid");
        stepsInput.classList.add("is-valid");
        return true;
    }

}

//Dish, difficulty, length and image validations
async function valDish() {
    let dishInput = document.getElementById("Dish");
    let dish = dishInput.value;
    let dishError = document.getElementById("DishError");

    if (!dish) {
        dishError.innerHTML = "<p>Debes seleccionar un tipo de plato</p>";
        dishInput.classList.remove("is-valid");
        dishInput.classList.add("is-invalid");
        return false;
    }   else {
        dishError.innerHTML = "";
        dishInput.classList.remove("is-invalid");
        dishInput.classList.add("is-valid");
        return true;
    }

}

async function valLength() {
    let lengthInput = document.getElementById("Length");
    let length = lengthInput.value;
    let lengthError = document.getElementById("LengthError");

    if (!length) {
        lengthError.innerHTML = "<p>Debes seleccionar un tipo de plato</p>";
        lengthInput.classList.remove("is-valid");
        lengthInput.classList.add("is-invalid");
        return false;
    }   else {
        lengthError.innerHTML = "";
        lengthInput.classList.remove("is-invalid");
        lengthInput.classList.add("is-valid");
        return true;
    }

}

async function valImage() {
    let imageInput = document.getElementById("Image");
    let imageError = document.getElementById("ImageError");

    if (!imageInput.files || imageInput.files.length === 0) {
        imageError.innerHTML = "<p>Debes seleccionar una imagen</p>";
        imageInput.classList.remove("is-valid");
        imageInput.classList.add("is-invalid");
        return false;
    } else {
        imageError.innerHTML = "";
        imageInput.classList.remove("is-invalid");
        imageInput.classList.add("is-valid");
        return true;
    }
}

async function valDifficulty() {
    let selected = document.querySelector('input[name="difficulty"]:checked');
    let difficultyGroup = document.getElementById("DifficultyGroup");
    let difficultyError = document.getElementById("DifficultyError");

    if (!selected) {
        difficultyError.innerHTML = "<p>Debes seleccionar una dificultad</p>";
        difficultyGroup.classList.remove("is-valid");
        difficultyGroup.classList.add("is-invalid");
        return false;
    } else {
        difficultyError.innerHTML = "";
        difficultyGroup.classList.remove("is-invalid");
        difficultyGroup.classList.add("is-valid");
        return true;
    }
}

// Price validation
async function valPrice(){
    let priceInput = document.getElementById("Price");
    let price = priceInput.value;
    let priceError = document.getElementById("PriceError");

    const priceRegex = /^\d{1,3},\d{2} €\.?$/;

    if (!price){
        priceError.innerHTML = "<p> Debes introducir un precio </p>";
        priceInput.classList.remove("is-valid");
        priceInput.classList.add("is-invalid");
        return false;
    } else if (!priceRegex.test(price)) {
        priceError.innerHTML = "<p>El precio debe tener el formato X,XX € (ej: 1,65 €)</p>";
        priceInput.classList.remove("is-valid");
        priceInput.classList.add("is-invalid");
        return false;
    } else {
        priceError.innerHTML = "";
        priceInput.classList.remove("is-invalid");
        priceInput.classList.add("is-valid");
        return true;
    }
}

//Recipe formulary validation
document.addEventListener("DOMContentLoaded", () => {
    //variables
    let nameInput = document.getElementById("Name") 
    let descriptionInput = document.getElementById("Description")
    let stepsInput = document.getElementById("Steps")
    let dishInput = document.getElementById("Dish")
    let lengthInput = document.getElementById("Length")
    let difficultyInput = document.getElementById("Difficulty")

    //use of blur event
    nameInput.addEventListener("blur", async () => {
        await upperLetter();
    });

    descriptionInput.addEventListener("blur", async () => {
        await lettersDescription();
    });

    stepsInput.addEventListener("blur", async () => {
        await lettersSteps();
    });

    dishInput.addEventListener("blur", async () => {
        await valDish();
    });

    lengthInput.addEventListener("blur", async () => {
        await valLength();
    });

    difficultyInput.addEventListener("click", async () => {
        await valDifficulty();
    });


    //final validation  
    document.getElementById("recipeForm").addEventListener("submit", async function(event) {
        event.preventDefault();

        let spinner = document.getElementById("Spinner");
        spinner.style.display = "inline-block";

        await valDifficulty();
        await valImage();
        await valLength();
        await checkRecipeAvailability();
        await upperLetter();
        await lettersDescription();
        await lettersSteps();
        await valDish();

        const formData = new FormData(event.target);
        const response = await fetch(event.target.action, {    // /NewItem o editItem
            method: "POST",
            body: formData
        });

        let result = await response.json();

        if (response.ok) {    //result.ok is true if the http of response is between 200 and 299, son is false when there are an error and return http 400
            alert("Receta guardada correctamente");
            window.location.href = `/DetailPage.html/${result.id}`;
        } else {
            if (result.errors && result.errors.length > 0) {
                alert("Errores:\n" + result.errors.join("\n")); // \n is for a brake line, join is to make a string with a field of an array
            }
        }
        
        spinner.style.display = "none";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    //variables
    let nameInput = document.getElementById("Name")
    let priceInput = document.getElementById("Price")
    let descriptionInput = document.getElementById("Description")

    // use of blur event
    nameInput.addEventListener("blur", async () => {
        await upperLetter();
    });

    descriptionInput.addEventListener("blur", async () => {
        await lettersDescription();
    });

    priceInput.addEventListener("blur", async () => {
        await valPrice();
    })

    //final validation 
    document.getElementById("ingredientForm").addEventListener("submit", async function(event){
        event.preventDefault();
        let spinner = document.getElementById("Spinner");
        spinner.style.display = "inline-block";

        await upperLetter();
        await valImage();
        await lettersDescription();
        await valPrice();

        const formData = new FormData(event.target);
        const response = await fetch(event.target.action, {    
            method: "POST",
            body: formData
        });

        let result = await response.json();

        if (response.ok) {    
            alert("Ingrediente guardado correctamente");
            window.location.href = `/DetailPage.html/${result.id}`;
        } else {
            if (result.errors && result.errors.length > 0) {
                alert("Errores:\n" + result.errors.join("\n")); 
            }
        }
            
        spinner.style.display = "none";
    });
});