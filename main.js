const graphs = [
  {
    "type": "revenue",
    "colors": ['#3A6717','#8AD346']
  },
  {
    "type": "impressions",
    "colors": ['#73C9E5','#325168']
  },
  {
    "type": "visits",
    "colors": ['#EFC42A','#BC5620']
  }
]

document.addEventListener('DOMContentLoaded', () => {
  console.log( "ready!" )
  loadJSON(async function(res) {
    const allData = JSON.parse(res)
    start(allData)
  })
})

renderGraph = (data, colors, div, type) => {
  const width = 300
  const height = 260

  const svg = d3.select(`#${div}`)
    .append('svg')
    .attr('class', 'pie')
    .attr('width', width)
    .attr('height', height)

  const g = svg.append('g')

  const totalData = data.historical
  const widthLine = 400
  const heightLine = 200

  const x = d3.scaleBand()
    .domain(totalData.map(function(d) { return d.date }))
    .rangeRound([0, widthLine])

  const y = d3.scaleLinear()
    .domain(d3.extent(totalData, function(d) { return d.value }))
    .rangeRound([heightLine, 0])

  const line = d3.line()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.date) })
    .y(function(d) { return y(d.value) })

  g.append('path')
    .datum(totalData)
    .attr('class', 'line')
    .attr('d', line)
    .attr('stroke',colors[0])
    .attr('opacity','0.2')

  const area = d3.area()
    .x(function(d) { return x(d.date) })
    .y0(height)
    .y1(function(d) { return y(d.value) })

  g.append('path')
    .datum(totalData)
    .attr('d', area)
    .attr('fill',colors[1])
    .attr('opacity','0.1')

}

start = (allData) => {
  graphs.forEach((graph, index) => {
    const { type, colors } = graph
    const data = allData[type]
    const chartDiv = `chart${index+1}`
    renderGraph(data, colors, chartDiv, type, index)
  })
}

addCommas = (total, type) => {
  total += ''
  const x = total.split('.')
  const x1 = x[0]
  const x2 = x.length > 1 ? '.' + x[1] : ''
  const rgx = /(\d+)(\d{3})/
  while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + '.' + '$2')
  }
  const totalWithCommas = x1 + x2
  return type === 'revenue' ? `${totalWithCommas}€` : totalWithCommas
}

loadJSON = callback => {
  const req = new XMLHttpRequest()

  req.overrideMimeType("application/json")
  req.open('GET', 'data/data.json', true)
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == "200") {
      callback(req.responseText)
    }
  }
  req.send(null)
}