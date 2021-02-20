const protocol = `http`;
let URL = ``;
if (process.env.NODE_ENV === "development") {
	const host = /*`192.168.43.80`; // `192.168.1.4`; //*/ `192.168.124.12`;
	const port = 8888;
    URL = `${protocol}://${host}:${port}`;
} else if (process.env.NODE_ENV === "production") {
	const host = `cs.xiongyechang.com`;
    URL = `${protocol}://${host}`;
}

export const baseURL = URL;