import { convertEjsToTsx } from './convertEjsToTsx'

describe('convertEjsToTsx test', (): void => {
    test('text', (): void => {
        const response = convertEjsToTsx('world')

        expect(response).toBe('hello world')
    })
})

