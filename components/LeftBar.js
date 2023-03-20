import styles from "./styles/LeftBar.module.css"

export default function LeftBar({players, session, actualTile}) {
    return (session.isLoggedIn() && <div className={styles.info}>
        <>Players Online: {players.length}</>
        <div className={styles.playerList}>
            {players.map(player => {
                return (<div key={player.id} className={(player.id === session.userData.id) && styles.ownPlayer}>
                    <ul>
                        <li>
                            {player.name}
                        </li>
                        <li>
                            X: {player.xcor}
                        </li>
                        <li>
                            Y: {player.ycor}
                        </li>
                        {player.id === session.userData.id &&
                            <li style={actualTile && {backgroundImage: `url("/images/maptiles/${actualTile}.jpg")`}}>
                                Tyle: {actualTile}
                            </li>
                        }

                    </ul>
                </div>)
            })}
        </div>
    </div>)
}
