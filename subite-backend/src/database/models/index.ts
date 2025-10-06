import { sequelize } from "../index.js";
import { CompanyModel, Company } from "./Company.js";
import { UserModel, User } from "./User.js";
import { VehicleModel, Vehicle } from "./Vehicle.js";
import { DailyRouteModel, DailyRoute } from "./DailyRoute.js";

// Initialize models
const companyModel = CompanyModel(sequelize);
const userModel = UserModel(sequelize);
const vehicleModel = VehicleModel(sequelize);
const dailyRouteModel = DailyRouteModel(sequelize);

// Define associations
companyModel.hasMany(userModel, { foreignKey: "companyId", as: "users" });
userModel.belongsTo(companyModel, { foreignKey: "companyId", as: "company" });

companyModel.hasMany(vehicleModel, { foreignKey: "companyId", as: "vehicles" });
vehicleModel.belongsTo(companyModel, { foreignKey: "companyId", as: "company" });

companyModel.hasMany(dailyRouteModel, { foreignKey: "companyId", as: "dailyRoutes" });
dailyRouteModel.belongsTo(companyModel, { foreignKey: "companyId", as: "company" });

userModel.hasMany(vehicleModel, { foreignKey: "driverId", as: "vehiclesDriven" });
vehicleModel.belongsTo(userModel, { foreignKey: "driverId", as: "driver" });

userModel.hasMany(dailyRouteModel, { foreignKey: "driverId", as: "dailyRoutesDriven" });
dailyRouteModel.belongsTo(userModel, { foreignKey: "driverId", as: "driver" });

vehicleModel.hasMany(dailyRouteModel, { foreignKey: "vehicleId", as: "dailyRoutes" });
dailyRouteModel.belongsTo(vehicleModel, { foreignKey: "vehicleId", as: "vehicle" });

// Export models
export {
  companyModel as Company,
  userModel as User,
  vehicleModel as Vehicle,
  dailyRouteModel as DailyRoute,
};

// Export types
import { CompanyAttributes } from "./Company.js";
import { UserAttributes } from "./User.js";
import { VehicleAttributes } from "./Vehicle.js";
import { DailyRouteAttributes } from "./DailyRoute.js";

export type {
  CompanyAttributes as CompanyType,
  UserAttributes as UserType,
  VehicleAttributes as VehicleType,
  DailyRouteAttributes as DailyRouteType,
};