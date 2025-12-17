import app from './src/app.js';
import connectDB from './src/config/database.js';
import { PORT } from './src/utils/constants.js';
import logger from './src/utils/logger.js';

connectDB();

app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
