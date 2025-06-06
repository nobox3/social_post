// Convert to FormData from params object.
type FormDataValue = string | number | boolean | Blob
type FormDataParams = Record<
	string,
	| null
	| FormDataValue
	| FormDataValue[]
	| Record<string, FormDataValue>[]
	| Record<string, FormDataValue[]>[]
>

function appendValueToFormData(formData: FormData, field: string, value: FormDataValue) {
	formData.append(field, typeof value === 'number' || typeof value === 'boolean' ? `${value}` : value)
}

function appendParamsToFormData(formData: FormData, field: string, params: FormDataParams) {
	Object.entries(params).forEach(([key, value]) => {
		if (Array.isArray(value)) {
			// const childField = `${field}[${key}][]`
			const childField = field ? `${field}[${key}][]` : `${key}[]`

			value.forEach((child) => {
				if (child instanceof Blob || !(typeof child === 'object')) {
					appendValueToFormData(formData, childField, child)
				} else {
					appendParamsToFormData(formData, childField, child)
				}
			})
		} else {
			// value !== null && appendValueToFormData(formData, `${field}[${key}]`, value)
			value !== null && appendValueToFormData(formData, field ? `${field}[${key}]` : key, value)
		}
	})
}

export default function toFormData(field: string, params: FormDataParams) {
	const formData = new FormData()

	appendParamsToFormData(formData, field, params)

	return formData
}
