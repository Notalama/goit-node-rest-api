import { jest } from "@jest/globals";

const mockLogin = jest.fn();
const mockHttpError = jest.fn((status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
});

jest.unstable_mockModule("../../services/authServices.js", () => ({
  default: {
    login: mockLogin,
  },
}));

jest.unstable_mockModule("../../helpers/HttpError.js", () => ({
  default: mockHttpError,
}));

const { login } = await import("../../controllers/authControllers.js");

describe("Login Controller", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  describe("Successful login", () => {
    const mockResult = {
      token: "mock-jwt-token",
      user: {
        email: "test@example.com",
        subscription: "starter",
      },
    };

    beforeEach(() => {
      mockLogin.mockResolvedValue(mockResult);
    });

    it("should return status code 200", async () => {
      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return a token", async () => {
      await login(req, res, next);

      expect(res.json.mock.calls[0][0].token).toBe("mock-jwt-token");
    });

    it("should return a user object with email and subscription fields of type String", async () => {
      await login(req, res, next);

      const responseData = res.json.mock.calls[0][0];

      expect(responseData).toHaveProperty("user");
      expect(responseData.user).toBeDefined();

      expect(responseData.user).toHaveProperty("email");
      expect(responseData.user).toHaveProperty("subscription");

      expect(typeof responseData.user.email).toBe("string");
      expect(typeof responseData.user.subscription).toBe("string");

      expect(responseData.user.email).toBe("test@example.com");
      expect(responseData.user.subscription).toBe("starter");
    });

    it("should call authService.login with correct parameters", async () => {
      await login(req, res, next);

      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });

    it("should not call next function on successful login", async () => {
      await login(req, res, next);

      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("Failed login", () => {
    it("should call next with HttpError when login fails", async () => {
      mockLogin.mockResolvedValue(null);
      const mockError = new Error("Email or password is wrong");
      mockError.status = 401;
      mockHttpError.mockReturnValue(mockError);

      await login(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
      expect(mockHttpError).toHaveBeenCalledWith(
        401,
        "Email or password is wrong"
      );
    });

    it("should not call res.status or res.json when login fails", async () => {
      mockLogin.mockResolvedValue(null);
      const mockError = new Error("Email or password is wrong");
      mockError.status = 401;
      mockHttpError.mockReturnValue(mockError);

      await login(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should propagate errors when authService.login throws", async () => {
      const error = new Error("Database connection failed");
      mockLogin.mockRejectedValue(error);

      await expect(login(req, res, next)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });
});
