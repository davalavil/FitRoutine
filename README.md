# FitRoutine Pro V3

Aplicación web para gestionar rutinas de ejercicios multideporte y multiusuario.

## Descripción

FitRoutine Pro permite a los usuarios crear y seguir programas de entrenamiento personalizados, registrar ejercicios, monitorizar su progreso a través de un calendario y analizar su rendimiento con gráficos. Está diseñado para ser flexible y adaptarse a diferentes deportes, con un enfoque inicial en Taekwondo y Fitness.

## Características (Planeadas/Implementadas)

*   [x] Interfaz basada en Pestañas (Dashboard, Ejercicios, Calendario, Programas, Análisis, Deportes)
*   [x] Diseño responsive con Tailwind CSS
*   [x] Modales para añadir/editar:
    *   [ ] Ejercicios
    *   [ ] Programas
    *   [ ] Sesiones
    *   [ ] Deportes
    *   [ ] Usuarios
*   [ ] Biblioteca de Ejercicios (con filtros y búsqueda)
*   [ ] Creación de Programas (X semanas, Y días)
*   [ ] Calendario interactivo para programar y ver sesiones
*   [ ] Checklist diario de ejercicios completados
*   [ ] Gráficos de análisis de rendimiento (Chart.js)
*   [ ] Soporte Multiusuario (cambio de usuario)
*   [ ] Soporte Multideporte (con configuración específica por deporte)
*   [ ] Persistencia de datos (Actualmente via `localStorage`, planeado backend)

## Configuración para Desarrollo

1.  Clona este repositorio: `git clone https://github.com/tu-usuario/fitroutine-pro.git`
2.  Navega al directorio: `cd fitroutine-pro`
3.  Abre el archivo `index.html` en tu navegador web.

*(Instrucciones adicionales si añades un build step o backend)*

## Estructura del Proyecto

*   `index.html`: Estructura principal de la aplicación.
*   `css/custom.css`: Estilos CSS personalizados adicionales a Tailwind.
*   `js/`: Contiene los archivos JavaScript:
    *   `app.js`: Lógica principal, inicialización y orquestación.
    *   `ui.js`: Funciones de manipulación del DOM y la interfaz de usuario.
    *   `api.js`: Funciones para la gestión de datos (actualmente `localStorage`).
    *   `charts.js`: Funciones para la inicialización y gestión de gráficos.
*   `assets/`: Recursos estáticos (imágenes, etc.).

## Próximos Pasos

*   Implementar completamente las funciones CRUD en `api.js` (para `localStorage`).
*   Desarrollar las funciones `render` en `ui.js` para mostrar dinámicamente los datos.
*   Conectar todos los botones y formularios en `app.js` a las funciones de `api.js` y `ui.js`.
*   Refinar la lógica del calendario y el checklist.
*   Diseñar e implementar la API del backend.
*   Reemplazar las llamadas a `localStorage` en `api.js` por llamadas `fetch` al backend.
