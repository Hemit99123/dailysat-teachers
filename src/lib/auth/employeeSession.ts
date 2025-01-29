// all functions are server actions due to this declaration
"use server";

import { cookies } from 'next/headers';
import { redis } from './redis';

const getSessionIDCookie = async (): Promise<string | undefined> => {
    // we use the session id to find it within the redis db (the stored session)
    const cookieStore = await cookies();
    return cookieStore.get("employee-session-id")?.value;
};

export const deleteSessionIDCookie = async () => {
    const cookieStore = await cookies()
    return cookieStore.delete("employee-session-id")
}

const createSessionIDCookie = async (): Promise<string> => {
    // create a sessionID and store it in cookie
    // this sessionID will be used to store in redis
    const newSessionId = crypto.randomUUID();
    const cookieStore = await cookies();
    cookieStore.set({
        name:"employee-session-id", 
        value: newSessionId,
        httpOnly: true,
        path: "/"
    });

    return newSessionId
};

export const getSession = async (): Promise<boolean> => {
    const sessionId = await getSessionIDCookie();
    
    if (!sessionId) {
        return false; // Return false if no sessionId
    }

    const session = await redis.get(`employee-session-${sessionId}`);
    return session !== null; // Return true if session exists, false if it doesn't
};

export const getSessionInfo = async () => {
    const sessionId = await getSessionIDCookie();

    if (!sessionId) {
        return false; // Return false if no sessionId
    }

    const session = await redis.get(`employee-session-${sessionId}`);

    // returning the info instead of a boolean
    return session
}

export const setSession = async (email: string): Promise<boolean> => {
    const sessionId = await createSessionIDCookie();

    // creating the session into the redis database
    await redis.set(`employee-session-${sessionId}`, {email: email });
    await redis.expire(`employee-session-${sessionId}`, 604800); // the session being expired in a week (in seconds)
 
    // return true because operation was sucessfull
    return true;
};

export const destorySession = async (): Promise<boolean> => {
    const sessionId = await getSessionIDCookie()

    // deleting the redis session when needed (e.g. when user logs out)
    await redis.del(`employee-session-${sessionId}`)

    // delete the cookie as well because its id is now obsolete

    await deleteSessionIDCookie()
    // return true because operation was sucessfull
    return true
}