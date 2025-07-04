var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function addWrapper(reply, input) {
    return __awaiter(this, void 0, void 0, function* () {
        let index = yield reply.viewAsync("frame");
        let content = yield reply.viewAsync(input);
        return index.replace("%%CONTENT%%", content);
    });
}
export function defineRoutes(fastify) {
    fastify.get('/game', (request, reply) => __awaiter(this, void 0, void 0, function* () {
        if (!request.headers["referer"])
            return addWrapper(reply, "game");
        else
            return reply.view("game");
    }));
    fastify.get('/tournament', (request, reply) => __awaiter(this, void 0, void 0, function* () {
        if (!request.headers["referer"])
            return addWrapper(reply, "tournament");
        else
            return reply.view("tournament");
    }));
    fastify.get('/', (request, reply) => __awaiter(this, void 0, void 0, function* () {
        if (!request.headers["referer"])
            return addWrapper(reply, "home");
        else
            return reply.view("home");
    }));
}
