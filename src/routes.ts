import { Express, Request, Response } from "express";
import { healthCheckUrl } from "./helpers/urls";



export const routes = (app: Express, express: any) => {
    const router = express.Router();
  
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  
    app.get(healthCheckUrl, (req: Request, res: Response) => {
      res.send("Hello, boss! we are working good");
    });
  
    //auth
    
  };