intrucciones de uso
TaskFlow

seras el due;o de un universo donde gestionaras tus tareas cada estrella es una tarea manejamos el color azul para tareas pendientes y verde para tareas completas, si decides puedes volverlas supernova y explotarlas, destrullendo esa tarea, juega y gestiona tus tareas.

Stack Base (requerido): Next · React · TypeScript · TailwindCSS
Herramientas y Librerías (opcionales/sugeridas): shadcn/ui · Framer Motion ·
Three.js · Bolt.new · v0 · Cursor · Antigravity · Jest + RTL ·

1. Listado de tareas con paginación
   funciona desde lib/api.ts y hooks/usetaskapi usamoos axios para manejo de las solicitudews

manejamos un local storage para evitar que el usuario no pueda acceder sin wifi 2. Crear tarea

3. Marcar como completada / pendiente

usamos post update con 2 segundos esperando por si el usuario decide cambiar el estado muchas veces no genere llamadas excesivas

4. Eliminar tarea
   confirmamos con otro modal que exige confirmacion, ademas al hacer alguna accion del crud muestra flag confirmando
5. Filtro local
   arriba a la derecha filtra las "estrellas" task

Requisitos técnicos

● hooks maneja toda la logica y lib consume la api con axions

● Los tipos de la API deben estar definidos en TypeScript. No usar any salvo que
esté justificado con un comentario.
● Al menos dos componentes reutilizables (por ejemplo <TodoItem>,
<EmptyState>, <LoadingWrapper>).
● El estado local debe reflejar correctamente las operaciones CRUD aunque la
API no persista los cambios.

talento@orquestia.io

ORQUESTIA

● El candidato elige la solución de estado (useState, Zustand, etc.) y la justifica
en el README.
● ESLint y Prettier configurados y sin errores.
● Commits descriptivos (mínimo un commit por funcionalidad, no un solo
commit con todo).
● Variables de entorno para la URL base de la API.
