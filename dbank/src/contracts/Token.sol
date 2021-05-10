// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  address public minter;

  //add minter changed event
  event MinterChanged(address indexed from, address to);

  constructor() public payable ERC20("Decentralizalt Valuta", "DV") {
    minter = msg.sender;
  }

  function passMinterRole(address dBank) public returns (bool){
    require(msg.sender==minter, 'Hiba, csak a tulaj adhatja at a pass minter szerepet');
    minter = dBank;

    emit MinterChanged(msg.sender, dBank);
    return true;
  }

  function mint(address account, uint256 amount) public {
    //check if msg.sender have minter role
    require(msg.sender==minter, 'Hiba, A kuldonek nincs minter szerepe');
		_mint(account, amount);
	}
}