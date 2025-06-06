import { useState, ReactNode, useMemo, createContext, Dispatch, SetStateAction, useCallback } from 'react'

import CurrentUser from 'src/core/types/CurrentUser'
import User from 'src/core/types/User'

type CurrentUserProviderValue = {
	currentUser: CurrentUser | null
	isCurrentUser: (target: User) => boolean
	mergeCurrentUser: (properties: Partial<CurrentUser>) => void
	setCurrentUser: Dispatch<SetStateAction<CurrentUser | null>>
}

export const CurrentUserContext = createContext<CurrentUserProviderValue>({
	currentUser: null,
	isCurrentUser: () => false,
	mergeCurrentUser: () => {},
	setCurrentUser: () => {},
})

type Props = {
	children: ReactNode
	user?: CurrentUser
}

function CurrentUserProvider({ children, user }: Props) {
	const [currentUser, setCurrentUser] = useState<CurrentUser | null>(user ?? null)

	const mergeCurrentUser = useCallback((properties: Partial<CurrentUser>) => {
		setCurrentUser((current) => {
			if (current) {
				return { ...current, ...properties }
			}

			return properties.id ? properties as CurrentUser : current
		})
	}, [])

	const isCurrentUser = useCallback(
		(target: User) => !!(currentUser && target?.id === currentUser.id),
		[currentUser],
	)

	const providerValue = useMemo(() => {
		return { currentUser, isCurrentUser, mergeCurrentUser, setCurrentUser }
	}, [currentUser, isCurrentUser, mergeCurrentUser])

	return (
		<CurrentUserContext.Provider value={providerValue}>
			{children}
		</CurrentUserContext.Provider>
	)
}

export default CurrentUserProvider
