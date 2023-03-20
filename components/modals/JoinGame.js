import {useEffect} from "react";
import {loadMap} from "../../lib/api";
import {Button, Form, Modal} from "react-bootstrap";

export default function JoinGame({allMaps, session, show, handleClose, setMapFunction}) {


    const handleCloseClick = () => {
        handleClose()
    }

    const handleSubmit = async (id) => {
        try {
            let data = await loadMap(session, id)
            setMapFunction(data)
            handleClose()
        } catch (error) {
        }
    }

    useEffect(() => {
        console.log(allMaps)
    }, [])

    return (<Modal show={show} onHide={handleCloseClick}>
        <Form>

            <Modal.Header closeButton>
                <Modal.Title>Create Map</Modal.Title>
            </Modal.Header>

            {allMaps.map(map => {
                return (
                    <div key={map.id}>
                        <Modal.Body>
                            <Button onClick={() => handleSubmit(map.id)}>Join {map.name}</Button>
                        </Modal.Body>
                    </div>
                )
            })}

            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseClick}>
                    Close
                </Button>
            </Modal.Footer>
        </Form>
    </Modal>)

}