import {useEffect} from "react";
import Game from "@components/Game";
import CreateMapForm from "@components/Modals/CreateMapForm";
import {Button} from "react-bootstrap";
import {useState} from "react";
import JoinGame from "@components/Modals/JoinGame";
import {loadAllMaps} from "@lib/api";
import styles from "../styles/index.module.css"

export default function Home({
                                 mapIsLoaded,
                                 session,
                                 tileMap,
                                 setMapFunction,
                                 socket,
                                 updatedMessage,
                                 newRole,
                                 players,
                                 setPlayersFunction,
                                 setProjectiles,
                                 tileDetector,
                                 tilesAroundPlayer,
                                 scale
                             }) {

    const [showCreateMapForm, setShowCreateMapForm] = useState(false)
    const [showJoinGame, setShowJoinGame] = useState(false)
    const [allMaps, setAllMaps] = useState([])

    const [raft, setRaft] = useState({x: 0, y:0})


    useEffect(() => {

        console.log("called")
        socket.connect()

        return () => {
            socket.disconnect()
        }

    }, [socket])

    useEffect(() => {
        setRaft({x: ((Math.random() * (window.innerWidth - 600)))/scale, y: ((Math.random() * (window.innerHeight)-(window.innerHeight/3*2)))/scale})
        const timer = setInterval(() => {
            setRaft({x: ((Math.random() * ((window.innerWidth/scale) - (400/scale)))+(200/scale))/scale, y: ((Math.random() * (window.innerHeight)-(window.innerHeight/3*2)))/scale})
        }, 5000);
    }, []);

    const openMapModal = async () => {

        const data = await loadAllMaps(session)
        setAllMaps(data)

        setShowJoinGame(true)
    }

    return (<div

        style={{transform: `scale(${scale})`, width: `calc((100% / ${scale})*${!mapIsLoaded})`, height: `calc((100% / ${scale})*${!mapIsLoaded})`}}
    >
        {(session.isLoggedIn() && mapIsLoaded) && <Game
            socket={socket}
            message={updatedMessage}
            newRole={newRole}
            setPlayersFunction={setPlayersFunction}
            setProjectiles={setProjectiles}
            players={players}
            tileDetector={tileDetector}
            tilesAroundPlayer={tilesAroundPlayer}
            session={session}
            tileMap={tileMap}
            scale={scale}
        ></Game>
        }
        {!mapIsLoaded && session.isLoggedIn() &&
            <div>
                <img style={{
                    transform: `translate3d(${0}px, ${0}px, 0)`,
                    display: "flex"
                }} className={styles.menu} src="/images/JoinAGame.png"
                     onClick={openMapModal}
                     alt={"Lost Island"}
                height={70}
                />

                <img style={{
                    transform: `translate3d(${0}px, ${0}px, 0)`,
                    display: "flex"
                    }}
                     onClick={() => setShowCreateMapForm(true)}
                     className={styles.menu} src="/images/HostAGame.png"
                     alt={"Lost Island"}
                height={70}/>


                <CreateMapForm setMapFunction={setMapFunction} session={session} show={showCreateMapForm} handleClose={() => setShowCreateMapForm(false)}></CreateMapForm>
                <JoinGame allMaps={allMaps} session={session} show={showJoinGame}
                          handleClose={() => setShowJoinGame(false)} setMapFunction={setMapFunction}></JoinGame>
            </div>
        }
        {!session.isLoggedIn() &&

            <div className={styles.titlescreen}>
                <img className={styles.raft} style={{transform: `translate3d(${raft.x}px, ${raft.y}px, 0)`}} src="/images/raft.png" alt="Raft" height={25} width={25}/>
                <img style={{transform: `scale(calc(1/${scale}))`}} className={styles.title} src="/images/title.png"
                     alt={"Lost Island"}/>

            </div>
        }
    </div>)
}
