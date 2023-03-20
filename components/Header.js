import LoginForm from "../components/modals/LoginForm";
import RegisterForm from "../components/modals/RegisterForm";
import {useState} from "react";
import {Button, Container, Nav, Navbar} from "react-bootstrap";
import styles from "./styles/Header.module.css"
import NameForm from "../components/modals/NameForm";


export default function Header({session, socket, resetMap, mapIsLoaded}) {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false)

    const handleClose = () => setShowLogin(false);
    const handleCloseReg = () => setShowRegistration(false);
    const handleRegistration = () => setShowRegistration(true);

    const handleShow = async () => {
        if (!session.isLoggedIn()) {
            setShowLogin(true);
        }
    }


    const logout = () => {
        session.logout()
        resetMap()
    }

    const leaveMap = () => {
        resetMap()
    }


    return (<Navbar expand="lg" className={`${styles.navbar}`}>
            <Container>

                <Navbar.Brand href="#home"></Navbar.Brand>
                <Nav className="me-auto">
                </Nav>

                {session.isLoggedIn() &&<>
                    <NameForm session={session}></NameForm>
                    <Button className="alert-secondary" onClick={logout}>Logout</Button>
                    {mapIsLoaded && <Button className="alert-secondary" onClick={leaveMap}>Leave Map</Button>}

                </>}
                {!session.isLoggedIn() && <Button className="alert-secondary" onClick={handleShow}>Login</Button>}
            </Container>
            <LoginForm socket={socket} session={session} show={showLogin} handleClose={handleClose}
                       handleRegistration={handleRegistration}/>
            <RegisterForm show={showRegistration} handleClose={handleCloseReg}></RegisterForm>
        </Navbar>)
}