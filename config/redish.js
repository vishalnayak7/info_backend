import Redis from "ioredis"
import { ENV } from "./env";



export const Q_redis = new Redis(ENV.redis_que);
