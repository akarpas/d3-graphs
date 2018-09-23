const graphs = [
  {
    "type": "revenue",
    "colors": ['#8AD346','#3A6717']
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
  loadJSON(res => {
    const allData = JSON.parse(res)
    start(allData)
  })
})

renderGraph = (data, colors, div, type) => {
  const currentData = data.current
  const total = addCommas(String(currentData[0].value + currentData[1].value), type)

  const width = 300
  const height = 260
  const radius = 120
  const thickness = 15

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
  
  g.append('path')
    .attr(
      'd',
      `M0,0 300,0 300,400 0,400
      M 120, 130 m -75, 0 a 75,75 0 1,0 190,0 a 75,75 0 1,0 -190,0`)
    .attr('fill', 'white')

  const arc = d3.arc()
    .innerRadius(radius - thickness)
    .outerRadius(radius)
    .startAngle( function(d) {
      return -d.startAngle
    })
    .endAngle( function(d) {
      return -d.endAngle
    })

  const pie = d3.pie()
    .value(function(d) {
      return d.value
    })
    .sort(function(d) {
      return d.name
    })

  g.selectAll('svg')
    .data(pie(currentData))
    .enter()
    .append("g")
    .append('path')
    .attr('d', arc)
    .attr('fill', (d,i) => colors[i])
    .each(function(d, i) { this._current = i; })
    .attr('transform', 'translate(' + (width-160) + ',' + (height-130) + ')')

  g.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '-1em')
    .attr('class', 'label')
    .text(type.toUpperCase())
    .attr('transform', 'translate(' + (width-160) + ',' + (height-130) + ')')
  
  g.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.5em')
    .attr('class', 'value')
    .text(total)
    .attr('transform', 'translate(' + (width-160) + ',' + (height-130) + ')')
    
  g.append('line')
    .attr('x1', '0')
    .attr('y1', '-95')
    .attr('x2', '0')
    .attr('y2', '-100')
    .style('stroke', 'rgba(0,0,0,0.3)')
    .style('stroke-width', '2')
    .attr('transform', 'translate(' + (width-160) + ',' + (height-130) + ')')
  
  g.append('line')
    .attr('x1', '0')
    .attr('y1', '95')
    .attr('x2', '0')
    .attr('y2', '100')
    .style('stroke', 'rgba(0,0,0,0.3)')
    .style('stroke-width', '2')
    .attr('transform', 'translate(' + (width-160) + ',' + (height-130) + ')')
  
  g.append('line')
    .attr('x1', '95')
    .attr('y1', '0')
    .attr('x2', '100')
    .attr('y2', '0')
    .style('stroke', 'rgba(0,0,0,0.3)')
    .style('stroke-width', '2')
    .attr('transform', 'translate(' + (width-160) + ',' + (height-130) + ')')
  
  g.append('line')
    .attr('x1', '-95')
    .attr('y1', '0')
    .attr('x2', '-100')
    .attr('y2', '0')
    .style('stroke', 'rgba(0,0,0,0.3)')
    .style('stroke-width', '2')
    .attr('transform', 'translate(' + (width-160) + ',' + (height-130) + ')')
}

renderStats = (data, colors, index) => {
  const currentData = data.current
  const total = currentData[0].value + currentData[1].value
  const tabletPercent = Math.floor((currentData[0].value / total) * 100)
  const smartphonePercent = 100 - tabletPercent
  document.getElementById(`tabletTitleChart${index+1}`).style.color = colors[0]
  document.getElementById(`smartphoneTitleChart${index+1}`).style.color = colors[1]
  document.getElementById(`tabletValuesChart${index+1}`).innerHTML = `<b>${tabletPercent}%</b> ${addCommas(currentData[0].value)}`
  document.getElementById(`smartphoneValuesChart${index+1}`).innerHTML = `<b>${smartphonePercent}%</b> ${addCommas(currentData[1].value)}`
}

start = (allData) => {
  graphs.forEach((graph, index) => {
    const { type, colors } = graph
    const data = allData[type]
    const chartDiv = `chart${index+1}`
    renderGraph(data, colors, chartDiv, type, index)
    renderStats(data, colors, index)
  })
}

addCommas = (total, type) => {
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

loadJSON = callback => {
  const req = new XMLHttpRequest()

  req.overrideMimeType("application/json")
  req.open('GET', 'data/data.json', true)
  req.onreadystatechange = function () {
    if (req.readyState == 4) {
      callback(req.responseText)
    }
  }
  req.send(null)
}