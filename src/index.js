import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return(
            <button className="square" onClick={()=>props.setTurnX()}> 
                {props.value}
            </button>
        );  
}


class Board extends React.Component{
    renderSquare(i){
        return <Square value={this.props.squares[i]} setTurnX={()=>this.props.setTurnX(i)}/>
    }

    
    render(){
       
        return(
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component{
    constructor(props){
        super(props);
        this.state={
            turnX:true,
            history:[{
            squares: Array(9).fill(null),
            }],
            stepNumber: 0,
        };
    }

    setTurnX(i){
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[this.state.stepNumber];
        const currentBoard = current.squares.slice();
        if(isWinner(currentBoard) || currentBoard[i]) return;
        currentBoard[i] = this.state.turnX?"X":"O";
        console.log(history);
        this.setState({
            turnX: !this.state.turnX,
            stepNumber: history.length,
            history: history.concat({squares:currentBoard}),
        }); 
    }

    jumpto(move){
        console.log(this.state.history);
        this.setState({
            stepNumber: move-1,
            turnX: (move-1)%2 === 0,
            // history: this.state.history.slice(0,move),
        });    
    }

    render(){
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const currentBoard = current.squares;
        // console.log(currentBoard);
        // console.log(this.state.history);
        const status = isWinner(currentBoard)?"Winner:"+isWinner(currentBoard):"Next player: " + (this.state.turnX?"X":"O");


        const goto = history.map((board,move)=>{
            if(move){
            const gotomessage = move>1? "Go to Step"+(move-1) : "Go to Start";
            return <li key={move}><button onClick={()=>this.jumpto(move)}>{gotomessage}</button></li>;
            }else{
                return <></>;
            }
        });

        return(
            <div className="game">
                <div className="game-board">
                    <Board squares={currentBoard} turnX={this.state.turnX} setTurnX={(i)=>this.setTurnX(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{goto}</ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function isWinner(squares){
    const lines=[
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ]

    for(let i=0;i<lines.length;i++){
        const [a,b,c] = lines[i];
        if(squares[a] && squares[a]===squares[b] && squares[a]===squares[c]){
            return squares[a];
        }
       
    }
    return null;
}