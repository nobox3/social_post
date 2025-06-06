import { createContext, ReactNode, useState, Dispatch, SetStateAction } from 'react'

import ImageViewer, { ViewerImages } from 'src/components/organisms/ImageViewer'

export const ImageViewerContext = createContext<Dispatch<SetStateAction<ViewerImages | null>>>(
	() => {},
)

type Props = {
	children: ReactNode
}

function ImageViewerProvider({ children }: Props) {
	const [viewerImages, setViewerImages] = useState<ViewerImages | null>(null)

	return (
		<>
			{viewerImages && (
				<ImageViewer
					handleCloseViewer={() => setViewerImages(null)}
					viewerImages={viewerImages}
				/>
			)}
			<ImageViewerContext.Provider value={setViewerImages}>{children}</ImageViewerContext.Provider>
		</>
	)
}

export default ImageViewerProvider
