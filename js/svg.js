var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/*!
* @svgdotjs/svg.js - A lightweight library for manipulating and animating SVG.
* @version 3.2.5
* https://svgjs.dev/
*
* @copyright Wout Fierens <wout@mick-wout.com>
* @license MIT
*
* BUILT: Mon Sep 15 2025 18:20:57 GMT+0200 (Central European Summer Time)
*/ ;
var SVG = (function () {
    'use strict';
    var methods$1 = {};
    var names = [];
    function registerMethods(name, m) {
        if (Array.isArray(name)) {
            for (var _i = 0, name_1 = name; _i < name_1.length; _i++) {
                var _name = name_1[_i];
                registerMethods(_name, m);
            }
            return;
        }
        if (typeof name === 'object') {
            for (var _name in name) {
                registerMethods(_name, name[_name]);
            }
            return;
        }
        addMethodNames(Object.getOwnPropertyNames(m));
        methods$1[name] = Object.assign(methods$1[name] || {}, m);
    }
    function getMethodsFor(name) {
        return methods$1[name] || {};
    }
    function getMethodNames() {
        return __spreadArray([], new Set(names), true);
    }
    function addMethodNames(_names) {
        names.push.apply(names, _names);
    }
    // Map function
    function map(array, block) {
        var i;
        var il = array.length;
        var result = [];
        for (i = 0; i < il; i++) {
            result.push(block(array[i]));
        }
        return result;
    }
    // Filter function
    function filter(array, block) {
        var i;
        var il = array.length;
        var result = [];
        for (i = 0; i < il; i++) {
            if (block(array[i])) {
                result.push(array[i]);
            }
        }
        return result;
    }
    // Degrees to radians
    function radians(d) {
        return d % 360 * Math.PI / 180;
    }
    // Radians to degrees
    function degrees(r) {
        return r * 180 / Math.PI % 360;
    }
    // Convert camel cased string to dash separated
    function unCamelCase(s) {
        return s.replace(/([A-Z])/g, function (m, g) {
            return '-' + g.toLowerCase();
        });
    }
    // Capitalize first letter of a string
    function capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
    // Calculate proportional width and height values when necessary
    function proportionalSize(element, width, height, box) {
        if (width == null || height == null) {
            box = box || element.bbox();
            if (width == null) {
                width = box.width / box.height * height;
            }
            else if (height == null) {
                height = box.height / box.width * width;
            }
        }
        return {
            width: width,
            height: height
        };
    }
    /**
     * This function adds support for string origins.
     * It searches for an origin in o.origin o.ox and o.originX.
     * This way, origin: {x: 'center', y: 50} can be passed as well as ox: 'center', oy: 50
     **/
    function getOrigin(o, element) {
        var _e;
        var origin = o.origin;
        // First check if origin is in ox or originX
        var ox = o.ox != null ? o.ox : o.originX != null ? o.originX : 'center';
        var oy = o.oy != null ? o.oy : o.originY != null ? o.originY : 'center';
        // Then check if origin was used and overwrite in that case
        if (origin != null) {
            _e = Array.isArray(origin) ? origin : typeof origin === 'object' ? [origin.x, origin.y] : [origin, origin], ox = _e[0], oy = _e[1];
        }
        // Make sure to only call bbox when actually needed
        var condX = typeof ox === 'string';
        var condY = typeof oy === 'string';
        if (condX || condY) {
            var _f = element.bbox(), height_1 = _f.height, width_1 = _f.width, x_1 = _f.x, y_1 = _f.y;
            // And only overwrite if string was passed for this specific axis
            if (condX) {
                ox = ox.includes('left') ? x_1 : ox.includes('right') ? x_1 + width_1 : x_1 + width_1 / 2;
            }
            if (condY) {
                oy = oy.includes('top') ? y_1 : oy.includes('bottom') ? y_1 + height_1 : y_1 + height_1 / 2;
            }
        }
        // Return the origin as it is if it wasn't a string
        return [ox, oy];
    }
    var descriptiveElements = new Set(['desc', 'metadata', 'title']);
    var isDescriptive = function (element) { return descriptiveElements.has(element.nodeName); };
    var writeDataToDom = function (element, data, defaults) {
        if (defaults === void 0) { defaults = {}; }
        var cloned = __assign({}, data);
        for (var key in cloned) {
            if (cloned[key].valueOf() === defaults[key]) {
                delete cloned[key];
            }
        }
        if (Object.keys(cloned).length) {
            element.node.setAttribute('data-svgjs', JSON.stringify(cloned)); // see #428
        }
        else {
            element.node.removeAttribute('data-svgjs');
            element.node.removeAttribute('svgjs:data');
        }
    };
    var utils = {
        __proto__: null,
        capitalize: capitalize,
        degrees: degrees,
        filter: filter,
        getOrigin: getOrigin,
        isDescriptive: isDescriptive,
        map: map,
        proportionalSize: proportionalSize,
        radians: radians,
        unCamelCase: unCamelCase,
        writeDataToDom: writeDataToDom
    };
    // Default namespaces
    var svg = 'http://www.w3.org/2000/svg';
    var html = 'http://www.w3.org/1999/xhtml';
    var xmlns = 'http://www.w3.org/2000/xmlns/';
    var xlink = 'http://www.w3.org/1999/xlink';
    var namespaces = {
        __proto__: null,
        html: html,
        svg: svg,
        xlink: xlink,
        xmlns: xmlns
    };
    var globals = {
        window: typeof window === 'undefined' ? null : window,
        document: typeof document === 'undefined' ? null : document
    };
    function registerWindow(win, doc) {
        if (win === void 0) { win = null; }
        if (doc === void 0) { doc = null; }
        globals.window = win;
        globals.document = doc;
    }
    var save = {};
    function saveWindow() {
        save.window = globals.window;
        save.document = globals.document;
    }
    function restoreWindow() {
        globals.window = save.window;
        globals.document = save.document;
    }
    function withWindow(win, fn) {
        saveWindow();
        registerWindow(win, win.document);
        fn(win, win.document);
        restoreWindow();
    }
    function getWindow() {
        return globals.window;
    }
    var Base = /** @class */ (function () {
        function Base() {
        }
        return Base;
    }());
    var elements = {};
    var root = '___SYMBOL___ROOT___';
    // Method for element creation
    function create(name, ns) {
        if (ns === void 0) { ns = svg; }
        // create element
        return globals.document.createElementNS(ns, name);
    }
    function makeInstance(element, isHTML) {
        if (isHTML === void 0) { isHTML = false; }
        if (element instanceof Base)
            return element;
        if (typeof element === 'object') {
            return adopter(element);
        }
        if (element == null) {
            return new elements[root]();
        }
        if (typeof element === 'string' && element.trim().charAt(0) !== '<') {
            return adopter(globals.document.querySelector(element));
        }
        // Make sure, that HTML elements are created with the correct namespace
        var wrapper = isHTML ? globals.document.createElement('div') : create('svg');
        wrapper.innerHTML = element.trim();
        // We use firstElementChild here to skip potential comment nodes (#1339),
        element = adopter(wrapper.firstElementChild);
        // make sure, that element doesn't have its wrapper attached
        wrapper.removeChild(wrapper.firstElementChild);
        return element;
    }
    function nodeOrNew(name, node) {
        return node && (node instanceof globals.window.Node || node.ownerDocument && node instanceof node.ownerDocument.defaultView.Node) ? node : create(name);
    }
    // Adopt existing svg elements
    function adopt(node) {
        // check for presence of node
        if (!node)
            return null;
        // make sure a node isn't already adopted
        if (node.instance instanceof Base)
            return node.instance;
        if (node.nodeName === '#document-fragment') {
            return new elements.Fragment(node);
        }
        // initialize variables
        var className = capitalize(node.nodeName || 'Dom');
        // Make sure that gradients are adopted correctly
        if (className === 'LinearGradient' || className === 'RadialGradient') {
            className = 'Gradient';
            // Fallback to Dom if element is not known
        }
        else if (!elements[className]) {
            className = 'Dom';
        }
        return new elements[className](node);
    }
    var adopter = adopt;
    function mockAdopt(mock) {
        if (mock === void 0) { mock = adopt; }
        adopter = mock;
    }
    function register(element, name, asRoot) {
        if (name === void 0) { name = element.name; }
        if (asRoot === void 0) { asRoot = false; }
        elements[name] = element;
        if (asRoot)
            elements[root] = element;
        addMethodNames(Object.getOwnPropertyNames(element.prototype));
        return element;
    }
    function getClass(name) {
        return elements[name];
    }
    // Element id sequence
    var did = 1000;
    // Get next named element id
    function eid(name) {
        return 'Svgjs' + capitalize(name) + did++;
    }
    // Deep new id assignment
    function assignNewId(node) {
        // do the same for SVG child nodes as well
        for (var i = node.children.length - 1; i >= 0; i--) {
            assignNewId(node.children[i]);
        }
        if (node.id) {
            node.id = eid(node.nodeName);
            return node;
        }
        return node;
    }
    // Method for extending objects
    function extend(modules, methods) {
        var key, i;
        modules = Array.isArray(modules) ? modules : [modules];
        for (i = modules.length - 1; i >= 0; i--) {
            for (key in methods) {
                modules[i].prototype[key] = methods[key];
            }
        }
    }
    function wrapWithAttrCheck(fn) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var o = args[args.length - 1];
            if (o && o.constructor === Object && !(o instanceof Array)) {
                return fn.apply(this, args.slice(0, -1)).attr(o);
            }
            else {
                return fn.apply(this, args);
            }
        };
    }
    // Get all siblings, including myself
    function siblings() {
        return this.parent().children();
    }
    // Get the current position siblings
    function position() {
        return this.parent().index(this);
    }
    // Get the next element (will return null if there is none)
    function next() {
        return this.siblings()[this.position() + 1];
    }
    // Get the next element (will return null if there is none)
    function prev() {
        return this.siblings()[this.position() - 1];
    }
    // Send given element one step forward
    function forward() {
        var i = this.position();
        var p = this.parent();
        // move node one step forward
        p.add(this.remove(), i + 1);
        return this;
    }
    // Send given element one step backward
    function backward() {
        var i = this.position();
        var p = this.parent();
        p.add(this.remove(), i ? i - 1 : 0);
        return this;
    }
    // Send given element all the way to the front
    function front() {
        var p = this.parent();
        // Move node forward
        p.add(this.remove());
        return this;
    }
    // Send given element all the way to the back
    function back() {
        var p = this.parent();
        // Move node back
        p.add(this.remove(), 0);
        return this;
    }
    // Inserts a given element before the targeted element
    function before(element) {
        element = makeInstance(element);
        element.remove();
        var i = this.position();
        this.parent().add(element, i);
        return this;
    }
    // Inserts a given element after the targeted element
    function after(element) {
        element = makeInstance(element);
        element.remove();
        var i = this.position();
        this.parent().add(element, i + 1);
        return this;
    }
    function insertBefore(element) {
        element = makeInstance(element);
        element.before(this);
        return this;
    }
    function insertAfter(element) {
        element = makeInstance(element);
        element.after(this);
        return this;
    }
    registerMethods('Dom', {
        siblings: siblings,
        position: position,
        next: next,
        prev: prev,
        forward: forward,
        backward: backward,
        front: front,
        back: back,
        before: before,
        after: after,
        insertBefore: insertBefore,
        insertAfter: insertAfter
    });
    // Parse unit value
    var numberAndUnit = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i;
    // Parse hex value
    var hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    // Parse rgb value
    var rgb = /rgb\((\d+),(\d+),(\d+)\)/;
    // Parse reference id
    var reference = /(#[a-z_][a-z0-9\-_]*)/i;
    // splits a transformation chain
    var transforms = /\)\s*,?\s*/;
    // Whitespace
    var whitespace = /\s/g;
    // Test hex value
    var isHex = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i;
    // Test rgb value
    var isRgb = /^rgb\(/;
    // Test for blank string
    var isBlank = /^(\s+)?$/;
    // Test for numeric string
    var isNumber = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
    // Test for image url
    var isImage = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i;
    // split at whitespace and comma
    var delimiter = /[\s,]+/;
    // Test for path letter
    var isPathLetter = /[MLHVCSQTAZ]/i;
    var regex = {
        __proto__: null,
        delimiter: delimiter,
        hex: hex,
        isBlank: isBlank,
        isHex: isHex,
        isImage: isImage,
        isNumber: isNumber,
        isPathLetter: isPathLetter,
        isRgb: isRgb,
        numberAndUnit: numberAndUnit,
        reference: reference,
        rgb: rgb,
        transforms: transforms,
        whitespace: whitespace
    };
    // Return array of classes on the node
    function classes() {
        var attr = this.attr('class');
        return attr == null ? [] : attr.trim().split(delimiter);
    }
    // Return true if class exists on the node, false otherwise
    function hasClass(name) {
        return this.classes().indexOf(name) !== -1;
    }
    // Add class to the node
    function addClass(name) {
        if (!this.hasClass(name)) {
            var array_1 = this.classes();
            array_1.push(name);
            this.attr('class', array_1.join(' '));
        }
        return this;
    }
    // Remove class from the node
    function removeClass(name) {
        if (this.hasClass(name)) {
            this.attr('class', this.classes().filter(function (c) {
                return c !== name;
            }).join(' '));
        }
        return this;
    }
    // Toggle the presence of a class on the node
    function toggleClass(name) {
        return this.hasClass(name) ? this.removeClass(name) : this.addClass(name);
    }
    registerMethods('Dom', {
        classes: classes,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass
    });
    // Dynamic style generator
    function css(style, val) {
        var ret = {};
        if (arguments.length === 0) {
            // get full style as object
            this.node.style.cssText.split(/\s*;\s*/).filter(function (el) {
                return !!el.length;
            }).forEach(function (el) {
                var t = el.split(/\s*:\s*/);
                ret[t[0]] = t[1];
            });
            return ret;
        }
        if (arguments.length < 2) {
            // get style properties as array
            if (Array.isArray(style)) {
                for (var _i = 0, style_1 = style; _i < style_1.length; _i++) {
                    var name_2 = style_1[_i];
                    var cased = name_2;
                    ret[name_2] = this.node.style.getPropertyValue(cased);
                }
                return ret;
            }
            // get style for property
            if (typeof style === 'string') {
                return this.node.style.getPropertyValue(style);
            }
            // set styles in object
            if (typeof style === 'object') {
                for (var name_3 in style) {
                    // set empty string if null/undefined/'' was given
                    this.node.style.setProperty(name_3, style[name_3] == null || isBlank.test(style[name_3]) ? '' : style[name_3]);
                }
            }
        }
        // set style for property
        if (arguments.length === 2) {
            this.node.style.setProperty(style, val == null || isBlank.test(val) ? '' : val);
        }
        return this;
    }
    // Show element
    function show() {
        return this.css('display', '');
    }
    // Hide element
    function hide() {
        return this.css('display', 'none');
    }
    // Is element visible?
    function visible() {
        return this.css('display') !== 'none';
    }
    registerMethods('Dom', {
        css: css,
        show: show,
        hide: hide,
        visible: visible
    });
    // Store data values on svg nodes
    function data(a, v, r) {
        if (a == null) {
            // get an object of attributes
            return this.data(map(filter(this.node.attributes, function (el) { return el.nodeName.indexOf('data-') === 0; }), function (el) { return el.nodeName.slice(5); }));
        }
        else if (a instanceof Array) {
            var data_1 = {};
            for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
                var key = a_1[_i];
                data_1[key] = this.data(key);
            }
            return data_1;
        }
        else if (typeof a === 'object') {
            for (v in a) {
                this.data(v, a[v]);
            }
        }
        else if (arguments.length < 2) {
            try {
                return JSON.parse(this.attr('data-' + a));
            }
            catch (e) {
                return this.attr('data-' + a);
            }
        }
        else {
            this.attr('data-' + a, v === null ? null : r === true || typeof v === 'string' || typeof v === 'number' ? v : JSON.stringify(v));
        }
        return this;
    }
    registerMethods('Dom', {
        data: data
    });
    // Remember arbitrary data
    function remember(k, v) {
        // remember every item in an object individually
        if (typeof arguments[0] === 'object') {
            for (var key in k) {
                this.remember(key, k[key]);
            }
        }
        else if (arguments.length === 1) {
            // retrieve memory
            return this.memory()[k];
        }
        else {
            // store memory
            this.memory()[k] = v;
        }
        return this;
    }
    // Erase a given memory
    function forget() {
        if (arguments.length === 0) {
            this._memory = {};
        }
        else {
            for (var i = arguments.length - 1; i >= 0; i--) {
                delete this.memory()[arguments[i]];
            }
        }
        return this;
    }
    // This triggers creation of a new hidden class which is not performant
    // However, this function is not rarely used so it will not happen frequently
    // Return local memory object
    function memory() {
        return this._memory = this._memory || {};
    }
    registerMethods('Dom', {
        remember: remember,
        forget: forget,
        memory: memory
    });
    function sixDigitHex(hex) {
        return hex.length === 4 ? ['#', hex.substring(1, 2), hex.substring(1, 2), hex.substring(2, 3), hex.substring(2, 3), hex.substring(3, 4), hex.substring(3, 4)].join('') : hex;
    }
    function componentHex(component) {
        var integer = Math.round(component);
        var bounded = Math.max(0, Math.min(255, integer));
        var hex = bounded.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
    function is(object, space) {
        for (var i = space.length; i--;) {
            if (object[space[i]] == null) {
                return false;
            }
        }
        return true;
    }
    function getParameters(a, b) {
        var params = is(a, 'rgb') ? {
            _a: a.r,
            _b: a.g,
            _c: a.b,
            _d: 0,
            space: 'rgb'
        } : is(a, 'xyz') ? {
            _a: a.x,
            _b: a.y,
            _c: a.z,
            _d: 0,
            space: 'xyz'
        } : is(a, 'hsl') ? {
            _a: a.h,
            _b: a.s,
            _c: a.l,
            _d: 0,
            space: 'hsl'
        } : is(a, 'lab') ? {
            _a: a.l,
            _b: a.a,
            _c: a.b,
            _d: 0,
            space: 'lab'
        } : is(a, 'lch') ? {
            _a: a.l,
            _b: a.c,
            _c: a.h,
            _d: 0,
            space: 'lch'
        } : is(a, 'cmyk') ? {
            _a: a.c,
            _b: a.m,
            _c: a.y,
            _d: a.k,
            space: 'cmyk'
        } : {
            _a: 0,
            _b: 0,
            _c: 0,
            space: 'rgb'
        };
        params.space = b || params.space;
        return params;
    }
    function cieSpace(space) {
        if (space === 'lab' || space === 'xyz' || space === 'lch') {
            return true;
        }
        else {
            return false;
        }
    }
    function hueToRgb(p, q, t) {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
    var Color = /** @class */ (function () {
        function Color() {
            var inputs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                inputs[_i] = arguments[_i];
            }
            this.init.apply(this, inputs);
        }
        // Test if given value is a color
        Color.isColor = function (color) {
            return color && (color instanceof Color || this.isRgb(color) || this.test(color));
        };
        // Test if given value is an rgb object
        Color.isRgb = function (color) {
            return color && typeof color.r === 'number' && typeof color.g === 'number' && typeof color.b === 'number';
        };
        /*
        Generating random colors
        */
        Color.random = function (mode, t) {
            if (mode === void 0) { mode = 'vibrant'; }
            // Get the math modules
            var random = Math.random, round = Math.round, sin = Math.sin, pi = Math.PI;
            // Run the correct generator
            if (mode === 'vibrant') {
                var l = (81 - 57) * random() + 57;
                var c = (83 - 45) * random() + 45;
                var h = 360 * random();
                var color = new Color(l, c, h, 'lch');
                return color;
            }
            else if (mode === 'sine') {
                t = t == null ? random() : t;
                var r = round(80 * sin(2 * pi * t / 0.5 + 0.01) + 150);
                var g = round(50 * sin(2 * pi * t / 0.5 + 4.6) + 200);
                var b = round(100 * sin(2 * pi * t / 0.5 + 2.3) + 150);
                var color = new Color(r, g, b);
                return color;
            }
            else if (mode === 'pastel') {
                var l = (94 - 86) * random() + 86;
                var c = (26 - 9) * random() + 9;
                var h = 360 * random();
                var color = new Color(l, c, h, 'lch');
                return color;
            }
            else if (mode === 'dark') {
                var l = 10 + 10 * random();
                var c = (125 - 75) * random() + 86;
                var h = 360 * random();
                var color = new Color(l, c, h, 'lch');
                return color;
            }
            else if (mode === 'rgb') {
                var r = 255 * random();
                var g = 255 * random();
                var b = 255 * random();
                var color = new Color(r, g, b);
                return color;
            }
            else if (mode === 'lab') {
                var l = 100 * random();
                var a = 256 * random() - 128;
                var b = 256 * random() - 128;
                var color = new Color(l, a, b, 'lab');
                return color;
            }
            else if (mode === 'grey') {
                var grey = 255 * random();
                var color = new Color(grey, grey, grey);
                return color;
            }
            else {
                throw new Error('Unsupported random color mode');
            }
        };
        // Test if given value is a color string
        Color.test = function (color) {
            return typeof color === 'string' && (isHex.test(color) || isRgb.test(color));
        };
        Color.prototype.cmyk = function () {
            // Get the rgb values for the current color
            var _e = this.rgb(), _a = _e._a, _b = _e._b, _c = _e._c;
            var _f = [_a, _b, _c].map(function (v) { return v / 255; }), r = _f[0], g = _f[1], b = _f[2];
            // Get the cmyk values in an unbounded format
            var k = Math.min(1 - r, 1 - g, 1 - b);
            if (k === 1) {
                // Catch the black case
                return new Color(0, 0, 0, 1, 'cmyk');
            }
            var c = (1 - r - k) / (1 - k);
            var m = (1 - g - k) / (1 - k);
            var y = (1 - b - k) / (1 - k);
            // Construct the new color
            var color = new Color(c, m, y, k, 'cmyk');
            return color;
        };
        Color.prototype.hsl = function () {
            // Get the rgb values
            var _e = this.rgb(), _a = _e._a, _b = _e._b, _c = _e._c;
            var _f = [_a, _b, _c].map(function (v) { return v / 255; }), r = _f[0], g = _f[1], b = _f[2];
            // Find the maximum and minimum values to get the lightness
            var max = Math.max(r, g, b);
            var min = Math.min(r, g, b);
            var l = (max + min) / 2;
            // If the r, g, v values are identical then we are grey
            var isGrey = max === min;
            // Calculate the hue and saturation
            var delta = max - min;
            var s = isGrey ? 0 : l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
            var h = isGrey ? 0 : max === r ? ((g - b) / delta + (g < b ? 6 : 0)) / 6 : max === g ? ((b - r) / delta + 2) / 6 : max === b ? ((r - g) / delta + 4) / 6 : 0;
            // Construct and return the new color
            var color = new Color(360 * h, 100 * s, 100 * l, 'hsl');
            return color;
        };
        Color.prototype.init = function (a, b, c, d, space) {
            if (a === void 0) { a = 0; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 0; }
            if (space === void 0) { space = 'rgb'; }
            // This catches the case when a falsy value is passed like ''
            a = !a ? 0 : a;
            // Reset all values in case the init function is rerun with new color space
            if (this.space) {
                for (var component in this.space) {
                    delete this[this.space[component]];
                }
            }
            if (typeof a === 'number') {
                // Allow for the case that we don't need d...
                space = typeof d === 'string' ? d : space;
                d = typeof d === 'string' ? 0 : d;
                // Assign the values straight to the color
                Object.assign(this, {
                    _a: a,
                    _b: b,
                    _c: c,
                    _d: d,
                    space: space
                });
                // If the user gave us an array, make the color from it
            }
            else if (a instanceof Array) {
                this.space = b || (typeof a[3] === 'string' ? a[3] : a[4]) || 'rgb';
                Object.assign(this, {
                    _a: a[0],
                    _b: a[1],
                    _c: a[2],
                    _d: a[3] || 0
                });
            }
            else if (a instanceof Object) {
                // Set the object up and assign its values directly
                var values = getParameters(a, b);
                Object.assign(this, values);
            }
            else if (typeof a === 'string') {
                if (isRgb.test(a)) {
                    var noWhitespace = a.replace(whitespace, '');
                    var _e = rgb.exec(noWhitespace).slice(1, 4).map(function (v) { return parseInt(v); }), _a_1 = _e[0], _b_1 = _e[1], _c_1 = _e[2];
                    Object.assign(this, {
                        _a: _a_1,
                        _b: _b_1,
                        _c: _c_1,
                        _d: 0,
                        space: 'rgb'
                    });
                }
                else if (isHex.test(a)) {
                    var hexParse = function (v) { return parseInt(v, 16); };
                    var _f = hex.exec(sixDigitHex(a)).map(hexParse), _a_2 = _f[1], _b_2 = _f[2], _c_2 = _f[3];
                    Object.assign(this, {
                        _a: _a_2,
                        _b: _b_2,
                        _c: _c_2,
                        _d: 0,
                        space: 'rgb'
                    });
                }
                else
                    throw Error("Unsupported string format, can't construct Color");
            }
            // Now add the components as a convenience
            var _g = this, _a = _g._a, _b = _g._b, _c = _g._c, _d = _g._d;
            var components = this.space === 'rgb' ? {
                r: _a,
                g: _b,
                b: _c
            } : this.space === 'xyz' ? {
                x: _a,
                y: _b,
                z: _c
            } : this.space === 'hsl' ? {
                h: _a,
                s: _b,
                l: _c
            } : this.space === 'lab' ? {
                l: _a,
                a: _b,
                b: _c
            } : this.space === 'lch' ? {
                l: _a,
                c: _b,
                h: _c
            } : this.space === 'cmyk' ? {
                c: _a,
                m: _b,
                y: _c,
                k: _d
            } : {};
            Object.assign(this, components);
        };
        Color.prototype.lab = function () {
            // Get the xyz color
            var _e = this.xyz(), x = _e.x, y = _e.y, z = _e.z;
            // Get the lab components
            var l = 116 * y - 16;
            var a = 500 * (x - y);
            var b = 200 * (y - z);
            // Construct and return a new color
            var color = new Color(l, a, b, 'lab');
            return color;
        };
        Color.prototype.lch = function () {
            // Get the lab color directly
            var _e = this.lab(), l = _e.l, a = _e.a, b = _e.b;
            // Get the chromaticity and the hue using polar coordinates
            var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
            var h = 180 * Math.atan2(b, a) / Math.PI;
            if (h < 0) {
                h *= -1;
                h = 360 - h;
            }
            // Make a new color and return it
            var color = new Color(l, c, h, 'lch');
            return color;
        };
        /*
        Conversion Methods
        */
        Color.prototype.rgb = function () {
            if (this.space === 'rgb') {
                return this;
            }
            else if (cieSpace(this.space)) {
                // Convert to the xyz color space
                var _e = this, x_2 = _e.x, y_2 = _e.y, z = _e.z;
                if (this.space === 'lab' || this.space === 'lch') {
                    // Get the values in the lab space
                    var _f = this, l = _f.l, a = _f.a, b_1 = _f.b;
                    if (this.space === 'lch') {
                        var _g = this, c = _g.c, h = _g.h;
                        var dToR = Math.PI / 180;
                        a = c * Math.cos(dToR * h);
                        b_1 = c * Math.sin(dToR * h);
                    }
                    // Undo the nonlinear function
                    var yL = (l + 16) / 116;
                    var xL = a / 500 + yL;
                    var zL = yL - b_1 / 200;
                    // Get the xyz values
                    var ct = 16 / 116;
                    var mx = 0.008856;
                    var nm = 7.787;
                    x_2 = 0.95047 * (Math.pow(xL, 3) > mx ? Math.pow(xL, 3) : (xL - ct) / nm);
                    y_2 = 1.0 * (Math.pow(yL, 3) > mx ? Math.pow(yL, 3) : (yL - ct) / nm);
                    z = 1.08883 * (Math.pow(zL, 3) > mx ? Math.pow(zL, 3) : (zL - ct) / nm);
                }
                // Convert xyz to unbounded rgb values
                var rU = x_2 * 3.2406 + y_2 * -1.5372 + z * -0.4986;
                var gU = x_2 * -0.9689 + y_2 * 1.8758 + z * 0.0415;
                var bU = x_2 * 0.0557 + y_2 * -0.204 + z * 1.057;
                // Convert the values to true rgb values
                var pow = Math.pow;
                var bd = 0.0031308;
                var r = rU > bd ? 1.055 * pow(rU, 1 / 2.4) - 0.055 : 12.92 * rU;
                var g = gU > bd ? 1.055 * pow(gU, 1 / 2.4) - 0.055 : 12.92 * gU;
                var b = bU > bd ? 1.055 * pow(bU, 1 / 2.4) - 0.055 : 12.92 * bU;
                // Make and return the color
                var color = new Color(255 * r, 255 * g, 255 * b);
                return color;
            }
            else if (this.space === 'hsl') {
                // https://bgrins.github.io/TinyColor/docs/tinycolor.html
                // Get the current hsl values
                var _h = this, h = _h.h, s = _h.s, l = _h.l;
                h /= 360;
                s /= 100;
                l /= 100;
                // If we are grey, then just make the color directly
                if (s === 0) {
                    l *= 255;
                    var color_1 = new Color(l, l, l);
                    return color_1;
                }
                // TODO I have no idea what this does :D If you figure it out, tell me!
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                // Get the rgb values
                var r = 255 * hueToRgb(p, q, h + 1 / 3);
                var g = 255 * hueToRgb(p, q, h);
                var b = 255 * hueToRgb(p, q, h - 1 / 3);
                // Make a new color
                var color = new Color(r, g, b);
                return color;
            }
            else if (this.space === 'cmyk') {
                // https://gist.github.com/felipesabino/5066336
                // Get the normalised cmyk values
                var _j = this, c = _j.c, m = _j.m, y_3 = _j.y, k = _j.k;
                // Get the rgb values
                var r = 255 * (1 - Math.min(1, c * (1 - k) + k));
                var g = 255 * (1 - Math.min(1, m * (1 - k) + k));
                var b = 255 * (1 - Math.min(1, y_3 * (1 - k) + k));
                // Form the color and return it
                var color = new Color(r, g, b);
                return color;
            }
            else {
                return this;
            }
        };
        Color.prototype.toArray = function () {
            var _e = this, _a = _e._a, _b = _e._b, _c = _e._c, _d = _e._d, space = _e.space;
            return [_a, _b, _c, _d, space];
        };
        Color.prototype.toHex = function () {
            var _e = this._clamped().map(componentHex), r = _e[0], g = _e[1], b = _e[2];
            return "#".concat(r).concat(g).concat(b);
        };
        Color.prototype.toRgb = function () {
            var _e = this._clamped(), rV = _e[0], gV = _e[1], bV = _e[2];
            var string = "rgb(".concat(rV, ",").concat(gV, ",").concat(bV, ")");
            return string;
        };
        Color.prototype.toString = function () {
            return this.toHex();
        };
        Color.prototype.xyz = function () {
            // Normalise the red, green and blue values
            var _e = this.rgb(), r255 = _e._a, g255 = _e._b, b255 = _e._c;
            var _f = [r255, g255, b255].map(function (v) { return v / 255; }), r = _f[0], g = _f[1], b = _f[2];
            // Convert to the lab rgb space
            var rL = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
            var gL = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
            var bL = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
            // Convert to the xyz color space without bounding the values
            var xU = (rL * 0.4124 + gL * 0.3576 + bL * 0.1805) / 0.95047;
            var yU = (rL * 0.2126 + gL * 0.7152 + bL * 0.0722) / 1.0;
            var zU = (rL * 0.0193 + gL * 0.1192 + bL * 0.9505) / 1.08883;
            // Get the proper xyz values by applying the bounding
            var x = xU > 0.008856 ? Math.pow(xU, 1 / 3) : 7.787 * xU + 16 / 116;
            var y = yU > 0.008856 ? Math.pow(yU, 1 / 3) : 7.787 * yU + 16 / 116;
            var z = zU > 0.008856 ? Math.pow(zU, 1 / 3) : 7.787 * zU + 16 / 116;
            // Make and return the color
            var color = new Color(x, y, z, 'xyz');
            return color;
        };
        /*
        Input and Output methods
        */
        Color.prototype._clamped = function () {
            var _e = this.rgb(), _a = _e._a, _b = _e._b, _c = _e._c;
            var max = Math.max, min = Math.min, round = Math.round;
            var format = function (v) { return max(0, min(round(v), 255)); };
            return [_a, _b, _c].map(format);
        };
        return Color;
    }());
    var Point = /** @class */ (function () {
        // Initialize
        function Point() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.init.apply(this, args);
        }
        // Clone point
        Point.prototype.clone = function () {
            return new Point(this);
        };
        Point.prototype.init = function (x, y) {
            var base = {
                x: 0,
                y: 0
            };
            // ensure source as object
            var source = Array.isArray(x) ? {
                x: x[0],
                y: x[1]
            } : typeof x === 'object' ? {
                x: x.x,
                y: x.y
            } : {
                x: x,
                y: y
            };
            // merge source
            this.x = source.x == null ? base.x : source.x;
            this.y = source.y == null ? base.y : source.y;
            return this;
        };
        Point.prototype.toArray = function () {
            return [this.x, this.y];
        };
        Point.prototype.transform = function (m) {
            return this.clone().transformO(m);
        };
        // Transform point with matrix
        Point.prototype.transformO = function (m) {
            if (!Matrix.isMatrixLike(m)) {
                m = new Matrix(m);
            }
            var _e = this, x = _e.x, y = _e.y;
            // Perform the matrix multiplication
            this.x = m.a * x + m.c * y + m.e;
            this.y = m.b * x + m.d * y + m.f;
            return this;
        };
        return Point;
    }());
    function point(x, y) {
        return new Point(x, y).transformO(this.screenCTM().inverseO());
    }
    function closeEnough(a, b, threshold) {
        return Math.abs(b - a) < (1e-6);
    }
    var Matrix = /** @class */ (function () {
        function Matrix() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.init.apply(this, args);
        }
        Matrix.formatTransforms = function (o) {
            // Get all of the parameters required to form the matrix
            var flipBoth = o.flip === 'both' || o.flip === true;
            var flipX = o.flip && (flipBoth || o.flip === 'x') ? -1 : 1;
            var flipY = o.flip && (flipBoth || o.flip === 'y') ? -1 : 1;
            var skewX = o.skew && o.skew.length ? o.skew[0] : isFinite(o.skew) ? o.skew : isFinite(o.skewX) ? o.skewX : 0;
            var skewY = o.skew && o.skew.length ? o.skew[1] : isFinite(o.skew) ? o.skew : isFinite(o.skewY) ? o.skewY : 0;
            var scaleX = o.scale && o.scale.length ? o.scale[0] * flipX : isFinite(o.scale) ? o.scale * flipX : isFinite(o.scaleX) ? o.scaleX * flipX : flipX;
            var scaleY = o.scale && o.scale.length ? o.scale[1] * flipY : isFinite(o.scale) ? o.scale * flipY : isFinite(o.scaleY) ? o.scaleY * flipY : flipY;
            var shear = o.shear || 0;
            var theta = o.rotate || o.theta || 0;
            var origin = new Point(o.origin || o.around || o.ox || o.originX, o.oy || o.originY);
            var ox = origin.x;
            var oy = origin.y;
            // We need Point to be invalid if nothing was passed because we cannot default to 0 here. That is why NaN
            var position = new Point(o.position || o.px || o.positionX || NaN, o.py || o.positionY || NaN);
            var px = position.x;
            var py = position.y;
            var translate = new Point(o.translate || o.tx || o.translateX, o.ty || o.translateY);
            var tx = translate.x;
            var ty = translate.y;
            var relative = new Point(o.relative || o.rx || o.relativeX, o.ry || o.relativeY);
            var rx = relative.x;
            var ry = relative.y;
            // Populate all of the values
            return {
                scaleX: scaleX,
                scaleY: scaleY,
                skewX: skewX,
                skewY: skewY,
                shear: shear,
                theta: theta,
                rx: rx,
                ry: ry,
                tx: tx,
                ty: ty,
                ox: ox,
                oy: oy,
                px: px,
                py: py
            };
        };
        Matrix.fromArray = function (a) {
            return {
                a: a[0],
                b: a[1],
                c: a[2],
                d: a[3],
                e: a[4],
                f: a[5]
            };
        };
        Matrix.isMatrixLike = function (o) {
            return o.a != null || o.b != null || o.c != null || o.d != null || o.e != null || o.f != null;
        };
        // left matrix, right matrix, target matrix which is overwritten
        Matrix.matrixMultiply = function (l, r, o) {
            // Work out the product directly
            var a = l.a * r.a + l.c * r.b;
            var b = l.b * r.a + l.d * r.b;
            var c = l.a * r.c + l.c * r.d;
            var d = l.b * r.c + l.d * r.d;
            var e = l.e + l.a * r.e + l.c * r.f;
            var f = l.f + l.b * r.e + l.d * r.f;
            // make sure to use local variables because l/r and o could be the same
            o.a = a;
            o.b = b;
            o.c = c;
            o.d = d;
            o.e = e;
            o.f = f;
            return o;
        };
        Matrix.prototype.around = function (cx, cy, matrix) {
            return this.clone().aroundO(cx, cy, matrix);
        };
        // Transform around a center point
        Matrix.prototype.aroundO = function (cx, cy, matrix) {
            var dx = cx || 0;
            var dy = cy || 0;
            return this.translateO(-dx, -dy).lmultiplyO(matrix).translateO(dx, dy);
        };
        // Clones this matrix
        Matrix.prototype.clone = function () {
            return new Matrix(this);
        };
        // Decomposes this matrix into its affine parameters
        Matrix.prototype.decompose = function (cx, cy) {
            if (cx === void 0) { cx = 0; }
            if (cy === void 0) { cy = 0; }
            // Get the parameters from the matrix
            var a = this.a;
            var b = this.b;
            var c = this.c;
            var d = this.d;
            var e = this.e;
            var f = this.f;
            // Figure out if the winding direction is clockwise or counterclockwise
            var determinant = a * d - b * c;
            var ccw = determinant > 0 ? 1 : -1;
            // Since we only shear in x, we can use the x basis to get the x scale
            // and the rotation of the resulting matrix
            var sx = ccw * Math.sqrt(a * a + b * b);
            var thetaRad = Math.atan2(ccw * b, ccw * a);
            var theta = 180 / Math.PI * thetaRad;
            var ct = Math.cos(thetaRad);
            var st = Math.sin(thetaRad);
            // We can then solve the y basis vector simultaneously to get the other
            // two affine parameters directly from these parameters
            var lam = (a * c + b * d) / determinant;
            var sy = c * sx / (lam * a - b) || d * sx / (lam * b + a);
            // Use the translations
            var tx = e - cx + cx * ct * sx + cy * (lam * ct * sx - st * sy);
            var ty = f - cy + cx * st * sx + cy * (lam * st * sx + ct * sy);
            // Construct the decomposition and return it
            return {
                // Return the affine parameters
                scaleX: sx,
                scaleY: sy,
                shear: lam,
                rotate: theta,
                translateX: tx,
                translateY: ty,
                originX: cx,
                originY: cy,
                // Return the matrix parameters
                a: this.a,
                b: this.b,
                c: this.c,
                d: this.d,
                e: this.e,
                f: this.f
            };
        };
        // Check if two matrices are equal
        Matrix.prototype.equals = function (other) {
            if (other === this)
                return true;
            var comp = new Matrix(other);
            return closeEnough(this.a, comp.a) && closeEnough(this.b, comp.b) && closeEnough(this.c, comp.c) && closeEnough(this.d, comp.d) && closeEnough(this.e, comp.e) && closeEnough(this.f, comp.f);
        };
        // Flip matrix on x or y, at a given offset
        Matrix.prototype.flip = function (axis, around) {
            return this.clone().flipO(axis, around);
        };
        Matrix.prototype.flipO = function (axis, around) {
            return axis === 'x' ? this.scaleO(-1, 1, around, 0) : axis === 'y' ? this.scaleO(1, -1, 0, around) : this.scaleO(-1, -1, axis, around || axis); // Define an x, y flip point
        };
        // Initialize
        Matrix.prototype.init = function (source) {
            var base = Matrix.fromArray([1, 0, 0, 1, 0, 0]);
            // ensure source as object
            source = source instanceof Element ? source.matrixify() : typeof source === 'string' ? Matrix.fromArray(source.split(delimiter).map(parseFloat)) : Array.isArray(source) ? Matrix.fromArray(source) : typeof source === 'object' && Matrix.isMatrixLike(source) ? source : typeof source === 'object' ? new Matrix().transform(source) : arguments.length === 6 ? Matrix.fromArray([].slice.call(arguments)) : base;
            // Merge the source matrix with the base matrix
            this.a = source.a != null ? source.a : base.a;
            this.b = source.b != null ? source.b : base.b;
            this.c = source.c != null ? source.c : base.c;
            this.d = source.d != null ? source.d : base.d;
            this.e = source.e != null ? source.e : base.e;
            this.f = source.f != null ? source.f : base.f;
            return this;
        };
        Matrix.prototype.inverse = function () {
            return this.clone().inverseO();
        };
        // Inverses matrix
        Matrix.prototype.inverseO = function () {
            // Get the current parameters out of the matrix
            var a = this.a;
            var b = this.b;
            var c = this.c;
            var d = this.d;
            var e = this.e;
            var f = this.f;
            // Invert the 2x2 matrix in the top left
            var det = a * d - b * c;
            if (!det)
                throw new Error('Cannot invert ' + this);
            // Calculate the top 2x2 matrix
            var na = d / det;
            var nb = -b / det;
            var nc = -c / det;
            var nd = a / det;
            // Apply the inverted matrix to the top right
            var ne = -(na * e + nc * f);
            var nf = -(nb * e + nd * f);
            // Construct the inverted matrix
            this.a = na;
            this.b = nb;
            this.c = nc;
            this.d = nd;
            this.e = ne;
            this.f = nf;
            return this;
        };
        Matrix.prototype.lmultiply = function (matrix) {
            return this.clone().lmultiplyO(matrix);
        };
        Matrix.prototype.lmultiplyO = function (matrix) {
            var r = this;
            var l = matrix instanceof Matrix ? matrix : new Matrix(matrix);
            return Matrix.matrixMultiply(l, r, this);
        };
        // Left multiplies by the given matrix
        Matrix.prototype.multiply = function (matrix) {
            return this.clone().multiplyO(matrix);
        };
        Matrix.prototype.multiplyO = function (matrix) {
            // Get the matrices
            var l = this;
            var r = matrix instanceof Matrix ? matrix : new Matrix(matrix);
            return Matrix.matrixMultiply(l, r, this);
        };
        // Rotate matrix
        Matrix.prototype.rotate = function (r, cx, cy) {
            return this.clone().rotateO(r, cx, cy);
        };
        Matrix.prototype.rotateO = function (r, cx, cy) {
            if (cx === void 0) { cx = 0; }
            if (cy === void 0) { cy = 0; }
            // Convert degrees to radians
            r = radians(r);
            var cos = Math.cos(r);
            var sin = Math.sin(r);
            var _e = this, a = _e.a, b = _e.b, c = _e.c, d = _e.d, e = _e.e, f = _e.f;
            this.a = a * cos - b * sin;
            this.b = b * cos + a * sin;
            this.c = c * cos - d * sin;
            this.d = d * cos + c * sin;
            this.e = e * cos - f * sin + cy * sin - cx * cos + cx;
            this.f = f * cos + e * sin - cx * sin - cy * cos + cy;
            return this;
        };
        // Scale matrix
        Matrix.prototype.scale = function () {
            var _e;
            return (_e = this.clone()).scaleO.apply(_e, arguments);
        };
        Matrix.prototype.scaleO = function (x, y, cx, cy) {
            if (y === void 0) { y = x; }
            if (cx === void 0) { cx = 0; }
            if (cy === void 0) { cy = 0; }
            // Support uniform scaling
            if (arguments.length === 3) {
                cy = cx;
                cx = y;
                y = x;
            }
            var _e = this, a = _e.a, b = _e.b, c = _e.c, d = _e.d, e = _e.e, f = _e.f;
            this.a = a * x;
            this.b = b * y;
            this.c = c * x;
            this.d = d * y;
            this.e = e * x - cx * x + cx;
            this.f = f * y - cy * y + cy;
            return this;
        };
        // Shear matrix
        Matrix.prototype.shear = function (a, cx, cy) {
            return this.clone().shearO(a, cx, cy);
        };
        // eslint-disable-next-line no-unused-vars
        Matrix.prototype.shearO = function (lx, cx, cy) {
            if (cx === void 0) { cx = 0; }
            if (cy === void 0) { cy = 0; }
            var _e = this, a = _e.a, b = _e.b, c = _e.c, d = _e.d, e = _e.e, f = _e.f;
            this.a = a + b * lx;
            this.c = c + d * lx;
            this.e = e + f * lx - cy * lx;
            return this;
        };
        // Skew Matrix
        Matrix.prototype.skew = function () {
            var _e;
            return (_e = this.clone()).skewO.apply(_e, arguments);
        };
        Matrix.prototype.skewO = function (x, y, cx, cy) {
            if (y === void 0) { y = x; }
            if (cx === void 0) { cx = 0; }
            if (cy === void 0) { cy = 0; }
            // support uniformal skew
            if (arguments.length === 3) {
                cy = cx;
                cx = y;
                y = x;
            }
            // Convert degrees to radians
            x = radians(x);
            y = radians(y);
            var lx = Math.tan(x);
            var ly = Math.tan(y);
            var _e = this, a = _e.a, b = _e.b, c = _e.c, d = _e.d, e = _e.e, f = _e.f;
            this.a = a + b * lx;
            this.b = b + a * ly;
            this.c = c + d * lx;
            this.d = d + c * ly;
            this.e = e + f * lx - cy * lx;
            this.f = f + e * ly - cx * ly;
            return this;
        };
        // SkewX
        Matrix.prototype.skewX = function (x, cx, cy) {
            return this.skew(x, 0, cx, cy);
        };
        // SkewY
        Matrix.prototype.skewY = function (y, cx, cy) {
            return this.skew(0, y, cx, cy);
        };
        Matrix.prototype.toArray = function () {
            return [this.a, this.b, this.c, this.d, this.e, this.f];
        };
        // Convert matrix to string
        Matrix.prototype.toString = function () {
            return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')';
        };
        // Transform a matrix into another matrix by manipulating the space
        Matrix.prototype.transform = function (o) {
            // Check if o is a matrix and then left multiply it directly
            if (Matrix.isMatrixLike(o)) {
                var matrix = new Matrix(o);
                return matrix.multiplyO(this);
            }
            // Get the proposed transformations and the current transformations
            var t = Matrix.formatTransforms(o);
            var current = this;
            var _e = new Point(t.ox, t.oy).transform(current), ox = _e.x, oy = _e.y;
            // Construct the resulting matrix
            var transformer = new Matrix().translateO(t.rx, t.ry).lmultiplyO(current).translateO(-ox, -oy).scaleO(t.scaleX, t.scaleY).skewO(t.skewX, t.skewY).shearO(t.shear).rotateO(t.theta).translateO(ox, oy);
            // If we want the origin at a particular place, we force it there
            if (isFinite(t.px) || isFinite(t.py)) {
                var origin_1 = new Point(ox, oy).transform(transformer);
                // TODO: Replace t.px with isFinite(t.px)
                // Doesn't work because t.px is also 0 if it wasn't passed
                var dx_1 = isFinite(t.px) ? t.px - origin_1.x : 0;
                var dy_1 = isFinite(t.py) ? t.py - origin_1.y : 0;
                transformer.translateO(dx_1, dy_1);
            }
            // Translate now after positioning
            transformer.translateO(t.tx, t.ty);
            return transformer;
        };
        // Translate matrix
        Matrix.prototype.translate = function (x, y) {
            return this.clone().translateO(x, y);
        };
        Matrix.prototype.translateO = function (x, y) {
            this.e += x || 0;
            this.f += y || 0;
            return this;
        };
        Matrix.prototype.valueOf = function () {
            return {
                a: this.a,
                b: this.b,
                c: this.c,
                d: this.d,
                e: this.e,
                f: this.f
            };
        };
        return Matrix;
    }());
    function ctm() {
        return new Matrix(this.node.getCTM());
    }
    function screenCTM() {
        try {
            /* https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
               This is needed because FF does not return the transformation matrix
               for the inner coordinate system when getScreenCTM() is called on nested svgs.
               However all other Browsers do that */
            if (typeof this.isRoot === 'function' && !this.isRoot()) {
                var rect = this.rect(1, 1);
                var m = rect.node.getScreenCTM();
                rect.remove();
                return new Matrix(m);
            }
            return new Matrix(this.node.getScreenCTM());
        }
        catch (e) {
            console.warn("Cannot get CTM from SVG node ".concat(this.node.nodeName, ". Is the element rendered?"));
            return new Matrix();
        }
    }
    register(Matrix, 'Matrix');
    function parser() {
        // Reuse cached element if possible
        if (!parser.nodes) {
            var svg_1 = makeInstance().size(2, 0);
            svg_1.node.style.cssText = ['opacity: 0', 'position: absolute', 'left: -100%', 'top: -100%', 'overflow: hidden'].join(';');
            svg_1.attr('focusable', 'false');
            svg_1.attr('aria-hidden', 'true');
            var path = svg_1.path().node;
            parser.nodes = {
                svg: svg_1,
                path: path
            };
        }
        if (!parser.nodes.svg.node.parentNode) {
            var b = globals.document.body || globals.document.documentElement;
            parser.nodes.svg.addTo(b);
        }
        return parser.nodes;
    }
    function isNulledBox(box) {
        return !box.width && !box.height && !box.x && !box.y;
    }
    function domContains(node) {
        return node === globals.document || (globals.document.documentElement.contains || function (node) {
            // This is IE - it does not support contains() for top-level SVGs
            while (node.parentNode) {
                node = node.parentNode;
            }
            return node === globals.document;
        }).call(globals.document.documentElement, node);
    }
    var Box = /** @class */ (function () {
        function Box() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.init.apply(this, args);
        }
        Box.prototype.addOffset = function () {
            // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
            this.x += globals.window.pageXOffset;
            this.y += globals.window.pageYOffset;
            return new Box(this);
        };
        Box.prototype.init = function (source) {
            var base = [0, 0, 0, 0];
            source = typeof source === 'string' ? source.split(delimiter).map(parseFloat) : Array.isArray(source) ? source : typeof source === 'object' ? [source.left != null ? source.left : source.x, source.top != null ? source.top : source.y, source.width, source.height] : arguments.length === 4 ? [].slice.call(arguments) : base;
            this.x = source[0] || 0;
            this.y = source[1] || 0;
            this.width = this.w = source[2] || 0;
            this.height = this.h = source[3] || 0;
            // Add more bounding box properties
            this.x2 = this.x + this.w;
            this.y2 = this.y + this.h;
            this.cx = this.x + this.w / 2;
            this.cy = this.y + this.h / 2;
            return this;
        };
        Box.prototype.isNulled = function () {
            return isNulledBox(this);
        };
        // Merge rect box with another, return a new instance
        Box.prototype.merge = function (box) {
            var x = Math.min(this.x, box.x);
            var y = Math.min(this.y, box.y);
            var width = Math.max(this.x + this.width, box.x + box.width) - x;
            var height = Math.max(this.y + this.height, box.y + box.height) - y;
            return new Box(x, y, width, height);
        };
        Box.prototype.toArray = function () {
            return [this.x, this.y, this.width, this.height];
        };
        Box.prototype.toString = function () {
            return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height;
        };
        Box.prototype.transform = function (m) {
            if (!(m instanceof Matrix)) {
                m = new Matrix(m);
            }
            var xMin = Infinity;
            var xMax = -Infinity;
            var yMin = Infinity;
            var yMax = -Infinity;
            var pts = [new Point(this.x, this.y), new Point(this.x2, this.y), new Point(this.x, this.y2), new Point(this.x2, this.y2)];
            pts.forEach(function (p) {
                p = p.transform(m);
                xMin = Math.min(xMin, p.x);
                xMax = Math.max(xMax, p.x);
                yMin = Math.min(yMin, p.y);
                yMax = Math.max(yMax, p.y);
            });
            return new Box(xMin, yMin, xMax - xMin, yMax - yMin);
        };
        return Box;
    }());
    function getBox(el, getBBoxFn, retry) {
        var box;
        try {
            // Try to get the box with the provided function
            box = getBBoxFn(el.node);
            // If the box is worthless and not even in the dom, retry
            // by throwing an error here...
            if (isNulledBox(box) && !domContains(el.node)) {
                throw new Error('Element not in the dom');
            }
        }
        catch (e) {
            // ... and calling the retry handler here
            box = retry(el);
        }
        return box;
    }
    function bbox() {
        // Function to get bbox is getBBox()
        var getBBox = function (node) { return node.getBBox(); };
        // Take all measures so that a stupid browser renders the element
        // so we can get the bbox from it when we try again
        var retry = function (el) {
            try {
                var clone = el.clone().addTo(parser().svg).show();
                var box_1 = clone.node.getBBox();
                clone.remove();
                return box_1;
            }
            catch (e) {
                // We give up...
                throw new Error("Getting bbox of element \"".concat(el.node.nodeName, "\" is not possible: ").concat(e.toString()));
            }
        };
        var box = getBox(this, getBBox, retry);
        var bbox = new Box(box);
        return bbox;
    }
    function rbox(el) {
        var getRBox = function (node) { return node.getBoundingClientRect(); };
        var retry = function (el) {
            // There is no point in trying tricks here because if we insert the element into the dom ourselves
            // it obviously will be at the wrong position
            throw new Error("Getting rbox of element \"".concat(el.node.nodeName, "\" is not possible"));
        };
        var box = getBox(this, getRBox, retry);
        var rbox = new Box(box);
        // If an element was passed, we want the bbox in the coordinate system of that element
        if (el) {
            return rbox.transform(el.screenCTM().inverseO());
        }
        // Else we want it in absolute screen coordinates
        // Therefore we need to add the scrollOffset
        return rbox.addOffset();
    }
    // Checks whether the given point is inside the bounding box
    function inside(x, y) {
        var box = this.bbox();
        return x > box.x && y > box.y && x < box.x + box.width && y < box.y + box.height;
    }
    registerMethods({
        viewbox: {
            viewbox: function (x, y, width, height) {
                // act as getter
                if (x == null)
                    return new Box(this.attr('viewBox'));
                // act as setter
                return this.attr('viewBox', new Box(x, y, width, height));
            },
            zoom: function (level, point) {
                // Its best to rely on the attributes here and here is why:
                // clientXYZ: Doesn't work on non-root svgs because they dont have a CSSBox (silly!)
                // getBoundingClientRect: Doesn't work because Chrome just ignores width and height of nested svgs completely
                //                        that means, their clientRect is always as big as the content.
                //                        Furthermore this size is incorrect if the element is further transformed by its parents
                // computedStyle: Only returns meaningful values if css was used with px. We dont go this route here!
                // getBBox: returns the bounding box of its content - that doesn't help!
                var _e = this.attr(['width', 'height']), width = _e.width, height = _e.height;
                // Width and height is a string when a number with a unit is present which we can't use
                // So we try clientXYZ
                if (!width && !height || typeof width === 'string' || typeof height === 'string') {
                    width = this.node.clientWidth;
                    height = this.node.clientHeight;
                }
                // Giving up...
                if (!width || !height) {
                    throw new Error('Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element');
                }
                var v = this.viewbox();
                var zoomX = width / v.width;
                var zoomY = height / v.height;
                var zoom = Math.min(zoomX, zoomY);
                if (level == null) {
                    return zoom;
                }
                var zoomAmount = zoom / level;
                // Set the zoomAmount to the highest value which is safe to process and recover from
                // The * 100 is a bit of wiggle room for the matrix transformation
                if (zoomAmount === Infinity)
                    zoomAmount = Number.MAX_SAFE_INTEGER / 100;
                point = point || new Point(width / 2 / zoomX + v.x, height / 2 / zoomY + v.y);
                var box = new Box(v).transform(new Matrix({
                    scale: zoomAmount,
                    origin: point
                }));
                return this.viewbox(box);
            }
        }
    });
    register(Box, 'Box');
    // import { subClassArray } from './ArrayPolyfill.js'
    var List = /** @class */ (function (_super) {
        __extends(List, _super);
        function List(arr) {
            if (arr === void 0) { arr = []; }
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _this_1 = _super.apply(this, __spreadArray([arr], args, false)) || this;
            if (typeof arr === 'number')
                return _this_1;
            _this_1.length = 0;
            _this_1.push.apply(_this_1, arr);
            return _this_1;
        }
        return List;
    }(Array));
    extend([List], {
        each: function (fnOrMethodName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (typeof fnOrMethodName === 'function') {
                return this.map(function (el, i, arr) {
                    return fnOrMethodName.call(el, el, i, arr);
                });
            }
            else {
                return this.map(function (el) {
                    return el[fnOrMethodName].apply(el, args);
                });
            }
        },
        toArray: function () {
            return Array.prototype.concat.apply([], this);
        }
    });
    var reserved = ['toArray', 'constructor', 'each'];
    List.extend = function (methods) {
        methods = methods.reduce(function (obj, name) {
            // Don't overwrite own methods
            if (reserved.includes(name))
                return obj;
            // Don't add private methods
            if (name[0] === '_')
                return obj;
            // Allow access to original Array methods through a prefix
            if (name in Array.prototype) {
                obj['$' + name] = Array.prototype[name];
            }
            // Relay every call to each()
            obj[name] = function () {
                var attrs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    attrs[_i] = arguments[_i];
                }
                return this.each.apply(this, __spreadArray([name], attrs, false));
            };
            return obj;
        }, {});
        extend([List], methods);
    };
    function baseFind(query, parent) {
        return new List(map((parent || globals.document).querySelectorAll(query), function (node) {
            return adopt(node);
        }));
    }
    // Scoped find method
    function find(query) {
        return baseFind(query, this.node);
    }
    function findOne(query) {
        return adopt(this.node.querySelector(query));
    }
    var listenerId = 0;
    var windowEvents = {};
    function getEvents(instance) {
        var n = instance.getEventHolder();
        // We dont want to save events in global space
        if (n === globals.window)
            n = windowEvents;
        if (!n.events)
            n.events = {};
        return n.events;
    }
    function getEventTarget(instance) {
        return instance.getEventTarget();
    }
    function clearEvents(instance) {
        var n = instance.getEventHolder();
        if (n === globals.window)
            n = windowEvents;
        if (n.events)
            n.events = {};
    }
    // Add event binder in the SVG namespace
    function on(node, events, listener, binding, options) {
        var l = listener.bind(binding || node);
        var instance = makeInstance(node);
        var bag = getEvents(instance);
        var n = getEventTarget(instance);
        // events can be an array of events or a string of events
        events = Array.isArray(events) ? events : events.split(delimiter);
        // add id to listener
        if (!listener._svgjsListenerId) {
            listener._svgjsListenerId = ++listenerId;
        }
        events.forEach(function (event) {
            var ev = event.split('.')[0];
            var ns = event.split('.')[1] || '*';
            // ensure valid object
            bag[ev] = bag[ev] || {};
            bag[ev][ns] = bag[ev][ns] || {};
            // reference listener
            bag[ev][ns][listener._svgjsListenerId] = l;
            // add listener
            n.addEventListener(ev, l, options || false);
        });
    }
    // Add event unbinder in the SVG namespace
    function off(node, events, listener, options) {
        var instance = makeInstance(node);
        var bag = getEvents(instance);
        var n = getEventTarget(instance);
        // listener can be a function or a number
        if (typeof listener === 'function') {
            listener = listener._svgjsListenerId;
            if (!listener)
                return;
        }
        // events can be an array of events or a string or undefined
        events = Array.isArray(events) ? events : (events || '').split(delimiter);
        events.forEach(function (event) {
            var ev = event && event.split('.')[0];
            var ns = event && event.split('.')[1];
            var namespace, l;
            if (listener) {
                // remove listener reference
                if (bag[ev] && bag[ev][ns || '*']) {
                    // removeListener
                    n.removeEventListener(ev, bag[ev][ns || '*'][listener], options || false);
                    delete bag[ev][ns || '*'][listener];
                }
            }
            else if (ev && ns) {
                // remove all listeners for a namespaced event
                if (bag[ev] && bag[ev][ns]) {
                    for (l in bag[ev][ns]) {
                        off(n, [ev, ns].join('.'), l);
                    }
                    delete bag[ev][ns];
                }
            }
            else if (ns) {
                // remove all listeners for a specific namespace
                for (event in bag) {
                    for (namespace in bag[event]) {
                        if (ns === namespace) {
                            off(n, [event, ns].join('.'));
                        }
                    }
                }
            }
            else if (ev) {
                // remove all listeners for the event
                if (bag[ev]) {
                    for (namespace in bag[ev]) {
                        off(n, [ev, namespace].join('.'));
                    }
                    delete bag[ev];
                }
            }
            else {
                // remove all listeners on a given node
                for (event in bag) {
                    off(n, event);
                }
                clearEvents(instance);
            }
        });
    }
    function dispatch(node, event, data, options) {
        var n = getEventTarget(node);
        // Dispatch event
        if (event instanceof globals.window.Event) {
            n.dispatchEvent(event);
        }
        else {
            event = new globals.window.CustomEvent(event, __assign({ detail: data, cancelable: true }, options));
            n.dispatchEvent(event);
        }
        return event;
    }
    var EventTarget = /** @class */ (function (_super) {
        __extends(EventTarget, _super);
        function EventTarget() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EventTarget.prototype.addEventListener = function () { };
        EventTarget.prototype.dispatch = function (event, data, options) {
            return dispatch(this, event, data, options);
        };
        EventTarget.prototype.dispatchEvent = function (event) {
            var bag = this.getEventHolder().events;
            if (!bag)
                return true;
            var events = bag[event.type];
            for (var i in events) {
                for (var j in events[i]) {
                    events[i][j](event);
                }
            }
            return !event.defaultPrevented;
        };
        // Fire given event
        EventTarget.prototype.fire = function (event, data, options) {
            this.dispatch(event, data, options);
            return this;
        };
        EventTarget.prototype.getEventHolder = function () {
            return this;
        };
        EventTarget.prototype.getEventTarget = function () {
            return this;
        };
        // Unbind event from listener
        EventTarget.prototype.off = function (event, listener, options) {
            off(this, event, listener, options);
            return this;
        };
        // Bind given event to listener
        EventTarget.prototype.on = function (event, listener, binding, options) {
            on(this, event, listener, binding, options);
            return this;
        };
        EventTarget.prototype.removeEventListener = function () { };
        return EventTarget;
    }(Base));
    register(EventTarget, 'EventTarget');
    function noop() { }
    // Default animation values
    var timeline = {
        duration: 400,
        ease: '>',
        delay: 0
    };
    // Default attribute values
    var attrs = {
        // fill and stroke
        'fill-opacity': 1,
        'stroke-opacity': 1,
        'stroke-width': 0,
        'stroke-linejoin': 'miter',
        'stroke-linecap': 'butt',
        fill: '#000000',
        stroke: '#000000',
        opacity: 1,
        // position
        x: 0,
        y: 0,
        cx: 0,
        cy: 0,
        // size
        width: 0,
        height: 0,
        // radius
        r: 0,
        rx: 0,
        ry: 0,
        // gradient
        offset: 0,
        'stop-opacity': 1,
        'stop-color': '#000000',
        // text
        'text-anchor': 'start'
    };
    var defaults = {
        __proto__: null,
        attrs: attrs,
        noop: noop,
        timeline: timeline
    };
    var SVGArray = /** @class */ (function (_super) {
        __extends(SVGArray, _super);
        function SVGArray() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this_1 = _super.apply(this, args) || this;
            _this_1.init.apply(_this_1, args);
            return _this_1;
        }
        SVGArray.prototype.clone = function () {
            return new this.constructor(this);
        };
        SVGArray.prototype.init = function (arr) {
            // This catches the case, that native map tries to create an array with new Array(1)
            if (typeof arr === 'number')
                return this;
            this.length = 0;
            this.push.apply(this, this.parse(arr));
            return this;
        };
        // Parse whitespace separated string
        SVGArray.prototype.parse = function (array) {
            if (array === void 0) { array = []; }
            // If already is an array, no need to parse it
            if (array instanceof Array)
                return array;
            return array.trim().split(delimiter).map(parseFloat);
        };
        SVGArray.prototype.toArray = function () {
            return Array.prototype.concat.apply([], this);
        };
        SVGArray.prototype.toSet = function () {
            return new Set(this);
        };
        SVGArray.prototype.toString = function () {
            return this.join(' ');
        };
        // Flattens the array if needed
        SVGArray.prototype.valueOf = function () {
            var ret = [];
            ret.push.apply(ret, this);
            return ret;
        };
        return SVGArray;
    }(Array));
    // Module for unit conversions
    var SVGNumber = /** @class */ (function () {
        // Initialize
        function SVGNumber() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.init.apply(this, args);
        }
        SVGNumber.prototype.convert = function (unit) {
            return new SVGNumber(this.value, unit);
        };
        // Divide number
        SVGNumber.prototype.divide = function (number) {
            number = new SVGNumber(number);
            return new SVGNumber(this / number, this.unit || number.unit);
        };
        SVGNumber.prototype.init = function (value, unit) {
            unit = Array.isArray(value) ? value[1] : unit;
            value = Array.isArray(value) ? value[0] : value;
            // initialize defaults
            this.value = 0;
            this.unit = unit || '';
            // parse value
            if (typeof value === 'number') {
                // ensure a valid numeric value
                this.value = isNaN(value) ? 0 : !isFinite(value) ? value < 0 ? -3.4e38 : +3.4e38 : value;
            }
            else if (typeof value === 'string') {
                unit = value.match(numberAndUnit);
                if (unit) {
                    // make value numeric
                    this.value = parseFloat(unit[1]);
                    // normalize
                    if (unit[5] === '%') {
                        this.value /= 100;
                    }
                    else if (unit[5] === 's') {
                        this.value *= 1000;
                    }
                    // store unit
                    this.unit = unit[5];
                }
            }
            else {
                if (value instanceof SVGNumber) {
                    this.value = value.valueOf();
                    this.unit = value.unit;
                }
            }
            return this;
        };
        // Subtract number
        SVGNumber.prototype.minus = function (number) {
            number = new SVGNumber(number);
            return new SVGNumber(this - number, this.unit || number.unit);
        };
        // Add number
        SVGNumber.prototype.plus = function (number) {
            number = new SVGNumber(number);
            return new SVGNumber(this + number, this.unit || number.unit);
        };
        // Multiply number
        SVGNumber.prototype.times = function (number) {
            number = new SVGNumber(number);
            return new SVGNumber(this * number, this.unit || number.unit);
        };
        SVGNumber.prototype.toArray = function () {
            return [this.value, this.unit];
        };
        SVGNumber.prototype.toJSON = function () {
            return this.toString();
        };
        SVGNumber.prototype.toString = function () {
            return (this.unit === '%' ? ~~(this.value * 1e8) / 1e6 : this.unit === 's' ? this.value / 1e3 : this.value) + this.unit;
        };
        SVGNumber.prototype.valueOf = function () {
            return this.value;
        };
        return SVGNumber;
    }());
    var colorAttributes = new Set(['fill', 'stroke', 'color', 'bgcolor', 'stop-color', 'flood-color', 'lighting-color']);
    var hooks = [];
    function registerAttrHook(fn) {
        hooks.push(fn);
    }
    // Set svg element attribute
    function attr(attr, val, ns) {
        var _this_1 = this;
        // act as full getter
        if (attr == null) {
            // get an object of attributes
            attr = {};
            val = this.node.attributes;
            for (var _i = 0, val_1 = val; _i < val_1.length; _i++) {
                var node = val_1[_i];
                attr[node.nodeName] = isNumber.test(node.nodeValue) ? parseFloat(node.nodeValue) : node.nodeValue;
            }
            return attr;
        }
        else if (attr instanceof Array) {
            // loop through array and get all values
            return attr.reduce(function (last, curr) {
                last[curr] = _this_1.attr(curr);
                return last;
            }, {});
        }
        else if (typeof attr === 'object' && attr.constructor === Object) {
            // apply every attribute individually if an object is passed
            for (val in attr)
                this.attr(val, attr[val]);
        }
        else if (val === null) {
            // remove value
            this.node.removeAttribute(attr);
        }
        else if (val == null) {
            // act as a getter if the first and only argument is not an object
            val = this.node.getAttribute(attr);
            return val == null ? attrs[attr] : isNumber.test(val) ? parseFloat(val) : val;
        }
        else {
            // Loop through hooks and execute them to convert value
            val = hooks.reduce(function (_val, hook) {
                return hook(attr, _val, _this_1);
            }, val);
            // ensure correct numeric values (also accepts NaN and Infinity)
            if (typeof val === 'number') {
                val = new SVGNumber(val);
            }
            else if (colorAttributes.has(attr) && Color.isColor(val)) {
                // ensure full hex color
                val = new Color(val);
            }
            else if (val.constructor === Array) {
                // Check for plain arrays and parse array values
                val = new SVGArray(val);
            }
            // if the passed attribute is leading...
            if (attr === 'leading') {
                // ... call the leading method instead
                if (this.leading) {
                    this.leading(val);
                }
            }
            else {
                // set given attribute on node
                typeof ns === 'string' ? this.node.setAttributeNS(ns, attr, val.toString()) : this.node.setAttribute(attr, val.toString());
            }
            // rebuild if required
            if (this.rebuild && (attr === 'font-size' || attr === 'x')) {
                this.rebuild();
            }
        }
        return this;
    }
    var Dom = /** @class */ (function (_super) {
        __extends(Dom, _super);
        function Dom(node, attrs) {
            var _this_1 = _super.call(this) || this;
            _this_1.node = node;
            _this_1.type = node.nodeName;
            if (attrs && node !== attrs) {
                _this_1.attr(attrs);
            }
            return _this_1;
        }
        // Add given element at a position
        Dom.prototype.add = function (element, i) {
            element = makeInstance(element);
            // If non-root svg nodes are added we have to remove their namespaces
            if (element.removeNamespace && this.node instanceof globals.window.SVGElement) {
                element.removeNamespace();
            }
            if (i == null) {
                this.node.appendChild(element.node);
            }
            else if (element.node !== this.node.childNodes[i]) {
                this.node.insertBefore(element.node, this.node.childNodes[i]);
            }
            return this;
        };
        // Add element to given container and return self
        Dom.prototype.addTo = function (parent, i) {
            return makeInstance(parent).put(this, i);
        };
        // Returns all child elements
        Dom.prototype.children = function () {
            return new List(map(this.node.children, function (node) {
                return adopt(node);
            }));
        };
        // Remove all elements in this container
        Dom.prototype.clear = function () {
            // remove children
            while (this.node.hasChildNodes()) {
                this.node.removeChild(this.node.lastChild);
            }
            return this;
        };
        // Clone element
        Dom.prototype.clone = function (deep, assignNewIds) {
            if (deep === void 0) { deep = true; }
            if (assignNewIds === void 0) { assignNewIds = true; }
            // write dom data to the dom so the clone can pickup the data
            this.writeDataToDom();
            // clone element
            var nodeClone = this.node.cloneNode(deep);
            if (assignNewIds) {
                // assign new id
                nodeClone = assignNewId(nodeClone);
            }
            return new this.constructor(nodeClone);
        };
        // Iterates over all children and invokes a given block
        Dom.prototype.each = function (block, deep) {
            var children = this.children();
            var i, il;
            for (i = 0, il = children.length; i < il; i++) {
                block.apply(children[i], [i, children]);
                if (deep) {
                    children[i].each(block, deep);
                }
            }
            return this;
        };
        Dom.prototype.element = function (nodeName, attrs) {
            return this.put(new Dom(create(nodeName), attrs));
        };
        // Get first child
        Dom.prototype.first = function () {
            return adopt(this.node.firstChild);
        };
        // Get a element at the given index
        Dom.prototype.get = function (i) {
            return adopt(this.node.childNodes[i]);
        };
        Dom.prototype.getEventHolder = function () {
            return this.node;
        };
        Dom.prototype.getEventTarget = function () {
            return this.node;
        };
        // Checks if the given element is a child
        Dom.prototype.has = function (element) {
            return this.index(element) >= 0;
        };
        Dom.prototype.html = function (htmlOrFn, outerHTML) {
            return this.xml(htmlOrFn, outerHTML, html);
        };
        // Get / set id
        Dom.prototype.id = function (id) {
            // generate new id if no id set
            if (typeof id === 'undefined' && !this.node.id) {
                this.node.id = eid(this.type);
            }
            // don't set directly with this.node.id to make `null` work correctly
            return this.attr('id', id);
        };
        // Gets index of given element
        Dom.prototype.index = function (element) {
            return [].slice.call(this.node.childNodes).indexOf(element.node);
        };
        // Get the last child
        Dom.prototype.last = function () {
            return adopt(this.node.lastChild);
        };
        // matches the element vs a css selector
        Dom.prototype.matches = function (selector) {
            var el = this.node;
            var matcher = el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector || null;
            return matcher && matcher.call(el, selector);
        };
        // Returns the parent element instance
        Dom.prototype.parent = function (type) {
            var parent = this;
            // check for parent
            if (!parent.node.parentNode)
                return null;
            // get parent element
            parent = adopt(parent.node.parentNode);
            if (!type)
                return parent;
            // loop through ancestors if type is given
            do {
                if (typeof type === 'string' ? parent.matches(type) : parent instanceof type)
                    return parent;
            } while (parent = adopt(parent.node.parentNode));
            return parent;
        };
        // Basically does the same as `add()` but returns the added element instead
        Dom.prototype.put = function (element, i) {
            element = makeInstance(element);
            this.add(element, i);
            return element;
        };
        // Add element to given container and return container
        Dom.prototype.putIn = function (parent, i) {
            return makeInstance(parent).add(this, i);
        };
        // Remove element
        Dom.prototype.remove = function () {
            if (this.parent()) {
                this.parent().removeElement(this);
            }
            return this;
        };
        // Remove a given child
        Dom.prototype.removeElement = function (element) {
            this.node.removeChild(element.node);
            return this;
        };
        // Replace this with element
        Dom.prototype.replace = function (element) {
            element = makeInstance(element);
            if (this.node.parentNode) {
                this.node.parentNode.replaceChild(element.node, this.node);
            }
            return element;
        };
        Dom.prototype.round = function (precision, map) {
            if (precision === void 0) { precision = 2; }
            if (map === void 0) { map = null; }
            var factor = Math.pow(10, precision);
            var attrs = this.attr(map);
            for (var i in attrs) {
                if (typeof attrs[i] === 'number') {
                    attrs[i] = Math.round(attrs[i] * factor) / factor;
                }
            }
            this.attr(attrs);
            return this;
        };
        // Import / Export raw svg
        Dom.prototype.svg = function (svgOrFn, outerSVG) {
            return this.xml(svgOrFn, outerSVG, svg);
        };
        // Return id on string conversion
        Dom.prototype.toString = function () {
            return this.id();
        };
        Dom.prototype.words = function (text) {
            // This is faster than removing all children and adding a new one
            this.node.textContent = text;
            return this;
        };
        Dom.prototype.wrap = function (node) {
            var parent = this.parent();
            if (!parent) {
                return this.addTo(node);
            }
            var position = parent.index(this);
            return parent.put(node, position).put(this);
        };
        // write svgjs data to the dom
        Dom.prototype.writeDataToDom = function () {
            // dump variables recursively
            this.each(function () {
                this.writeDataToDom();
            });
            return this;
        };
        // Import / Export raw svg
        Dom.prototype.xml = function (xmlOrFn, outerXML, ns) {
            if (typeof xmlOrFn === 'boolean') {
                ns = outerXML;
                outerXML = xmlOrFn;
                xmlOrFn = null;
            }
            // act as getter if no svg string is given
            if (xmlOrFn == null || typeof xmlOrFn === 'function') {
                // The default for exports is, that the outerNode is included
                outerXML = outerXML == null ? true : outerXML;
                // write svgjs data to the dom
                this.writeDataToDom();
                var current = this;
                // An export modifier was passed
                if (xmlOrFn != null) {
                    current = adopt(current.node.cloneNode(true));
                    // If the user wants outerHTML we need to process this node, too
                    if (outerXML) {
                        var result = xmlOrFn(current);
                        current = result || current;
                        // The user does not want this node? Well, then he gets nothing
                        if (result === false)
                            return '';
                    }
                    // Deep loop through all children and apply modifier
                    current.each(function () {
                        var result = xmlOrFn(this);
                        var _this = result || this;
                        // If modifier returns false, discard node
                        if (result === false) {
                            this.remove();
                            // If modifier returns new node, use it
                        }
                        else if (result && this !== _this) {
                            this.replace(_this);
                        }
                    }, true);
                }
                // Return outer or inner content
                return outerXML ? current.node.outerHTML : current.node.innerHTML;
            }
            // Act as setter if we got a string
            // The default for import is, that the current node is not replaced
            outerXML = outerXML == null ? false : outerXML;
            // Create temporary holder
            var well = create('wrapper', ns);
            var fragment = globals.document.createDocumentFragment();
            // Dump raw svg
            well.innerHTML = xmlOrFn;
            // Transplant nodes into the fragment
            for (var len = well.children.length; len--;) {
                fragment.appendChild(well.firstElementChild);
            }
            var parent = this.parent();
            // Add the whole fragment at once
            return outerXML ? this.replace(fragment) && parent : this.add(fragment);
        };
        return Dom;
    }(EventTarget));
    extend(Dom, {
        attr: attr,
        find: find,
        findOne: findOne
    });
    register(Dom, 'Dom');
    var Element = /** @class */ (function (_super) {
        __extends(Element, _super);
        function Element(node, attrs) {
            var _e, _f;
            var _this_1 = _super.call(this, node, attrs) || this;
            // initialize data object
            _this_1.dom = {};
            // create circular reference
            _this_1.node.instance = _this_1;
            if (node.hasAttribute('data-svgjs') || node.hasAttribute('svgjs:data')) {
                // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
                _this_1.setData((_f = (_e = JSON.parse(node.getAttribute('data-svgjs'))) !== null && _e !== void 0 ? _e : JSON.parse(node.getAttribute('svgjs:data'))) !== null && _f !== void 0 ? _f : {});
            }
            return _this_1;
        }
        // Move element by its center
        Element.prototype.center = function (x, y) {
            return this.cx(x).cy(y);
        };
        // Move by center over x-axis
        Element.prototype.cx = function (x) {
            return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2);
        };
        // Move by center over y-axis
        Element.prototype.cy = function (y) {
            return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2);
        };
        // Get defs
        Element.prototype.defs = function () {
            var root = this.root();
            return root && root.defs();
        };
        // Relative move over x and y axes
        Element.prototype.dmove = function (x, y) {
            return this.dx(x).dy(y);
        };
        // Relative move over x axis
        Element.prototype.dx = function (x) {
            if (x === void 0) { x = 0; }
            return this.x(new SVGNumber(x).plus(this.x()));
        };
        // Relative move over y axis
        Element.prototype.dy = function (y) {
            if (y === void 0) { y = 0; }
            return this.y(new SVGNumber(y).plus(this.y()));
        };
        Element.prototype.getEventHolder = function () {
            return this;
        };
        // Set height of element
        Element.prototype.height = function (height) {
            return this.attr('height', height);
        };
        // Move element to given x and y values
        Element.prototype.move = function (x, y) {
            return this.x(x).y(y);
        };
        // return array of all ancestors of given type up to the root svg
        Element.prototype.parents = function (until) {
            if (until === void 0) { until = this.root(); }
            var isSelector = typeof until === 'string';
            if (!isSelector) {
                until = makeInstance(until);
            }
            var parents = new List();
            var parent = this;
            while ((parent = parent.parent()) && parent.node !== globals.document && parent.nodeName !== '#document-fragment') {
                parents.push(parent);
                if (!isSelector && parent.node === until.node) {
                    break;
                }
                if (isSelector && parent.matches(until)) {
                    break;
                }
                if (parent.node === this.root().node) {
                    // We worked our way to the root and didn't match `until`
                    return null;
                }
            }
            return parents;
        };
        // Get referenced element form attribute value
        Element.prototype.reference = function (attr) {
            attr = this.attr(attr);
            if (!attr)
                return null;
            var m = (attr + '').match(reference);
            return m ? makeInstance(m[1]) : null;
        };
        // Get parent document
        Element.prototype.root = function () {
            var p = this.parent(getClass(root));
            return p && p.root();
        };
        // set given data to the elements data property
        Element.prototype.setData = function (o) {
            this.dom = o;
            return this;
        };
        // Set element size to given width and height
        Element.prototype.size = function (width, height) {
            var p = proportionalSize(this, width, height);
            return this.width(new SVGNumber(p.width)).height(new SVGNumber(p.height));
        };
        // Set width of element
        Element.prototype.width = function (width) {
            return this.attr('width', width);
        };
        // write svgjs data to the dom
        Element.prototype.writeDataToDom = function () {
            writeDataToDom(this, this.dom);
            return _super.prototype.writeDataToDom.call(this);
        };
        // Move over x-axis
        Element.prototype.x = function (x) {
            return this.attr('x', x);
        };
        // Move over y-axis
        Element.prototype.y = function (y) {
            return this.attr('y', y);
        };
        return Element;
    }(Dom));
    extend(Element, {
        bbox: bbox,
        rbox: rbox,
        inside: inside,
        point: point,
        ctm: ctm,
        screenCTM: screenCTM
    });
    register(Element, 'Element');
    // Define list of available attributes for stroke and fill
    var sugar = {
        stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset'],
        fill: ['color', 'opacity', 'rule'],
        prefix: function (t, a) {
            return a === 'color' ? t : t + '-' + a;
        }
    };
    ['fill', 'stroke'].forEach(function (m) {
        var extension = {};
        var i;
        extension[m] = function (o) {
            if (typeof o === 'undefined') {
                return this.attr(m);
            }
            if (typeof o === 'string' || o instanceof Color || Color.isRgb(o) || o instanceof Element) {
                this.attr(m, o);
            }
            else {
                // set all attributes from sugar.fill and sugar.stroke list
                for (i = sugar[m].length - 1; i >= 0; i--) {
                    if (o[sugar[m][i]] != null) {
                        this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]]);
                    }
                }
            }
            return this;
        };
        registerMethods(['Element', 'Runner'], extension);
    });
    registerMethods(['Element', 'Runner'], {
        // Let the user set the matrix directly
        matrix: function (mat, b, c, d, e, f) {
            // Act as a getter
            if (mat == null) {
                return new Matrix(this);
            }
            // Act as a setter, the user can pass a matrix or a set of numbers
            return this.attr('transform', new Matrix(mat, b, c, d, e, f));
        },
        // Map rotation to transform
        rotate: function (angle, cx, cy) {
            return this.transform({
                rotate: angle,
                ox: cx,
                oy: cy
            }, true);
        },
        // Map skew to transform
        skew: function (x, y, cx, cy) {
            return arguments.length === 1 || arguments.length === 3 ? this.transform({
                skew: x,
                ox: y,
                oy: cx
            }, true) : this.transform({
                skew: [x, y],
                ox: cx,
                oy: cy
            }, true);
        },
        shear: function (lam, cx, cy) {
            return this.transform({
                shear: lam,
                ox: cx,
                oy: cy
            }, true);
        },
        // Map scale to transform
        scale: function (x, y, cx, cy) {
            return arguments.length === 1 || arguments.length === 3 ? this.transform({
                scale: x,
                ox: y,
                oy: cx
            }, true) : this.transform({
                scale: [x, y],
                ox: cx,
                oy: cy
            }, true);
        },
        // Map translate to transform
        translate: function (x, y) {
            return this.transform({
                translate: [x, y]
            }, true);
        },
        // Map relative translations to transform
        relative: function (x, y) {
            return this.transform({
                relative: [x, y]
            }, true);
        },
        // Map flip to transform
        flip: function (direction, origin) {
            if (direction === void 0) { direction = 'both'; }
            if (origin === void 0) { origin = 'center'; }
            if ('xybothtrue'.indexOf(direction) === -1) {
                origin = direction;
                direction = 'both';
            }
            return this.transform({
                flip: direction,
                origin: origin
            }, true);
        },
        // Opacity
        opacity: function (value) {
            return this.attr('opacity', value);
        }
    });
    registerMethods('radius', {
        // Add x and y radius
        radius: function (x, y) {
            if (y === void 0) { y = x; }
            var type = (this._element || this).type;
            return type === 'radialGradient' ? this.attr('r', new SVGNumber(x)) : this.rx(x).ry(y);
        }
    });
    registerMethods('Path', {
        // Get path length
        length: function () {
            return this.node.getTotalLength();
        },
        // Get point at length
        pointAt: function (length) {
            return new Point(this.node.getPointAtLength(length));
        }
    });
    registerMethods(['Element', 'Runner'], {
        // Set font
        font: function (a, v) {
            if (typeof a === 'object') {
                for (v in a)
                    this.font(v, a[v]);
                return this;
            }
            return a === 'leading' ? this.leading(v) : a === 'anchor' ? this.attr('text-anchor', v) : a === 'size' || a === 'family' || a === 'weight' || a === 'stretch' || a === 'variant' || a === 'style' ? this.attr('font-' + a, v) : this.attr(a, v);
        }
    });
    // Add events to elements
    var methods = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'mouseenter', 'mouseleave', 'touchstart', 'touchmove', 'touchleave', 'touchend', 'touchcancel', 'contextmenu', 'wheel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel'].reduce(function (last, event) {
        // add event to Element
        var fn = function (f) {
            if (f === null) {
                this.off(event);
            }
            else {
                this.on(event, f);
            }
            return this;
        };
        last[event] = fn;
        return last;
    }, {});
    registerMethods('Element', methods);
    // Reset all transformations
    function untransform() {
        return this.attr('transform', null);
    }
    // merge the whole transformation chain into one matrix and returns it
    function matrixify() {
        var matrix = (this.attr('transform') || ''
        // split transformations
        ).split(transforms).slice(0, -1).map(function (str) {
            // generate key => value pairs
            var kv = str.trim().split('(');
            return [kv[0], kv[1].split(delimiter).map(function (str) {
                    return parseFloat(str);
                })];
        }).reverse()
            // merge every transformation into one matrix
            .reduce(function (matrix, transform) {
            if (transform[0] === 'matrix') {
                return matrix.lmultiply(Matrix.fromArray(transform[1]));
            }
            return matrix[transform[0]].apply(matrix, transform[1]);
        }, new Matrix());
        return matrix;
    }
    // add an element to another parent without changing the visual representation on the screen
    function toParent(parent, i) {
        if (this === parent)
            return this;
        if (isDescriptive(this.node))
            return this.addTo(parent, i);
        var ctm = this.screenCTM();
        var pCtm = parent.screenCTM().inverse();
        this.addTo(parent, i).untransform().transform(pCtm.multiply(ctm));
        return this;
    }
    // same as above with parent equals root-svg
    function toRoot(i) {
        return this.toParent(this.root(), i);
    }
    // Add transformations
    function transform(o, relative) {
        // Act as a getter if no object was passed
        if (o == null || typeof o === 'string') {
            var decomposed = new Matrix(this).decompose();
            return o == null ? decomposed : decomposed[o];
        }
        if (!Matrix.isMatrixLike(o)) {
            // Set the origin according to the defined transform
            o = __assign(__assign({}, o), { origin: getOrigin(o, this) });
        }
        // The user can pass a boolean, an Element or an Matrix or nothing
        var cleanRelative = relative === true ? this : relative || false;
        var result = new Matrix(cleanRelative).transform(o);
        return this.attr('transform', result);
    }
    registerMethods('Element', {
        untransform: untransform,
        matrixify: matrixify,
        toParent: toParent,
        toRoot: toRoot,
        transform: transform
    });
    var Container = /** @class */ (function (_super) {
        __extends(Container, _super);
        function Container() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Container.prototype.flatten = function () {
            this.each(function () {
                if (this instanceof Container) {
                    return this.flatten().ungroup();
                }
            });
            return this;
        };
        Container.prototype.ungroup = function (parent, index) {
            if (parent === void 0) { parent = this.parent(); }
            if (index === void 0) { index = parent.index(this); }
            // when parent != this, we want append all elements to the end
            index = index === -1 ? parent.children().length : index;
            this.each(function (i, children) {
                // reverse each
                return children[children.length - i - 1].toParent(parent, index);
            });
            return this.remove();
        };
        return Container;
    }(Element));
    register(Container, 'Container');
    var Defs = /** @class */ (function (_super) {
        __extends(Defs, _super);
        function Defs(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('defs', node), attrs) || this;
        }
        Defs.prototype.flatten = function () {
            return this;
        };
        Defs.prototype.ungroup = function () {
            return this;
        };
        return Defs;
    }(Container));
    register(Defs, 'Defs');
    var Shape = /** @class */ (function (_super) {
        __extends(Shape, _super);
        function Shape() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Shape;
    }(Element));
    register(Shape, 'Shape');
    // Radius x value
    function rx(rx) {
        return this.attr('rx', rx);
    }
    // Radius y value
    function ry(ry) {
        return this.attr('ry', ry);
    }
    // Move over x-axis
    function x$3(x) {
        return x == null ? this.cx() - this.rx() : this.cx(x + this.rx());
    }
    // Move over y-axis
    function y$3(y) {
        return y == null ? this.cy() - this.ry() : this.cy(y + this.ry());
    }
    // Move by center over x-axis
    function cx$1(x) {
        return this.attr('cx', x);
    }
    // Move by center over y-axis
    function cy$1(y) {
        return this.attr('cy', y);
    }
    // Set width of element
    function width$2(width) {
        return width == null ? this.rx() * 2 : this.rx(new SVGNumber(width).divide(2));
    }
    // Set height of element
    function height$2(height) {
        return height == null ? this.ry() * 2 : this.ry(new SVGNumber(height).divide(2));
    }
    var circled = {
        __proto__: null,
        cx: cx$1,
        cy: cy$1,
        height: height$2,
        rx: rx,
        ry: ry,
        width: width$2,
        x: x$3,
        y: y$3
    };
    var Ellipse = /** @class */ (function (_super) {
        __extends(Ellipse, _super);
        function Ellipse(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('ellipse', node), attrs) || this;
        }
        Ellipse.prototype.size = function (width, height) {
            var p = proportionalSize(this, width, height);
            return this.rx(new SVGNumber(p.width).divide(2)).ry(new SVGNumber(p.height).divide(2));
        };
        return Ellipse;
    }(Shape));
    extend(Ellipse, circled);
    registerMethods('Container', {
        // Create an ellipse
        ellipse: wrapWithAttrCheck(function (width, height) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = width; }
            return this.put(new Ellipse()).size(width, height).move(0, 0);
        })
    });
    register(Ellipse, 'Ellipse');
    var Fragment = /** @class */ (function (_super) {
        __extends(Fragment, _super);
        function Fragment(node) {
            if (node === void 0) { node = globals.document.createDocumentFragment(); }
            return _super.call(this, node) || this;
        }
        // Import / Export raw xml
        Fragment.prototype.xml = function (xmlOrFn, outerXML, ns) {
            if (typeof xmlOrFn === 'boolean') {
                ns = outerXML;
                outerXML = xmlOrFn;
                xmlOrFn = null;
            }
            // because this is a fragment we have to put all elements into a wrapper first
            // before we can get the innerXML from it
            if (xmlOrFn == null || typeof xmlOrFn === 'function') {
                var wrapper = new Dom(create('wrapper', ns));
                wrapper.add(this.node.cloneNode(true));
                return wrapper.xml(false, ns);
            }
            // Act as setter if we got a string
            return _super.prototype.xml.call(this, xmlOrFn, false, ns);
        };
        return Fragment;
    }(Dom));
    register(Fragment, 'Fragment');
    function from(x, y) {
        return (this._element || this).type === 'radialGradient' ? this.attr({
            fx: new SVGNumber(x),
            fy: new SVGNumber(y)
        }) : this.attr({
            x1: new SVGNumber(x),
            y1: new SVGNumber(y)
        });
    }
    function to(x, y) {
        return (this._element || this).type === 'radialGradient' ? this.attr({
            cx: new SVGNumber(x),
            cy: new SVGNumber(y)
        }) : this.attr({
            x2: new SVGNumber(x),
            y2: new SVGNumber(y)
        });
    }
    var gradiented = {
        __proto__: null,
        from: from,
        to: to
    };
    var Gradient = /** @class */ (function (_super) {
        __extends(Gradient, _super);
        function Gradient(type, attrs) {
            return _super.call(this, nodeOrNew(type + 'Gradient', typeof type === 'string' ? null : type), attrs) || this;
        }
        // custom attr to handle transform
        Gradient.prototype.attr = function (a, b, c) {
            if (a === 'transform')
                a = 'gradientTransform';
            return _super.prototype.attr.call(this, a, b, c);
        };
        Gradient.prototype.bbox = function () {
            return new Box();
        };
        Gradient.prototype.targets = function () {
            return baseFind('svg [fill*=' + this.id() + ']');
        };
        // Alias string conversion to fill
        Gradient.prototype.toString = function () {
            return this.url();
        };
        // Update gradient
        Gradient.prototype.update = function (block) {
            // remove all stops
            this.clear();
            // invoke passed block
            if (typeof block === 'function') {
                block.call(this, this);
            }
            return this;
        };
        // Return the fill id
        Gradient.prototype.url = function () {
            return 'url(#' + this.id() + ')';
        };
        return Gradient;
    }(Container));
    extend(Gradient, gradiented);
    registerMethods({
        Container: {
            // Create gradient element in defs
            gradient: function () {
                var _e;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_e = this.defs()).gradient.apply(_e, args);
            }
        },
        // define gradient
        Defs: {
            gradient: wrapWithAttrCheck(function (type, block) {
                return this.put(new Gradient(type)).update(block);
            })
        }
    });
    register(Gradient, 'Gradient');
    var Pattern = /** @class */ (function (_super) {
        __extends(Pattern, _super);
        // Initialize node
        function Pattern(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('pattern', node), attrs) || this;
        }
        // custom attr to handle transform
        Pattern.prototype.attr = function (a, b, c) {
            if (a === 'transform')
                a = 'patternTransform';
            return _super.prototype.attr.call(this, a, b, c);
        };
        Pattern.prototype.bbox = function () {
            return new Box();
        };
        Pattern.prototype.targets = function () {
            return baseFind('svg [fill*=' + this.id() + ']');
        };
        // Alias string conversion to fill
        Pattern.prototype.toString = function () {
            return this.url();
        };
        // Update pattern by rebuilding
        Pattern.prototype.update = function (block) {
            // remove content
            this.clear();
            // invoke passed block
            if (typeof block === 'function') {
                block.call(this, this);
            }
            return this;
        };
        // Return the fill id
        Pattern.prototype.url = function () {
            return 'url(#' + this.id() + ')';
        };
        return Pattern;
    }(Container));
    registerMethods({
        Container: {
            // Create pattern element in defs
            pattern: function () {
                var _e;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_e = this.defs()).pattern.apply(_e, args);
            }
        },
        Defs: {
            pattern: wrapWithAttrCheck(function (width, height, block) {
                return this.put(new Pattern()).update(block).attr({
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    patternUnits: 'userSpaceOnUse'
                });
            })
        }
    });
    register(Pattern, 'Pattern');
    var Image = /** @class */ (function (_super) {
        __extends(Image, _super);
        function Image(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('image', node), attrs) || this;
        }
        // (re)load image
        Image.prototype.load = function (url, callback) {
            if (!url)
                return this;
            var img = new globals.window.Image();
            on(img, 'load', function (e) {
                var p = this.parent(Pattern);
                // ensure image size
                if (this.width() === 0 && this.height() === 0) {
                    this.size(img.width, img.height);
                }
                if (p instanceof Pattern) {
                    // ensure pattern size if not set
                    if (p.width() === 0 && p.height() === 0) {
                        p.size(this.width(), this.height());
                    }
                }
                if (typeof callback === 'function') {
                    callback.call(this, e);
                }
            }, this);
            on(img, 'load error', function () {
                // dont forget to unbind memory leaking events
                off(img);
            });
            return this.attr('href', img.src = url, xlink);
        };
        return Image;
    }(Shape));
    registerAttrHook(function (attr, val, _this) {
        // convert image fill and stroke to patterns
        if (attr === 'fill' || attr === 'stroke') {
            if (isImage.test(val)) {
                val = _this.root().defs().image(val);
            }
        }
        if (val instanceof Image) {
            val = _this.root().defs().pattern(0, 0, function (pattern) {
                pattern.add(val);
            });
        }
        return val;
    });
    registerMethods({
        Container: {
            // create image element, load image and set its size
            image: wrapWithAttrCheck(function (source, callback) {
                return this.put(new Image()).size(0, 0).load(source, callback);
            })
        }
    });
    register(Image, 'Image');
    var PointArray = /** @class */ (function (_super) {
        __extends(PointArray, _super);
        function PointArray() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // Get bounding box of points
        PointArray.prototype.bbox = function () {
            var maxX = -Infinity;
            var maxY = -Infinity;
            var minX = Infinity;
            var minY = Infinity;
            this.forEach(function (el) {
                maxX = Math.max(el[0], maxX);
                maxY = Math.max(el[1], maxY);
                minX = Math.min(el[0], minX);
                minY = Math.min(el[1], minY);
            });
            return new Box(minX, minY, maxX - minX, maxY - minY);
        };
        // Move point string
        PointArray.prototype.move = function (x, y) {
            var box = this.bbox();
            // get relative offset
            x -= box.x;
            y -= box.y;
            // move every point
            if (!isNaN(x) && !isNaN(y)) {
                for (var i = this.length - 1; i >= 0; i--) {
                    this[i] = [this[i][0] + x, this[i][1] + y];
                }
            }
            return this;
        };
        // Parse point string and flat array
        PointArray.prototype.parse = function (array) {
            if (array === void 0) { array = [0, 0]; }
            var points = [];
            // if it is an array, we flatten it and therefore clone it to 1 depths
            if (array instanceof Array) {
                array = Array.prototype.concat.apply([], array);
            }
            else {
                // Else, it is considered as a string
                // parse points
                array = array.trim().split(delimiter).map(parseFloat);
            }
            // validate points - https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
            // Odd number of coordinates is an error. In such cases, drop the last odd coordinate.
            if (array.length % 2 !== 0)
                array.pop();
            // wrap points in two-tuples
            for (var i = 0, len = array.length; i < len; i = i + 2) {
                points.push([array[i], array[i + 1]]);
            }
            return points;
        };
        // Resize poly string
        PointArray.prototype.size = function (width, height) {
            var i;
            var box = this.bbox();
            // recalculate position of all points according to new size
            for (i = this.length - 1; i >= 0; i--) {
                if (box.width)
                    this[i][0] = (this[i][0] - box.x) * width / box.width + box.x;
                if (box.height)
                    this[i][1] = (this[i][1] - box.y) * height / box.height + box.y;
            }
            return this;
        };
        // Convert array to line object
        PointArray.prototype.toLine = function () {
            return {
                x1: this[0][0],
                y1: this[0][1],
                x2: this[1][0],
                y2: this[1][1]
            };
        };
        // Convert array to string
        PointArray.prototype.toString = function () {
            var array = [];
            // convert to a poly point string
            for (var i = 0, il = this.length; i < il; i++) {
                array.push(this[i].join(','));
            }
            return array.join(' ');
        };
        PointArray.prototype.transform = function (m) {
            return this.clone().transformO(m);
        };
        // transform points with matrix (similar to Point.transform)
        PointArray.prototype.transformO = function (m) {
            if (!Matrix.isMatrixLike(m)) {
                m = new Matrix(m);
            }
            for (var i = this.length; i--;) {
                // Perform the matrix multiplication
                var _e = this[i], x_3 = _e[0], y_4 = _e[1];
                this[i][0] = m.a * x_3 + m.c * y_4 + m.e;
                this[i][1] = m.b * x_3 + m.d * y_4 + m.f;
            }
            return this;
        };
        return PointArray;
    }(SVGArray));
    var MorphArray = PointArray;
    // Move by left top corner over x-axis
    function x$2(x) {
        return x == null ? this.bbox().x : this.move(x, this.bbox().y);
    }
    // Move by left top corner over y-axis
    function y$2(y) {
        return y == null ? this.bbox().y : this.move(this.bbox().x, y);
    }
    // Set width of element
    function width$1(width) {
        var b = this.bbox();
        return width == null ? b.width : this.size(width, b.height);
    }
    // Set height of element
    function height$1(height) {
        var b = this.bbox();
        return height == null ? b.height : this.size(b.width, height);
    }
    var pointed = {
        __proto__: null,
        MorphArray: MorphArray,
        height: height$1,
        width: width$1,
        x: x$2,
        y: y$2
    };
    var Line = /** @class */ (function (_super) {
        __extends(Line, _super);
        // Initialize node
        function Line(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('line', node), attrs) || this;
        }
        // Get array
        Line.prototype.array = function () {
            return new PointArray([[this.attr('x1'), this.attr('y1')], [this.attr('x2'), this.attr('y2')]]);
        };
        // Move by left top corner
        Line.prototype.move = function (x, y) {
            return this.attr(this.array().move(x, y).toLine());
        };
        // Overwrite native plot() method
        Line.prototype.plot = function (x1, y1, x2, y2) {
            if (x1 == null) {
                return this.array();
            }
            else if (typeof y1 !== 'undefined') {
                x1 = {
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2
                };
            }
            else {
                x1 = new PointArray(x1).toLine();
            }
            return this.attr(x1);
        };
        // Set element size to given width and height
        Line.prototype.size = function (width, height) {
            var p = proportionalSize(this, width, height);
            return this.attr(this.array().size(p.width, p.height).toLine());
        };
        return Line;
    }(Shape));
    extend(Line, pointed);
    registerMethods({
        Container: {
            // Create a line element
            line: wrapWithAttrCheck(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // make sure plot is called as a setter
                // x1 is not necessarily a number, it can also be an array, a string and a PointArray
                return Line.prototype.plot.apply(this.put(new Line()), args[0] != null ? args : [0, 0, 0, 0]);
            })
        }
    });
    register(Line, 'Line');
    var Marker = /** @class */ (function (_super) {
        __extends(Marker, _super);
        // Initialize node
        function Marker(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('marker', node), attrs) || this;
        }
        // Set height of element
        Marker.prototype.height = function (height) {
            return this.attr('markerHeight', height);
        };
        Marker.prototype.orient = function (orient) {
            return this.attr('orient', orient);
        };
        // Set marker refX and refY
        Marker.prototype.ref = function (x, y) {
            return this.attr('refX', x).attr('refY', y);
        };
        // Return the fill id
        Marker.prototype.toString = function () {
            return 'url(#' + this.id() + ')';
        };
        // Update marker
        Marker.prototype.update = function (block) {
            // remove all content
            this.clear();
            // invoke passed block
            if (typeof block === 'function') {
                block.call(this, this);
            }
            return this;
        };
        // Set width of element
        Marker.prototype.width = function (width) {
            return this.attr('markerWidth', width);
        };
        return Marker;
    }(Container));
    registerMethods({
        Container: {
            marker: function () {
                var _e;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // Create marker element in defs
                return (_e = this.defs()).marker.apply(_e, args);
            }
        },
        Defs: {
            // Create marker
            marker: wrapWithAttrCheck(function (width, height, block) {
                // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
                return this.put(new Marker()).size(width, height).ref(width / 2, height / 2).viewbox(0, 0, width, height).attr('orient', 'auto').update(block);
            })
        },
        marker: {
            // Create and attach markers
            marker: function (marker, width, height, block) {
                var attr = ['marker'];
                // Build attribute name
                if (marker !== 'all')
                    attr.push(marker);
                attr = attr.join('-');
                // Set marker attribute
                marker = arguments[1] instanceof Marker ? arguments[1] : this.defs().marker(width, height, block);
                return this.attr(attr, marker);
            }
        }
    });
    register(Marker, 'Marker');
    /***
    Base Class
    ==========
    The base stepper class that will be
    ***/
    function makeSetterGetter(k, f) {
        return function (v) {
            if (v == null)
                return this[k];
            this[k] = v;
            if (f)
                f.call(this);
            return this;
        };
    }
    var easing = {
        '-': function (pos) {
            return pos;
        },
        '<>': function (pos) {
            return -Math.cos(pos * Math.PI) / 2 + 0.5;
        },
        '>': function (pos) {
            return Math.sin(pos * Math.PI / 2);
        },
        '<': function (pos) {
            return -Math.cos(pos * Math.PI / 2) + 1;
        },
        bezier: function (x1, y1, x2, y2) {
            // see https://www.w3.org/TR/css-easing-1/#cubic-bezier-algo
            return function (t) {
                if (t < 0) {
                    if (x1 > 0) {
                        return y1 / x1 * t;
                    }
                    else if (x2 > 0) {
                        return y2 / x2 * t;
                    }
                    else {
                        return 0;
                    }
                }
                else if (t > 1) {
                    if (x2 < 1) {
                        return (1 - y2) / (1 - x2) * t + (y2 - x2) / (1 - x2);
                    }
                    else if (x1 < 1) {
                        return (1 - y1) / (1 - x1) * t + (y1 - x1) / (1 - x1);
                    }
                    else {
                        return 1;
                    }
                }
                else {
                    return 3 * t * Math.pow((1 - t), 2) * y1 + 3 * Math.pow(t, 2) * (1 - t) * y2 + Math.pow(t, 3);
                }
            };
        },
        // see https://www.w3.org/TR/css-easing-1/#step-timing-function-algo
        steps: function (steps, stepPosition) {
            if (stepPosition === void 0) { stepPosition = 'end'; }
            // deal with "jump-" prefix
            stepPosition = stepPosition.split('-').reverse()[0];
            var jumps = steps;
            if (stepPosition === 'none') {
                --jumps;
            }
            else if (stepPosition === 'both') {
                ++jumps;
            }
            // The beforeFlag is essentially useless
            return function (t, beforeFlag) {
                if (beforeFlag === void 0) { beforeFlag = false; }
                // Step is called currentStep in referenced url
                var step = Math.floor(t * steps);
                var jumping = t * step % 1 === 0;
                if (stepPosition === 'start' || stepPosition === 'both') {
                    ++step;
                }
                if (beforeFlag && jumping) {
                    --step;
                }
                if (t >= 0 && step < 0) {
                    step = 0;
                }
                if (t <= 1 && step > jumps) {
                    step = jumps;
                }
                return step / jumps;
            };
        }
    };
    var Stepper = /** @class */ (function () {
        function Stepper() {
        }
        Stepper.prototype.done = function () {
            return false;
        };
        return Stepper;
    }());
    /***
    Easing Functions
    ================
    ***/
    var Ease = /** @class */ (function (_super) {
        __extends(Ease, _super);
        function Ease(fn) {
            if (fn === void 0) { fn = timeline.ease; }
            var _this_1 = _super.call(this) || this;
            _this_1.ease = easing[fn] || fn;
            return _this_1;
        }
        Ease.prototype.step = function (from, to, pos) {
            if (typeof from !== 'number') {
                return pos < 1 ? from : to;
            }
            return from + (to - from) * this.ease(pos);
        };
        return Ease;
    }(Stepper));
    /***
    Controller Types
    ================
    ***/
    var Controller = /** @class */ (function (_super) {
        __extends(Controller, _super);
        function Controller(fn) {
            var _this_1 = _super.call(this) || this;
            _this_1.stepper = fn;
            return _this_1;
        }
        Controller.prototype.done = function (c) {
            return c.done;
        };
        Controller.prototype.step = function (current, target, dt, c) {
            return this.stepper(current, target, dt, c);
        };
        return Controller;
    }(Stepper));
    function recalculate() {
        // Apply the default parameters
        var duration = (this._duration || 500) / 1000;
        var overshoot = this._overshoot || 0;
        // Calculate the PID natural response
        var eps = 1e-10;
        var pi = Math.PI;
        var os = Math.log(overshoot / 100 + eps);
        var zeta = -os / Math.sqrt(pi * pi + os * os);
        var wn = 3.9 / (zeta * duration);
        // Calculate the Spring values
        this.d = 2 * zeta * wn;
        this.k = wn * wn;
    }
    var Spring = /** @class */ (function (_super) {
        __extends(Spring, _super);
        function Spring(duration, overshoot) {
            if (duration === void 0) { duration = 500; }
            if (overshoot === void 0) { overshoot = 0; }
            var _this_1 = _super.call(this) || this;
            _this_1.duration(duration).overshoot(overshoot);
            return _this_1;
        }
        Spring.prototype.step = function (current, target, dt, c) {
            if (typeof current === 'string')
                return current;
            c.done = dt === Infinity;
            if (dt === Infinity)
                return target;
            if (dt === 0)
                return current;
            if (dt > 100)
                dt = 16;
            dt /= 1000;
            // Get the previous velocity
            var velocity = c.velocity || 0;
            // Apply the control to get the new position and store it
            var acceleration = -this.d * velocity - this.k * (current - target);
            var newPosition = current + velocity * dt + acceleration * dt * dt / 2;
            // Store the velocity
            c.velocity = velocity + acceleration * dt;
            // Figure out if we have converged, and if so, pass the value
            c.done = Math.abs(target - newPosition) + Math.abs(velocity) < 0.002;
            return c.done ? target : newPosition;
        };
        return Spring;
    }(Controller));
    extend(Spring, {
        duration: makeSetterGetter('_duration', recalculate),
        overshoot: makeSetterGetter('_overshoot', recalculate)
    });
    var PID = /** @class */ (function (_super) {
        __extends(PID, _super);
        function PID(p, i, d, windup) {
            if (p === void 0) { p = 0.1; }
            if (i === void 0) { i = 0.01; }
            if (d === void 0) { d = 0; }
            if (windup === void 0) { windup = 1000; }
            var _this_1 = _super.call(this) || this;
            _this_1.p(p).i(i).d(d).windup(windup);
            return _this_1;
        }
        PID.prototype.step = function (current, target, dt, c) {
            if (typeof current === 'string')
                return current;
            c.done = dt === Infinity;
            if (dt === Infinity)
                return target;
            if (dt === 0)
                return current;
            var p = target - current;
            var i = (c.integral || 0) + p * dt;
            var d = (p - (c.error || 0)) / dt;
            var windup = this._windup;
            // antiwindup
            if (windup !== false) {
                i = Math.max(-windup, Math.min(i, windup));
            }
            c.error = p;
            c.integral = i;
            c.done = Math.abs(p) < 0.001;
            return c.done ? target : current + (this.P * p + this.I * i + this.D * d);
        };
        return PID;
    }(Controller));
    extend(PID, {
        windup: makeSetterGetter('_windup'),
        p: makeSetterGetter('P'),
        i: makeSetterGetter('I'),
        d: makeSetterGetter('D')
    });
    var segmentParameters = {
        M: 2,
        L: 2,
        H: 1,
        V: 1,
        C: 6,
        S: 4,
        Q: 4,
        T: 2,
        A: 7,
        Z: 0
    };
    var pathHandlers = {
        M: function (c, p, p0) {
            p.x = p0.x = c[0];
            p.y = p0.y = c[1];
            return ['M', p.x, p.y];
        },
        L: function (c, p) {
            p.x = c[0];
            p.y = c[1];
            return ['L', c[0], c[1]];
        },
        H: function (c, p) {
            p.x = c[0];
            return ['H', c[0]];
        },
        V: function (c, p) {
            p.y = c[0];
            return ['V', c[0]];
        },
        C: function (c, p) {
            p.x = c[4];
            p.y = c[5];
            return ['C', c[0], c[1], c[2], c[3], c[4], c[5]];
        },
        S: function (c, p) {
            p.x = c[2];
            p.y = c[3];
            return ['S', c[0], c[1], c[2], c[3]];
        },
        Q: function (c, p) {
            p.x = c[2];
            p.y = c[3];
            return ['Q', c[0], c[1], c[2], c[3]];
        },
        T: function (c, p) {
            p.x = c[0];
            p.y = c[1];
            return ['T', c[0], c[1]];
        },
        Z: function (c, p, p0) {
            p.x = p0.x;
            p.y = p0.y;
            return ['Z'];
        },
        A: function (c, p) {
            p.x = c[5];
            p.y = c[6];
            return ['A', c[0], c[1], c[2], c[3], c[4], c[5], c[6]];
        }
    };
    var mlhvqtcsaz = 'mlhvqtcsaz'.split('');
    for (var i = 0, il = mlhvqtcsaz.length; i < il; ++i) {
        pathHandlers[mlhvqtcsaz[i]] = function (i) {
            return function (c, p, p0) {
                if (i === 'H')
                    c[0] = c[0] + p.x;
                else if (i === 'V')
                    c[0] = c[0] + p.y;
                else if (i === 'A') {
                    c[5] = c[5] + p.x;
                    c[6] = c[6] + p.y;
                }
                else {
                    for (var j = 0, jl = c.length; j < jl; ++j) {
                        c[j] = c[j] + (j % 2 ? p.y : p.x);
                    }
                }
                return pathHandlers[i](c, p, p0);
            };
        }(mlhvqtcsaz[i].toUpperCase());
    }
    function makeAbsolut(parser) {
        var command = parser.segment[0];
        return pathHandlers[command](parser.segment.slice(1), parser.p, parser.p0);
    }
    function segmentComplete(parser) {
        return parser.segment.length && parser.segment.length - 1 === segmentParameters[parser.segment[0].toUpperCase()];
    }
    function startNewSegment(parser, token) {
        parser.inNumber && finalizeNumber(parser, false);
        var pathLetter = isPathLetter.test(token);
        if (pathLetter) {
            parser.segment = [token];
        }
        else {
            var lastCommand = parser.lastCommand;
            var small = lastCommand.toLowerCase();
            var isSmall = lastCommand === small;
            parser.segment = [small === 'm' ? isSmall ? 'l' : 'L' : lastCommand];
        }
        parser.inSegment = true;
        parser.lastCommand = parser.segment[0];
        return pathLetter;
    }
    function finalizeNumber(parser, inNumber) {
        if (!parser.inNumber)
            throw new Error('Parser Error');
        parser.number && parser.segment.push(parseFloat(parser.number));
        parser.inNumber = inNumber;
        parser.number = '';
        parser.pointSeen = false;
        parser.hasExponent = false;
        if (segmentComplete(parser)) {
            finalizeSegment(parser);
        }
    }
    function finalizeSegment(parser) {
        parser.inSegment = false;
        if (parser.absolute) {
            parser.segment = makeAbsolut(parser);
        }
        parser.segments.push(parser.segment);
    }
    function isArcFlag(parser) {
        if (!parser.segment.length)
            return false;
        var isArc = parser.segment[0].toUpperCase() === 'A';
        var length = parser.segment.length;
        return isArc && (length === 4 || length === 5);
    }
    function isExponential(parser) {
        return parser.lastToken.toUpperCase() === 'E';
    }
    var pathDelimiters = new Set([' ', ',', '\t', '\n', '\r', '\f']);
    function pathParser(d, toAbsolute) {
        if (toAbsolute === void 0) { toAbsolute = true; }
        var index = 0;
        var token = '';
        var parser = {
            segment: [],
            inNumber: false,
            number: '',
            lastToken: '',
            inSegment: false,
            segments: [],
            pointSeen: false,
            hasExponent: false,
            absolute: toAbsolute,
            p0: new Point(),
            p: new Point()
        };
        while (parser.lastToken = token, token = d.charAt(index++)) {
            if (!parser.inSegment) {
                if (startNewSegment(parser, token)) {
                    continue;
                }
            }
            if (token === '.') {
                if (parser.pointSeen || parser.hasExponent) {
                    finalizeNumber(parser, false);
                    --index;
                    continue;
                }
                parser.inNumber = true;
                parser.pointSeen = true;
                parser.number += token;
                continue;
            }
            if (!isNaN(parseInt(token))) {
                if (parser.number === '0' || isArcFlag(parser)) {
                    parser.inNumber = true;
                    parser.number = token;
                    finalizeNumber(parser, true);
                    continue;
                }
                parser.inNumber = true;
                parser.number += token;
                continue;
            }
            if (pathDelimiters.has(token)) {
                if (parser.inNumber) {
                    finalizeNumber(parser, false);
                }
                continue;
            }
            if (token === '-' || token === '+') {
                if (parser.inNumber && !isExponential(parser)) {
                    finalizeNumber(parser, false);
                    --index;
                    continue;
                }
                parser.number += token;
                parser.inNumber = true;
                continue;
            }
            if (token.toUpperCase() === 'E') {
                parser.number += token;
                parser.hasExponent = true;
                continue;
            }
            if (isPathLetter.test(token)) {
                if (parser.inNumber) {
                    finalizeNumber(parser, false);
                }
                else if (!segmentComplete(parser)) {
                    throw new Error('parser Error');
                }
                else {
                    finalizeSegment(parser);
                }
                --index;
            }
        }
        if (parser.inNumber) {
            finalizeNumber(parser, false);
        }
        if (parser.inSegment && segmentComplete(parser)) {
            finalizeSegment(parser);
        }
        return parser.segments;
    }
    function arrayToString(a) {
        var s = '';
        for (var i = 0, il = a.length; i < il; i++) {
            s += a[i][0];
            if (a[i][1] != null) {
                s += a[i][1];
                if (a[i][2] != null) {
                    s += ' ';
                    s += a[i][2];
                    if (a[i][3] != null) {
                        s += ' ';
                        s += a[i][3];
                        s += ' ';
                        s += a[i][4];
                        if (a[i][5] != null) {
                            s += ' ';
                            s += a[i][5];
                            s += ' ';
                            s += a[i][6];
                            if (a[i][7] != null) {
                                s += ' ';
                                s += a[i][7];
                            }
                        }
                    }
                }
            }
        }
        return s + ' ';
    }
    var PathArray = /** @class */ (function (_super) {
        __extends(PathArray, _super);
        function PathArray() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // Get bounding box of path
        PathArray.prototype.bbox = function () {
            parser().path.setAttribute('d', this.toString());
            return new Box(parser.nodes.path.getBBox());
        };
        // Move path string
        PathArray.prototype.move = function (x, y) {
            // get bounding box of current situation
            var box = this.bbox();
            // get relative offset
            x -= box.x;
            y -= box.y;
            if (!isNaN(x) && !isNaN(y)) {
                // move every point
                for (var l = void 0, i = this.length - 1; i >= 0; i--) {
                    l = this[i][0];
                    if (l === 'M' || l === 'L' || l === 'T') {
                        this[i][1] += x;
                        this[i][2] += y;
                    }
                    else if (l === 'H') {
                        this[i][1] += x;
                    }
                    else if (l === 'V') {
                        this[i][1] += y;
                    }
                    else if (l === 'C' || l === 'S' || l === 'Q') {
                        this[i][1] += x;
                        this[i][2] += y;
                        this[i][3] += x;
                        this[i][4] += y;
                        if (l === 'C') {
                            this[i][5] += x;
                            this[i][6] += y;
                        }
                    }
                    else if (l === 'A') {
                        this[i][6] += x;
                        this[i][7] += y;
                    }
                }
            }
            return this;
        };
        // Absolutize and parse path to array
        PathArray.prototype.parse = function (d) {
            if (d === void 0) { d = 'M0 0'; }
            if (Array.isArray(d)) {
                d = Array.prototype.concat.apply([], d).toString();
            }
            return pathParser(d);
        };
        // Resize path string
        PathArray.prototype.size = function (width, height) {
            // get bounding box of current situation
            var box = this.bbox();
            var i, l;
            // If the box width or height is 0 then we ignore
            // transformations on the respective axis
            box.width = box.width === 0 ? 1 : box.width;
            box.height = box.height === 0 ? 1 : box.height;
            // recalculate position of all points according to new size
            for (i = this.length - 1; i >= 0; i--) {
                l = this[i][0];
                if (l === 'M' || l === 'L' || l === 'T') {
                    this[i][1] = (this[i][1] - box.x) * width / box.width + box.x;
                    this[i][2] = (this[i][2] - box.y) * height / box.height + box.y;
                }
                else if (l === 'H') {
                    this[i][1] = (this[i][1] - box.x) * width / box.width + box.x;
                }
                else if (l === 'V') {
                    this[i][1] = (this[i][1] - box.y) * height / box.height + box.y;
                }
                else if (l === 'C' || l === 'S' || l === 'Q') {
                    this[i][1] = (this[i][1] - box.x) * width / box.width + box.x;
                    this[i][2] = (this[i][2] - box.y) * height / box.height + box.y;
                    this[i][3] = (this[i][3] - box.x) * width / box.width + box.x;
                    this[i][4] = (this[i][4] - box.y) * height / box.height + box.y;
                    if (l === 'C') {
                        this[i][5] = (this[i][5] - box.x) * width / box.width + box.x;
                        this[i][6] = (this[i][6] - box.y) * height / box.height + box.y;
                    }
                }
                else if (l === 'A') {
                    // resize radii
                    this[i][1] = this[i][1] * width / box.width;
                    this[i][2] = this[i][2] * height / box.height;
                    // move position values
                    this[i][6] = (this[i][6] - box.x) * width / box.width + box.x;
                    this[i][7] = (this[i][7] - box.y) * height / box.height + box.y;
                }
            }
            return this;
        };
        // Convert array to string
        PathArray.prototype.toString = function () {
            return arrayToString(this);
        };
        return PathArray;
    }(SVGArray));
    var getClassForType = function (value) {
        var type = typeof value;
        if (type === 'number') {
            return SVGNumber;
        }
        else if (type === 'string') {
            if (Color.isColor(value)) {
                return Color;
            }
            else if (delimiter.test(value)) {
                return isPathLetter.test(value) ? PathArray : SVGArray;
            }
            else if (numberAndUnit.test(value)) {
                return SVGNumber;
            }
            else {
                return NonMorphable;
            }
        }
        else if (morphableTypes.indexOf(value.constructor) > -1) {
            return value.constructor;
        }
        else if (Array.isArray(value)) {
            return SVGArray;
        }
        else if (type === 'object') {
            return ObjectBag;
        }
        else {
            return NonMorphable;
        }
    };
    var Morphable = /** @class */ (function () {
        function Morphable(stepper) {
            this._stepper = stepper || new Ease('-');
            this._from = null;
            this._to = null;
            this._type = null;
            this._context = null;
            this._morphObj = null;
        }
        Morphable.prototype.at = function (pos) {
            return this._morphObj.morph(this._from, this._to, pos, this._stepper, this._context);
        };
        Morphable.prototype.done = function () {
            var complete = this._context.map(this._stepper.done).reduce(function (last, curr) {
                return last && curr;
            }, true);
            return complete;
        };
        Morphable.prototype.from = function (val) {
            if (val == null) {
                return this._from;
            }
            this._from = this._set(val);
            return this;
        };
        Morphable.prototype.stepper = function (stepper) {
            if (stepper == null)
                return this._stepper;
            this._stepper = stepper;
            return this;
        };
        Morphable.prototype.to = function (val) {
            if (val == null) {
                return this._to;
            }
            this._to = this._set(val);
            return this;
        };
        Morphable.prototype.type = function (type) {
            // getter
            if (type == null) {
                return this._type;
            }
            // setter
            this._type = type;
            return this;
        };
        Morphable.prototype._set = function (value) {
            if (!this._type) {
                this.type(getClassForType(value));
            }
            var result = new this._type(value);
            if (this._type === Color) {
                result = this._to ? result[this._to[4]]() : this._from ? result[this._from[4]]() : result;
            }
            if (this._type === ObjectBag) {
                result = this._to ? result.align(this._to) : this._from ? result.align(this._from) : result;
            }
            result = result.toConsumable();
            this._morphObj = this._morphObj || new this._type();
            this._context = this._context || Array.apply(null, Array(result.length)).map(Object).map(function (o) {
                o.done = true;
                return o;
            });
            return result;
        };
        return Morphable;
    }());
    var NonMorphable = /** @class */ (function () {
        function NonMorphable() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.init.apply(this, args);
        }
        NonMorphable.prototype.init = function (val) {
            val = Array.isArray(val) ? val[0] : val;
            this.value = val;
            return this;
        };
        NonMorphable.prototype.toArray = function () {
            return [this.value];
        };
        NonMorphable.prototype.valueOf = function () {
            return this.value;
        };
        return NonMorphable;
    }());
    var TransformBag = /** @class */ (function () {
        function TransformBag() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.init.apply(this, args);
        }
        TransformBag.prototype.init = function (obj) {
            if (Array.isArray(obj)) {
                obj = {
                    scaleX: obj[0],
                    scaleY: obj[1],
                    shear: obj[2],
                    rotate: obj[3],
                    translateX: obj[4],
                    translateY: obj[5],
                    originX: obj[6],
                    originY: obj[7]
                };
            }
            Object.assign(this, TransformBag.defaults, obj);
            return this;
        };
        TransformBag.prototype.toArray = function () {
            var v = this;
            return [v.scaleX, v.scaleY, v.shear, v.rotate, v.translateX, v.translateY, v.originX, v.originY];
        };
        return TransformBag;
    }());
    TransformBag.defaults = {
        scaleX: 1,
        scaleY: 1,
        shear: 0,
        rotate: 0,
        translateX: 0,
        translateY: 0,
        originX: 0,
        originY: 0
    };
    var sortByKey = function (a, b) {
        return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
    };
    var ObjectBag = /** @class */ (function () {
        function ObjectBag() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.init.apply(this, args);
        }
        ObjectBag.prototype.align = function (other) {
            var _e;
            var values = this.values;
            for (var i = 0, il = values.length; i < il; ++i) {
                // If the type is the same we only need to check if the color is in the correct format
                if (values[i + 1] === other[i + 1]) {
                    if (values[i + 1] === Color && other[i + 7] !== values[i + 7]) {
                        var space = other[i + 7];
                        var color = new Color(this.values.splice(i + 3, 5))[space]().toArray();
                        (_e = this.values).splice.apply(_e, __spreadArray([i + 3, 0], color, false));
                    }
                    i += values[i + 2] + 2;
                    continue;
                }
                if (!other[i + 1]) {
                    return this;
                }
                // The types differ, so we overwrite the new type with the old one
                // And initialize it with the types default (e.g. black for color or 0 for number)
                var defaultObject = new other[i + 1]().toArray();
                // Than we fix the values array
                var toDelete = values[i + 2] + 3;
                values.splice.apply(values, __spreadArray([i, toDelete, other[i], other[i + 1], other[i + 2]], defaultObject, false));
                i += values[i + 2] + 2;
            }
            return this;
        };
        ObjectBag.prototype.init = function (objOrArr) {
            this.values = [];
            if (Array.isArray(objOrArr)) {
                this.values = objOrArr.slice();
                return;
            }
            objOrArr = objOrArr || {};
            var entries = [];
            for (var i in objOrArr) {
                var Type = getClassForType(objOrArr[i]);
                var val = new Type(objOrArr[i]).toArray();
                entries.push(__spreadArray([i, Type, val.length], val, true));
            }
            entries.sort(sortByKey);
            this.values = entries.reduce(function (last, curr) { return last.concat(curr); }, []);
            return this;
        };
        ObjectBag.prototype.toArray = function () {
            return this.values;
        };
        ObjectBag.prototype.valueOf = function () {
            var obj = {};
            var arr = this.values;
            // for (var i = 0, len = arr.length; i < len; i += 2) {
            while (arr.length) {
                var key = arr.shift();
                var Type = arr.shift();
                var num = arr.shift();
                var values = arr.splice(0, num);
                obj[key] = new Type(values); // .valueOf()
            }
            return obj;
        };
        return ObjectBag;
    }());
    var morphableTypes = [NonMorphable, TransformBag, ObjectBag];
    function registerMorphableType(type) {
        if (type === void 0) { type = []; }
        morphableTypes.push.apply(morphableTypes, [].concat(type));
    }
    function makeMorphable() {
        extend(morphableTypes, {
            to: function (val) {
                return new Morphable().type(this.constructor).from(this.toArray()) // this.valueOf())
                    .to(val);
            },
            fromArray: function (arr) {
                this.init(arr);
                return this;
            },
            toConsumable: function () {
                return this.toArray();
            },
            morph: function (from, to, pos, stepper, context) {
                var mapper = function (i, index) {
                    return stepper.step(i, to[index], pos, context[index], context);
                };
                return this.fromArray(from.map(mapper));
            }
        });
    }
    var Path = /** @class */ (function (_super) {
        __extends(Path, _super);
        // Initialize node
        function Path(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('path', node), attrs) || this;
        }
        // Get array
        Path.prototype.array = function () {
            return this._array || (this._array = new PathArray(this.attr('d')));
        };
        // Clear array cache
        Path.prototype.clear = function () {
            delete this._array;
            return this;
        };
        // Set height of element
        Path.prototype.height = function (height) {
            return height == null ? this.bbox().height : this.size(this.bbox().width, height);
        };
        // Move by left top corner
        Path.prototype.move = function (x, y) {
            return this.attr('d', this.array().move(x, y));
        };
        // Plot new path
        Path.prototype.plot = function (d) {
            return d == null ? this.array() : this.clear().attr('d', typeof d === 'string' ? d : this._array = new PathArray(d));
        };
        // Set element size to given width and height
        Path.prototype.size = function (width, height) {
            var p = proportionalSize(this, width, height);
            return this.attr('d', this.array().size(p.width, p.height));
        };
        // Set width of element
        Path.prototype.width = function (width) {
            return width == null ? this.bbox().width : this.size(width, this.bbox().height);
        };
        // Move by left top corner over x-axis
        Path.prototype.x = function (x) {
            return x == null ? this.bbox().x : this.move(x, this.bbox().y);
        };
        // Move by left top corner over y-axis
        Path.prototype.y = function (y) {
            return y == null ? this.bbox().y : this.move(this.bbox().x, y);
        };
        return Path;
    }(Shape));
    // Define morphable array
    Path.prototype.MorphArray = PathArray;
    // Add parent method
    registerMethods({
        Container: {
            // Create a wrapped path element
            path: wrapWithAttrCheck(function (d) {
                // make sure plot is called as a setter
                return this.put(new Path()).plot(d || new PathArray());
            })
        }
    });
    register(Path, 'Path');
    // Get array
    function array() {
        return this._array || (this._array = new PointArray(this.attr('points')));
    }
    // Clear array cache
    function clear() {
        delete this._array;
        return this;
    }
    // Move by left top corner
    function move$2(x, y) {
        return this.attr('points', this.array().move(x, y));
    }
    // Plot new path
    function plot(p) {
        return p == null ? this.array() : this.clear().attr('points', typeof p === 'string' ? p : this._array = new PointArray(p));
    }
    // Set element size to given width and height
    function size$1(width, height) {
        var p = proportionalSize(this, width, height);
        return this.attr('points', this.array().size(p.width, p.height));
    }
    var poly = {
        __proto__: null,
        array: array,
        clear: clear,
        move: move$2,
        plot: plot,
        size: size$1
    };
    var Polygon = /** @class */ (function (_super) {
        __extends(Polygon, _super);
        // Initialize node
        function Polygon(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('polygon', node), attrs) || this;
        }
        return Polygon;
    }(Shape));
    registerMethods({
        Container: {
            // Create a wrapped polygon element
            polygon: wrapWithAttrCheck(function (p) {
                // make sure plot is called as a setter
                return this.put(new Polygon()).plot(p || new PointArray());
            })
        }
    });
    extend(Polygon, pointed);
    extend(Polygon, poly);
    register(Polygon, 'Polygon');
    var Polyline = /** @class */ (function (_super) {
        __extends(Polyline, _super);
        // Initialize node
        function Polyline(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('polyline', node), attrs) || this;
        }
        return Polyline;
    }(Shape));
    registerMethods({
        Container: {
            // Create a wrapped polygon element
            polyline: wrapWithAttrCheck(function (p) {
                // make sure plot is called as a setter
                return this.put(new Polyline()).plot(p || new PointArray());
            })
        }
    });
    extend(Polyline, pointed);
    extend(Polyline, poly);
    register(Polyline, 'Polyline');
    var Rect = /** @class */ (function (_super) {
        __extends(Rect, _super);
        // Initialize node
        function Rect(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('rect', node), attrs) || this;
        }
        return Rect;
    }(Shape));
    extend(Rect, {
        rx: rx,
        ry: ry
    });
    registerMethods({
        Container: {
            // Create a rect element
            rect: wrapWithAttrCheck(function (width, height) {
                return this.put(new Rect()).size(width, height);
            })
        }
    });
    register(Rect, 'Rect');
    var Queue = /** @class */ (function () {
        function Queue() {
            this._first = null;
            this._last = null;
        }
        // Shows us the first item in the list
        Queue.prototype.first = function () {
            return this._first && this._first.value;
        };
        // Shows us the last item in the list
        Queue.prototype.last = function () {
            return this._last && this._last.value;
        };
        Queue.prototype.push = function (value) {
            // An item stores an id and the provided value
            var item = typeof value.next !== 'undefined' ? value : {
                value: value,
                next: null,
                prev: null
            };
            // Deal with the queue being empty or populated
            if (this._last) {
                item.prev = this._last;
                this._last.next = item;
                this._last = item;
            }
            else {
                this._last = item;
                this._first = item;
            }
            // Return the current item
            return item;
        };
        // Removes the item that was returned from the push
        Queue.prototype.remove = function (item) {
            // Relink the previous item
            if (item.prev)
                item.prev.next = item.next;
            if (item.next)
                item.next.prev = item.prev;
            if (item === this._last)
                this._last = item.prev;
            if (item === this._first)
                this._first = item.next;
            // Invalidate item
            item.prev = null;
            item.next = null;
        };
        Queue.prototype.shift = function () {
            // Check if we have a value
            var remove = this._first;
            if (!remove)
                return null;
            // If we do, remove it and relink things
            this._first = remove.next;
            if (this._first)
                this._first.prev = null;
            this._last = this._first ? this._last : null;
            return remove.value;
        };
        return Queue;
    }());
    var Animator = {
        nextDraw: null,
        frames: new Queue(),
        timeouts: new Queue(),
        immediates: new Queue(),
        timer: function () { return globals.window.performance || globals.window.Date; },
        transforms: [],
        frame: function (fn) {
            // Store the node
            var node = Animator.frames.push({
                run: fn
            });
            // Request an animation frame if we don't have one
            if (Animator.nextDraw === null) {
                Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
            }
            // Return the node so we can remove it easily
            return node;
        },
        timeout: function (fn, delay) {
            delay = delay || 0;
            // Work out when the event should fire
            var time = Animator.timer().now() + delay;
            // Add the timeout to the end of the queue
            var node = Animator.timeouts.push({
                run: fn,
                time: time
            });
            // Request another animation frame if we need one
            if (Animator.nextDraw === null) {
                Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
            }
            return node;
        },
        immediate: function (fn) {
            // Add the immediate fn to the end of the queue
            var node = Animator.immediates.push(fn);
            // Request another animation frame if we need one
            if (Animator.nextDraw === null) {
                Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw);
            }
            return node;
        },
        cancelFrame: function (node) {
            node != null && Animator.frames.remove(node);
        },
        clearTimeout: function (node) {
            node != null && Animator.timeouts.remove(node);
        },
        cancelImmediate: function (node) {
            node != null && Animator.immediates.remove(node);
        },
        _draw: function (now) {
            // Run all the timeouts we can run, if they are not ready yet, add them
            // to the end of the queue immediately! (bad timeouts!!! [sarcasm])
            var nextTimeout = null;
            var lastTimeout = Animator.timeouts.last();
            while (nextTimeout = Animator.timeouts.shift()) {
                // Run the timeout if its time, or push it to the end
                if (now >= nextTimeout.time) {
                    nextTimeout.run();
                }
                else {
                    Animator.timeouts.push(nextTimeout);
                }
                // If we hit the last item, we should stop shifting out more items
                if (nextTimeout === lastTimeout)
                    break;
            }
            // Run all of the animation frames
            var nextFrame = null;
            var lastFrame = Animator.frames.last();
            while (nextFrame !== lastFrame && (nextFrame = Animator.frames.shift())) {
                nextFrame.run(now);
            }
            var nextImmediate = null;
            while (nextImmediate = Animator.immediates.shift()) {
                nextImmediate();
            }
            // If we have remaining timeouts or frames, draw until we don't anymore
            Animator.nextDraw = Animator.timeouts.first() || Animator.frames.first() ? globals.window.requestAnimationFrame(Animator._draw) : null;
        }
    };
    var makeSchedule = function (runnerInfo) {
        var start = runnerInfo.start;
        var duration = runnerInfo.runner.duration();
        var end = start + duration;
        return {
            start: start,
            duration: duration,
            end: end,
            runner: runnerInfo.runner
        };
    };
    var defaultSource = function () {
        var w = globals.window;
        return (w.performance || w.Date).now();
    };
    var Timeline = /** @class */ (function (_super) {
        __extends(Timeline, _super);
        // Construct a new timeline on the given element
        function Timeline(timeSource) {
            if (timeSource === void 0) { timeSource = defaultSource; }
            var _this_1 = _super.call(this) || this;
            _this_1._timeSource = timeSource;
            // terminate resets all variables to their initial state
            _this_1.terminate();
            return _this_1;
        }
        Timeline.prototype.active = function () {
            return !!this._nextFrame;
        };
        Timeline.prototype.finish = function () {
            // Go to end and pause
            this.time(this.getEndTimeOfTimeline() + 1);
            return this.pause();
        };
        // Calculates the end of the timeline
        Timeline.prototype.getEndTime = function () {
            var lastRunnerInfo = this.getLastRunnerInfo();
            var lastDuration = lastRunnerInfo ? lastRunnerInfo.runner.duration() : 0;
            var lastStartTime = lastRunnerInfo ? lastRunnerInfo.start : this._time;
            return lastStartTime + lastDuration;
        };
        Timeline.prototype.getEndTimeOfTimeline = function () {
            var endTimes = this._runners.map(function (i) { return i.start + i.runner.duration(); });
            return Math.max.apply(Math, __spreadArray([0], endTimes, false));
        };
        Timeline.prototype.getLastRunnerInfo = function () {
            return this.getRunnerInfoById(this._lastRunnerId);
        };
        Timeline.prototype.getRunnerInfoById = function (id) {
            return this._runners[this._runnerIds.indexOf(id)] || null;
        };
        Timeline.prototype.pause = function () {
            this._paused = true;
            return this._continue();
        };
        Timeline.prototype.persist = function (dtOrForever) {
            if (dtOrForever == null)
                return this._persist;
            this._persist = dtOrForever;
            return this;
        };
        Timeline.prototype.play = function () {
            // Now make sure we are not paused and continue the animation
            this._paused = false;
            return this.updateTime()._continue();
        };
        Timeline.prototype.reverse = function (yes) {
            var currentSpeed = this.speed();
            if (yes == null)
                return this.speed(-currentSpeed);
            var positive = Math.abs(currentSpeed);
            return this.speed(yes ? -positive : positive);
        };
        // schedules a runner on the timeline
        Timeline.prototype.schedule = function (runner, delay, when) {
            if (runner == null) {
                return this._runners.map(makeSchedule);
            }
            // The start time for the next animation can either be given explicitly,
            // derived from the current timeline time or it can be relative to the
            // last start time to chain animations directly
            var absoluteStartTime = 0;
            var endTime = this.getEndTime();
            delay = delay || 0;
            // Work out when to start the animation
            if (when == null || when === 'last' || when === 'after') {
                // Take the last time and increment
                absoluteStartTime = endTime;
            }
            else if (when === 'absolute' || when === 'start') {
                absoluteStartTime = delay;
                delay = 0;
            }
            else if (when === 'now') {
                absoluteStartTime = this._time;
            }
            else if (when === 'relative') {
                var runnerInfo_1 = this.getRunnerInfoById(runner.id);
                if (runnerInfo_1) {
                    absoluteStartTime = runnerInfo_1.start + delay;
                    delay = 0;
                }
            }
            else if (when === 'with-last') {
                var lastRunnerInfo = this.getLastRunnerInfo();
                var lastStartTime = lastRunnerInfo ? lastRunnerInfo.start : this._time;
                absoluteStartTime = lastStartTime;
            }
            else {
                throw new Error('Invalid value for the "when" parameter');
            }
            // Manage runner
            runner.unschedule();
            runner.timeline(this);
            var persist = runner.persist();
            var runnerInfo = {
                persist: persist === null ? this._persist : persist,
                start: absoluteStartTime + delay,
                runner: runner
            };
            this._lastRunnerId = runner.id;
            this._runners.push(runnerInfo);
            this._runners.sort(function (a, b) { return a.start - b.start; });
            this._runnerIds = this._runners.map(function (info) { return info.runner.id; });
            this.updateTime()._continue();
            return this;
        };
        Timeline.prototype.seek = function (dt) {
            return this.time(this._time + dt);
        };
        Timeline.prototype.source = function (fn) {
            if (fn == null)
                return this._timeSource;
            this._timeSource = fn;
            return this;
        };
        Timeline.prototype.speed = function (speed) {
            if (speed == null)
                return this._speed;
            this._speed = speed;
            return this;
        };
        Timeline.prototype.stop = function () {
            // Go to start and pause
            this.time(0);
            return this.pause();
        };
        Timeline.prototype.time = function (time) {
            if (time == null)
                return this._time;
            this._time = time;
            return this._continue(true);
        };
        // Remove the runner from this timeline
        Timeline.prototype.unschedule = function (runner) {
            var index = this._runnerIds.indexOf(runner.id);
            if (index < 0)
                return this;
            this._runners.splice(index, 1);
            this._runnerIds.splice(index, 1);
            runner.timeline(null);
            return this;
        };
        // Makes sure, that after pausing the time doesn't jump
        Timeline.prototype.updateTime = function () {
            if (!this.active()) {
                this._lastSourceTime = this._timeSource();
            }
            return this;
        };
        // Checks if we are running and continues the animation
        Timeline.prototype._continue = function (immediateStep) {
            if (immediateStep === void 0) { immediateStep = false; }
            Animator.cancelFrame(this._nextFrame);
            this._nextFrame = null;
            if (immediateStep)
                return this._stepImmediate();
            if (this._paused)
                return this;
            this._nextFrame = Animator.frame(this._step);
            return this;
        };
        Timeline.prototype._stepFn = function (immediateStep) {
            if (immediateStep === void 0) { immediateStep = false; }
            // Get the time delta from the last time and update the time
            var time = this._timeSource();
            var dtSource = time - this._lastSourceTime;
            if (immediateStep)
                dtSource = 0;
            var dtTime = this._speed * dtSource + (this._time - this._lastStepTime);
            this._lastSourceTime = time;
            // Only update the time if we use the timeSource.
            // Otherwise use the current time
            if (!immediateStep) {
                // Update the time
                this._time += dtTime;
                this._time = this._time < 0 ? 0 : this._time;
            }
            this._lastStepTime = this._time;
            this.fire('time', this._time);
            // This is for the case that the timeline was seeked so that the time
            // is now before the startTime of the runner. That is why we need to set
            // the runner to position 0
            // FIXME:
            // However, resetting in insertion order leads to bugs. Considering the case,
            // where 2 runners change the same attribute but in different times,
            // resetting both of them will lead to the case where the later defined
            // runner always wins the reset even if the other runner started earlier
            // and therefore should win the attribute battle
            // this can be solved by resetting them backwards
            for (var k = this._runners.length; k--;) {
                // Get and run the current runner and ignore it if its inactive
                var runnerInfo = this._runners[k];
                var runner = runnerInfo.runner;
                // Make sure that we give the actual difference
                // between runner start time and now
                var dtToStart = this._time - runnerInfo.start;
                // Dont run runner if not started yet
                // and try to reset it
                if (dtToStart <= 0) {
                    runner.reset();
                }
            }
            // Run all of the runners directly
            var runnersLeft = false;
            for (var i = 0, len = this._runners.length; i < len; i++) {
                // Get and run the current runner and ignore it if its inactive
                var runnerInfo = this._runners[i];
                var runner = runnerInfo.runner;
                var dt = dtTime;
                // Make sure that we give the actual difference
                // between runner start time and now
                var dtToStart = this._time - runnerInfo.start;
                // Dont run runner if not started yet
                if (dtToStart <= 0) {
                    runnersLeft = true;
                    continue;
                }
                else if (dtToStart < dt) {
                    // Adjust dt to make sure that animation is on point
                    dt = dtToStart;
                }
                if (!runner.active())
                    continue;
                // If this runner is still going, signal that we need another animation
                // frame, otherwise, remove the completed runner
                var finished = runner.step(dt).done;
                if (!finished) {
                    runnersLeft = true;
                    // continue
                }
                else if (runnerInfo.persist !== true) {
                    // runner is finished. And runner might get removed
                    var endTime = runner.duration() - runner.time() + this._time;
                    if (endTime + runnerInfo.persist < this._time) {
                        // Delete runner and correct index
                        runner.unschedule();
                        --i;
                        --len;
                    }
                }
            }
            // Basically: we continue when there are runners right from us in time
            // when -->, and when runners are left from us when <--
            if (runnersLeft && !(this._speed < 0 && this._time === 0) || this._runnerIds.length && this._speed < 0 && this._time > 0) {
                this._continue();
            }
            else {
                this.pause();
                this.fire('finished');
            }
            return this;
        };
        Timeline.prototype.terminate = function () {
            // cleanup memory
            // Store the timing variables
            this._startTime = 0;
            this._speed = 1.0;
            // Determines how long a runner is hold in memory. Can be a dt or true/false
            this._persist = 0;
            // Keep track of the running animations and their starting parameters
            this._nextFrame = null;
            this._paused = true;
            this._runners = [];
            this._runnerIds = [];
            this._lastRunnerId = -1;
            this._time = 0;
            this._lastSourceTime = 0;
            this._lastStepTime = 0;
            // Make sure that step is always called in class context
            this._step = this._stepFn.bind(this, false);
            this._stepImmediate = this._stepFn.bind(this, true);
        };
        return Timeline;
    }(EventTarget));
    registerMethods({
        Element: {
            timeline: function (timeline) {
                if (timeline == null) {
                    this._timeline = this._timeline || new Timeline();
                    return this._timeline;
                }
                else {
                    this._timeline = timeline;
                    return this;
                }
            }
        }
    });
    var Runner = /** @class */ (function (_super) {
        __extends(Runner, _super);
        function Runner(options) {
            var _this_1 = _super.call(this) || this;
            // Store a unique id on the runner, so that we can identify it later
            _this_1.id = Runner.id++;
            // Ensure a default value
            options = options == null ? timeline.duration : options;
            // Ensure that we get a controller
            options = typeof options === 'function' ? new Controller(options) : options;
            // Declare all of the variables
            _this_1._element = null;
            _this_1._timeline = null;
            _this_1.done = false;
            _this_1._queue = [];
            // Work out the stepper and the duration
            _this_1._duration = typeof options === 'number' && options;
            _this_1._isDeclarative = options instanceof Controller;
            _this_1._stepper = _this_1._isDeclarative ? options : new Ease();
            // We copy the current values from the timeline because they can change
            _this_1._history = {};
            // Store the state of the runner
            _this_1.enabled = true;
            _this_1._time = 0;
            _this_1._lastTime = 0;
            // At creation, the runner is in reset state
            _this_1._reseted = true;
            // Save transforms applied to this runner
            _this_1.transforms = new Matrix();
            _this_1.transformId = 1;
            // Looping variables
            _this_1._haveReversed = false;
            _this_1._reverse = false;
            _this_1._loopsDone = 0;
            _this_1._swing = false;
            _this_1._wait = 0;
            _this_1._times = 1;
            _this_1._frameId = null;
            // Stores how long a runner is stored after being done
            _this_1._persist = _this_1._isDeclarative ? true : null;
            return _this_1;
        }
        Runner.sanitise = function (duration, delay, when) {
            var _e, _f, _g, _h, _j;
            // Initialise the default parameters
            var times = 1;
            var swing = false;
            var wait = 0;
            duration = duration !== null && duration !== void 0 ? duration : timeline.duration;
            delay = delay !== null && delay !== void 0 ? delay : timeline.delay;
            when = when || 'last';
            // If we have an object, unpack the values
            if (typeof duration === 'object' && !(duration instanceof Stepper)) {
                delay = (_e = duration.delay) !== null && _e !== void 0 ? _e : delay;
                when = (_f = duration.when) !== null && _f !== void 0 ? _f : when;
                swing = duration.swing || swing;
                times = (_g = duration.times) !== null && _g !== void 0 ? _g : times;
                wait = (_h = duration.wait) !== null && _h !== void 0 ? _h : wait;
                duration = (_j = duration.duration) !== null && _j !== void 0 ? _j : timeline.duration;
            }
            return {
                duration: duration,
                delay: delay,
                swing: swing,
                times: times,
                wait: wait,
                when: when
            };
        };
        Runner.prototype.active = function (enabled) {
            if (enabled == null)
                return this.enabled;
            this.enabled = enabled;
            return this;
        };
        /*
        Private Methods
        ===============
        Methods that shouldn't be used externally
        */
        Runner.prototype.addTransform = function (transform) {
            this.transforms.lmultiplyO(transform);
            return this;
        };
        Runner.prototype.after = function (fn) {
            return this.on('finished', fn);
        };
        Runner.prototype.animate = function (duration, delay, when) {
            var o = Runner.sanitise(duration, delay, when);
            var runner = new Runner(o.duration);
            if (this._timeline)
                runner.timeline(this._timeline);
            if (this._element)
                runner.element(this._element);
            return runner.loop(o).schedule(o.delay, o.when);
        };
        Runner.prototype.clearTransform = function () {
            this.transforms = new Matrix();
            return this;
        };
        // TODO: Keep track of all transformations so that deletion is faster
        Runner.prototype.clearTransformsFromQueue = function () {
            if (!this.done || !this._timeline || !this._timeline._runnerIds.includes(this.id)) {
                this._queue = this._queue.filter(function (item) {
                    return !item.isTransform;
                });
            }
        };
        Runner.prototype.delay = function (delay) {
            return this.animate(0, delay);
        };
        Runner.prototype.duration = function () {
            return this._times * (this._wait + this._duration) - this._wait;
        };
        Runner.prototype.during = function (fn) {
            return this.queue(null, fn);
        };
        Runner.prototype.ease = function (fn) {
            this._stepper = new Ease(fn);
            return this;
        };
        /*
        Runner Definitions
        ==================
        These methods help us define the runtime behaviour of the Runner or they
        help us make new runners from the current runner
        */
        Runner.prototype.element = function (element) {
            if (element == null)
                return this._element;
            this._element = element;
            element._prepareRunner();
            return this;
        };
        Runner.prototype.finish = function () {
            return this.step(Infinity);
        };
        Runner.prototype.loop = function (times, swing, wait) {
            // Deal with the user passing in an object
            if (typeof times === 'object') {
                swing = times.swing;
                wait = times.wait;
                times = times.times;
            }
            // Sanitise the values and store them
            this._times = times || Infinity;
            this._swing = swing || false;
            this._wait = wait || 0;
            // Allow true to be passed
            if (this._times === true) {
                this._times = Infinity;
            }
            return this;
        };
        Runner.prototype.loops = function (p) {
            var loopDuration = this._duration + this._wait;
            if (p == null) {
                var loopsDone = Math.floor(this._time / loopDuration);
                var relativeTime = this._time - loopsDone * loopDuration;
                var position_1 = relativeTime / this._duration;
                return Math.min(loopsDone + position_1, this._times);
            }
            var whole = Math.floor(p);
            var partial = p % 1;
            var time = loopDuration * whole + this._duration * partial;
            return this.time(time);
        };
        Runner.prototype.persist = function (dtOrForever) {
            if (dtOrForever == null)
                return this._persist;
            this._persist = dtOrForever;
            return this;
        };
        Runner.prototype.position = function (p) {
            // Get all of the variables we need
            var x = this._time;
            var d = this._duration;
            var w = this._wait;
            var t = this._times;
            var s = this._swing;
            var r = this._reverse;
            var position;
            if (p == null) {
                /*
                This function converts a time to a position in the range [0, 1]
                The full explanation can be found in this desmos demonstration
                  https://www.desmos.com/calculator/u4fbavgche
                The logic is slightly simplified here because we can use booleans
                */
                // Figure out the value without thinking about the start or end time
                var f = function (x) {
                    var swinging = s * Math.floor(x % (2 * (w + d)) / (w + d));
                    var backwards = swinging && !r || !swinging && r;
                    var uncliped = Math.pow(-1, backwards) * (x % (w + d)) / d + backwards;
                    var clipped = Math.max(Math.min(uncliped, 1), 0);
                    return clipped;
                };
                // Figure out the value by incorporating the start time
                var endTime = t * (w + d) - w;
                position = x <= 0 ? Math.round(f(1e-5)) : x < endTime ? f(x) : Math.round(f(endTime - 1e-5));
                return position;
            }
            // Work out the loops done and add the position to the loops done
            var loopsDone = Math.floor(this.loops());
            var swingForward = s && loopsDone % 2 === 0;
            var forwards = swingForward && !r || r && swingForward;
            position = loopsDone + (forwards ? p : 1 - p);
            return this.loops(position);
        };
        Runner.prototype.progress = function (p) {
            if (p == null) {
                return Math.min(1, this._time / this.duration());
            }
            return this.time(p * this.duration());
        };
        /*
        Basic Functionality
        ===================
        These methods allow us to attach basic functions to the runner directly
        */
        Runner.prototype.queue = function (initFn, runFn, retargetFn, isTransform) {
            this._queue.push({
                initialiser: initFn || noop,
                runner: runFn || noop,
                retarget: retargetFn,
                isTransform: isTransform,
                initialised: false,
                finished: false
            });
            var timeline = this.timeline();
            timeline && this.timeline()._continue();
            return this;
        };
        Runner.prototype.reset = function () {
            if (this._reseted)
                return this;
            this.time(0);
            this._reseted = true;
            return this;
        };
        Runner.prototype.reverse = function (reverse) {
            this._reverse = reverse == null ? !this._reverse : reverse;
            return this;
        };
        Runner.prototype.schedule = function (timeline, delay, when) {
            // The user doesn't need to pass a timeline if we already have one
            if (!(timeline instanceof Timeline)) {
                when = delay;
                delay = timeline;
                timeline = this.timeline();
            }
            // If there is no timeline, yell at the user...
            if (!timeline) {
                throw Error('Runner cannot be scheduled without timeline');
            }
            // Schedule the runner on the timeline provided
            timeline.schedule(this, delay, when);
            return this;
        };
        Runner.prototype.step = function (dt) {
            // If we are inactive, this stepper just gets skipped
            if (!this.enabled)
                return this;
            // Update the time and get the new position
            dt = dt == null ? 16 : dt;
            this._time += dt;
            var position = this.position();
            // Figure out if we need to run the stepper in this frame
            var running = this._lastPosition !== position && this._time >= 0;
            this._lastPosition = position;
            // Figure out if we just started
            var duration = this.duration();
            var justStarted = this._lastTime <= 0 && this._time > 0;
            var justFinished = this._lastTime < duration && this._time >= duration;
            this._lastTime = this._time;
            if (justStarted) {
                this.fire('start', this);
            }
            // Work out if the runner is finished set the done flag here so animations
            // know, that they are running in the last step (this is good for
            // transformations which can be merged)
            var declarative = this._isDeclarative;
            this.done = !declarative && !justFinished && this._time >= duration;
            // Runner is running. So its not in reset state anymore
            this._reseted = false;
            var converged = false;
            // Call initialise and the run function
            if (running || declarative) {
                this._initialise(running);
                // clear the transforms on this runner so they dont get added again and again
                this.transforms = new Matrix();
                converged = this._run(declarative ? dt : position);
                this.fire('step', this);
            }
            // correct the done flag here
            // declarative animations itself know when they converged
            this.done = this.done || converged && declarative;
            if (justFinished) {
                this.fire('finished', this);
            }
            return this;
        };
        /*
        Runner animation methods
        ========================
        Control how the animation plays
        */
        Runner.prototype.time = function (time) {
            if (time == null) {
                return this._time;
            }
            var dt = time - this._time;
            this.step(dt);
            return this;
        };
        Runner.prototype.timeline = function (timeline) {
            // check explicitly for undefined so we can set the timeline to null
            if (typeof timeline === 'undefined')
                return this._timeline;
            this._timeline = timeline;
            return this;
        };
        Runner.prototype.unschedule = function () {
            var timeline = this.timeline();
            timeline && timeline.unschedule(this);
            return this;
        };
        // Run each initialise function in the runner if required
        Runner.prototype._initialise = function (running) {
            // If we aren't running, we shouldn't initialise when not declarative
            if (!running && !this._isDeclarative)
                return;
            // Loop through all of the initialisers
            for (var i = 0, len = this._queue.length; i < len; ++i) {
                // Get the current initialiser
                var current = this._queue[i];
                // Determine whether we need to initialise
                var needsIt = this._isDeclarative || !current.initialised && running;
                running = !current.finished;
                // Call the initialiser if we need to
                if (needsIt && running) {
                    current.initialiser.call(this);
                    current.initialised = true;
                }
            }
        };
        // Save a morpher to the morpher list so that we can retarget it later
        Runner.prototype._rememberMorpher = function (method, morpher) {
            this._history[method] = {
                morpher: morpher,
                caller: this._queue[this._queue.length - 1]
            };
            // We have to resume the timeline in case a controller
            // is already done without being ever run
            // This can happen when e.g. this is done:
            //    anim = el.animate(new SVG.Spring)
            // and later
            //    anim.move(...)
            if (this._isDeclarative) {
                var timeline_1 = this.timeline();
                timeline_1 && timeline_1.play();
            }
        };
        // Try to set the target for a morpher if the morpher exists, otherwise
        // Run each run function for the position or dt given
        Runner.prototype._run = function (positionOrDt) {
            // Run all of the _queue directly
            var allfinished = true;
            for (var i = 0, len = this._queue.length; i < len; ++i) {
                // Get the current function to run
                var current = this._queue[i];
                // Run the function if its not finished, we keep track of the finished
                // flag for the sake of declarative _queue
                var converged = current.runner.call(this, positionOrDt);
                current.finished = current.finished || converged === true;
                allfinished = allfinished && current.finished;
            }
            // We report when all of the constructors are finished
            return allfinished;
        };
        // do nothing and return false
        Runner.prototype._tryRetarget = function (method, target, extra) {
            if (this._history[method]) {
                // if the last method wasn't even initialised, throw it away
                if (!this._history[method].caller.initialised) {
                    var index = this._queue.indexOf(this._history[method].caller);
                    this._queue.splice(index, 1);
                    return false;
                }
                // for the case of transformations, we use the special retarget function
                // which has access to the outer scope
                if (this._history[method].caller.retarget) {
                    this._history[method].caller.retarget.call(this, target, extra);
                    // for everything else a simple morpher change is sufficient
                }
                else {
                    this._history[method].morpher.to(target);
                }
                this._history[method].caller.finished = false;
                var timeline_2 = this.timeline();
                timeline_2 && timeline_2.play();
                return true;
            }
            return false;
        };
        return Runner;
    }(EventTarget));
    Runner.id = 0;
    var FakeRunner = /** @class */ (function () {
        function FakeRunner(transforms, id, done) {
            if (transforms === void 0) { transforms = new Matrix(); }
            if (id === void 0) { id = -1; }
            if (done === void 0) { done = true; }
            this.transforms = transforms;
            this.id = id;
            this.done = done;
        }
        FakeRunner.prototype.clearTransformsFromQueue = function () { };
        return FakeRunner;
    }());
    extend([Runner, FakeRunner], {
        mergeWith: function (runner) {
            return new FakeRunner(runner.transforms.lmultiply(this.transforms), runner.id);
        }
    });
    // FakeRunner.emptyRunner = new FakeRunner()
    var lmultiply = function (last, curr) { return last.lmultiplyO(curr); };
    var getRunnerTransform = function (runner) { return runner.transforms; };
    function mergeTransforms() {
        // Find the matrix to apply to the element and apply it
        var runners = this._transformationRunners.runners;
        var netTransform = runners.map(getRunnerTransform).reduce(lmultiply, new Matrix());
        this.transform(netTransform);
        this._transformationRunners.merge();
        if (this._transformationRunners.length() === 1) {
            this._frameId = null;
        }
    }
    var RunnerArray = /** @class */ (function () {
        function RunnerArray() {
            this.runners = [];
            this.ids = [];
        }
        RunnerArray.prototype.add = function (runner) {
            if (this.runners.includes(runner))
                return;
            var id = runner.id + 1;
            this.runners.push(runner);
            this.ids.push(id);
            return this;
        };
        RunnerArray.prototype.clearBefore = function (id) {
            var deleteCnt = this.ids.indexOf(id + 1) || 1;
            this.ids.splice(0, deleteCnt, 0);
            this.runners.splice(0, deleteCnt, new FakeRunner()).forEach(function (r) { return r.clearTransformsFromQueue(); });
            return this;
        };
        RunnerArray.prototype.edit = function (id, newRunner) {
            var index = this.ids.indexOf(id + 1);
            this.ids.splice(index, 1, id + 1);
            this.runners.splice(index, 1, newRunner);
            return this;
        };
        RunnerArray.prototype.getByID = function (id) {
            return this.runners[this.ids.indexOf(id + 1)];
        };
        RunnerArray.prototype.length = function () {
            return this.ids.length;
        };
        RunnerArray.prototype.merge = function () {
            var lastRunner = null;
            for (var i = 0; i < this.runners.length; ++i) {
                var runner = this.runners[i];
                var condition = lastRunner && runner.done && lastRunner.done && (
                // don't merge runner when persisted on timeline
                !runner._timeline || !runner._timeline._runnerIds.includes(runner.id)) && (!lastRunner._timeline || !lastRunner._timeline._runnerIds.includes(lastRunner.id));
                if (condition) {
                    // the +1 happens in the function
                    this.remove(runner.id);
                    var newRunner = runner.mergeWith(lastRunner);
                    this.edit(lastRunner.id, newRunner);
                    lastRunner = newRunner;
                    --i;
                }
                else {
                    lastRunner = runner;
                }
            }
            return this;
        };
        RunnerArray.prototype.remove = function (id) {
            var index = this.ids.indexOf(id + 1);
            this.ids.splice(index, 1);
            this.runners.splice(index, 1);
            return this;
        };
        return RunnerArray;
    }());
    registerMethods({
        Element: {
            animate: function (duration, delay, when) {
                var o = Runner.sanitise(duration, delay, when);
                var timeline = this.timeline();
                return new Runner(o.duration).loop(o).element(this).timeline(timeline.play()).schedule(o.delay, o.when);
            },
            delay: function (by, when) {
                return this.animate(0, by, when);
            },
            // this function searches for all runners on the element and deletes the ones
            // which run before the current one. This is because absolute transformations
            // overwrite anything anyway so there is no need to waste time computing
            // other runners
            _clearTransformRunnersBefore: function (currentRunner) {
                this._transformationRunners.clearBefore(currentRunner.id);
            },
            _currentTransform: function (current) {
                return this._transformationRunners.runners
                    // we need the equal sign here to make sure, that also transformations
                    // on the same runner which execute before the current transformation are
                    // taken into account
                    .filter(function (runner) { return runner.id <= current.id; }).map(getRunnerTransform).reduce(lmultiply, new Matrix());
            },
            _addRunner: function (runner) {
                this._transformationRunners.add(runner);
                // Make sure that the runner merge is executed at the very end of
                // all Animator functions. That is why we use immediate here to execute
                // the merge right after all frames are run
                Animator.cancelImmediate(this._frameId);
                this._frameId = Animator.immediate(mergeTransforms.bind(this));
            },
            _prepareRunner: function () {
                if (this._frameId == null) {
                    this._transformationRunners = new RunnerArray().add(new FakeRunner(new Matrix(this)));
                }
            }
        }
    });
    // Will output the elements from array A that are not in the array B
    var difference = function (a, b) { return a.filter(function (x) { return !b.includes(x); }); };
    extend(Runner, {
        attr: function (a, v) {
            return this.styleAttr('attr', a, v);
        },
        // Add animatable styles
        css: function (s, v) {
            return this.styleAttr('css', s, v);
        },
        styleAttr: function (type, nameOrAttrs, val) {
            var _e;
            if (typeof nameOrAttrs === 'string') {
                return this.styleAttr(type, (_e = {},
                    _e[nameOrAttrs] = val,
                    _e));
            }
            var attrs = nameOrAttrs;
            if (this._tryRetarget(type, attrs))
                return this;
            var morpher = new Morphable(this._stepper).to(attrs);
            var keys = Object.keys(attrs);
            this.queue(function () {
                morpher = morpher.from(this.element()[type](keys));
            }, function (pos) {
                this.element()[type](morpher.at(pos).valueOf());
                return morpher.done();
            }, function (newToAttrs) {
                // Check if any new keys were added
                var newKeys = Object.keys(newToAttrs);
                var differences = difference(newKeys, keys);
                // If their are new keys, initialize them and add them to morpher
                if (differences.length) {
                    // Get the values
                    var addedFromAttrs = this.element()[type](differences);
                    // Get the already initialized values
                    var oldFromAttrs = new ObjectBag(morpher.from()).valueOf();
                    // Merge old and new
                    Object.assign(oldFromAttrs, addedFromAttrs);
                    morpher.from(oldFromAttrs);
                }
                // Get the object from the morpher
                var oldToAttrs = new ObjectBag(morpher.to()).valueOf();
                // Merge in new attributes
                Object.assign(oldToAttrs, newToAttrs);
                // Change morpher target
                morpher.to(oldToAttrs);
                // Make sure that we save the work we did so we don't need it to do again
                keys = newKeys;
                attrs = newToAttrs;
            });
            this._rememberMorpher(type, morpher);
            return this;
        },
        zoom: function (level, point) {
            if (this._tryRetarget('zoom', level, point))
                return this;
            var morpher = new Morphable(this._stepper).to(new SVGNumber(level));
            this.queue(function () {
                morpher = morpher.from(this.element().zoom());
            }, function (pos) {
                this.element().zoom(morpher.at(pos), point);
                return morpher.done();
            }, function (newLevel, newPoint) {
                point = newPoint;
                morpher.to(newLevel);
            });
            this._rememberMorpher('zoom', morpher);
            return this;
        },
        /**
         ** absolute transformations
         **/
        //
        // M v -----|-----(D M v = F v)------|----->  T v
        //
        // 1. define the final state (T) and decompose it (once)
        //    t = [tx, ty, the, lam, sy, sx]
        // 2. on every frame: pull the current state of all previous transforms
        //    (M - m can change)
        //   and then write this as m = [tx0, ty0, the0, lam0, sy0, sx0]
        // 3. Find the interpolated matrix F(pos) = m + pos * (t - m)
        //   - Note F(0) = M
        //   - Note F(1) = T
        // 4. Now you get the delta matrix as a result: D = F * inv(M)
        transform: function (transforms, relative, affine) {
            // If we have a declarative function, we should retarget it if possible
            relative = transforms.relative || relative;
            if (this._isDeclarative && !relative && this._tryRetarget('transform', transforms)) {
                return this;
            }
            // Parse the parameters
            var isMatrix = Matrix.isMatrixLike(transforms);
            affine = transforms.affine != null ? transforms.affine : affine != null ? affine : !isMatrix;
            // Create a morpher and set its type
            var morpher = new Morphable(this._stepper).type(affine ? TransformBag : Matrix);
            var origin;
            var element;
            var current;
            var currentAngle;
            var startTransform;
            function setup() {
                // make sure element and origin is defined
                element = element || this.element();
                origin = origin || getOrigin(transforms, element);
                startTransform = new Matrix(relative ? undefined : element);
                // add the runner to the element so it can merge transformations
                element._addRunner(this);
                // Deactivate all transforms that have run so far if we are absolute
                if (!relative) {
                    element._clearTransformRunnersBefore(this);
                }
            }
            function run(pos) {
                // clear all other transforms before this in case something is saved
                // on this runner. We are absolute. We dont need these!
                if (!relative)
                    this.clearTransform();
                var _e = new Point(origin).transform(element._currentTransform(this)), x = _e.x, y = _e.y;
                var target = new Matrix(__assign(__assign({}, transforms), { origin: [x, y] }));
                var start = this._isDeclarative && current ? current : startTransform;
                if (affine) {
                    target = target.decompose(x, y);
                    start = start.decompose(x, y);
                    // Get the current and target angle as it was set
                    var rTarget = target.rotate;
                    var rCurrent_1 = start.rotate;
                    // Figure out the shortest path to rotate directly
                    var possibilities = [rTarget - 360, rTarget, rTarget + 360];
                    var distances = possibilities.map(function (a) { return Math.abs(a - rCurrent_1); });
                    var shortest = Math.min.apply(Math, distances);
                    var index = distances.indexOf(shortest);
                    target.rotate = possibilities[index];
                }
                if (relative) {
                    // we have to be careful here not to overwrite the rotation
                    // with the rotate method of Matrix
                    if (!isMatrix) {
                        target.rotate = transforms.rotate || 0;
                    }
                    if (this._isDeclarative && currentAngle) {
                        start.rotate = currentAngle;
                    }
                }
                morpher.from(start);
                morpher.to(target);
                var affineParameters = morpher.at(pos);
                currentAngle = affineParameters.rotate;
                current = new Matrix(affineParameters);
                this.addTransform(current);
                element._addRunner(this);
                return morpher.done();
            }
            function retarget(newTransforms) {
                // only get a new origin if it changed since the last call
                if ((newTransforms.origin || 'center').toString() !== (transforms.origin || 'center').toString()) {
                    origin = getOrigin(newTransforms, element);
                }
                // overwrite the old transformations with the new ones
                transforms = __assign(__assign({}, newTransforms), { origin: origin });
            }
            this.queue(setup, run, retarget, true);
            this._isDeclarative && this._rememberMorpher('transform', morpher);
            return this;
        },
        // Animatable x-axis
        x: function (x) {
            return this._queueNumber('x', x);
        },
        // Animatable y-axis
        y: function (y) {
            return this._queueNumber('y', y);
        },
        ax: function (x) {
            return this._queueNumber('ax', x);
        },
        ay: function (y) {
            return this._queueNumber('ay', y);
        },
        dx: function (x) {
            if (x === void 0) { x = 0; }
            return this._queueNumberDelta('x', x);
        },
        dy: function (y) {
            if (y === void 0) { y = 0; }
            return this._queueNumberDelta('y', y);
        },
        dmove: function (x, y) {
            return this.dx(x).dy(y);
        },
        _queueNumberDelta: function (method, to) {
            to = new SVGNumber(to);
            // Try to change the target if we have this method already registered
            if (this._tryRetarget(method, to))
                return this;
            // Make a morpher and queue the animation
            var morpher = new Morphable(this._stepper).to(to);
            var from = null;
            this.queue(function () {
                from = this.element()[method]();
                morpher.from(from);
                morpher.to(from + to);
            }, function (pos) {
                this.element()[method](morpher.at(pos));
                return morpher.done();
            }, function (newTo) {
                morpher.to(from + new SVGNumber(newTo));
            });
            // Register the morpher so that if it is changed again, we can retarget it
            this._rememberMorpher(method, morpher);
            return this;
        },
        _queueObject: function (method, to) {
            // Try to change the target if we have this method already registered
            if (this._tryRetarget(method, to))
                return this;
            // Make a morpher and queue the animation
            var morpher = new Morphable(this._stepper).to(to);
            this.queue(function () {
                morpher.from(this.element()[method]());
            }, function (pos) {
                this.element()[method](morpher.at(pos));
                return morpher.done();
            });
            // Register the morpher so that if it is changed again, we can retarget it
            this._rememberMorpher(method, morpher);
            return this;
        },
        _queueNumber: function (method, value) {
            return this._queueObject(method, new SVGNumber(value));
        },
        // Animatable center x-axis
        cx: function (x) {
            return this._queueNumber('cx', x);
        },
        // Animatable center y-axis
        cy: function (y) {
            return this._queueNumber('cy', y);
        },
        // Add animatable move
        move: function (x, y) {
            return this.x(x).y(y);
        },
        amove: function (x, y) {
            return this.ax(x).ay(y);
        },
        // Add animatable center
        center: function (x, y) {
            return this.cx(x).cy(y);
        },
        // Add animatable size
        size: function (width, height) {
            // animate bbox based size for all other elements
            var box;
            if (!width || !height) {
                box = this._element.bbox();
            }
            if (!width) {
                width = box.width / box.height * height;
            }
            if (!height) {
                height = box.height / box.width * width;
            }
            return this.width(width).height(height);
        },
        // Add animatable width
        width: function (width) {
            return this._queueNumber('width', width);
        },
        // Add animatable height
        height: function (height) {
            return this._queueNumber('height', height);
        },
        // Add animatable plot
        plot: function (a, b, c, d) {
            // Lines can be plotted with 4 arguments
            if (arguments.length === 4) {
                return this.plot([a, b, c, d]);
            }
            if (this._tryRetarget('plot', a))
                return this;
            var morpher = new Morphable(this._stepper).type(this._element.MorphArray).to(a);
            this.queue(function () {
                morpher.from(this._element.array());
            }, function (pos) {
                this._element.plot(morpher.at(pos));
                return morpher.done();
            });
            this._rememberMorpher('plot', morpher);
            return this;
        },
        // Add leading method
        leading: function (value) {
            return this._queueNumber('leading', value);
        },
        // Add animatable viewbox
        viewbox: function (x, y, width, height) {
            return this._queueObject('viewbox', new Box(x, y, width, height));
        },
        update: function (o) {
            if (typeof o !== 'object') {
                return this.update({
                    offset: arguments[0],
                    color: arguments[1],
                    opacity: arguments[2]
                });
            }
            if (o.opacity != null)
                this.attr('stop-opacity', o.opacity);
            if (o.color != null)
                this.attr('stop-color', o.color);
            if (o.offset != null)
                this.attr('offset', o.offset);
            return this;
        }
    });
    extend(Runner, {
        rx: rx,
        ry: ry,
        from: from,
        to: to
    });
    register(Runner, 'Runner');
    var Svg = /** @class */ (function (_super) {
        __extends(Svg, _super);
        function Svg(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            var _this_1 = _super.call(this, nodeOrNew('svg', node), attrs) || this;
            _this_1.namespace();
            return _this_1;
        }
        // Creates and returns defs element
        Svg.prototype.defs = function () {
            if (!this.isRoot())
                return this.root().defs();
            return adopt(this.node.querySelector('defs')) || this.put(new Defs());
        };
        Svg.prototype.isRoot = function () {
            return !this.node.parentNode || !(this.node.parentNode instanceof globals.window.SVGElement) && this.node.parentNode.nodeName !== '#document-fragment';
        };
        // Add namespaces
        Svg.prototype.namespace = function () {
            if (!this.isRoot())
                return this.root().namespace();
            return this.attr({
                xmlns: svg,
                version: '1.1'
            }).attr('xmlns:xlink', xlink, xmlns);
        };
        Svg.prototype.removeNamespace = function () {
            return this.attr({
                xmlns: null,
                version: null
            }).attr('xmlns:xlink', null, xmlns).attr('xmlns:svgjs', null, xmlns);
        };
        // Check if this is a root svg
        // If not, call root() from this element
        Svg.prototype.root = function () {
            if (this.isRoot())
                return this;
            return _super.prototype.root.call(this);
        };
        return Svg;
    }(Container));
    registerMethods({
        Container: {
            // Create nested svg document
            nested: wrapWithAttrCheck(function () {
                return this.put(new Svg());
            })
        }
    });
    register(Svg, 'Svg', true);
    var Symbol = /** @class */ (function (_super) {
        __extends(Symbol, _super);
        // Initialize node
        function Symbol(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('symbol', node), attrs) || this;
        }
        return Symbol;
    }(Container));
    registerMethods({
        Container: {
            symbol: wrapWithAttrCheck(function () {
                return this.put(new Symbol());
            })
        }
    });
    register(Symbol, 'Symbol');
    // Create plain text node
    function plain(text) {
        // clear if build mode is disabled
        if (this._build === false) {
            this.clear();
        }
        // create text node
        this.node.appendChild(globals.document.createTextNode(text));
        return this;
    }
    // Get length of text element
    function length() {
        return this.node.getComputedTextLength();
    }
    // Move over x-axis
    // Text is moved by its bounding box
    // text-anchor does NOT matter
    function x$1(x, box) {
        if (box === void 0) { box = this.bbox(); }
        if (x == null) {
            return box.x;
        }
        return this.attr('x', this.attr('x') + x - box.x);
    }
    // Move over y-axis
    function y$1(y, box) {
        if (box === void 0) { box = this.bbox(); }
        if (y == null) {
            return box.y;
        }
        return this.attr('y', this.attr('y') + y - box.y);
    }
    function move$1(x, y, box) {
        if (box === void 0) { box = this.bbox(); }
        return this.x(x, box).y(y, box);
    }
    // Move center over x-axis
    function cx(x, box) {
        if (box === void 0) { box = this.bbox(); }
        if (x == null) {
            return box.cx;
        }
        return this.attr('x', this.attr('x') + x - box.cx);
    }
    // Move center over y-axis
    function cy(y, box) {
        if (box === void 0) { box = this.bbox(); }
        if (y == null) {
            return box.cy;
        }
        return this.attr('y', this.attr('y') + y - box.cy);
    }
    function center(x, y, box) {
        if (box === void 0) { box = this.bbox(); }
        return this.cx(x, box).cy(y, box);
    }
    function ax(x) {
        return this.attr('x', x);
    }
    function ay(y) {
        return this.attr('y', y);
    }
    function amove(x, y) {
        return this.ax(x).ay(y);
    }
    // Enable / disable build mode
    function build(build) {
        this._build = !!build;
        return this;
    }
    var textable = {
        __proto__: null,
        amove: amove,
        ax: ax,
        ay: ay,
        build: build,
        center: center,
        cx: cx,
        cy: cy,
        length: length,
        move: move$1,
        plain: plain,
        x: x$1,
        y: y$1
    };
    var Text = /** @class */ (function (_super) {
        __extends(Text, _super);
        // Initialize node
        function Text(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            var _e;
            var _this_1 = _super.call(this, nodeOrNew('text', node), attrs) || this;
            _this_1.dom.leading = (_e = _this_1.dom.leading) !== null && _e !== void 0 ? _e : new SVGNumber(1.3); // store leading value for rebuilding
            _this_1._rebuild = true; // enable automatic updating of dy values
            _this_1._build = false; // disable build mode for adding multiple lines
            return _this_1;
        }
        // Set / get leading
        Text.prototype.leading = function (value) {
            // act as getter
            if (value == null) {
                return this.dom.leading;
            }
            // act as setter
            this.dom.leading = new SVGNumber(value);
            return this.rebuild();
        };
        // Rebuild appearance type
        Text.prototype.rebuild = function (rebuild) {
            // store new rebuild flag if given
            if (typeof rebuild === 'boolean') {
                this._rebuild = rebuild;
            }
            // define position of all lines
            if (this._rebuild) {
                var self_1 = this;
                var blankLineOffset_1 = 0;
                var leading_1 = this.dom.leading;
                this.each(function (i) {
                    if (isDescriptive(this.node))
                        return;
                    var fontSize = globals.window.getComputedStyle(this.node).getPropertyValue('font-size');
                    var dy = leading_1 * new SVGNumber(fontSize);
                    if (this.dom.newLined) {
                        this.attr('x', self_1.attr('x'));
                        if (this.text() === '\n') {
                            blankLineOffset_1 += dy;
                        }
                        else {
                            this.attr('dy', i ? dy + blankLineOffset_1 : 0);
                            blankLineOffset_1 = 0;
                        }
                    }
                });
                this.fire('rebuild');
            }
            return this;
        };
        // overwrite method from parent to set data properly
        Text.prototype.setData = function (o) {
            this.dom = o;
            this.dom.leading = new SVGNumber(o.leading || 1.3);
            return this;
        };
        Text.prototype.writeDataToDom = function () {
            writeDataToDom(this, this.dom, {
                leading: 1.3
            });
            return this;
        };
        // Set the text content
        Text.prototype.text = function (text) {
            // act as getter
            if (text === undefined) {
                var children = this.node.childNodes;
                var firstLine = 0;
                text = '';
                for (var i = 0, len = children.length; i < len; ++i) {
                    // skip textPaths - they are no lines
                    if (children[i].nodeName === 'textPath' || isDescriptive(children[i])) {
                        if (i === 0)
                            firstLine = i + 1;
                        continue;
                    }
                    // add newline if its not the first child and newLined is set to true
                    if (i !== firstLine && children[i].nodeType !== 3 && adopt(children[i]).dom.newLined === true) {
                        text += '\n';
                    }
                    // add content of this node
                    text += children[i].textContent;
                }
                return text;
            }
            // remove existing content
            this.clear().build(true);
            if (typeof text === 'function') {
                // call block
                text.call(this, this);
            }
            else {
                // store text and make sure text is not blank
                text = (text + '').split('\n');
                // build new lines
                for (var j = 0, jl = text.length; j < jl; j++) {
                    this.newLine(text[j]);
                }
            }
            // disable build mode and rebuild lines
            return this.build(false).rebuild();
        };
        return Text;
    }(Shape));
    extend(Text, textable);
    registerMethods({
        Container: {
            // Create text element
            text: wrapWithAttrCheck(function (text) {
                if (text === void 0) { text = ''; }
                return this.put(new Text()).text(text);
            }),
            // Create plain text element
            plain: wrapWithAttrCheck(function (text) {
                if (text === void 0) { text = ''; }
                return this.put(new Text()).plain(text);
            })
        }
    });
    register(Text, 'Text');
    var Tspan = /** @class */ (function (_super) {
        __extends(Tspan, _super);
        // Initialize node
        function Tspan(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            var _this_1 = _super.call(this, nodeOrNew('tspan', node), attrs) || this;
            _this_1._build = false; // disable build mode for adding multiple lines
            return _this_1;
        }
        // Shortcut dx
        Tspan.prototype.dx = function (dx) {
            return this.attr('dx', dx);
        };
        // Shortcut dy
        Tspan.prototype.dy = function (dy) {
            return this.attr('dy', dy);
        };
        // Create new line
        Tspan.prototype.newLine = function () {
            // mark new line
            this.dom.newLined = true;
            // fetch parent
            var text = this.parent();
            // early return in case we are not in a text element
            if (!(text instanceof Text)) {
                return this;
            }
            var i = text.index(this);
            var fontSize = globals.window.getComputedStyle(this.node).getPropertyValue('font-size');
            var dy = text.dom.leading * new SVGNumber(fontSize);
            // apply new position
            return this.dy(i ? dy : 0).attr('x', text.x());
        };
        // Set text content
        Tspan.prototype.text = function (text) {
            if (text == null)
                return this.node.textContent + (this.dom.newLined ? '\n' : '');
            if (typeof text === 'function') {
                this.clear().build(true);
                text.call(this, this);
                this.build(false);
            }
            else {
                this.plain(text);
            }
            return this;
        };
        return Tspan;
    }(Shape));
    extend(Tspan, textable);
    registerMethods({
        Tspan: {
            tspan: wrapWithAttrCheck(function (text) {
                if (text === void 0) { text = ''; }
                var tspan = new Tspan();
                // clear if build mode is disabled
                if (!this._build) {
                    this.clear();
                }
                // add new tspan
                return this.put(tspan).text(text);
            })
        },
        Text: {
            newLine: function (text) {
                if (text === void 0) { text = ''; }
                return this.tspan(text).newLine();
            }
        }
    });
    register(Tspan, 'Tspan');
    var Circle = /** @class */ (function (_super) {
        __extends(Circle, _super);
        function Circle(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('circle', node), attrs) || this;
        }
        Circle.prototype.radius = function (r) {
            return this.attr('r', r);
        };
        // Radius x value
        Circle.prototype.rx = function (rx) {
            return this.attr('r', rx);
        };
        // Alias radius x value
        Circle.prototype.ry = function (ry) {
            return this.rx(ry);
        };
        Circle.prototype.size = function (size) {
            return this.radius(new SVGNumber(size).divide(2));
        };
        return Circle;
    }(Shape));
    extend(Circle, {
        x: x$3,
        y: y$3,
        cx: cx$1,
        cy: cy$1,
        width: width$2,
        height: height$2
    });
    registerMethods({
        Container: {
            // Create circle element
            circle: wrapWithAttrCheck(function (size) {
                if (size === void 0) { size = 0; }
                return this.put(new Circle()).size(size).move(0, 0);
            })
        }
    });
    register(Circle, 'Circle');
    var ClipPath = /** @class */ (function (_super) {
        __extends(ClipPath, _super);
        function ClipPath(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('clipPath', node), attrs) || this;
        }
        // Unclip all clipped elements and remove itself
        ClipPath.prototype.remove = function () {
            // unclip all targets
            this.targets().forEach(function (el) {
                el.unclip();
            });
            // remove clipPath from parent
            return _super.prototype.remove.call(this);
        };
        ClipPath.prototype.targets = function () {
            return baseFind('svg [clip-path*=' + this.id() + ']');
        };
        return ClipPath;
    }(Container));
    registerMethods({
        Container: {
            // Create clipping element
            clip: wrapWithAttrCheck(function () {
                return this.defs().put(new ClipPath());
            })
        },
        Element: {
            // Distribute clipPath to svg element
            clipper: function () {
                return this.reference('clip-path');
            },
            clipWith: function (element) {
                // use given clip or create a new one
                var clipper = element instanceof ClipPath ? element : this.parent().clip().add(element);
                // apply mask
                return this.attr('clip-path', 'url(#' + clipper.id() + ')');
            },
            // Unclip element
            unclip: function () {
                return this.attr('clip-path', null);
            }
        }
    });
    register(ClipPath, 'ClipPath');
    var ForeignObject = /** @class */ (function (_super) {
        __extends(ForeignObject, _super);
        function ForeignObject(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('foreignObject', node), attrs) || this;
        }
        return ForeignObject;
    }(Element));
    registerMethods({
        Container: {
            foreignObject: wrapWithAttrCheck(function (width, height) {
                return this.put(new ForeignObject()).size(width, height);
            })
        }
    });
    register(ForeignObject, 'ForeignObject');
    function dmove(dx, dy) {
        this.children().forEach(function (child) {
            var bbox;
            // We have to wrap this for elements that dont have a bbox
            // e.g. title and other descriptive elements
            try {
                // Get the childs bbox
                // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1905039
                // Because bbox for nested svgs returns the contents bbox in the coordinate space of the svg itself (weird!), we cant use bbox for svgs
                // Therefore we have to use getBoundingClientRect. But THAT is broken (as explained in the bug).
                // Funnily enough the broken behavior would work for us but that breaks it in chrome
                // So we have to replicate the broken behavior of FF by just reading the attributes of the svg itself
                bbox = child.node instanceof getWindow().SVGSVGElement ? new Box(child.attr(['x', 'y', 'width', 'height'])) : child.bbox();
            }
            catch (e) {
                return;
            }
            // Get childs matrix
            var m = new Matrix(child);
            // Translate childs matrix by amount and
            // transform it back into parents space
            var matrix = m.translate(dx, dy).transform(m.inverse());
            // Calculate new x and y from old box
            var p = new Point(bbox.x, bbox.y).transform(matrix);
            // Move element
            child.move(p.x, p.y);
        });
        return this;
    }
    function dx(dx) {
        return this.dmove(dx, 0);
    }
    function dy(dy) {
        return this.dmove(0, dy);
    }
    function height(height, box) {
        if (box === void 0) { box = this.bbox(); }
        if (height == null)
            return box.height;
        return this.size(box.width, height, box);
    }
    function move(x, y, box) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (box === void 0) { box = this.bbox(); }
        var dx = x - box.x;
        var dy = y - box.y;
        return this.dmove(dx, dy);
    }
    function size(width, height, box) {
        if (box === void 0) { box = this.bbox(); }
        var p = proportionalSize(this, width, height, box);
        var scaleX = p.width / box.width;
        var scaleY = p.height / box.height;
        this.children().forEach(function (child) {
            var o = new Point(box).transform(new Matrix(child).inverse());
            child.scale(scaleX, scaleY, o.x, o.y);
        });
        return this;
    }
    function width(width, box) {
        if (box === void 0) { box = this.bbox(); }
        if (width == null)
            return box.width;
        return this.size(width, box.height, box);
    }
    function x(x, box) {
        if (box === void 0) { box = this.bbox(); }
        if (x == null)
            return box.x;
        return this.move(x, box.y, box);
    }
    function y(y, box) {
        if (box === void 0) { box = this.bbox(); }
        if (y == null)
            return box.y;
        return this.move(box.x, y, box);
    }
    var containerGeometry = {
        __proto__: null,
        dmove: dmove,
        dx: dx,
        dy: dy,
        height: height,
        move: move,
        size: size,
        width: width,
        x: x,
        y: y
    };
    var G = /** @class */ (function (_super) {
        __extends(G, _super);
        function G(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('g', node), attrs) || this;
        }
        return G;
    }(Container));
    extend(G, containerGeometry);
    registerMethods({
        Container: {
            // Create a group element
            group: wrapWithAttrCheck(function () {
                return this.put(new G());
            })
        }
    });
    register(G, 'G');
    var A = /** @class */ (function (_super) {
        __extends(A, _super);
        function A(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('a', node), attrs) || this;
        }
        // Link target attribute
        A.prototype.target = function (target) {
            return this.attr('target', target);
        };
        // Link url
        A.prototype.to = function (url) {
            return this.attr('href', url, xlink);
        };
        return A;
    }(Container));
    extend(A, containerGeometry);
    registerMethods({
        Container: {
            // Create a hyperlink element
            link: wrapWithAttrCheck(function (url) {
                return this.put(new A()).to(url);
            })
        },
        Element: {
            unlink: function () {
                var link = this.linker();
                if (!link)
                    return this;
                var parent = link.parent();
                if (!parent) {
                    return this.remove();
                }
                var index = parent.index(link);
                parent.add(this, index);
                link.remove();
                return this;
            },
            linkTo: function (url) {
                // reuse old link if possible
                var link = this.linker();
                if (!link) {
                    link = new A();
                    this.wrap(link);
                }
                if (typeof url === 'function') {
                    url.call(link, link);
                }
                else {
                    link.to(url);
                }
                return this;
            },
            linker: function () {
                var link = this.parent();
                if (link && link.node.nodeName.toLowerCase() === 'a') {
                    return link;
                }
                return null;
            }
        }
    });
    register(A, 'A');
    var Mask = /** @class */ (function (_super) {
        __extends(Mask, _super);
        // Initialize node
        function Mask(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('mask', node), attrs) || this;
        }
        // Unmask all masked elements and remove itself
        Mask.prototype.remove = function () {
            // unmask all targets
            this.targets().forEach(function (el) {
                el.unmask();
            });
            // remove mask from parent
            return _super.prototype.remove.call(this);
        };
        Mask.prototype.targets = function () {
            return baseFind('svg [mask*=' + this.id() + ']');
        };
        return Mask;
    }(Container));
    registerMethods({
        Container: {
            mask: wrapWithAttrCheck(function () {
                return this.defs().put(new Mask());
            })
        },
        Element: {
            // Distribute mask to svg element
            masker: function () {
                return this.reference('mask');
            },
            maskWith: function (element) {
                // use given mask or create a new one
                var masker = element instanceof Mask ? element : this.parent().mask().add(element);
                // apply mask
                return this.attr('mask', 'url(#' + masker.id() + ')');
            },
            // Unmask element
            unmask: function () {
                return this.attr('mask', null);
            }
        }
    });
    register(Mask, 'Mask');
    var Stop = /** @class */ (function (_super) {
        __extends(Stop, _super);
        function Stop(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('stop', node), attrs) || this;
        }
        // add color stops
        Stop.prototype.update = function (o) {
            if (typeof o === 'number' || o instanceof SVGNumber) {
                o = {
                    offset: arguments[0],
                    color: arguments[1],
                    opacity: arguments[2]
                };
            }
            // set attributes
            if (o.opacity != null)
                this.attr('stop-opacity', o.opacity);
            if (o.color != null)
                this.attr('stop-color', o.color);
            if (o.offset != null)
                this.attr('offset', new SVGNumber(o.offset));
            return this;
        };
        return Stop;
    }(Element));
    registerMethods({
        Gradient: {
            // Add a color stop
            stop: function (offset, color, opacity) {
                return this.put(new Stop()).update(offset, color, opacity);
            }
        }
    });
    register(Stop, 'Stop');
    function cssRule(selector, rule) {
        if (!selector)
            return '';
        if (!rule)
            return selector;
        var ret = selector + '{';
        for (var i in rule) {
            ret += unCamelCase(i) + ':' + rule[i] + ';';
        }
        ret += '}';
        return ret;
    }
    var Style = /** @class */ (function (_super) {
        __extends(Style, _super);
        function Style(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('style', node), attrs) || this;
        }
        Style.prototype.addText = function (w) {
            if (w === void 0) { w = ''; }
            this.node.textContent += w;
            return this;
        };
        Style.prototype.font = function (name, src, params) {
            if (params === void 0) { params = {}; }
            return this.rule('@font-face', __assign({ fontFamily: name, src: src }, params));
        };
        Style.prototype.rule = function (selector, obj) {
            return this.addText(cssRule(selector, obj));
        };
        return Style;
    }(Element));
    registerMethods('Dom', {
        style: function (selector, obj) {
            return this.put(new Style()).rule(selector, obj);
        },
        fontface: function (name, src, params) {
            return this.put(new Style()).font(name, src, params);
        }
    });
    register(Style, 'Style');
    var TextPath = /** @class */ (function (_super) {
        __extends(TextPath, _super);
        // Initialize node
        function TextPath(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('textPath', node), attrs) || this;
        }
        // return the array of the path track element
        TextPath.prototype.array = function () {
            var track = this.track();
            return track ? track.array() : null;
        };
        // Plot path if any
        TextPath.prototype.plot = function (d) {
            var track = this.track();
            var pathArray = null;
            if (track) {
                pathArray = track.plot(d);
            }
            return d == null ? pathArray : this;
        };
        // Get the path element
        TextPath.prototype.track = function () {
            return this.reference('href');
        };
        return TextPath;
    }(Text));
    registerMethods({
        Container: {
            textPath: wrapWithAttrCheck(function (text, path) {
                // Convert text to instance if needed
                if (!(text instanceof Text)) {
                    text = this.text(text);
                }
                return text.path(path);
            })
        },
        Text: {
            // Create path for text to run on
            path: wrapWithAttrCheck(function (track, importNodes) {
                if (importNodes === void 0) { importNodes = true; }
                var textPath = new TextPath();
                // if track is a path, reuse it
                if (!(track instanceof Path)) {
                    // create path element
                    track = this.defs().path(track);
                }
                // link textPath to path and add content
                textPath.attr('href', '#' + track, xlink);
                // Transplant all nodes from text to textPath
                var node;
                if (importNodes) {
                    while (node = this.node.firstChild) {
                        textPath.node.appendChild(node);
                    }
                }
                // add textPath element as child node and return textPath
                return this.put(textPath);
            }),
            // Get the textPath children
            textPath: function () {
                return this.findOne('textPath');
            }
        },
        Path: {
            // creates a textPath from this path
            text: wrapWithAttrCheck(function (text) {
                // Convert text to instance if needed
                if (!(text instanceof Text)) {
                    text = new Text().addTo(this.parent()).text(text);
                }
                // Create textPath from text and path and return
                return text.path(this);
            }),
            targets: function () {
                var _this_1 = this;
                return baseFind('svg textPath').filter(function (node) {
                    return (node.attr('href') || '').includes(_this_1.id());
                });
                // Does not work in IE11. Use when IE support is dropped
                // return baseFind('svg textPath[*|href*=' + this.id() + ']')
            }
        }
    });
    TextPath.prototype.MorphArray = PathArray;
    register(TextPath, 'TextPath');
    var Use = /** @class */ (function (_super) {
        __extends(Use, _super);
        function Use(node, attrs) {
            if (attrs === void 0) { attrs = node; }
            return _super.call(this, nodeOrNew('use', node), attrs) || this;
        }
        // Use element as a reference
        Use.prototype.use = function (element, file) {
            // Set lined element
            return this.attr('href', (file || '') + '#' + element, xlink);
        };
        return Use;
    }(Shape));
    registerMethods({
        Container: {
            // Create a use element
            use: wrapWithAttrCheck(function (element, file) {
                return this.put(new Use()).use(element, file);
            })
        }
    });
    register(Use, 'Use');
    /* Optional Modules */
    var SVG$1 = makeInstance;
    extend([Svg, Symbol, Image, Pattern, Marker], getMethodsFor('viewbox'));
    extend([Line, Polyline, Polygon, Path], getMethodsFor('marker'));
    extend(Text, getMethodsFor('Text'));
    extend(Path, getMethodsFor('Path'));
    extend(Defs, getMethodsFor('Defs'));
    extend([Text, Tspan], getMethodsFor('Tspan'));
    extend([Rect, Ellipse, Gradient, Runner], getMethodsFor('radius'));
    extend(EventTarget, getMethodsFor('EventTarget'));
    extend(Dom, getMethodsFor('Dom'));
    extend(Element, getMethodsFor('Element'));
    extend(Shape, getMethodsFor('Shape'));
    extend([Container, Fragment], getMethodsFor('Container'));
    extend(Gradient, getMethodsFor('Gradient'));
    extend(Runner, getMethodsFor('Runner'));
    List.extend(getMethodNames());
    registerMorphableType([SVGNumber, Color, Box, Matrix, SVGArray, PointArray, PathArray, Point]);
    makeMorphable();
    var svgMembers = {
        __proto__: null,
        A: A,
        Animator: Animator,
        Array: SVGArray,
        Box: Box,
        Circle: Circle,
        ClipPath: ClipPath,
        Color: Color,
        Container: Container,
        Controller: Controller,
        Defs: Defs,
        Dom: Dom,
        Ease: Ease,
        Element: Element,
        Ellipse: Ellipse,
        EventTarget: EventTarget,
        ForeignObject: ForeignObject,
        Fragment: Fragment,
        G: G,
        Gradient: Gradient,
        Image: Image,
        Line: Line,
        List: List,
        Marker: Marker,
        Mask: Mask,
        Matrix: Matrix,
        Morphable: Morphable,
        NonMorphable: NonMorphable,
        Number: SVGNumber,
        ObjectBag: ObjectBag,
        PID: PID,
        Path: Path,
        PathArray: PathArray,
        Pattern: Pattern,
        Point: Point,
        PointArray: PointArray,
        Polygon: Polygon,
        Polyline: Polyline,
        Queue: Queue,
        Rect: Rect,
        Runner: Runner,
        SVG: SVG$1,
        Shape: Shape,
        Spring: Spring,
        Stop: Stop,
        Style: Style,
        Svg: Svg,
        Symbol: Symbol,
        Text: Text,
        TextPath: TextPath,
        Timeline: Timeline,
        TransformBag: TransformBag,
        Tspan: Tspan,
        Use: Use,
        adopt: adopt,
        assignNewId: assignNewId,
        clearEvents: clearEvents,
        create: create,
        defaults: defaults,
        dispatch: dispatch,
        easing: easing,
        eid: eid,
        extend: extend,
        find: baseFind,
        getClass: getClass,
        getEventTarget: getEventTarget,
        getEvents: getEvents,
        getWindow: getWindow,
        makeInstance: makeInstance,
        makeMorphable: makeMorphable,
        mockAdopt: mockAdopt,
        namespaces: namespaces,
        nodeOrNew: nodeOrNew,
        off: off,
        on: on,
        parser: parser,
        regex: regex,
        register: register,
        registerMorphableType: registerMorphableType,
        registerWindow: registerWindow,
        restoreWindow: restoreWindow,
        root: root,
        saveWindow: saveWindow,
        utils: utils,
        windowEvents: windowEvents,
        withWindow: withWindow,
        wrapWithAttrCheck: wrapWithAttrCheck
    };
    // The main wrapping element
    function SVG(element, isHTML) {
        return makeInstance(element, isHTML);
    }
    Object.assign(SVG, svgMembers);
    return SVG;
})();
//# sourceMappingURL=svg.js.map
//# sourceMappingURL=svg.js.map