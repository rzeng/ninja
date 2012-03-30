/* <copyright>
This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
(c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
</copyright> */

var Montage = 			require("montage/core/core").Montage,
    CanvasController = require("js/controllers/elements/canvas-controller").CanvasController,
    njModule = require("js/lib/NJUtils"),
    World = require("js/lib/drawing/world").World,
    MaterialsModel = require("js/models/materials-model").MaterialsModel;

exports.ShapesController = Montage.create(CanvasController, {

    setProperty: {
        value: function(el, p, value) {
            var val = parseInt(value);
            switch(p) {
                case "strokeSize":
                    // TODO - For now, just handling px units.
                    this.setShapeProperty(el, "strokeSize", value);
                    el.elementModel.shapeModel.GLGeomObj.setStrokeWidth(val);
                    el.elementModel.shapeModel.GLGeomObj.buildBuffers();
                    el.elementModel.shapeModel.GLWorld.render();
                    break;
                case "innerRadius":
                    this.setShapeProperty(el, "innerRadius", value);
                    el.elementModel.shapeModel.GLGeomObj.setInnerRadius(val/100);
                    el.elementModel.shapeModel.GLGeomObj.buildBuffers();
                    el.elementModel.shapeModel.GLWorld.render();
                    break;
                case "tlRadius":
                    this.setShapeProperty(el, "tlRadius", value);
                    el.elementModel.shapeModel.GLGeomObj.setTLRadius(val);
                    el.elementModel.shapeModel.GLGeomObj.buildBuffers();
                    el.elementModel.shapeModel.GLWorld.render();
                    break;
                case "trRadius":
                    this.setShapeProperty(el, "trRadius", value);
                    el.elementModel.shapeModel.GLGeomObj.setTRRadius(val);
                    el.elementModel.shapeModel.GLGeomObj.buildBuffers();
                    el.elementModel.shapeModel.GLWorld.render();
                    break;
                case "blRadius":
                    this.setShapeProperty(el, "blRadius", value);
                    el.elementModel.shapeModel.GLGeomObj.setBLRadius(val);
                    el.elementModel.shapeModel.GLGeomObj.buildBuffers();
                    el.elementModel.shapeModel.GLWorld.render();
                    break;
                case "brRadius":
                    this.setShapeProperty(el, "brRadius", value);
                    el.elementModel.shapeModel.GLGeomObj.setBRRadius(val);
                    el.elementModel.shapeModel.GLGeomObj.buildBuffers();
                    el.elementModel.shapeModel.GLWorld.render();
                    break;
                case "width":
                    el.elementModel.shapeModel.GLGeomObj.setWidth(val);
                    CanvasController.setProperty(el, p, value);
                    el.elementModel.shapeModel.GLWorld.setViewportFromCanvas(el);
                    el.elementModel.shapeModel.GLGeomObj.buildBuffers();
                    el.elementModel.shapeModel.GLWorld.render();
                    break;
                case "height":
                    el.elementModel.shapeModel.GLGeomObj.setHeight(val);
                    CanvasController.setProperty(el, p, value);
                    el.elementModel.shapeModel.GLWorld.setViewportFromCanvas(el);
                    el.elementModel.shapeModel.GLGeomObj.buildBuffers();
                    el.elementModel.shapeModel.GLWorld.render();
                    break;
                case "useWebGl":
                    var canvas = njModule.NJUtils.makeNJElement("canvas", "Canvas", "shape", el.className, true);
                    canvas.setAttribute("data-RDGE-id", njModule.NJUtils.generateRandom());
                    canvas.width = el.width;
                    canvas.height = el.height;
                    this.application.ninja.elementMediator.replaceElement(el, canvas);
                    NJevent("elementDeleted", el);
                    el = canvas;
                    this.toggleWebGlMode(el, value);
                    el.elementModel.shapeModel.GLWorld.render();
                    this.application.ninja.selectionController.selectElement(el);
                    return;
                case "strokeMaterial":
                    var sm = Object.create(MaterialsModel.getMaterial(value));
                    if(sm)
                    {
                        el.elementModel.shapeModel.GLGeomObj.setStrokeMaterial(sm);
                        el.elementModel.shapeModel.GLGeomObj.buildBuffers();
                        el.elementModel.shapeModel.GLWorld.render();
                    }
                    break;
                case "fillMaterial":
                    var fm = Object.create(MaterialsModel.getMaterial(value));
                    if(fm)
                    {
                        el.elementModel.shapeModel.GLGeomObj.setFillMaterial(fm);
                        el.elementModel.shapeModel.GLGeomObj.buildBuffers();
                        el.elementModel.shapeModel.GLWorld.render();
                    }
                    break;
                case "editStrokeMaterial":
                    NJevent("showMaterialPopup",{materialId : this.getProperty(el, "strokeMaterial")});
                    break;
                case "editFillMaterial":
                    NJevent("showMaterialPopup",{materialId : this.getProperty(el, "fillMaterial")});
                    break;
                case "animate":
                    if(value)
                    {
                        el.elementModel.shapeModel.animate = true;
                        el.elementModel.shapeModel.GLWorld._previewAnimation = true;
                        el.elementModel.shapeModel.GLWorld.restartRenderLoop();
                    }
                    else
                    {
                        el.elementModel.shapeModel.animate = false;
                        el.elementModel.shapeModel.GLWorld._previewAnimation = false;
                        el.elementModel.shapeModel.GLWorld._canvas.task.stop();
                    }
                    break;
                case "strokeHardness":
                    this.setShapeProperty(el, "strokeHardness", value);
                    el.elementModel.shapeModel.GLGeomObj.setStrokeHardness(val);
                    el.elementModel.shapeModel.GLWorld.render();
                    break;
                case "strokeSmoothing":
                    this.setShapeProperty(el, "strokeSmoothing", value);
                    el.elementModel.shapeModel.GLGeomObj.setSmoothingAmount(val);
                    el.elementModel.shapeModel.GLWorld.render();
                    break;
                case "doSmoothing":
                    this.setShapeProperty(el, "doSmoothing", value);
                    el.elementModel.shapeModel.GLGeomObj.setDoSmoothing(value);
                    el.elementModel.shapeModel.GLWorld.render();
                    break;
                case "isCalligraphic":
                    this.setShapeProperty(el, "isCalligraphic", value);
                    el.elementModel.shapeModel.GLGeomObj.setStrokeUseCalligraphic(value);
                    el.elementModel.shapeModel.GLWorld.render();
                    break;
                case "strokeAngle":
                    this.setShapeProperty(el, "strokeAngle", value);
                    el.elementModel.shapeModel.GLGeomObj.setStrokeAngle(Math.PI * val/180);
                    el.elementModel.shapeModel.GLWorld.render();
                    break;
                default:
                    CanvasController.setProperty(el, p, value);
            }
        }
    },

    getProperty: {
        value: function(el, p) {
            switch(p) {
                case "strokeSize":
                case "innerRadius":
                case "tlRadius":
                case "trRadius":
                case "blRadius":
                case "brRadius":
                case "useWebGl":
                case "animate":
                    return this.getShapeProperty(el, p);
                case "border":
                    return this.getColor(el, false);
                case "background":
                    return this.getColor(el, true);
                case "strokeHardness":
                    if (el.elementModel && el.elementModel.shapeModel){
                        return el.elementModel.shapeModel.GLGeomObj.getStrokeHardness();
                    } else {
                        return null;
                    }
                    break;
                case "doSmoothing":
                    if (el.elementModel && el.elementModel.shapeModel){
                        return el.elementModel.shapeModel.GLGeomObj.getDoSmoothing();
                    } else {
                        return null;
                    }
                    break;
                case "strokeSmoothing":
                    if (el.elementModel && el.elementModel.shapeModel){
                        return el.elementModel.shapeModel.GLGeomObj.getSmoothingAmount();
                    } else {
                        return null;
                    }
                    break;
                case "isCalligraphic":
                    if (el.elementModel && el.elementModel.shapeModel){
                        return el.elementModel.shapeModel.GLGeomObj.getStrokeUseCalligraphic();
                    } else {
                        return null;
                    }
                    break;
                case "strokeAngle":
                    if (el.elementModel && el.elementModel.shapeModel){
                        return 180*el.elementModel.shapeModel.GLGeomObj.getStrokeAngle()/Math.PI;
                    } else {
                        return null;
                    }
                    break;
                

                case "strokeMaterial":
                    var sm = el.elementModel.shapeModel.GLGeomObj.getStrokeMaterial();
                    if(sm)
                    {
                        return sm.getName();
                    }
                    else
                    {
                        return "FlatMaterial";
                    }
                case "fillMaterial":
                    var fm = el.elementModel.shapeModel.GLGeomObj.getFillMaterial();
                    if(fm)
                    {
                        return fm.getName();
                    }
                    else
                    {
                        return "FlatMaterial";
                    }
                default:
                    return CanvasController.getProperty(el, p);
            }
        }
    },

    getShapeProperty: {
        value: function(el, prop) {
            if(el.elementModel && el.elementModel.shapeModel)
            {
                return el.elementModel.shapeModel[prop];
            }
            else
            {
                console.log("No shapeModel, one should have been created already");
                return null;
            }
        }
    },

    setShapeProperty: {
        value: function(el, prop, value) {
            if(el.elementModel && el.elementModel.shapeModel)
            {
                el.elementModel.shapeModel[prop] = value;
            }
            else
            {
                console.log("No shapeModel, one should have been created already");
            }
        }
    },

    GetValueInPixels: {
        value: function(value, units, h)
        {
            switch(units)
            {
                case "px":
                {
                    return value;
                }
                case "pt":
                {
                    return ~~(value*4/3);
                }
                case "%":
                {
                    if(h)
                    {
                        return ~~(value/100*h);
                    }
                    else
                    {
                        console.warn("Can't use % for a line's stroke size, using 10 for the value.");
                        return 10;
                    }
                }
            }
        }
    },

    CapWorldPercentFromValue: {
        value: function(value, units, h)
        {
            return Math.min(this.GetWorldPercentFromValue(value, units, h), 2);
        }
    },

    GetWorldPercentFromValue: {
        value: function(value, units, h)
        {
            switch(units)
            {
                case "pt":
                {
                    value = Math.round(value*4/3);
                    return 4*value/h;
                }
                case "px":
                {
                    return 4*value/h;
                }
                case "%":
                {
                    // Our calculations in GLWorld use 2 = 100%, so our calculations would usually be value/50,
                    // but in order to get values other than 0, 1, and 2, we need to multiply by 10, round that value,
                    // and then divide by 50*10 again.
                    // 100*10 = 1000/500 = 2
                    // 20*10 = 200/500 = 0.4
                    // 50*10 = 500/500 = 1
                    return Math.round(value*10)/500;
                }
                default:
                {
                    console.warn("Unhandled units " + units);
                }
            }
        }
    },

    //--------------------------------------------------------------------------------------------------------
    // Routines to get/set color properties
    getColor: {
        value: function(el, isFill) {
            if(isFill)
            {
                if(el.elementModel.shapeModel.GLGeomObj.getFillColor)
                {
                    return this.application.ninja.colorController.colorModel.webGlToColor(el.elementModel.shapeModel.GLGeomObj.getFillColor());
                }
            else
            {
                    return null;
                }
            }
            else
            {
                return this.application.ninja.colorController.colorModel.webGlToColor(el.elementModel.shapeModel.GLGeomObj.getStrokeColor());
            }
        }
    },

    _setGradientMaterial: {
        value: function(el, gradientMode, isFill) {
            var m,
                gradientM;
            if(isFill)
            {
                m = el.elementModel.shapeModel.GLGeomObj.getFillMaterial();
            }
            else
            {
                m = el.elementModel.shapeModel.GLGeomObj.getStrokeMaterial();
            }

            if(gradientMode === "radial")
            {
                if( !m || (m.getName() !== "RadialGradientMaterial") )
                {
                    gradientM = Object.create(MaterialsModel.getMaterial("RadialGradientMaterial"));
            }
            }
            else
            {
                if( !m || (m.getName() !== "LinearGradientMaterial") )
                {
                    gradientM = Object.create(MaterialsModel.getMaterial("LinearGradientMaterial"));
                }
            }

            if(gradientM)
            {
            if(isFill)
            {
                    el.elementModel.shapeModel.GLGeomObj.setFillMaterial(gradientM);
                }
                else
                {
                    el.elementModel.shapeModel.GLGeomObj.setStrokeMaterial(gradientM);
                }
                        el.elementModel.shapeModel.GLGeomObj.buildBuffers();
                    }
                }
    },

    _setFlatMaterial: {
        value: function(el, isFill) {
            var m,
                flatM;
            if(isFill)
            {
                m = el.elementModel.shapeModel.GLGeomObj.getFillMaterial();
            }
            else
            {
                m = el.elementModel.shapeModel.GLGeomObj.getStrokeMaterial();
            }

            if(!m || ((m.getName() === "LinearGradientMaterial") || m.getName() === "RadialGradientMaterial") )
                {
                flatM = Object.create(MaterialsModel.getMaterial("FlatMaterial"));
                if(flatM)
                    {
                    if(isFill)
                    {
                        el.elementModel.shapeModel.GLGeomObj.setFillMaterial(flatM);
                    }
                    else
                    {
                        el.elementModel.shapeModel.GLGeomObj.setStrokeMaterial(flatM);
                    }
                        el.elementModel.shapeModel.GLGeomObj.buildBuffers();
                    }
                }
            }
    },

    setColor: {
        value: function(el, color, isFill) {
            var mode = color.mode,
                webGl,
                m;
            if(isFill)
            {
                if(mode)
                {
                    switch (mode) {
                        case 'nocolor':
                            el.elementModel.shapeModel.GLGeomObj.setFillColor(null);
                            return;
                        case 'gradient':
                            if(el.elementModel.shapeModel.useWebGl)
                            {
                                this._setGradientMaterial(el, color.color.gradientMode, isFill);
                            }
                            el.elementModel.shapeModel.GLGeomObj.setFillColor({gradientMode:color.color.gradientMode, color:color.color.stops});
                            el.elementModel.shapeModel.GLWorld.render();
                            break;
                        default:
                            if(el.elementModel.shapeModel.useWebGl)
                            {
                                this._setFlatMaterial(el, isFill);
                            }
                            webGl = this.application.ninja.colorController.colorModel.colorToWebGl(color.color);
                            el.elementModel.shapeModel.GLGeomObj.setFillColor(webGl);
                            el.elementModel.shapeModel.GLWorld.render();
                    }
                }
            }
            else
            {
                // Support for ink-bottle tool
                if(color.strokeInfo)
                {
                    var strokeWidth = this.GetValueInPixels(color.strokeInfo.strokeSize,
                                                            color.strokeInfo.strokeUnits);
                    el.elementModel.shapeModel.GLGeomObj.setStrokeWidth(strokeWidth);
                    this.setShapeProperty(el, "strokeSize", color.strokeInfo.strokeSize + " "
                                                                + color.strokeInfo.strokeUnits);
                }

                if(mode)
                {
                    switch (mode) {
                        case 'nocolor':
                            el.elementModel.shapeModel.GLGeomObj.setStrokeColor(null);
                            return;
                        case 'gradient':
                            if(el.elementModel.shapeModel.useWebGl)
                            {
                                this._setGradientMaterial(el, color.color.gradientMode, isFill);
                            }
                            el.elementModel.shapeModel.GLGeomObj.setStrokeColor({gradientMode:color.color.gradientMode, color:color.color.stops});
                            el.elementModel.shapeModel.GLWorld.render();
                            break;
                        default:
                            if(el.elementModel.shapeModel.useWebGl)
                            {
                                this._setFlatMaterial(el, isFill);
                            }
                            webGl = this.application.ninja.colorController.colorModel.colorToWebGl(color.color);
                            el.elementModel.shapeModel.GLGeomObj.setStrokeColor(webGl);
                            el.elementModel.shapeModel.GLWorld.render();
                    }
                }
            }
            el.elementModel.shapeModel.GLWorld.render();
        }
    },

    getStroke: {
        value: function(el) {
            // TODO - Need to figure out which border side user wants
            var size = this.getShapeProperty(el, "strokeSize");
            var color = this.getShapeProperty(el, "stroke");
            return {stroke:color, strokeSize:size};
        }
    },

    setStroke: {
        value: function(el, stroke) {
            el.elementModel.shapeModel.GLGeomObj.setStrokeColor(stroke.color.webGlColor);
            var strokeWidth = this.GetValueInPixels(stroke.strokeSize, stroke.strokeUnits);
            el.elementModel.shapeModel.GLGeomObj.setStrokeWidth(strokeWidth);
            this.setShapeProperty(el, "stroke", stroke.color.webGlColor);
            this.setShapeProperty(el, "strokeSize", stroke.strokeSize + " " + stroke.strokeUnits);
            el.elementModel.shapeModel.GLGeomObj.buildBuffers();
            el.elementModel.shapeModel.GLWorld.render();
        }
    },

    DisplayMaterials: {
        value: function (cb)
        {

            var optionItem = document.createElement("option");
            optionItem.value = 0;
            optionItem.innerText = "Default";
            cb.appendChild(optionItem);

            var materials = this.application.ninja.appModel.materials;
            var len = materials.length;

            var i;
            for (i = 0; i < len; i++)
            {
                var current = materials[i];
                optionItem = document.createElement("option");
                optionItem.value = i+1;
                optionItem.innerText = current.getName();
                cb.appendChild(optionItem);
            }
        }
    },

    isElementAShape: {
        value: function(el)
        {
            return (el.elementModel && el.elementModel.isShape);
        }
    },

    toggleWebGlMode: {
        value: function(el, useWebGl)
        {
            if(useWebGl)
            {
                this.convertToWebGlWorld(el);
            }
            else
            {
                this.convertTo2DWorld(el);
            }
        }
    },

    convertToWebGlWorld: {
        value: function(el)
        {
            if(el.elementModel.shapeModel.useWebGl)
            {
                return;
            }
            var world,
                worldData = el.elementModel.shapeModel.GLWorld.exportJSON();
            if(worldData)
            {
                worldData = this.flip3DSense (worldData );
                world = new World(el, true);
                el.elementModel.shapeModel.GLWorld = world;
                el.elementModel.shapeModel.useWebGl = true;
                world.importJSON(worldData);
                el.elementModel.shapeModel.GLGeomObj = world.getGeomRoot();
                }

        }
    },

    convertTo2DWorld: {
        value: function(el)
        {
            if(!el.elementModel.shapeModel.useWebGl)
            {
                return;
            }
            var world,
                worldData = el.elementModel.shapeModel.GLWorld.exportJSON();
            if(worldData)
            {
                worldData = this.flip3DSense (worldData );
                world = new World(el, false);
                el.elementModel.shapeModel.GLWorld = world;
                el.elementModel.shapeModel.useWebGl = false;
                world.importJSON(worldData);
                el.elementModel.shapeModel.GLGeomObj = world.getGeomRoot();
                }
            }
    },

    flip3DSense: {
        value: function( importStr )
        {
            var jObj;
            var index = importStr.indexOf( ';' );
            if ((importStr[0] === 'v') && (index < 24))
            {
                // JSON format.  separate the version info from the JSON info
                //var vStr = importStr.substr( 0, index+1 );
                var jStr = importStr.substr( index+1 );
                jObj = JSON.parse( jStr );
                jObj.webGL = !jObj.webGL;

                if(jObj.children)
                {
                    var nKids = jObj.children.length;
                    for (var i=0;  i<nKids;  i++)
                    {
                        var child = jObj.children[i];

                        if(jObj.webGL)
                        {
                            // Set Linear/Radial Gradient Material for children geometry if color in canvas 2d has gradient
                            if(child.strokeColor && child.strokeColor.gradientMode)
                            {
                                if(child.strokeColor.gradientMode === "radial")
                                {
                                    child.strokeMat = "RadialGradientMaterial";
            }
                                else
                                {
                                    child.strokeMat = "LinearGradientMaterial";
                                }
                            }

                            if(child.fillColor && child.fillColor.gradientMode)
                            {
                                if(child.fillColor.gradientMode === "radial")
                                {
                                    child.fillMat = "RadialGradientMaterial";
                                }
                                else
                                {
                                    child.fillMat = "LinearGradientMaterial";
                                }
                            }
                        }
//                        else
//                        {
//                            // Set flat color for children geometry if color in WebGL has been changed to solid
//                            if(child.strokeColor && !child.strokeColor.gradientMode)
//                            {
//                                if(child.strokeColor.gradientMode === "radial")
//                                {
//                                    child.strokeMat = "RadialGradientMaterial";
//                                }
//                                else
//                                {
//                                    child.strokeMat = "LinearGradientMaterial";
//                                }
//                            }
//
//                            if(child.fillColor && child.fillColor.gradientMode)
//                            {
//                                if(child.fillColor.gradientMode === "radial")
//                                {
//                                    child.fillMat = "RadialGradientMaterial";
//                                }
//                                else
//                                {
//                                    child.fillMat = "LinearGradientMaterial";
//                                }
//                            }
//                        }
                    }
                }
            }

            return jObj;
        }
    }

});
