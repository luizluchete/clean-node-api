import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

// Busca todos os arquivos da pasta routes com terminação routes.ts e gera uma rota
export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(path.resolve(__dirname, '..', 'routes')).map(async file => {
    if (!file.includes('.test.')) {
      (await import (`../routes/${file}`)).default(router)
    }
  })
}
