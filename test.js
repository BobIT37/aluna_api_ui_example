// create integration tests for the application
const request = require("supertest");
const expect = require("expect").expect;
const app = require("./app");


const TEST_DATA = {
    name: "Juan Gomez",
    dob: "1940-12-01",
    gender: "Male",
    identifier: "JUGO1940M",
};
const testApp = request(app);


describe("GET /patients/identifier",()=>{
    it("should body equal the TEST_DATA identifier", async () => {
        const res = await testApp
            .get("/patients/identifier")
            .query(TEST_DATA);

        await expect(res.status).toEqual(200);
        return expect(res.body).toEqual({ identifier: TEST_DATA.identifier });
        
    });
});


describe("POST /identity", () => {
    it("should return 200 OK", async () => {
        const res = await testApp
            .post("/identity")
            .send({identifier: TEST_DATA.identifier});

        expect(res.status).toEqual(200);
    });
    it('should return 500', async () => {
        const res = await testApp
            .post("/identity")
            .send({identifier: '1234'});
        expect(res.status).toEqual(500);
    });
    it('should return 409', async () => {
        const res = await testApp
            .post("/identity")
            .send({identifier: TEST_DATA.identifier});
        expect(res.status).toEqual(409);
    });
    
});

describe("GET /identity?identifier", () => {
    it("should return 200 OK", async () => {
        const res = await testApp
            .get("/identity")
            .query({identifier: TEST_DATA.identifier});
        expect(res.status).toEqual(200);
    });
    it("should return 404", async () => {
        const res = await testApp
            .get("/identity")
            .query({identifier: '1234'});
        expect(res.status).toEqual(404);
    });
});