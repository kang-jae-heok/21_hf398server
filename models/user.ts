import { Sequelize, DataTypes, BuildOptions, Model } from 'sequelize';
import { AlarmAttributes } from './alarm';
import { BoardAttributes } from './board';

export interface UserAttributes {
  id: number;
  email: string;
  loginType: string;
  name: string;
  address: string;
  profileImg: string;
  kindness: number;
  declaration: number;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
  alarm: AlarmAttributes;
  board: BoardAttributes;
};

export interface UserModel extends Model<UserAttributes>, UserAttributes {};
export class User extends Model<UserModel, UserAttributes> {};
export type UserStatic = typeof Model& {
  new (values?: object, options?: BuildOptions): UserModel;
}

export const userTable = (sequelize: Sequelize): UserStatic => {
  return <UserStatic>sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true,
    },
    email: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    loginType: {
      type: DataTypes.STRING(10),
      allowNull:true,
    },
    name: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    profileImg: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    kindness: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    declaration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  });
};