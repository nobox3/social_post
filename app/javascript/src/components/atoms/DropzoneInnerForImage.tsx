import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import { Backdrop, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { UseDropzoneUploaderReturn } from 'src/components/hooks/useDropzoneUploader'
import { UseFileAttachWithDropzoneReturn } from 'src/components/hooks/useFileAttachWithDropzone'

type Props = {
	useDropzoneUploaderReturn: UseDropzoneUploaderReturn | UseFileAttachWithDropzoneReturn
}

function DropzoneInnerForImage({ useDropzoneUploaderReturn }: Props) {
	const { t } = useTranslation()
	const { errorMessage, isDragActive } = useDropzoneUploaderReturn

	return (
		<Backdrop
			open={isDragActive}
			sx={(theme) => ({
				color: errorMessage ? theme.palette.error.main : theme.palette.text.primary,
				fontSize: theme.typography.body1.fontSize,
				fontWeight: theme.typography.fontWeightBold,
				position: 'absolute',
				zIndex: theme.zIndex.drawer + 1,
			})}
		>
			<Stack alignItems="center">
				<AddPhotoAlternateOutlinedIcon sx={{ height: '50px', width: '50px' }} />
				{isDragActive && !errorMessage && t('dropzone.drop', { item: t('generic.image') })}
				{errorMessage}
			</Stack>
		</Backdrop>
	)
}

export default DropzoneInnerForImage
