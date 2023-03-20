import styles from "../styles/Game.module.css"
import {useEffect} from "react";

export default function Projectile({projectiles, x, y}) {

    useEffect(() => {
    },[projectiles])

    return (
        <div>
            {projectiles.map(p =>
                <div key={p.sessionId + p.xcor + p.ycor}
                     className={styles.projectile}
                     style={{
                         transition: "transform 0.1s",
                         position: "absolute",
                         transform: `translate3d(${p.xcor / 2 - x / 2}px, ${p.ycor / 2- y / 2}px, 0)`, zIndex: 1000
                     }}/>)}
        </div>
    )
}