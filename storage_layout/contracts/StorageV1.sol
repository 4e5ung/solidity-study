// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GapBase{
   uint256 base = 2;
}

contract GapBase2{
   uint256 base = 2;
   uint256[2] __gap;
}

contract GapBase3{
   uint256 base = 2;
   uint256 base2 = 3;
   uint256[1] __gap;
}

contract StorageV1_1 is GapBase {
   uint256 value = 1;
}

contract StorageV1_2 is GapBase2 {
   uint256 value = 1;
}

contract StorageV1_3 is GapBase3 {
   uint256 value = 1;
}

