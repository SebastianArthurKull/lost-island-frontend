import style from "../styles/Game.module.css"
import {useEffect, useState} from "react";


export default function Player(props) {
    const [message, setMessage] = useState(<></>)

    useEffect(() => {
        if (!props.message) {
            return
        }
        if (props.message.trim().length > 0) {
            setMessage(<div
                key={Math.random()}
                className={style.Chat}
                style={{
                    transform: `translate3d(${props.x}px, ${props.y - 100}px, 0)`,
                    width: "max-content",
                    maxWidth: "128px",
                    fontSize: "10px",
                    display: "block",
                    position: "absolute",
                    transition: `0.1s`,
                    backgroundColor: "white",
                    borderStyle: "solid",
                    borderRadius: "4px",
                    borderWidth: "1px"
                }}>{props.message}</div>)
        }

    }, [props.message])


    return <>
        {/*Player*/}
        <div
            className={`${style.Character} ${style.gridCell} ${style.Character_sprite} ${style.Character_Role}  ${style.Character_Animation} }`}
            style={{
                transform: `translate3d(${props.x}px, ${props.y-12}px, 0)`
            }}
            direction={props.direction} role={props.role} animation={props.animation}></div>

        {/*Shadow*/}
        <div
            className={`${style.Character} ${style.gridCell} ${style.Character_shadow}`}
            style={{
                transform: `translate3d(${props.x}px, ${props.y-1}px, 0)`, backgroundPositionX: `${0}px`
            }}
        ></div>

        {/*Message*/}
        <div style={{
            transform: `translate3d(${props.x + 20}px, ${props.y - 10}px, 0)`
        }}>{message}</div>
    </>
}
