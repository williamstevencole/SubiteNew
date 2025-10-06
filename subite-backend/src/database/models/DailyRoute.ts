import { DataTypes, Model, Sequelize } from "sequelize";

export interface DailyRouteAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  companyId?: number;
  date: Date;
  vehicleId?: number;
  driverId?: number;
  status: string;
  lastLat?: number;
  lastLng?: number;
  lastPositionAt?: Date;
}

export interface DailyRouteCreationAttributes {
  companyId?: number;
  date: Date;
  vehicleId?: number;
  driverId?: number;
  status?: string;
  lastLat?: number;
  lastLng?: number;
  lastPositionAt?: Date;
}

export class DailyRoute extends Model<DailyRouteAttributes, DailyRouteCreationAttributes> implements DailyRouteAttributes {
  public id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public companyId?: number;
  public date!: Date;
  public vehicleId?: number;
  public driverId?: number;
  public status!: string;
  public lastLat?: number;
  public lastLng?: number;
  public lastPositionAt?: Date;

  // Associations
  public company?: any;
  public vehicle?: any;
  public driver?: any;
  public positions?: any[];
  public attendances?: any[];
  public trace?: any;
}

export const DailyRouteModel = (sequelize: Sequelize) => {
  DailyRoute.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "companies",
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "vehicles",
          key: "id",
        },
      },
      driverId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "PENDING",
      },
      lastLat: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      lastLng: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      lastPositionAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "DailyRoute",
      tableName: "daily_routes",
      timestamps: true,
    }
  );

  return DailyRoute;
};