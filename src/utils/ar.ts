export const isAddress = (addr: string) => /[a-z0-9_-]{43}/i.test(addr);
