import { ethers } from "ethers";

const provider = new ethers.providers.AlchemyProvider(
  1,
  "tGyGfxK0E7NHtzkVyqmzRBqRji4jtaBa"
);

// Address to ENS
const cache: Record<string, string> = {};

export const AddressToENS = async (address: string): Promise<string | null> => {
  const mappedVal = cache[address];

  if (mappedVal !== undefined) {
    console.log("Cached used successfully");
    return mappedVal;
  }

  const ens = await provider.lookupAddress(address);
  cache[address] = ens;

  return ens;
};

export const ENSToAddress = async (ens: string): Promise<string | null> => {
  return await provider.resolveName(ens);
};
