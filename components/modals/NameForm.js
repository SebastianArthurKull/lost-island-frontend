import {Form} from "react-bootstrap";
import {useState} from "react";
import {updateName} from "../../lib/api";


export default function NameForm({session}) {
    const [name, setName] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        session.updateName(name)

        try {
            await updateName(session, name)
        } catch (error) {
            console.log("error")
        }
        setName("")
    }

    const handleChange = (e) => {
        setName(e.target.value)
    }

    return (<>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Control required onChange={handleChange} name="name" type="text" maxLength={150}
                                  placeholder="Change Your Name"
                                  value={name}/>
                </Form.Group>
            </Form>
        </>

    )
}