//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract WavePortal {
    uint256 totalWaves;

    constructor() payable {}

    event NewWave(address indexed from, string message, uint256 timestamp);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    function wave(string memory _message) public {
        totalWaves += 1;
        waves.push(Wave(msg.sender, _message, block.timestamp));
        emit NewWave(msg.sender, _message, block.timestamp);

        uint256 priceAmount = 0.0001 ether;
        require(
            priceAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );
        (bool success, ) = (msg.sender).call{value: priceAmount}("");
        require(success, "Failed to withdraw money from contract.");
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}
