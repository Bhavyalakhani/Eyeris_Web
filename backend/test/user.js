let chai = require("chai");
let chaihttp = require("chai-http");
let index = require("../index.js");

const server = "http://localhost:5000"
//Assertion Style
chai.should();

chai.use(chaihttp);

describe("Users API",() => {
    // create a user
    describe("POST /api/v1/user/login",() => {
        it("Should Login a user",(done) => {
            const details = {
                "email": "bhavyalakhani@gmail.com",
                "password": "bhavya1"
            }

            chai.request(server)
            .post("/api/v1/user/login")
            .send((details))
            .end((err,response) => {
                response.should.have.a.status(200);
                response.body.should.have.property("token");
                response.body.should.have.property("sendUser").property("cart");

                done();
            })
        })
    })

        describe("GET /api/v1/user/me",() => {
        it("GET user through token",(done) => {
            const header = {
                "Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOThkZjQ4NjM5Y2U1MWQ0MDljNWVjYiIsImlhdCI6MTYyMzQyMDg5MCwiZXhwIjoxNjI2MDEyODkwfQ.2a0atDMNqZjGtg7Pxjp1Y3rv7yGPoCUVBSYi69DjQLQ"
            }
            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOThkZjQ4NjM5Y2U1MWQ0MDljNWVjYiIsImlhdCI6MTYyMzQyMDg5MCwiZXhwIjoxNjI2MDEyODkwfQ.2a0atDMNqZjGtg7Pxjp1Y3rv7yGPoCUVBSYi69DjQLQ"

            chai.request(server)
            .get("/api/v1/user/me")
            .set('Authorization','Bearer ' + token)
            .end((err,response) => {
                response.should.have.a.status(200);

                done();
            })
        })
    })
})


