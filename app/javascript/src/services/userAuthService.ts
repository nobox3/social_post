import { httpClientFor } from 'src/core/axiosHttpClient'

const api = httpClientFor('/users')

// Session
export async function signIn(params: { email: string, password: string, remember_me?: boolean }) {
	const { headers } = await api.post('/sign_in', params)

	return { redirect_path: headers.location }
}

export async function signOut() {
	const { data } = await api.delete('/sign_out')

	return data
}

// Registration
export async function signUp(params: { email: string, password: string, theme_mode: string }) {
	const { data } = await api.post('', params)

	return data
}

export const updateRegistration = async (params: {
	current_password?: string
	email?: string
	password?: string
}) => {
	const { data } = await api.put('', params)

	return data
}

export const deleteUser = async () => {
	const { data } = await api.delete('')

	return data
}

// Email confirmation
export const createConfirmationInstruction = async (params: { email: string }) => {
	const { headers } = await api.post('/confirmation', params)

	return { redirect_path: headers.location }
}

// Password reset
export const createPasswordResetInstruction = async (params: { email: string }) => {
	const { headers } = await api.post('/password', params)

	return { redirect_path: headers.location }
}

export const resetPassword = async (
	params: { password: string, reset_password_token: string | null },
) => {
	const { headers } = await api.put('/password', params)

	return { redirect_path: headers.location }
}

// Unlock
export const createUnlockInstruction = async (params: { email: string }) => {
	const { headers } = await api.post('/unlock', params)

	return { redirect_path: headers.location }
}
