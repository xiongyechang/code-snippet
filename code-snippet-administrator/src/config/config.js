const protocol = `http`;
const host = `192.168.124.12`;
// const host = `cs.xiongyechang.com`;
const port = 8888;

let URL = ``;

if (process.env.NODE_ENV === "development") {
    URL = `${protocol}://${host}:${port}`;
} else if (process.env.NODE_ENV === "production") {
    URL = `${protocol}://${host}`;
}

export const baseURL = URL;