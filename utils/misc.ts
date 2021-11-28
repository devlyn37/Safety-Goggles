export const formatEthFromWei = (wei: number): number => {
  const num = wei / Math.pow(10, 18);
  return Math.round((num + Number.EPSILON) * 1000000) / 1000000;
};

export const trimAddress = (address: string): string => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const addDefaultSrc = (ev) => {
  ev.target.src = "/no-image.jpeg";
};

export function trunicate(input, length) {
  if (input.length > length) {
    return input.substring(0, length) + "...";
  }
  return input;
}
