//---------------------Setting URL-----------------------------
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

//-------------------Promise Pending---------------------------
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

//--------------Fetch and console log JSON---------------------
d3.json(url).then(function(data) {
  console.log("data:", data)
})

let selector = d3.select('#selDataset');

//-----------------Demographics/Metadata------------------------
function demoBox(id) {
    d3.json(url).then(function (data) {
        let metadata = data.metadata;
        let identifier = metadata.filter(sample =>
            sample.id.toString() === id)[0];
        let panel = d3.select('#sample-metadata');
        panel.html('');
        Object.entries(identifier).forEach(([key, value]) => {
            panel.append('h6').text(`${key}: ${value}`);
        })
    })
};

//------------Selector and Initialize Function------------------
function init() {
    let id = selector.property('value');
    d3.json(url).then(function (data) {
        let names = data.names;
        let samples = data.samples;
        Object.values(names).forEach(value => {
            selector.append('option').text(value);
        })
        demoBox(names[0]);
        plotting(names[0])
    })
};

//------------------------Plots time----------------------------
function plotting(id) {
    d3.json(url).then(function (data) {
        let samples = data.samples;
        let identifier = samples.filter(sample => sample.id === id);
        let filtered = identifier[0];
        let OTUvalues = filtered.sample_values.slice(0, 10).reverse();
        let OTUids = filtered.otu_ids.slice(0, 10).reverse();
        let labels = filtered.otu_labels.slice(0, 10).reverse();
        let barPlot = {
            x: OTUvalues,
            y: OTUids.map(object => 'OTU ' + object),
            name: labels,
            type: 'bar',
            orientation: 'h'
        };
        let barLayout = {
            title: `Top OTUs for Subject ID #${id}`,
            xaxis: { title: 'OTU Count' },
            yaxis: { title: 'OTU ID' }
        };
        let barData = [barPlot];
        Plotly.newPlot('bar', barData, barLayout);
        //--------------Bubble Plot---------------
        let bubblePlot = {
            x: filtered.otu_ids,
            y: filtered.sample_values,
            mode: 'markers',
            marker: {
                size: filtered.sample_values,
                color: filtered.otu_ids,
                colorscale: 'Rainbow'
            },
            text: filtered.otu_labels,
        };
        let bubbleData = [bubblePlot];
        let bubbleLayout = {
            title: `OTU Counts for Subject ID #${id}`,
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'OTU Count' }
        };
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    })
};

//----------------------Update on change in selection--------------------
function optionChanged(id) {
    plotting(id);
    demoBox(id);
};

init();