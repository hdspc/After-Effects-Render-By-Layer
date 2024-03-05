(function() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("No active composition selected.");
        return;
    }

    // Confirm before proceeding due to the intensive process
    var proceed = confirm("This will add " + comp.numLayers + " items to the Render Queue. Continue?");
    if (!proceed) return;

    app.beginUndoGroup("Prepare Layer Renders");

    for (var i = 3; i <= comp.numLayers-1; i++) {
        var layer = comp.layer(i);
        
        // Duplicate the composition
        var dupComp = comp.duplicate();
        dupComp.name = comp.name + layer.name + i + " Render";
        
        // Set work area to layer's in and out points
        dupComp.workAreaStart = layer.inPoint;
        dupComp.workAreaDuration = layer.outPoint - layer.inPoint;

        // Add duplicated composition to the Render Queue
        var rqItem = app.project.renderQueue.items.add(dupComp);
        rqItem.applyTemplate("Best Settings");
        
        var outputModule = rqItem.outputModule(1);
        outputModule.applyTemplate("noice2");
        
        // Set output file name, ensuring valid file names by sanitizing layer name
        var sanitizedLayerName = layer.name.replace(/[^a-zA-Z0-9_-]/g, '_');
        var outputPath = new File("D:/Exports/rndrrndr" + sanitizedLayerName + "_" + i + ".mov");
        outputModule.file = outputPath;
    }

    alert("Render Queue is set up. Review settings and start render manually.");
    app.endUndoGroup();
})();
