export const isAddress = (addr: string) => /[a-z0-9_-]{43}/i.test(addr);

export function formatAddress(address: string, count = 13) {
  return (
    address.substring(0, count) +
    "..." +
    address.substring(address.length - count, address.length)
  );
}

export const FREE_DATA_SIZE = 100000;