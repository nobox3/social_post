import loadable from '@loadable/component'
import { Stack, Box, Divider, Tabs } from '@mui/material'
import { useCallback, useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import useFetchResource, { ApiService } from 'src/components/hooks/useFetchResource'
import Panel from 'src/components/molecules/Panel'
import Sidebar from 'src/components/molecules/Sidebar'
import { MenuItemKey, MENU_ITEM_KEYS, MENU_ITEMS } from 'src/components/organisms/Header/AccountMenu'
import NavItem from 'src/components/organisms/NavItem'
import SidebarHeader from 'src/components/organisms/SidebarHeader'
import { CurrentUserContext } from 'src/components/providers/CurrentUserProvider'
import { ProcessingContext } from 'src/components/providers/ProcessingProvider'
import CurrentUser from 'src/core/types/CurrentUser'
import Post from 'src/core/types/Post'
import {
	getFeed, getPosts, getFollowings, getFollowers, getProfile,
	getRegisterInfo, getAppSettings, RegisterInfo as TRegisterInfo, ProfileInfo as TProfileInfo,
} from 'src/services/accountService'
import { PostsData } from 'src/services/postsService'
import { signOut } from 'src/services/userAuthService'
import { UsersData } from 'src/services/usersService'
import { splitPathname } from 'src/utils/urlUtils'

const Feed = loadable(() => import('src/components/pages/accounts/feed'))
const Posts = loadable(() => import('src/components/organisms/UserPostList'))
const Followings = loadable(() => import('src/components/molecules/UserList'))
const Followers = loadable(() => import('src/components/molecules/UserList'))
const Profile = loadable(() => import('src/components/pages/accounts/profile'))
const RegisterInfo = loadable(() => import('src/components/pages/accounts/register_info'))
const AppSettings = loadable(() => import('src/components/pages/accounts/app_settings'))

const pathToResourceKey = () => {
	const key = splitPathname(1)

	switch (key) {
		case 'posts':
		case 'followings':
		case 'followers':
		case 'profile':
		case 'register_info':
		case 'app_settings':
			return key

		default:
			return 'feed'
	}
}

type TargetResourceKey = Exclude<MenuItemKey, 'logout'>

const FETCH_RESOURCE_SERVICES: Record<TargetResourceKey, ApiService<Props>> = {
	app_settings: getAppSettings,
	feed: getFeed,
	followers: getFollowers,
	followings: getFollowings,
	posts: getPosts,
	profile: getProfile,
	register_info: getRegisterInfo,
} as const

type Props = Partial<PostsData & UsersData> & {
	draft_post?: Post
	profile_info?: TProfileInfo
	register_info?: TRegisterInfo
	user?: Partial<CurrentUser>
}

function AccountsIndex({ ...props }: Props) {
	const { t } = useTranslation()
	const { currentUser } = useContext(CurrentUserContext)
	const { handleProcessing } = useContext(ProcessingContext)
	const [selectedTab, setSelectedTab] = useState<TargetResourceKey>(pathToResourceKey)
	const { followers_count = 0, followings_count = 0 } = currentUser ?? {}

	const { fetchResult, handleFetchResource } = useFetchResource<TargetResourceKey, Props>({
		apiServices: FETCH_RESOURCE_SERVICES,
		initialResult: props,
		resourceKeyToPath: '/account',
	})

	const {
		draft_post, posts, profile_info, register_info, total_posts_count, total_users_count, users,
	} = fetchResult

	const renderContent = useCallback(() => {
		switch (selectedTab) {
			case 'feed':
				return <Feed draft_post={draft_post} resources={posts} totalCount={total_posts_count} />

			case 'posts':
				return (
					<Posts apiService={getPosts} resources={posts} totalCount={total_posts_count} />
				)

			case 'followings':
				return (
					<Followings apiService={getFollowings} resources={users} totalCount={total_users_count} />
				)

			case 'followers':
				return (
					<Followers apiService={getFollowers} resources={users} totalCount={total_users_count} />
				)

			case 'profile':
				return <Profile profile_info={profile_info} />

			case 'register_info':
				return <RegisterInfo register_info={register_info} />

			case 'app_settings':
				return <AppSettings />

			default:
				return null
		}
	}, [
		draft_post, posts, profile_info, register_info,
		selectedTab, total_posts_count, total_users_count, users,
	])

	return (
		<Stack direction="row" divider={<Divider flexItem orientation="vertical" />}>
			<Sidebar>
				{currentUser && <SidebarHeader user={currentUser} />}
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
								divider={key === 'profile' || key === 'logout'}
								menuItems={MENU_ITEMS}
								onClick={async () => {
									if (key === 'logout') {
										await handleProcessing('sign_out', signOut, { redirectOnSuccess: true })
									} else {
										await handleFetchResource(key, { replaceParams: true })
										setSelectedTab(key)
									}
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

export default AccountsIndex
