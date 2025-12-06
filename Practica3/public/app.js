async function checkRecipeAvailability() {
  let recipeInput = document.getElementById("Name");
  let recipeName = recipeInput.value;

  const response = await fetch(`/availableRecipe?recipe=${recipeName}`);
  const responseObj = await response.json();

  const messageDiv = document.getElementById("NameError");

  if (responseObj.available) {
    recipeInput.classList.remove("is-invalid"); 
    messageDiv.textContent = "Disponible";
  } else {
    recipeInput.classList.add("is-invalid");
    messageDiv.textContent = "Ya existe una receta con este nombre";
  }  //if else para q utilice la implementacion de bootstrap
}