pragma solidity >=0.8.7;

contract StarNotary {
    string public starName;
    address public starOwner;

    event starClaimed(address owner);

    constructor() {
        starName = "Izzy's Star";
    }

    function claimStar() public {
        starOwner = msg.sender;
        emit starClaimed(msg.sender);
    }

    function changeStarName(string memory _name) public {
        require(msg.sender == starOwner);
        starName = _name;
    }
}
