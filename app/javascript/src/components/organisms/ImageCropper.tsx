import styled from '@emotion/styled'
import { Button, Stack } from '@mui/material'
import { useRef } from 'react'
import Cropper, { ReactCropperElement, ReactCropperProps } from 'react-cropper'
import { useTranslation } from 'react-i18next'

type Props = Omit<ReactCropperProps, 'ref'> & {
	handleCropImage: (croppedCanvas: HTMLCanvasElement) => void
}

function ImageCropper({
	aspectRatio = 1,
	autoCropArea = 1,
	cropBoxMovable = true,
	cropBoxResizable = true,
	guides = false,
	handleCropImage,
	scalable = true,
	style = { height: '350px', width: '100%' },
	...props
}: Props) {
	const { t } = useTranslation()
	const cropperRef = useRef<ReactCropperElement>(null)

	return (
		<Stack spacing={2}>
			<SCropper>
				<Cropper
					ref={cropperRef}
					aspectRatio={aspectRatio}
					autoCropArea={autoCropArea}
					cropBoxMovable={cropBoxMovable}
					cropBoxResizable={cropBoxResizable}
					guides={guides}
					scalable={scalable}
					style={style}
					{...props}
				/>
			</SCropper>
			<Button
				onClick={() => {
					const croppedCanvas = cropperRef?.current?.cropper.getCroppedCanvas()

					croppedCanvas && handleCropImage(croppedCanvas)
				}}
			>
				{t('generic.cut_out')}
			</Button>
		</Stack>
	)
}

// cropperjs/dist/cropper.css
const SCropper = styled.div`
  .cropper-container {
    position: relative;
    font-size: 0;
    line-height: 0;
    touch-action: none;
    user-select: none;
    direction: ltr;
  }

  .cropper-container img {
    display: block;
    width: 100%;
    min-width: 0 !important;
    max-width: none !important;
    height: 100%;
    min-height: 0 !important;
    max-height: none !important;
    image-orientation: 0deg;
    backface-visibility: hidden;
  }

  .cropper-wrap-box,
  .cropper-canvas,
  .cropper-drag-box,
  .cropper-crop-box,
  .cropper-modal {
    position: absolute;
    inset: 0;
  }

  .cropper-wrap-box,
  .cropper-canvas {
    overflow: hidden;
  }

  .cropper-drag-box {
    background-color: #fff;
    opacity: 0;
  }

  .cropper-modal {
    background-color: #000;
    opacity: 0.5;
  }

  .cropper-view-box {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    outline: 1px solid #39f;
    outline-color: rgb(51 153 255 / 75%);
  }

  .cropper-dashed {
    position: absolute;
    display: block;
    border: 0 dashed #eee;
    opacity: 0.5;
  }

  .cropper-dashed.dashed-h {
    top: calc(100% / 3);
    left: 0;
    width: 100%;
    height: calc(100% / 3);
    border-top-width: 1px;
    border-bottom-width: 1px;
  }

  .cropper-dashed.dashed-v {
    top: 0;
    left: calc(100% / 3);
    width: calc(100% / 3);
    height: 100%;
    border-right-width: 1px;
    border-left-width: 1px;
  }

  .cropper-center {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 0;
    height: 0;
    opacity: 0.75;
  }

  .cropper-center::before,
  .cropper-center::after {
    position: absolute;
    display: block;
    content: ' ';
    background-color: #eee;
  }

  .cropper-center::before {
    top: 0;
    left: -3px;
    width: 7px;
    height: 1px;
  }

  .cropper-center::after {
    top: -3px;
    left: 0;
    width: 1px;
    height: 7px;
  }

  .cropper-face,
  .cropper-line,
  .cropper-point {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0.1;
  }

  .cropper-face {
    top: 0;
    left: 0;
    background-color: #fff;
  }

  .cropper-line {
    background-color: #39f;
  }

  .cropper-line.line-e {
    top: 0;
    right: -3px;
    width: 5px;
    cursor: ew-resize;
  }

  .cropper-line.line-n {
    top: -3px;
    left: 0;
    height: 5px;
    cursor: ns-resize;
  }

  .cropper-line.line-w {
    top: 0;
    left: -3px;
    width: 5px;
    cursor: ew-resize;
  }

  .cropper-line.line-s {
    bottom: -3px;
    left: 0;
    height: 5px;
    cursor: ns-resize;
  }

  .cropper-point {
    width: 5px;
    height: 5px;
    background-color: #39f;
    opacity: 0.75;
  }

  .cropper-point.point-e {
    top: 50%;
    right: -3px;
    margin-top: -3px;
    cursor: ew-resize;
  }

  .cropper-point.point-n {
    top: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: ns-resize;
  }

  .cropper-point.point-w {
    top: 50%;
    left: -3px;
    margin-top: -3px;
    cursor: ew-resize;
  }

  .cropper-point.point-s {
    bottom: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: s-resize;
  }

  .cropper-point.point-ne {
    top: -3px;
    right: -3px;
    cursor: nesw-resize;
  }

  .cropper-point.point-nw {
    top: -3px;
    left: -3px;
    cursor: nwse-resize;
  }

  .cropper-point.point-sw {
    bottom: -3px;
    left: -3px;
    cursor: nesw-resize;
  }

  .cropper-point.point-se {
    right: -3px;
    bottom: -3px;
    width: 20px;
    height: 20px;
    cursor: nwse-resize;
    opacity: 1;
  }

  @media (width >= 768px) {
    .cropper-point.point-se {
      width: 15px;
      height: 15px;
    }
  }

  @media (width >= 992px) {
    .cropper-point.point-se {
      width: 10px;
      height: 10px;
    }
  }

  @media (width >= 1200px) {
    .cropper-point.point-se {
      width: 5px;
      height: 5px;
      opacity: 0.75;
    }
  }

  .cropper-point.point-se::before {
    position: absolute;
    right: -50%;
    bottom: -50%;
    display: block;
    width: 200%;
    height: 200%;
    content: ' ';
    background-color: #39f;
    opacity: 0;
  }

  .cropper-invisible {
    opacity: 0;
  }

  .cropper-bg {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
  }

  .cropper-hide {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
  }

  .cropper-hidden {
    display: none !important;
  }

  .cropper-move {
    cursor: move;
  }

  .cropper-crop {
    cursor: crosshair;
  }

  .cropper-disabled .cropper-drag-box,
  .cropper-disabled .cropper-face,
  .cropper-disabled .cropper-line,
  .cropper-disabled .cropper-point {
    cursor: not-allowed;
  }
`

export default ImageCropper
