export class Router {
    constructor(fastify) {
        this.fastify = fastify;
    }
    async addFrame(reply, input) {
        let index = await reply.viewAsync("frame");
        let content = await reply.viewAsync(input);
        return index.replace("%%CONTENT%%", content);
    }
}
