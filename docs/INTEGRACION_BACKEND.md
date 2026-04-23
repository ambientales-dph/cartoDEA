# Guía de Integración de Backend - CartoDEA v4.0

Este documento detalla los puntos de entrada (endpoints) y las credenciales necesarias para integrar las funcionalidades de esta aplicación en un entorno externo o bajo un paraguas de autenticación unificado.

---

## 1. Variables de Entorno y Credenciales

Para que el backend funcione correctamente, el entorno de ejecución debe contar con las siguientes claves:

### Firebase (Infraestructura y Sharing)
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: ID del proyecto en Firebase.
*   `NEXT_PUBLIC_FIREBASE_API_KEY`: API Key pública para el cliente.
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Dominio de autenticación.
*   `NEXT_PUBLIC_FIREBASE_APP_ID`: Identificador de la App.
*   `FIREBASE_SERVICE_ACCOUNT_KEY`: (Server Side) JSON de la cuenta de servicio para operaciones administrativas (admin-sdk).

### Google Earth Engine (Procesamiento Satelital)
*   `EE_AUTH_TYPE`: Método de conexión (`SERVICE_ACCOUNT` recomendado).
*   `EE_SERVICE_ACCOUNT_KEY`: JSON de la cuenta de servicio de Google Cloud con permisos de Earth Engine API.
*   `GOOGLE_GENAI_API_KEY`: API Key de Google AI (Gemini) utilizada por Genkit para el asistente Drax.

### Trello (Gestión de Proyectos)
*   `TRELLO_API_KEY`: Developer Key de Trello.
*   `TRELLO_API_TOKEN`: Token de acceso permanente de Trello.
*   `NEXT_PUBLIC_TRELLO_BOARD_ID_*`: IDs de los tableros permitidos (pueden ser múltiples con este prefijo).

---

## 2. Endpoints de API (Proxy)

Ubicados en `src/app/api/`, estos endpoints gestionan peticiones que requieren eludir restricciones de CORS o realizar transformaciones en el servidor.

| Ruta | Método | Descripción |
|:---|:---|:---|
| `/api/geoserver-proxy?url=[URL]` | GET | Proxy para peticiones WMS/WFS a servidores externos (como minfra.gba.gob.ar). |
| `/api/nominatim-proxy?q=[QUERY]` | GET | Búsqueda de direcciones vía OpenStreetMap Nominatim. |
| `/api/auth/signout` | GET | Limpieza de cookies de sesión y cierre de sesión. |

---

## 3. Server Actions (Lógica de Negocio)

Estas funciones se ejecutan en el servidor (`'use server'`) y pueden ser importadas directamente si la aplicación integradora es Next.js.

### Módulo Earth Engine (`src/ai/flows/gee-flow.ts`)
*   `authenticateWithGee()`: Valida la conexión con el motor de Google.
*   `getGeeTileLayer(input)`: Genera URLs de teselas para índices (NDVI, BSI, etc.).
*   `getGoesLayers(input)`: Recupera la secuencia de imágenes recientes del satélite GOES-19.
*   `getValuesForPoints(input)`: Obtiene valores de píxel para el Perfil Topográfico.
*   `getGoesStormCores(input)`: Vectoriza núcleos de tormenta basados en temperatura.

### Módulo Trello (`src/services/trello-actions.ts`)
*   `checkTrelloCredentials()`: Verifica la salud de la conexión.
*   `searchTrelloCards(query)`: Retorna lista de tarjetas para el buscador.

### Módulo Notas (`src/services/notes-service.ts`)
*   `getNotes()` / `saveNotes(content)`: Lectura/Escritura del archivo `notes.json` persistente en el repo.

---

## 4. Flujos de Inteligencia Artificial (Genkit)

El asistente **Drax** funciona a través de un flujo definido en `src/ai/flows/find-layer-flow.ts`:

*   **Flow**: `mapAssistantFlow`
*   **Función**: `chatWithMapAssistant(input)`
*   **Entrada**: Query del usuario + Estado actual de capas (disponibles/activas).
*   **Salida**: Respuesta conversacional + Intenciones de acción (añadir capa, hacer zoom, cambiar estilo).

---

## 5. Estrategia de Autenticación Unificada

Para integrar esta app bajo el "paraguas" de otra:
1.  **Shared Firestore**: Ambas apps deben apuntar al mismo `FIREBASE_PROJECT_ID`.
2.  **Identidad**: El componente `FirebaseClientProvider` en `layout.tsx` inicializa el SDK de Auth. Si la app padre ya está autenticada, el hook `useUser()` detectará automáticamente al usuario.
3.  **Seguridad**: Las reglas de Firestore en `backend.json` permiten lectura/escritura en la colección `sharedMaps`. Ajustar según sea necesario para colecciones de usuario específicas.
