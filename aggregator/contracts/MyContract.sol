// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/AggregatorV3Interface.sol";

contract MyContract {
    function getPriceByOracle( 
        address _aggregatorAddress 
    ) view external returns(int256){

        if(_aggregatorAddress == address(0)){
            return 0;
        }

        (
            /* uint80 roundID */,
            int256 answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = AggregatorV3Interface(_aggregatorAddress).latestRoundData();

        if( answer < 0 ){
            return 0;
        }

        return answer;
    }
}