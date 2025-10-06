import { Request, Response } from "express";
import { Vehicle, User, Company } from "../database/models/index.js";
import { logger } from "../utils/logger.js";
import { UserRole } from "../types/auth.js";

// GET /vehicles/:id - Get vehicle details
export const getVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleId = parseInt(req.params.id!);
    const { auth } = req;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    let whereClause: any = {
      id: vehicleId,
    };

    if (auth.companyId) {
      whereClause.companyId = auth.companyId;
    }

    const vehicle = await Vehicle.findOne({
      where: whereClause,
      attributes: ['id', 'createdAt', 'updatedAt', 'name', 'plate', 'active'],
      include: [
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!vehicle) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "Vehicle not found" },
      });
      return;
    }

    // Role-based filtering
    if (auth.role === UserRole.DRIVER && vehicle.driverId !== auth.userId) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Drivers can only access their assigned vehicles" },
      });
      return;
    }

    if (auth.role === UserRole.PASSENGER && !vehicle.active) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Vehicle not available" },
      });
      return;
    }

    logger.info("Vehicle retrieved", {
      vehicleId,
      userId: auth.userId,
      role: auth.role,
    });

    res.json({ data: vehicle });
  } catch (error) {
    logger.error("Error retrieving vehicle", { error, vehicleId: req.params.id });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

// POST /vehicles - Create vehicle (MANAGER only)
export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { auth } = req;
    const { name, plate, driverId } = req.body;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    if (auth.role !== UserRole.MANAGER) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Only managers can create vehicles" },
      });
      return;
    }

    if (!auth.companyId) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Manager must be assigned to a company" },
      });
      return;
    }

    // Validate driver belongs to same company if provided
    if (driverId) {
      let driverWhereClause: any = {
        id: driverId,
        role: UserRole.DRIVER,
      };

      if (auth.companyId) {
        driverWhereClause.companyId = auth.companyId;
      }

      const driver = await User.findOne({
        where: driverWhereClause,
      });

      if (!driver) {
        res.status(400).json({
          error: { code: "INVALID_DRIVER", message: "Driver not found or not in same company" },
        });
        return;
      }
    }

    const vehicle = await Vehicle.create({
      name,
      plate,
      driverId,
      companyId: auth.companyId,
    });

    logger.info("Vehicle created", {
      vehicleId: vehicle.id,
      managerId: auth.userId,
      companyId: auth.companyId,
    });

    res.status(201).json({ data: vehicle });
  } catch (error) {
    logger.error("Error creating vehicle", { error, managerId: req.auth?.userId });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

// PUT /vehicles/:id - Update vehicle (MANAGER only)
export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleId = parseInt(req.params.id!);
    const { auth } = req;
    const { name, plate, driverId, active } = req.body;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    if (auth.role !== UserRole.MANAGER) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Only managers can update vehicles" },
      });
      return;
    }

    let whereClause: any = {
      id: vehicleId,
    };

    if (auth.companyId) {
      whereClause.companyId = auth.companyId;
    }

    const vehicle = await Vehicle.findOne({
      where: whereClause,
    });

    if (!vehicle) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "Vehicle not found" },
      });
      return;
    }

    // Validate driver belongs to same company if provided
    if (driverId) {
      let driverWhereClause: any = {
        id: driverId,
        role: UserRole.DRIVER,
      };

      if (auth.companyId) {
        driverWhereClause.companyId = auth.companyId;
      }

      const driver = await User.findOne({
        where: driverWhereClause,
      });

      if (!driver) {
        res.status(400).json({
          error: { code: "INVALID_DRIVER", message: "Driver not found or not in same company" },
        });
        return;
      }
    }

    await vehicle.update({
      name,
      plate,
      driverId,
      active,
    });

    logger.info("Vehicle updated", {
      vehicleId,
      managerId: auth.userId,
    });

    res.json({ data: vehicle });
  } catch (error) {
    logger.error("Error updating vehicle", { error, vehicleId: req.params.id });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};

// DELETE /vehicles/:id - Delete vehicle (MANAGER only)
export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleId = parseInt(req.params.id!);
    const { auth } = req;

    if (!auth) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    if (auth.role !== UserRole.MANAGER) {
      res.status(403).json({
        error: { code: "FORBIDDEN", message: "Only managers can delete vehicles" },
      });
      return;
    }

    let whereClause: any = {
      id: vehicleId,
    };

    if (auth.companyId) {
      whereClause.companyId = auth.companyId;
    }

    const vehicle = await Vehicle.findOne({
      where: whereClause,
    });

    if (!vehicle) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "Vehicle not found" },
      });
      return;
    }

    await vehicle.destroy();

    logger.info("Vehicle deleted", {
      vehicleId,
      managerId: auth.userId,
    });

    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting vehicle", { error, vehicleId: req.params.id });
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  }
};