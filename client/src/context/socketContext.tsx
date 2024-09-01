import React, { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";

interface ISocketContext {
    socket: Socket | null;
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocketContext = () => {
    return useContext(SocketContext);
}

const SocketContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const authUser = useSelector((state: any) => state.user.user);
    const authAdmin = useSelector((state: any) => state.admin.admin);
    const URL: string = import.meta.env.VITE_SERVER as string;

    console.log(authUser);
    console.log(authAdmin);

    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (authUser || authAdmin) {
            const newSocket = io(URL, {
                query: {
                    userId: authUser ? authUser._id : authAdmin._id,
                },
            });

            setSocket(newSocket);

            return () => {
                if (socket) {
                    socket.close();
                    setSocket(null);
                }
            }
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser, authAdmin]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketContextProvider;