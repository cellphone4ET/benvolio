"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");
const { User } = require("../users");
const { TEST_DATABASE_URL } = require("../config");

const expect = chai.expect;

chai.use(chaiHttp);

describe("/api/user", function() {
  const email = "exampleUser";
  const password = "examplePass";
  const firstName = "Example";
  const lastName = "User";
  const emailB = "exampleUserB";
  const passwordB = "examplePassB";
  const firstNameB = "ExampleB";
  const lastNameB = "UserB";

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {});

  afterEach(function() {
    return User.remove({});
  });

  describe("/api/users", function() {
    describe("POST", function() {
      it("Should reject users with missing email", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            password,
            firstName,
            lastName
          })
          .then(function(res) {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal("Missing field");
            expect(res.body.location).to.equal("email");
          });
      });
      it("Should reject users with missing password", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email,
            firstName,
            lastName
          })
          .then(function(res) {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal("Missing field");
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with non-string email", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email: 1234,
            password,
            firstName,
            lastName
          })
          .then(function(res) {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Incorrect field type: expected string"
            );
            expect(res.body.location).to.equal("email");
          });
      });
      it("Should reject users with non-string password", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email,
            password: 1234,
            firstName,
            lastName
          })
          .then(function(res) {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Incorrect field type: expected string"
            );
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with non-string first name", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email,
            password,
            firstName: 1234,
            lastName
          })
          .then(function(res) {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Incorrect field type: expected string"
            );
            expect(res.body.location).to.equal("firstName");
          });
      });
      it("Should reject users with non-string last name", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email,
            password,
            firstName,
            lastName: 1234
          })
          .then(function(res) {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Incorrect field type: expected string"
            );
            expect(res.body.location).to.equal("lastName");
          });
      });
      it("Should reject users with non-trimmed email", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email: ` ${email} `,
            password,
            firstName,
            lastName
          })
          .then(function(res) {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Cannot start or end with whitespace"
            );
            expect(res.body.location).to.equal("email");
          });
      });
      it("Should reject users with non-trimmed password", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email,
            password: ` ${password} `,
            firstName,
            lastName
          })
          .then(function(res) {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Cannot start or end with whitespace"
            );
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with empty email", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email: "",
            password,
            firstName,
            lastName
          })
          .then(function(res) {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Must be at least 1 characters long"
            );
            expect(res.body.location).to.equal("email");
          });
      });
      it("Should reject users with password less than ten characters", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email,
            password: "123456789",
            firstName,
            lastName
          })
          .then(function(res) {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Must be at least 10 characters long"
            );
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with password greater than 72 characters", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email,
            password: new Array(73).fill("a").join(""),
            firstName,
            lastName
          })
          .then(function(res) {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal(
              "Must be at most 72 characters long"
            );
            expect(res.body.location).to.equal("password");
          });
      });
      it("Should reject users with duplicate email", function() {
        // Create an initial user
        return User.create({
          email,
          password,
          firstName,
          lastName
        })
          .then(() =>
            // Try to create a second user with the same email
            chai
              .request(app)
              .post("/api/users")
              .send({
                email,
                password,
                firstName,
                lastName
              })
          )
          .then(function(res) {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal("ValidationError");
            expect(res.body.message).to.equal("Username already taken");
            expect(res.body.location).to.equal("email");
          });
      });
      it("Should create a new user", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email,
            password,
            firstName,
            lastName
          })
          .then(res => {
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.keys(
              "email",
              "firstName",
              "lastName",
              "id"
            );
            expect(res.body.email).to.equal(email);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            return User.findOne({
              email
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstName).to.equal(firstName);
            expect(user.lastName).to.equal(lastName);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });
      it("Should trim firstName and lastName", function() {
        return chai
          .request(app)
          .post("/api/users")
          .send({
            email,
            password,
            firstName: ` ${firstName} `,
            lastName: ` ${lastName} `
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.keys(
              "email",
              "firstName",
              "lastName",
              "id"
            );
            expect(res.body.email).to.equal(email);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            return User.findOne({
              email
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstName).to.equal(firstName);
            expect(user.lastName).to.equal(lastName);
          });
      });
    });
  });
});
