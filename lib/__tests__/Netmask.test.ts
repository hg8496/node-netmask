import { Netmask } from '../index';

function testClassC2(netmask: Netmask) {
  expect(netmask.networkSize).toBe(256);
  expect(netmask.firstHostIP).toBe('192.168.2.1');
  expect(netmask.lastHostIP).toBe('192.168.2.254');
  expect(netmask.broadcastIP).toBe('192.168.2.255');
  expect(netmask.netmaskBits).toBe(24);
  expect(netmask.netmask).toBe('255.255.255.0');
  expect(netmask.toString()).toBe('192.168.2.0/24');
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
  let classC2 = new Netmask('192.168.2.0/24');
  testClassC2(classC2);
});

test('Private class C network "/" notation with host IP', () => {
  let classC2 = new Netmask('192.168.2.22/24');
  testClassC2(classC2);
});

test('Private class C network left out notation', () => {
  let classC2 = new Netmask('192.168.2');
  testClassC2(classC2);
});

test('Private class C network netmask notation', () => {
  let classC2 = new Netmask('192.168.2.0', '255.255.255.0');
  testClassC2(classC2);
});
test('Private class B network "/" notation', () => {
  let classB = new Netmask('128.0.0.0/16');
  testClassB(classB);
});

test('Private class B network left out notation', () => {
  let classB = new Netmask('128.0');
  testClassB(classB);
});

test('Private class B network netmask notation', () => {
  let classB = new Netmask('128.0.0.0', '255.255.0.0');
  testClassB(classB);
});

function createNetmask(net: string): any {
  return () => new Netmask(net);
}

test('Wrong entries', () => {
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
  let netmask = new Netmask('192.168.2');
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
