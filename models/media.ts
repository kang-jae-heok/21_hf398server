import { Sequelize, DataTypes, BuildOptions, Model } from 'sequelize';

export interface MediaAttributes {
  id?: number;
  imgName: string;
  imgPath: string;
  createdAt?: Date;
  updatedAt?: Date;
  boardId ?: number;
};

export interface MediaModel extends Model<MediaAttributes>, MediaAttributes {};
export class Media extends Model<MediaModel, MediaAttributes> {};
export type MediaStatic = typeof Model& {
  new (values?: object, options?: BuildOptions): MediaModel;
}

export const mediaTable = (sequelize: Sequelize): MediaStatic => {
  return <MediaStatic>sequelize.define('media', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true,
    },
    imgName: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
    imgPath: {
      type: DataTypes.STRING(225),
      allowNull: true,
    },
  });
};