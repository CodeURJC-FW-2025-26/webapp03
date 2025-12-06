async function checkRecipeAvailability() {
  let recipeInput = document.getElementById("Name");
  let recipeName = recipeInput.value;

  const response = await fetch(`/availableRecipe?recipe=${recipeName}`);
  const availableRecipe = await response.json();

  let message = availableRecipe ? "<p>Disponible</p>" : "<p>No disponible</p>";

  const errorDiv = document.getElementById("NameError");
  errorDiv.innerHTML = message;
}
