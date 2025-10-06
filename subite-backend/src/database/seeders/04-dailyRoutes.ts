import { DailyRoute, Vehicle, User } from "../models/index.js";
import { UserRole } from "../../types/auth.js";
import { logger } from "../../utils/logger.js";

export const seedDailyRoutes = async () => {
  logger.info("Seeding daily routes...");

  try {
    // Check if daily routes already exist
    const existingCount = await DailyRoute.count();
    if (existingCount > 0) {
      logger.info(`Daily routes already seeded (${existingCount} routes exist)`);
      return;
    }

    // Get vehicles and drivers
    const vehicles = await Vehicle.findAll({ where: { active: true } });
    const drivers = await User.findAll({ where: { role: UserRole.DRIVER } });

    if (vehicles.length === 0) {
      logger.error("No vehicles found. Please seed vehicles first.");
      throw new Error("Vehicles must be seeded before daily routes");
    }

    // Create routes for today, yesterday, and tomorrow
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailyRoutes = [];

    // Create routes for each active vehicle
    for (const vehicle of vehicles) {
      const driver = drivers.find(d => d.id === vehicle.driverId);

      // Yesterday's routes (completed)
      dailyRoutes.push({
        date: yesterday,
        vehicleId: vehicle.id,
        driverId: driver?.id || undefined,
        companyId: vehicle.companyId,
        status: "FINISHED",
        lastLat: 6.2442 + (Math.random() - 0.5) * 0.1, // Random lat around Medellín
        lastLng: -75.5812 + (Math.random() - 0.5) * 0.1, // Random lng around Medellín
        lastPositionAt: new Date(yesterday.getTime() + 18 * 60 * 60 * 1000), // 6 PM yesterday
      });

      // Today's routes (in progress or pending)
      const todayStatus = Math.random() > 0.5 ? "IN_PROGRESS" : "PENDING";
      const lastPositionAt = todayStatus === "IN_PROGRESS" ? new Date() : undefined;

      dailyRoutes.push({
        date: today,
        vehicleId: vehicle.id,
        driverId: driver?.id || undefined,
        companyId: vehicle.companyId,
        status: todayStatus,
        lastLat: todayStatus === "IN_PROGRESS" ? 6.2442 + (Math.random() - 0.5) * 0.1 : undefined,
        lastLng: todayStatus === "IN_PROGRESS" ? -75.5812 + (Math.random() - 0.5) * 0.1 : undefined,
        lastPositionAt,
      });

      // Tomorrow's routes (pending)
      dailyRoutes.push({
        date: tomorrow,
        vehicleId: vehicle.id,
        driverId: driver?.id || undefined,
        companyId: vehicle.companyId,
        status: "PENDING",
        lastLat: undefined,
        lastLng: undefined,
        lastPositionAt: undefined,
      });
    }

    // Create some additional routes without vehicles (planning phase)
    const companiesWithVehicles = [...new Set(vehicles.map(v => v.companyId))];
    for (const companyId of companiesWithVehicles) {
      dailyRoutes.push({
        date: tomorrow,
        vehicleId: undefined,
        driverId: undefined,
        companyId,
        status: "PENDING",
        lastLat: undefined,
        lastLng: undefined,
        lastPositionAt: undefined,
      });
    }

    // Create daily routes
    const createdRoutes = await DailyRoute.bulkCreate(dailyRoutes);

    logger.info(`Successfully seeded ${createdRoutes.length} daily routes`);
    return createdRoutes;
  } catch (error) {
    logger.error("Error seeding daily routes", { error });
    throw error;
  }
};