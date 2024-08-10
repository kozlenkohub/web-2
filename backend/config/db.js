import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://ggkozlenko:R5BONJPYn51Vx0P0@db.f0gfhtl.mongodb.net/mydatabase?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Тайм-аут подключения к серверу
        ssl: true, // Включение SSL (если это требуется)
      },
    );
    console.log('Database Connected');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};
