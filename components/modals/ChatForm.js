import {Form} from "react-bootstrap";


export default function ChatForm({handleSubmit, handleChange, message}) {

    return (<>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Control required onChange={handleChange} name="chat" type="text" maxLength={150}
                                  placeholder="Chat with your friends"
                                  value={message}/>
                </Form.Group>
            </Form>
        </>
    )
}