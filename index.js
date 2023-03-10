import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url"
import register from './controllers/auth.js';
import authRoutes from "./routes/auth.routes.js"
import usersRoutes from "./routes/users.routes.js"
import postRoutes from "./routes/post.routes.js"
import verifyJwt from './middlewares/verifyJwt.js';
import { createPost } from './controllers/createPost.js';


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()

const app = express()

app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ "policy": "cross-origin" }))
app.use(morgan('common'))
app.use(bodyParser.json({ limit: "300mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "300mb", extended: true }))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, 'public/assets')))




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({storage})


app.use('/auth', authRoutes)

app.post('/post/create', verifyJwt, createPost)

app.use('/users', usersRoutes)
app.use('/posts', postRoutes)


// mongoose connect
const PORT = process.env.PORT || 8080;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    app.listen(PORT, ()=> console.log(`server has been connected to ${PORT}`))
})
.catch((error)=> console.log(error, `did not connect to ${PORT}`))