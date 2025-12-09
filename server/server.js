import app from './src/app.js';
import { PORT } from './src/utils/constants.js';

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
