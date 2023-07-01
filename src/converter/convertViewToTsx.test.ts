import { convertViewToTsx } from './convertViewToTsx'

describe('convertViewToTsx test', (): void => {
    test('text', (): void => {
        const response = convertViewToTsx('world')

        expect(response).toBe('hello world')
    })
})

