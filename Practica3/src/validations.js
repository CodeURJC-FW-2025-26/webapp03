document.addEventListener('DOMContentLoaded', () => { //ejecuta el codigo cuando el html este cargado
  let form = document.querySelector('form[role="form"]'); //busca el formulario con role=form y lo guearda en otro form

  
  function setError(field, errorId, message) {
    field.classList.add('is-invalid');  //añade la clase is invalid para q salga con el estilo e bootstrap
    document.getElementById(errorId).textContent = message; //muestra el mensaje correspondiente
  }
  function clearError(field, errorId) {
    field.classList.remove('is-invalid'); //quita la clase is invalid
    document.getElementById(errorId).textContent = ''; //borra el texto de error
  }

  function ValidateName() {
    let input = document.getElementById('Name'); //pilla el nombre del documento
    let value = input.value.trim(); //le quita los espacios
    clearError(input, 'NameError');
    if (value.length < 3) {
      setError(input, 'NameError', 'El nombre debe tener al menos 3 caracteres.');
      return false; // if q devuelve false si tiene menos de 3 caractreres
    }
    return true;
  }

  function ValidateDish() {
    let select = document.getElementById('Dish'); //guarda el dish del formulario
    clearError(select, 'DishError');
    if (!select.value) {
      setError(select, 'DishError', 'Selecciona un tipo de plato.');
      return false; //si no hay dish seleccionado devueves false
    }
    return true;
  }


  form.addEventListener('submit', (e) => {
    let ok =
        ValidateName() &&
        ValidateDish();

    if (!ok) {
        e.preventDefault(); //se cancela el envio del formulario si hay algo mal
    }
    });
});
