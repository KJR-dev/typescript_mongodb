import request from 'supertest'
import app from '../src/app'

describe('App', () => {
    it('Should return 200 status', async () => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        const response = await request(app).get('/api/v1/self').send()
        expect(response.statusCode).toBe(200)
    })
})

