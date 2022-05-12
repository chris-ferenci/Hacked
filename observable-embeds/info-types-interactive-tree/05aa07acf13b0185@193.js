import define1 from "./5432439324f2c616@262.js";
import define2 from "./a1fd3857bac219b0@480.js";
import define3 from "./a33468b95d0b15b0@808.js";

function _1(md){return(
md`# Types of Stolen Data
### in Collapsible Tree Visualization
<br>`
)}

function _2(md){return(
md`Data Source: Have I Been Pwned Dataset, with Custom Categorization
URL: https://haveibeenpwned.com/API/v3`
)}

function _3(md){return(
md`*Click node to expand*`
)}

function _chart_ani(d3,data,dy,margin,width,dx,tree,diagonal)
{
  // reference: https://observablehq.com/@d3/collapsible-tree

  const root = d3.hierarchy(data);

  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth !== 7) d.children = null; // edited code: sets beginning to collapsed
    // original code:
    // if (d.depth && d.data.name.length !== 7) d.children = null;
  });

  const darkPurpleColor = "#301888"
  const mediumPurpleColor = "#785be2"
  const lightPurpleColor = "#a18deb"

  const svg = d3.create("svg")
      .attr("viewBox", [-margin.left, -margin.top, width, dx])
      .style("user-select", "none")
      .style("background-color", "rgb(241, 237, 253)");

  const gLink = svg.append("g")
    // change link color
      .attr("fill", "none")
      .attr("stroke", lightPurpleColor)
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

  const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

  function update(source) {
    const duration = d3.event && d3.event.altKey ? 5000 : 500;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + margin.top + margin.bottom;

    const transition = svg.transition()
        // add easing animation to transition
        .ease(d3.easeQuadOut)
        .duration(duration)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes
    const node = gNode.selectAll("g")
      .attr("color", darkPurpleColor)
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
          d.children = d.children ? null : d._children;
          update(d);
        });

    nodeEnter.append("circle")
        .attr("r", "5")
        // if leaf node, change color
        .attr("fill", d => d._children ? darkPurpleColor : mediumPurpleColor)
        .attr("stroke", d => d._children ? darkPurpleColor : mediumPurpleColor)
        .attr("stroke-width", 5);

    nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -14 : 14)
        .attr("text-anchor", d => d._children ? "end" : "start")
        // if leaf node, show number of stolen records
        .text(d => d._children ? d.data.name : d.data.name + " (" + d3.format(",.2r")(d.data.n_records) + " records stolen)")
        .attr("font-size", "14px")
      .clone(true).lower()
        // set font color
        .attr("fill", darkPurpleColor)

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  update(root);

  return svg.node();
}


function _5(md){return(
md`### 1. Load Data & Library`
)}

function _data(FileAttachment){return(
FileAttachment("stolen_data_types@4.json").json()
)}

function _d3(require){return(
require("d3@6")
)}

function _9(md){return(
md`### 2. Set up SVG Canvas`
)}

function _margin(){return(
{top: 50, right: 120, bottom: 50, left: 100}
)}

function _dx(){return(
20
)}

function _dy(width){return(
width / 6
)}

function _tree(d3,dx,dy){return(
d3.tree().nodeSize([dx, dy])
)}

function _diagonal(d3){return(
d3.linkHorizontal().x(d => d.y).y(d => d.x)
)}

function _15(md){return(
md`# Alternative Plots`
)}

function _16(md){return(
md`### Static Tree`
)}

function _chart_static_chart(Tree,data){return(
Tree(data, {
  label: d => d.name,
  title: (d, n) => `${n.ancestors().reverse().map(d => d.data.name).join(".")}`, // hover text
  width: 1152
})
)}

function _18(md){return(
md`### Treemap`
)}

function _chart_treemap(Treemap,data){return(
Treemap(data, {
  value: d => d?.n_records, // size of each node (file); null for internal nodes (folders)
  group: d => d.name[1], // e.g., "animate" in "flare.animate.Easing"; for color
  label: (d, n) => [...d.name.split(".").pop().split(/(?=[A-Z][a-z])/g), n.value.toLocaleString("en")].join("\n"),
  title: (d, n) => `${d.name}\n${n.value.toLocaleString("en")}`, // text to show on hover
  link: (d, n) => `https://github.com/prefuse/Flare/blob/master/flare/src${n.id}.as`,
  width: 1152,
  height: 1152
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["stolen_data_types@4.json", {url: new URL("./files/2074bb6871cdcd82d38ba292c1cfa7b076942c79f71d915ef6df513380e95cae21d230f0af62bdf080898e25c0eee1fc9ff51cbf224fe9f0e9608491da250858", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("chart_ani")).define("chart_ani", ["d3","data","dy","margin","width","dx","tree","diagonal"], _chart_ani);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("Tree", child1);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("dx")).define("dx", _dx);
  main.variable(observer("dy")).define("dy", ["width"], _dy);
  main.variable(observer("tree")).define("tree", ["d3","dx","dy"], _tree);
  main.variable(observer("diagonal")).define("diagonal", ["d3"], _diagonal);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("chart_static_chart")).define("chart_static_chart", ["Tree","data"], _chart_static_chart);
  main.variable(observer()).define(["md"], _18);
  const child2 = runtime.module(define2);
  main.import("Treemap", child2);
  const child3 = runtime.module(define3);
  main.import("Swatches", child3);
  main.variable(observer("chart_treemap")).define("chart_treemap", ["Treemap","data"], _chart_treemap);
  return main;
}
