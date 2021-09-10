import { Express, Router } from 'express'
import fg from 'fast-glob'

// Busca todos os arquivos da pasta routes com terminação routes.ts e gera uma rota

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  fg.sync('**/src/main/routes/**routes.ts').map(async file => {
    const route = (await import(`../../../${file}`)).default
    route(router)
  })
}
