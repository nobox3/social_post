import { Button, Stack, Typography, Divider, DialogContent, Input } from '@mui/material'
import { useState, useContext, Dispatch, SetStateAction, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import DropzoneInnerForImage from 'src/components/atoms/DropzoneInnerForImage'
import useDropzoneUploader from 'src/components/hooks/useDropzoneUploader'
import UserAvatar from 'src/components/molecules/UserAvatar'
import ImageCropper from 'src/components/organisms/ImageCropper'
import { CroppedImage } from 'src/components/pages/accounts/profile'
import { CurrentUserContext } from 'src/components/providers/CurrentUserProvider'

type Props = {
	avatarUrl?: string
	closeModal: () => void
	setCroppedImage: Dispatch<SetStateAction<CroppedImage | null>>
}

function AvatarImageModal({ avatarUrl, closeModal, setCroppedImage }: Props) {
	const { t } = useTranslation()
	const { currentUser } = useContext(CurrentUserContext)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)

	const useDropzoneUploaderReturn = useDropzoneUploader({
		currentCount: 0,
		maxFiles: 1,
		onDropAccepted: useCallback((files: File[]) => setSelectedFile(files[0]), []),
	})

	const { getInputProps, getRootProps } = useDropzoneUploaderReturn

	return (
		<DialogContent {...(selectedFile ? {} : getRootProps())} sx={{ position: 'relative' }}>
			{!selectedFile
				&& <DropzoneInnerForImage useDropzoneUploaderReturn={useDropzoneUploaderReturn} />}
			<Stack spacing={2}>
				<Typography fontWeight="bold">{t('user.account.avatar_image')}</Typography>
				<Divider />
				{selectedFile ? (
					<ImageCropper
						handleCropImage={(croppedCanvas: HTMLCanvasElement) => {
							const { type } = selectedFile

							croppedCanvas.toBlob((blob) => {
								if (blob) {
									setCroppedImage({
										file: new File([blob], 'image', { type }),
										url: croppedCanvas.toDataURL(),
									})
								}

								setSelectedFile(null)
								closeModal()
							}, type)
						}}
						src={URL.createObjectURL(selectedFile)}
					/>
				) : (
					<Stack alignItems="center" spacing={1}>
						<UserAvatar
							avatarUrl={avatarUrl}
							sx={{ fontSize: '5rem', height: 180, width: 180 }}
							user={currentUser}
						/>
						<Button component="label">
							<Input inputProps={getInputProps()} />
							{t('generic.select_image')}
						</Button>
						<Typography>or</Typography>
						<Typography variant="body2">
							{t('dropzone.select_or_drag_and_drop', { item: t('generic.image') })}
						</Typography>
					</Stack>
				)}
			</Stack>
		</DialogContent>
	)
}

export default AvatarImageModal
