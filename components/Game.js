import style from "./styles/Game.module.css"
import Player from "./gameobjects/Player";
import {useEffect, useReducer, useRef, useState} from "react";
import Map from "../components/gameobjects/Map";
import Projectile from "../components/gameobjects/Projectile";

const tileSize = 32;

const movement = {
    moveHorizontal: "moveHorizontal", moveVertical: "moveVertical"
}

const actionType = {
    swordAnimation: "swordAnimation",
    bowAnimation: "bowAnimation",
    wandAnimation: "wandAnimation",
    throwAnimation: "throwAnimation",
    damageAnimation: "damageAnimation",
    dedAnimation: "dedAnimation",
    spinAnimation: "spinAnimation",
    walkAnimation: "walkAnimation"
}

const direction = {
    up: "up",
    upRight: "upright",
    right: "right",
    downRight: "downright",
    down: "down",
    downLeft: "downleft",
    left: "left",
    upLeft: "upleft"
}

const actionAnimation = "actionAnimation"


const boarder = {
    left: -400, right: 380, up: -200, down: 180
}

const intervalMap = {
    moveHorizontal: 100, moveVertical: 100, idle: 100, actionAnimation: 500,
}

const dispatchMap = {actionAnimation: {type: "semanticAction", action: actionAnimation, value: "idle"}}
export default function Game({
                                 tileMap,
                                 socket,
                                 message,
                                 newRole,
                                 players,
                                 setPlayersFunction,
                                 tileDetector,
                                 tilesAroundPlayer,
                                 scale,
                                 session
                             }) {

    const [pressedButtons, setPressedButton] = useState(new Set())
    const [semanticActions, setSemanticActions] = useState({})
    const [intervals, setIntervals] = useState({})
    const devModeCounter = useRef(true)
    const [data, dispatch] = useReducer(reducer, {player: session.userData, shot: {}});
    const [projectiles, setProjectiles] = useState([])
    const ownProjectilesRef = useRef([])
    const requestRef = useRef(0)
    const start = useRef(new Date().getTime() / 1000)

    /**reduce old state and action to new state
     *
     * @param data
     * @param action event that describes action
     * @returns {*} new state "players"
     */
    function reducer(data, action) {

        //Movement
        if (action.type === "semanticAction") {


            switch (action.action) {
                case movement.moveHorizontal:
                    return {
                        ...data, player: {
                            ...data.player,
                            xcor: (action.value === "+") ? (!tilesAroundPlayer.right ? (data.player.xcor + tileSize) : data.player.xcor) : (!tilesAroundPlayer.left ? (data.player.xcor - tileSize) : data.player.xcor)
                        }
                    }
                case movement.moveVertical:
                    return {
                        ...data, player: {
                            ...data.player,
                            ycor: (action.value === "+") ? (!tilesAroundPlayer.up ? (data.player.ycor - tileSize) : data.player.ycor) : (!tilesAroundPlayer.down ? (data.player.ycor + tileSize) : data.player.ycor)
                        }
                    }
                case actionAnimation:

                    if (action.value === actionType.bowAnimation || action.value === actionType.wandAnimation) {

                        data.shot.direction = data.player.direction
                        data.shot.xcor = data.player.xcor
                        data.shot.ycor = data.player.ycor
                        data.shot.value = action.value
                        data.shot.cycleCounter = 0
                        data.shot.id = session.userData.sessionId + Math.random();


                    }
                    return {...data, player: {...data.player, animation: action.value}}

                default :
                    return {...data, player: {...data.player}, shot: {}}
            }
        }

        if (action.type === "resetShot") {
            return {...data, shot: {}}
        }

        if (action.type === "direction") {

            let direction = data.player.direction

            let right = Object.keys(semanticActions).includes(movement.moveHorizontal) && semanticActions.moveHorizontal === "+"
            let left = Object.keys(semanticActions).includes(movement.moveHorizontal) && semanticActions.moveHorizontal === "-"
            let up = Object.keys(semanticActions).includes(movement.moveVertical) && semanticActions.moveVertical === "+"
            let down = Object.keys(semanticActions).includes(movement.moveVertical) && semanticActions.moveVertical === "-"

            if (right && !left && !up && !down) {

                direction = "right"
            } else if (right && !left && up && !down) {

                direction = "upright"
            } else if (right && !left && !up && down) {

                direction = "downright"
            } else if (!right && left && !up && !down) {

                direction = "left"
            } else if (!right && left && up && !down) {

                direction = "upleft"
            } else if (!right && left && !up && down) {

                direction = "downleft"
            } else if (!right && !left && up && !down) {

                direction = "up"
            } else if (!right && !left && !up && down) {

                direction = "down"
            }
            data.player.direction = direction

            return data
        }

        if (action.type === "message") {
            data.player.message = message
            return data
        }

        if (action.type === "role") {
            data.player.role = newRole
            return data
        }

        if (action.type === "name") {
            data.player.name = session.userData.name
            return data
        }

    }


    function downHandler(e) {

        [...pressedButtons].includes(e.keyCode) || setPressedButton(old => new Set([...old, e.keyCode]))
    }

    function upHandler(e) {

        setPressedButton(old => {
            old.delete(e.keyCode)

            return new Set(old)
        })
    }

    //handle changes in button click list
    //dispatch JUST once
    useEffect(() => {

        const newActions = {}

        pressedButtons.forEach(b => {

            switch (b) {
                case 39:
                    newActions[movement.moveHorizontal] = "+"
                    newActions[actionAnimation] = actionType.walkAnimation
                    break
                case 37:
                    newActions[movement.moveHorizontal] = "-"
                    newActions[actionAnimation] = actionType.walkAnimation
                    break
                case 38:
                    newActions[movement.moveVertical] = "+"
                    newActions[actionAnimation] = actionType.walkAnimation
                    break
                case 40:
                    newActions[movement.moveVertical] = "-"
                    newActions[actionAnimation] = actionType.walkAnimation
                    break
                case 81:
                    newActions[actionAnimation] = actionType.swordAnimation
                    break
                case 87:
                    newActions[actionAnimation] = actionType.bowAnimation
                    break
                case 69:
                    newActions[actionAnimation] = actionType.wandAnimation
                    break
                case 82:
                    newActions[actionAnimation] = actionType.spinAnimation
                    break
                case 84:
                    newActions[actionAnimation] = actionType.dedAnimation
                    break
            }
        })
        setSemanticActions(newActions)

    }, [pressedButtons]);

    //add/clear Actions to/from Interval
    useEffect(() => {

        const toDoActionsKeys = Object.keys(semanticActions).filter(k => intervals[k] === undefined)
        const newInterval = intervals


        toDoActionsKeys.forEach(k => {

            const interval = setInterval(() => {

                dispatch({type: "semanticAction", action: k, value: semanticActions[k]})

            }, intervalMap[k]);
            newInterval[k] = {interval, dispatch: dispatchMap[k]}
        })

        const toClearActionKeys = Object.keys(intervals).filter(k => semanticActions[k] === undefined)

        toClearActionKeys.forEach(k => {
            let cleanUp = intervals[k]
            if (cleanUp.dispatch) {
                dispatch(cleanUp.dispatch)
            }
            clearInterval(intervals[k].interval)
            delete newInterval[k]
        })

        setIntervals(newInterval)

    }, [semanticActions])


    useEffect(() => {
        dispatch({type: "direction"})
    }, [semanticActions])


    useEffect(() => {
        dispatch({type: 'message', message})
    }, [message])


    useEffect(() => {
        dispatch({type: 'role', newRole})
    }, [newRole])


    useEffect(() => {
        dispatch({type: 'name'})
    }, [session.userData.name])

//emit Player data
    useEffect(() => {
        if (socket.connected) {
            socket.emit(`data/${tileMap.id}`, data.player);
        }
    }, [data.player, socket])


    useEffect(() => {
        if (![...ownProjectilesRef.current].includes(data.shot.id)) {
            if (data.shot.id) {
                ownProjectilesRef.current.push({...data.shot})
                dispatch({type: 'resetShot'})
            }
        }
    }, [data])

    const loop = () => {
        let now = new Date().getTime() / 1000
        let delta = now - start.current

        if (ownProjectilesRef.current.length > 0) {
            if (delta > 0.2) {

                ownProjectilesRef.current.forEach(p => {

                    switch (p.direction) {
                        case direction.up:
                            p.ycor -= tileSize
                            break
                        case direction.right:
                            p.xcor += tileSize
                            break
                        case direction.down:
                            p.ycor += tileSize
                            break
                        case direction.left:
                            p.xcor -= tileSize
                            break

                        case direction.upRight:
                            p.ycor -= tileSize
                            p.xcor += tileSize
                            break
                        case direction.downRight:
                            p.ycor += tileSize
                            p.xcor += tileSize
                            break
                        case direction.downLeft:
                            p.ycor += tileSize
                            p.xcor -= tileSize
                            break
                        case direction.upLeft:
                            p.ycor -= tileSize
                            p.xcor -= tileSize
                            break
                    }
                    p.cycleCounter++
                    if (p.cycleCounter > 10) {
                        console.log(ownProjectilesRef)
                        ownProjectilesRef.current = ownProjectilesRef.current.filter(p => !p)
                    }
                })
                socket.emit(`fire/${tileMap.id}`, {projectiles: ownProjectilesRef.current})
                start.current = new Date().getTime() / 1000
            }
        }
        requestAnimationFrame(loop)
    }

//Init Game
    useEffect(() => {
        if (devModeCounter) {
            if (!socket) {
                return
            }
            socket.on(`fire2/${tileMap.id}`, function (dataReturn) {
                setProjectiles(dataReturn)
                console.log(dataReturn.xcor)
                console.log(data.player.xcor)
                dataReturn.forEach(p => {
                    if (p.xcor === data.player.xcor && p.ycor === data.player.ycor) {
                        alert("you are dead")
                    }
                })
            })
            socket.on(`dataReturn/${tileMap.id}`, function (dataReturn) {
                setPlayersFunction(dataReturn)
            })
            window.addEventListener("keydown", downHandler)
            window.addEventListener("keyup", upHandler)
            console.log("Connection: " + socket.connected)

            devModeCounter.current = false
        }
        requestRef.current = requestAnimationFrame(loop)

        return () => {
            cancelAnimationFrame(requestRef.current)
            socket.off(`dataReturn/${tileMap.id}`)
            socket.off(`fire2/${tileMap.id}`)
        }
    }, [socket])


    return (<>
        {players && tileMap && <div className={style.gameContainer}>
            <Map tileMap={tileMap} x={data.player.xcor} y={data.player.ycor} scale={scale}
                 tileDetector={tileDetector}></Map>

            {players.map(p => {

                return (<div key={data.player.id}>
                    {p.id === session.userData.id ? <>
                        {/*Own Player*/}
                        <div key={p.id}>
                            <Player x={0} y={0}
                                    direction={p.direction}
                                    animation={p.animation}
                                    role={p.role}
                                    message={p.message}/>
                        </div>
                        {/*Arrow*/}
                        <div className={`  ${style.Character_you_arrow}`}
                             style={{
                                 transform: `translate3d(${4}px, ${-14}px, 0)`, display: "block", position: "absolute"
                             }}/>
                    </> : <div>
                        {/*Other Players*/}
                        {((p.xcor / 2 - data.player.xcor / 2) < boarder.right) && ((p.xcor / 2 - data.player.xcor / 2) > boarder.left) && ((p.ycor / 2 - data.player.ycor / 2) < boarder.down) && ((p.ycor / 2 - data.player.ycor / 2) > boarder.up) &&
                            <Player x={p.xcor / 2 - data.player.xcor / 2} y={p.ycor / 2 - data.player.ycor / 2}
                                    direction={p.direction}
                                    animation={p.animation}
                                    role={p.role}
                                    message={p.message}/>}
                    </div>}
                </div>)
            })}
            <Projectile x={data.player.xcor} y={data.player.ycor} projectiles={projectiles}></Projectile>
        </div>}
    </>)
}
