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

describe('include necessary elements', () => {
  it('should contain 3 charts', (done) => {
    expect(document.getElementById('chart1')).to.exist
    expect(document.getElementById('chart2')).to.exist
    expect(document.getElementById('chart3')).to.exist
    done()
  })

  it('should contain 3 stat div\'s with correct labels', (done) => {
    const { revenue, impressions, visits } = data
    const stats1 = document.getElementById('stats1')
    const stats2 = document.getElementById('stats2')
    const stats3 = document.getElementById('stats3')

    expect(stats1).to.exist
    expect(stats1.textContent.trim()).include('Smartphone')
    expect(stats1.textContent.trim()).include('Tablet')
    expect(stats2).to.exist
    expect(stats2.textContent.trim()).include('Smartphone')
    expect(stats2.textContent.trim()).include('Tablet')
    expect(stats3).to.exist
    expect(stats3.textContent.trim()).include('Smartphone')
    expect(stats3.textContent.trim()).include('Tablet')
    done()
  })

  it('should contain 3 stat div\'s with correct values', (done) => {
    const { revenue, impressions, visits } = data
    const stats1 = document.getElementById('stats1')
    const stats2 = document.getElementById('stats2')
    const stats3 = document.getElementById('stats3')

    expect(stats1.textContent.trim()).include(addCommas(revenue.current[0].value))
    expect(stats1.textContent.trim()).include(addCommas(revenue.current[1].value))
    expect(stats2.textContent.trim()).include(addCommas(impressions.current[0].value))
    expect(stats2.textContent.trim()).include(addCommas(impressions.current[1].value))
    expect(stats3.textContent.trim()).include(addCommas(visits.current[0].value))
    expect(stats3.textContent.trim()).include(addCommas(visits.current[1].value))
    done()
  })

  it('should contain 3 svg\'s, one for each chart', (done) => {
    const svgs = document.querySelectorAll('svg')
    expect(svgs.length).to.equal(3)
    done()
  })
})