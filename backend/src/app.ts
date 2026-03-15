import express, {Express} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorMiddleware } from './shared/middleware';  
import authRouter from './modules/auth/auth.route';
import usersRouter from './modules/users/users.routes';
import propertiesRouter from './modules/properties/properties.route';
import investmentsRouter from './modules/investments/investments.route';

const app: Express = express();

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}));
app.use(helmet());
app.use(express.json());


app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/properties', propertiesRouter);
app.use('/api/investments', investmentsRouter)
app.get('/health', (req,res) => {
    res.json({ status: 'ok' });
});

app.use(errorMiddleware);

export default app;