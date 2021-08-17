class HttpResponse {
    constructor(success, message) {
        this.success = success;
        this.message = message;
    }
}

class LoginResponse extends HttpResponse {
    constructor(message, token, data) {
        super(true, message);
        this.token = token;
        this.data = data;
    }
}

class SuccessResponse extends HttpResponse {
    constructor(message) {
        super(true, message);
    }
}

class SuccessDataResponse extends HttpResponse {
    constructor(message, data) {
        super(true, message);
        this.data = data;
    }
}

class ErrorResponse extends HttpResponse {
    constructor(message) {
        super(false, message);
    }
}

module.exports = {
    LoginResponse,
    SuccessResponse,
    SuccessDataResponse,
    ErrorResponse
}