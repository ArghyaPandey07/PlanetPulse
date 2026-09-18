// PlanetPulse — Express application configuration
// Separated from server.ts so tests can import the app without starting a server.

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Global error handler (must be registered after routes)
app.use(errorHandler);

export default app;
