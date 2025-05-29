import {Hono} from 'hono';
import nunjucks from 'nunjucks';

const isDev = process.env.NODE_ENV !== 'production';

export default function seedServ() {
    const app = new Hono();

    // Define your Hono route
    app.get('/', (c) => {
        const html = nunjucks.render('./templates/index.njk', {dev: isDev});
        return c.html(html);
    });

    return {
        name: 'vite:seed-serv',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const request = new Request(`http://localhost${req.url}`, {
                    method: req.method,
                    headers: req.headers,
                });
                const response = await app.fetch(request);
                if (response.status === 404) {
                    next();
                    return;
                }
                res.statusCode = response.status;
                response.headers.forEach((value, key) => {
                    res.setHeader(key, value);
                });
                const body = await response.arrayBuffer();
                res.end(Buffer.from(body));
            });
        },
    };
};

