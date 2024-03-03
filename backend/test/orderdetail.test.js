const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose');

// reference link: https://www.npmjs.com/package/supertest
afterAll(async () => {
    await mongoose.disconnect(); // Close the database connection
});

describe("GET /orderDetail/657f302b814e7fccea0f6fba", () => {
    describe("Không nhập email", () => {
        it("expect status code = 400", async () => {
            const response = await request(app).get("/orderDetail/657f302b814e7fccea0f6fba").send({
                
            })
            expect(response.statusCode).toBe(200)
            expect(response.body.error).toEqual("Vui lòng nhập email")
        })
    })
    
})
