import { createConsumer, Consumer, Subscription, Mixin, ChannelNameWithParams } from '@rails/actioncable'
import { useState, ReactNode, useMemo, createContext, Dispatch, SetStateAction, useCallback } from 'react'

import CurrentUser from 'src/core/types/CurrentUser'
import User from 'src/core/types/User'

export type ActionCableChannel = Subscription<Consumer> & Mixin

type CurrentUserProviderValue = {
	createSubscription: (channel: ChannelNameWithParams, mixin?: Mixin) => ActionCableChannel | null
	currentUser: CurrentUser | null
	currentUserId: number | null
	isCurrentUser: (target: User) => boolean
	isSignedIn: boolean
	mergeCurrentUser: (properties: Partial<CurrentUser>) => void
	setCurrentUser: Dispatch<SetStateAction<CurrentUser | null>>
}

export const CurrentUserContext = createContext<CurrentUserProviderValue>({
	createSubscription: () => null,
	currentUser: null,
	currentUserId: null,
	isCurrentUser: () => false,
	isSignedIn: false,
	mergeCurrentUser: () => {},
	setCurrentUser: () => {},
})

type Props = {
	children: ReactNode
	user?: CurrentUser
}

function CurrentUserProvider({ children, user }: Props) {
	const [currentUser, setCurrentUser] = useState<CurrentUser | null>(user ?? null)
	const currentUserId = currentUser?.id ?? null
	const isSignedIn = !!currentUserId
	const consumer = useMemo(() => (isSignedIn ? createConsumer() : null), [isSignedIn])

	const createSubscription = useCallback(
		(channel: ChannelNameWithParams, mixin: Mixin = {}): ActionCableChannel | null => {
			return consumer?.subscriptions.create<Mixin>(channel, { ...mixin }) ?? null
		},
		[consumer],
	)

	const mergeCurrentUser = useCallback((properties: Partial<CurrentUser>) => {
		setCurrentUser((current) => {
			if (current) {
				return { ...current, ...properties }
			}

			return properties.id ? properties as CurrentUser : current
		})
	}, [])

	const isCurrentUser = useCallback(
		(target: User) => !!currentUserId && target?.id === currentUserId,
		[currentUserId],
	)

	const providerValue = useMemo(() => {
		return {
			createSubscription, currentUser, currentUserId,
			isCurrentUser, isSignedIn, mergeCurrentUser, setCurrentUser,
		}
	}, [createSubscription, currentUser, currentUserId, isCurrentUser, isSignedIn, mergeCurrentUser])

	return (
		<CurrentUserContext.Provider value={providerValue}>
			{children}
		</CurrentUserContext.Provider>
	)
}

export default CurrentUserProvider
