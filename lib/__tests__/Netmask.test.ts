import Netmask from '../index';

function testClassC2(netmask: Netmask) {
  expect(netmask.networkSize).toBe(256);
  expect(netmask.firstHostIP).toBe('192.168.2.1');
  expect(netmask.lastHostIP).toBe('192.168.2.254');
  expect(netmask.broadcastIP).toBe('192.168.2.255');
  expect(netmask.netmaskBits).toBe(24);
  expect(netmask.netmask).toBe('255.255.255.0');
  expect(netmask.toString()).toBe('192.168.2.0/24');
}

function testClassC216(netmask: Netmask) {
  expect(netmask.networkSize).toBe(256);
  expect(netmask.firstHostIP).toBe('216.240.32.1');
  expect(netmask.lastHostIP).toBe('216.240.32.254');
  expect(netmask.broadcastIP).toBe('216.240.32.255');
  expect(netmask.netmaskBits).toBe(24);
  expect(netmask.netmask).toBe('255.255.255.0');
  expect(netmask.toString()).toBe('216.240.32.0/24');
}

function testClassB(netmask: Netmask) {
  expect(netmask.networkSize).toBe(Math.pow(2, 16));
  expect(netmask.firstHostIP).toBe('128.0.0.1');
  expect(netmask.lastHostIP).toBe('128.0.255.254');
  expect(netmask.broadcastIP).toBe('128.0.255.255');
  expect(netmask.netmaskBits).toBe(16);
  expect(netmask.netmask).toBe('255.255.0.0');
  expect(netmask.toString()).toBe('128.0.0.0/16');
}

test('Private class C network "/" notation', () => {
  const classC2 = new Netmask('192.168.2.0/24');
  testClassC2(classC2);
});

test('Private class C network "/" notation with host IP', () => {
  const classC2 = new Netmask('192.168.2.22/24');
  testClassC2(classC2);
});

test('Private class C network left out notation', () => {
  const classC2 = new Netmask('192.168.2');
  testClassC2(classC2);
});

test('Private class C network netmask notation', () => {
  const classC2 = new Netmask('192.168.2.0', '255.255.255.0');
  testClassC2(classC2);
});
test('Private class B network "/" notation', () => {
  const classB = new Netmask('128.0.0.0/16');
  testClassB(classB);
});

test('Private class B network left out notation', () => {
  const classB = new Netmask('128.0');
  testClassB(classB);
});

test('Private class B network netmask notation', () => {
  const classB = new Netmask('128.0.0.0', '255.255.0.0');
  testClassB(classB);
});

function createNetmask(net: string): any {
  return () => new Netmask(net);
}

test('Wrong entries', () => {
  expect(createNetmask('209.255.68.22.23/24')).toThrow('Invalid IP');
  expect(createNetmask('209.256.68.22/255.255.224.0')).toThrow('Invalid byte: 256');
  expect(createNetmask('209.180.68.22/256.255.224.0')).toThrow('Invalid byte: 256');
  expect(createNetmask('209.500.70.33/19')).toThrow('Invalid byte: 500');
  expect(createNetmask('140.999.82')).toThrow('Invalid byte: 999');
  expect(createNetmask('209.300.64.0.10')).toThrow('Invalid net address: 209.300.64.0.10');
  expect(createNetmask('209.200.64.0.10')).toThrow('Invalid net address: 209.200.64.0.10');
  expect(createNetmask('garbage')).toThrow('Invalid byte: NaN');
});

test('Ranges that are a power-of-two big, but are not legal blocks', () => {
  expect(createNetmask('218.0.0.0/221.255.255.255')).toThrow('Invalid mask');
  expect(createNetmask('218.0.0.4/218.0.0.11')).toThrow('Invalid mask');
});

test('Test boundaries for contains', () => {
  const netmask = new Netmask('192.168.2');
  expect(netmask.contains('192.168.2.0')).toBe(true);
  expect(netmask.contains('192.168.2.22')).toBe(true);
  expect(netmask.contains('192.168.2.23')).toBe(true);
  expect(netmask.contains('192.168.2.127')).toBe(true);
  expect(netmask.contains('192.168.2.128')).toBe(true);
  expect(netmask.contains('192.168.2.255')).toBe(true);
  expect(netmask.contains('192.168.1.255')).toBe(false);
  expect(netmask.contains('192.168.3.0')).toBe(false);
});

test('Test cases from the doku', () => {
  const block = new Netmask('10.0.0.0/12');
  expect(block.network).toBe('10.0.0.0');
  expect(block.netmask).toBe('255.240.0.0');
  expect(block.netmaskBits).toBe(12);
  expect(block.hostmask).toBe('0.15.255.255');
  expect(block.broadcastIP).toBe('10.15.255.255');
  expect(block.networkSize).toBe(1048576);
  expect(block.firstHostIP).toBe('10.0.0.1');
  expect(block.lastHostIP).toBe('10.15.255.254');
  expect(block.contains('10.0.8.10')).toBe(true);
  expect(block.contains('10.8.0.10')).toBe(true);
  expect(block.contains('192.168.1.20')).toBe(false);
});

describe('Test all creation examples from doku', () => {
  test('216.240.32.0/24', () => {
    const block = new Netmask('216.240.32.0/24');
    testClassC216(block);
  });
  test('216.240.32.0/255.255.255.0', () => {
    const block = new Netmask('216.240.32.0/255.255.255.0');
    testClassC216(block);
  });
  test("'216.240.32.0', '255.255.255.0'", () => {
    const block = new Netmask('216.240.32.0', '255.255.255.0');
    testClassC216(block);
  });
  test('216.240.32', () => {
    const block = new Netmask('216.240.32');
    testClassC216(block);
  });
  test('216.240.32/24', () => {
    const block = new Netmask('216.240.32/24');
    testClassC216(block);
  });
  test("'216.240.32', '24'", () => {
    const block = new Netmask('216.240.32', '24');
    testClassC216(block);
  });
  test('216.240.32.4', () => {
    const block = new Netmask('216.240.32.4');
    expect(block.netmaskBits).toBe(32);
  });
  test('216.240', () => {
    const block = new Netmask('216.240');
    expect(block.netmaskBits).toBe(16);
  });
  test('216.240/16', () => {
    const block = new Netmask('216.240/16');
    expect(block.netmaskBits).toBe(16);
  });
  test('140', () => {
    const block = new Netmask('140');
    expect(block.netmaskBits).toBe(8);
  });

  test('Test forEachHost', () => {
    const classC2 = new Netmask('192.168.2.0/24');
    const mockCallback = jest.fn((ip) => ip);
    classC2.forEachHost(mockCallback);
    expect(mockCallback.mock.calls.length).toBe(254);
    expect(mockCallback.mock.calls[0][0]).toBe('192.168.2.1');
    expect(mockCallback.mock.calls[123][0]).toBe('192.168.2.124');
    expect(mockCallback.mock.calls[253][0]).toBe('192.168.2.254');
  });

  test('Test iterateHosts', () => {
    const classC2 = new Netmask('192.168.2.0/24');
    const iterator = classC2.iterateHosts();
    expect(iterator.next().value).toBe('192.168.2.1');
    for (let i = 0; i < 122; ++i) iterator.next();
    expect(iterator.next().value).toBe('192.168.2.124');
    for (let i = 0; i < 129; ++i) iterator.next();
    expect(iterator.next().value).toBe('192.168.2.254');
    expect(iterator.next().done).toBe(true);
  });
});
