import ChatForm from "../components/modals/ChatForm.js"
import {Container, Nav, Navbar} from "react-bootstrap";
import styles from "../components/styles/Footer.module.css"

export default function Footer({session, players, handleSubmit, handleChange, onClick, message}) {
    return (<>
        <Navbar expand="lg" className={`fixed-bottom ${styles.navbar}`}>
            <Container >
                <Navbar.Brand >
                    Lost Island
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Nav>
                        {players.length !== 0 && session.isLoggedIn() &&<ChatForm session={session} handleChange={handleChange} handleSubmit={handleSubmit} message={message}></ChatForm>}
                        {players.length !== 0 && session.isLoggedIn() &&<button onClick={onClick}>Change Role</button>}
                    </Nav>
            </Container>
        </Navbar></>

    )
}