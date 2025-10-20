import { PORT } from './config/env';
import app from "./app";
import connectDB from './config/db';

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    }); 
});