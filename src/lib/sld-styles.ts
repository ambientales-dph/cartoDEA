import { DEA_SLD_STYLES, SldStyleItem, SldRuleDefinition } from './sld-styles-data';
import type { StyleOptions } from './types';

export type { SldStyleItem, SldRuleDefinition };
export { DEA_SLD_STYLES };

const cleanString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\.(geojson|shp|kml|json|tif|tiff)$/i, '')
    .replace(/^([a-z]{2,4}\d{2,4})[_-]/i, '') // e.g. RSA063_
    .replace(/^(dea|desa|gis):/i, '')
    .replace(/[^a-z0-9]/g, '');
};

// Mapa rápido por ID normalizado
const stylesById = new Map<string, SldStyleItem>();
const stylesByCleanId = new Map<string, SldStyleItem>();

DEA_SLD_STYLES.forEach((item) => {
  stylesById.set(item.id.toLowerCase(), item);
  stylesByCleanId.set(cleanString(item.id), item);
});

// Diccionario de sinónimos y palabras clave habituales de capas DEA
const SYNONYMS: Record<string, string> = {
  arroyo: 'curso_de_agua',
  arroyos: 'curso_de_agua',
  rio: 'curso_de_agua',
  rios: 'curso_de_agua',
  hidrografia: 'curso_de_agua',
  laguna: 'cuerpo_de_agua',
  lagunas: 'cuerpo_de_agua',
  cuerpodeagua: 'cuerpo_de_agua',
  cuerposdeagua: 'cuerpo_de_agua',
  lago: 'cuerpo_de_agua',
  cuenca: 'cuencas',
  subcuenca: 'sub_cuenca_urbana',
  cuencaurbana: 'sub_cuenca_urbana',
  conducto: 'conductos',
  conductos: 'conductos',
  conductosexistentes: 'conductos_existentes',
  barrio: 'Barrios_estilo',
  barrios: 'Barrios_estilo',
  barriospopulares: 'Barrios_estilo',
  salud: 'salud',
  centrosdesalud: 'salud',
  hospital: 'salud',
  hospitales: 'salud',
  escuela: 'escuelas',
  escuelas: 'escuelas',
  educacion: 'escuelas',
  freatimetro: 'freatimetros',
  freatimetros: 'freatimetros',
  pozo: 'freatimetros',
  pozos: 'freatimetros',
  calle: 'calles_pavimento',
  calles: 'calles_pavimento',
  avenida: 'calles_pavimento',
  avenidas: 'calles_pavimento',
  pavimento: 'calles_pavimento',
  asfalto: 'calles_pavimento',
  parcela: 'parcelas',
  parcelas: 'parcelas',
  catastro: 'parcelas',
  inundacion: 'mancha_de_inundacion',
  mancha: 'mancha_de_inundacion',
  manchainundacion: 'mancha_de_inundacion',
  curvanivel: 'curva_de_nivel',
  curvasnivel: 'curva_de_nivel',
  gasoducto: 'gasoducto',
  gasoductos: 'gasoductos_estilo',
  oleoducto: 'oleoductos_estilo',
  oleoductos: 'oleoductos_estilo',
  poliducto: 'poliductos_estilo',
  puente: 'puente',
  puentes: 'puente',
  humedal: 'humedales_estilo',
  humedales: 'humedales_estilo',
  altatension: 'electrica_lineas_transporte',
  redaltatension: 'electrica_lineas_transporte',
  suelo: 'suelos',
  suelos: 'suelos',
  recinto: 'recintos',
  recintos: 'recintos',
  limiterecintos: 'limite_recintos',
  areaestudio: 'area_estudio',
  areainfluencia: 'area_influencia_directa',
  influenciadirecta: 'area_influencia_directa',
  influenciaindirecta: 'area_influencia_25',
};

/**
 * Busca si existe un estilo SLD DEA coincidente con el nombre o título de la capa.
 * Si no hay correspondencia clara, retorna null (para usar el estilo genérico).
 */
export function findMatchingSldStyle(
  layerName: string,
  layerTitle?: string,
  geomType?: string
): SldStyleItem | null {
  if (!layerName && !layerTitle) return null;

  const rawCandidates = [layerName, layerTitle || ''].filter(Boolean);

  // 1. Coincidencia exacta por ID de SLD
  for (const cand of rawCandidates) {
    const cleanCand = cand
      .toLowerCase()
      .replace(/\.(geojson|shp|kml|json|tif|tiff)$/i, '')
      .replace(/^(dea|desa|gis):/i, '');
    const direct = stylesById.get(cleanCand);
    if (direct) return direct;
  }

  // 2. Coincidencia por string normalizado
  for (const cand of rawCandidates) {
    const norm = cleanString(cand);
    const directNorm = stylesByCleanId.get(norm);
    if (directNorm) return directNorm;

    // Buscar en sinónimos conocidos
    if (SYNONYMS[norm]) {
      const synStyle = stylesById.get(SYNONYMS[norm].toLowerCase());
      if (synStyle) return synStyle;
    }

    // Comprobar si contiene alguna de las claves de sinónimos
    for (const [key, targetStyleId] of Object.entries(SYNONYMS)) {
      if (norm.includes(key)) {
        const synStyle = stylesById.get(targetStyleId.toLowerCase());
        if (synStyle) return synStyle;
      }
    }
  }

  // 3. Coincidencia parcial con IDs de estilos existentes
  for (const cand of rawCandidates) {
    const norm = cleanString(cand);
    if (norm.length >= 4) {
      for (const item of DEA_SLD_STYLES) {
        const itemClean = cleanString(item.id);
        if (itemClean.length >= 4 && (norm.includes(itemClean) || itemClean.includes(norm))) {
          return item;
        }
      }
    }
  }

  return null;
}

/**
 * Convierte un item de estilo SLD al formato StyleOptions de CartoDEA.
 */
export function sldStyleToStyleOptions(item: SldStyleItem): StyleOptions {
  return {
    strokeColor: item.strokeColor,
    fillColor: item.fillColor,
    lineWidth: Math.min(Math.max(Math.round(item.strokeWidth), 1), 10),
    lineStyle: item.lineStyle,
    pointSize: item.pointSize || 6,
  };
}

/**
 * Persistencia en cliente (LocalStorage) y notificación al backend (Portal DEA).
 */
export function saveLayerAssignedStyle(
  projectCode: string,
  layerId: string,
  styleId: string,
  options?: StyleOptions
): void {
  if (typeof window === 'undefined') return;

  const key = `cartodea_assigned_style_${projectCode}_${layerId}`;
  localStorage.setItem(key, JSON.stringify({ styleId, options, updatedAt: Date.now() }));

  // Notificar al backend de Portal DEA para persistencia permanente en Firestore
  const portalBase = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:9003'
    : (process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:9003');

  fetch(`${portalBase}/api/gis/layer-style`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectCode,
      layerId,
      assignedStyleId: styleId,
      assignedStyleOptions: options,
    }),
  }).catch((err) => {
    console.warn('[CartoDEA] No se pudo persistir el estilo en Firestore de Portal DEA:', err);
  });
}

/**
 * Recupera el estilo asignado guardado en LocalStorage si existe.
 */
export function getLayerAssignedStyle(
  projectCode: string,
  layerId: string
): { styleId: string; options?: StyleOptions } | null {
  if (typeof window === 'undefined') return null;

  const key = `cartodea_assigned_style_${projectCode}_${layerId}`;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

