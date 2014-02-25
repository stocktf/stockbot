
function itemsValidator (eventInv, realInv) {

  // Check lengths of both inventories
  if (eventInv.length !== realInv.length) {

    return false;

  }

  // Check that both inventories are the same
  for (var i = eventInv.length; i--;) {

    if (eventInv[i] !== realInv[i]) {

      return false;

    }

  }

  return true;

}

module.exports = itemsValidator;