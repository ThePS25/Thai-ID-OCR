import express from "express";
import colors from "colors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import usersRoutes from "./routes/Users.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import Info from "./model/model.js";
import { ocrData } from "./ocr.js";
// import router from "./routes/Users.js";
// import usersRoutes from "./routes/userRoutes.js";
const app = express();

//configure env
dotenv.config();

//rest api
app.get("/", (req, res) => {
  res.send("<h1> Welcome to OCR App</h1>");
});

//port
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static("public"));

//route
app.use("/api/users", usersRoutes);

const connectionParams = {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
};

// const db = "mongodb://localhost:27017/OCR";
mongoose
  .connect(process.env.MONGO_URL, connectionParams)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error(`Error connecting to the database: ${err}`);
  });

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected");
});

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URL);
//     console.log(
//       `Connected to MongDB Database ${conn.connection.host}`.bgMagenta.white
//     );
//   } catch (error) {
//     console.log(`Error in MongoDB ${error}`.bgRed.white);
//   }
// };

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/Images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({
  storage,
});

// const data = await ocrData("./public/Images/1701661823701_try2.jpg")
// console.log(data);
app.post("/upload", upload.single("file"), async (req, res) => {
  // console.log(req.body);
  console.log(req.file);
  const path = req.file.destination + "/" + req.file.filename;
  console.log(path);
  const data = await ocrData(path);
  console.log(data);
  Info.create({
    image: req.file.filename,
    identificationNumber: data.identificationNumber,
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth,
    dateOfExpiry: data.dateOfExpiry,
    dateOfIssue: data.dateOfIssue,
  })
    .then((result) => res.json(result))
    .catch((err) => {
      console.log(err);
    });
});

app.use("/", (req, res) => {
  return res.send("OCR-App backend");
});

//run listen
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`.bgCyan.white);
});
