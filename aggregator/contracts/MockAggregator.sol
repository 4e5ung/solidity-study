// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


contract MockAggregator {
    int256 public answer;

    constructor(){
        answer = 53970922;
    }

    function latestRoundData()
    external view returns (uint80, int256, uint256, uint256, uint80) {
        return (0,answer,0,0,0);
    }

    function setAnswer(int256 _answer) external{
        answer = _answer;
    }
}