/**
 * Tests the node-webkit filesystem.
 */

var TESTING_DIR = 'codebot_tmp' + parseInt(Math.random() * 10000);

var fs      = require('fs');
var assert  = require("assert");
var os      = require("os");

var nwfs    = null;
var tmp     = null;
var workDir = null;

eval(fs.readFileSync('./js/codebot.io.js')+'');
eval(fs.readFileSync('./js/node-webkit/codebot.nw.filesystem.js')+'');

function checkValidNode(theNode, theIsFolder) {
    assert.ok(theNode, 'node is null');
    assert('path' in theNode, 'missing "path" property');
    assert('title' in theNode, 'missing "title" property');
    assert('name' in theNode, 'missing "name" property');
    
    if(theIsFolder) {
        assert('folder' in theNode, 'missing "folder" property');
        assert('key' in theNode, 'missing "key" property');
        assert('children' in theNode, 'missing "children" property');
        assert(theNode.folder, '"folder" property is false');
    }
}

describe('IO [codebot.nw.filesystem]', function(){
    before(function() {
    });
    
    describe('API', function(){
        it('works as a class', function(){
            nwfs = new NodeWebkitFileSystem();
            nwfs.init();
            
            assert.ok(nwfs);
        });
        
        it('complies with CodebotIO', function(){
            var s = new CodebotIO();
            for(var p in s) {
                assert.ok(p in nwfs, 'missing property/method "'+p+'"');
            }
        });
    });
    
    describe('#getTempDirectory()', function(){
        it('returns accurate pointer', function(){
            nwfs.getTempDirectory(function(node) {
                tmp = node;
                assert.ok(node);
                fs.exists(node.path, assert.ok)
            });
        });
        
        it('returned node is ok', function(){
            checkValidNode(tmp, true);
        });
    });

    describe('#createDirectory()', function(){
        it('creates dir with valid name', function(done){
            nwfs.createDirectory(TESTING_DIR, tmp, function(n) {
                assert.ok(n);
                assert(!(n instanceof Error));
                
                checkValidNode(n, true);
                workDir = n;
                
                done();
            });
        });
        
        it('creates several dirs', function(){
            nwfs.createDirectory('a', workDir, function(n) { assert(!(n instanceof Error)); });
            nwfs.createDirectory('b', workDir, function(n) { assert(!(n instanceof Error)); });
            nwfs.createDirectory('c', workDir, function(n) { assert(!(n instanceof Error)); });
            nwfs.createDirectory('d', workDir, function(n) { assert(!(n instanceof Error)); });
        });
        
        it('reports error with invalid dir name', function(){
            nwfs.createDirectory('', workDir, function(e) {
                assert(e instanceof Error);
            });
        });
    });
    
    describe('#readDirectory()', function(){
        it('reads valid dir', function(){
            nwfs.readDirectory(workDir, function(d) {
                assert(d instanceof Array);
                assert(d.length == 1);
                assert(d[0].children.length == 4);
                
                checkValidNode(d[0], true);
                
                workDir = d[0];
            }); 
        });
    });
    
    describe('#createFile()', function(){
        it('creates inexistent file', function(){
            nwfs.createFile('test.txt', workDir.children[0], 'Content of test.txt', function(e) {
                var content = fs.readFileSync(workDir.children[0].path + '/' + 'test.txt') + '';
                assert(content == 'Content of test.txt');
            });
        });
        
        it('updates existent file', function(){
            nwfs.createFile('test.txt', workDir.children[0], 'New content of test.txt', function(e) {
                var content = fs.readFileSync(workDir.children[0].path + '/' + 'test.txt') + '';
                assert(content == 'New content of test.txt');
            });
        });
    });
    
    describe('#readFile()', function(){
        it('reads inexistent file', function(){
            nwfs.readFile({path: 'invalid:path'}, function(e) {
                assert(e instanceof Error);
            });
        });
        
        it('reads existent file', function(){
            nwfs.readDirectory(workDir, function(d) {
                var f = d[0].children[0].children[0];
                assert.ok(f);
                
                nwfs.readFile(f, function(e) {
                    assert(!(e instanceof Error));
                    assert(e == 'New content of test.txt');
                });    
            });
        });
    });
});