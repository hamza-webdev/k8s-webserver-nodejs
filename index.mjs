import express from 'express';
import os from 'os'

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    const message = `Hello Kubernetes, I'am Pod ${os.hostname()}`;
  res.send(message);
})

app.listen(PORT, () =>{
    console.log(`web server listen at port ${PORT}`);
    console.log(`web server ==  ${os.hostname()}`);
})
