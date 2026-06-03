import NavBar from '@/navBar';
import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <section className='w-full min-h-screen flex flex-col items-center'>
      <div className='w-full border-b flex justify-center'>
        <NavBar />
      </div>
      <main className='flex flex-col items-center w-full h-full p-4'>
        <Outlet />
      </main>
    </section>
  );
}
