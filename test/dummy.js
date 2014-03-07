/**
 * Dummy test case.
 */

var fs = require('fs');
var assert = require("assert");

eval(fs.readFileSync('./js/codebot.io.js')+'');

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
        var s = new CodebotIO();
        assert.ok(s, 'oops!');
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})