import hbshelper from 'handlebars-helpers'
import ternary from 'handlebars-helper-ternary'
import paginateHelper from '../configs/PaginationConfig'
import moment from 'moment'
const helpers = hbshelper();

helpers.inc = (value, options) => {
  return parseInt(value) + 1
},

  helpers.math = function (lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
    return {
      "+": lvalue + rvalue,
      "-": lvalue - rvalue,
      "*": lvalue * rvalue,
      "/": lvalue / rvalue,
      "%": lvalue % rvalue
    }[operator];
  }

helpers.formatDate = function (date, format) {
  var mmnt = moment(date);
  return mmnt.format(format);
}

helpers.string = function(str) {
  return str.toString();
}

helpers.printArray = function (data) {
  let arr = []
  for (let i = 0; i < data.length; i++) {
    arr.push(data[i])
  }
  return arr;
}

helpers.numberFormat = function (value, options) {
  if(!value) return 0;
  // Helper parameters
  var dl = options.hash['decimalLength'] || 0;
  var ts = options.hash['thousandsSep'] || '.';
  var ds = options.hash['decimalSep'] || ',';

  // Parse to float
  var value = parseFloat(value);

  // The regex
  var re = '\\d(?=(\\d{3})+' + (dl > 0 ? '\\D' : '$') + ')';

  // Formats the number with the decimals
  var num = value.toFixed(Math.max(0, ~~dl));

  // Returns the formatted number
  return (ds ? num.replace('.', ds) : num).replace(new RegExp(re, 'g'), '$&' + ts);
}

helpers.ternary = ternary
helpers.paginateHelper = paginateHelper.createPagination

helpers.setVar = function (varName, varValue, options) {
  options.data.root[varName] = varValue
}

helpers.ifCond = function (v1, v2, options) {
  if (v1 == v2) {
    return options.fn(this);
  }
  return options.inverse(this);
}

helpers.ifAnd = function (v1, v2, v3, v4, options) {
  if (v1 == v2 && v3 == v4) {
    return options.fn(this);
  }
  return options.inverse(this);
}

helpers.ifAndOr = function (v1, v2, v3, v4, v5, v6, options) {
  if (v1 == v2 && v3 == v4 || v5 == v6) {
    return options.fn(this);
  }
  return options.inverse(this);
}

helpers.ifOrOne = function (v1, v2, v3, v4, options) {
  if (v1 == v2 || v3 == v4) {
    return options.fn(this);
  }
  return options.inverse(this);
}

helpers.ifOrTwo = function (v1, v2, v3, v4, v5, v6, options) {
  if (v1 == v2 || v3 == v4 || v5 == v6) {
    return options.fn(this);
  }
  return options.inverse(this);
}

helpers.ifEq = function (a, b, options) {
  if (a.equals(b)) {
    return options.fn(this);
  }
  return options.inverse(this);
}

helpers.ifLessEq = function (v1, v2, v3, v4, options) {
  if (v1 > v2 && v3 <= v4) {
    return options.fn(this);
  }
  return options.inverse(this);
}

helpers.ifMore = function (v1, v2, options) {
  if (v1 >= v2) {
    return options.fn(this);
  }
  return options.inverse(this);
}

helpers.ifNull = function (v1, options) {
  if (v1 == null) {
    return options.fn(this);
  }
  return options.inverse(this);
}

helpers.ifNotNull = function (v1, options) {
  if (v1 != null) {
    return options.fn(this);
  }
  return options.inverse(this);
}

helpers.times = function (page, pages, block) {
  var accum = '';
  var start_from = 1;
  var max_page = 10;
  var left_page = 5;
  var total_iter = pages - page;
  if (total_iter > max_page) {
    total_iter = max_page;
  } else {
    if (max_page - page < 5) {
      start_from = page - 2;
      total_iter = total_iter + 2;
    }
  }

  for (var i = 0; i <= total_iter; i++) {
    accum += block.fn(start_from);
    start_from++;
  }

  return accum;
}

export default helpers
