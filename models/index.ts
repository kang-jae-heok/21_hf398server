import { Sequelize } from 'sequelize';
import { boardTable } from './board';
import { userTable } from './user';
import { mediaTable } from './media';
import { alarmTable } from './alarm';

console.log("mysql database connecting..");

const { 
	DB_NAME = "database", 
	DB_USER = "root", 
	DB_PASS = "pass", 
	DB_HOST = "localhost", 
	DB_PORT = "3306",
} = process.env;

let sequelize: Sequelize;

	sequelize = new Sequelize(
	DB_NAME, 
    DB_USER, 
    DB_PASS, 
    {
      host : DB_HOST,
			port: parseInt(DB_PORT, 10),
      dialect: 'mysql',
      define: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
				freezeTableName: true,
				timestamps:true,
				paranoid:true,
				underscored:true,
		  },
	  }
  );
	
	export const alarm = alarmTable(sequelize)
	export const user = userTable(sequelize);
	export const board = boardTable(sequelize);
	export const media = mediaTable(sequelize);

	alarm.belongsTo(user);
	board.belongsTo(user);
	media.belongsTo(board); 

	user.hasOne(alarm);
	user.hasMany(board);
  board.hasMany(media);




export default sequelize;