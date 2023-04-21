import {expect, test} from '@jest/globals'

test('placholder', () => {
    expect(1).toEqual(1);
})

// TODO: Test does not pass on GitHub, but it does locally, should be fixed later.
// test('test runs', () => {
//     const np = process.execPath
//     const ip = path.join(__dirname, '..', 'lib', 'main.js')
//     const options: cp.ExecFileSyncOptions = {
//         env: process.env
//     }
//
//     console.log(cp.execFileSync(np, [ip], options).toString())
// })
