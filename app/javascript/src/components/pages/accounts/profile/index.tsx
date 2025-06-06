import { Divider, Stack, Button } from '@mui/material'
import { useCallback, useContext, useState } from 'react'
import { useForm } from 'react-hook-form'

import InputTextForm from 'src/components/atoms/InputTextForm'
import useTranslationWithModel from 'src/components/hooks/useTranslationWithModel'
import FormContainer from 'src/components/molecules/FormContainer'
import UserAvatar from 'src/components/molecules/UserAvatar'
import AvatarImageModal from 'src/components/pages/accounts/profile/AvatarImageModal'
import { CurrentUserContext } from 'src/components/providers/CurrentUserProvider'
import { ModalContext } from 'src/components/providers/ModalProvider'
import { updateUser, ProfileInfo } from 'src/services/accountService'

export type CroppedImage = {
	file: File
	url: string
}

type FormInputs = {
	username: string
}

type Props = {
	profile_info?: ProfileInfo
}

function ProfileIndex({ profile_info }: Props) {
	const { t, tModel } = useTranslationWithModel()
	const { currentUser, mergeCurrentUser } = useContext(CurrentUserContext)
	const { closeModal, showModal } = useContext(ModalContext)

	const [croppedImage, setCroppedImage] = useState<CroppedImage | null>(null)
	const [largeAvatarUrl, setLargeAvatarUrl] = useState<string>(profile_info?.avatar_url_large ?? '')
	const displayedAvatarUrl = croppedImage?.url || largeAvatarUrl
	const useFormReturn = useForm<FormInputs>({ defaultValues: { username: currentUser?.username } })

	const showAvatarModal = useCallback(() => {
		showModal({
			content: (
				<AvatarImageModal
					avatarUrl={displayedAvatarUrl}
					closeModal={closeModal}
					setCroppedImage={setCroppedImage}
				/>
			),
		})
	}, [displayedAvatarUrl, closeModal, showModal])

	return (
		<FormContainer
			buttonProps={{ children: t('generic.update') }}
			handleApi={(values) => {
				return updateUser(croppedImage ? { ...values, avatar: croppedImage.file } : values)
			}}
			onSubmitSucceeded={({ user }, values) => {
				croppedImage && setLargeAvatarUrl(croppedImage.url)
				mergeCurrentUser({ ...values, ...user })
				setCroppedImage(null)
			}}
			processingKey="edit_profile"
			title=""
			useFormReturn={useFormReturn}
		>
			<Stack spacing={4}>
				<Stack alignItems="center" direction="row" justifyContent="center" sx={{ position: 'relative' }}>
					<UserAvatar
						avatarUrl={displayedAvatarUrl}
						onClick={showAvatarModal}
						sx={{ fontSize: '4rem', height: 150, width: 150 }}
						user={currentUser}
					/>
					<Button
						onClick={showAvatarModal}
						sx={{ bottom: '0', left: 'calc(50% + 75px)', position: 'absolute' }}
					>
						{t('generic.change')}
					</Button>
				</Stack>
				<Divider />
				<InputTextForm
					label={tModel('user', 'username')}
					name="username"
					required
					useFormReturn={useFormReturn}
				/>
			</Stack>
		</FormContainer>
	)
}

export default ProfileIndex
