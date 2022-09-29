pragma solidity >=0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {
    constructor() ERC721("Star Notary", "STAR") {}

    struct Star {
        string name;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string memory _name, uint256 _tokenId) public {
        Star memory newStar = Star(_name);
        tokenIdToStarInfo[_tokenId] = newStar;
        _mint(msg.sender, _tokenId);
        approve(address(this), _tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(
            ownerOf(_tokenId) == msg.sender,
            "You can't sell a Star you don't own"
        );
        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        require(msg.value > starCost, "You need to have enough Ether");
        IERC721(address(this)).safeTransferFrom(
            ownerAddress,
            msg.sender,
            _tokenId
        );
        payable(ownerAddress).transfer(starCost);
        if (msg.value > starCost) {
            payable(msg.sender).transfer(msg.value - starCost);
        }
    }

    // Implement Task 1 lookUptokenIdToStarInfo
    function lookUptokenIdToStarInfo(uint _tokenId)
        public
        view
        returns (string memory)
    {
        require(
            bytes(tokenIdToStarInfo[_tokenId].name).length != 0,
            "No star was found!"
        );
        return tokenIdToStarInfo[_tokenId].name;
    }

    // Implement Task 1 Transfer Stars
    function transferStar(address _to1, uint256 _tokenId) public {
        require(
            msg.sender == ownerOf(_tokenId),
            "You cant transfer a star you don't own!"
        );
        require(
            bytes(tokenIdToStarInfo[_tokenId].name).length != 0,
            "No star was found!"
        );
        IERC721(address(this)).safeTransferFrom(msg.sender, _to1, _tokenId);
    }

    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        require(
            msg.sender == ownerOf(_tokenId1) || msg.sender == ownerOf(_tokenId2)
        );
        address ownerOfToken1 = ownerOf(_tokenId1);
        address ownerOfToken2 = ownerOf(_tokenId2);
        IERC721(address(this)).safeTransferFrom(
            ownerOfToken1,
            ownerOfToken2,
            _tokenId1
        );
        IERC721(address(this)).safeTransferFrom(
            ownerOfToken2,
            ownerOfToken1,
            _tokenId2
        );
    }
}
