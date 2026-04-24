import express, { Application } from 'express'
import Routes from './routes/index'
import cors from 'cors'
import { errorHandler } from './middleware/ErrorHandler'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'

const app: Application = express()

app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:6060', 'https://fullstack-project-phi-nine.vercel.app', 'https://beanbrew.vercel.app'],
    credentials: true
}))
app.use(express.json({ limit: "50mb" }))

app.use(helmet())
app.use(Routes)

app.use(errorHandler)
export default app
