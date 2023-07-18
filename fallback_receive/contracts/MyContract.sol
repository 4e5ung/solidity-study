// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    event FallbackLog(string name);
    event ReceiveLog(string name);

    // calldata 존재
    fallback() external payable {
        emit FallbackLog("fallback");
    }

    // calldata 존재하지 않음
    receive() external payable {
        emit ReceiveLog("receive");
    }
}

contract NonFunction {
    uint256 private data;

    function setData() external{
        data++;
    }
}