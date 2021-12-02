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
    return mappedVal;
  }

  const ens = await provider.lookupAddress(address);
  cache[address] = ens;

  return ens;
};

// Not used enough to care about caching for now
export const ENSToAddress = async (ens: string): Promise<string | null> => {
  return await provider.resolveName(ens);
};

export const resolveWallet = async (
  input: string
): Promise<[string, string]> => {
  let address;
  let ens;

  let re = /^0x[a-fA-F0-9]{40}$/;
  if (re.test(input)) {
    address = input;
    ens = await AddressToENS(address);
  } else {
    ens = input;
    if (ens.slice(-4) !== ".eth") {
      ens += ".eth";
    }
    address = await ENSToAddress(ens);
  }

  if (address === null) {
    throw new Error(
      "There's either a typo in the address or the provided ENS name does not have an associated wallet."
    );
  }

  return [address, ens];
};
