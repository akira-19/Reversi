import React from "react";
import bg from "./background.jpg"

class GetPieces extends React.Component {
    constructor(){
        super();
        this.state = { dataKey: null,
                  activePlayer: null,
                  activePlayerNum: null,
                  stackId: null
                 };
        this.setStone = this.setStone.bind(this);
        this.createGame = this.createGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.payBack = this.payBack.bind(this);
    }


    componentDidMount() {
      // drizzle instance is what you will use to actually get stuff done (i.e. call contract methods, the Web3 instance, etc.)
      const { drizzle } = this.props;
      const contract = drizzle.contracts.Reversi;

      // let drizzle know we want to watch the `getPieces` method
      const dataKey = contract.methods["getPieces"].cacheCall();
      const activePlayer = contract.methods["activePlayer"].cacheCall();
      const activePlayerNum = contract.methods["getActivePlayerNum"].cacheCall();
      // save the `dataKey` to local component state for later reference
      this.setState({ dataKey, activePlayer, activePlayerNum });

    }




    setStone(e) {
        let activePlayer;
        let activePlayerNum;
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Reversi;
        const { Reversi } = this.props.drizzleState.contracts;
        let squareBoard = [];
        if (Reversi.activePlayer[this.state.dataKey].value === drizzleState.accounts[0]){
            const board = Reversi.getPieces[this.state.dataKey];
            activePlayerNum = Reversi.getActivePlayerNum[this.state.activePlayerNum];
            activePlayerNum = parseInt(activePlayerNum.value);
            if (board) {
                let id = e.target.id.slice(3);
                id = parseInt(id);
                let serializedBoard = board.value;

                let array = [];
                for (var i = 0; i < 64; i++) {
                    array.push(parseInt(serializedBoard[i]));
                    if (array.length === 8){
                        squareBoard.push(array);
                        array = [];
                    }

                }

                const posX = id % 8;
                const posY = Math.floor(id / 8);

                placePiece(posX, posY, activePlayerNum);

                serializedBoard = serializeTheBoard();


                if (squareBoard[posY][posX] === activePlayerNum){
                    // let drizzle know we want to call the `set` method with `value`
                    const stackId = contract.methods["setPieces"].cacheSend(serializedBoard, {
                      from: drizzleState.accounts[0]
                    });

                    // save the `stackId` for later reference
                    this.setState({ stackId });
                }


            }
        }



        function placePiece(_posX, _posY, _activePlayer){
            let opponent = getOpponent(_activePlayer);
            if (squareBoard[_posY][_posX] === 0){
                turnOverPiece(_posY, _posX, opponent);
                switchActivePlayer(_posY, _posX, _activePlayer);

            }else{
                return;
            }
        }

        function getOpponent(_activePlayer) {
            if (_activePlayer === 1){
                return 2;
            }else{
                return 1;
            }
        }

        function switchActivePlayer(_posY, _posX, _activePlayer){
            if (squareBoard[_posY][_posX] === _activePlayer){
                if (_activePlayer === 1) {
                    activePlayer = 2;
                }else{
                    activePlayer = 1;
                }
                contract.methods["setActivePlayer"].cacheSend({
                  from: drizzleState.accounts[0]
                });
            }
        }

        function turnOverPiece(posY, posX, opponent){
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if ((posY+j)>=0 && (posY+j)<=7 && (posX+i)>=0 && (posX+i)<=7 && squareBoard[posY+j][posX+i] == opponent){
                        flipPieces(posY, posX, j, i, opponent);
                    }
                }
            }
        }

        function flipPieces(posY, posX, j, i, opponent){

            let counter = 1;
            let initDiffX = i;
            let initDiffY = j;
            let diffX;
            let diffY;
            do {
                counter++;
                diffX = initDiffX * counter;
                diffY = initDiffY * counter;

               if ((posX + diffX) > 7 || (posX + diffX) < 0 || (posY + diffY) > 7 || (posY + diffY) < 0){
                   break;
               }

                if (squareBoard[posY + diffY][posX + diffX] === 0){
                    break;
                }else if (squareBoard[posY + diffY][posX + diffX] === activePlayerNum){
                    for (var a = 1; a < counter; a++){
                        squareBoard[posY + (a * j)][posX + (a * i)] = activePlayerNum;
                    }
                    squareBoard[posY][posX] = activePlayerNum;
                }

            } while (squareBoard[posY + diffY][posX + diffX] === opponent);
        }

        function serializeTheBoard() {
            let serialBoard = [];
            for (var i = 0; i < 64; i++) {
                let x;
                let y;
                x = i % 8;
                y = Math.floor(i / 8);
                serialBoard[i] = squareBoard[y][x];
            }
            return serialBoard;
        }


  }

  createGame(){
      const { drizzle, drizzleState } = this.props;
      const contract = drizzle.contracts.Reversi;
      const { Reversi } = this.props.drizzleState.contracts;
      const wei = 10 ** 17;
      contract.methods["createGame"].cacheSend({
        from: drizzleState.accounts[0],
        value: wei
      });
  }

  joinGame(){
      const { drizzle, drizzleState } = this.props;
      const contract = drizzle.contracts.Reversi;
      const { Reversi } = this.props.drizzleState.contracts;
      const wei = 10 ** 17;
      contract.methods["joinGame"].cacheSend({
        from: drizzleState.accounts[0],
        value: wei
      });
  }

  payBack(){
      const { drizzle, drizzleState } = this.props;
      const contract = drizzle.contracts.Reversi;
      const { Reversi } = this.props.drizzleState.contracts;
      contract.methods["payBack"].cacheSend({
        from: drizzleState.accounts[0]
      });
  }







    render() {
      // get the contract state from drizzleState
      // drizzleState is there for you to read information from (i.e. contract state variables, return values, transaction status, account data, etc.)
      const { Reversi } = this.props.drizzleState.contracts;

      // using the saved `dataKey`, get the variable we're interested in
      const board = Reversi.getPieces[this.state.dataKey];

      // if it exists, then we display its value
      let that = this;

      function showBoard(){
          let tdArray = [];
          let trArray = [];

          let serializedBoard =[];
          if (board) {
               serializedBoard = board.value;
          }else{
              for (var j = 0; j < 64; j++) {
                  serializedBoard.push("0");
              }
          }

          for (var i = 0; i < 64; i++) {
              let id = 'id-' + i;
              let trId = 'trId-' + i;
              let pieceDiv = <div></div>;

              switch (serializedBoard[i]) {
                  case "0":
                      pieceDiv = <div></div>
                      break;
                  case "1":
                      pieceDiv = <div className="blackPiece"></div>
                      break;
                  case "2":
                      pieceDiv = <div className="whitePiece"></div>
                      break;
                  default:
                    pieceDiv = <div></div>
              }

              if (i%8 !== 7){
                  tdArray.push(<td id={id} className="tdElements" onClick={that.setStone}>{pieceDiv}</td>);
              }else{
                  tdArray.push(<td id={id} className="tdElements" onClick={that.setStone} >{pieceDiv}</td>);
                  trArray.push(<tr id={trId}>{tdArray}</tr>);
                  tdArray = [];
              }
          }
          let tableElem = trArray.map(elem => {
             return elem
          });
          return tableElem
      }

      return (
          <div>
          <nav className="navbar">
              <div className="title"><a href="#">10 weeks project</a></div>
              <div className="menu">
                  <ul>
                      <li><a className="" href="#usage">How to use</a></li>
                      <li><a className="" href="#reversiTable">Play game</a></li>
                  </ul>
              </div>
          </nav>
          <div id="toppage" style={{backgroundImage:`url(${bg})`}}>
              <div className="titleText">
                  <h2>Reversi</h2>
                  <p>Play reversi and earn ether</p>
              </div>
          </div>
              <table id="reversiTable">
                <tbody>
                {showBoard()}
                </tbody>
              </table>
              <div>
                <button className="btn" onClick={this.createGame}>Create Game</button>
                <button className="btn" onClick={this.joinGame}>Join Game</button>
                <button className="btn" onClick={this.payBack}>Get Paid</button>
              </div>
              <div id="usage">
                  <div className="usageList">
                      <h3>1. Click "Create Game" button</h3>
                      <p>Click "Create Game" button to initialize a game. You have to bet 0.1 ehter.</p>
                      <h3>2. Click "Join Game" button</h3>
                      <p>Click "Join Game" button to start the game. You have to bet 0.1 ehter.</p>
                      <h3>3. Start the game</h3>
                      <p>The one that created the game can start tha game.</p>
                      <h3>4. Get money</h3>
                      <p>After finishing the game, and if you win, you can get ether. Click "Get Paid" button. If it's even, both player get ehter back.</p>
                      <h3>* Use Ropsten network</h3>
                  </div>
              </div>
          </div>
      );

    }
}

export default GetPieces;
