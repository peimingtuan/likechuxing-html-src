/**
 * Created by garvey on 2017/9/13.
 */
export default function (template, data) {
	return template.replace(/\$\w+\$/g, match => {
		let key = match.substring(1, match.length - 1)
		return data.hasOwnProperty(key) ? data[key] : match
	})
}