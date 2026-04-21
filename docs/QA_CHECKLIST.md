# Checklist de Validación Pre-Producción - CartoDEA v4.0

Este documento contiene la batería de pruebas exhaustivas para validar la estabilidad de la plataforma antes del despliegue.

---

## 1. Núcleo del Mapa y Navegación
| ID | Funcionalidad | Procedimiento de Prueba | Resultado Esperado |
|:---|:---|:---|:---|
| 1.1 | Carga de Capas Base | Cambiar entre OSM, ESRI Satelital, Carto Light y "Sin Capa". | El fondo cambia instantáneamente sin errores de CORS. |
| 1.2 | Efectos de Capa Base | Ajustar Brillo, Contraste y Opacidad en el menú de la barra superior. | Los filtros CSS se aplican correctamente al canvas del mapa. |
| 1.3 | Bandas ESRI | Seleccionar "Banda Roja", "Verde" o "Falso Color" en el selector de base. | Se aplica el filtrado de canales por post-renderizado correctamente. |
| 1.4 | Búsqueda Nominatim | Buscar "La Plata, Buenos Aires" en el buscador central. | El mapa centra la vista y hace zoom al bounding box de la ciudad. |
| 1.5 | Zoom a Área | Activar la lupa de la barra superior y dibujar un rectángulo. | La vista se ajusta exactamente al área dibujada. |

## 2. Gestión de Capas (CRUD y Biblioteca)
| ID | Funcionalidad | Procedimiento de Prueba | Resultado Esperado |
|:---|:---|:---|:---|
| 2.1 | Importación Local | Cargar un .zip (Shapefile), un .kml y un .geojson simultáneamente. | Se crean capas independientes con colores aleatorios y estilos por defecto. |
| 2.2 | Catálogo DEAS | Buscar "Cuencas" en el catálogo y añadir "Cuencas_dph". | La capa se carga como WFS/WMS híbrido. Los atributos son consultables. |
| 2.3 | Biblioteca WFS | Conectar a IGN (predefinido) y añadir "Provincias". | Se listan las capas y se añaden al mapa con éxito. |
| 2.4 | Arrastrar y Soltar | Arrastrar una capa del fondo hacia arriba en la lista. | El Z-Index en el mapa se actualiza reflejando el nuevo orden. |
| 2.5 | Agrupamiento | Seleccionar 3 capas (Ctrl+Click) y tocar el botón de "Grupo" (<Group/>). | Se crea una carpeta. Al mover la carpeta, se mueven las 3 capas en el mapa. |
| 2.6 | Modo Reproductor | En un grupo, poner modo "Única" y tocar "Reproducir". | Las capas se alternan cíclicamente según la velocidad definida. |

## 3. Simbología y Etiquetado
| ID | Funcionalidad | Procedimiento de Prueba | Resultado Esperado |
|:---|:---|:---|:---|
| 3.1 | Simbología Graduada | En una capa de puntos/polígonos, aplicar Jenks sobre un campo numérico. | El mapa se colorea según los cortes estadísticos calculados. |
| 3.2 | Simbología por Categoría| Aplicar sobre un campo de texto (ej. "Nombre"). | Cada valor único recibe un color distinto de la rampa. |
| 3.3 | Etiquetado Dinámico | Configurar etiqueta con prefijo "Id: " + [CAMPO_ID] + Salto de línea. | Las etiquetas aparecen sobre las entidades respetando el formato. |
| 3.4 | Estilo GeoTIFF | Cargar un .tif local y aplicar rampa "Viridis" con rango manual. | El raster se tiñe dinámicamente mediante WebGL. |

## 4. Análisis Espacial (Geoprocesos)
| ID | Funcionalidad | Procedimiento de Prueba | Resultado Esperado |
|:---|:---|:---|:---|
| 4.1 | Recorte (Clip) | Recortar una capa de ríos (Línea) usando un polígono dibujado. | Se genera una nueva capa solo con los tramos dentro del polígono. |
| 4.2 | Diferencia (Erase) | Usar un buffer como máscara para borrar entidades de una capa base. | Las entidades se cortan sustrayendo el área de la máscara. |
| 4.3 | Buffer (Influencia) | Crear buffer de 500m sobre una selección de puntos. | Se generan polígonos circulares precisos alrededor de los puntos. |
| 4.4 | Envolvente Concava | Seleccionar puntos dispersos y calcular con concavidad sugerida. | Se genera un polígono que ajusta el contorno de los puntos. |
| 4.5 | Perfil Topográfico | Dibujar línea -> Seleccionar NASADEM + SMAP + GOES. | Se genera la gráfica sincronizada con 3 ejes (Elevación, Humedad, Temperatura). |
| 4.6 | Sincronización Perfil| Pasar el mouse por la gráfica del perfil. | Un marcador naranja se desplaza por la traza del mapa en tiempo real. |

