declare module 'numero-a-letras' {
  export function NumerosALetras(num: number, options?: {
    plural?: string;
    singular?: string;
    centPlural?: string;
    centSingular?: string;
  }): string;
}
