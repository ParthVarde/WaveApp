//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract WavePortal {
    uint256 totalWaves;
    address[] allWaved;

    constructor() {}

    function wave() public {
        totalWaves += 1;
        allWaved.push(address(msg.sender));
    }

    function totalNumberWaves() public view returns (uint256) {
        return totalWaves;
    }

    function allPeopleThatWaved() public view returns (address[] memory) {
        return allWaved;
    }
}
