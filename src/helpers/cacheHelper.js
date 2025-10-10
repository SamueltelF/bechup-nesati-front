export const cacheChecking = (
  get,
  forceRefetch = false,
  cacheDuration = 5 * 60 * 1000
) => {
  const { products, cacheTimestamp } = get();
  if (
    !forceRefetch &&
    products.length > 0 &&
    Date.now() - cacheTimestamp < cacheDuration
  ) {
    console.log("Usando produtos em cache");
    return true;
  }
  return false;
};
