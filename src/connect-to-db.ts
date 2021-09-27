import { createConnection } from "typeorm";

export const connectToDb = async (retries = 5) => {
  while (retries) {
    try {
      const connection = await createConnection();
      console.log('Connected to Db');
      return connection;
    } catch (err) {
      console.error(err);
      retries -= 1;
      console.log(`Retries ${retries}`);
      // wait 5 seconds
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};