## 5. Productos Satelitales y GEE
| ID | Funcionalidad | Procedimiento de Prueba | Resultado Esperado |
|:---|:---|:---|:---|
| 5.1 | Humedad SMAP | Generar capa SMAP con la nueva paleta (Rojo-Verde-Azul). | La capa se visualiza correctamente sin errores de banda 'soil_moisture'. |
| 5.2 | Detección de Núcleos | Seleccionar capa GOES -> Umbral -65°C -> Detectar. | Se crean polígonos de núcleos y una capa de centroides con metadatos de tiempo. |
| 5.3 | Seguimiento (Tracking)| Seleccionar centroides T1 y T2 -> Ejecutar seguimiento. | Se generan vectores de movimiento con velocidad y sentido calculados. |
| 5.4 | Coherencia | Analizar coherencia de la capa de seguimiento (Clustering). | Los vectores se colorean (Atípico/Coherente) y aparece el vector promedio móvil. |

## 6. Integraciones y Exportación
| ID | Funcionalidad | Procedimiento de Prueba | Resultado Esperado |
|:---|:---|:---|:---|
| 6.1 | Integración Trello | Buscar tarjeta -> Seleccionar una con código de proyecto (ej. "RSA063"). | La app abre la tarjeta y carga automáticamente las capas de Geoserver vinculadas. |
| 6.2 | Exportación SHP | Exportar capa de "Dibujos" a Shapefile. | Se descarga un .zip con .shp, .dbf, .shx y .prj válidos. |
| 6.3 | Compositor de Impresión| Configurar Título/Subtítulo -> Exportar PDF A4 Paisaje. | Se genera un documento con el mapa capturado, leyenda y títulos. |
| 6.4 | Compartir Mapa | Click en "Compartir" -> Copiar link -> Abrir en modo incógnito. | El mapa se carga con la misma vista y capas (WFS/GEE) que el original. |

---

## 7. Pruebas de Estrés y Flujos Combinados (Workflow Test)

### Escenario A: Análisis Hidrológico Completo
1. Buscar "Azul, Buenos Aires".
2. Cargar capa de "Cuencas" desde DEAS.
3. Seleccionar la cuenca local y extraerla a una nueva capa.
4. Generar Humedad SMAP para esa zona.
5. Dibujar un perfil que cruce la cuenca.
6. **Verificación:** ¿Los valores de humedad en el perfil coinciden visualmente con la capa GEE? ¿La tabla de estadísticas muestra el promedio ponderado del área?

### Escenario B: Monitoreo de Tormentas
1. Cargar secuencia de 6 imágenes GOES-19.
2. Activar reproducción para ver el desplazamiento de nubes.
3. Detectar núcleos en la imagen T-1 e imagen T-0.
4. Ejecutar Seguimiento entre ambas capas de centroides.
5. Aplicar Análisis de Coherencia sobre los vectores resultantes.
6. **Verificación:** ¿Se identifican correctamente los núcleos atípicos? ¿El vector promedio representa el movimiento general del sistema?

### Escenario C: Integración y Reporte
1. Buscar en Trello el proyecto "RSA".
2. Cargar las capas del proyecto detectado.
3. Realizar un Buffer de 1km a los ejes de canal.
4. Usar el Compositor de Impresión para poner nombre al proyecto.
5. Exportar a JPEG 300 DPI.
6. **Verificación:** ¿La imagen tiene alta resolución? ¿Se incluyen todas las capas cargadas desde Trello?

---
**Notas:**
- Si falla la sincronización del perfil (Punto 4.6), revisar el Z-Index de la capa `internal-analysis-profile-layer`.
- Si el Shapefile no abre en QGIS/ArcMap, revisar la proyección definida en el archivo `.prj`.
- SMAP requiere que el rango de fechas en GEE sea válido (datos disponibles hasta la fecha actual - 3 días aprox).
