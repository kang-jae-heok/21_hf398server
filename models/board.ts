import { Sequelize, DataTypes, BuildOptions, Model } from 'sequelize';
import { MediaAttributes } from './media';

export interface BoardAttributes {
  id?: number;
  title: string;
  content: string;
  price: string;
  category: string;
  state: number;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
  media: MediaAttributes;
};

export interface BoardModel extends Model<BoardAttributes>, BoardAttributes {};
export class Board extends Model<BoardModel, BoardAttributes> {};
export type BoardStatic = typeof Model& {
  new (values?: object, options?: BuildOptions): BoardModel;
}

export const boardTable = (sequelize: Sequelize): BoardStatic => {
  return <BoardStatic>sequelize.define('board', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
      },
      title: {
        type: DataTypes.STRING(225),
        allowNull: true, 
      },
      content: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      price: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(225),
        allowNull: true,
      },
    });
};