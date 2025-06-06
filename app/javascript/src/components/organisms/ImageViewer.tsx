import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { IconButton, Stack, Modal, Box } from '@mui/material'
import { useState, useEffect } from 'react'

import LoadingSpinner from 'src/components/atoms/LoadingSpinner'
import Attachment from 'src/core/types/Attachment'
import { getViewerImage } from 'src/services/attachmentsService'

export type ViewerImages = {
	images: Attachment[]
	initialId?: number
}

type Props = {
	handleCloseViewer: () => void
	viewerImages: ViewerImages
}

function ImageViewer({ handleCloseViewer, viewerImages }: Props) {
	const { images, initialId } = viewerImages
	const imagesLength = images.length

	const [imageLoaded, setImageLoaded] = useState<boolean>(false)
	const [selectedIndex, setSelectedIndex] = useState<number>(
		initialId ? images.findIndex((image) => image.id === initialId) : 0,
	)
	const [rawImageUrls, setRawImageUrls] = useState<string[]>(Array(imagesLength).fill(''))
	const rawImageUrl = rawImageUrls[selectedIndex]

	useEffect(() => {
		if (!rawImageUrl) {
			void getViewerImage(images[selectedIndex].id).then(({ url }) => {
				setRawImageUrls((current) => {
					current[selectedIndex] = url

					return [...current]
				})
			})
		}
	}, [images, selectedIndex, rawImageUrl])

	return (
		<Modal onClose={handleCloseViewer} open>
			<Stack sx={{ overflow: 'scroll' }}>
				<Stack
					alignItems="center"
					justifyContent="center"
					spacing={2}
					sx={{ height: '100vh', margin: 'auto' }}
				>
					<IconButton onClick={() => handleCloseViewer()} size="large" sx={{ alignSelf: 'flex-end' }}>
						<CancelOutlinedIcon />
					</IconButton>
					<Stack alignItems="center" direction="row" justifyContent="center" spacing={2}>
						<IconButton
							onClick={() => {
								setSelectedIndex((current) => current - 1)
								setImageLoaded(false)
							}}
							size="large"
							sx={{ visibility: selectedIndex === 0 ? 'hidden' : 'visible' }}
						>
							<ArrowBackIosOutlinedIcon />
						</IconButton>
						<Stack
							alignItems="center"
							direction="row"
							justifyContent="center"
							sx={{ minHeight: '80vh', minWidth: '80vw' }}
						>
							<>
								{!imageLoaded && <LoadingSpinner delay={0.2} width="20%" />}
								{rawImageUrl && (
									<Box
										alt={`viewer-img-${selectedIndex + 1}`}
										component="img"
										onLoad={() => setImageLoaded(true)}
										src={rawImageUrl}
										sx={{
											display: imageLoaded ? 'block' : 'none',
											maxHeight: '80vh', maxWidth: '80vw', objectFit: 'contain', verticalAlign: 'top',
										}}
									/>
								)}
							</>
						</Stack>
						<IconButton
							onClick={() => {
								setSelectedIndex((current) => current + 1)
								setImageLoaded(false)
							}}
							size="large"
							sx={{ visibility: selectedIndex === imagesLength - 1 ? 'hidden' : 'visible' }}
						>
							<ArrowForwardIosOutlinedIcon />
						</IconButton>
					</Stack>
					<Box>{`${selectedIndex + 1} / ${imagesLength}`}</Box>
				</Stack>
			</Stack>
		</Modal>
	)
}

export default ImageViewer
