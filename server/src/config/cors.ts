import cors from "cors";

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"];

export default cors({
  origin: allowedOrigins,
  credentials: true,
});
