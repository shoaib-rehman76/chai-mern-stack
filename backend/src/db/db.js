import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_URL);

        console.log('Database connection established');
        return connection;
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Exit the process with failure
    }
};

export default connectDB;