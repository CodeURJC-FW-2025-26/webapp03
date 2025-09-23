# MAESTROS DE LA COCINA
### Descripción: 
Maestros de la cocina es una web con formato de catálogo de recetas.

### Integrantes 
- Miguel de Luis Ibáñez --- m.deluis.2024@alumnos.urjc.es --- mmddll8
- Hugo García Palomo --- h.garciap.2024@alumnos.urjc.es --- Hugo-56
- Lucas Román Jiménez --- l.roman.2024@alumnos.urjc.es --- Lucas-Roman-Jimenea

# Funcionalidad
## Entidades
Entidad principal: receta del plato a cocinar. 
Atributos de la entidad principal:
1. Nombre. (Ejemplo: "Tortilla de patatas")
2. Tipo de plato. (Ejemplo: "Primer plato")
3. Dificultad. (Ejemplo: "Fácil")
4. Duración. (Ejemplo: "30 minutos")
5. Descripción.
6. Lista de ingredientes.
7. Alérgenos.
8. Pasos de la preparación.
9. Imágenes del plato.

Entidad secundaria ligada a la principal: ingrediente. 
Atributos de la entidad secundaria: 
1. Nombre. (Ejemplo: "Patatas")
2. Alérgenos.
3. Precio aproximado del ingrediente.
4. Descripción. 
5. Imagen del ingrediente.

La relación entre la entidad principal y la secundaria se da ya que es necesaria una lista de ingredientes para realizar una receta.

## Funcionalidades para el usuario
El objetivo es incluir un buscador por nombre para encontrar recetas, además de filtros para buscar por tipo de plato, dificultad o duración. 

Además, se pretende que el usuario pueda poner valoraciones a las recetas, guardar recetas favoritas y añadir sus propias recetas.



