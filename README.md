# Open Cells - Movie App (TypeScript)

## Requisitos
- Node.js >= 18
- Vite

## Instalación
1. Copia el repo
2. Crea `.env` con:
   VITE_TMDB_API_KEY=TU_API_KEY_TMDB
3. Instala:
   npm install

## Desarrollo
npm run dev
Abre http://localhost:5173

## Build producción
npm run build

## Notas de implementación
- Data Manager: `movies-data-manager` es un componente sin UI que delega al `moviesStore` acciones sobre TMDB. El store emite eventos para notificar a componentes UI.
- UI components: `movies-list` (lista + búsqueda en vivo) y `movie-detail`.

- Tipado: todas las entidades principales (Movie, Genre) tipadas en TypeScript.
