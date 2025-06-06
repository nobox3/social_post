import styled from '@emotion/styled'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import {
	ImageList as MuiImageList, ImageListItem, ImageListItemBar, ImageListProps,
	IconButton, SxProps, Theme,
} from '@mui/material'
import { useContext } from 'react'

import { ImageViewerContext } from 'src/components/providers/ImageViewerProvider'
import Attachment from 'src/core/types/Attachment'

type Props = Omit<ImageListProps, 'children'> & {
	disableViewer?: boolean
	handleDeleteImage?: (params: { attachment_id: number }) => void | Promise<void>
	images: Attachment[]
}

function ImageList({
	cols = 3, disableViewer = false, handleDeleteImage, images, ...props
}: Props) {
	const setViewerImages = useContext(ImageViewerContext)

	const itemSx: SxProps<Theme> = handleDeleteImage
		? { '&:not(:hover)': { '& .delete-icon': { display: 'none' } } }
		: {}

	return (
		<MuiImageList cols={cols} {...props}>
			{images.map((image, index) => {
				const { id, url } = image

				return (
					<ImageListItem
						key={id}
						onClick={
							disableViewer
								? undefined
								: (e) => {
									if (e.target instanceof HTMLImageElement) {
										setViewerImages({ images, initialId: id })
									}
								}
						}
						sx={itemSx}
					>
						<SImage
							alt={`image-${index + 1}`}
							className={disableViewer ? '' : 'clickable'}
							src={url}
						/>
						{handleDeleteImage && (
							<ImageListItemBar
								actionIcon={(
									<IconButton
										className="delete-icon"
										onClick={() => handleDeleteImage({ attachment_id: id })}
										size="small"
										sx={{
											'&:hover': { background: 'rgba(219, 219, 219, 0.5)' },
											background: 'rgba(219, 219, 219, 0.7)',
											color: 'black',
										}}
									>
										<HighlightOffOutlinedIcon />
									</IconButton>
								)}
								position="top"
								sx={{ background: 'rgba(0, 0, 0, 0)' }}
							/>
						)}
					</ImageListItem>
				)
			})}
		</MuiImageList>
	)
}

const SImage = styled.img`
	&.clickable {
		cursor: pointer;
	}
`

export default ImageList
