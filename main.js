document.addEventListener('DOMContentLoaded', () => {
  console.log( "ready!" )
  loadJSON(res => {
    const allData = JSON.parse(res)
  })
})

loadJSON = callback => {
  const req = new XMLHttpRequest()

  req.overrideMimeType("application/json")
  req.open('GET', './data/data.json', true)
  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === "200") {
      callback(req.responseText)
    }
  }
  req.send(null)
}