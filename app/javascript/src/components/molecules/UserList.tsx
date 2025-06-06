import { Stack } from '@mui/material'
import { useState, useCallback, useContext } from 'react'

import useInfiniteScroll, { UseInfiniteScrollParams } from 'src/components/hooks/useInfiniteScroll'
import ToggleFollowButton from 'src/components/molecules/ToggleFollowButton'
import UserItem from 'src/components/molecules/UserItem'
import { CurrentUserContext } from 'src/components/providers/CurrentUserProvider'
import User from 'src/core/types/User'
import { UsersData } from 'src/services/usersService'

type Props = Pick<UseInfiniteScrollParams<User, UsersData>, 'apiService' | 'apiServiceWithId' | 'id'> & {
	resources?: User[]
	totalCount?: number
}

function UserList({
	resources: initialResources = [], totalCount: initialTotalCount = 0, ...props
}: Props) {
	const { isCurrentUser } = useContext(CurrentUserContext)
	const [totalCount, setTotalCount] = useState<number>(initialTotalCount)
	const [resources, setResources] = useState<User[]>(initialResources)

	const onAddResources = useCallback(({ total_users_count, users }: UsersData) => {
		setTotalCount(total_users_count)

		return { resources: users }
	}, [])

	const { getEndTargetElementRef } = useInfiniteScroll({
		onAddResources,
		resourcesCount: resources.length,
		setResources,
		...props,
	})

	return (
		<Stack spacing={2}>
			{resources.map((user, index) => {
				return (
					<div key={user.id} ref={getEndTargetElementRef(index, totalCount)}>
						<UserItem user={user}>
							{isCurrentUser(user) ? undefined : <ToggleFollowButton user={user} />}
						</UserItem>
					</div>
				)
			})}
		</Stack>
	)
}

export default UserList
