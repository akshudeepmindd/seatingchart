import React from 'react';

  import * as go from 'gojs';
  import { ReactDiagram } from 'gojs-react';

  import './App.css';  // contains .diagram-component CSS

  function initDiagram() {
    const $ = go.GraphObject.make;
    const diagram =
      $(go.Diagram,
        {
          'undoManager.isEnabled': true,  // must be set to allow for model change listening
          // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
          'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
          model: $(go.GraphLinksModel,
            {
              linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
            })
        });
        const myDiagram; 
        myDiagram = $(go.Diagram, "myDiagramDiv",
          {
            allowDragOut: true,  // to myGuests
            allowClipboard: false,
            draggingTool: $(SpecialDraggingTool),
            rotatingTool: $(HorizontalTextRotatingTool),
            // For this sample, automatically show the state of the diagram's model on the page
            "ModelChanged": function(e) {
              if (e.isTransactionFinished) {
                document.getElementById("savedModel").textContent = myDiagram.model.toJson();
              }
            },
            "undoManager.isEnabled": true
          });
          myDiagram.nodeTemplateMap.add("",  // default template, for people
          $(go.Node, "Auto",
            { background: "transparent" },  // in front of all Tables
            // when selected is in foreground layer
            new go.Binding("layerName", "isSelected", function(s) { return s ? "Foreground" : ""; }).ofObject(),
            { locationSpot: go.Spot.Center },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            new go.Binding("text", "key"),
            { // what to do when a drag-over or a drag-drop occurs on a Node representing a table
              mouseDragEnter: function(e, node, prev) {
                var dragCopy = node.diagram.toolManager.draggingTool.copiedParts;  // could be copied from palette
                highlightSeats(node, dragCopy ? dragCopy : node.diagram.selection, true);
              },
              mouseDragLeave: function(e, node, next) {
                var dragCopy = node.diagram.toolManager.draggingTool.copiedParts;
                highlightSeats(node, dragCopy ? dragCopy : node.diagram.selection, false);
              },
              mouseDrop: function(e, node) {
                assignPeopleToSeats(node, node.diagram.selection, e.documentPoint);
              }
            },
            $(go.Shape, "Rectangle", { fill: "blanchedalmond", stroke: null }),
            $(go.Panel, "Viewbox",
              { desiredSize: new go.Size(50, 38) },
              $(go.TextBlock, { margin: 2, desiredSize: new go.Size(55, NaN), font: "8pt Verdana, sans-serif", textAlign: "center", stroke: "darkblue" },
                new go.Binding("text", "", function(data) {
                  var s = data.key;
                  if (data.plus) s += " +" + data.plus.toString();
                  return s;
                }))
            )
          ));
  }

  /**
   * This function handles any changes to the GoJS model.
   * It is here that you would make any updates to your React state, which is dicussed below.
   */
  function handleModelChange(changes) {
    alert('GoJS model changed!');
  }

  // render function...
export default function App() {
    return (
      <div>
        <ReactDiagram
          initDiagram={initDiagram}
          divClassName='diagram-component'
          nodeDataArray={[
            { key: 0, text: 'Alpha', color: 'lightblue', loc: '0 0' },
            { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
            { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
            { key: 3, text: 'Delta', color: 'pink', loc: '150 150' }
          ]}
          linkDataArray={[
            { key: -1, from: 0, to: 1 },
            { key: -2, from: 0, to: 2 },
            { key: -3, from: 1, to: 1 },
            { key: -4, from: 2, to: 3 },
            { key: -5, from: 3, to: 0 }
          ]}
          onModelChange={handleModelChange}
        />
      </div>
    );
  }