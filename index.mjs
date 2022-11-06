import express from 'express';
import os from 'os'

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    const message = `Hello hamza dev for Kubernetes, I'am Pod ${os.hostname()}  Version V1.4.0`;
  res.send(message);
})

app.listen(PORT, () =>{
    console.log(`web server listen at port ${PORT} Version V1.0.2`);
    console.log(`web server ==  ${os.hostname()} Version V1.0.3`);
})
