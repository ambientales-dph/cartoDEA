// Archivo generado automáticamente con los estilos SLD adaptados para CartoDEA
// Total de estilos SLD procesados: 126

export interface SldRuleDefinition {
  title?: string;
  propertyName?: string;
  value?: string;
  strokeColor?: string;
  fillColor?: string;
}

export interface SldStyleItem {
  id: string;
  title: string;
  fileName: string;
  geomType: 'Polygon' | 'LineString' | 'Point' | 'Raster';
  strokeColor: string;
  rawStrokeColor: string;
  strokeWidth: number;
  strokeOpacity: number;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  fillColor: string;
  rawFillColor: string;
  fillOpacity: number;
  pointSize: number;
  wellKnownName: string;
  rulesCount: number;
  rules?: SldRuleDefinition[];
}

export const DEA_SLD_STYLES: SldStyleItem[] = [
  {
    "id": "Barrios_estilo",
    "title": "Barrios",
    "fileName": "Barrios_estilo.sld",
    "geomType": "Polygon",
    "strokeColor": "#000001",
    "rawStrokeColor": "#000001",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(3, 153, 161, 0.5)",
    "rawFillColor": "#0399a1",
    "fillOpacity": 0.5,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "Expropiacion_estilo",
    "title": "Expropiacion",
    "fileName": "Expropiacion_estilo.sld",
    "geomType": "LineString",
    "strokeColor": "#ffea1f",
    "rawStrokeColor": "#ffea1f",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "Lakes",
    "title": "Lakes",
    "fileName": "Lakes.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(51, 136, 255, 0.4)",
    "rawFillColor": "#3388ff",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "NamedPlaces",
    "title": "NamedPlaces",
    "fileName": "NamedPlaces.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(51, 136, 255, 0.4)",
    "rawFillColor": "#3388ff",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2,
    "rules": [
      {
        "title": "Ashton",
        "propertyName": "NAME",
        "value": "Ashton"
      },
      {
        "title": "Goose Island",
        "propertyName": "NAME",
        "value": "Goose Island"
      }
    ]
  },
  {
    "id": "OTBN_BSAS",
    "title": "OTBN BSAS",
    "fileName": "OTBN_BSAS.sld",
    "geomType": "Polygon",
    "strokeColor": "rgba(35, 35, 35, 0)",
    "rawStrokeColor": "#232323",
    "strokeWidth": 1,
    "strokeOpacity": 0,
    "lineStyle": "solid",
    "fillColor": "rgba(239, 9, 47, 0.4)",
    "rawFillColor": "#ef092f",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 3,
    "rules": [
      {
        "title": "I",
        "propertyName": "cat_cons",
        "value": "I",
        "strokeColor": "#232323",
        "fillColor": "#ef092f"
      },
      {
        "title": "II",
        "propertyName": "cat_cons",
        "value": "II",
        "strokeColor": "#232323",
        "fillColor": "#ff7f00"
      },
      {
        "title": "III",
        "propertyName": "cat_cons",
        "value": "III",
        "strokeColor": "#232323",
        "fillColor": "#33a02c"
      }
    ]
  },
  {
    "id": "Presa nueva_estilo",
    "title": "Presa nueva",
    "fileName": "Presa nueva_estilo.sld",
    "geomType": "LineString",
    "strokeColor": "#ba1419",
    "rawStrokeColor": "#ba1419",
    "strokeWidth": 3,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "Puntos_estilo",
    "title": "Puntos",
    "fileName": "Puntos_estilo.sld",
    "geomType": "Point",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(134, 14, 16, 1)",
    "rawFillColor": "#860e10",
    "fillOpacity": 1,
    "pointSize": 7,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "Vertedero_estilo",
    "title": "Vertedero",
    "fileName": "Vertedero_estilo.sld",
    "geomType": "LineString",
    "strokeColor": "#fb9a99",
    "rawStrokeColor": "#fb9a99",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "area_estudio",
    "title": "Area estudio",
    "fileName": "area_estudio.sld",
    "geomType": "Polygon",
    "strokeColor": "#e31a1c",
    "rawStrokeColor": "#e31a1c",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(255, 158, 23, 0)",
    "rawFillColor": "#ff9e17",
    "fillOpacity": 0,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "area_generica",
    "title": "Area generica",
    "fileName": "area_generica.sld",
    "geomType": "Polygon",
    "strokeColor": "#9c4b4b",
    "rawStrokeColor": "#9c4b4b",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(51, 136, 255, 0.4)",
    "rawFillColor": "#3388ff",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "area_influencia_25",
    "title": "Area influencia 25",
    "fileName": "area_influencia_25.sld",
    "geomType": "Polygon",
    "strokeColor": "#ffd901",
    "rawStrokeColor": "#ffd901",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(255, 217, 1, 0.4)",
    "rawFillColor": "#ffd901",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "brush://dense7",
    "rulesCount": 2,
    "rules": [
      {
        "title": "AID",
        "propertyName": "FolderPath",
        "value": "AID",
        "strokeColor": "#ffd901",
        "fillColor": "#ffd901"
      },
      {
        "title": "AII",
        "propertyName": "FolderPath",
        "value": "AII",
        "strokeColor": "#eb2dee"
      }
    ]
  },
  {
    "id": "area_influencia_directa",
    "title": "Area influencia directa",
    "fileName": "area_influencia_directa.sld",
    "geomType": "Polygon",
    "strokeColor": "#ffc801",
    "rawStrokeColor": "#ffc801",
    "strokeWidth": 5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(253, 255, 133, 0.4)",
    "rawFillColor": "#fdff85",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "areas_naturales_protegidas_provincia",
    "title": "Areas naturales protegidas provincia",
    "fileName": "areas_naturales_protegidas_provincia.sld",
    "geomType": "Polygon",
    "strokeColor": "#440154",
    "rawStrokeColor": "#440154",
    "strokeWidth": 0.8,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(58, 82, 139, 0.4)",
    "rawFillColor": "#3a528b",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 6,
    "rules": [
      {
        "title": "Refugio de Vida Silvestre",
        "propertyName": "cat_manejo",
        "value": "Refugio de Vida Silvestre",
        "strokeColor": "#440154"
      },
      {
        "title": "de Objetivo Definido",
        "propertyName": "cat_manejo",
        "value": "de Objetivo Definido",
        "strokeColor": "#232323",
        "fillColor": "#3a528b"
      },
      {
        "title": "de Uso Multiple",
        "propertyName": "cat_manejo",
        "value": "de Uso Multiple",
        "strokeColor": "#232323",
        "fillColor": "#20908d"
      },
      {
        "title": "Integral",
        "propertyName": "cat_manejo",
        "value": "Integral",
        "strokeColor": "#232323",
        "fillColor": "#5dc962"
      },
      {
        "title": "Parque Provincial",
        "propertyName": "cat_manejo",
        "value": "Parque Provincial",
        "strokeColor": "#232323",
        "fillColor": "#fde725"
      }
    ]
  },
  {
    "id": "avance_excavacion",
    "title": "Avance excavacion",
    "fileName": "avance_excavacion.sld",
    "geomType": "LineString",
    "strokeColor": "#4d4b4a",
    "rawStrokeColor": "#4d4b4a",
    "strokeWidth": 5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "burg",
    "title": "Burg",
    "fileName": "burg.sld",
    "geomType": "Point",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 20,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "calles_pavimento",
    "title": "Calles pavimento",
    "fileName": "calles_pavimento.sld",
    "geomType": "LineString",
    "strokeColor": "#0442b4",
    "rawStrokeColor": "#0442b4",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 4,
    "rules": [
      {
        "title": "ASFALTO",
        "propertyName": "pavimento",
        "value": "ASFALTO",
        "strokeColor": "#0442b4"
      },
      {
        "title": "HORMIGON",
        "propertyName": "pavimento",
        "value": "HORMIGON",
        "strokeColor": "#d20018"
      },
      {
        "title": "TIERRA",
        "propertyName": "pavimento",
        "value": "TIERRA",
        "strokeColor": "#f6c602"
      },
      {
        "propertyName": "tipo",
        "value": "AVENIDA"
      }
    ]
  },
  {
    "id": "canal_trapecial_estilo",
    "title": "Canal trapecial",
    "fileName": "canal_trapecial_estilo.sld",
    "geomType": "LineString",
    "strokeColor": "#00acff",
    "rawStrokeColor": "#00acff",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "canales_y_drenajes",
    "title": "Canales y drenajes",
    "fileName": "canales_y_drenajes.sld",
    "geomType": "LineString",
    "strokeColor": "#1f78b4",
    "rawStrokeColor": "#1f78b4",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "canalizacion_margenes",
    "title": "Canalizacion margenes",
    "fileName": "canalizacion_margenes.sld",
    "geomType": "LineString",
    "strokeColor": "#f27172",
    "rawStrokeColor": "#f27172",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "capitals",
    "title": "Capitals",
    "fileName": "capitals.sld",
    "geomType": "Point",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "catastro_minero_bsas",
    "title": "Catastro minero bsas",
    "fileName": "catastro_minero_bsas.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(51, 160, 44, 0.5)",
    "rawFillColor": "#33a02c",
    "fillOpacity": 0.5,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "conductos",
    "title": "Conductos",
    "fileName": "conductos.sld",
    "geomType": "LineString",
    "strokeColor": "#1688d4",
    "rawStrokeColor": "#1688d4",
    "strokeWidth": 1.2,
    "strokeOpacity": 1,
    "lineStyle": "dotted",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "conductos_ak",
    "title": "Conductos ak",
    "fileName": "conductos_ak.sld",
    "geomType": "LineString",
    "strokeColor": "#ff0101",
    "rawStrokeColor": "#ff0101",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2,
    "rules": [
      {
        "title": "CIRCULAR",
        "propertyName": "seccion",
        "value": "CIRCULAR",
        "strokeColor": "#ff0101"
      },
      {
        "title": "RECTANGULAR",
        "propertyName": "seccion",
        "value": "RECTANGULAR",
        "strokeColor": "#ff7801"
      }
    ]
  },
  {
    "id": "conductos_existentes",
    "title": "Conductos existentes",
    "fileName": "conductos_existentes.sld",
    "geomType": "LineString",
    "strokeColor": "#348b3e",
    "rawStrokeColor": "#348b3e",
    "strokeWidth": 1.2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "cota_altimetrica",
    "title": "Cota altimetrica",
    "fileName": "cota_altimetrica.sld",
    "geomType": "Point",
    "strokeColor": "#ff0101",
    "rawStrokeColor": "#ff0101",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(255, 255, 255, 1)",
    "rawFillColor": "#ffffff",
    "fillOpacity": 1,
    "pointSize": 7,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "cualca",
    "title": "Cualca",
    "fileName": "cualca.sld",
    "geomType": "Polygon",
    "strokeColor": "#af1616",
    "rawStrokeColor": "#af1616",
    "strokeWidth": 7,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(51, 136, 255, 0.4)",
    "rawFillColor": "#3388ff",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "cuenca_urbana",
    "title": "Cuenca urbana",
    "fileName": "cuenca_urbana.sld",
    "geomType": "LineString",
    "strokeColor": "#e41a1c",
    "rawStrokeColor": "#e41a1c",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "cuencas",
    "title": "Cuencas",
    "fileName": "cuencas.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(255, 255, 204, 0.4)",
    "rawFillColor": "#ffffcc",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 13,
    "rules": [
      {
        "title": "Cuenca del Arroyo del Medio",
        "propertyName": "Nombre",
        "value": "Cuenca del Arroyo del Medio",
        "strokeColor": "#000000",
        "fillColor": "#ffffcc"
      },
      {
        "title": "Cuenca del Río Areco",
        "propertyName": "Nombre",
        "value": "Cuenca del Río Areco",
        "strokeColor": "#000000",
        "fillColor": "#dff2c4"
      },
      {
        "title": "Cuenca del Río Arrecifes",
        "propertyName": "Nombre",
        "value": "Cuenca del Río Arrecifes",
        "strokeColor": "#000000",
        "fillColor": "#c0e6bc"
      },
      {
        "title": "Cuenca del Río Luján",
        "propertyName": "Nombre",
        "value": "Cuenca del Río Luján",
        "strokeColor": "#000000",
        "fillColor": "#a1dab4"
      },
      {
        "title": "Cuenca del Río Quequén Grande",
        "propertyName": "Nombre",
        "value": "Cuenca del Río Quequén Grande",
        "strokeColor": "#000000",
        "fillColor": "#81ceb9"
      },
      {
        "title": "Cuenca del Río Quequén Salado",
        "propertyName": "Nombre",
        "value": "Cuenca del Río Quequén Salado",
        "strokeColor": "#000000",
        "fillColor": "#61c2be"
      },
      {
        "title": "Cuenca del Río Reconquista",
        "propertyName": "Nombre",
        "value": "Cuenca del Río Reconquista",
        "strokeColor": "#000000",
        "fillColor": "#41b6c4"
      },
      {
        "title": "Cuenca del Río Samborombón",
        "propertyName": "Nombre",
        "value": "Cuenca del Río Samborombón",
        "strokeColor": "#000000",
        "fillColor": "#3aa3c0"
      },
      {
        "title": "Cuenca Matanza-Riachuelo",
        "propertyName": "Nombre",
        "value": "Cuenca Matanza-Riachuelo",
        "strokeColor": "#000000",
        "fillColor": "#3391bc"
      },
      {
        "title": "Cuenca Vértice Río de la Plata Inferior",
        "propertyName": "Nombre",
        "value": "Cuenca Vértice Río de la Plata Inferior",
        "strokeColor": "#000000",
        "fillColor": "#2c7fb8"
      },
      {
        "title": "Cuenca Vertiente Río de la Plata Media",
        "propertyName": "Nombre",
        "value": "Cuenca Vertiente Río de la Plata Media",
        "strokeColor": "#000000",
        "fillColor": "#2965ac"
      },
      {
        "title": "Cuenca Vertiente Río de la Plata Superior",
        "propertyName": "Nombre",
        "value": "Cuenca Vertiente Río de la Plata Superior",
        "strokeColor": "#000000",
        "fillColor": "#274da0"
      },
      {
        "title": "Nombre is ''",
        "propertyName": "Nombre",
        "strokeColor": "#000000",
        "fillColor": "#253494"
      }
    ]
  },
  {
    "id": "cuencas_ak",
    "title": "Cuencas ak",
    "fileName": "cuencas_ak.sld",
    "geomType": "Polygon",
    "strokeColor": "#1a679a",
    "rawStrokeColor": "#1a679a",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(114, 220, 255, 0.4)",
    "rawFillColor": "#72dcff",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "cuencas_pba_light",
    "title": "Cuencas pba light",
    "fileName": "cuencas_pba_light.sld",
    "geomType": "Polygon",
    "strokeColor": "#0b704b",
    "rawStrokeColor": "#0b704b",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(255, 158, 23, 0)",
    "rawFillColor": "#ff9e17",
    "fillOpacity": 0,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 3,
    "rules": [
      {
        "title": "Single symbol",
        "strokeColor": "#0b704b",
        "fillColor": "#ff9e17"
      },
      {
        "title": "Single symbol",
        "strokeColor": "#0b704b",
        "fillColor": "#ff9e17"
      }
    ]
  },
  {
    "id": "cuerpo_de_agua",
    "title": "Cuerpo de agua",
    "fileName": "cuerpo_de_agua.sld",
    "geomType": "Polygon",
    "strokeColor": "#2376ff",
    "rawStrokeColor": "#2376ff",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(90, 188, 227, 0.6)",
    "rawFillColor": "#5abce3",
    "fillOpacity": 0.6,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "curso_de_agua",
    "title": "Curso de agua",
    "fileName": "curso_de_agua.sld",
    "geomType": "LineString",
    "strokeColor": "#4bb4ff",
    "rawStrokeColor": "#4bb4ff",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "curva_de_nivel",
    "title": "Curva de nivel",
    "fileName": "curva_de_nivel.sld",
    "geomType": "LineString",
    "strokeColor": "#c9a590",
    "rawStrokeColor": "#c9a590",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "curvas_recurrencias",
    "title": "Curvas recurrencias",
    "fileName": "curvas_recurrencias.sld",
    "geomType": "Polygon",
    "strokeColor": "#009933",
    "rawStrokeColor": "#009933",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(0, 0, 0, 0)",
    "rawFillColor": "#000000",
    "fillOpacity": 0,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 9,
    "rules": [
      {
        "title": "APROBADO",
        "propertyName": "estado",
        "value": "APROBADO",
        "strokeColor": "#009933",
        "fillColor": "#000000"
      },
      {
        "title": "EN EJECUCION",
        "propertyName": "estado",
        "value": "EN EJECUCION",
        "strokeColor": "#003399",
        "fillColor": "#003399"
      },
      {
        "title": "TERMINADO",
        "propertyName": "estado",
        "value": "TERMINADO",
        "strokeColor": "#ff0000",
        "fillColor": "#ff0000"
      },
      {
        "title": "DESAPROBADO",
        "propertyName": "estado",
        "value": "DESAPROBADO",
        "strokeColor": "#cacaca",
        "fillColor": "#cacaca"
      },
      {
        "title": "PRESENTADO",
        "propertyName": "estado",
        "value": "PRESENTADO",
        "strokeColor": "#ffccff",
        "fillColor": "#000000"
      },
      {
        "title": "EN PROYECTO",
        "propertyName": "estado",
        "value": "EN PROYECTO",
        "strokeColor": "#f9ff33",
        "fillColor": "#000000"
      },
      {
        "title": "OBSERVADO",
        "propertyName": "estado",
        "value": "OBSERVADO",
        "strokeColor": "#ff9933",
        "fillColor": "#000000"
      },
      {
        "title": "estado is ''",
        "propertyName": "estado",
        "strokeColor": "#ffffff",
        "fillColor": "#000000"
      }
    ]
  },
  {
    "id": "default_generic",
    "title": "Default generic",
    "fileName": "default_generic.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(170, 170, 170, 0.4)",
    "rawFillColor": "#AAAAAA",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "square",
    "rulesCount": 4,
    "rules": [
      {
        "title": "Opaque Raster",
        "value": "true"
      },
      {
        "title": "Grey Polygon",
        "value": "2",
        "strokeColor": "#000000",
        "fillColor": "#AAAAAA"
      },
      {
        "title": "Blue Line",
        "value": "1",
        "strokeColor": "#0000FF"
      },
      {
        "title": "Red Square Point",
        "fillColor": "#FF0000"
      }
    ]
  },
  {
    "id": "default_line",
    "title": "Default line",
    "fileName": "default_line.sld",
    "geomType": "LineString",
    "strokeColor": "#0000FF",
    "rawStrokeColor": "#0000FF",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "default_line2",
    "title": "Default line2",
    "fileName": "default_line2.sld",
    "geomType": "Polygon",
    "strokeColor": "#319738",
    "rawStrokeColor": "#319738",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(51, 136, 255, 0.4)",
    "rawFillColor": "#3388ff",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "default_point",
    "title": "Default point",
    "fileName": "default_point.sld",
    "geomType": "Point",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(255, 0, 0, 1)",
    "rawFillColor": "#FF0000",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "square",
    "rulesCount": 1
  },
  {
    "id": "default_polygon",
    "title": "Default polygon",
    "fileName": "default_polygon.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(170, 170, 170, 0.4)",
    "rawFillColor": "#AAAAAA",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "dem_duppy",
    "title": "Dem duppy",
    "fileName": "dem_duppy.sld",
    "geomType": "Raster",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "distritos_minfra",
    "title": "Distritos minfra",
    "fileName": "distritos_minfra.sld",
    "geomType": "Polygon",
    "strokeColor": "#232323",
    "rawStrokeColor": "#232323",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(53, 72, 141, 0.4)",
    "rawFillColor": "#35488d",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 10,
    "rules": [
      {
        "title": "I",
        "propertyName": "dist_infra",
        "value": "I",
        "strokeColor": "#232323",
        "fillColor": "#35488d"
      },
      {
        "title": "II",
        "propertyName": "dist_infra",
        "value": "II",
        "strokeColor": "#232323",
        "fillColor": "#466be3"
      },
      {
        "title": "III",
        "propertyName": "dist_infra",
        "value": "III",
        "strokeColor": "#232323",
        "fillColor": "#28bceb"
      },
      {
        "title": "IV",
        "propertyName": "dist_infra",
        "value": "IV",
        "strokeColor": "#232323",
        "fillColor": "#32f298"
      },
      {
        "title": "IX",
        "propertyName": "dist_infra",
        "value": "IX",
        "strokeColor": "#232323",
        "fillColor": "#a4fc3c"
      },
      {
        "title": "V",
        "propertyName": "dist_infra",
        "value": "V",
        "strokeColor": "#232323",
        "fillColor": "#eecf3a"
      },
      {
        "title": "VI",
        "propertyName": "dist_infra",
        "value": "VI",
        "strokeColor": "#232323",
        "fillColor": "#fb7e21"
      },
      {
        "title": "VII",
        "propertyName": "dist_infra",
        "value": "VII",
        "strokeColor": "#232323",
        "fillColor": "#d02f05"
      },
      {
        "title": "VIII",
        "propertyName": "dist_infra",
        "value": "VIII",
        "strokeColor": "#232323",
        "fillColor": "#7a0403"
      }
    ]
  },
  {
    "id": "dominio_dem",
    "title": "Dominio dem",
    "fileName": "dominio_dem.sld",
    "geomType": "Polygon",
    "strokeColor": "#e138d6",
    "rawStrokeColor": "#e138d6",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(51, 136, 255, 0.4)",
    "rawFillColor": "#3388ff",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "edelap_red_alta_tension",
    "title": "Edelap red alta tension",
    "fileName": "edelap_red_alta_tension.sld",
    "geomType": "LineString",
    "strokeColor": "#e31a1c",
    "rawStrokeColor": "#e31a1c",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "edenor_red_alta_tension",
    "title": "Edenor red alta tension",
    "fileName": "edenor_red_alta_tension.sld",
    "geomType": "LineString",
    "strokeColor": "#0211b6",
    "rawStrokeColor": "#0211b6",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "edesur_red_alta_tension",
    "title": "Edesur red alta tension",
    "fileName": "edesur_red_alta_tension.sld",
    "geomType": "LineString",
    "strokeColor": "#ff7f00",
    "rawStrokeColor": "#ff7f00",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "educ_descentralizados",
    "title": "Educ descentralizados",
    "fileName": "educ_descentralizados.sld",
    "geomType": "Point",
    "strokeColor": "rgba(35, 35, 35, 0)",
    "rawStrokeColor": "#232323",
    "strokeWidth": 0.5,
    "strokeOpacity": 0,
    "lineStyle": "solid",
    "fillColor": "rgba(255, 77, 255, 1)",
    "rawFillColor": "#ff4dff",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2,
    "rules": [
      {
        "title": "Single symbol",
        "strokeColor": "#232323",
        "fillColor": "#ff4dff"
      },
      {
        "title": "Single symbol",
        "strokeColor": "#232323",
        "fillColor": "#ff4dff"
      }
    ]
  },
  {
    "id": "eje_canal",
    "title": "Eje canal",
    "fileName": "eje_canal.sld",
    "geomType": "LineString",
    "strokeColor": "#ffff00",
    "rawStrokeColor": "#ffff00",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "dashed",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "electrica_lineas_transporte",
    "title": "Electrica lineas transporte",
    "fileName": "electrica_lineas_transporte.sld",
    "geomType": "LineString",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "escuelas",
    "title": "Escuelas",
    "fileName": "escuelas.sld",
    "geomType": "Point",
    "strokeColor": "rgba(35, 35, 35, 0)",
    "rawStrokeColor": "#232323",
    "strokeWidth": 0.5,
    "strokeOpacity": 0,
    "lineStyle": "solid",
    "fillColor": "rgba(0, 136, 213, 1)",
    "rawFillColor": "#0088d5",
    "fillOpacity": 1,
    "pointSize": 3,
    "wellKnownName": "circle",
    "rulesCount": 4,
    "rules": [
      {
        "title": "Single symbol",
        "strokeColor": "#232323",
        "fillColor": "#0088d5"
      },
      {
        "title": "Single symbol",
        "strokeColor": "#232323",
        "fillColor": "#0088d5"
      },
      {
        "title": "Single symbol",
        "strokeColor": "#232323",
        "fillColor": "#0088d5"
      }
    ]
  },
  {
    "id": "est_meteo_inta_estilo",
    "title": "Est meteo inta",
    "fileName": "est_meteo_inta_estilo.sld",
    "geomType": "Point",
    "strokeColor": "#232323",
    "rawStrokeColor": "#232323",
    "strokeWidth": 0.75,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(51, 160, 44, 1)",
    "rawFillColor": "#33a02c",
    "fillOpacity": 1,
    "pointSize": 5,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "est_meteo_smn_estilo",
    "title": "Est meteo smn",
    "fileName": "est_meteo_smn_estilo.sld",
    "geomType": "Point",
    "strokeColor": "#232323",
    "rawStrokeColor": "#232323",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(227, 26, 28, 1)",
    "rawFillColor": "#e31a1c",
    "fillOpacity": 1,
    "pointSize": 5,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "estilo_AICA",
    "title": "AICA",
    "fileName": "estilo_AICA.sld",
    "geomType": "Polygon",
    "strokeColor": "#7e0d0d",
    "rawStrokeColor": "#7e0d0d",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(229, 182, 54, 0)",
    "rawFillColor": "#e5b636",
    "fillOpacity": 0,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "estilo_anp",
    "title": "Anp",
    "fileName": "estilo_anp.sld",
    "geomType": "Polygon",
    "strokeColor": "rgba(11, 86, 0, 0.9)",
    "rawStrokeColor": "#0b5600",
    "strokeWidth": 2,
    "strokeOpacity": 0.9,
    "lineStyle": "solid",
    "fillColor": "rgba(135, 216, 120, 0.9)",
    "rawFillColor": "#87d878",
    "fillOpacity": 0.9,
    "pointSize": 6,
    "wellKnownName": "slash",
    "rulesCount": 5,
    "rules": [
      {
        "title": "de Objetivo Definido",
        "propertyName": "cat_manejo",
        "value": "de Objetivo Definido",
        "strokeColor": "#0b5600",
        "fillColor": "#87d878"
      },
      {
        "title": "de Uso Multiple",
        "propertyName": "cat_manejo",
        "value": "de Uso Multiple",
        "strokeColor": "#4a1300",
        "fillColor": "#732b0a"
      },
      {
        "title": "Integral",
        "propertyName": "cat_manejo",
        "value": "Integral",
        "strokeColor": "#5a0000",
        "fillColor": "#8c1629"
      },
      {
        "title": "Parque Provincial",
        "propertyName": "cat_manejo",
        "value": "Parque Provincial",
        "strokeColor": "#8c1629"
      },
      {
        "title": "Refugio de Vida Silvestre",
        "propertyName": "cat_manejo",
        "value": "Refugio de Vida Silvestre",
        "strokeColor": "#87d878"
      }
    ]
  },
  {
    "id": "estilo_ap_nacion",
    "title": "Ap nacion",
    "fileName": "estilo_ap_nacion.sld",
    "geomType": "Polygon",
    "strokeColor": "#00b300",
    "rawStrokeColor": "#00b300",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(135, 216, 120, 0.4)",
    "rawFillColor": "#87d878",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "estilo_biosfera_bsas",
    "title": "Biosfera bsas",
    "fileName": "estilo_biosfera_bsas.sld",
    "geomType": "Polygon",
    "strokeColor": "#003802",
    "rawStrokeColor": "#003802",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(84, 157, 102, 0.4)",
    "rawFillColor": "#549d66",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "estilo_cuencas_pba",
    "title": "Cuencas pba",
    "fileName": "estilo_cuencas_pba.sld",
    "geomType": "Polygon",
    "strokeColor": "rgba(11, 112, 75, 0.15)",
    "rawStrokeColor": "#0b704b",
    "strokeWidth": 6,
    "strokeOpacity": 0.15,
    "lineStyle": "solid",
    "fillColor": "rgba(255, 158, 23, 0)",
    "rawFillColor": "#ff9e17",
    "fillOpacity": 0,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 3,
    "rules": [
      {
        "title": "Single symbol",
        "strokeColor": "#0b704b",
        "fillColor": "#ff9e17"
      },
      {
        "title": "Single symbol",
        "strokeColor": "#0b704b",
        "fillColor": "#ff9e17"
      }
    ]
  },
  {
    "id": "estilo_ramsar_bsas",
    "title": "Ramsar bsas",
    "fileName": "estilo_ramsar_bsas.sld",
    "geomType": "Polygon",
    "strokeColor": "#435a00",
    "rawStrokeColor": "#435a00",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(190, 207, 80, 0.4)",
    "rawFillColor": "#becf50",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "estructura_indiferenciada",
    "title": "Estructura indiferenciada",
    "fileName": "estructura_indiferenciada.sld",
    "geomType": "LineString",
    "strokeColor": "#e57636",
    "rawStrokeColor": "#e57636",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "estructura_punto",
    "title": "Estructura punto",
    "fileName": "estructura_punto.sld",
    "geomType": "Point",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(254, 0, 212, 1)",
    "rawFillColor": "#fe00d4",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "freatimetros",
    "title": "Freatimetros",
    "fileName": "freatimetros.sld",
    "geomType": "Point",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 14,
    "wellKnownName": "circle",
    "rulesCount": 5,
    "rules": [
      {
        "title": "Agua Dulce",
        "propertyName": "conduct",
        "value": "0"
      },
      {
        "title": "Agua Levemente Salobre",
        "propertyName": "conduct",
        "value": "1500"
      },
      {
        "title": "Agua Salobre",
        "propertyName": "conduct",
        "value": "2250"
      },
      {
        "title": "Agua Salada",
        "propertyName": "conduct",
        "value": "15000"
      }
    ]
  },
  {
    "id": "gasoducto",
    "title": "Gasoducto",
    "fileName": "gasoducto.sld",
    "geomType": "LineString",
    "strokeColor": "#4d4b4a",
    "rawStrokeColor": "#4d4b4a",
    "strokeWidth": 7,
    "strokeOpacity": 1,
    "lineStyle": "dashed",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "gasoductos_estilo",
    "title": "Gasoductos",
    "fileName": "gasoductos_estilo.sld",
    "geomType": "LineString",
    "strokeColor": "#ff7f00",
    "rawStrokeColor": "#ff7f00",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "giant_polygon",
    "title": "Giant polygon",
    "fileName": "giant_polygon.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(51, 136, 255, 0.4)",
    "rawFillColor": "#3388ff",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "grass_poly",
    "title": "Grass poly",
    "fileName": "grass_poly.sld",
    "geomType": "Polygon",
    "strokeColor": "#FF0000",
    "rawStrokeColor": "#FF0000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(51, 136, 255, 0.4)",
    "rawFillColor": "#3388ff",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "green",
    "title": "Green",
    "fileName": "green.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(102, 255, 102, 0.4)",
    "rawFillColor": "#66FF66",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "habilitado_recintos",
    "title": "Habilitado recintos",
    "fileName": "habilitado_recintos.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(0, 113, 8, 0.4)",
    "rawFillColor": "#007108",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "hidrografia",
    "title": "Hidrografia",
    "fileName": "hidrografia.sld",
    "geomType": "LineString",
    "strokeColor": "#0f8cdf",
    "rawStrokeColor": "#0f8cdf",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 4,
    "rules": [
      {
        "title": "Rios",
        "propertyName": "ESCALA",
        "value": "1",
        "strokeColor": "#0f8cdf"
      },
      {
        "title": "Arroyos",
        "propertyName": "ESCALA",
        "value": "2",
        "strokeColor": "#93cbff"
      },
      {
        "title": "Canales, zanjas, acequias",
        "propertyName": "ESCALA",
        "value": "3",
        "strokeColor": "#b0c9d7"
      }
    ]
  },
  {
    "id": "humedales",
    "title": "Humedales",
    "fileName": "humedales.sld",
    "geomType": "Polygon",
    "strokeColor": "#1fd534",
    "rawStrokeColor": "#1fd534",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(1, 208, 255, 0.4)",
    "rawFillColor": "#01d0ff",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "humedales_estilo",
    "title": "Humedales",
    "fileName": "humedales_estilo.sld",
    "geomType": "Polygon",
    "strokeColor": "rgba(35, 35, 35, 0)",
    "rawStrokeColor": "#232323",
    "strokeWidth": 1,
    "strokeOpacity": 0,
    "lineStyle": "solid",
    "fillColor": "rgba(160, 171, 95, 0.4)",
    "rawFillColor": "#a0ab5f",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 20,
    "rules": [
      {
        "title": "5aI",
        "propertyName": "sispai_num",
        "value": "5aI",
        "strokeColor": "#232323",
        "fillColor": "#a0ab5f"
      },
      {
        "title": "7I",
        "propertyName": "sispai_num",
        "value": "7I",
        "strokeColor": "#232323",
        "fillColor": "#8add81"
      },
      {
        "title": "8aI",
        "propertyName": "sispai_num",
        "value": "8aI",
        "strokeColor": "#232323",
        "fillColor": "#e2e08d"
      },
      {
        "title": "8aII",
        "propertyName": "sispai_num",
        "value": "8aII",
        "strokeColor": "#232323",
        "fillColor": "#9ed9ad"
      },
      {
        "title": "8aIII",
        "propertyName": "sispai_num",
        "value": "8aIII",
        "strokeColor": "#232323",
        "fillColor": "#83c981"
      },
      {
        "title": "8aIV",
        "propertyName": "sispai_num",
        "value": "8aIV",
        "strokeColor": "#232323",
        "fillColor": "#59a25d"
      },
      {
        "title": "8aIX",
        "propertyName": "sispai_num",
        "value": "8aIX",
        "strokeColor": "#232323",
        "fillColor": "#919c72"
      },
      {
        "title": "8aV",
        "propertyName": "sispai_num",
        "value": "8aV",
        "strokeColor": "#232323",
        "fillColor": "#52d7ff"
      },
      {
        "title": "8aVI",
        "propertyName": "sispai_num",
        "value": "8aVI",
        "strokeColor": "#232323",
        "fillColor": "#68a6fc"
      },
      {
        "title": "8aVII",
        "propertyName": "sispai_num",
        "value": "8aVII",
        "strokeColor": "#232323",
        "fillColor": "#c1dda2"
      },
      {
        "title": "8aVIII",
        "propertyName": "sispai_num",
        "value": "8aVIII",
        "strokeColor": "#232323",
        "fillColor": "#7b9e5c"
      },
      {
        "title": "8bI",
        "propertyName": "sispai_num",
        "value": "8bI",
        "strokeColor": "#232323",
        "fillColor": "#729986"
      },
      {
        "title": "8bII",
        "propertyName": "sispai_num",
        "value": "8bII",
        "strokeColor": "#232323",
        "fillColor": "#a5e0dc"
      },
      {
        "title": "8bIII",
        "propertyName": "sispai_num",
        "value": "8bIII",
        "strokeColor": "#232323",
        "fillColor": "#59987b"
      },
      {
        "title": "9aI",
        "propertyName": "sispai_num",
        "value": "9aI",
        "strokeColor": "#232323",
        "fillColor": "#b1c28e"
      },
      {
        "title": "9aII",
        "propertyName": "sispai_num",
        "value": "9aII",
        "strokeColor": "#232323",
        "fillColor": "#82ab7f"
      },
      {
        "title": "9aIII",
        "propertyName": "sispai_num",
        "value": "9aIII",
        "strokeColor": "#232323",
        "fillColor": "#9edcff"
      },
      {
        "title": "9aIV",
        "propertyName": "sispai_num",
        "value": "9aIV",
        "strokeColor": "#232323",
        "fillColor": "#aacb8f"
      },
      {
        "title": "sispai_num is ''",
        "propertyName": "sispai_num",
        "strokeColor": "#232323",
        "fillColor": "#6ecbec"
      }
    ]
  },
  {
    "id": "influencia_directa",
    "title": "Influencia directa",
    "fileName": "influencia_directa.sld",
    "geomType": "Polygon",
    "strokeColor": "#eae01f",
    "rawStrokeColor": "#eae01f",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(234, 224, 31, 0.35)",
    "rawFillColor": "#eae01f",
    "fillOpacity": 0.35,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "influencia_indirecta",
    "title": "Influencia indirecta",
    "fileName": "influencia_indirecta.sld",
    "geomType": "Polygon",
    "strokeColor": "#4aaa1e",
    "rawStrokeColor": "#4aaa1e",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(74, 170, 30, 0.35)",
    "rawFillColor": "#4aaa1e",
    "fillOpacity": 0.35,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "isobatas",
    "title": "Isobatas",
    "fileName": "isobatas.sld",
    "geomType": "LineString",
    "strokeColor": "#00aeef",
    "rawStrokeColor": "#00aeef",
    "strokeWidth": 0.6,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "laguna_lasmulitas",
    "title": "Laguna lasmulitas",
    "fileName": "laguna_lasmulitas.sld",
    "geomType": "Polygon",
    "strokeColor": "#1b578b",
    "rawStrokeColor": "#1b578b",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(153, 215, 243, 0.4)",
    "rawFillColor": "#99d7f3",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "lidar",
    "title": "Lidar",
    "fileName": "lidar.sld",
    "geomType": "Polygon",
    "strokeColor": "#232323",
    "rawStrokeColor": "#232323",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(51, 136, 255, 0.4)",
    "rawFillColor": "#3388ff",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "limite_recintos",
    "title": "Limite recintos",
    "fileName": "limite_recintos.sld",
    "geomType": "LineString",
    "strokeColor": "#ff7f00",
    "rawStrokeColor": "#ff7f00",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2,
    "rules": [
      {
        "title": "Interior",
        "propertyName": "RefName",
        "value": "INT",
        "strokeColor": "#ff7f00"
      },
      {
        "title": "Exterior",
        "propertyName": "RefName",
        "value": "EXT",
        "strokeColor": "#00ffff"
      }
    ]
  },
  {
    "id": "limite_recintos_200",
    "title": "Limite recintos 200",
    "fileName": "limite_recintos_200.sld",
    "geomType": "LineString",
    "strokeColor": "#ff7f00",
    "rawStrokeColor": "#ff7f00",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "limite_recintos_4_Ib",
    "title": "Limite recintos 4 Ib",
    "fileName": "limite_recintos_4_Ib.sld",
    "geomType": "LineString",
    "strokeColor": "#ff7f00",
    "rawStrokeColor": "#ff7f00",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2,
    "rules": [
      {
        "title": "200 m.",
        "propertyName": "RefName",
        "value": "200 m.",
        "strokeColor": "#ff7f00"
      },
      {
        "title": "1000 m.",
        "propertyName": "RefName",
        "value": "1000 m.",
        "strokeColor": "#00ffff"
      }
    ]
  },
  {
    "id": "limite_recintos_800",
    "title": "Limite recintos 800",
    "fileName": "limite_recintos_800.sld",
    "geomType": "LineString",
    "strokeColor": "#00ffff",
    "rawStrokeColor": "#00ffff",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "mancha_de_inundacion",
    "title": "Mancha de inundacion",
    "fileName": "mancha_de_inundacion.sld",
    "geomType": "LineString",
    "strokeColor": "#d7e6f4",
    "rawStrokeColor": "#d7e6f4",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 16,
    "rules": [
      {
        "title": "0.1 - 0.2",
        "propertyName": "cota",
        "value": "0.10000000000000001",
        "strokeColor": "#d7e6f4"
      },
      {
        "title": "0.2 - 0.3",
        "propertyName": "cota",
        "value": "0.20000000000000001",
        "strokeColor": "#c6dbef"
      },
      {
        "title": "0.3 - 0.4",
        "propertyName": "cota",
        "value": "0.29999999999999999",
        "strokeColor": "#b8cee5"
      },
      {
        "title": "0.4 - 0.5",
        "propertyName": "cota",
        "value": "0.40000000000000002",
        "strokeColor": "#a9c1db"
      },
      {
        "title": "0.5 - 0.6",
        "propertyName": "cota",
        "value": "0.5",
        "strokeColor": "#9ab4d1"
      },
      {
        "title": "0.6 - 0.7",
        "propertyName": "cota",
        "value": "0.59999999999999998",
        "strokeColor": "#8ca7c7"
      },
      {
        "title": "0.7 - 0.8",
        "propertyName": "cota",
        "value": "0.69999999999999996",
        "strokeColor": "#7d99bc"
      },
      {
        "title": "0.8 - 0.9",
        "propertyName": "cota",
        "value": "0.80000000000000004",
        "strokeColor": "#6e8cb2"
      },
      {
        "title": "0.9 - 1",
        "propertyName": "cota",
        "value": "0.90000000000000002",
        "strokeColor": "#607fa8"
      },
      {
        "title": "1 - 1.1",
        "propertyName": "cota",
        "value": "1",
        "strokeColor": "#51729e"
      },
      {
        "title": "1.1 - 1.2",
        "propertyName": "cota",
        "value": "1.10000000000000009",
        "strokeColor": "#426594"
      },
      {
        "title": "1.2 - 1.3",
        "propertyName": "cota",
        "value": "1.19999999999999996",
        "strokeColor": "#34578a"
      },
      {
        "title": "1.3 - 1.4",
        "propertyName": "cota",
        "value": "1.30000000000000004",
        "strokeColor": "#254a7f"
      },
      {
        "title": "1.4 - 1.5",
        "propertyName": "cota",
        "value": "1.39999999999999991",
        "strokeColor": "#163d75"
      },
      {
        "title": "1.5 - 1.6",
        "propertyName": "cota",
        "value": "1.5",
        "strokeColor": "#08306b"
      }
    ]
  },
  {
    "id": "mancha_de_inundacion_generica",
    "title": "Mancha de inundacion generica",
    "fileName": "mancha_de_inundacion_generica.sld",
    "geomType": "LineString",
    "strokeColor": "#1f78b4",
    "rawStrokeColor": "#1f78b4",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "manchas_presa",
    "title": "Manchas presa",
    "fileName": "manchas_presa.sld",
    "geomType": "Polygon",
    "strokeColor": "rgba(35, 35, 35, 0)",
    "rawStrokeColor": "#232323",
    "strokeWidth": 0.5,
    "strokeOpacity": 0,
    "lineStyle": "solid",
    "fillColor": "rgba(8, 48, 107, 0.4)",
    "rawFillColor": "#08306b",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 11,
    "rules": [
      {
        "title": "REFNAME is ''",
        "propertyName": "REFNAME",
        "strokeColor": "#232323",
        "fillColor": "#08306b"
      },
      {
        "title": "R2",
        "propertyName": "REFNAME",
        "value": "R2",
        "strokeColor": "#232323",
        "fillColor": "##172933"
      },
      {
        "title": "R5",
        "propertyName": "REFNAME",
        "value": "R5",
        "strokeColor": "#232323",
        "fillColor": "#233e4d"
      },
      {
        "title": "R10",
        "propertyName": "REFNAME",
        "value": "R10",
        "strokeColor": "#232323",
        "fillColor": "#334766"
      },
      {
        "title": "R25",
        "propertyName": "REFNAME",
        "value": "R25",
        "strokeColor": "#232323",
        "fillColor": "#3f5980"
      },
      {
        "title": "R50",
        "propertyName": "REFNAME",
        "value": "R50",
        "strokeColor": "#232323",
        "fillColor": "#4c6b99"
      },
      {
        "title": "R100",
        "propertyName": "REFNAME",
        "value": "R100",
        "strokeColor": "#232323",
        "fillColor": "#597db3"
      },
      {
        "title": "R200",
        "propertyName": "REFNAME",
        "value": "R200",
        "strokeColor": "#232323",
        "fillColor": "#658fcc"
      },
      {
        "title": "R500",
        "propertyName": "REFNAME",
        "value": "R500",
        "strokeColor": "#232323",
        "fillColor": "#72a1e6"
      },
      {
        "title": "CMP",
        "propertyName": "REFNAME",
        "value": "CMP",
        "strokeColor": "#232323",
        "fillColor": "#7fb2ff"
      }
    ]
  },
  {
    "id": "manchas_zapiola_tif",
    "title": "Manchas zapiola tif",
    "fileName": "manchas_zapiola_tif.sld",
    "geomType": "Raster",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "muestreo_agua_superficial",
    "title": "Muestreo agua superficial",
    "fileName": "muestreo_agua_superficial.sld",
    "geomType": "Point",
    "strokeColor": "rgba(0, 0, 0, 0)",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 0,
    "lineStyle": "solid",
    "fillColor": "rgba(255, 255, 255, 0)",
    "rawFillColor": "#ffffff",
    "fillOpacity": 0,
    "pointSize": 11,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "muestreo_suelos",
    "title": "Muestreo suelos",
    "fileName": "muestreo_suelos.sld",
    "geomType": "Point",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 14,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "oleoductos_estilo",
    "title": "Oleoductos",
    "fileName": "oleoductos_estilo.sld",
    "geomType": "LineString",
    "strokeColor": "#33a02c",
    "rawStrokeColor": "#33a02c",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "parcelas",
    "title": "Parcelas",
    "fileName": "parcelas.sld",
    "geomType": "Polygon",
    "strokeColor": "#808080",
    "rawStrokeColor": "#808080",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(232, 113, 141, 0)",
    "rawFillColor": "#e8718d",
    "fillOpacity": 0,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "partido",
    "title": "Partido",
    "fileName": "partido.sld",
    "geomType": "Polygon",
    "strokeColor": "#232323",
    "rawStrokeColor": "#232323",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "dotted",
    "fillColor": "rgba(114, 155, 111, 0)",
    "rawFillColor": "#729b6f",
    "fillOpacity": 0,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "pavimento_calle_brown",
    "title": "Pavimento calle brown",
    "fileName": "pavimento_calle_brown.sld",
    "geomType": "LineString",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "perfiles_estilo",
    "title": "Perfiles",
    "fileName": "perfiles_estilo.sld",
    "geomType": "LineString",
    "strokeColor": "#fee500",
    "rawStrokeColor": "#fee500",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "perfiles_gris",
    "title": "Perfiles gris",
    "fileName": "perfiles_gris.sld",
    "geomType": "LineString",
    "strokeColor": "#a8acae",
    "rawStrokeColor": "#a8acae",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "dashed",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "perfiles_rojo",
    "title": "Perfiles rojo",
    "fileName": "perfiles_rojo.sld",
    "geomType": "LineString",
    "strokeColor": "#ff0000",
    "rawStrokeColor": "#ff0000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "dashed",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "planicie_de_inundacion",
    "title": "Planicie de inundacion",
    "fileName": "planicie_de_inundacion.sld",
    "geomType": "Polygon",
    "strokeColor": "#7d7d7d",
    "rawStrokeColor": "#7d7d7d",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(171, 230, 227, 0.4)",
    "rawFillColor": "#abe6e3",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "poi",
    "title": "Poi",
    "fileName": "poi.sld",
    "geomType": "Point",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(255, 0, 0, 1)",
    "rawFillColor": "#FF0000",
    "fillOpacity": 1,
    "pointSize": 11,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "pois_agustoni",
    "title": "Pois agustoni",
    "fileName": "pois_agustoni.sld",
    "geomType": "Point",
    "strokeColor": "#e31a1c",
    "rawStrokeColor": "#e31a1c",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(255, 255, 255, 1)",
    "rawFillColor": "#ffffff",
    "fillOpacity": 1,
    "pointSize": 11,
    "wellKnownName": "circle",
    "rulesCount": 4,
    "rules": [
      {
        "title": "CENTROS DE SALUD",
        "propertyName": "tipo",
        "value": "CENTROS DE SALUD",
        "strokeColor": "#e31a1c",
        "fillColor": "#ffffff"
      },
      {
        "title": "ESTABLECMIENTOS EDUCATIVOS",
        "propertyName": "tipo",
        "value": "ESTABLECMIENTOS EDUCATIVOS",
        "strokeColor": "#232323",
        "fillColor": "#0000ff"
      },
      {
        "title": "tipo is ''",
        "propertyName": "tipo",
        "strokeColor": "#232323",
        "fillColor": "#1039ed"
      }
    ]
  },
  {
    "id": "poliductos_estilo",
    "title": "Poliductos",
    "fileName": "poliductos_estilo.sld",
    "geomType": "LineString",
    "strokeColor": "#a93331",
    "rawStrokeColor": "#a93331",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "poligonos_obras",
    "title": "Poligonos obras",
    "fileName": "poligonos_obras.sld",
    "geomType": "Polygon",
    "strokeColor": "#232323",
    "rawStrokeColor": "#232323",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(229, 229, 0, 0.4)",
    "rawFillColor": "#e5e500",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 5,
    "rules": [
      {
        "title": "estado is ''",
        "propertyName": "estado",
        "strokeColor": "#232323",
        "fillColor": "#e5e500"
      },
      {
        "title": "estado is 'Proyecto'",
        "propertyName": "estado",
        "value": "Proyecto",
        "strokeColor": "#232323",
        "fillColor": "#ff6600"
      },
      {
        "title": "estado is 'En obra'",
        "propertyName": "estado",
        "value": "En obra",
        "strokeColor": "#232323",
        "fillColor": "#0088d5"
      },
      {
        "title": "estado is 'Licitada'",
        "propertyName": "estado",
        "value": "Licitada",
        "strokeColor": "#232323",
        "fillColor": "#ce55e9"
      }
    ]
  },
  {
    "id": "poly_landmarks",
    "title": "Poly landmarks",
    "fileName": "poly_landmarks.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(51, 136, 255, 0.4)",
    "rawFillColor": "#3388ff",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 4,
    "rules": [
      {
        "propertyName": "CFCC",
        "value": "D82"
      },
      {
        "propertyName": "CFCC",
        "value": "H11"
      },
      {
        "propertyName": "CFCC",
        "value": "D31"
      }
    ]
  },
  {
    "id": "pophatch",
    "title": "Pophatch",
    "fileName": "pophatch.sld",
    "geomType": "Polygon",
    "strokeColor": "0xAAAAAA",
    "rawStrokeColor": "0xAAAAAA",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(51, 136, 255, 0.4)",
    "rawFillColor": "#3388ff",
    "fillOpacity": 0.4,
    "pointSize": 16,
    "wellKnownName": "shape://slash",
    "rulesCount": 4,
    "rules": [
      {
        "title": "&lt; 2M",
        "propertyName": "PERSONS",
        "value": "2000000",
        "strokeColor": "0xAAAAAA"
      },
      {
        "title": "2M - 4M",
        "propertyName": "PERSONS",
        "value": "2000000",
        "strokeColor": "0xAAAAAA"
      },
      {
        "title": "&gt; 4M",
        "propertyName": "PERSONS",
        "value": "4000000",
        "strokeColor": "0xAAAAAA"
      },
      {
        "title": "Boundary"
      }
    ]
  },
  {
    "id": "popshade",
    "title": "Popshade",
    "fileName": "popshade.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(77, 255, 77, 0.7)",
    "rawFillColor": "#4DFF4D",
    "fillOpacity": 0.7,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 4,
    "rules": [
      {
        "title": "&lt; 2M",
        "propertyName": "PERSONS",
        "value": "2000000",
        "fillColor": "#4DFF4D"
      },
      {
        "title": "2M - 4M",
        "propertyName": "PERSONS",
        "value": "2000000",
        "fillColor": "#FF4D4D"
      },
      {
        "title": "&gt; 4M",
        "propertyName": "PERSONS",
        "value": "4000000",
        "fillColor": "#4D4DFF"
      },
      {
        "title": "Boundary"
      }
    ]
  },
  {
    "id": "presa",
    "title": "Presa",
    "fileName": "presa.sld",
    "geomType": "LineString",
    "strokeColor": "#e15989",
    "rawStrokeColor": "#e15989",
    "strokeWidth": 4,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "propanoductos_estilo",
    "title": "Propanoductos",
    "fileName": "propanoductos_estilo.sld",
    "geomType": "LineString",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "puente",
    "title": "Puente",
    "fileName": "puente.sld",
    "geomType": "LineString",
    "strokeColor": "#ff7b00",
    "rawStrokeColor": "#ff7b00",
    "strokeWidth": 3,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "radio_censal",
    "title": "Radio censal",
    "fileName": "radio_censal.sld",
    "geomType": "Polygon",
    "strokeColor": "#232323",
    "rawStrokeColor": "#232323",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(51, 136, 255, 0.4)",
    "rawFillColor": "#3388ff",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "rain",
    "title": "Rain",
    "fileName": "rain.sld",
    "geomType": "Raster",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "raster",
    "title": "Raster",
    "fileName": "raster.sld",
    "geomType": "Raster",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "recintos",
    "title": "Recintos",
    "fileName": "recintos.sld",
    "geomType": "Polygon",
    "strokeColor": "#009933",
    "rawStrokeColor": "#009933",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(0, 0, 0, 0)",
    "rawFillColor": "#000000",
    "fillOpacity": 0,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 9,
    "rules": [
      {
        "title": "APROBADO",
        "propertyName": "estado",
        "value": "APROBADO",
        "strokeColor": "#009933",
        "fillColor": "#000000"
      },
      {
        "title": "EN EJECUCION",
        "propertyName": "estado",
        "value": "EN EJECUCION",
        "strokeColor": "#003399",
        "fillColor": "#003399"
      },
      {
        "title": "TERMINADO",
        "propertyName": "estado",
        "value": "TERMINADO",
        "strokeColor": "#ff0000",
        "fillColor": "#ff0000"
      },
      {
        "title": "DESAPROBADO",
        "propertyName": "estado",
        "value": "DESAPROBADO",
        "strokeColor": "#cacaca",
        "fillColor": "#cacaca"
      },
      {
        "title": "PRESENTADO",
        "propertyName": "estado",
        "value": "PRESENTADO",
        "strokeColor": "#ffccff",
        "fillColor": "#000000"
      },
      {
        "title": "EN PROYECTO",
        "propertyName": "estado",
        "value": "EN PROYECTO",
        "strokeColor": "#f9ff33",
        "fillColor": "#000000"
      },
      {
        "title": "OBSERVADO",
        "propertyName": "estado",
        "value": "OBSERVADO",
        "strokeColor": "#ff9933",
        "fillColor": "#000000"
      },
      {
        "title": "S/D",
        "propertyName": "estado",
        "strokeColor": "#000000",
        "fillColor": "#000000"
      }
    ]
  },
  {
    "id": "remoteOws",
    "title": "RemoteOws",
    "fileName": "remoteOws.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(51, 136, 255, 0.4)",
    "rawFillColor": "#3388ff",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "remoteTasmania",
    "title": "RemoteTasmania",
    "fileName": "remoteTasmania.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(51, 136, 255, 0.4)",
    "rawFillColor": "#3388ff",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 2
  },
  {
    "id": "restriccion_externa",
    "title": "Restriccion externa",
    "fileName": "restriccion_externa.sld",
    "geomType": "LineString",
    "strokeColor": "#ffe23d",
    "rawStrokeColor": "#ffe23d",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "restriccion_interna",
    "title": "Restriccion interna",
    "fileName": "restriccion_interna.sld",
    "geomType": "LineString",
    "strokeColor": "#ef3463",
    "rawStrokeColor": "#ef3463",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "restricted",
    "title": "Restricted",
    "fileName": "restricted.sld",
    "geomType": "Polygon",
    "strokeColor": "#AA0000",
    "rawStrokeColor": "#AA0000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(255, 0, 0, 0.7)",
    "rawFillColor": "#FF0000",
    "fillOpacity": 0.7,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "salud",
    "title": "Salud",
    "fileName": "salud.sld",
    "geomType": "Point",
    "strokeColor": "rgba(35, 35, 35, 0)",
    "rawStrokeColor": "#232323",
    "strokeWidth": 0.5,
    "strokeOpacity": 0,
    "lineStyle": "solid",
    "fillColor": "rgba(230, 0, 0, 1)",
    "rawFillColor": "#e60000",
    "fillOpacity": 1,
    "pointSize": 3,
    "wellKnownName": "circle",
    "rulesCount": 3,
    "rules": [
      {
        "title": "Single symbol",
        "strokeColor": "#232323",
        "fillColor": "#e60000"
      },
      {
        "title": "Single symbol",
        "strokeColor": "#232323",
        "fillColor": "#e60000"
      },
      {
        "title": "Single symbol",
        "strokeColor": "#232323",
        "fillColor": "#e60000"
      }
    ]
  },
  {
    "id": "simpleRoads",
    "title": "SimpleRoads",
    "fileName": "simpleRoads.sld",
    "geomType": "LineString",
    "strokeColor": "#3388ff",
    "rawStrokeColor": "#3388ff",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "simple_streams",
    "title": "Simple streams",
    "fileName": "simple_streams.sld",
    "geomType": "LineString",
    "strokeColor": "#3388ff",
    "rawStrokeColor": "#3388ff",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "sistema_paisajes_humedales",
    "title": "Sistema paisajes humedales",
    "fileName": "sistema_paisajes_humedales.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(255, 255, 204, 0.4)",
    "rawFillColor": "#ffffcc",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 19,
    "rules": [
      {
        "title": "5aI",
        "propertyName": "sispai_num",
        "value": "5aI",
        "fillColor": "#ffffcc"
      },
      {
        "title": "7I",
        "propertyName": "sispai_num",
        "value": "7I",
        "fillColor": "#e9f7c7"
      },
      {
        "title": "8aI",
        "propertyName": "sispai_num",
        "value": "8aI",
        "fillColor": "#d3eec1"
      },
      {
        "title": "8aII",
        "propertyName": "sispai_num",
        "value": "8aII",
        "fillColor": "#bde5bb"
      },
      {
        "title": "8aIII",
        "propertyName": "sispai_num",
        "value": "8aIII",
        "fillColor": "#a7ddb6"
      },
      {
        "title": "8aIV",
        "propertyName": "sispai_num",
        "value": "8aIV",
        "fillColor": "#90d4b7"
      },
      {
        "title": "8aIX",
        "propertyName": "sispai_num",
        "value": "8aIX",
        "fillColor": "#79cbbb"
      },
      {
        "title": "8aV",
        "propertyName": "sispai_num",
        "value": "8aV",
        "fillColor": "#63c3bf"
      },
      {
        "title": "8aVI",
        "propertyName": "sispai_num",
        "value": "8aVI",
        "fillColor": "#4cbac2"
      },
      {
        "title": "8aVII",
        "propertyName": "sispai_num",
        "value": "8aVII",
        "fillColor": "#3eb0c3"
      },
      {
        "title": "8aVIII",
        "propertyName": "sispai_num",
        "value": "8aVIII",
        "fillColor": "#39a3c0"
      },
      {
        "title": "8bI",
        "propertyName": "sispai_num",
        "value": "8bI",
        "fillColor": "#3496bd"
      },
      {
        "title": "8bII",
        "propertyName": "sispai_num",
        "value": "8bII",
        "fillColor": "#2f89ba"
      },
      {
        "title": "8bIII",
        "propertyName": "sispai_num",
        "value": "8bIII",
        "fillColor": "#2b7bb6"
      },
      {
        "title": "9aI",
        "propertyName": "sispai_num",
        "value": "9aI",
        "fillColor": "#2a69ae"
      },
      {
        "title": "9aII",
        "propertyName": "sispai_num",
        "value": "9aII",
        "fillColor": "#2857a5"
      },
      {
        "title": "9aIII",
        "propertyName": "sispai_num",
        "value": "9aIII",
        "fillColor": "#26459d"
      },
      {
        "title": "9aIV",
        "propertyName": "sispai_num",
        "value": "9aIV",
        "fillColor": "#253494"
      }
    ]
  },
  {
    "id": "sub_cuenca_urbana",
    "title": "Sub cuenca urbana",
    "fileName": "sub_cuenca_urbana.sld",
    "geomType": "LineString",
    "strokeColor": "#e4751c",
    "rawStrokeColor": "#e4751c",
    "strokeWidth": 0.8,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "suelos",
    "title": "Suelos",
    "fileName": "suelos.sld",
    "geomType": "Polygon",
    "strokeColor": "rgba(35, 35, 35, 0)",
    "rawStrokeColor": "#232323",
    "strokeWidth": 1,
    "strokeOpacity": 0,
    "lineStyle": "solid",
    "fillColor": "rgba(45, 203, 93, 0.4)",
    "rawFillColor": "#2dcb5d",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 96,
    "rules": [
      {
        "title": "Acuisalid tipico",
        "propertyName": "T1",
        "value": "Acuisalid tipico",
        "strokeColor": "#232323",
        "fillColor": "#2dcb5d"
      },
      {
        "title": "Acuisalide tipico",
        "propertyName": "T1",
        "value": "Acuisalide tipico",
        "strokeColor": "#232323",
        "fillColor": "#6fd4b2"
      },
      {
        "title": "Albacualf vertico",
        "propertyName": "T1",
        "value": "Albacualf vertico",
        "strokeColor": "#232323",
        "fillColor": "#e9bf78"
      },
      {
        "title": "Argiacuol tipico",
        "propertyName": "T1",
        "value": "Argiacuol tipico",
        "strokeColor": "#232323",
        "fillColor": "#7f49cc"
      },
      {
        "title": "Argiacuol tipìco",
        "propertyName": "T1",
        "value": "Argiacuol tipìco",
        "strokeColor": "#232323",
        "fillColor": "#75e9d2"
      },
      {
        "title": "Argiacuol vertico",
        "propertyName": "T1",
        "value": "Argiacuol vertico",
        "strokeColor": "#232323",
        "fillColor": "#6589cc"
      },
      {
        "title": "Argialbol argiacuico",
        "propertyName": "T1",
        "value": "Argialbol argiacuico",
        "strokeColor": "#232323",
        "fillColor": "#cd7d69"
      },
      {
        "title": "Argialbol tipico",
        "propertyName": "T1",
        "value": "Argialbol tipico",
        "strokeColor": "#232323",
        "fillColor": "#565acc"
      },
      {
        "title": "Argiudol abruptico",
        "propertyName": "T1",
        "value": "Argiudol abruptico",
        "strokeColor": "#232323",
        "fillColor": "#ad7ad0"
      },
      {
        "title": "Argiudol acuico",
        "propertyName": "T1",
        "value": "Argiudol acuico",
        "strokeColor": "#232323",
        "fillColor": "#bacf43"
      },
      {
        "title": "Argiudol litico",
        "propertyName": "T1",
        "value": "Argiudol litico",
        "strokeColor": "#232323",
        "fillColor": "#cb7fd8"
      },
      {
        "title": "Argiudol paquico",
        "propertyName": "T1",
        "value": "Argiudol paquico",
        "strokeColor": "#232323",
        "fillColor": "#3dbdd1"
      },
      {
        "title": "Argiudol tipico",
        "propertyName": "T1",
        "value": "Argiudol tipico",
        "strokeColor": "#232323",
        "fillColor": "#f05586"
      },
      {
        "title": "Argiudol tipico erosianado",
        "propertyName": "T1",
        "value": "Argiudol tipico erosianado",
        "strokeColor": "#232323",
        "fillColor": "#f05586"
      },
      {
        "title": "Argiudol tipico inclinada",
        "propertyName": "T1",
        "value": "Argiudol tipico inclinada",
        "strokeColor": "#232323",
        "fillColor": "#66c996"
      },
      {
        "title": "Argiudol tipico moderada erosi",
        "propertyName": "T1",
        "value": "Argiudol tipico moderada erosi",
        "strokeColor": "#232323",
        "fillColor": "#17cb29"
      },
      {
        "title": "Argiudol tipico severa erosion",
        "propertyName": "T1",
        "value": "Argiudol tipico severa erosion",
        "strokeColor": "#232323",
        "fillColor": "#26ccc4"
      },
      {
        "title": "Argiudol vertico",
        "propertyName": "T1",
        "value": "Argiudol vertico",
        "strokeColor": "#232323",
        "fillColor": "#d9159e"
      },
      {
        "title": "Argiudol vertico ligera erosio",
        "propertyName": "T1",
        "value": "Argiudol vertico ligera erosio",
        "strokeColor": "#232323",
        "fillColor": "#5967df"
      },
      {
        "title": "Argiudol vertico moderada eros",
        "propertyName": "T1",
        "value": "Argiudol vertico moderada eros",
        "strokeColor": "#232323",
        "fillColor": "#3a29d4"
      },
      {
        "title": "Argiudol vertico severa erosio",
        "propertyName": "T1",
        "value": "Argiudol vertico severa erosio",
        "strokeColor": "#232323",
        "fillColor": "#d7d883"
      },
      {
        "title": "Argiustol acuico",
        "propertyName": "T1",
        "value": "Argiustol acuico",
        "strokeColor": "#232323",
        "fillColor": "#1fd069"
      },
      {
        "title": "Argiustol petrocalcico",
        "propertyName": "T1",
        "value": "Argiustol petrocalcico",
        "strokeColor": "#232323",
        "fillColor": "#cc5f89"
      },
      {
        "title": "Argiustol tipico",
        "propertyName": "T1",
        "value": "Argiustol tipico",
        "strokeColor": "#232323",
        "fillColor": "#cc5c9b"
      },
      {
        "title": "Calciustol petrocalcico",
        "propertyName": "T1",
        "value": "Calciustol petrocalcico",
        "strokeColor": "#232323",
        "fillColor": "#95db2b"
      },
      {
        "title": "Cuarzipsament tipico",
        "propertyName": "T1",
        "value": "Cuarzipsament tipico",
        "strokeColor": "#232323",
        "fillColor": "#42ee13"
      },
      {
        "title": "Cuarzipsament ustico",
        "propertyName": "T1",
        "value": "Cuarzipsament ustico",
        "strokeColor": "#232323",
        "fillColor": "#42ee13"
      },
      {
        "title": "Distrudert acuico",
        "propertyName": "T1",
        "value": "Distrudert acuico",
        "strokeColor": "#232323",
        "fillColor": "#6399e4"
      },
      {
        "title": "Duracuol natrico",
        "propertyName": "T1",
        "value": "Duracuol natrico",
        "strokeColor": "#232323",
        "fillColor": "#ca5620"
      },
      {
        "title": "Endoacuol litico",
        "propertyName": "T1",
        "value": "Endoacuol litico",
        "strokeColor": "#232323",
        "fillColor": "#e315cb"
      },
      {
        "title": "Epiacuol tipico",
        "propertyName": "T1",
        "value": "Epiacuol tipico",
        "strokeColor": "#232323",
        "fillColor": "#26c9b3"
      },
      {
        "title": "Halacuept aerico",
        "propertyName": "T1",
        "value": "Halacuept aerico",
        "strokeColor": "#232323",
        "fillColor": "#1fd8e5"
      },
      {
        "title": "Haplacuol tipico",
        "propertyName": "T1",
        "value": "Haplacuol tipico",
        "strokeColor": "#232323",
        "fillColor": "#5db1cf"
      },
      {
        "title": "Haplocalcid tipico",
        "propertyName": "T1",
        "value": "Haplocalcid tipico",
        "strokeColor": "#232323",
        "fillColor": "#729dcb"
      },
      {
        "title": "Hapludert tipico",
        "propertyName": "T1",
        "value": "Hapludert tipico",
        "strokeColor": "#232323",
        "fillColor": "#5cca82"
      },
      {
        "title": "Hapludol acuico",
        "propertyName": "T1",
        "value": "Hapludol acuico",
        "strokeColor": "#232323",
        "fillColor": "#d263dc"
      },
      {
        "title": "Hapludol cumulico",
        "propertyName": "T1",
        "value": "Hapludol cumulico",
        "strokeColor": "#232323",
        "fillColor": "#d6d056"
      },
      {
        "title": "Hapludol entico",
        "propertyName": "T1",
        "value": "Hapludol entico",
        "strokeColor": "#232323",
        "fillColor": "#37b1cf"
      },
      {
        "title": "Hapludol fluventico",
        "propertyName": "T1",
        "value": "Hapludol fluventico",
        "strokeColor": "#232323",
        "fillColor": "#7daecd"
      },
      {
        "title": "Hapludol litico",
        "propertyName": "T1",
        "value": "Hapludol litico",
        "strokeColor": "#232323",
        "fillColor": "#aed365"
      },
      {
        "title": "Hapludol tapto argico",
        "propertyName": "T1",
        "value": "Hapludol tapto argico",
        "strokeColor": "#232323",
        "fillColor": "#e4847d"
      },
      {
        "title": "Hapludol tapto natrico",
        "propertyName": "T1",
        "value": "Hapludol tapto natrico",
        "strokeColor": "#232323",
        "fillColor": "#e757cf"
      },
      {
        "title": "Hapludol tipico",
        "propertyName": "T1",
        "value": "Hapludol tipico",
        "strokeColor": "#232323",
        "fillColor": "#a110d6"
      },
      {
        "title": "Hapludol vertico",
        "propertyName": "T1",
        "value": "Hapludol vertico",
        "strokeColor": "#232323",
        "fillColor": "#638bef"
      },
      {
        "title": "Haplustol acuico",
        "propertyName": "T1",
        "value": "Haplustol acuico",
        "strokeColor": "#232323",
        "fillColor": "#87cb39"
      },
      {
        "title": "Haplustol aridico",
        "propertyName": "T1",
        "value": "Haplustol aridico",
        "strokeColor": "#232323",
        "fillColor": "#e8888f"
      },
      {
        "title": "Haplustol cumulico",
        "propertyName": "T1",
        "value": "Haplustol cumulico",
        "strokeColor": "#232323",
        "fillColor": "#e08696"
      },
      {
        "title": "Haplustol entico",
        "propertyName": "T1",
        "value": "Haplustol entico",
        "strokeColor": "#232323",
        "fillColor": "#425de6"
      },
      {
        "title": "Haplustol entico (sodico)",
        "propertyName": "T1",
        "value": "Haplustol entico (sodico)",
        "strokeColor": "#232323",
        "fillColor": "#cd580e"
      },
      {
        "title": "Haplustol fluventico",
        "propertyName": "T1",
        "value": "Haplustol fluventico",
        "strokeColor": "#232323",
        "fillColor": "#f071b0"
      },
      {
        "title": "Haplustol litico",
        "propertyName": "T1",
        "value": "Haplustol litico",
        "strokeColor": "#232323",
        "fillColor": "#e52e5c"
      },
      {
        "title": "Haplustol paquico",
        "propertyName": "T1",
        "value": "Haplustol paquico",
        "strokeColor": "#232323",
        "fillColor": "#e52e5c"
      },
      {
        "title": "Haplustol petrocalcico",
        "propertyName": "T1",
        "value": "Haplustol petrocalcico",
        "strokeColor": "#232323",
        "fillColor": "#c87f73"
      },
      {
        "title": "Haplustol tipico",
        "propertyName": "T1",
        "value": "Haplustol tipico",
        "strokeColor": "#232323",
        "fillColor": "#d4ae2f"
      },
      {
        "title": "Haplustol udortentico",
        "propertyName": "T1",
        "value": "Haplustol udortentico",
        "strokeColor": "#232323",
        "fillColor": "#c89d39"
      },
      {
        "title": "Lagunas",
        "propertyName": "T1",
        "value": "Lagunas",
        "strokeColor": "#232323",
        "fillColor": "#4fe973"
      },
      {
        "title": "Mar",
        "propertyName": "T1",
        "value": "Mar",
        "strokeColor": "#232323",
        "fillColor": "#863bdc"
      },
      {
        "title": "Natracualf litico",
        "propertyName": "T1",
        "value": "Natracualf litico",
        "strokeColor": "#232323",
        "fillColor": "#dc17ae"
      },
      {
        "title": "Natracualf molico",
        "propertyName": "T1",
        "value": "Natracualf molico",
        "strokeColor": "#232323",
        "fillColor": "#e92a80"
      },
      {
        "title": "Natracualf tipico",
        "propertyName": "T1",
        "value": "Natracualf tipico",
        "strokeColor": "#232323",
        "fillColor": "#59dab8"
      },
      {
        "title": "Natracuert tipico",
        "propertyName": "T1",
        "value": "Natracuert tipico",
        "strokeColor": "#232323",
        "fillColor": "#e8987e"
      },
      {
        "title": "Natracuol durico",
        "propertyName": "T1",
        "value": "Natracuol durico",
        "strokeColor": "#232323",
        "fillColor": "#ebc18a"
      },
      {
        "title": "Natracuol tipico",
        "propertyName": "T1",
        "value": "Natracuol tipico",
        "strokeColor": "#232323",
        "fillColor": "#a5d27e"
      },
      {
        "title": "Natralbol tipico",
        "propertyName": "T1",
        "value": "Natralbol tipico",
        "strokeColor": "#232323",
        "fillColor": "#a5d27e"
      },
      {
        "title": "Natrargid tipico",
        "propertyName": "T1",
        "value": "Natrargid tipico",
        "strokeColor": "#232323",
        "fillColor": "#10df82"
      },
      {
        "title": "Natrudol petrocalcico",
        "propertyName": "T1",
        "value": "Natrudol petrocalcico",
        "strokeColor": "#232323",
        "fillColor": "#b9d372"
      },
      {
        "title": "Natrudol tipico",
        "propertyName": "T1",
        "value": "Natrudol tipico",
        "strokeColor": "#232323",
        "fillColor": "#e644de"
      },
      {
        "title": "Natrustalfe t¡pico",
        "propertyName": "T1",
        "value": "Natrustalfe t¡pico",
        "strokeColor": "#232323",
        "fillColor": "#5cdf16"
      },
      {
        "title": "Natrustol tipico",
        "propertyName": "T1",
        "value": "Natrustol tipico",
        "strokeColor": "#232323",
        "fillColor": "#39ea1a"
      },
      {
        "title": "Paleoudol acuico",
        "propertyName": "T1",
        "value": "Paleoudol acuico",
        "strokeColor": "#232323",
        "fillColor": "#348bd2"
      },
      {
        "title": "Paleoudol petrocalcico",
        "propertyName": "T1",
        "value": "Paleoudol petrocalcico",
        "strokeColor": "#232323",
        "fillColor": "#d37e38"
      },
      {
        "title": "Paleoudol tipico",
        "propertyName": "T1",
        "value": "Paleoudol tipico",
        "strokeColor": "#232323",
        "fillColor": "#0ccc2c"
      },
      {
        "title": "Paleustol petrocalcico",
        "propertyName": "T1",
        "value": "Paleustol petrocalcico",
        "strokeColor": "#232323",
        "fillColor": "#7be137"
      },
      {
        "title": "Pelludert tipico",
        "propertyName": "T1",
        "value": "Pelludert tipico",
        "strokeColor": "#232323",
        "fillColor": "#b257df"
      },
      {
        "title": "Petrocalcid tipico",
        "propertyName": "T1",
        "value": "Petrocalcid tipico",
        "strokeColor": "#232323",
        "fillColor": "#839cf0"
      },
      {
        "title": "roca",
        "propertyName": "T1",
        "value": "roca",
        "strokeColor": "#232323",
        "fillColor": "#ccbb24"
      },
      {
        "title": "Roca",
        "propertyName": "T1",
        "value": "Roca",
        "strokeColor": "#232323",
        "fillColor": "#3a0ddd"
      },
      {
        "title": "Salina",
        "propertyName": "T1",
        "value": "Salina",
        "strokeColor": "#232323",
        "fillColor": "#d46fd6"
      },
      {
        "title": "Torripsament tipico",
        "propertyName": "T1",
        "value": "Torripsament tipico",
        "strokeColor": "#232323",
        "fillColor": "#d0a374"
      },
      {
        "title": "Torripsament ustico",
        "propertyName": "T1",
        "value": "Torripsament ustico",
        "strokeColor": "#232323",
        "fillColor": "#52ee15"
      },
      {
        "title": "Torripsamente t¡pico",
        "propertyName": "T1",
        "value": "Torripsamente t¡pico",
        "strokeColor": "#232323",
        "fillColor": "#a770d6"
      },
      {
        "title": "Udipsament tipico",
        "propertyName": "T1",
        "value": "Udipsament tipico",
        "strokeColor": "#232323",
        "fillColor": "#88e180"
      },
      {
        "title": "Udipsamente tipico",
        "propertyName": "T1",
        "value": "Udipsamente tipico",
        "strokeColor": "#232323",
        "fillColor": "#ab25cc"
      },
      {
        "title": "Ustifluvent acuico",
        "propertyName": "T1",
        "value": "Ustifluvent acuico",
        "strokeColor": "#232323",
        "fillColor": "#4be850"
      },
      {
        "title": "Ustifluvent tipico",
        "propertyName": "T1",
        "value": "Ustifluvent tipico",
        "strokeColor": "#232323",
        "fillColor": "#6c2be4"
      },
      {
        "title": "Ustifluvente  acuico",
        "propertyName": "T1",
        "value": "Ustifluvente  acuico",
        "strokeColor": "#232323",
        "fillColor": "#d8e16f"
      },
      {
        "title": "Ustifluvente t¡pico",
        "propertyName": "T1",
        "value": "Ustifluvente t¡pico",
        "strokeColor": "#232323",
        "fillColor": "#d20d27"
      },
      {
        "title": "Ustifluvente tipico",
        "propertyName": "T1",
        "value": "Ustifluvente tipico",
        "strokeColor": "#232323",
        "fillColor": "#3ec994"
      },
      {
        "title": "Ustipsament tipico",
        "propertyName": "T1",
        "value": "Ustipsament tipico",
        "strokeColor": "#232323",
        "fillColor": "#da4ba6"
      },
      {
        "title": "Ustortent litico",
        "propertyName": "T1",
        "value": "Ustortent litico",
        "strokeColor": "#232323",
        "fillColor": "#ccbd75"
      },
      {
        "title": "Ustortent tipico",
        "propertyName": "T1",
        "value": "Ustortent tipico",
        "strokeColor": "#232323",
        "fillColor": "#7260d4"
      },
      {
        "title": "Ustortente tipico",
        "propertyName": "T1",
        "value": "Ustortente tipico",
        "strokeColor": "#232323",
        "fillColor": "#ea3232"
      },
      {
        "title": "x",
        "propertyName": "T1",
        "value": "x",
        "strokeColor": "#232323",
        "fillColor": "#77ea73"
      },
      {
        "title": "T1 is ''",
        "propertyName": "T1",
        "strokeColor": "#232323",
        "fillColor": "#bcdd45"
      }
    ]
  },
  {
    "id": "suelos_hidromorficos",
    "title": "Suelos hidromorficos",
    "fileName": "suelos_hidromorficos.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(100, 147, 110, 0.4)",
    "rawFillColor": "#64936e",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "talud_terminado",
    "title": "Talud terminado",
    "fileName": "talud_terminado.sld",
    "geomType": "LineString",
    "strokeColor": "#3758ff",
    "rawStrokeColor": "#3758ff",
    "strokeWidth": 5,
    "strokeOpacity": 1,
    "lineStyle": "dotted",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "tiger_roads",
    "title": "Tiger roads",
    "fileName": "tiger_roads.sld",
    "geomType": "LineString",
    "strokeColor": "#3388ff",
    "rawStrokeColor": "#3388ff",
    "strokeWidth": 2,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 4
  },
  {
    "id": "tramos_salado",
    "title": "Tramos salado",
    "fileName": "tramos_salado.sld",
    "geomType": "LineString",
    "strokeColor": "#ea0d4c",
    "rawStrokeColor": "#ea0d4c",
    "strokeWidth": 3,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 17,
    "rules": [
      {
        "title": "Tramo I",
        "propertyName": "nombre",
        "value": "Tramo I",
        "strokeColor": "#ea0d4c"
      },
      {
        "title": "Tramo II",
        "propertyName": "nombre",
        "value": "Tramo II",
        "strokeColor": "#ce55e9"
      },
      {
        "title": "Tramo III",
        "propertyName": "nombre",
        "value": "Tramo III",
        "strokeColor": "#0ec81e"
      },
      {
        "title": "Tramo IV-Etapa IA-AI",
        "propertyName": "nombre",
        "value": "Tramo IV-Etapa IA-AI",
        "strokeColor": "#ffccff"
      },
      {
        "title": "Tramo IV-Etapa IA-AII",
        "propertyName": "nombre",
        "value": "Tramo IV-Etapa IA-AII",
        "strokeColor": "#ff00ff"
      },
      {
        "title": "Tramo IV-Etapa IA-AIII",
        "propertyName": "nombre",
        "value": "Tramo IV-Etapa IA-AIII",
        "strokeColor": "#660066"
      },
      {
        "title": "Tramo IV-Etapa IB-Lote 1",
        "propertyName": "nombre",
        "value": "Tramo IV-Etapa IB-Lote 1",
        "strokeColor": "#ccf3ff"
      },
      {
        "title": "Tramo IV-Etapa IB-Lote 2",
        "propertyName": "nombre",
        "value": "Tramo IV-Etapa IB-Lote 2",
        "strokeColor": "#99e7ff"
      },
      {
        "title": "Tramo IV-Etapa IB-Lote 3",
        "propertyName": "nombre",
        "value": "Tramo IV-Etapa IB-Lote 3",
        "strokeColor": "#1ac9ff"
      },
      {
        "title": "Tramo IV-Etapa IB-Lote 4",
        "propertyName": "nombre",
        "value": "Tramo IV-Etapa IB-Lote 4",
        "strokeColor": "#009ccc"
      },
      {
        "title": "Tramo IV-Etapa II",
        "propertyName": "nombre",
        "value": "Tramo IV-Etapa II",
        "strokeColor": "#ff9900"
      },
      {
        "title": "Tramo IV-Etapa III",
        "propertyName": "nombre",
        "value": "Tramo IV-Etapa III",
        "strokeColor": "#0066ff"
      },
      {
        "title": "Tramo IV-Etapa IV",
        "propertyName": "nombre",
        "value": "Tramo IV-Etapa IV",
        "strokeColor": "#ff6600"
      },
      {
        "title": "Tramo V-Etapa I",
        "propertyName": "nombre",
        "value": "Tramo V-Etapa I",
        "strokeColor": "#004c73"
      },
      {
        "title": "Tramo V-Etapa II",
        "propertyName": "nombre",
        "value": "Tramo V-Etapa II",
        "strokeColor": "#00a9e6"
      },
      {
        "title": "Tramo V- Etapa III",
        "propertyName": "nombre",
        "value": "Tramo V- Etapa III",
        "strokeColor": "#73dfff"
      }
    ]
  },
  {
    "id": "vs",
    "title": "Vs",
    "fileName": "vs.sld",
    "geomType": "Polygon",
    "strokeColor": "rgba(35, 35, 35, 0)",
    "rawStrokeColor": "#232323",
    "strokeWidth": 0.5,
    "strokeOpacity": 0,
    "lineStyle": "solid",
    "fillColor": "rgba(225, 89, 137, 0.4)",
    "rawFillColor": "#e15989",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 15,
    "rules": [
      {
        "strokeColor": "#232323",
        "fillColor": "#e15989"
      },
      {
        "title": "\"clase\" = 'MB'",
        "propertyName": "clase",
        "value": "MB",
        "strokeColor": "#232323",
        "fillColor": "#ffcce1"
      },
      {
        "title": "\"clase\" = 'B'",
        "propertyName": "clase",
        "value": "B",
        "strokeColor": "#232323",
        "fillColor": "#f59fbf"
      },
      {
        "title": "\"clase\" = 'M'",
        "propertyName": "clase",
        "value": "M",
        "strokeColor": "#232323",
        "fillColor": "#e8728b"
      },
      {
        "title": "\"clase\" = 'A'",
        "propertyName": "clase",
        "value": "A",
        "strokeColor": "#232323",
        "fillColor": "#d94580"
      },
      {
        "title": "\"clase\" = 'MA'",
        "propertyName": "clase",
        "value": "MA",
        "strokeColor": "#232323",
        "fillColor": "#c70063"
      },
      {
        "title": "\"clase\" = 'SD'",
        "propertyName": "clase",
        "value": "SD",
        "strokeColor": "#232323",
        "fillColor": "#cccccc"
      },
      {
        "strokeColor": "#232323",
        "fillColor": "#becf50"
      },
      {
        "title": "\"clase\" = 'MB'",
        "propertyName": "clase",
        "value": "MB",
        "strokeColor": "#232323",
        "fillColor": "#ffcce1"
      },
      {
        "title": "\"clase\" = 'B'",
        "propertyName": "clase",
        "value": "B",
        "strokeColor": "#232323",
        "fillColor": "#f59fbf"
      },
      {
        "title": "\"clase\" = 'M'",
        "propertyName": "clase",
        "value": "M",
        "strokeColor": "#232323",
        "fillColor": "#e8728b"
      },
      {
        "title": "\"clase\" = 'A'",
        "propertyName": "clase",
        "value": "A",
        "strokeColor": "#232323",
        "fillColor": "#d94580"
      },
      {
        "title": "\"clase\" = 'MA'",
        "propertyName": "clase",
        "value": "MA",
        "strokeColor": "#232323",
        "fillColor": "#c70063"
      },
      {
        "title": "\"clase\" = 'SD'",
        "propertyName": "clase",
        "value": "SD",
        "strokeColor": "#232323",
        "fillColor": "#cccccc"
      }
    ]
  },
  {
    "id": "vs_transparencia",
    "title": "Vs transparencia",
    "fileName": "vs_transparencia.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(255, 204, 225, 0.4)",
    "rawFillColor": "#ffcce1",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 6,
    "rules": [
      {
        "title": "MB",
        "propertyName": "clase",
        "value": "MB",
        "strokeColor": "#000000",
        "fillColor": "#ffcce1"
      },
      {
        "title": "B",
        "propertyName": "clase",
        "value": "B",
        "strokeColor": "#000000",
        "fillColor": "#f59fbf"
      },
      {
        "title": "M",
        "propertyName": "clase",
        "value": "M",
        "strokeColor": "#000000",
        "fillColor": "#e8729d"
      },
      {
        "title": "A",
        "propertyName": "clase",
        "value": "A",
        "strokeColor": "#000000",
        "fillColor": "#d94580"
      },
      {
        "title": "MA",
        "propertyName": "clase",
        "value": "MA",
        "strokeColor": "#000000",
        "fillColor": "#c70063"
      }
    ]
  },
  {
    "id": "vulnerabilidad_hidrica_humedales",
    "title": "Vulnerabilidad hidrica humedales",
    "fileName": "vulnerabilidad_hidrica_humedales.sld",
    "geomType": "Polygon",
    "strokeColor": "#000000",
    "rawStrokeColor": "#000000",
    "strokeWidth": 1,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "rgba(227, 26, 28, 0.4)",
    "rawFillColor": "#e31a1c",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 3,
    "rules": [
      {
        "title": "Alta",
        "propertyName": "vulnerabil",
        "value": "Alta",
        "strokeColor": "#000000",
        "fillColor": "#e31a1c"
      },
      {
        "title": "Media",
        "propertyName": "vulnerabil",
        "value": "Media",
        "strokeColor": "#000000",
        "fillColor": "#fff93c"
      },
      {
        "title": "Baja",
        "propertyName": "vulnerabil",
        "value": "Baja",
        "strokeColor": "#000000",
        "fillColor": "#33a02c"
      }
    ]
  },
  {
    "id": "zanjones_ak",
    "title": "Zanjones ak",
    "fileName": "zanjones_ak.sld",
    "geomType": "LineString",
    "strokeColor": "#9a5200",
    "rawStrokeColor": "#9a5200",
    "strokeWidth": 0.5,
    "strokeOpacity": 1,
    "lineStyle": "solid",
    "fillColor": "transparent",
    "rawFillColor": "transparent",
    "fillOpacity": 1,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 1
  },
  {
    "id": "zonas_dc",
    "title": "Zonas dc",
    "fileName": "zonas_dc.sld",
    "geomType": "Polygon",
    "strokeColor": "rgba(35, 35, 35, 0)",
    "rawStrokeColor": "#232323",
    "strokeWidth": 1,
    "strokeOpacity": 0,
    "lineStyle": "solid",
    "fillColor": "rgba(215, 25, 28, 0.4)",
    "rawFillColor": "#d7191c",
    "fillOpacity": 0.4,
    "pointSize": 6,
    "wellKnownName": "circle",
    "rulesCount": 13,
    "rules": [
      {
        "title": "I",
        "propertyName": "zona",
        "value": "I",
        "strokeColor": "#232323",
        "fillColor": "#d7191c"
      },
      {
        "title": "II",
        "propertyName": "zona",
        "value": "II",
        "strokeColor": "#232323",
        "fillColor": "#e44a33"
      },
      {
        "title": "III",
        "propertyName": "zona",
        "value": "III",
        "strokeColor": "#232323",
        "fillColor": "#f17c4a"
      },
      {
        "title": "IV",
        "propertyName": "zona",
        "value": "IV",
        "strokeColor": "#232323",
        "fillColor": "#fdae61"
      },
      {
        "title": "IX",
        "propertyName": "zona",
        "value": "IX",
        "strokeColor": "#232323",
        "fillColor": "#fec980"
      },
      {
        "title": "V",
        "propertyName": "zona",
        "value": "V",
        "strokeColor": "#232323",
        "fillColor": "#ffe4a0"
      },
      {
        "title": "VI",
        "propertyName": "zona",
        "value": "VI",
        "strokeColor": "#232323",
        "fillColor": "#ffffbf"
      },
      {
        "title": "VII",
        "propertyName": "zona",
        "value": "VII",
        "strokeColor": "#232323",
        "fillColor": "#e3f4b6"
      },
      {
        "title": "VIII",
        "propertyName": "zona",
        "value": "VIII",
        "strokeColor": "#232323",
        "fillColor": "#c7e9ad"
      },
      {
        "title": "X",
        "propertyName": "zona",
        "value": "X",
        "strokeColor": "#232323",
        "fillColor": "#abdda4"
      },
      {
        "title": "XI",
        "propertyName": "zona",
        "value": "XI",
        "strokeColor": "#232323",
        "fillColor": "#80bfac"
      },
      {
        "title": "XII",
        "propertyName": "zona",
        "value": "XII",
        "strokeColor": "#232323",
        "fillColor": "#56a1b3"
      }
    ]
  }
];
