import cors from "cors";

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:3000"];

export default cors({
  origin: allowedOrigins,
  credentials: true,
});
