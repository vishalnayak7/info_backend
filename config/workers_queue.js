import { Queue, Worker } from 'bullmq';
import { Q_redis } from './redish';
import { logger } from './logger'


export const acc_poll_queue = new Queue('accordian_polls_queue', Q_redis);

const acc_poll_worker = new Worker('accordian_polls_queue', async job => {

     logger.info(`[P] Processing job ${job.id} with data: ${job}`);
     console.log(`Processing job ${job.id} with data: ${job}`);

});



// acc_poll_queue.add('accordian_polls', { blog_id: 1, item: [{ question: 'Question 1', answer: 'Answer 1' }] },{ attempts: 2 , backoff:{
//      type: 'exponential',
//      delay: 2000
// } });


acc_poll_worker.on('failed', async (job, err) => {
 
     logger.error(`[P] Job ${job.id} failed with error: ${err.message}`);
     
     console.error(`Job ${job.id} failed with error: ${err.message}`);


     // Store failed job details in MongoDB
     // await FailedJob.create({
     //      jobId: job.id,
     //      name: job.name,
     //      data: job.data,
     //      failedReason: err.message
     // });

     console.log(`Stored failed job ${job.id} in MongoDB`);
});
