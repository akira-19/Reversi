
pragma solidity >=0.5.0 <0.6.0;

contract Reversi {
    address payable player1;
    address payable player2;
    uint deposit;
    uint8[] board = new uint8[](64);
    address public activePlayer;
    mapping (address => uint8) public activePlayerNum;
    bool gameActive = false;

  function createGame() public payable returns (uint8[] memory) {
    require(gameActive == false);
    gameActive = true;
    player1 = msg.sender;
    deposit += msg.value;

    activePlayerNum[player1] = 1;
    activePlayer = player1;

    // initialize the board
    for(uint8 i = 0; i < board.length; i++){
        board[i] = 0;
    }
    board[27] = 2;
    board[28] = 1;
    board[35] = 1;
    board[36] = 2;
    return board;
  }

  function joinGame()public payable {
      require(gameActive == true);
      require(player1 != msg.sender);
      player2 = msg.sender;
      activePlayerNum[player2] = 2;
      deposit += msg.value;
  }

  function setPieces(uint8[] memory _board) public {
      require(gameActive == true);
      require(msg.sender == player1 || msg.sender == player2);
      board = _board;
  }

  function getPieces() public view returns (uint8[] memory){
      return board;
  }

  function payBack()public payable {
      require(gameActive == true);
      uint8 counterForOne = 0;
      uint8 counterForTwo = 0;
      for(uint8 i = 0; i < board.length; i++){
          if (board[i] == 1){
              counterForOne += 1;
          }else if((board[i] == 1)){
              counterForTwo += 1;
          }
      }

      require(counterForOne + counterForTwo == 64);

      if(msg.sender == player1 && counterForOne > counterForTwo){
          msg.sender.transfer(deposit);
          gameActive = false;
      } else if (msg.sender == player2 && counterForOne < counterForTwo){
          msg.sender.transfer(deposit);
          gameActive = false;
      }else if (counterForOne == counterForTwo){
          player1.transfer(deposit/2);
          player2.transfer(deposit/2);
          gameActive = false;
      }

  }

  function setActivePlayer() public {
      if(msg.sender == player1){
          activePlayer = player2;
      }else if(msg.sender == player2){
          activePlayer = player1;
      }

  }

  function getActivePlayerNum() public view returns (uint8) {
      return activePlayerNum[msg.sender];
  }


}
