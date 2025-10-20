import express, { Application, Request, Response, NextFunction } from 'express';

// Create Express application
const app: Application = express();

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('API Root page');
});
// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.send('API is healthy');
});


export default app;
