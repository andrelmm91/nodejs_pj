const sinon = require("sinon");
const chai = require("chai");
const { expect } = chai;
const { signup } = require("../controllers/auth");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

describe("User Controller", () => {
  describe("signup", () => {
    it("should create a new user", async () => {
      const req = {
        body: {
          email: "test@example.com",
          name: "Test User",
          password: "password123",
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const next = sinon.spy();

      // Stub the necessary functions
      sinon.stub(User.prototype, "save").resolves({ _id: "someUserId" });
      sinon.stub(bcrypt, "hash").resolves("hashedPassword");

      try {
        await signup(req, res, next);

        // Assertions
        expect(res.status.calledOnceWith(201)).to.be.true;
        expect(
          res.json.calledOnceWith({
            message: "user created",
            userId: "someUserId",
          })
        ).to.be.true;
      } finally {
        // Clean up
        User.prototype.save.restore();
        bcrypt.hash.restore();
      }
    });

    it("should handle validation errors", async () => {
      const req = {
        body: {
          email: "invalid-email",
          name: "Test User",
          password: "short",
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const next = sinon.spy();

      await signup(req, res, next);

      // Assertions
      expect(res.status.calledOnceWith(422)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(next.called).to.be.false;
    });

    it("should handle other errors", async () => {
      const req = {
        body: {
          email: "test@example.com",
          name: "Test User",
          password: "password123",
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const next = sinon.spy();

      // Stub the necessary functions to simulate an error
      sinon.stub(User.prototype, "save").rejects(new Error("Some error"));

      try {
        await signup(req, res, next);

        // Assertions
        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(next.calledOnce).to.be.true;
      } finally {
        // Clean up
        User.prototype.save.restore();
      }
    });
  });

  it("should throw an error with code 500 if accessing the database fails", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "tester",
      },
    };

    AuthController.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });

    User.findOne.restore();
  });
});
