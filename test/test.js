'use strict'
const { expect } = require('chai')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const data = require('../data/data.json')

let dom, document, content

const addCommas = (total, type) => {
  total += ''
  const x = total.split('.')
  let x1 = x[0]
  let x2 = x.length > 1 ? '.' + x[1] : ''
  const rgx = /(\d+)(\d{3})/
  while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + '.' + '$2')
  }
  const totalWithCommas = x1 + x2
  return type === 'revenue' ? `${totalWithCommas}€` : totalWithCommas
}

before(async () => {
  const options = {
    runScripts: "dangerously",
    resources: "usable",
    includeNodeLocations: true
  }

  dom = await JSDOM.fromFile('index.html', options)    
  document = dom.window.document
  content = dom.window.document.documentElement.outerHTML;
})


describe('display correct values from data', () => {
  it('should contain revenue values', (done) => {
    const { revenue } = data
    setTimeout(() => {
      expect(document.body.textContent.trim()).include(addCommas(revenue.current[0].value));
      expect(document.body.textContent.trim()).include(addCommas(revenue.current[1].value));
      done()
    }, 1000)
  })

  it('should contain impression values', (done) => {
    const { impressions } = data
      expect(document.body.textContent.trim()).include(addCommas(impressions.current[0].value));
      expect(document.body.textContent.trim()).include(addCommas(impressions.current[1].value));
      done()
  })

  it('should contain visits values', (done) => {
    const { visits } = data
      expect(document.body.textContent.trim()).include(addCommas(visits.current[0].value));
      expect(document.body.textContent.trim()).include(addCommas(visits.current[1].value));
      done()
  })

  it('should contain revenue total value', (done) => {
    const { revenue } = data
      expect(document.body.textContent.trim()).include(addCommas(revenue.current[0].value + revenue.current[1].value));
      done()
  })

  it('should contain impressions total value', (done) => {
    const { impressions } = data
      expect(document.body.textContent.trim()).include(addCommas(impressions.current[0].value + impressions.current[1].value));
      done()
  })

  it('should contain visits total value', (done) => {
    const { visits } = data
      expect(document.body.textContent.trim()).include(addCommas(visits.current[0].value + visits.current[1].value));
      done()
  })
})