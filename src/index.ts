import { PORT } from './config/env';
import app from "./app";
import database from "./config/database";

database.connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    }); 
});