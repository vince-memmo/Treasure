

const GameOver = () => {
    return (
        <>
        <div>
            Gameover!
        </div>
        <br />
        <div>Your Stats:</div>
        <br />
        <div>Remaining Time: {remainingTime}</div>
        <br />
        <div>Distance Traveled: {distance}</div>
        <br />
        <div>Time Spent Walking: {timeWalked}</div>
        <br />
        <div>Time Spent Pondering: {thinkingTime}</div>

        <div className="buttons-container flex-row">
        <Link className="button-link" to={'/testmap'}>
            <Button className="lobby-button" >Play Again!</Button>
        </Link>
        <Link className="button-link" to={'/events/new'}>
            <Button className="lobby-button" >Try Creating an Event!</Button>
        </Link>
        <Link className="button-link" to={'/events'}>
            <Button className="lobby-button" >Find Another Event!</Button>
        </Link>
        </div>
        </>
    )
}

export default GameOver;

//remainingTime, distance, timeWalked, thinkingTime