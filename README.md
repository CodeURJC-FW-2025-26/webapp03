# MAESTROS DE LA COCINA
### Descripción: 
Maestros de la cocina es una web con formato de catálogo de recetas.

### Integrantes 
- Miguel de Luis Ibáñez --- m.deluis.2024@alumnos.urjc.es --- mmddll8
- Hugo García Palomo --- h.garciap.2024@alumnos.urjc.es --- Hugo-56
- Lucas Román Jiménez --- l.roman.2024@alumnos.urjc.es --- Lucas-Roman-Jimenez

# Funcionalidad
## Entidades
Entidad principal: receta del plato a cocinar. `Recipe`

Atributos de la entidad principal:
1. Nombre. (Ejemplo: "Tortilla de patatas") `Name`
2. Tipo de plato. (Ejemplo: "Primer plato") `Dish: Starter/Side/Main/Dessert`
3. Dificultad. (Ejemplo: "Fácil") `Difficulty: Easy/Medium/Hard`
4. Duración. (Ejemplo: "30min") `Length: 5min/15min/30min/45min/1h/2h/3h/+3h`
5. Descripción. `Description`
6. Alérgenos. `Allergens: Gluten-Crustacean-Eggs-Fish-Peanuts-Soy-Dairy-Nuts-Celery-Mustard-Sesame-Sulfites-Lupin-Mollusk`
7. Pasos de la preparación. `Steps`
8. Imágenes del plato. `Images`

Entidad secundaria ligada a la principal: ingrediente. `Ingredients` 

Atributos de la entidad secundaria:
1. Nombre. (Ejemplo: "Patatas") `Name`
2. Alérgenos. `Allergens: Gluten-Crustacean-Eggs-Fish-Peanuts-Soy-Dairy-Nuts-Celery-Mustard-Sesame-Sulfites-Lupin-Mollusk`
3. Precio aproximado del ingrediente. `Price`
4. Descripción. `Description`
5. Imagen del ingrediente. `Image`

La relación entre la entidad principal y la secundaria se da ya que es necesaria una lista de ingredientes para realizar una receta.

## Funcionalidades para el usuario
El objetivo es incluir un buscador por nombre para encontrar recetas, además de filtros para buscar por:
- Tipo de plato. `Dish: Starter/Side/Main/Dessert`
- Dificultad. `Difficulty: Easy/Medium/Hard`
- Duración. `Length: 5min/15min/30min/45min/1h/2h/3h/+3h`

Además, se pretende que el usuario pueda añadir sus propias recetas.



