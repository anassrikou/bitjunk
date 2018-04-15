pragma solidity ^0.4.2;

/**
 * The Junk contract 
 */
contract Junk {
//make model
struct Item {
    uint id;
    string name;
    string owner;
    uint amount;
    uint stock_price;
    string description;
    string expire;
}


//fetch items
mapping (uint => Item) public items;


//item counter
uint public itemCounter;


//buyers list
address[] public buyers;

// Retrieving the buyers
function getBuyers() public view returns (address[]) {
  return buyers;
}

function addItem (
    string _name, 
    string _owner, 
    uint _amount,
    uint _stock_price,
    string _description,
    string _expire  ) private {

    itemCounter++;
    items[itemCounter] = Item(itemCounter, _name, _owner, _amount, _stock_price, _description, _expire);
}

function buy (uint _itemId) public returns (uint) {

    //check if the user is trying to buy invalid item
    require (_itemId > 0 && _itemId <= itemCounter);

    buyers[_itemId] = msg.sender;

    return _itemId;
}


    function Junk () public {
        addItem("eggs", "farm", 100, 4, "organic, decomposable", "17/04/2018");
        addItem("wood", "forest inc", 1000, 25, "organic, decomposable, flammable", "17/04/2020");
        addItem("unusable oil", "chips factory", 10000, 63, "organic, flammable", "17/04/2019");
        addItem("potatoes peels", "chips factory", 3000, 42, "organic, decompsable", "17/04/2019");
        addItem("broken electronics", "Samsung inc", 1000, 97, "metal, alumunium, copper", "17/04/2020");
        addItem("plastic", "Atlas plastic factory", 6000, 62, "80% PVC", "17/04/2050");
    }    
}

