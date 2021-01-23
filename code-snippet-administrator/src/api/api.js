import http from '@/http/http';
import { baseURL } from '@/config/config';

const prefix = `/api`;

const CodeSnippetRoute = `/code-snippet`;

const CodeCategoryRoute = `/code-category`;

const AdminRoute = `/admin`;

export default {
	async addCodeSnippet (codesnippet) {
		return await http.post(`${baseURL}${prefix}${CodeSnippetRoute}`, codesnippet);
	},
	async updateCodeSnippet (codesnippet) {
		return await http.put(`${baseURL}${prefix}${CodeSnippetRoute}`, codesnippet);
	},
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
	async getCodeSnippetsByCategory ({ _id }) {
		return await http.get(`${baseURL}${prefix}${CodeSnippetRoute}/by?categoryId=${_id}`);
	},
	async addCategory (category) {
		return await http.post(`${baseURL}${prefix}${CodeCategoryRoute}`, category);
	},
	async removeCategory ({ _id }) {
		return await http.delete(`${baseURL}${prefix}${CodeCategoryRoute}?_id=${_id}`);
	},
	async updateCategory (category) {
		return await http.put(`${baseURL}${prefix}${CodeCategoryRoute}`, category);
	},
	async getQiniuToken() {
		return await http.get(`${baseURL}${prefix}${AdminRoute}/getQiniuToken`);
	},
	async getQiniuDomain() {
		return await http.get(`${baseURL}${prefix}${AdminRoute}/getQiniuDomain`);
	},
}
