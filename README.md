Node Netmask
=======
[![NPM version](https://img.shields.io/npm/v/@hg8496/netmask.svg)](https://www.npmjs.com/package/@hg8496/netmask)

The Netmask class parses and understands IPv4 CIDR blocks so they can be explored. This module is highly inspired by coffeescript module [rs/node-netmask](https://github.com/rs/node-netmask) module.

Synopsis
--------

    import { Netmask } from '@hg8496/netmask'

    const block = new Netmask('10.0.0.0/12');
    block.baseIP;                   // 10.0.0.0
    block.netmask;                  // 255.240.0.0
    block.netmaskBits;              // 12
    block.hostmask;                 // 0.15.255.255
    block.broadcastIP;              // 10.15.255.255
    block.networkSize;              // 1048576
    block.firstHostIP;              // 10.0.0.1
    block.lastHostIP;               // 10.15.255.254

    block.contains('10.0.8.10');    // true
    block.contains('10.8.0.10');    // true
    block.contains('192.168.1.20'); // false

    block.forEach(function(ip, long, index));

Constructing
------------

Netmask objects are created with an IP address and optionally a mask. There are many forms that are recognized:

    '216.240.32.0/24'               // The preferred form.
    '216.240.32.0', '24'
    '216.240.32.0/255.255.255.0'
    '216.240.32.0', '255.255.255.0'
    '216.240.32.4'                  // A /32 block.
    '216.240.32'                    // A /24 block.
    '216.240'                       // A /16 block.
    '140'                           // A /8 block.
    '216.240.32/24'
    '216.240/16'

API
---

- `.baseIP`: The base address of the network block as a string (eg: 216.240.32.0). Base does not give an indication of the size of the network block.
- `.netmask`: The netmask as a string (eg: 255.255.255.0).
- `.hostmask`: The host mask which is the opposite of the netmask (eg: 0.0.0.255).
- `.netmaskBits`: The netmask as a number of bits in the network portion of the address for this block (eg: 24).
- `.networkSize`: The number of IP addresses in a block (eg: 256).
- `.broadcastIP`: The blocks broadcast address (eg: 192.168.1.0/24 => 192.168.1.255)
- `.firstHostIP`, `.lastHostIP`: First and last useable address
- `.contains(ip)`: Returns a true if the IP number `ip` is part of the network. That is, a true value is returned if `ip` is between `baseIP` and `broadcastIP`.
- `.forEachHost(fn)`: Similar to the Array prototype method. It loops through all the useable addresses, ie between `firstHostIP` and `lastHostIP`.
- `.iterateHosts`: Returns an IterableIterator with the same logic as `forEachHost`
- `.toString()`: The netmask in base/bitmask format (e.g., '216.240.32.0/24')

Installation
------------

    $ npm install @hg8496/netmask

License
-------

(The MIT License)

Copyright (c) 2019 Christian Stolz <hg8496@cstolz.de>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



