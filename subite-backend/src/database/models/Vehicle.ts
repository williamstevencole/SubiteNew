import { DataTypes, Model, Sequelize } from "sequelize";

export interface VehicleAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name?: string;
  plate?: string;
  active: boolean;
  companyId?: number;
  driverId?: number;
}

export interface VehicleCreationAttributes {
  name?: string;
  plate?: string;
  active?: boolean;
  companyId?: number;
  driverId?: number;
}

export class Vehicle extends Model<VehicleAttributes, VehicleCreationAttributes> implements VehicleAttributes {
  public id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public name?: string;
  public plate?: string;
  public active!: boolean;
  public companyId?: number;
  public driverId?: number;

  // Associations
  public company?: any;
  public driver?: any;
  public dailyRoutes?: any[];
  public photos?: any[];
}

export const VehicleModel = (sequelize: Sequelize) => {
  Vehicle.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      plate: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "companies",
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
    },
    {
      sequelize,
      modelName: "Vehicle",
      tableName: "vehicles",
      timestamps: true,
    }
  );

  return Vehicle;
};