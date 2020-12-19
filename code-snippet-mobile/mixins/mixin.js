import dayjs from 'dayjs';

export default {
	methods: {
		formatDate(date, format) {
			return dayjs(date).format(format);
		}
	}
}