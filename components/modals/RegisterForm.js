import {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import styles from "../styles/LoginForm.module.css";
import {register} from "../../lib/api";

const defaultModel = {"name": "","email": "", "password": ""}

export default function RegisterForm({show, handleClose}) {
    const [model, setModel] = useState(defaultModel)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        setModel({...model, [e.target.name]: e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        console.log(model)
        try {
            await register(model)

            handleClose()
        } catch (error) {
            setError("error, something went wrong")
        }
        setModel(defaultModel)
    }

    const handleCloseClick = () => {
        setError("")
        setModel(defaultModel)
        handleClose()
    }

    return (
        <Modal show={show} onHide={handleCloseClick}>
        <Form onSubmit={handleSubmit}>

            <Modal.Header closeButton>
                <Modal.Title>Registration</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>username</Form.Label>
                    <Form.Control required onChange={handleChange} name="name" type="text"
                                  placeholder="Choose your Username"
                                  value={model.name}/>
                    {error && <Form.Text className={`${styles.error}`}>{error}</Form.Text>}
                </Form.Group>
            </Modal.Body>

            <Modal.Body>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>e-mail</Form.Label>
                    <Form.Control required onChange={handleChange} name="email" type="email"
                                  placeholder="e-mail"
                                  value={model.email}/>
                    {error && <Form.Text className={`${styles.error}`}>{error}</Form.Text>}
                </Form.Group>
            </Modal.Body>

            <Modal.Body>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>password</Form.Label>
                    <Form.Control required onChange={handleChange} name="password" type="password"
                                  placeholder="Choose your password"
                                  value={model.password}/>
                    {error && <Form.Text className={`${styles.error}`}>{error}</Form.Text>}
                </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseClick}>
                    Close
                </Button>
                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Modal.Footer>
        </Form>
    </Modal>)

}