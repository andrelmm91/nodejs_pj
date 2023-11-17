const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/is-auth");
const expect = require("chai").expect;
const jest = require("jest").globals;
const sinon = require("sinon");

describe("authMiddleware", () => {
  it("should throw an error if no authorization header is present", () => {
    const req = {
      get: () => null,
    };
    expect(() => authMiddleware(req, {}, () => {})).to.throw(
      "Not authenticated."
    );
  });

  it("should throw an error if the token cannot be verified", () => {
    const req = {
      get: () => "Bearer invalid-token",
    };
    expect(() => authMiddleware(req, {}, () => {})).to.throw(
      "Not authenticated."
    );
  });

  it("should have a userId after decoding the token", () => {
    const req = {
      get: function (headerName) {
        return "Bearer Token";
      },
    };
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    jwt.verify.restore();
  });
});
