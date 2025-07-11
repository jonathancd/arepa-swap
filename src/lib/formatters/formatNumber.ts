// Overloads para tipado inteligente
export function formatNumber(
  value: number,
  options?: {
    locale?: string;
    decimals?: number;
    splitParts?: false;
  }
): string;

export function formatNumber(
  value: number,
  options: {
    locale?: string;
    decimals?: number;
    splitParts: true;
  }
): { integer: string; decimal: string };

//  Implementación única
export function formatNumber(
  value: number,
  {
    locale = "en-US",
    decimals = 2,
    splitParts = false,
  }: {
    locale?: string;
    decimals?: number;
    splitParts?: boolean;
  } = {}
): string | { integer: string; decimal: string } {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const formatted = formatter.format(value);

  if (splitParts) {
    const [integer, decimal] = formatted.split(".");
    return { integer, decimal };
  }

  return formatted;
}
