function long2ip(long: number): string {
  const a: number = (long & (0xff << 24)) >>> 24;
  const b: number = (long & (0xff << 16)) >>> 16;
  const c: number = (long & (0xff << 8)) >>> 8;
  const d: number = long & 0xff;
  return [a, b, c, d].join('.');
}

function ip2long(ip: string): number {
  const bytes: string[] = (ip + '').split('.');
  if (bytes.length === 0 || bytes.length > 4) {
    throw new Error('Invalid IP');
  }
  let result: number = 0;
  for (let i: number = 0; i < 4; ++i) {
    const byte: number = parseInt(bytes[i] || '0', 10);
    if (isNaN(byte)) {
      throw new Error(`Invalid byte: ${byte}`);
    }
    if (byte < 0 || byte > 255) {
      throw new Error(`Invalid byte: ${byte}`);
    }
    result = (result << 8) + byte;
  }
  return result >>> 0;
}
export class Netmask {
  public network: string;
  public networkLong: number;
  public baseIP: string;
  public firstHostIP: string;
  public lastHostIP: string;
  public broadcastIP: string;
  public netmask: string;
  public netmaskBits: number = -1;
  public netmaskLong: number;
  public networkSize: number;
  public hostmask: string;

  constructor(net: string, mask?: string) {
    this.netmaskLong = 0;
    if (!mask) {
      [net, mask] = net.split('/', 2);
    }
    if (!mask) {
      const parts: number = net.split('.').length;
      if (parts >= 1 && parts <= 4) {
        this.netmaskBits = parts * 8;
      } else {
        throw new Error(`Invalid net address: ${net}`);
      }
    }
    if (mask && mask.indexOf('.') > -1) {
      const maskLong: number = ip2long(mask);
      for (let i = 32; i > 0; --i) {
        if (maskLong === (0xffffffff << (32 - i)) >>> 0) {
          this.netmaskBits = i;
          break;
        }
      }
    } else if (mask) {
      this.netmaskBits = parseInt(mask, 10);
    }
    if (this.netmaskBits > 0) {
      this.netmaskLong = (0xffffffff << (32 - this.netmaskBits)) >>> 0;
    } else {
      throw new Error('Invalid mask');
    }
    this.network = net;
    this.networkLong = (ip2long(net) & this.netmaskLong) >>> 0;
    this.networkSize = Math.pow(2, 32 - this.netmaskBits);
    this.baseIP = long2ip(this.networkLong);
    this.netmask = long2ip(this.netmaskLong);
    this.hostmask = long2ip(~this.netmaskLong);
    this.firstHostIP = this.netmaskBits <= 30 ? long2ip(this.networkLong + 1) : this.baseIP;
    this.lastHostIP =
      this.netmaskBits <= 30
        ? long2ip(this.networkLong + this.networkSize - 2)
        : long2ip(this.networkLong + this.networkSize - 1);
    this.broadcastIP = this.netmaskBits <= 30 ? long2ip(this.networkLong + this.networkSize - 1) : '--';
  }

  public contains(ip: string): boolean {
    const ipAsNumber = ip2long(ip);
    return ipAsNumber >= this.networkLong && ipAsNumber < this.networkLong + this.networkSize;
  }

  public forEachHost(forIp: (this: void, ip: string, index: number) => void): void {
    const endIP = ip2long(this.lastHostIP);
    let actualIP = ip2long(this.firstHostIP);
    let index = 0;
    while (actualIP <= endIP) {
      forIp(long2ip(actualIP), index);
      ++index;
      ++actualIP;
    }
  }

  public *iterateHosts(): IterableIterator<string> {
    const endIP = ip2long(this.lastHostIP);
    let actualIP = ip2long(this.firstHostIP);
    while (actualIP <= endIP) {
      yield long2ip(actualIP);
      ++actualIP;
    }
  }

  public toString(): string {
    return this.baseIP + '/' + this.netmaskBits;
  }
}
