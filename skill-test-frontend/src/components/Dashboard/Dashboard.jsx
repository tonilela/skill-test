import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { Header } from '../Header/Header';

function Dashboard() {
    const name = localStorage.getItem('name')
    useEffect(() => {
        const socket = io(process.env.REACT_APP_BACKEND_URL,{
          transports: ['websocket'],
        });
        const email = localStorage.getItem('email')
    
        socket.emit('login',email);
    
        socket.on('message', (message) => {
          alert('New notification: ' + message);
        });
    
        return () => {
          socket.disconnect();
      };
     }, []);
    
    return (
        <div className="dashboard">
            <Header />
            <main className="dashboard-content flex flex-col items-center justify-center h-screen text-center text-2xl font-bold">
               Hello {name}
           </main>

        </div>
    );
}

export default Dashboard;
