const retention = require('../consumer/retention.js');
const snapshots = require('./fixtures/sample.json');
var chai = require('chai');
var assert = chai.assert;

//console.log(JSON.stringify(kept, null, 4));

describe('Retention', function() {

  it ('should delete according to Test policy', async function() {
    const marked = await retention.Policy(snapshots, 'Test');
    assert.typeOf(marked, 'Array');
    let kept = marked.filter( s => s.retain).map( s => s.id );
    assert.lengthOf(kept, 3);
  });

  describe('with Standard policy', function() {
    it ('should work with a month', async function() {
      const marked = await retention.Policy(snapshots, 'Standard');
      assert.typeOf(marked, 'Array');
      let standard = require('./fixtures/standard_month.json');
      let kept = marked.filter( s => s.retain).map( s => s.id );
      assert.deepEqual(kept, standard.map( s => s.id ));
    });

    it ('should work with a full year', async function() {
      const fullyear = require('./fixtures/fullyear.json');
      const results = require('./fixtures/standard_fullyear.json');
      const marked = await retention.Policy(fullyear, 'Standard');
      assert.typeOf(marked, 'Array');
      let kept = marked.filter( s => s.retain).map( s => s.id );
      assert.deepEqual(kept, results);
    });

  });

  it ('should delete according to Weekly policy', async function() {
    const marked = await retention.Policy(snapshots, 'Weekly');
    assert.typeOf(marked, 'Array');
    let kept = marked.filter( s => s.retain);
    assert.lengthOf(kept, 7);
  });

  it ('should delete according to Fortnightly policy', async function() {
    const marked = await retention.Policy(snapshots, 'Fortnightly');
    assert.typeOf(marked, 'Array');
    let kept = marked.filter( s => s.retain).map( s => s.id );
    assert.lengthOf(kept, 14);
  });

  it ('should delete according to Biweekly policy', async function() {
    const marked = await retention.Policy(snapshots, 'Biweekly');
    assert.typeOf(marked, 'Array');
    let kept = marked.filter( s => s.retain);
    assert.lengthOf(kept, 2);
    assert.equal(kept[0].week, kept[1].week+1);
  });

  describe('with Monthly policy', function() {
    it ('should handle April', async function() {
      const marked = await retention.Policy(snapshots, 'Monthly');
      assert.typeOf(marked, 'Array');
      let kept = marked.filter( s => s.retain);
      assert.lengthOf(kept, 30);
    });

    it ('should handle leap February', async function() {
      const leap_feb = require('./fixtures/leap_feb.json');
      const marked = await retention.Policy(leap_feb, 'Monthly');
      assert.typeOf(marked, 'Array');
      let kept = marked.filter( s => s.retain);
      assert.lengthOf(kept, 29);
    });
  });

  it ('should delete according to CurrentMonth policy', async function() {
    const marked = await retention.Policy(snapshots, 'CurrentMonth');
    assert.typeOf(marked, 'Array');
    let kept = marked.filter( s => s.retain);
    assert.lengthOf(kept, 3);
  });
});

