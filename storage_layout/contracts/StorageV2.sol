// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NameSpaceBase{
   /// @custom:storage-location erc7201:namespacebase.namespace
   struct NameSpaceStorge{
      uint256 value;
   }
 
   // keccak256(abi.encode(uint256(keccak256("namespacebase.namespace")) - 1)) & ~bytes32(uint256(0xff));
   bytes32 private constant STORAGE_LOCATION =
        0x7e31fe5911f47edfe836974ff5c6ad9d9332d5b2c19560fb77e6c71ff44c8700;


   constructor(){
      NameSpaceStorge storage $ = _getNameSpaceStorage();
      $.value = 3;
   }

   function _getNameSpaceStorage() private pure returns (NameSpaceStorge storage $) {
        assembly {
            $.slot := STORAGE_LOCATION
        }
   }
}

contract NameSpaceBase2{
   /// @custom:storage-location erc7201:namespacebase.namespace
   struct NameSpaceStorge{
      uint256 value;
      uint256 value2;
   }
 
   // keccak256(abi.encode(uint256(keccak256("namespacebase.namespace")) - 1)) & ~bytes32(uint256(0xff));
   bytes32 private constant STORAGE_LOCATION =
        0x7e31fe5911f47edfe836974ff5c6ad9d9332d5b2c19560fb77e6c71ff44c8700;


   constructor(){
      NameSpaceStorge storage $ = _getNameSpaceStorage();
      $.value = 3;
      $.value2 = 4;
   }

   function _getNameSpaceStorage() private pure returns (NameSpaceStorge storage $) {
        assembly {
            $.slot := STORAGE_LOCATION
        }
   }
}



contract StorageV2_1 is NameSpaceBase {
   uint256 value = 1;  
}

contract StorageV2_2 is NameSpaceBase2 {
   uint256 value = 1;
}
