// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract CallContract{
    uint256 value;

    function setValue(uint256 _value) external{
        value = _value;
    }

    function getValue() external view returns(uint256){
        return value;
    }

    function getSender() external view returns(address){
        return msg.sender;
    }
}

contract MyContract {
    uint256 value;

    function setValueByCall(address _contract, uint256 _value) external{
        CallContract(_contract).setValue(_value);
    }

    function getSenderByCall(address _contract) external view returns(address){
        return CallContract(_contract).getSender();
    }

    function setValueByDelegateCall(address _contract, uint256 _value) external{
        (bool success, ) = _contract.delegatecall(abi.encodeWithSignature("setValue(uint256)", _value));
        require(success, "setValueByDelegateCall fail");
    }

    function getSenderByDelegateCall(address _contract) external returns(address sender){
        (bool success, bytes memory data) = _contract.delegatecall(abi.encodeWithSignature("getSender()"));
        require(success, "getSenderByDelegateCall fail");
        
        assembly {
            sender := mload(add(data, 32))
        }

        return sender;
    }

    function getValueByStaticCall(address _contract ) external view returns(uint256){
        (bool success, bytes memory data) = _contract.staticcall(abi.encodeWithSignature("getValue()"));
        require(success, "getValueByStaticCall fail");
        return abi.decode(data, (uint256));
    }

    function getSenderByStaticCall(address _contract) external view returns(address sender){
        (bool success, bytes memory data) = _contract.staticcall(abi.encodeWithSignature("getSender()"));
        require(success, "getSenderByStaticCall fail");
        
        assembly {
            sender := mload(add(data, 32))
        }

        return sender;
    }


    function setValue(uint256 _value) external{
        value = _value;
    }

    function getValue() external view returns(uint256){
        return value;
    }
}