const protocol = `http`;
const host = `192.168.124.12`;
// const host = `192.168.43.80`;
const port = 8888;

const devURL = `${protocol}://${host}:${port}`;
const prodURL = `${protocol}://cs.xiongyechang.com`;

// export const baseURL = devURL;
export const baseURL = prodURL;