const utils = require('../src/utils'); 
const tables = require('./table');

test('Should add 1 cell (2 rowspan)', () => {
  let matrix = [
    [[-3,1],[-3,1]],
    [[-2,1],[2,1]],
    [[-2,1]]
  ];
  let expected = [
    [[-3,1],[-3,1]],
    [[-2,1],[2,1]],
    [[-2,1],[0,1]]
  ];
  let result = utils.processMatrix(matrix);
  expect(result).toEqual(expected);
});


test('Should add 1 cell (2 rowspan)', () => {
  let matrix = [
    [[-3,1],[-3,1],[-3,2]],
    [[-2,1],[1,1],[1,1],[1,1]],
    [[-2,1],[1,1],[2,1],[1,1]],
    [[-2,1],[1,1],[1,1]],
  ];
  let expected = [
    [[-3,1],[-3,1],[-3,2]],
    [[-2,1],[1,1],[1,1],[1,1]],
    [[-2,1],[1,1],[2,1],[1,1]],
    [[-2,1],[1,1],[0,1],[1,1]],
  ];
  let result = utils.processMatrix(matrix);
  expect(result).toEqual(expected);
});

test('Should add 3 cells ( 2 rowspan 2 colspan)', () => {
  let matrix = [
    [[-3,1],[-3,2]],
    [[-2,1],[2,2]],
    [[-2,1]]
  ];
  let expected = [
    [[-3,1],[-3,2]],
    [[-2,1],[2,2],[0,1]],
    [[-2,1],[0,1],[0,1]]
  ];
  let result = utils.processMatrix(matrix);
  expect(result).toEqual(expected);
});

test('Should add 1 cell (2 colspan)', () => {
  let matrix = [
    [[-3,1],[-3,2]],
    [[-2,1],[1,2]],
  ];
  let expected = [
    [[-3,1],[-3,2]],
    [[-2,1],[1,2],[0,1]],
  ];
  let result = utils.processMatrix(matrix);
  expect(result).toEqual(expected);
});

