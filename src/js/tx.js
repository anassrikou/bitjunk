App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Junk.json", function(junk) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Junk = TruffleContract(junk);
      // Connect provider to interact with contract
      App.contracts.Junk.setProvider(App.web3Provider);

      return App.getTransactions(App.account);
    });
  },

  render: function() {
    

    // Load contract data
    App.contracts.Junk.deployed().then(function(instance) {
      junkInstance = instance;
      return junkInstance.itemCounter();
    }).then(function(itemsCount) {
      var itemRow = $('#itemRow');
      var itemTemplate = $('#itemTemplate');
      var res = App.getTransactions(App.account);
      console.log(res)
      // for (var i = 1; i <= itemsCount; i++) {
      //   junkInstance.items(i).then(function(item) {
      //     var id = item[0];
      //     var name = item[1];
      //     var owner = item[2];
      //     var amount = item[3];
      //     var price = item[4];
      //     var description = item[5];
      //     var expire = item[6];

      //     // Render candidate Result
      //     var itemTemplate = `
      //             <tr>
      //             <td> ${sender} </td>
      //             <td> ${receiver} </td>
      //             </tr>`
      //     itemRow.append(itemTemplate);
      //   });
      // }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  getTransactions: function getTransactionsByAccount(myaccount, startBlockNumber, endBlockNumber) {
    var junkInstance;
    var loader = $("#loader");
    var content = $("#content");
    var txTemplate;
    var txItem = $('#txItem');

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
  if (endBlockNumber == null) {
    endBlockNumber = web3.eth.getBlockNumber(function(err, res){ if (err) return console.log(err); return res;});
    console.log("Using endBlockNumber: " + endBlockNumber);
  }
  if (startBlockNumber == null) {
    startBlockNumber = endBlockNumber - 1000;
    console.log("Using startBlockNumber: " + startBlockNumber);
  }
  console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);

  for (var i = 0; i <= 56; i++) {
    if (i % 1000 == 0) {
      console.log("Searching block " + i);
    }
    var block = web3.eth.getBlock(i, true, function(err, res){
      if (err) return console.log(err);
      //console.log(res.timestamp);
    if (res != null && res.transactions != null) {
      res.transactions.forEach( function(e) {
        if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
          console.log("tx hash : " + e.hash);
          e.to = web3.eth.accounts;
            txTemplate = `
            <div class="alert alert-dark" role="alert">
              <p>Hash: ${e.hash}</p>
              <p>nonce: ${e.nonce}</p>
              <p>blockHash: ${e.blockHash}</p>
              <p>blockNumber: ${e.blockNumber}</p>
              <p>sender: ${e.from}</p>
              <p>receiver: ${e.to}</p>
              </div>
            `
            content.append(txTemplate);
            };
          });
        };
      });
    };
    loader.hide();
    content.show();
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

