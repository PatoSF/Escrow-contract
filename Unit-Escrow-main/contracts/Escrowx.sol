// SPDX-License-Identifier: MIT
//AETHER
// File: @openzeppelin/contracts/security/ReentrancyGuard.sol
// OpenZeppelin Contracts v4.4.1 (security/ReentrancyGuard.sol)
pragma solidity ^0.8.0;
import "hardhat/console.sol";

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */

abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.
    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        // On the first call to nonReentrant, _notEntered will be true
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;
        _;
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }
}

// File: contracts/Descrow.sol
contract Escrowx is ReentrancyGuard {
    string public name = "Escrowx";
    address payable public owner;
    uint256 public id = 0;
    uint256 rate;
    uint256 okeee;
    uint256 meche;
    uint256 total;
    address payable zigner;

    struct contractSchema {
        uint256 escrowBalance;
        address payable escrowBenefactor;
        address payable escrowBenefactee;
        bool sign1;
        bool sign2;
        bool isActive;
    }

    event DepositId(uint256 indexed id);
    mapping(uint256 => contractSchema) public contractData;

    constructor(uint256 _rate, address payable _owner) payable {
        owner = _owner;
        rate = _rate;
    }

    // event Test(address add);
    // function test(address _sender) public { emit Test(_sender);}

    function depositTokens(address payable benefactee)
        external
        payable
        nonReentrant
    {
        require(
            msg.sender != benefactee,
            " benefactor and benefactee cannot be the same!"
        );
        require(msg.value > 0, "cannot deposit zero tokens ");
        uint256 amount = (msg.value * (100 - rate)) / 100; // percentage for the escrow
        total = amount;
        id += 1;
        owner.transfer((msg.value * rate) / 100);
        contractData[id].escrowBalance = amount;
        contractData[id].escrowBenefactor = payable(msg.sender);
        contractData[id].escrowBenefactee = benefactee;
        contractData[id].sign1 = false;
        contractData[id].sign2 = false;
        contractData[id].isActive = true;
        emit DepositId(id);
    }

    function returnamount() public view returns (uint256) {
        return total;
    }

    function check_escrowbenefactor1() public view returns (address) {
        return contractData[id].escrowBenefactor;
    }

    function check_escrowbenefactee1() public view returns (address) {
        return contractData[id].escrowBenefactee;
    }

    function readbalance() public view returns (uint256) {
        return contractData[id].escrowBalance;
    }

    function readisactive1() public view returns (bool) {
        return contractData[id].isActive;
    }

    //Added read() to check if id is equal to 1
    function read() public view returns (uint256) {
        return id;
    }

    function releaseTokens(uint256 Cid) public nonReentrant {
        okeee = Cid;
        address payable benefactee = contractData[Cid].escrowBenefactee;
        require(contractData[Cid].isActive, "Contract is already done ");
        require(
            msg.sender == contractData[Cid].escrowBenefactor ||
                msg.sender == contractData[Cid].escrowBenefactee,
            "Unauthorized"
        );
        require(
            contractData[Cid].sign1 && contractData[Cid].sign2,
            "Signature missing "
        );
        uint256 amount = contractData[Cid].escrowBalance;
        benefactee.transfer(amount);
        contractData[Cid].isActive = false;
    }

    function readsign1() public view returns (bool) {
        return contractData[id].sign1;
    }

    function readisign2() public view returns (bool) {
        return contractData[id].sign2;
    }

    function check_escrowbenefactor2() public view returns (address) {
        return contractData[okeee].escrowBenefactor;
    }

    function check_escrowbenefactee2() public view returns (address) {
        return contractData[okeee].escrowBenefactee;
    }

    function readisactive2() public view returns (bool) {
        return contractData[okeee].isActive;
    }

    function mediate(uint256 isFinished, uint256 Conid) public nonReentrant {
        require(msg.sender == owner, "err1");
        // check if contract is still active or finished
        require(contractData[Conid].isActive);
        address payable benefactee = contractData[Conid].escrowBenefactee;
        address payable benefactor = contractData[Conid].escrowBenefactor;
        uint256 amount = contractData[Conid].escrowBalance;
        if (isFinished == 1) {
            // bagem and tagem finished contract clean data make sure this contract isnt called again
            benefactee.transfer(amount);
            contractData[Conid].isActive = false;
        } else if (isFinished != 1) {
            benefactor.transfer(amount);
            // bagem and tagem finished contract  clean data make sure this contract isnt called again
            contractData[Conid].isActive = false;
        }
    }

    function setRate(uint256 _rate) external nonReentrant {
        rate = _rate;
    }

    //Added a getRate() function
    function getRate() public view returns (uint256) {
        return rate;
    }

    function sign(uint256 Conid) public nonReentrant {
        meche = Conid;
        require(contractData[Conid].isActive);
        address payable signer = payable(msg.sender);

        require(
            signer == contractData[Conid].escrowBenefactor ||
                signer == contractData[Conid].escrowBenefactee
        );
        if (signer == contractData[Conid].escrowBenefactor) {
            require(!contractData[Conid].sign1, "already signed ");
            contractData[Conid].sign1 = true;
            zigner = signer;
        } else {
            require(!contractData[Conid].sign2, "already signed ");
            contractData[Conid].sign2 = true;
            zigner = signer;
        }
    }

    //////////////////////////////////////////////////////////////////
    //Added read() to check if id is equal to 1
    function check_isactive_conid() public view returns (bool) {
        return contractData[meche].isActive;
    }

    function check_signer() public view returns (address payable) {
        return zigner;
    }

    function check_escrowbenefactor() public view returns (address payable) {
        return contractData[meche].escrowBenefactor;
    }

    function check_escrowbenefactee() public view returns (address payable) {
        return contractData[meche].escrowBenefactee;
    }

    function check_sign1() public view returns (bool) {
        return contractData[meche].sign1;
    }

    function check_sign2() public view returns (bool) {
        return contractData[meche].sign2;
    }

    /////////////////////////////////////////////////////////

    function viewtotal() public view returns (uint256) {
        return address(this).balance;
    }
}
