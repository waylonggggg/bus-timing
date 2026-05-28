import BusTiming from "@/BusStopTiming"
import NavBar from "@/NavBar"

function App() {
  return (
      <section className="w-full min-h-screen flex flex-col items-center">
        <div className="w-full border-b flex justify-center">
          <NavBar/>
        </div>
        <main className="flex flex-col items-center w-full h-full p-4">
          <BusTiming/>
        </main>
      </section>
  )
}

export default App