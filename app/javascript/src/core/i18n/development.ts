import i18next from 'i18next'
import { HMRPlugin } from 'i18next-hmr/plugin'

import { initOptions } from 'src/core/i18n/commonConfig'

initOptions.debug = true
i18next.use(new HMRPlugin({ webpack: { client: typeof window !== 'undefined' } }))

void i18next.init(initOptions)
