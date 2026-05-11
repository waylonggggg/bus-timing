import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})


app.get('bus-timings', async (c) => {
  const url: string = "https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival";
  const busStopCode: number = 83139;

  const response = await fetch(url + `?BusStopCode=${busStopCode}`,
    { headers: {"AccountKey": process.env.LTA_DATAMALL_API_KEY!}}
  );

  if (!response.ok) {
    console.log("Error in fetching bus timings");
  }

  return c.json(response.json());
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
