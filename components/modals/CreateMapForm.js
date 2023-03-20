import {Button, Form, Modal} from "react-bootstrap";
import styles from "@components/styles/LoginForm.module.css";
import {useState} from "react";
import {createMap} from "@lib/api";

const defaultModel = {
    name : "Default Name",
    size : 16,
    randomSeed : 1,
    cellSize : 8
}

export default function CreateMapForm({handleClose, show, session, setMapFunction}){

    const [model, setModel] = useState(defaultModel)
    const [error, setError] = useState("")


    const handleChange = (e) => {
        setModel({...model, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            let data = await createMap(session, model)
            setMapFunction(data)
            handleClose()
        } catch (error) {
            setError("error, something went wrong")
        }
    }

    const handleCloseClick = () => {
        setModel(defaultModel)
        handleClose()
        setError("")
    }

    return (
        <Modal show={show} onHide={handleCloseClick}>
            <Form onSubmit={handleSubmit}>

                <Modal.Header closeButton>
                    <Modal.Title>Create Map</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control required onChange={handleChange} name="name" type="text"
                                      placeholder="Choose a Name"
                                      value={model.name}/>
                        {error && <Form.Text className={`${styles.error}`}>{error}</Form.Text>}
                    </Form.Group>
                </Modal.Body>

                <Modal.Body>
                    <Form.Group className="mb-3" controlId="size">
                        <Form.Label>size</Form.Label>
                        <Form.Select aria-label="Default select example" name={"MapSizeChooser"} defaultValue={model.size} onChange={(e) => model.size = e.target.value}>
                            <option value="16">16</option>
                            <option value="32">32</option>
                            <option value="64">64</option>
                        </Form.Select>
                        {error && <Form.Text className={`${styles.error}`}>{error}</Form.Text>}
                    </Form.Group>
                </Modal.Body>

                <Modal.Body>
                    <Form.Group className="mb-3" controlId="randomSeed">
                        <Form.Label>randomSeed</Form.Label>
                        <Form.Control required onChange={handleChange} name="randomSeed" type="text"
                                      placeholder="randomSeed"
                                      value={model.randomSeed}/>
                        {error && <Form.Text className={`${styles.error}`}>{error}</Form.Text>}
                    </Form.Group>
                </Modal.Body>

                <Modal.Body>
                    <Form.Group className="mb-3" controlId="cellSize">
                        <Form.Label>cellSize</Form.Label>
                        <Form.Control required onChange={handleChange} name="cellSize" type="text"
                                      placeholder="cellSize"
                                      value={model.cellSize}/>
                        {error && <Form.Text className={`${styles.error}`}>{error}</Form.Text>}
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseClick}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        Create
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>)
}