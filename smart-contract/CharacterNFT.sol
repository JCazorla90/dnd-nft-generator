// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CharacterNFT is ERC721URIStorage {
    uint256 public tokenCounter;

    constructor() ERC721("DNDCharacter", "DNDNFT") {
        tokenCounter = 0;
    }

    function mintCharacter(address recipient, string memory tokenURI) public returns (uint256) {
        uint256 newId = tokenCounter;
        _safeMint(recipient, newId);
        _setTokenURI(newId, tokenURI);
        tokenCounter += 1;
        return newId;
    }
}
