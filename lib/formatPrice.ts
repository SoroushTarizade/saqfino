export function formatPrice(priceInMillion: number) {
  if (priceInMillion >= 1000) {
    const billion = priceInMillion / 1000;

    return `${billion.toLocaleString("fa-IR", {
      maximumFractionDigits: 1,
    })} میلیارد تومان`;
  }

  return `${priceInMillion.toLocaleString("fa-IR")} میلیون تومان`;
}
