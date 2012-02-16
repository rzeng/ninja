/* <copyright>
This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
(c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
</copyright> */

// Slider, HotText and HotTextUnit will extend this class.
var Montage = require("montage/core/core").Montage;
var Component = require("montage/ui/component").Component;

var SliderBase = exports.SliderBase = Montage.create(Component, {

    _hasFocus: {
        enumerable: false,
        value: false
    },

    _touchIdentifier: {
        enumerable: false,
        value: null
    },

    _xStart: {
        enumerable: false,
        value: 0
    },

    _yStart: {
        enumerable: false,
        value: 0
    },

    _previousValue: {
        enumerable: false,
        value: null
    },

    _isMouseDown: {
        enumerable: true,
        value: false
    },

    // We need to calculate some metrics on the first draw after prepareForDraw because
    // styles values are not available during prepareForDraw
    _firstTime: {
        enumerable: false,
        value: true
    },

    _enabled: {
        enumerable: true,
        value: true
    },

    enabled: {
        enumerable: true,
        get: function() {
            return this._enabled;
        },
        set: function(value) {

            if (value !== this._enabled) {
                this._enabled = value;
                if(this._enabled)
                {
                    this.element.classList.remove("disabled");
                    
                    this.element.addEventListener("blur", this);
                    this.element.addEventListener("focus", this);

                    this.element.addEventListener("touchstart", this, false);
                    this.element.addEventListener("mousedown", this, false);
                }
                else
                {
                    this.element.classList.add("disabled");

                    this.element.removeEventListener("blur", this);
                    this.element.removeEventListener("focus", this);

                    this.element.removeEventListener("touchstart", this, false);
                    this.element.removeEventListener("mousedown", this, false);
                }
                this.needsDraw = true;
            }
        }
    },

    // Internal flags to determine what the change/changing events will contain
    _eventType: {
        enumerable: false,
        value: "change"
    },

    _wasSetByCode: {
        enumerable: false,
        value: true
    },

    _setEventFlags: {
        value: function (eventType, wasSetByCode) {
            this._eventType = eventType;
            this._wasSetByCode = wasSetByCode;
        }
    },

    _value: {
        enumerable: false,
        value: 0
    },

    value: {
        enumerable: true,
        get: function() {
            return this._value;
        },
        set: function(value) {
            if (isNaN(value)) {
                return;
            }

            if (value < this._minValue) {
                value = this._minValue;
            }
            else if (value > this._maxValue) {
                value = this._maxValue;
            }

            if (value !== this._value) {
                this._value = value;
                this.needsDraw = true;
                this._dispatchActionEvent();
            }
        }
    },

    _minValue: {
        enumerable: false,
        value: 0
    },

    minValue: {
        get: function() {
            return this._minValue;
        },
        set: function(value) {
            if (value !== this._minValue) {
                this._minValue = value;
                this._firstTime = true;     // Force layout recalculation.
                if (this._value < value)
                {
                    this.value = value;
                }
                this.needsDraw = true;
            }
        }
    },

    _maxValue: {
        enumerable: false,
        value: 100
    },

    maxValue: {
        get: function() {
            return this._maxValue;
        },
        set: function(value) {
            if (value !== this._maxValue) {
                this._maxValue = value;
                this._firstTime = true;     // Force layout recalculation.
                if (this._value > value)
                {
                    this.value = value;
                }
                this.needsDraw = true;
            }
        }
    },

    _valueCoef: {
        value: 1
    },

    _valueFromPageOffset: {
        value: function(offset, pageY, isShiftKeyPressed) {
            // Implement in subclass.
        }
    },

    handleMousedown: {
        value: function (event) {
//            event.preventDefault();   // Commenting out -- other elements need to blur when we are moused down
            var clickPoint = webkitConvertPointFromPageToNode(this.element, new WebKitPoint(event.pageX, event.pageY));
            this._xStart = clickPoint.x;
            this._yStart = clickPoint.y;
            this._previousValue = this.value;
            this._isMouseDown = true;
            document.addEventListener("mousemove", this, false);
            document.addEventListener("mouseup", this, false);
         }
    },

    handleTouchstart: {
        value: function (event) {
            event.preventDefault(); // Not sure how to let other elements blur if we need to override mobile behavior
            var touch = event.targetTouches[0];
            this._touchIdentifier = touch.identifier;
            var clickPoint = webkitConvertPointFromPageToNode(this.element, new WebKitPoint(touch.pageX,touch.pageY));
            this._xStart = clickPoint.x;
            this._yStart = clickPoint.y;
            this._previousValue = this.value;
            this._isMouseDown = true;
            document.addEventListener("touchmove", this, false);
            document.addEventListener("touchend", this, false);
         }
    },

    handleMousemove: {
        value: function (event) {
            event.target.style.cursor = "pointer";
            this._setEventFlags("changing", false);
            this._valueFromPageOffset(event.pageX, event.pageY, event.shiftKey);
        }
    },

    handleTouchmove: {
        value: function (event) {
            for(var i=0, iTouch; iTouch = event.changedTouches[i]; i++) {
                if (iTouch.identifier === this._touchIdentifier) {
                    this._setEventFlags("changing", false);
                    this._valueFromPageOffset(iTouch.pageX, iTouch.pageY, false);
                    break;
                }
            }
        }
    },

    handleMouseup: {
        value: function (event) {
            document.removeEventListener("mousemove", this);
            document.removeEventListener("mouseup", this);
            this._isMouseDown = false;
            event.target.style.cursor = "default";
            this._setEventFlags("change", false);
            this._valueFromPageOffset(event.pageX, event.pageY, event.shiftKey);
            this._previousValue = null;
        }
    },

    handleTouchend: {
        enumerable: false,
        value: function (event) {
            for(var i=0, iTouch; iTouch = event.changedTouches[i]; i++) {
                if (iTouch.identifier === this._touchIdentifier) {
                    this._touchIdentifier = null;
                    this._isMouseDown = false;
                    document.removeEventListener("touchmove", this);
                    document.removeEventListener("touchend", this);
                    this._setEventFlags("change", false);
                    this._valueFromPageOffset(iTouch.pageX, iTouch.pageY, false);
                    this._previousValue = null;
                    break;
                }
            }
        }
    },

    _dispatchActionEvent: {
        value: function() {
//            console.log("dispatching event", this._element.id, this._eventType, this._wasSetByCode);
            var actionEvent = document.createEvent("CustomEvent");
            actionEvent.initEvent(this._eventType, true, true);
            actionEvent.type = this._eventType;
            actionEvent.wasSetByCode = this._wasSetByCode;
            // reset event flags
            this._setEventFlags("change", true);
            this.dispatchEvent(actionEvent);
        }
    }

});
