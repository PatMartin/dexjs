describe("dex.object", function () {
  var name = {'first' : 'pat', last : 'martin'};
  var deepObj = {
    'level1' : {
      'level2' : {'level3' : [1, 2, 3]}
    }
  };

  it("keys", function () {
    expect(dex.object.keys(name).sort()).toEqual(['first', 'last']);
  });

  it("clone", function () {
    var deepObjCopy = dex.object.clone(deepObj);
    expect(deepObjCopy).toEqual(deepObj);
    expect(deepObjCopy).not.toBe(deepObj);
    expect(deepObjCopy.level1).not.toBe(deepObj.level1);
    expect(deepObjCopy.level1.level2).not.toBe(deepObj.level1.level2);
    expect(deepObjCopy.level1.level2.level3).not
      .toBe(deepObj.level1.level2.level3);

    var date = new Date();
    var copiedDate = dex.object.clone(date);
    expect(copiedDate).toEqual(date);
    expect(copiedDate).not.toBe(date);

    var array = [1, 2, 3];
    var copiedArray = dex.object.clone(array);
    expect(copiedArray).toEqual(array);
    expect(copiedArray).not.toBe(array);
  });

  it("overlay", function () {
    var top = {
      'level1'                   : {
        'level2' : {
          'level3' : "top-level4"
        }
      },
      'top-only'                 : true,
      'bottom-and-top-collision' : 'top',
      'partial-default'          : {'setting-c' : 'c'}
    };
    var bottom = {
      'level1'                   : {
        'level2' : {
          'level3' : "bottom-level4"
        }
      },
      'bottom-only'              : true,
      'bottom-and-top-collision' : 'bottom',
      'partial-default'          : {
        'setting-a' : 'a',
        'setting-b' : 'b'
      }
    };

    var overlay = dex.object.overlay(top, bottom);

    expect(overlay).not.toBe(top);
    expect(overlay).not.toBe(bottom);
    expect(overlay).toEqual({
      'level1'                   : {'level2' : {'level3' : 'top-level4'}},
      'top-only'                 : true,
      'bottom-only'              : true,
      'bottom-and-top-collision' : 'top',
      'partial-default' : {
        'setting-a' : 'a',
        'setting-b' : 'b',
        'setting-c' : 'c'
      }
    });
  });

  it("isNode", function() {
    expect(dex.object.isNode(document.body)).toEqual(true);
  });

  it("isElement", function() {
    expect(dex.object.isElement(document.body)).toEqual(true);
  });

  /* Deprecated in favor of _.contains()
  it("contains", function() {
    var array = [ 1, 2, 3 ];
    var map = { 'a' : 'a', 'b' : 'b', 'c' : 'c' };

    expect(dex.object.contains(array, 1)).toEqual(true);
    expect(dex.object.contains(map, 'a')).toEqual(true);
  });
*/

  it('isFunction', function() {
    expect(dex.object.isFunction(Math.min)).toBe(true);
    expect(dex.object.isFunction(function () {} )).toBe(true);
    expect(dex.object.isFunction('a')).toBe(false);
  });

});