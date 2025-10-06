import { DataTypes, Model, Sequelize } from "sequelize";

export interface CompanyAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
}

export interface CompanyCreationAttributes {
  name: string;
}

export class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
  public id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public name!: string;

  // Associations
  public users?: any[];
  public vehicles?: any[];
  public dailyRoutes?: any[];
  public fileAssets?: any[];
}

export const CompanyModel = (sequelize: Sequelize) => {
  Company.init(
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
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Company",
      tableName: "companies",
      timestamps: true,
    }
  );

  return Company;
};