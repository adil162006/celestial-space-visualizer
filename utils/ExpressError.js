class ExpressError extends Error {
    constructor(status, message) {
        super(message);  // pass message to base Error constructor
        this.status = status;  // now correctly assigned
        this.message = message;
    }
}
module.exports = ExpressError;