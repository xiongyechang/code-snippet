import http from '@/http/http';
import { baseURL } from '@/config/config';

const prefix = `/api`;

const CodeSnippetRoute = `/code-snippet`;

const CodeCategoryRoute = `/note-category`;

export default {
	async getCodeSnippets (page = 1, limit = 20) {
		return await http.get(`${baseURL}${prefix}${CodeSnippetRoute}/list?page=${page}&limit=${limit}`);
	},
	async getCodeSnippet (_id) {
		return await http.get(`${baseURL}${prefix}${CodeSnippetRoute}/${_id}`)
	},
	async searchCodeSnippet (keyword = '', limit = 20) {
		return await http.get(`${baseURL}${prefix}${CodeSnippetRoute}/search?keyword=${keyword}&limit=${limit}`);
	},
	async getCodeCategories () {
		return await http.get(`${baseURL}${prefix}${CodeCategoryRoute}/list`);
	},
	async getCodeSnippetsByCategory (_id) {
		return await http.get(`${baseURL}${prefix}${CodeSnippetRoute}/by?categoryId=${_id}`);
	}
}
