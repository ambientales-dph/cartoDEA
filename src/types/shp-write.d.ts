declare module '@mapbox/shp-write' {
  export interface ZipOptions {
    folder?: string;
    types?: Record<string, string>;
    prj?: string;
    outputType?: 'base64' | 'string' | 'text' | 'binarystring' | 'array' | 'uint8array' | 'arraybuffer' | 'blob' | 'nodebuffer';
    compression?: 'STORE' | 'DEFLATE';
  }

  export function zip(
    geojson: any,
    options?: ZipOptions,
    stream?: boolean
  ): Promise<any>;

  export function write(
    data: any[],
    geometryType: string,
    geometries: any[],
    callback: (err: any, files: { shp: any; shx: any; dbf: any }) => void
  ): void;

  export function download(geojson: any, options?: ZipOptions & { filename?: string }): void;
}
