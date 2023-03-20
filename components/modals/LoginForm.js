import {Button, Form, Modal} from "react-bootstrap";
import {useState} from "react";
import {login} from "@lib/api";

import styles from "@components/styles/LoginForm.module.css"

const defaultModel = {
    email: "", password: ""
}

export default function LoginForm({show, handleClose, session, handleRegistration, socket}) {
    const [model, setModel] = useState(defaultModel)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        setModel({...model, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const resp = await login(model)
            session.login(resp)
            handleClose()

        } catch (error) {
            console.log("error, something went wrong")
            setModel({...model, password: ""})
            setError("wrong email or password")
        }
        setModel(defaultModel)

        if (session.isLoggedIn()) {
            socket.emit('join', session.userData)
            socket.on("sessionId", function (data) {
                session.updateSessionUser(data)
            })
        }
    }

    const handleCloseClick = () => {
        setError("")
        setModel(defaultModel)
        handleClose()
    }

    const handleReg = () => {
        handleClose()
        setModel(defaultModel)
        handleRegistration()
    }

    return (<>
        <Modal show={show} onHide={handleCloseClick}>
            <Form onSubmit={handleSubmit}>

                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>email</Form.Label>
                        <Form.Control required onChange={handleChange} name="email" type="email"
                                      placeholder="Enter your e-mail"
                                      value={model.name}/>
                        {error && <Form.Text className={`${styles.error}`}>{error}</Form.Text>}
                    </Form.Group>
                </Modal.Body>

                <Modal.Body>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>password</Form.Label>
                        <Form.Control required onChange={handleChange} name="password" type="password"
                                      placeholder="Enter your password"
                                      value={model.password}/>
                        {error && <Form.Text className={`${styles.error}`}>{error}</Form.Text>}
                    </Form.Group>
                </Modal.Body>

                <Modal.Body>
                    <Button onClick={handleReg}>Register for free</Button>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        login
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </>)
}