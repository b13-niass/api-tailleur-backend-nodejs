import mongoose from "mongoose";

const dbConnection = () => {
    mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('MongoDB connected successfully');
        })
        .catch((err) => {
            console.error('MongoDB connection error: ', err.message);
            process.exit(1);
        });
}

export default dbConnection;