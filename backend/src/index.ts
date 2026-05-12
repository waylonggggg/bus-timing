import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('bus-timings', async (c) => {
  const url: string = "https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival";
  const busStopCode: number = 83139;

  try {
    const response = await fetch(url + `?BusStopCode=${busStopCode}`,
      { headers : { "AccountKey": process.env.DATAMALL_API_KEY! }}
    );
    const status = response.status as ContentfulStatusCode;

    if (!response.ok) {
      // returns error response and doesnt throw error
      console.error(response.status, "Error fetching bus timing");
      throw new HTTPException(status, { message: "Error fetching bus timings" });
    }

    const data = await response.json();
    c.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    return c.json(data);

  } catch (error) {
      console.error("Error fetching bus timings: ", error);
      throw new HTTPException(502, { message: "LTA Datamall bus timing error"});
  }
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
