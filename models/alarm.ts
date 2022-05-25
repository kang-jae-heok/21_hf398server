import { Sequelize, DataTypes, BuildOptions, Model } from 'sequelize';

export interface AlarmAttributes {
  id: number;
  notice: string;
  event: string;
  chatting: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
};

export interface AlarmModel extends Model<AlarmAttributes>, AlarmAttributes {};
export class Alarm extends Model<AlarmModel, AlarmAttributes> {};
export type AlarmStatic = typeof Model& {
  new (values?: object, options?: BuildOptions): AlarmModel;
}

export const alarmTable = (sequelize: Sequelize): AlarmStatic => {
  return <AlarmStatic>sequelize.define('alarm', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true,
    },
    notice: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    event: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    chatting: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
};