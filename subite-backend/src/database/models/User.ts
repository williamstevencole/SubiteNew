import { DataTypes, Model, Sequelize } from "sequelize";
import { UserRole } from "../../types/auth.js";

export interface UserAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  name?: string;
  phone?: string;
  role: UserRole;
  authId?: string;
  notificationId?: string;
  companyId?: number;
}

export interface UserCreationAttributes {
  email: string;
  name?: string;
  phone?: string;
  role: UserRole;
  authId?: string;
  notificationId?: string;
  companyId?: number;
}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public email!: string;
  public name?: string;
  public phone?: string;
  public role!: UserRole;
  public authId?: string;
  public notificationId?: string;
  public companyId?: number;

  // Associations
  public company?: any;
  public vehiclesDriven?: any[];
  public dailyRoutesDriven?: any[];
  public attendances?: any[];
  public filesOwned?: any[];
}

export const UserModel = (sequelize: Sequelize) => {
  User.init(
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM(...Object.values(UserRole)),
        allowNull: false,
      },
      authId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      notificationId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "companies",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
    }
  );

  return User;
};