import fs from 'fs';
import path from 'path';

const logFilePath = path.join(__dirname, '../logs/AENA_FoodToFly_log.txt');

export const logToFile = (message: string) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
};
