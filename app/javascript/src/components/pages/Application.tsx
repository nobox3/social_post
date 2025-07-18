import loadable from '@loadable/component'
import { CssBaseline } from '@mui/material'
import { useLayoutEffect } from 'react'

import Header from 'src/components/organisms/Header'
import HandleApiResponseError from 'src/components/pages/HandleApiResponseError'
import Providers, { Props as ProvidersProps } from 'src/components/providers'

type PageComponentProps = {
	page_component_path: string
}

const PageComponent = loadable(
	(props: PageComponentProps) => import(`src/components/pages${props.page_component_path}`),
)

type Props = PageComponentProps & Omit<ProvidersProps, 'children'>

function Application({ current_user, flash_messages, i18n_params_for_path, ...props }: Props) {
	useLayoutEffect(() => {
		document.getElementById('page-loading')?.remove()
	}, [])

	return (
		<Providers
			current_user={current_user}
			flash_messages={flash_messages}
			i18n_params_for_path={i18n_params_for_path}
		>
			<HandleApiResponseError>
				<CssBaseline />
				<header>
					<Header />
				</header>
				<main>
					<PageComponent {...props} />
				</main>
			</HandleApiResponseError>
		</Providers>
	)
}

export default Application
