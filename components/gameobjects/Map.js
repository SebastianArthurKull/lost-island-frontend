import styles from "../styles/Game.module.css"
import {useEffect, useState} from "react";

const tileSize = 16

export default function Map({tileMap, tileDetector, x, y, scale}) {

    const [map, setMap] = useState([])

    useEffect(() => {
        if (!tileMap) {
            return
        }

        let tempArray = []

        tileMap.map.forEach((row, y) => {
            row.forEach((tile, x) => {
                tempArray.push({

                    x: x * tileSize, y: y * tileSize, content:
                        <div
                            key={`x${x}y${y}`}
                            className={`${styles.map}`}
                            style={{
                                transform: `translate3d(${x * tileSize}px, ${y * tileSize}px, 0)`, zIndex: -1000,
                                backgroundPositionX: `${(tile.valueOf() * -tileSize)}px`
                            }}></div>
                })
            })
        })
        setMap(tempArray)
    }, [tileMap])

    useEffect(() => {
        if (map.length > 0) {
            tileDetector(x, y)
        }
    }, [map, tileDetector, x, y])


    function rightRendering(xPlayer, xTile) {

        if ((tileMap.map.length / scale * tileSize - xTile + xPlayer / scale) * scale > -window.innerWidth / scale + 100) {
            return true
        }
    }

    function leftRendering(xPlayer, xTile) {

        if ((tileMap.map.length / scale * tileSize - xTile + xPlayer / scale) * scale < window.innerWidth / scale) {
            return true
        }
    }

    function upRendering(yPlayer, yTile) {

        if ((tileMap.map.length / scale * tileSize - yTile + yPlayer / scale) * scale > -window.innerHeight / scale + 100) {
            return true
        }
    }

    function downRendering(yPlayer, yTile) {

        if ((tileMap.map.length / scale * tileSize - yTile + yPlayer / scale) * scale < window.innerHeight / scale - 20) {
            return true
        }
    }

    return (<div
        style={{
            transform: `translate3d(${x / scale * -1 - tileMap.map.length * 8}px, ${y / scale * -1 - tileMap.map[0].length * 8}px, 0)`,

        }}>

        {map.map(tile => (rightRendering(x, tile.x) && leftRendering(x, tile.x) && upRendering(y, tile.y) && downRendering(y, tile.y) && tile.content))}
    </div>)
}