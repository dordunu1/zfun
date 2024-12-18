pragma solidity =0.5.16;

import '../interfaces/IUniswapV2Factory.sol';
import './UniswapV2Pair.sol';

contract UniswapV2Factory is IUniswapV2Factory {
    address public feeTo;
    address public feeToSetter;

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint);
    event FeeToUpdated(address indexed oldFeeTo, address indexed newFeeTo);
    event FeeToSetterUpdated(address indexed oldFeeToSetter, address indexed newFeeToSetter);

    constructor(address _feeToSetter, address _initialFeeTo) public {
        require(_feeToSetter != address(0), "UniswapV2: INVALID_FEE_SETTER");
        require(_initialFeeTo != address(0), "UniswapV2: INVALID_FEE_TO");
        feeToSetter = _feeToSetter;
        feeTo = _initialFeeTo;
        emit FeeToUpdated(address(0), _initialFeeTo);
        emit FeeToSetterUpdated(address(0), _feeToSetter);
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, 'UniswapV2: IDENTICAL_ADDRESSES');
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'UniswapV2: ZERO_ADDRESS');
        require(getPair[token0][token1] == address(0), 'UniswapV2: PAIR_EXISTS'); // single check is sufficient
        bytes memory bytecode = type(UniswapV2Pair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IUniswapV2Pair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        require(_feeTo != address(0), "UniswapV2: INVALID_FEE_TO");
        emit FeeToUpdated(feeTo, _feeTo);
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        require(_feeToSetter != address(0), "UniswapV2: INVALID_FEE_SETTER");
        emit FeeToSetterUpdated(feeToSetter, _feeToSetter);
        feeToSetter = _feeToSetter;
    }
}
