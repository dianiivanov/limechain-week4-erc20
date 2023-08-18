// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyToken is IERC20 {
    string public _name;
    string public _symbol;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Minted(
        address indexed caller,
        address indexed account,
        uint256 amount
    );
    event Burned(
        address indexed caller,
        address indexed account,
        uint256 amount
    );
    error InsufficientBalance(address account, uint256 amount);
    error InsufficientAllowance(address account, uint256 amount);
    error ZeroAddressNotAllowed();

    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply_
    ) {
        _name = name;
        _symbol = symbol;
        _mint(msg.sender, totalSupply_);
    }

    function transfer(
        address to,
        uint amount
    )
        public
        virtual
        override
        shouldNotBeZeroAddress(to)
        onlyForSufficientBalance(amount, msg.sender)
        returns (bool)
    {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);

        return true;
    }

    function approve(
        address spender,
        uint256 amount
    )
        external
        shouldNotBeZeroAddress(spender)
        onlyForSufficientBalance(amount, msg.sender)
        returns (bool)
    {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    )
        external
        virtual
        override
        shouldNotBeZeroAddress(from)
        shouldNotBeZeroAddress(to)
        onlyForSufficientBalance(amount, from)
        onlyForSufficientAllowance(amount, from, msg.sender)
        returns (bool)
    {
        balanceOf[from] -= amount;
        allowance[from][msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }

    function _mint(
        address account,
        uint256 amount
    ) internal shouldNotBeZeroAddress(account) {
        totalSupply += amount;
        balanceOf[account] += amount;
        emit Minted(msg.sender, account, amount);
    }

    function _burnFrom(
        address account,
        uint256 amount
    ) internal onlyForSufficientBalance(amount, account) {
        balanceOf[account] -= amount;
        totalSupply -= amount;
        emit Burned(msg.sender, account, amount);
    }

    function burn(uint256 amount) public {
        _burnFrom(msg.sender, amount);
    }

    modifier shouldNotBeZeroAddress(address account) {
        if (account == address(0)) {
            revert ZeroAddressNotAllowed();
        }
        _;
    }

    modifier onlyForSufficientBalance(
        uint256 givenAmount,
        address balanceOwner
    ) {
        if (givenAmount > balanceOf[balanceOwner]) {
            revert InsufficientBalance(msg.sender, givenAmount);
        }
        _;
    }

    modifier onlyForSufficientAllowance(
        uint256 givenAmount,
        address balanceOwner,
        address allowanceOwner
    ) {
        if (givenAmount > allowance[balanceOwner][allowanceOwner]) {
            revert InsufficientAllowance(msg.sender, givenAmount);
        }
        _;
    }
}
