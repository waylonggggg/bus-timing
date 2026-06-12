import NavBar from '@/navBar';
import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <section className='w-full min-h-dvh flex flex-col items-center'>
      <div className='w-full border-b flex justify-center'>
        <NavBar />
      </div>
      <main className='flex-1 flex flex-col items-center p-4 w-full'>
        <Outlet />
      </main>
    </section>
  );
}
