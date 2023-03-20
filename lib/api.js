const URL = "http://localhost:8080"


export async function createMap(session, model) {
    const response = await fetch(`${URL}/map/create/${model.name}/${model.size}/${model.randomSeed}/${model.cellSize}`, {
        method: "GET", headers: {
            "content-type": "application/json", "authorization": session.token
        }
    })
    return await response.json()
}

export async function loadAllMaps(session) {
    const response = await fetch(`${URL}/map`, {
        method: "GET", headers: {
            "content-type": "application/json", "authorization": session.token
        }
    })
    return await response.json()
}

export async function loadMap(session, id) {
    const response = await fetch(`${URL}/map/${id}`, {
        method: "GET", headers: {
            "content-type": "application/json", "authorization": session.token
        }
    })
    return await response.json()
}

export async function login({email, password}) {
    const response = await fetch(`${URL}/login`, {
        method: "POST", headers: {
            "content-type": "application/json"
        }, body: JSON.stringify({email, password})
    })
    if (!response.ok) {
        return Promise.reject(response)
    }
    return await response.json()
}

export async function register({email, name, password}) {
    const response = await fetch(`${URL}/users/sign-up`, {
        method: "POST", headers: {
            "content-type": "application/json"
        }, body: JSON.stringify({email, password, name})
    })

    if (!response.ok) {
        return Promise.reject(response)
    }
    return await response.json()
}


export async function updateMessage(session, message) {
    const response = await fetch(`${URL}/users/${session.userData.id}`, {
        method: "PATCH", headers: {
            "content-type": "application/json", "authorization": session.token
        }, body: JSON.stringify({message: message})
    })

    if (!response.ok) {
        let error = new Error("User could not been updated")
        error.response = response
        throw error
    }
    return await response.json()
}

export async function updateName(session, name) {
    const response = await fetch(`${URL}/users/${session.userData.id}`, {
        method: "PATCH", headers: {
            "content-type": "application/json", "authorization": session.token
        }, body: JSON.stringify({name: name})
    })

    if (!response.ok) {
        let error = new Error("User could not been updated")
        error.response = response
        throw error
    }
    return await response.json()
}

export async function updateRole(session, role) {
    const response = await fetch(`${URL}/users/${session.userData.id}`, {
        method: "PATCH", headers: {
            "content-type": "application/json", "authorization": session.token
        }, body: JSON.stringify({role: role})
    })

    if (!response.ok) {
        let error = new Error("User could not been updated")
        error.response = response
        throw error
    }
    return await response.json()
}

