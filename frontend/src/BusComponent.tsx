import { useEffect, useState } from "react"

export default function BusComponent() {
    const [busTiming, setBusTiming] = useState("");

    const url = "https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival"
    const DATAMALL_ACCOUNT_KEY = import.meta.env.VITE_DATAMALL_ACCOUNT_KEY;
		const busStopCode: number = 83139;

    useEffect(() => {
			const fetchData = async () => {
				const response = await fetch (url + `?BusStopCode=${busStopCode}`,
					{ headers: { "AccountKey": DATAMALL_ACCOUNT_KEY } }
				)
				console.log("Status: ", response.status);
				console.log("Body: ", response.body);

				if (!response.ok) {
					throw new Error()
				}
			}
			try {
				fetchData();
			} catch (error) {
				console.log(error)
			}
		}, [])

    return (
        <div>
            Bus component
        </div>
    )
}


