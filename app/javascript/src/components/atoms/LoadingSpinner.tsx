import styled from '@emotion/styled'
import { useTheme } from '@mui/material'
import { useMemo } from 'react'

type Props = {
	className?: string
	color?: string
	delay?: number
	height?: string
	opacity?: number
	padding?: string
	width?: string
}

function LoadingSpinner({
	className = '',
	color,
	delay,
	opacity = 0.65,
	padding,
	width = '100%',
	height = width,
}: Props) {
	const theme = useTheme()
	const strokeColor = color || theme.palette.action.active

	const spinner = useMemo(() => {
		return (
			<SSvg
				className={`Spinner ${className}`}
				delay={padding ? 0 : delay}
				height={height}
				viewBox="0 0 10 10"
				width={width}
			>
				<SCircle cx="5" cy="5" r="4" stroke={strokeColor} strokeOpacity={0.15} />
				<SCircle className="arc" cx="5" cy="5" r="4" stroke={strokeColor} strokeOpacity={opacity} />
			</SSvg>
		)
	}, [className, delay, height, opacity, padding, strokeColor, width])

	if (padding) {
		return (
			<SWrap delay={delay} padding={padding}>
				{spinner}
			</SWrap>
		)
	}

	return spinner
}

const SWrap = styled.div<{ delay?: number, padding?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ padding = 0 }) => padding};
  animation: show backwards;
  animation-delay: ${({ delay = 0 }) => `${delay}s`};

  @keyframes show {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
`

const SSvg = styled.svg<{ delay?: number }>`
  z-index: 2;
  animation: rotate 2s backwards infinite;
  animation-delay: ${({ delay = 0 }) => `${delay}s`};

  @keyframes rotate {
    0% {
      display: none;
    }

    100% {
      display: block;
      transform: rotate(360deg);
    }
  }
`

const SCircle = styled.circle`
  fill: none;
  stroke-width: 1;
  stroke-linecap: round;

  &.arc {
    animation: dash 2.5s backwards ease-in-out infinite;
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 30;
      stroke-dashoffset: 1;
    }

    50% {
      stroke-dasharray: 18, 30;
      stroke-dashoffset: -6;
    }

    100% {
      stroke-dasharray: 18, 30;
      stroke-dashoffset: -24;
    }
  }
`

export default LoadingSpinner
