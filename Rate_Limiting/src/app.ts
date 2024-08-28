import express from "express"
import dotenv from "dotenv"
import bodyParser from 'body-parser';
import Queue from 'bull';
import fs from 'fs';
import router from "./routes";

const app=express();
dotenv.config()
const PORT = process.env.PORT

app.use(express.json())
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/',router)

// Bull queue for task processing
export const taskQueue = new Queue('taskQueue', {
  redis: { host: 'localhost', port: 6379 },
});


async function task(user_id) {
  const logMessage = `${user_id}-task completed at-${Date.now()}\n`;
  fs.appendFileSync('task_logs.txt', logMessage);
  console.log(logMessage);
}

// It Procee the Queue
taskQueue.process(async (job) => {
  const { user_id } = job.data;
  await task(user_id);
});

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await taskQueue.close();
  process.exit(0);
});


app.listen(PORT,()=>{
  console.log(`Your SERVER is RUNNING at ${PORT}`)
})