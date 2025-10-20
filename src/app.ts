import express, { Application, Request, Response, NextFunction } from 'express';

// Create Express application
const app: Application = express();

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express with TypeScript!');
});



export default app;
