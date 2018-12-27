import {debug, error} from './utils/logging'

const accountFieldType = {
  name: 'required',
  selected: 'required',
};

function cleanupAccount(account) {
  const cleanedUpAccount = {};
  Object.keys(account).forEach(field => {
    if (accountFieldType[field]) cleanedUpAccount[field] = account[field];
  });
  debug('clean ', cleanedUpAccount);
  return cleanedUpAccount;
}

function convertAccount(account) {
  account.stlmtDate = convertDate(account.stlmtDate);
  if (account.qty && typeof account.qty === 'string') account.qty = unformat(account.qty);
  if (account.price && typeof account.price === 'string') account.price = unformat(account.price);
  if (account.amt && typeof account.amt === 'string') account.amt = unformat(account.amt);
  if (!account.changedAcb) account.changedAcb = 0;
  if (!account.newAcb) account.newAcb = 0;
  if (!account.remainQty) account.remainQty = 0;
  if (!account.gain) account.gain = 0;
  debug('convertAccount ', account);
  return cleanupAccount(account);
}

const validAccountAction = {
  buy: true,
  sell: true,
};

function validSelected(value){
  if(value === ture || value === false){
    return true;
  }
}
function validName(value){
  if(value.length > 128 || value.length === 0 ){
    return false;
  }
}
function validateAccount(account) {
  const errors = [];
  Object.keys(accountFieldType).forEach(field => {
    if (accountFieldType[field] === 'required' && !account[field]) {
      errors.push(`Missing mandatory field: ${field}`);
    }
  });

  if (!validSelected[account.selected]) {
    errors.push(`${account.selected} is not a valid value.`);
  }
  if (!validName[account.name]) {
    errors.push(`${account.name} 's length is larger than 128 or equal to zero.`);
  }

  if(errors.length >0 ) {
    error('valid ', errors);
  }
  return (errors.length ? errors.join('; ') : null);
}

function format(obj) {
  return `${obj.stlmtDate},${obj.symbol},${obj.action},${obj.price} * ${obj.qty}=${obj.amt}\
          acb:c:${obj.changedAcb},n:${obj.newAcb},rQty: ${obj.remainQty},gain: ${obj.gain}`

}

export default {
  validateAccount,
  cleanupAccount,
  convertAccount,
  format,
};
