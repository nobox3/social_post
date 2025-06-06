import { ReactNode } from 'react'

import ApiResponseErrorProvider from 'src/components/providers/ApiResponseErrorProvider'
import CurrentUserProvider from 'src/components/providers/CurrentUserProvider'
import FlashMessageProvider from 'src/components/providers/FlashMessageProvider'
import ImageViewerProvider from 'src/components/providers/ImageViewerProvider'
import ModalProvider from 'src/components/providers/ModalProvider'
import ProcessingProvider from 'src/components/providers/ProcessingProvider'
import SiteMetaProvider, { I18nParamsForPath } from 'src/components/providers/SiteMetaProvider'
import UserThemeProvider from 'src/components/providers/UserThemeProvider'
import CurrentUser from 'src/core/types/CurrentUser'
import FlashMessage from 'src/core/types/FlashMessage'
// import SearchProvider from 'src/components/providers/SearchProvider'

export type Props = {
	children?: ReactNode
	current_user?: CurrentUser
	flash_messages?: FlashMessage[]
	i18n_params_for_path: I18nParamsForPath
}

function ProvidersIndex({ children, current_user, flash_messages, i18n_params_for_path }: Props) {
	return (
		<UserThemeProvider>
			<ApiResponseErrorProvider>
				<SiteMetaProvider i18n_params_for_path={i18n_params_for_path}>
					<CurrentUserProvider user={current_user}>
						<FlashMessageProvider flashMessagesOnPageLoaded={flash_messages}>
							<ProcessingProvider>
								<ModalProvider>
									<ImageViewerProvider>
										{children}
									</ImageViewerProvider>
									{/* <SearchProvider>{children}</SearchProvider> */}
								</ModalProvider>
							</ProcessingProvider>
						</FlashMessageProvider>
					</CurrentUserProvider>
				</SiteMetaProvider>
			</ApiResponseErrorProvider>
		</UserThemeProvider>
	)
}

export default ProvidersIndex
