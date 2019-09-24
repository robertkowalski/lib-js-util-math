'use strict'

const { expect } = require('chai')
const { BN } = require('../src/bn')
const { stdDeviation, filterStdDeviated } = require('../src/std-deviation')
const BigNumber = BN()

module.exports = () => {
  describe('# std-deviation-tests', () => {
    it('stdDeviation - it should fail with invalid input', () => {
      const values = ['10161', { price: '10261.235', amount: '1' }]

      return expect(
        stdDeviation.bind(null, values)
      ).to.throw()
    })

    it('stdDeviation - it should fail with non numeric value', () => {
      const values = ['10152.235', 'a10261.235']

      return expect(
        stdDeviation.bind(null, values)
      ).to.throw()
    })

    it('stdDeviation - it should return expected value with valid config', () => {
      const values = [10500, 10700, 11500, '12300', 5000, 5100]

      const dev = stdDeviation(values)
      expect(dev instanceof BigNumber).to.be.true
      return expect(dev.toFixed()).to.be.equal('2980.16591633568094682823')
    })

    it('stdDeviation - it should work with single item in array', () => {
      const values = [10500]

      const dev = stdDeviation(values)
      expect(dev instanceof BigNumber).to.be.true
      return expect(dev.toFixed()).to.be.equal('0')
    })

    it('stdDeviation - it should return expected value with selector arg', () => {
      const values = [
        { price: 10500, amount: '1' },
        { price: 10700, amount: '1' },
        { price: 11500, amount: '1' },
        { price: '12300', amount: '1' },
        { price: 5000, amount: '1' },
        { price: 5100, amount: '1' },
      ]

      const dev = stdDeviation(values, (a) => a.price)
      expect(dev instanceof BigNumber).to.be.true
      return expect(dev.toFixed()).to.be.equal('2980.16591633568094682823')
    })

    it('filterStdDeviated - it should fail with invalid input', () => {
      const values = ['10161', { price: '10261.235', amount: '1' }]

      return expect(
        filterStdDeviated.bind(null, values, 2000)
      ).to.throw()
    })

    it('filterStdDeviated - it should fail with non numeric price', () => {
      const values = ['10152.235', 'a10261.235']

      return expect(
        filterStdDeviated.bind(null, values, 2000)
      ).to.throw()
    })

    it('filterStdDeviated - it should fail with non numeric threshold', () => {
      const values = ['10152.235', 'a10261.235']

      return expect(
        filterStdDeviated.bind(null, values, 'a232')
      ).to.throw()
    })

    it('filterStdDeviated - it should return expected value with valid config', () => {
      const values = [10500, 10700, 11500, '12300', 5000, 5100]

      const res = filterStdDeviated(values, '2000')
      const remaining = [10500, 10700, 11500, '12300']
      return expect(res).to.satisfy(res => res.every(n => remaining.includes(n)))
    })

    it('filterStdDeviated - it should work with single item in array', () => {
      const values = [10500]

      const res = filterStdDeviated(values, 2000)
      expect(res.length).to.be.equal(1)
      return expect(res[0]).to.be.equal(10500)
    })

    it('filterDeviated - it should return expected value with selector arg', () => {
      const values = [
        { price: 10500, amount: '1' },
        { price: 10700, amount: '1' },
        { price: 11500, amount: '1' },
        { price: '12300', amount: '1' },
        { price: 5000, amount: '1' },
        { price: 5100, amount: '1' },
      ]

      const res = filterStdDeviated(values, '2000', (a) => a.price)
      const remaining = [10500, 10700, 11500, '12300']
      return expect(res).to.satisfy(res => res.every(a => remaining.includes(a.price)))
    })

  })
}
