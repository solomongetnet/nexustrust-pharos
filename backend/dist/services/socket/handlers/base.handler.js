export class BaseSocketHandler {
    io;
    socket;
    state;
    constructor(io, socket, state) {
        this.io = io;
        this.socket = socket;
        this.state = state;
        this.register();
    }
}
