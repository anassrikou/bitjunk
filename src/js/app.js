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

      return App.render();
    });
  },

  render: function() {
    var junkInstance;
    var buyers;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
      }
    });

    // Load contract data
    App.contracts.Junk.deployed().then(function(instance) {
      junkInstance = instance;
      instance.getBuyers().then(function(res){ console.log(res)}).catch(err => console.log(err));
      //console.log(buyers);
      return junkInstance.itemCounter();
    }).then(function(itemsCount) {
      var itemRow = $('#itemRow');
      var itemTemplate = $('#itemTemplate');

      for (var i = 1; i <= itemsCount; i++) {
        junkInstance.items(i).then(function(item) {
          var id = item[0];
          var name = item[1];
          var owner = item[2];
          var amount = item[3];
          var price = item[4];
          var description = item[5];
          var expire = item[6];

          // Render items Result
          itemTemplate = `
                  <tr>
                  <td> ${name} </td>
                  <td> ${owner} </td>
                  <td> ${amount} </td>
                  <td> ${price} </td>
                  <td> ${description}</td>
                  <td> ${expire} </td>
                  <td> <button class="btn btn-primary" onclick="App.buyItem(${id})">buy</button></td>
                  </tr>`
          itemRow.append(itemTemplate);
        });
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  buyItem: function(itemId) {
   // var itemId = $('#candidatesSelect').val();
    App.contracts.Junk.deployed().then(function(instance) {
      return instance.buy(itemId, { from: App.account});
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  additem: function addItem(name, owner, amount, stock_price, description, expire){
    App.contracts.Junk.deployed().then(function(instance){
      return instance.addItem();
    }).then(function(result) {
      console.log(result);
      //document.location.reload();
    }).catch(function(err){
      console.error(err);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();


const form = $('#addform');
form.on('submit', function(e){
  e.preventDefault();
  const name = this.name.value;
  const owner = this.owner.value;
  const amount = this.amount.value;
  const stock_price = this.stock_price.value;
  const description = this.description.value;
  const expire = this.expire.value;
  var itemTemplate = `
                  <tr>
                  <td> ${name} </td>
                  <td> ${owner} </td>
                  <td> ${amount} </td>
                  <td> ${stock_price} </td>
                  <td> ${description}</td>
                  <td> ${expire} </td>
                  <td> <button class="btn btn-primary">buy</button></td>
                  </tr>`;
  var itemRow = $('#itemRow');
  itemRow.append(itemTemplate);
  App.additem(name, owner, amount, stock_price, description, expire);

});


  });
});
