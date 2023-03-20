import appStyle from '../styles/_app.module.css'
import io from "socket.io-client";
import useSession from "@lib/session";
import Header from "@components/Header";
import Footer from "@components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import {updateMessage, updateRole} from "@lib/api";
import {useRef, useState} from "react";
import LeftBar from "@components/LeftBar";
import RightBar from "@components/RightBar";

const URL = "localhost:9092"

const socket = io(`http://${URL}/socket`, {
    transports: ['polling', 'websocket']
});
const defaultMessage = ""
const defaultRole = "Archer-Green"
const roleList = ["Archer-Green", "Archer-Purple", "Character-Base", "Mage-Cyan", "Mage-Red", "Soldier-Blue", "Soldier-Red", "Soldier-Yellow", "Warrior-Blue", "Warrior-Red"];
const tileName = {
    water: "water", beach: "beach", grass: "grass", forest: "forest"
}
const tileSize = 32
const scale = 2


export default function MyApp({Component, pageProps}) {
    const session = useSession()
    const [message, setMessage] = useState(defaultMessage)
    const [updatedMessage, setUpdatedMessage] = useState(defaultMessage)
    const [newRole, setNewRole] = useState(defaultRole)
    const [players, setPlayers] = useState([])
    const [actualTile, setActualTile] = useState()
    const [tileMap, setTileMap] = useState({})
    const [mapIsLoaded, setMapIsLoaded] = useState(false)
    const tilesAroundPlayer = useRef({
        left: false, right: false, up: false, down: false
    })

    async function setMapFunction(data) {

        await session.updateActualMap(data.id)

        setTileMap({id: data.id, map: JSON.parse(data.perlinMapList)})

        socket.emit(`join/${data.id}`, session.userData)
        socket.on(`sessionId/${data.id}`, function (data) {
            session.updateSessionUser(data)
        })
        setMapIsLoaded(true)
    }

    const newPageProps = {
        ...pageProps, session, socket, updatedMessage, newRole, players
    }

    function resetMap() {
        setTileMap({})
        setMapIsLoaded(false)
        setPlayers([])
    }

    function setPlayersFunction(data) {
        setPlayers(data)
    }

    function tileDetector(x, y) {

        if (tileMap) {
            let currentX = x / tileSize + tileMap.map.length / scale
            let currentY = y / tileSize + tileMap.map[0].length / scale

            let left
            let right
            let up
            let down

            left = tileMap.map[currentY][currentX - 1] === 0 || tileMap.map[currentY][currentX - 1] === 3 || currentX < 1;
            right = tileMap.map[currentY][currentX + 1] === 0 || tileMap.map[currentY][currentX + 1] === 3 || currentX > tileMap.map.length - 2;
            up = tileMap.map[currentY - 1][currentX] === 0 || tileMap.map[currentY - 1][currentX] === 3 || currentY < 2;
            down = tileMap.map[currentY + 1][currentX] === 0 || tileMap.map[currentY + 1][currentX] === 3 || currentY > tileMap.map.length - 3;
            tilesAroundPlayer.current = {left, right, up, down}

            let tileValue = tileMap.map[y / tileSize + tileMap.map[0].length / scale][x / tileSize + tileMap.map.length / scale]
            switch (tileValue) {
                case 0:
                    setActualTile(tileName.water)
                    break
                case 1:
                    setActualTile(tileName.beach)
                    break
                case 2:
                    setActualTile(tileName.grass)
                    break
                case 3:
                    setActualTile(tileName.forest)
                    break
                default:
                    setActualTile(tileName.water)
                    break
            }
        }
    }

    const handleChange = (e) => {
        setMessage(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (message.includes("!")) {
            setUpdatedMessage(message.toUpperCase())
        } else {
            setUpdatedMessage(message)
        }
        session.updateMessage(updatedMessage)

        try {
            await updateMessage(session, message)
        } catch (error) {
            console.log(error)
        }
        setMessage(defaultMessage)
    }

    const onClick = async (e) => {
        e.preventDefault()
        setNewRole(roleList[Math.floor(Math.random() * roleList.length)])
        session.updateRole(newRole)

        try {
            await updateRole(session, newRole)

        } catch (error) {
            console.log(error)
        }
    }

    return (<div>

        <Header session={session} socket={socket} resetMap={resetMap} mapIsLoaded={mapIsLoaded}/>

        <section className={appStyle.mainSection}>

            <div className={appStyle.side}>
                <LeftBar session={session} players={players} actualTile={actualTile}></LeftBar>
            </div>

            <div className={appStyle.game}>
                <Component {...newPageProps} setPlayersFunction={setPlayersFunction}
                           tileDetector={tileDetector} tileMap={tileMap} tilesAroundPlayer={tilesAroundPlayer.current}
                           mapIsLoaded={mapIsLoaded} setMapFunction={setMapFunction} scale={scale}/>
            </div>

            <div className={appStyle.side}>
                <RightBar></RightBar>
            </div>

        </section>

        <Footer socket={socket} session={session} players={players} handleChange={handleChange} handleSubmit={handleSubmit}
                onClick={onClick} message={message}/>
    </div>)
}


