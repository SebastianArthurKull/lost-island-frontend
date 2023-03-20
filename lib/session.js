import {useEffect, useState} from "react";
import jwtDecode from "jwt-decode"

const STORAGE_KEY = "session"

const defaultModel = {
    user: null, token: null
}

export default function useSession() {
    const [session, setSession] = useState(defaultModel)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const savedSession = localStorage.getItem(STORAGE_KEY)
        if (savedSession) {
            try {
                const value = JSON.parse(savedSession)
                const {exp} = jwtDecode(value.token)
                const expirationDate = new Date(0)
                expirationDate.setUTCSeconds(exp)
                const now = new Date()
                setSession(now >= expirationDate ? defaultModel : value)
            } catch (e) {
                console.log(e)
            }
        }
    }, [])

    useEffect(() => {
        if (session.user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
        } else {
            localStorage.removeItem(STORAGE_KEY)
        }
    }, [session])

    return {
        ...session, ready, login(value) {
            setSession(value)
        }, logout() {
            setSession(defaultModel)
        }, isLoggedIn() {
            return session.user !== null
        }, updateSessionUser(sessionId) {
            setSession({...session, userData: {...session.userData, sessionId}})
        }, updateMessage(message) {
            setSession({...session, userData: {...session.userData, message}})
        }, updateRole(role) {
            setSession({...session, userData: {...session.userData, role}})
        }, updateName(name) {
            setSession({...session, userData: {...session.userData, name}})
        }, updateActualMap(mapId) {
            setSession({...session, userData: {...session.userData, mapId}})
        }
    }
}