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
//variables
let nameInput = document.getElementById("Name") 

//needs  
nameInput.addEventListener("blur", async () => {
    await upperLetter();
});

//final validation  
document.getElementById("recipeForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let ok = await upperLetter();

    if (ok) {
      event.target.submit();
    }
  });
});
