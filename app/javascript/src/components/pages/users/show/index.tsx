import loadable from '@loadable/component'
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined'
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined'
import { Stack, Divider, Box, Tabs } from '@mui/material'
import { useCallback, useContext, useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import useFetchResource, { ApiServiceWithId } from 'src/components/hooks/useFetchResource'
import Panel from 'src/components/molecules/Panel'
import Sidebar from 'src/components/molecules/Sidebar'
import ToggleFollowButton from 'src/components/molecules/ToggleFollowButton'
import NavItem, { ListItem } from 'src/components/organisms/NavItem'
import SidebarHeader from 'src/components/organisms/SidebarHeader'
import { CurrentUserContext } from 'src/components/providers/CurrentUserProvider'
import { I18nMetaParams, SiteMetaContext } from 'src/components/providers/SiteMetaProvider'
import User from 'src/core/types/User'
import { PostsData } from 'src/services/postsService'
import { getPosts, getFollowers, getFollowings, UsersData } from 'src/services/usersService'
import { splitPathname } from 'src/utils/urlUtils'

const Posts = loadable(() => import('src/components/organisms/UserPostList'))
const Followings = loadable(() => import('src/components/molecules/UserList'))
const Followers = loadable(() => import('src/components/molecules/UserList'))

const pathToResourceKey = () => {
	const key = splitPathname(2)

	switch (key) {
		case 'followings':
		case 'followers':
			return key

		default:
			return 'posts'
	}
}

const MENU_ITEM_KEYS = ['posts', 'followings', 'followers'] as const

type MenuItemKey = typeof MENU_ITEM_KEYS[number]

const MENU_ITEMS: Record<MenuItemKey, ListItem> = {
	followers: { i18nKey: 'user.follower', icon: <PeopleOutlineOutlinedIcon /> },
	followings: { i18nKey: 'user.following', icon: <PeopleOutlineOutlinedIcon /> },
	posts: { i18nKey: 'user.posts', icon: <FeedOutlinedIcon /> },
} as const

const FETCH_RESOURCE_SERVICES: Record<MenuItemKey, ApiServiceWithId<Props>> = {
	followers: getFollowers,
	followings: getFollowings,
	posts: getPosts,
} as const

type Props = Partial<PostsData & UsersData> & {
	user?: User
}

function UsersShowIndex({ user, ...props }: Props) {
	const { t } = useTranslation()
	const { updatePathHistoryWithMeta } = useContext(SiteMetaContext)
	const { isCurrentUser } = useContext(CurrentUserContext)
	const [selectedTab, setSelectedTab] = useState<MenuItemKey>(pathToResourceKey)

	const {
		followers_count = 0, followings_count = 0,
		id: user_id = 0, slug = '', url = '', username = '',
	} = user ?? {}

	const i18nMetaPrams = useMemo<I18nMetaParams>(() => {
		return { interpolation: { user_name: username }, removedSegments: slug }
	}, [slug, username])

	useEffect(() => {
		if (window.location.pathname === url) {
			updatePathHistoryWithMeta(`${url}/posts`, { i18nMetaPrams, isReplace: true })
		}
	}, [i18nMetaPrams, updatePathHistoryWithMeta, url])

	const { fetchResult, handleFetchResource } = useFetchResource<MenuItemKey, Props>({
		apiServicesWithId: FETCH_RESOURCE_SERVICES,
		i18nMetaPrams,
		initialResult: props,
		resourceKeyToPath: url,
	})

	const { posts, total_posts_count, total_users_count, users } = fetchResult

	const renderContent = useCallback(() => {
		switch (selectedTab) {
			case 'posts':
				return (
					<Posts
						apiServiceWithId={getPosts}
						id={user_id}
						resources={posts}
						totalCount={total_posts_count}
					/>
				)

			case 'followings':
				return (
					<Followings
						apiServiceWithId={getFollowings}
						id={user_id}
						resources={users}
						totalCount={total_users_count}
					/>
				)

			case 'followers':
				return (
					<Followers
						apiServiceWithId={getFollowers}
						id={user_id}
						resources={users}
						totalCount={total_users_count}
					/>
				)

			default:
				return null
		}
	}, [posts, selectedTab, total_posts_count, total_users_count, user_id, users])

	return (
		<Stack direction="row" divider={<Divider flexItem orientation="vertical" />}>
			<Sidebar>
				{user && (
					<SidebarHeader user={user}>
						{!isCurrentUser(user) && <ToggleFollowButton user={user} />}
					</SidebarHeader>
				)}
				<Tabs orientation="vertical" value={selectedTab} variant="fullWidth">
					{MENU_ITEM_KEYS.map((key) => {
						let count

						if (key === 'followers') {
							count = followers_count
						} else if (key === 'followings') {
							count = followings_count
						}

						return (
							<NavItem<MenuItemKey>
								key={key}
								count={count}
								menuItems={MENU_ITEMS}
								onClick={async () => {
									await handleFetchResource(key, { id: user_id, replaceParams: true })
									setSelectedTab(key)
								}}
								value={key}
							/>
						)
					})}
				</Tabs>
			</Sidebar>
			<Box sx={{ flexGrow: 1, p: 3 }}>
				<Panel title={t(MENU_ITEMS[selectedTab].i18nKey)}>
					{renderContent()}
				</Panel>
			</Box>
		</Stack>
	)
}

export default UsersShowIndex
