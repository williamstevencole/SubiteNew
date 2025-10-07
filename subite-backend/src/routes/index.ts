import { Router } from "express";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import companiesRoutes from "./companies.routes.js";
import vehiclesRoutes from "./vehicles.routes.js";
import dailyRoutesRoutes from "./dailyRoutes.routes.js";

const router = Router();

// Health check
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "subite-backend",
  });
});

// API routes
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/companies", companiesRoutes);
router.use("/vehicles", vehiclesRoutes);
router.use("/daily-routes", dailyRoutesRoutes);

export default router;
