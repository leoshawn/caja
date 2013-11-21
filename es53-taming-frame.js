/**
 * @fileOverview caja catch iframe box exception
 *               enhance the JS Error Object
 */
(function(win, log){
    if(!log){
        return;
    }
	var OldError = win.Error;
    win.Error = function(msg){
        log.sendTamingErrorLog(msg, window.frameElement);
        return new OldError(msg);
    };

    var OldEvalError = win.EvalError;
    win.EvalError = function(msg){
        log.sendTamingErrorLog(msg, window.frameElement);
        return new OldEvalError(msg);
    };

    var OldRangeError = win.RangeError;
    win.RangeError = function(msg){
        log.sendTamingErrorLog(msg, window.frameElement);
        return new OldRangeError(msg);
    };

    var OldReferenceError = win.ReferenceError;
    win.ReferenceError = function(msg){
        log.sendTamingErrorLog(msg, window.frameElement);
        return new OldReferenceError(msg);
    };

    var OldSyntaxError = win.SyntaxError;
    win.SyntaxError = function(msg){
        log.sendTamingErrorLog(msg, window.frameElement);
        return new OldSyntaxError(msg);
    };

    var OldTypeError = win.TypeError;
    win.TypeError = function(msg){
        log.sendTamingErrorLog(msg, window.frameElement);
        return new OldTypeError(msg);
    };

    var OldURIError = win.URIError;
    win.URIError = function(msg){
        log.sendTamingErrorLog(msg, window.frameElement);
        return new OldURIError(msg);
    };


})(window, parent.shop_log);;
// Copyright (C) 2008 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * This file combines the JSON.parse method defined by the original
 * json_sans_eval.js with the stringify method from the original
 * json2.js. Like json2.js, it defines a JSON object if one does not
 * already exist, and it initializes its parse and stringify methods
 * only if JSON does not currently have such methods (functions at
 * those property names). Additionally, if there is no
 * <tt>Date.prototype.toJSON</tt>, this file defines an ES5 compliant
 * one as well as the <tt>toJSON</tt> methods for <tt>String</tt>,
 * <tt>Number</tt>, and <tt>Boolean</tt>. The latter three are no
 * longer part of ES5, but are expected by the parts of this file
 * derived from json2.js.
 *
 * Of course, the reason this is included in the Caja distribution is
 * so that Caja can expose an ES5 compliant but Caja-safe JSON object
 * to cajoled code. Caja's wrapping of the provided JSON therefore
 * must work with either a real ES5 JSON or the one defined in this
 * file. To do so, Caja uses the replacer and reviver
 * hooks. Fortunately, ES5 and json2.js both specify that only own
 * properties of an object are stringified, and the the replacer is
 * called on the result of a <tt>toJSON</tt> call, making it possible
 * for the replacer to do its job.
 *
 * Comment from original json2.js:
 *
    http://www.JSON.org/json2.js
    2009-08-17

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    Based on json2.js from http://www.JSON.org/js.html
    but with the parse method to be provided by json_sans_eval.js

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
 *
 * Comment from original json_sans_eval.js:
 *
 * Parses a string of well-formed JSON text.
 *
 * If the input is not well-formed, then behavior is undefined, but it is
 * deterministic and is guaranteed not to modify any object other than its
 * return value.
 *
 * This does not use `eval` so is less likely to have obscure security bugs than
 * json2.js.
 * It is optimized for speed, so is much faster than json_parse.js.
 *
 * This library should be used whenever security is a concern (when JSON may
 * come from an untrusted source), speed is a concern, and erroring on malformed
 * JSON is *not* a concern.
 *
 *                      Pros                   Cons
 *                    +-----------------------+-----------------------+
 * json_sans_eval.js  | Fast, secure          | Not validating        |
 *                    +-----------------------+-----------------------+
 * json_parse.js      | Validating, secure    | Slow                  |
 *                    +-----------------------+-----------------------+
 * json2.js           | Fast, some validation | Potentially insecure  |
 *                    +-----------------------+-----------------------+
 *
 * json2.js is very fast, but potentially insecure since it calls `eval` to
 * parse JSON data, so an attacker might be able to supply strange JS that
 * looks like JSON, but that executes arbitrary javascript.
 * If you do have to use json2.js with untrusted data, make sure you keep
 * your version of json2.js up to date so that you get patches as they're
 * released.
 *
 * @param {string} json per RFC 4627
 * @param {function} opt_reviver optional function that reworks JSON objects
 *     post-parse per Chapter 15.12 of EcmaScript3.1.
 *     If supplied, the function is called with a string key, and a value.
 *     The value is the property of 'this'.  The reviver should return
 *     the value to use in its place.  So if dates were serialized as
 *     {@code { "type": "Date", "time": 1234 }}, then a reviver might look like
 *     {@code
 *     function (key, value) {
 *       if (value && typeof value === 'object' && 'Date' === value.type) {
 *         return new Date(value.time);
 *       } else {
 *         return value;
 *       }
 *     }}.
 *     If the reviver returns {@code undefined} then the property named by key
 *     will be deleted from its container.
 *     {@code this} is bound to the object containing the specified property.
 * @return {Object|Array}
 * @author Mike Samuel <mikesamuel@gmail.com>
 */

/*if (typeof Date.prototype.toJSON !== 'function') {
  Date.prototype.toJSON = function (key) {
    return isFinite(this.valueOf()) ?
    this.getUTCFullYear()   + '-' +
    f(this.getUTCMonth() + 1) + '-' +
    f(this.getUTCDate())      + 'T' +
    f(this.getUTCHours())     + ':' +
    f(this.getUTCMinutes())   + ':' +
    f(this.getUTCSeconds())   + 'Z' : null;
  };

  String.prototype.toJSON =
  Number.prototype.toJSON =
  Boolean.prototype.toJSON = function (key) {
    return this.valueOf();
  };
}*/

var json_sans_eval = parent.KISSY.JSON;

   /* (function() {

        var hop = Object.hasOwnProperty;

        ///////////////////// from json2.js //////////////////////////

        function f(n) {
            // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }

        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap,
            indent,
            meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"' : '\\"',
                '\\': '\\\\'
            },
            rep;


        function quote(string) {

            // If the string contains no control characters, no quote
            // characters, and no
            // backslash characters, then we can safely slap some quotes around it.
            // Otherwise we must also replace the offending characters with safe escape
            // sequences.

            escapable.lastIndex = 0;
            return escapable.test(string) ?
                '"' + string.replace(escapable, function (a) {
                    var c = meta[a];
                    return typeof c === 'string' ? c :
                        '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                }) + '"' :
                '"' + string + '"';
        }


        function str(key, holder) {

            // Produce a string from holder[key].

            var i,          // The loop counter.
                k,          // The member key.
                v,          // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.

            if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // If we were called with a replacer function, then call the replacer to
            // obtain a replacement value.

            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }

            // What happens next depends on the value's type.

            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':

                    // JSON numbers must be finite. Encode non-finite numbers as null.

                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':

                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.

                    return String(value);

                // If the type is 'object', we might be dealing with an object
                // or an array or
                // null.

                case 'object':

                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.

                    if (!value) {
                        return 'null';
                    }

                    // Make an array to hold the partial results of stringifying
                    // this object value.

                    gap += indent;
                    partial = [];

                    // Is the value an array?

                    if (Object.prototype.toString.apply(value) === '[object Array]') {

                        // The value is an array. Stringify every element. Use null
                        // as a placeholder
                        // for non-JSON values.

                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas,
                        // and wrap them in
                        // brackets.

                        v = partial.length === 0 ? '[]' :
                            gap ? '[\n' + gap +
                                partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                                '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // If the replacer is an array, use it to select the members to
                    // be stringified.

                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            k = rep[i];
                            if (typeof k === 'string') {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    } else {

                        // Otherwise, iterate through all of the keys in the object.

                        for (k in value) {
                            if (hop.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.

                    v = partial.length === 0 ? '{}' :
                        gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                            mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }

        function stringify (value, replacer, space) {

            // The stringify method takes a value and an optional replacer,
            // and an optional space parameter, and returns a JSON
            // text. The replacer can be a function that can replace
            // values, or an array of strings that will select the keys. A
            // default replacer method can be provided. Use of the space
            // parameter can produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

            // If the space parameter is a number, make an indent string
            // containing that
            // many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

                // If the space parameter is a string, it will be used as the
                // indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('json_sans_eval.stringify');
            }

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.

            return str('', {'': value});
        }

        var number
            = '(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)';
        var oneChar = '(?:[^\\0-\\x08\\x0a-\\x1f\"\\\\]'
            + '|\\\\(?:[\"/\\\\bfnrt]|u[0-9A-Fa-f]{4}))';
        var string = '(?:\"' + oneChar + '*\")';

        // Will match a value in a well-formed JSON file.
        // If the input is not well-formed, may match strangely, but not in an unsafe
        // way.
        // Since this only matches value tokens, it does not match
        // whitespace, colons,
        // or commas.
        var significantToken = new RegExp(
            '(?:false|true|null|[\\{\\}\\[\\]]'
                + '|' + number
                + '|' + string
                + ')', 'g');

        // Matches escape sequences in a string literal
        var escapeSequence = new RegExp('\\\\(?:([^u])|u(.{4}))', 'g');

        // Decodes escape sequences in object literals
        var escapes = {
            '"': '"',
            '/': '/',
            '\\': '\\',
            'b': '\b',
            'f': '\f',
            'n': '\n',
            'r': '\r',
            't': '\t'
        };
        function unescapeOne(_, ch, hex) {
            return ch ? escapes[ch] : String.fromCharCode(parseInt(hex, 16));
        }

        // A non-falsy value that coerces to the empty string when used as a key.
        var EMPTY_STRING = new String('');
        var SLASH = '\\';

        var completeToken = new RegExp(
            '(?:false|true|null|[ \t\r\n]+|[\\{\\}\\[\\],:]'
                + '|' + number
                + '|' + string
                + '|.)', 'g');

        function blank(arr, s, e) { while (--e >= s) { arr[e] = ''; } }

        function checkSyntax(text, keyFilter) {
            var toks = ('' + text).match(completeToken);
            var i = 0, n = toks.length;
            checkArray();
            if (i < n) {
                throw new Error('Trailing tokens ' + toks.slice(i - 1).join(''));
            }
            return toks.join('');

            function checkArray() {
                while (i < n) {
                    var t = toks[i++];
                    switch (t) {
                        case ']': return;
                        case '[': checkArray(); break;
                        case '{': checkObject(); break;
                    }
                }
            }
            function checkObject() {
                // For the tokens    {  "a"  :  null  ,  "b" ...
                // the state is         0    1  2     3  0
                var state = 0;
                // If we need to sanitize instead of validating, uncomment:
                // var skip = 0;  // The index of the first token to skip or 0.
                while (i < n) {
                    var t = toks[i++];
                    switch (t.charCodeAt(0)) {
                        case 0x09: case 0x0a: case 0x0d: case 0x20: continue; // space chars
                        case 0x22: // "
                            var len = t.length;
                            if (len === 1) { throw new Error(t); }
                            if (state === 0) {
                                if (keyFilter && !keyFilter(
                                    t.substring(1, len - 1)
                                        .replace(escapeSequence, unescapeOne))) {
                                    throw new Error(t);
                                    // If we need to sanitize instead of validating, uncomment:
                                    // skip = i - 1;
                                }
                            } else if (state !== 2) { throw new Error(t); }
                            break;
                        case 0x27: throw new Error(t);  // '
                        case 0x2c: // ,
                            if (state !== 3) { throw new Error(t); }
                            state = 0;
                            // If we need to sanitize instead of validating, uncomment:
                            // if (skip) { blank(toks, skip, i); skip = 0; }
                            continue;
                        case 0x3a: // :
                            if (state !== 1) { throw new Error(t); }
                            break;
                        case 0x5b:  // [
                            if (state !== 2) { throw new Error(t); }
                            checkArray();
                            break;
                        case 0x7b:  // {
                            if (state !== 2) { throw new Error(t); }
                            checkObject();
                            break;
                        case 0x7d:  // }
                            // If we need to sanitize instead of validating, uncomment:
                            // if (skip) { blank(toks, skip, i - 1); skip = 0; }
                            return;
                        default:
                            if (state !== 2) { throw new Error(t); }
                            break;
                    }
                    ++state;
                }
            }
        };

        function parse (json, opt_reviver) {
            // Split into tokens
            var toks = json.match(significantToken);
            // Construct the object to return
            var result;
            var tok = toks[0];
            if ('{' === tok) {
                result = {};
            } else if ('[' === tok) {
                result = [];
            } else {
                throw new Error(tok);
            }

            // If undefined, the key in an object key/value record to use
            // for the next
            // value parsed.
            var key;
            // Loop over remaining tokens maintaining a stack of
            // uncompleted objects and
            // arrays.
            var stack = [result];
            for (var i = 1, n = toks.length; i < n; ++i) {
                tok = toks[i];

                var cont;
                switch (tok.charCodeAt(0)) {
                    default:  // sign or digit
                        cont = stack[0];
                        cont[key || cont.length] = +(tok);
                        key = void 0;
                        break;
                    case 0x22:  // '"'
                        tok = tok.substring(1, tok.length - 1);
                        if (tok.indexOf(SLASH) !== -1) {
                            tok = tok.replace(escapeSequence, unescapeOne);
                        }
                        cont = stack[0];
                        if (!key) {
                            if (cont instanceof Array) {
                                key = cont.length;
                            } else {
                                key = tok || EMPTY_STRING;  // Use as key for next value seen.
                                break;
                            }
                        }
                        cont[key] = tok;
                        key = void 0;
                        break;
                    case 0x5b:  // '['
                        cont = stack[0];
                        stack.unshift(cont[key || cont.length] = []);
                        key = void 0;
                        break;
                    case 0x5d:  // ']'
                        stack.shift();
                        break;
                    case 0x66:  // 'f'
                        cont = stack[0];
                        cont[key || cont.length] = false;
                        key = void 0;
                        break;
                    case 0x6e:  // 'n'
                        cont = stack[0];
                        cont[key || cont.length] = null;
                        key = void 0;
                        break;
                    case 0x74:  // 't'
                        cont = stack[0];
                        cont[key || cont.length] = true;
                        key = void 0;
                        break;
                    case 0x7b:  // '{'
                        cont = stack[0];
                        stack.unshift(cont[key || cont.length] = {});
                        key = void 0;
                        break;
                    case 0x7d:  // '}'
                        stack.shift();
                        break;
                }
            }
            // Fail if we've got an uncompleted object.
            if (stack.length) { throw new Error(); }

            if (opt_reviver) {
                // Based on walk as implemented in http://www.json.org/json2.js
                var walk = function (holder, key) {
                    var value = holder[key];
                    if (value && typeof value === 'object') {
                        var toDelete = null;
                        for (var k in value) {
                            if (hop.call(value, k) && value !== holder) {
                                // Recurse to properties first.  This has the effect of causing
                                // the reviver to be called on the object graph depth-first.

                                // Since 'this' is bound to the holder of the property, the
                                // reviver can access sibling properties of k including ones
                                // that have not yet been revived.

                                // The value returned by the reviver is used in place of the
                                // current value of property k.
                                // If it returns undefined then the property is deleted.
                                var v = walk(value, k);
                                if (v !== void 0) {
                                    value[k] = v;
                                } else {
                                    // Deleting properties inside the loop has vaguely defined
                                    // semantics in ES3.
                                    if (!toDelete) { toDelete = []; }
                                    toDelete.push(k);
                                }
                            }
                        }
                        if (toDelete) {
                            for (var i = toDelete.length; --i >= 0;) {
                                delete value[toDelete[i]];
                            }
                        }
                    }
                    return opt_reviver.call(holder, key, value);
                };
                result = walk({ '': result }, '');
            }

            return result;
        }

        return {
            checkSyntax: checkSyntax,
            parse: parse,
            stringify: stringify
        };
    })();*/

if (typeof JSON === 'undefined') { var JSON = {}; }
if (typeof JSON.stringify !== 'function') {
  JSON.stringify = json_sans_eval.stringify;
}
if (typeof JSON.parse !== 'function') {
  JSON.parse = json_sans_eval.parse;
}
;
// Copyright (C) 2007 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview the ES5/3 runtime library.
 *
 * <p>It is written in Javascript, not ES5, and would be rejected by the
 * ES53Rewriter. This module exports two globals intended for normal use:<ol>
 * <li>"___" for use by the output of the ES53Rewriter and by some
 *     other untranslated Javascript code.
 * <li>"es53" providing some common services to the ES5/3 programmer.
 * </ol>
 * <p>It also exports the following additional globals:<ul>
 * <li>"safeJSON" why is this being exported?
 * </ul>
 *
 * @author metaweta@gmail.com
 * @requires this, json_sans_eval
 * @provides ___, es53, safeJSON
 * @overrides Array, Boolean, Date, Function, Number, Object, RegExp, String
 * @overrides Error, EvalError, RangeError, ReferenceError, SyntaxError,
 *   TypeError, URIError
 * @overrides escape, JSON
 */

var ___, cajaVM, safeJSON;

(function () {
    // For computing the [[Class]] internal property
    var classProp = Object.prototype.toString;
    // Given an object defined in an es53 frame, we can tell which
    // Object.prototype it inherits from.
    Object.prototype.baseProto___ = Object.prototype;

    var slice = Array.prototype.slice;
    var push = Array.prototype.push;


    // Workarounds for FF2 and FF3.0 for
    // https://bugzilla.mozilla.org/show_bug.cgi?id=507453

    var antidote = function() {
        return void 0;
    };

    function deodorize(original, end) {
        if (original.__defineGetter__) {
            for (var i = end; i < 0; ++i) {
                original.__defineGetter__(i, antidote);
            }
        }
    }

    function isDeodorized(original, sprop) {
        if (original.__lookupGetter__) {
            return original.__lookupGetter__(sprop) === antidote;
        }
        return false;
    }

    // Blacklist built from:
    // http://www.thespanner.co.uk/2009/07/14/hidden-firefox-properties-revisited/
    // [args, actuals length, callee, formals length, func name, caller]
    // firefox ??§»?????????js???????, caja ?????????§»"??????"????????? ????????§³????????????????? comment by shiba
    deodorize(Function.prototype, -6);

    // [string length]
    deodorize(String.prototype, -1);

    // [source, global, ignore case, last index, multiline, sticky]
    deodorize(RegExp.prototype, -6);

    // [input, multiline, last match, last capture, lcontext, rcontext]
    deodorize(RegExp, -6);

    /**
     * Caja-specific properties
     *
     * Caja combines all numeric properties and uses the special name
     * {@code NUM___} to refer to the single property descriptor.
     * Numeric properties must be enumerable data properties.
     * If the special descriptor is absent, it defaults to
     * {writable:true, configurable:true, enumerable:true, get:void 0, set:void 0}
     *
     * Note that each of the six attributes starts with a different letter.
     * Each property has eight associated properties: six for the attributes
     * and two for writable and callable fastpath flags
     *
     * {@code obj[name + '_v___'] === obj}  means that {@code name} is
     *                                      a data property on {@code obj}.
     * {@code obj.hasOwnProperty(name + '_v___') &&
     *       obj[name + '_v___'] === false} means that {@code name} is an
     *                                      accessor property on {@code obj}.
     * {@code obj[name + '_w___'] === obj}  means that {@code name} is
     *                                      writable (fastpath).
     * {@code obj[name + '_gw___'] === obj} means that {@code name} is
     *                                      writable (grant).
     * {@code obj[name + '_c___'] === obj}  means that {@code name} is
     *                                      configurable.
     * {@code obj[name + '_e___'] === obj}  means that {@code name} is
     *                                      enumurable.
     * {@code obj[name + '_g___']}          is the getter for
     *                                      {@code name} on {@code obj}.
     * {@code obj[name + '_s___']}          is the setter for
     *                                      {@code name} on {@code obj}.
     * {@code obj[name + '_m___'] === obj}  means that {@code name} is
     *                                      callable as a method (fastpath).
     *
     * To prevent accidental misinterpretation of the above inherited
     * attribute descriptors, whenever any are defined for a given
     * {@code obj} and {@code name}, all eight must be. If {@code name}
     * is a string encoding of a number (i.e., where {@code name ===
     * String(+name)}), then all of the above attributes must not be
     * defined directly for {@code name}. Instead, the effective
     * attributes of {@code name} are covered by the actual attributes
     * of {@code 'NUM___'}.
     *
     * Another property suffix commonly used in the code is for virtualized
     * methods; since innocent code and existing host code like domita rely
     * on the original bindings of primordial methods, guest code should not
     * be allowed to change the original bindings; {@code virtualize} installs
     * ES5 getters and setters that store the guest view of the property.
     *
     * {@code obj[name + '_virt___']}       is the virtual version of a primordial
     *                                      method that's exposed to guest code.
     *
     * Per-object properties:
     *
     * {@code obj.ne___ === obj}            means that {@code obj} is not
     *                                      extensible.
     * {@code obj.z___ === obj}             means that {@code obj} is frozen.
     * {@code '___' in obj}                 means that {@code obj} is a global
     *                                      object and shouldn't be used as
     *                                      'this'.
     * {@code obj.UNCATCHABLE___ === true}  means that {@code obj} may not be
     *                                      caught by a cajoled {@code catch}.
     *
     * {@code obj.v___(p)}                  = {@code obj.[[Get]](p)}
     * {@code obj.w___(p,v)}                = {@code obj.[[Put]](p,v)}
     * {@code obj.c___(p)}                  = {@code obj.[[Delete]](p)}
     * {@code obj.m___(p, [as])}            invokes {@code p} as a method safely;
     *                                      it may set the {@code '_m___'}
     *                                      fastpath on {@code obj}.
     *
     * {@code g.f___(dis, [as])}            is the tamed version of {@code g},
     *                                      though it uses {@code apply}'s
     *                                      interface.
     * {@code g.i___(as)}                   = g.f___(USELESS, [as])
     * {@code g.new___(as)}                 is the tamed version of {@code g}
     *                                      used for constructing an object of
     *                                      class {@code g}.
     * {@code ___.tamesTo(feral, tamed)}    installs inverse properties
     *                                      {@code feral.TAMED_TWIN___ = tamed},
     *                                      {@code tamed.FERAL_TWIN___ = feral}.
     * {@code ___.tame(obj)}                uses the {@code *_TWIN___} fastpath.
     *                                      if possible; if that fails, it invokes
     *                                      explicit taming functions.
     * {@code ___.untame(obj)}              is similar, but goes the other way.
     *
     * Since creating function instances is a common pattern and reading
     * properties of a function instance is not, we defer whitelisting the
     * prototype, length, and name properties.
     *
     * {@code f.name___}                    holds the value of the deferred name
     *                                      property of a function instance until
     *                                      it's installed.
     */

    // We have to define it even on Firefox, since the built-in slice doesn't
    // throw when given null or undefined.
    Array.slice = markFunc(function (dis, startIndex) { // , endIndex
        dis = ToObject(dis);
        if (arguments.length > 2) {
            var edIndex = arguments[2];
            return slice.call(dis, startIndex, endIndex);
        } else {
            return slice.call(dis, startIndex);
        }
    });

    // Missing on IE
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(fun) { //, thisp
            var dis = ToObject(this);
            var len = dis.length >>> 0;
            if ('function' !== typeof fun) {
                throw new TypeError("Expected function but got " + (typeof fun));
            }

            var thisp = arguments[1];
            for (var i = 0; i < len; i++) {
                if (i in dis) {
                    fun.call(thisp, dis[i], i, dis);
                }
            }
        };
    }

    ////////////////////////////////////////////////////////////////////////
    // Functions to walk the prototype chain
    ////////////////////////////////////////////////////////////////////////

    /**
     * An object is prototypical iff its 'constructor' property points
     * at a genuine function whose 'prototype' property points back at
     * it.
     */
    function isPrototypical(obj) {
        if ((typeof obj) !== 'object') {
            return false;
        }
        if (obj === null) {
            return false;
        }
        var constr = obj.constructor;
        if ((typeof constr) !== 'function') {
            return false;
        }
        return constr.prototype === obj;
    }

    var BASE_OBJECT_CONSTRUCTOR = {};

    /**
     * Returns the 'constructor' property of obj's prototype.
     * <p>
     * By "obj's prototype", we mean the prototypical object that obj
     * most directly inherits from, not the value of its 'prototype'
     * property. We memoize the apparent prototype into 'Prototype___' to
     * speed up future queries.
     * <p>
     * If obj is a function or not an object, return undefined.
     * <p>
     * If the object is determined to be directly constructed by the 'Object'
     * function in *some* frame, we return distinguished marker value
     * BASE_OBJECT_CONSTRUCTOR.
     */
    function directConstructor(obj) {
        if (obj === null) {
            return void 0;
        }
        if (obj === void 0) {
            return void 0;
        }
        if ((typeof obj) !== 'object') {
            // Regarding functions, since functions return undefined,
            // directConstructor() doesn't provide access to the
            // forbidden Function constructor.
            // Otherwise, we don't support finding the direct constructor
            // of a primitive.
            return void 0;
        }
        var result;
        if (obj.hasOwnProperty('Prototype___')) {
            var proto = obj.Prototype___;
            // At this point we know that (typeOf(proto) === 'object')
            if (proto === null) {
                return void 0;
            }
            result = proto.constructor;
            // rest of: if (!isPrototypical(result))
            if (result.prototype !== proto || (typeof result) !== 'function') {
                result = directConstructor(proto);
            }
        } else {
            if (!obj.hasOwnProperty('constructor')) {
                // TODO(erights): Detect whether this is a valid constructor
                // property in the sense that result is a proper answer. If
                // not, at least give a sensible error, which will be hard to
                // phrase.
                result = obj.constructor;
            } else {
                var oldConstr = obj.constructor;
                // TODO(erights): This code assumes that any 'constructor' property
                // revealed by deleting the own 'constructor' must be the constructor
                // we're interested in.
                if (delete obj.constructor) {
                    result = obj.constructor;
                    obj.constructor = oldConstr;
                } else if (isPrototypical(obj)) {
                    log('Guessing the directConstructor of : ' + obj);
                    return BASE_OBJECT_CONSTRUCTOR;
                } else {
                    throw new TypeError('Discovery of direct constructors unsupported '
                        + 'when the constructor property is not deletable: '
                        + obj + '.constructor === ' + oldConstr);
                }
            }

            if ((typeof result) !== 'function' || !(obj instanceof result)) {
                if (obj === obj.baseProto___) {
                    return void 0;
                }
                if(result.constructor.FERAL_FRAME_OBJECT___=== result.constructor){
                    return BASE_OBJECT_CONSTRUCTOR;
                }
                throw new TypeError('Discovery of direct constructors for foreign '
                    + 'begotten objects not implemented on this platform');
            }
            if (result.prototype.constructor === result) {
                // Memoize, so it'll be faster next time.
                obj.Prototype___ = result.prototype;
            }
        }
        // If the result is marked as the 'Object' constructor from some feral
        // frame, return the distinguished marker value.
        if (result === result.FERAL_FRAME_OBJECT___) {
            return BASE_OBJECT_CONSTRUCTOR;
        }
        // If the result is the 'Object' constructor from some Caja frame,
        // return the distinguished marker value.
        if (result === obj.CAJA_FRAME_OBJECT___) {
            return BASE_OBJECT_CONSTRUCTOR;
        }
        return result;
    }

    ////////////////////////////////////////////////////////////////////////
    // Primitive objective membrane
    ////////////////////////////////////////////////////////////////////////

    // Property whitelisting markers on tamings of host objects. This is disjoint
    // from the ES5/3 property descriptor material to allow local reasoning about
    // the taming layer in isolation. The markers are deliberately inheritable
    // via the prototype chain.
    //
    // Attribute suffixes ending with '_twl___' (for "taming white list") are
    // claimed by this implementation.
    //
    // For any given property called 'name', and a tamed twin 't', we have:
    //
    //   t[name + '_r_twl___'] is truthy    means 'name' is tamed as whitelisted
    //                                      for reading
    //
    //   t[name + '_w_twl___'] is truthy    means 'name' is tamed as whitelisted
    //                                      for writing or deleting
    //
    //   t[name + '_m_twl___'] is truthy    means 'name' is tamed as whitelisted
    //                                      for invocation as a method
    //
    // Additionally, the following marker is supported:
    //
    //   t['readonly_twl___'] is truthy     means the tame object 't' is tamed
    //                                      such that it appears to Caja code as
    //                                      read-only.

    // TODO(ihab.awad): Test that host objects created using beget() -- in other
    // words, their prototype is neither 'Object' nor the prototype of a
    // previously tamed constructor function -- behave safely (even if the
    // behavior is a corner case).

    // The arguments to the following functions are as follows:
    //     t      -- a tamed twin
    //     mode   -- one of 'r', 'w' or 'm'
    //     p      -- a property name

    function isWhitelistedProperty(t, mode, p) {
        return !!t[p + '_' + mode + '_twl___'];
    }

    function whitelistProperty(t, mode, p) {
        t[p + '_' + mode + '_twl___'] = t;
    }

    function isWhitelistedReadOnly(t) {
        return !!t['readonly_twl___'];
    }

    function whitelistReadOnly(t) {
        t['readonly_twl___'] = t;
    }

    /**
     * Records that f is t's feral twin and t is f's tame twin.
     * <p>
     * A <i>feral</i> object is one safe to make accessible to trusted
     * but possibly innocent uncajoled code. A <i>tame</i> object is one
     * safe to make accessible to untrusted cajoled
     * code. ___tamesTo(f, t) records that f is feral, that t is tamed,
     * and that they are in one-to-one correspondence so that
     * ___.tame(f) === t and ___.untame(t) === f.
     * <p>
     * All primitives already tame and untame to themselves, so tamesTo
     * only accepts non-primitive arguments. The characteristic of being
     * marked tame or feral only applies to the object itself, not to
     * objects which inherit from it. TODO(erights): We should probably
     * check that a derived object does not get markings that conflict
     * with the markings on its base object.
     * <p>
     * Unlike the subjective membranes created by Domita, in this one,
     * the objects in a tame/feral pair point directly at each other,
     * and thereby retain each other. So long as one is non-garbage the
     * other will be as well.
     */
    function tamesTo(f, t) {
        var ftype = typeof f;
        if (!f || (ftype !== 'function' && ftype !== 'object')) {
            throw new TypeError('Unexpected feral primitive: ', f);
        }
        var ttype = typeof t;
        if (!t || (ttype !== 'function' && ttype !== 'object')) {
            throw new TypeError('Unexpected tame primitive: ', t);
        }

        if (f.TAMED_TWIN___ === t && t.FERAL_TWIN___ === f) {
            throw new TypeError('Attempt to multiply tame: ' + f + ', ' + t);
        }

        // TODO(erights): Given that we maintain the invariant that
        // (f.TAMED_TWIN___ === t && hasOwnProp(f, 'TAMED_TWIN___')) iff
        // (t.FERAL_TWIN___ === f && hasOwnProp(t, 'FERAL_TWIN___')), then we
        // could decide to more delicately rely on this invariant and test
        // the backpointing rather than hasOwnProp below.
        if (f.TAMED_TWIN___ && f.hasOwnProperty('TAMED_TWIN___')) {
            throw new TypeError('Inconsistently tames to something: ', f);
        }
        if (t.FERAL_TWIN___ && t.hasOwnProperty('FERAL_TWIN___')) {
            throw new TypeError('Inconsistently untames to something: ', t);
        }

        f.TAMED_TWIN___ = t;
        t.FERAL_TWIN___ = f;
    }

    /**
     * Private utility functions to tame and untame arrays.
     */
    function tameArray(fa) {
        var ta = [];
        for (var i = 0; i < fa.length; i++) {
            ta[i] = tame(fa[i]);
        }
        return freeze(ta);
    }

    function untameArray(ta) {
        var fa = [];
        for (var i = 0; i < ta.length; i++) {
            fa[i] = untame(ta[i]);
        }
        return fa;
    }

    /**
     * Returns a tame object representing f, or undefined on failure.
     * <ol>
     * <li>All primitives tame and untame to themselves. Therefore,
     *     undefined is only a valid failure indication after checking
     *     that the argument is not undefined.
     * <li>If f has a registered tame twin, return that.
     * <li>If f is a Record, call tameRecordWithPureFunctions(f).
     *     We break Records out as a special case since the only thing
     *     all Records inherit from is Object.prototype, which everything
     *     else inherits from as well.
     * <li>If f is a Function, call tameFunction(f).
     * <li>Indicate failure by returning undefined.
     * </ol>
     * Record taming does not (yet?) deal with record inheritance.
     */
    function tame(f) {
        if (!f) {
            return f;
        }
        // Here we do use the backpointing test as a cheap hasOwnProp test.
        if (f.TAMED_TWIN___ && f.TAMED_TWIN___.FERAL_TWIN___ === f) {
            return f.TAMED_TWIN___;
        }
        var ftype = typeof f;
        if (ftype !== 'function' && ftype !== 'object') {
            // Primitive value; tames to self
            return f;
        } else if (isArray(f)) {
            // No tamesTo(...) for arrays; we copy across the membrane
            return tameArray(f);
        }
        if (isDefinedInCajaFrame(f)) {
            return f;
        }
        var t = void 0;
        if (ftype === 'object') {
            var ctor = directConstructor(f);
            if (ctor === void 0) {
                throw new TypeError('Cannot determine ctor of: ' + f);
            } else if (ctor === BASE_OBJECT_CONSTRUCTOR) {
                t = tameRecord(f);
            } else {
                t = tamePreviouslyConstructedObject(f, ctor);
            }
        } else if (ftype === 'function') {
            // If not previously tamed via a 'markTameAs*' call, then it is
            // not a whitelisted function and should be neutered
            t = void 0;
        }
        if (t) {
            tamesTo(f, t);
        }
        return t;
    }

    function makeWhitelistingHasProperty(t, f, propertyModesToCheck) {
        return function(p) {
            p = '' + p;
            if (!(p in f)) {
                return false;
            }
            if (isNumericName(p)) {
                return false;
            }
            // 'propertyModesToCheck' is always statically defined to have
            // one or two elements. This method is *not* linear in the number
            // of properties an object has.
            for (var i = 0; i < propertyModesToCheck.length; i++) {
                if (isWhitelistedProperty(t, propertyModesToCheck[i], p)) {
                    return true;
                }
            }
            return false;
        };
    }

    function makeEnumerate(t, f) {
        return function() {
            var tt = t;
            var ff = f;
            var result = {};
            for (var p in f) {
                if (t.HasProperty___(p)) {
                    result.DefineOwnProperty___(p, {enumerable: true});
                }
            }
            return result;
        };
    }

    function addFunctionPropertyHandlers(t, f) {
        t.v___ = function (p) {  // [[Get]]
            p = '' + p;
            if (p === 'call' || p === 'bind' || p === 'apply') {
                return Function.prototype.v___.call(t, p);
            }
            if (isNumericName(p)) {
                return void 0;
            }
            if (!endsWith__.test(p)) {
                if (isWhitelistedProperty(t, 'r', p)) {
                    return tame(f[p]);
                }
            }
            return void 0;
        };
        t.w___ = function (p, v) {  // [[Put]]
            p = '' + p;
            if (!isNumericName(p) && !endsWith__.test(p)) {
                if (isWhitelistedProperty(t, 'w', p) && !isWhitelistedReadOnly(t)) {
                    f[p] = untame(v);
                    return v;
                }
            }
            throw new TypeError('Not writeable: ' + p);
        };
        t.c___ = function (p) {  // [[Delete]]
            p = '' + p;
            if (!isNumericName(p) && !endsWith__.test(p)) {
                if (isWhitelistedProperty(t, 'w', p) && !isWhitelistedReadOnly(t)) {
                    if (delete f[p]) {
                        return true;
                    }
                }
            }
            throw new TypeError('Not deleteable: ' + p);
        };
        t.HasProperty___ = makeWhitelistingHasProperty(t, f, [ 'r' ]);
        t.e___ = makeEnumerate(t, f);
    }

    function tameCtor(f, fSuper, name) {
        // TODO(ihab.awad): assign 'name'
        var instantiator = function () {
        };
        instantiator.prototype = f.prototype;

        var tPrototype = (function() {
            if (!fSuper || (fSuper === fSuper.FERAL_FRAME_OBJECT___)) {
                return {};
            }
            var tSuper = fSuper.TAMED_TWIN___;
            if (!tSuper) {
                throw new TypeError('Super ctor not yet tamed');
            }
            function tmp() {
            }

            tmp.prototype = tSuper.prototype;
            return new tmp();
        })();

        whitelistProperty(tPrototype, 'r', 'constructor');
        tameObjectWithMethods(f.prototype, tPrototype);
        tamesTo(f.prototype, tPrototype);

        var t = markFunc(function (_) {
            if (arguments.length > 0
                && arguments[0] === TAME_CTOR_CREATE_OBJECT_ONLY) {
                return;
            }
            var o = new instantiator();
            f.apply(o, untameArray(arguments));
            tameObjectWithMethods(o, this);
            tamesTo(o, this);
        });
        t.prototype = tPrototype;
        tPrototype.constructor = t;
        t.IS_TAMED_CTOR___ = t;

        addFunctionPropertyHandlers(t, f);

        whitelistProperty(t, 'r', 'prototype');

        return t;
    }

    function tamePureFunction(f, name) {
        // TODO(ihab.awad): assign 'name'
        var t = markFunc(function(_) {
            // Since it's by definition useless, there's no reason to bother
            // passing untame(USELESS); we just pass USELESS itself.
            return tame(f.apply(USELESS, untameArray(arguments)));
        });

        addFunctionPropertyHandlers(t, f);

        return t;
    }

    function tameXo4a(f, name) {
        // TODO(ihab.awad): assign 'name'
        var t = markFunc(function(_) {
            return tame(f.apply(untame(this), untameArray(arguments)));
        });

        addFunctionPropertyHandlers(t, f);

        return t;
    }

    function tameRecord(f, t) {
        if (!t) {
            t = {};
        }
        t.v___ = function (p) {  // [[Get]]
            p = '' + p;
            if (isNumericName(p)) {
                return void 0;
            }
            if (!endsWith__.test(p)) {
                return tame(f[p]);
            }
            return void 0;
        };
        t.w___ = function (p, v) {  // [[Put]]
            p = '' + p;
            if (!isNumericName(p) && !endsWith__.test(p)) {
                if (!isWhitelistedReadOnly(t)) {
                    f[p] = untame(v);
                    return v;
                }
            }
            throw new TypeError('Not writeable: ' + p);
        };
        t.c___ = function (p) {  // [[Delete]]
            p = '' + p;
            if (!isNumericName(p) && !endsWith__.test(p)) {
                if (!isWhitelistedReadOnly(t)) {
                    if (delete f[p]) {
                        return true;
                    }
                    return;
                }
            }
            throw new TypeError('Not deleteable: ' + p);
        };
        t.m___ = function (p, as) {  // invoke method
            p = '' + p;
            var tf = t.v___(p);
            if ((typeof tf) === 'function') {
                // The property value is whitelisted to tame to a function, so call it
                return tf.apply(USELESS, as);
            }
            throw new TypeError('Not a function: ' + p);
        };
        t.HasProperty___ = function(p) {
            p = '' + p;
            if (!(p in f)) {
                return false;
            }
            return !isNumericName(p) && !endsWith__.test(p);
        };
        t.e___ = makeEnumerate(t, f);

        return t;
    }

    function tameObjectWithMethods(f, t) {
        if (!t) {
            t = {};
        }
        t.v___ = function (p) {  // [[Get]]
            p = '' + p;
            var fv = f[p];
            var fvt = typeof fv;
            if (fvt === 'function' && p === 'constructor') {
                // Special case to retrieve 'constructor' property,
                // which we automatically whitelist for reading
                return tame(f[p]);
            } else {
                if (fvt === 'function' && p !== 'constructor') {
                    if (isWhitelistedProperty(t, 'm', p)) {
                        return markFuncFreeze(function (_) {
                            return tame(f[p].apply(f, untameArray(arguments)));
                        });
                    }
                } else if (isWhitelistedProperty(t, 'r', p)) {
                    return tame(f[p]);
                }
            }
            return void 0;
        };
        t.w___ = function (p, v) {  // [[Put]]
            p = '' + p;
            if (!isNumericName(p) && !endsWith__.test(p)) {
                if (isWhitelistedProperty(t, 'w', p) && !isWhitelistedReadOnly(t)) {
                    f[p] = untame(v);
                    return v;
                }
            }
            throw new TypeError('Not writeable: ' + p);
        };
        t.c___ = function (p) {  // [[Delete]]
            p = '' + p;
            if (!isNumericName(p) && !endsWith__.test(p)) {
                if (isWhitelistedProperty(t, 'w', p) && !isWhitelistedReadOnly(t)) {
                    if (delete f[p]) {
                        return true;
                    }
                }
            }
            throw new TypeError('Not deleteable: ' + p);
        };
        t.m___ = function (p, as) {  // invoke method
            p = '' + p;
            if (!isNumericName(p) && !endsWith__.test(p)) {
                if (typeof f[p] === 'function') {
                    if (isWhitelistedProperty(t, 'm', p)) {
                        return tame(f[p].apply(f, untameArray(as)));
                    }
                }
            }
            throw new TypeError('Not a function: ' + p);
        };
        t.HasProperty___ = makeWhitelistingHasProperty(t, f, [ 'r', 'm' ]);
        t.e___ = makeEnumerate(t, f);

        return t;
    }

    function tamePreviouslyConstructedObject(f, fc) {
        var tc = tame(fc);
        if (tc && tc.IS_TAMED_CTOR___) {
            var t = new tc(TAME_CTOR_CREATE_OBJECT_ONLY);
            tameObjectWithMethods(f, t);
            return t;
        } else {
            return void 0;
        }
    }

    /**
     * Returns a feral object representing t, or undefined on failure.
     * <ol>
     * <li>All primitives tame and untame to themselves. Therefore,
     *     undefined is only a valid failure indication after checking
     *     that the argument is not undefined.
     * <li>If t has a registered feral twin, return that.
     */
    function untame(t) {
        if (!t) {
            return t;
        }
        // Here we do use the backpointing test as a cheap hasOwnProp test.
        if (t.FERAL_TWIN___ && t.FERAL_TWIN___.TAMED_TWIN___ === t) {
            return t.FERAL_TWIN___;
        }
        var ttype = typeof t;
        if (ttype !== 'function' && ttype !== 'object') {
            // Primitive value; untames to self
            return t;
        } else if (isArray(t)) {
            // No tamesTo(...) for arrays; we copy across the membrane
            return untameArray(t);
        }
        if (!isDefinedInCajaFrame(t)) {
            throw new TypeError('Host object leaked without being tamed');
        }
        var f = void 0;
        if (ttype === 'object') {
            var ctor = directConstructor(t);
            if (ctor === BASE_OBJECT_CONSTRUCTOR) {
                f = untameCajaRecord(t);
            } else {
                throw new TypeError(
                    'Untaming of guest constructed objects unsupported: ' + t);
            }
        } else if (ttype === 'function') {
            f = untameCajaFunction(t);
        }
        if (f) {
            tamesTo(f, t);
        }
        return f;
    }

    function untameCajaRecord(t) {
        var f = {};
        eviscerate(t, f);
        tameRecord(f, t);
        return f;
    }

    function untameCajaFunction(t) {
        // Taming of *constructors* which are defined in Caja is unsupported.
        // We tame all functions defined in Caja as xo4a (they receive the
        // 'this' value supplied by the host-side caller because the
        // ES53 compiler adds the necessary checks to make sure the
        // 'this' value they receive is safe.
        return function(_) {
            return untame(t.apply(tame(this), tameArray(arguments)));
        };
    }

    function eviscerate(t, f) {
        var k;
        for (k in t) {
            if (!t.hasOwnProperty(k)) {
                continue;
            }
            if (!endsWith__.test(k)) {
                f[k] = untame(t[k]);
            }
            if (!delete t[k]) {
                throw new TypeError(
                    'Eviscerating: ' + t + ' failed to delete prop: ' + k);
            }
        }
    }

    function markTameAsReadOnlyRecord(f) {
        if (isDefinedInCajaFrame(f)) {
            throw new TypeError('Taming controls not for Caja objects: ' + f);
        }
        if (f.TAMED_TWIN___) {
            throw new TypeError('Already tamed: ' + f);
        }
        var ftype = typeof f;
        if (ftype === 'object') {
            var ctor = directConstructor(f);
            if (ctor === BASE_OBJECT_CONSTRUCTOR) {
                var t = tameRecord(f);
                whitelistReadOnly(t);
                tamesTo(f, t);
                return f;
            } else {
                throw new TypeError('Not instanceof Object: ' + f);
            }
        } else {
            throw new TypeError('Not an object: ' + f);
        }
    }

    function markTameAsFunction(f, name) {
        if (isDefinedInCajaFrame(f)) {
            throw new TypeError('Taming controls not for Caja objects: ' + f);
        }
        if (f.TAMED_TWIN___) {
            throw new TypeError('Already tamed: ' + f);
        }
        var t = tamePureFunction(f);
        tamesTo(f, t);
        return f;
    }

    function markTameAsCtor(ctor, opt_super, name) {
        if (isDefinedInCajaFrame(ctor)) {
            throw new TypeError('Taming controls not for Caja objects: ' + ctor);
        }
        if (ctor.TAMED_TWIN___) {
            throw new TypeError('Already tamed: ' + ctor);
        }
        var ctype = typeof ctor;
        var stype = typeof opt_super;
        if (ctype !== 'function') {
            throw new TypeError('Cannot tame ' + ftype + ' as ctor');
        }
        if (opt_super && stype !== 'function') {
            throw new TypeError('Cannot tame ' + stype + ' as superclass ctor');
        }
        var t = tameCtor(ctor, opt_super, name);
        tamesTo(ctor, t);
        return ctor;
    }

    function markTameAsXo4a(f, name) {
        if (isDefinedInCajaFrame(f)) {
            throw new TypeError('Taming controls not for Caja objects: ' + f);
        }
        if (f.TAMED_TWIN___) {
            throw new TypeError('Already tamed: ' + f);
        }
        if ((typeof f) !== 'function') {
            throw new TypeError('Not a function: ' + f);
        }
        var t = tameXo4a(f);
        tamesTo(f, t);
        return f;
    }

    function grantTameAsMethod(ctor, name) {
        if (isDefinedInCajaFrame(ctor)) {
            throw new TypeError('Taming controls not for Caja objects: ' + ctor);
        }
        if (!ctor.TAMED_TWIN___) {
            throw new TypeError('Not yet tamed: ' + ctor);
        }
        if (!ctor.TAMED_TWIN___.IS_TAMED_CTOR___ === ctor.TAMED_TWIN___) {
            throw new TypeError('Not a tamed ctor: ' + ctor);
        }
        var tameProto = tame(ctor.prototype);
        whitelistProperty(tameProto, 'm', name);
    }

    function grantTameAsRead(f, name) {
        if (isDefinedInCajaFrame(f)) {
            throw new TypeError('Taming controls not for Caja objects: ' + f);
        }
        var t = tame(f);
        whitelistProperty(t, 'r', name);
    }

    function grantTameAsReadWrite(f, name) {
        if (isDefinedInCajaFrame(f)) {
            throw new TypeError('Taming controls not for Caja objects: ' + f);
        }
        var t = tame(f);
        whitelistProperty(t, 'r', name);
        whitelistProperty(t, 'w', name);
    }

    /**
     * Initialize argument constructor <i>feralCtor</i> so that it
     * represents a "subclass" of argument constructor <i>someSuper</i>,
     * and return a non-invokable taming of <i>feralCtor</i>.
     *
     * Given:
     *
     *   function FeralFoo() { ... some uncajoled constructor ... }
     *   var Foo = extend(FeralFoo, FeralSuper, 'Foo');
     *
     * it will be the case that:
     *
     *   new FeralFoo() instanceof Foo
     *
     * however -- and this is the crucial property -- cajoled code will get an
     * error if it invokes either of:
     *
     *   new Foo()
     *   Foo()
     *
     * This allows us to expose the tame Foo to cajoled code, allowing
     * it to sense that all the FeralFoo instances we give it are
     * instanceof Foo, without granting to cajoled code the means to
     * create any new such instances.
     *
     * extend() also sets <i>feralCtor</i>.prototype to set up the
     * prototype chain so that
     *
     *   new FeralFoo() instanceof FeralSuper
     * and
     *   new FeralFoo() instanceof Super
     *
     * @param feralCtor An feral-only uncajoled constructor. This must
     *        NOT be exposed to cajoled code by any other mechanism.
     * @param someSuper Some constructor representing the
     *        superclass. This can be <ul>
     *        <li>a feralCtor that had been provided as a first argument
     *            in a previous call to extend(),
     *        <li>an inertCtor as returned by a previous call to
     *            extend(), or
     *        <li>a constructor that has been marked as such by ___.markCtor().
     *        </ul>
     *        In all cases, someSuper.prototype.constructor must be
     *        a constructor that has been marked as such by
     *        ___.markCtor().
     * @param opt_name If the returned inert constructor is made
     *        available this should be the property name used.
     *
     * @return a tame inert class constructor as described above.
     */
    function extend(feralCtor, someSuper, opt_name) {
        if (!('function' === typeof feralCtor)) {
            fail('Internal: Feral constructor is not a function');
        }
        someSuper = someSuper.prototype.constructor;
        var noop = function () {
        };
        if (someSuper.new___ === noop.new___) {
            throw new TypeError('Internal: toxic function encountered!');
        }
        noop.prototype = someSuper.prototype;
        feralCtor.prototype = new noop();
        feralCtor.prototype.Prototype___ = someSuper.prototype;

        var inert = function() {
            throw new TypeError('This constructor cannot be called directly.');
        };

        inert.prototype = feralCtor.prototype;
        feralCtor.prototype.constructor = inert;
        tamesTo(feralCtor, inert);
        return markFuncFreeze(inert);
    }

    /**
     * A marker for all objects created within a Caja frame.
     */
    Object.prototype.CAJA_FRAME_OBJECT___ = Object;

    function isDefinedInCajaFrame(o) {
        return !!o.CAJA_FRAME_OBJECT___;
    }

    /**
     * The property descriptor for numerics
     */
    Object.prototype.NUM____v___ = Object.prototype;
    Object.prototype.NUM____gw___ = false;
    Object.prototype.NUM____w___ = false;
    Object.prototype.NUM____m___ = false;
    Object.prototype.NUM____c___ = false;
    Object.prototype.NUM____e___ = Object.prototype;
    Object.prototype.NUM____g___ = void 0;
    Object.prototype.NUM____s___ = void 0;
    Object.prototype.hasNumerics___ = function () {
        return this.NUM____v___ === this;
    };

    function isFrozen(obj) {
        return obj.z___ === obj;
    }

    /**
     * The property descriptor for array lengths
     */
    // This flag is only used when doing a dynamic lookup of the length property.
    Array.prototype.length_v___ = false;
    Array.prototype.length_gw___ = false;
    Array.prototype.length_w___ = false;
    Array.prototype.length_m___ = false;
    Array.prototype.length_c___ = false;
    Array.prototype.length_e___ = false;

    /**
     * Setter for {@code length}.  This is necessary because
     * shortening an array by setting its length may delete numeric properties.
     */
    Array.prototype.length_s___ = markFunc(function (val) {
        // Freezing an array needs to freeze the length property.
        if (this.z___ === this) {
            throw new TypeError('Cannot change the length of a frozen array.');
        }
        val = ToUint32(val);
        // Since increasing the length does not add properties,
        // we don't need to check extensibility.
        if (val >= this.length) {
            return this.length = val;
        }
        // Decreasing the length may delete properties, so
        // we need to check that numerics are configurable.
        if (!this.hasNumerics___() || this.NUM____c___ === this) {
            return this.length = val;
        }
        throw new TypeError(
            'Shortening the array may delete non-configurable elements.');
    });

    /**
     * Getter for {@code length}.  Only necessary for returning
     * a property descriptor map and dynamic lookups, since reading
     * {@code length} is automatically whitelisted.
     */
    Array.prototype.length_g___ = markFunc(function () {
        return this.length;
    });

    // Replace {@code undefined} and {@code null} by
    // {@code USELESS} for use as {@code this}.  If dis is a global
    // (which we try to detect by looking for the ___ property),
    // then we throw an error (external hull breach).
    function safeDis(dis) {
        if (dis === null || dis === void 0) {
            return USELESS;
        }
        if (Type(dis) !== 'Object') {
            return dis;
        }
        if ('___' in dis) {
            var err = new Error('Internal: toxic global!');
            err.UNCATCHABLE___ = true;
            throw err;
        }
        return dis;
    }

    var endsWith__ = /__$/;
    var endsWith_e___ = /(.*?)_e___$/;
    var endsWith_v___ = /(.*?)_v___$/;
    var startsWithNUM___ = /^NUM___/;

    function assertValidPropertyName(P) {
        if (endsWith__.test(P)) {
            throw new TypeError('Properties may not end in double underscore.');
        }
    }

    function callFault(var_args) {
        var err = new Error('Internal: toxic function encountered!');
        err.UNCATCHABLE___ = true;
        throw err;
    }

    /**
     * Returns the getter, if any, associated with the accessor property
     * {@code name}.
     *
     * Precondition:
     * {@code obj} must not be {@code null} or {@code undefined}.
     * {@code name} must be a string or a number.
     * Postcondition:
     * If {@code name} is a number, a string encoding of a number, or
     * the string {@code 'NUM___'}, then we must return {@code undefined}.
     */
    function getter(obj, name) {
        return obj[name + '_g___'];
    }

    /**
     * Returns the setter, if any, associated with the accessor property
     * {@code name}.
     *
     * Precondition:
     * {@code obj} must not be {@code null} or {@code undefined}.
     * {@code name} must be a string or a number.
     * Postcondition:
     * If {@code name} is a number, a string encoding of a number, or
     * the string {@code 'NUM___'}, then we must return {@code undefined}.
     */
    function setter(obj, name) {
        return obj[name + '_s___'];
    }

    /**
     * Precondition:
     * {@code obj} must not be {@code null} or {@code undefined}.
     * {@code name} must be a string or a number.
     * Postcondition:
     * If {@code name} is a number, a string encoding of a number, or
     * the string {@code 'NUM___'}, then we must return {@code false}.
     */
    function hasAccessor(obj, name) {
        var valueFlag = name + '_v___';
        return valueFlag in obj && !obj[valueFlag];
    }

    /**
     * Precondition:
     * {@code obj} must not be {@code null} or {@code undefined}.
     * {@code name} must be a string or a number.
     * Postcondition:
     * If {@code name} is a number, a string encoding of a number, or
     * the string {@code 'NUM___'}, then we must return {@code false}.
     */
    function hasOwnAccessor(obj, name) {
        var valueFlag = name + '_v___';
        return obj.hasOwnProperty(valueFlag) && !obj[valueFlag];
    }

    /**
     * Precondition:
     * {@code obj} must not be {@code null} or {@code undefined}.
     * {@code name} must be a string that is not the string encoding of
     *              a number; {@code name} may be {@code 'NUM___'}.
     */
    function fastpathWrite(obj, name) {
        obj[name + '_gw___'] = obj;
        obj[name + '_m___'] = false;
        obj[name + '_w___'] = obj;
    }

    /**
     * Precondition:
     * {@code obj} must not be {@code null} or {@code undefined}.
     * {@code name} must be a string that is not the string encoding of
     *              a number; {@code name} may be {@code 'NUM___'}.
     */
    function fastpathMethod(obj, name) {
        obj[name + '_w___'] = false;
        obj[name + '_m___'] = obj;
    }

    ////////////////////////////////////////////////////////////////////////
    // Creating defensible (transitively frozen) objects
    ////////////////////////////////////////////////////////////////////////

    // We defer actual definition of the structure since we cannot create the
    // necessary data structures (newTable()) yet
    var deferredDefended = [];
    var addToDefended = function(root) {
        deferredDefended.push(root);
    };

    var functionInstanceVoidNameGetter = markFunc(function() {
        return '';
    });
    // Must freeze in a separate step to break circular dependency
    addToDefended(freeze(functionInstanceVoidNameGetter));

    /**
     * We defer the creation of these properties until they're asked for.
     */
    function installFunctionInstanceProps(f) {
        var name = f.name___;
        delete f.name___;
        // Object.prototype.DefineOwnProperty___ may not be defined yet
        f.prototype_v___ = f;
        f.prototype_w___ = f;
        f.prototype_gw___ = f;
        f.prototype_c___ = false;
        f.prototype_e___ = false;
        f.prototype_g___ = void 0;
        f.prototype_s___ = void 0;
        f.prototype_m___ = false;
        f.length_v___ = f;
        f.length_w___ = false;
        f.length_gw___ = false;
        f.length_c___ = false;
        f.length_e___ = false;
        f.length_g___ = void 0;
        f.length_s___ = void 0;
        f.length_m___ = false;
        // Rhino prohibits setting the name property of function instances,
        // so we install a getter instead.
        f.name_v___ = false;
        f.name_w___ = false;
        f.name_gw___ = false;
        f.name_c___ = false;
        f.name_e___ = false;
        f.name_g___ = ((name === '')
            ? functionInstanceVoidNameGetter
            : markFuncFreeze(function() {
            return name;
        }));
        f.name_s___ = void 0;
        f.name_m___ = false;

        // Add to the list of defended (transitively frozen) objects so that
        // the def(...) function does not encounter these (newly created) functions
        // and go into an infinite loop freezing them.
        addToDefended(f.name_g___);
    }

    function deferredV(name) {
        delete this.v___;
        delete this.w___;
        delete this.c___;
        delete this.DefineOwnProperty___;
        installFunctionInstanceProps(this);
        // Object.prototype.v___ may not be defined yet
        return this.v___ ? this.v___(name) : void 0;
    }

    function deferredW(name, val) {
        delete this.v___;
        delete this.w___;
        delete this.c___;
        delete this.DefineOwnProperty___;
        installFunctionInstanceProps(this);
        return this.w___(name, val);
    }

    function deferredC(name) {
        delete this.v___;
        delete this.w___;
        delete this.c___;
        delete this.DefineOwnProperty___;
        installFunctionInstanceProps(this);
        return this.c___(name);
    }

    function deferredDOP(name, desc) {
        delete this.v___;
        delete this.w___;
        delete this.c___;
        delete this.DefineOwnProperty___;
        installFunctionInstanceProps(this);
        return this.DefineOwnProperty___(name, desc);
    }

    /**
     * For taming a simple function or a safe exophoric function (only reads
     * whitelisted properties of {@code this}).
     */
    function markFunc(fn, name) {
        if (!isFunction(fn)) {
            throw new TypeError('Expected a function instead of ' + fn);
        }
        if (fn.f___ !== Function.prototype.f___ &&
            fn.f___ !== fn.apply) {
            throw new TypeError('The function is already tamed ' +
                'or not from this frame.\n' + fn.f___);
        }
        fn.f___ = fn.apply;
        fn.new___ = fn;
        // Anonymous functions get a 'name' that is the empty string
        fn.name___ = ((name === '' || name === void 0)
            ? '' : '' + name);
        fn.v___ = deferredV;
        fn.w___ = deferredW;
        fn.c___ = deferredC;
        fn.DefineOwnProperty___ = deferredDOP;
        var p = fn.prototype;
        if (p && // must be truthy
            typeof p === 'object' && // must be an object
            // must not already have constructor whitelisted.
            !p.hasOwnProperty('constructor_v___')) {
            p.constructor_v___ = p;
            p.constructor_w___ = p;
            p.constructor_gw___ = p;
            p.constructor_c___ = p;
            p.constructor_e___ = false;
            p.constructor_g___ = void 0;
            p.constructor_s___ = void 0;
            p.constructor_m___ = false;
        }
        return fn;
    }

    /**
     * Declares that it is safe for cajoled code to call this as a
     * function.
     *
     * <p>This may be because it's this-less, or because it's a cajoled
     * function that sanitizes its this on entry.
     */
    function markSafeFunc(fn, name) {
        markFunc(fn, name);
        fn.i___ = fn;
        return fn;
    }

    function markFuncFreeze(fn, name) {
        return freeze(markFunc(fn, name));
    }

    /**
     * Is the property {@code name} whitelisted as a value on {@code obj}?
     *
     * Precondition:
     * {@code obj} must not be {@code null} or {@code undefined}.
     * {@code name} must be a string that is not the string encoding
     *              of a number; {@code name} may be {@code 'NUM___'}.
     */
    function hasValue(obj, name) {
        // This doesn't need an "|| name === 'NUM___'" since, for all obj,
        // (obj.NUM____v___) is truthy
        return !!obj[name + '_v___'];
    }

    /**
     * Is the property {@code name} whitelisted as an own value on {@code obj}?
     *
     * Precondition:
     * {@code obj} must not be {@code null} or {@code undefined}.
     * {@code name} must be a string that is not the string encoding
     *              of a number; {@code name} may be {@code 'NUM___'}.
     */
    function hasOwnValue(obj, name) {
        return obj[name + '_v___'] === obj || name === 'NUM___';
    }

    /**
     * Precondition:
     * {@code obj} must not be {@code null} or {@code undefined}.
     * {@code name} must be a string that is not the string encoding
     *              of a number; {@code name} may be {@code 'NUM___'}.
     */
    function guestHasOwnProperty(obj, name) {
        return obj.hasOwnProperty(name + '_v___') || name === 'NUM___';
    }

    /**
     * Tests whether the fast-path _w___ flag is set, or grantWrite() has been
     * called, on this object itself as an own (non-inherited) attribute.
     *
     * Precondition:
     * {@code obj} must not be {@code null} or {@code undefined}.
     * {@code name} must be a string that is not the string encoding
     *              of a number; {@code name} may be {@code 'NUM___'}.
     */
    function isWritable(obj, name) {
        if (obj[name + '_w___'] === obj) {
            return true;
        }
        if (obj[name + '_gw___'] === obj) {
            obj[name + '_m___'] = false;
            obj[name + '_w___'] = obj;
            return true;
        }
        // Frozen and preventExtensions implies hasNumerics
        if (name === 'NUM___' && !obj.hasNumerics___()) {
            obj.NUM____v___ = obj;
            obj.NUM____gw___ = obj;
            obj.NUM____w___ = false;
            obj.NUM____c___ = obj;
            obj.NUM____e___ = obj;
            obj.NUM____g___ = void 0;
            obj.NUM____s___ = void 0;
            obj.NUM____m___ = false;
            return true;
        }
        return false;
    }

    /**
     * Tests whether {@code grantEnumerate} has been called on the property
     * {@code name} of this object or one of its ancestors.
     *
     * Precondition:
     * {@code obj} must not be {@code null} or {@code undefined}.
     * {@code name} must be a string that is not the string encoding
     *              of a number; {@code name} may be {@code 'NUM___'}.
     */
    function isEnumerable(obj, name) {
        // This doesn't need an "|| name === 'NUM___'" since, for all obj,
        // (obj.NUM____e___) is truthy
        return !!obj[name + '_e___'];
    }

    /**
     * Tests whether {@code grantConfigure} has been called on the property
     * {@code name} of this object or one of its ancestors.
     *
     * Precondition:
     * {@code obj} must not be {@code null} or {@code undefined}.
     * {@code name} must be a string that is not the string encoding
     *     of a number; {@code name} may be 'NUM___'.
     */
    function isConfigurable(obj, name) {
        return obj[name + '_c___'] === obj ||
            (name === 'NUM___' && !obj.hasNumerics___());
    }

    function isExtensible(obj) {
        return Type(obj) === 'Object' && obj.ne___ !== obj;
    }

    /**
     * Tests whether an assignment to {@code obj[name]} would extend the object.
     *
     * Precondition:
     * {@code obj} must not be {@code null} or {@code undefined}.
     * {@code name} must be a string.
     */
    function wouldExtend(obj, name) {
        // Would assigning to a numeric index extend the object?
        if (isNumericName(name)) {
            return !obj.hasOwnProperty(name);
        }
        // If name is an own data property, then writing to it won't extend obj.
        if (hasOwnValue(obj, name)) {
            return false;
        }
        // If name is an inherited accessor property, invoking the
        // setter won't extend obj. (In any uncajoled setter where it
        // might, the taming must throw an error instead.)
        if (obj[name + '_s___']) {
            return false;
        }
        return true;
    }

    function isArray(obj) {
        return classProp.call(obj) === '[object Array]';
    }

    function isFunction(obj) {
        return classProp.call(obj) === '[object Function]';
    }

    function isError(obj) {
        return classProp.call(obj) === '[object Error]';
    }

    /**
     * Get the enumerable property names, both own and inherited.
     *
     * <p>ES-Harmony proposal <a href=
     * "http://wiki.ecmascript.org/doku.php?id=harmony:proxies_semantics#modifications_to_the_evaluation_of_expressions_and_statements"
     * >The for-in Statement</a>.
     */
    Object.prototype.e___ = function() {
        return this;
    };

    function allKeys(obj) {
        var i, m, result = [];
        for (i in obj) {
            if (isNumericName(i)) {
                result.push(i);
            } else {
                if (startsWithNUM___.test(i) && endsWith__.test(i)) {
                    continue;
                }
                m = i.match(endsWith_v___);
                if (m) {
                    result.push(m[1]);
                }
            }
        }
        return result;
    }

    function ownEnumKeys(obj) {
        var i, m, result = [];
        for (i in obj) {
            if (!obj.hasOwnProperty(i)) {
                continue;
            }
            if (isNumericName(i)) {
                result.push(i);
            } else {
                if (startsWithNUM___.test(i) && endsWith__.test(i)) {
                    continue;
                }
                m = i.match(endsWith_e___);
                if (m && obj[i]) {
                    result.push(m[1]);
                }
            }
        }
        return result;
    }

    function ownKeys(obj) {
        var i, m, result = [];
        for (i in obj) {
            if (!obj.hasOwnProperty(i)) {
                continue;
            }
            if (isNumericName(i)) {
                result.push(i);
            } else {
                if (startsWithNUM___.test(i) && endsWith__.test(i)) {
                    continue;
                }
                m = i.match(endsWith_v___);
                if (m) {
                    result.push(m[1]);
                }
            }
        }
        return result;
    }

    function ownUntamedKeys(obj) {
        var i, m, result = [];
        for (i in obj) {
            if (obj.hasOwnProperty(i) && (isNumericName(i) || !endsWith__.test(i))) {
                result.push(i);
            }
        }
        return result;
    }

    /**
     * Returns a new object whose only utility is its identity and (for
     * diagnostic purposes only) its name.
     */
    function Token(name) {
        name = '' + name;
        return snowWhite({
            toString: markFuncFreeze(function tokenToString() {
                return name;
            }),
            throwable___: true
        });
    }

    /**
     * Checks if {@code n} is governed by the {@code NUM___} property descriptor.
     *
     * Preconditions:
     *   {@code typeof n === 'number'} or {@code 'string'}
     */
    function isNumericName(n) {
        return typeof n === 'number' || ('' + (+n)) === n;
    }

    ////////////////////////////////////////////////////////////////////////
    // JSON
    ////////////////////////////////////////////////////////////////////////
/*    virtualize(JSON, "parse");
    virtualize(JSON, "parse");*/
    //remove safeJSON ,use KISSY.JSON
    /*
    // TODO: Can all this JSON stuff be moved out of the TCB?
    function jsonParseOk(json) {
        try {
            var x = json.parse('{"a":3}');
            return x.a === 3;
        } catch (e) {
            return false;
        }
    }

    function jsonStringifyOk(json) {
        try {
            var x = json.stringify({'a':3, 'b__':4}, function replacer(k, v) {
                return (/__$/.test(k) ? void 0 : v);
            });
            if (x !== '{"a":3}') {
                return false;
            }
            // ie8 has a buggy JSON unless this update has been applied:
            //   http://support.microsoft.com/kb/976662
            // test for one of the known bugs.
            x = json.stringify(void 0, 'invalid');
            return x === void 0;
        } catch (e) {
            return false;
        }
    }


    var goodJSON = {};
    var parser = jsonParseOk(JSON) ? JSON.parse : json_sans_eval.parse;
    goodJSON.parse = markFunc(function () {
        return whitelistAll(parser.apply(this, arguments), true);
    });
    goodJSON.stringify = markFunc(jsonStringifyOk(JSON) ?
        JSON.stringify : json_sans_eval.stringify);

    safeJSON = snowWhite({
        CLASS___: 'JSON',
        parse: markFunc(function (text, opt_reviver) {
            var reviver = void 0;
            if (opt_reviver) {
                reviver = markFunc(function (key, value) {
                    return opt_reviver.f___(this, arguments);
                });
            }
            return goodJSON.parse(
                json_sans_eval.checkSyntax(
                    text,
                    function (key) {
                        return !endsWith__.test(key);
                    }),
                reviver);
        }),
        stringify: markFunc(function (obj, opt_replacer, opt_space) {
            switch (typeof opt_space) {
                case 'number':
                case 'string':
                case 'undefined':
                    break;
                default:
                    throw new TypeError('space must be a number or string');
            }
            var replacer;
            if (opt_replacer) {
                replacer = markFunc(function (key, value) {
                    if (!this.HasProperty___(key)) {
                        return void 0;
                    }
                    return opt_replacer.f___(this, arguments);
                });
            } else {
                replacer = markFunc(function (key, value) {
                    return (this.HasProperty___(key) || key === '') ?
                        value :
                        void 0;
                });
            }
            return goodJSON.stringify(obj, replacer, opt_space);
        })
    });*/


    ////////////////////////////////////////////////////////////////////////
    // Diagnostics and condition enforcement
    ////////////////////////////////////////////////////////////////////////

    /**
     * The initial default logging function does nothing.
     * <p>
     * Note: JavaScript has no macros, so even in the "does nothing"
     * case, remember that the arguments are still evaluated.
     */
    function defaultLogger(str, opt_stop) {
    }

    var myLogFunc = markFuncFreeze(defaultLogger);

    /**
     * Gets the currently registered logging function.
     */
    function getLogFunc() {
        return myLogFunc;
    }

    markFunc(getLogFunc);

    /**
     * Register newLogFunc as the current logging function, to be called
     * by {@code ___.log(str)}.
     * <p>
     * A logging function is assumed to have the signature
     * {@code (str, opt_stop)}, where<ul>
     * <li>{@code str} is the diagnostic string to be logged, and
     * <li>{@code opt_stop}, if present and {@code true}, indicates
     *     that normal flow control is about to be terminated by a
     *     throw. This provides the logging function the opportunity to
     *     terminate normal control flow in its own way, such as by
     *     invoking an undefined method, in order to trigger a Firebug
     *     stacktrace.
     * </ul>
     */
    function setLogFunc(newLogFunc) {
        myLogFunc = newLogFunc;
    }

    markFunc(setLogFunc);

    /**
     * Calls the currently registered logging function.
     */
    function log(str) {
        myLogFunc('' + str);
    }

    markFunc(log);

    /**
     * Like an assert that can't be turned off.
     * <p>
     * Either returns true (on success) or throws (on failure). The
     * arguments starting with {@code var_args} are converted to
     * strings and appended together to make the message of the Error
     * that's thrown.
     * <p>
     * TODO(erights) We may deprecate this in favor of <pre>
     *     if (!test) { throw new Error(var_args...); }
     * </pre>
     */
    function enforce(test, var_args) {
        if (!test) {
            throw new Error(slice.call(arguments, 1).join(''));
        }
        return true;
    }

    /**
     * Enforces {@code typeof specimen === typename}, in which case
     * specimen is returned.
     * <p>
     * If not, throws an informative TypeError
     * <p>
     * opt_name, if provided, should be a name or description of the
     * specimen used only to generate friendlier error messages.
     */
    function enforceType(specimen, typename, opt_name) {
        if (typeof specimen !== typename) {
            throw new TypeError('expected ' + typename + ' instead of ' +
                typeof specimen + ': ' + (opt_name || specimen));
        }
        return specimen;
    }

    /**
     * Enforces that specimen is a non-negative integer within the range
     * of exactly representable consecutive integers, in which case
     * specimen is returned.
     * <p>
     * "Nat" is short for "Natural number".
     */
    function enforceNat(specimen) {
        enforceType(specimen, 'number');
        if (Math.floor(specimen) !== specimen) {
            throw new TypeError('Must be integral: ' + specimen);
        }
        if (specimen < 0) {
            throw new TypeError('Must not be negative: ' + specimen);
        }
        // Could pre-compute precision limit, but probably not faster
        // enough to be worth it.
        if (Math.floor(specimen - 1) !== specimen - 1) {
            throw new TypeError('Beyond precision limit: ' + specimen);
        }
        if (Math.floor(specimen - 1) >= specimen) {
            throw new TypeError('Must not be infinite: ' + specimen);
        }
        return specimen;
    }

    /**
     * Returns a function that can typically be used in lieu of
     * {@code func}, but that logs a deprecation warning on first use.
     * <p>
     * Currently for internal use only, though may make this available
     * on {@code ___} or even {@code es53} at a later time, after
     * making it safe for such use. Forwards only arguments to
     * {@code func} and returns results back, without forwarding
     * {@code this}. If you want to deprecate an exophoric function,
     * deprecate a bind()ing of that function instead.
     */
    function deprecate(func, badName, advice) {
        var warningNeeded = true;
        return function() {
            if (warningNeeded) {
                log('"' + badName + '" is deprecated.\n' + advice);
                warningNeeded = false;
            }
            return func.apply(USELESS, arguments);
        };
    }

    /**
     * Create a unique identification of a given table identity that can
     * be used to invisibly (to Cajita code) annotate a key object to
     * index into a table.
     * <p>
     * magicCount and MAGIC_TOKEN together represent a
     * unique-across-frames value safe against collisions, under the
     * normal Caja threat model assumptions. magicCount and
     * MAGIC_NAME together represent a probably unique across frames
     * value, with which can generate strings in which collision is
     * unlikely but possible.
     * <p>
     * The MAGIC_TOKEN is a unique unforgeable per-Cajita runtime
     * value. magicCount is a per-Cajita counter, which increments each
     * time a new one is needed.
     */
    var magicCount = 0;
    var MAGIC_NUM = Math.random();
    var MAGIC_TOKEN = Token('MAGIC_TOKEN_FOR:' + MAGIC_NUM);
    // Using colons in the below causes it to fail on IE since getting a
    // property whose name contains a colon on a DOM table element causes
    // an exception.
    var MAGIC_NAME = '_index;' + MAGIC_NUM + ';';

    /**
     *
     * Creates a new mutable associative table mapping from the
     * identity of arbitrary keys (as defined by <tt>identical()</tt>) to
     * arbitrary values.
     *
     * <p>Operates as specified by <a href=
     * "http://wiki.ecmascript.org/doku.php?id=harmony:weak_maps"
     * >weak maps</a>, including the optional parameters of the old
     * <a href=
     * "http://wiki.ecmascript.org/doku.php?id=strawman:ephemeron_tables&rev=1269457867#implementation_considerations"
     * >Implementation Considerations</a> section regarding emulation on
     * ES3, except that, when {@code opt_useKeyLifetime} is falsy or
     * absent, the keys here may be primitive types as well.
     *
     * <p> To support Domita, the keys might be host objects.
     */
    function newTable(opt_useKeyLifetime, opt_expectedSize) {
        magicCount++;
        var myMagicIndexName = MAGIC_NAME + magicCount + '___';

        function setOnKey(key, value) {
            var ktype = typeof key;
            if (!key || (ktype !== 'function' && ktype !== 'object')) {
                throw new TypeError("Can't use key lifetime on primitive keys: " + key);
            }
            var list = key[myMagicIndexName];
            // To distinguish key from objects that derive from it,
            //    list[0] should be === key
            // For odd positive i,
            //    list[i] is the MAGIC_TOKEN for a Cajita runtime (i.e., a
            //            browser frame in which the Cajita runtime has been
            //            loaded). The myMagicName and the MAGIC_TOKEN
            //            together uniquely identify a table.
            //    list[i+1] is the value stored in that table under this key.
            if (!list || list[0] !== key) {
                key[myMagicIndexName] = [key, MAGIC_TOKEN, value];
            } else {
                var i;
                for (i = 1; i < list.length; i += 2) {
                    if (list[i] === MAGIC_TOKEN) {
                        break;
                    }
                }
                list[i] = MAGIC_TOKEN;
                list[i + 1] = value;
            }
        }

        function getOnKey(key) {
            var ktype = typeof key;
            if (!key || (ktype !== 'function' && ktype !== 'object')) {
                throw new TypeError("Can't use key lifetime on primitive keys: " + key);
            }
            var list = key[myMagicIndexName];
            if (!list || list[0] !== key) {
                return void 0;
            } else {
                for (var i = 1; i < list.length; i += 2) {
                    if (list[i] === MAGIC_TOKEN) {
                        return list[i + 1];
                    }
                }
                return void 0;
            }
        }

        if (opt_useKeyLifetime) {
            return snowWhite({
                set: markFuncFreeze(setOnKey),
                get: markFuncFreeze(getOnKey)
            });
        }

        var myValues = [];

        function setOnTable(key, value) {
            var index;
            switch (typeof key) {
                case 'object':
                case 'function':
                {
                    if (null === key) {
                        myValues.prim_null = value;
                        return;
                    }
                    index = getOnKey(key);
                    if (value === void 0) {
                        if (index === void 0) {
                            return;
                        } else {
                            setOnKey(key, void 0);
                        }
                    } else {
                        if (index === void 0) {
                            index = myValues.length;
                            setOnKey(key, index);
                        }
                    }
                    break;
                }
                case 'string':
                {
                    index = 'str_' + key;
                    break;
                }
                default:
                {
                    index = 'prim_' + key;
                    break;
                }
            }
            if (value === void 0) {
                // TODO(erights): Not clear that this is the performant
                // thing to do when index is numeric and < length-1.
                delete myValues[index];
            } else {
                myValues[index] = value;
            }
        }

        /**
         * If the key is absent, returns {@code undefined}.
         * <p>
         * Users of this table cannot distinguish an {@code undefined}
         * value from an absent key.
         */
        function getOnTable(key) {
            switch (typeof key) {
                case 'object':
                case 'function':
                {
                    if (null === key) {
                        return myValues.prim_null;
                    }
                    var index = getOnKey(key);
                    if (void 0 === index) {
                        return void 0;
                    }
                    return myValues[index];
                }
                case 'string':
                {
                    return myValues['str_' + key];
                }
                default:
                {
                    return myValues['prim_' + key];
                }
            }
        }

        return snowWhite({
            set: markFuncFreeze(setOnTable),
            get: markFuncFreeze(getOnTable)
        });
    }

    var registeredImports = [];

    /**
     * Gets or assigns the id associated with this (assumed to be)
     * imports object, registering it so that
     * <tt>getImports(getId(imports)) === imports</tt>.
     * <p>
     * This system of registration and identification allows us to
     * cajole html such as
     * <pre>&lt;a onmouseover="alert(1)"&gt;Mouse here&lt;/a&gt;</pre>
     * into html-writing JavaScript such as<pre>
     * IMPORTS___.document.innerHTML = "
     *  &lt;a onmouseover=\"
     *    (function(IMPORTS___) {
     *      IMPORTS___.alert(1);
     *    })(___.getImports(" + ___.getId(IMPORTS___) + "))
     *  \"&gt;Mouse here&lt;/a&gt;
     * ";
     * </pre>
     * If this is executed by a plugin whose imports is assigned id 42,
     * it generates html with the same meaning as<pre>
     * &lt;a onmouseover="___.getImports(42).alert(1)"&gt;Mouse here&lt;/a&gt;
     * </pre>
     * <p>
     * An imports is not registered and no id is assigned to it until the
     * first call to <tt>getId</tt>. This way, an imports that is never
     * registered, or that has been <tt>unregister</tt>ed since the last
     * time it was registered, will still be garbage collectable.
     */
    function getId(imports) {
        enforceType(imports, 'object', 'imports');
        var id;
        if ('id___' in imports) {
            id = enforceType(imports.id___, 'number', 'id');
        } else {
            id = imports.id___ = registeredImports.length;
        }
        registeredImports[id] = imports;
        return id;
    }

    /**
     * Gets the imports object registered under this id.
     * <p>
     * If it has been <tt>unregistered</tt> since the last
     * <tt>getId</tt> on it, then <tt>getImports</tt> will fail.
     */
    function getImports(id) {
        var result = registeredImports[enforceType(id, 'number', 'id')];
        if (result === void 0) {
            throw new Error('Internal: imports#', id, ' unregistered');
        }
        return result;
    }

    /**
     * If you know that this <tt>imports</tt> no longer needs to be
     * accessed by <tt>getImports</tt>, then you should
     * <tt>unregister</tt> it so it can be garbage collected.
     * <p>
     * After unregister()ing, the id is not reassigned, and the imports
     * remembers its id. If asked for another <tt>getId</tt>, it
     * reregisters itself at its old id.
     */
    function unregister(imports) {
        enforceType(imports, 'object', 'imports');
        if ('id___' in imports) {
            var id = enforceType(imports.id___, 'number', 'id');
            registeredImports[id] = void 0;
        }
    }

    ////////////////////////////////////////////////////////////////////////
    // Creating defensible (transitively frozen) objects.
    ////////////////////////////////////////////////////////////////////////

    var defended = newTable();
    /**
     * To define a defended object is to freeze it and all objects
     * transitively reachable from it via transitive reflective
     * property traversal.
     */

        // Defined where Object's methods are. 
    var origGetPrototypeOf, origGetOwnPropertyDescriptor;

    var def = markFuncFreeze(function(root) {
        var defending = newTable();
        var defendingList = [];

        function recur(val) {
            if (val !== Object(val) || defended.get(val) || defending.get(val)) {
                return;
            }
            defending.set(val, true);
            defendingList.push(val);
            freeze(val);
            recur(origGetPrototypeOf(val));
            ownKeys(val).forEach(function(p) {
                var desc = origGetOwnPropertyDescriptor(val, p);
                recur(desc.value);
                recur(desc.get);
                recur(desc.set);
            });
        }

        recur(root);
        defendingList.forEach(function(obj) {
            defended.set(obj, true);
        });
        return root;
    });

    addToDefended = markFuncFreeze(function(root) {
        defended.set(root, true);
    });

    deferredDefended.forEach(function(o) {
        addToDefended(o);
    });
    deferredDefended = void 0;

    ////////////////////////////////////////////////////////////////////////
    // Tokens
    ////////////////////////////////////////////////////////////////////////

    /**
     * When a {@code this} value must be provided but nothing is
     * suitable, provide this useless object instead.
     */
    var USELESS = Token('USELESS');

    /**
     * A unique value that should never be made accessible to untrusted
     * code, for distinguishing the absence of a result from any
     * returnable result.
     * <p>
     * See makeNewModuleHandler's getLastOutcome().
     */
    var NO_RESULT = Token('NO_RESULT');

    /**
     * A value that makes a tamed constructor merely instantiate a tamed twin
     * with the proper prototype chain and return, rather than completing the
     * semantics of the original constructor. This value is private to this file.
     */
    var TAME_CTOR_CREATE_OBJECT_ONLY = Token('TAME_CTOR_CREATE_OBJECT_ONLY');

    ////////////////////////////////////////////////////////////////////////
    // Guards and Trademarks
    ////////////////////////////////////////////////////////////////////////

    /**
     * The identity function just returns its argument.
     */
    function identity(x) {
        return x;
    }

    /**
     * One-arg form is known in scheme as "call with escape
     * continuation" (call/ec), and is the semantics currently
     * proposed for EcmaScript Harmony's "return to label".
     *
     * <p>In this analogy, a call to {@code callWithEjector} emulates a
     * labeled statement. The ejector passed to the {@code attemptFunc}
     * emulates the label part. The {@code attemptFunc} itself emulates
     * the statement being labeled. And a call to {@code eject} with
     * this ejector emulates the return-to-label statement.
     *
     * <p>We extend the normal notion of call/ec with an
     * {@code opt_failFunc} in order to give more the sense of a
     * {@code try/catch} (or similarly, the {@code escape} special
     * form in E). The {@code attemptFunc} is like the {@code try}
     * clause and the {@code opt_failFunc} is like the {@code catch}
     * clause. If omitted, {@code opt_failFunc} defaults to the
     * {@code identity} function.
     *
     * <p>{@code callWithEjector} creates a fresh ejector -- a one
     * argument function -- for exiting from this attempt. It then calls
     * {@code attemptFunc} passing that ejector as argument. If
     * {@code attemptFunc} completes without calling the ejector, then
     * this call to {@code callWithEjector} completes
     * likewise. Otherwise, if the ejector is called with an argument,
     * then {@code opt_failFunc} is called with that argument. The
     * completion of {@code opt_failFunc} is then the completion of the
     * {@code callWithEjector} as a whole.
     *
     * <p>The ejector stays live until {@code attemptFunc} is exited,
     * at which point the ejector is disabled. Calling a disabled
     * ejector throws.
     *
     * <p>In order to emulate the semantics I expect of ES-Harmony's
     * return-to-label and to prevent the reification of the internal
     * token thrown in order to emulate call/ec, {@code tameException}
     * immediately rethrows this token, preventing Cajita and Valija
     * {@code catch} clauses from catching it. However,
     * {@code finally} clauses will still be run while unwinding an
     * ejection. If these do their own non-local exit, that takes
     * precedence over the ejection in progress but leave the ejector
     * live.
     *
     * <p>Historic note: This was first invented by John C. Reynolds in
     * <a href="http://doi.acm.org/10.1145/800194.805852"
     * >Definitional interpreters for higher-order programming
     * languages</a>. Reynold's invention was a special form as in E,
     * rather than a higher order function as here and in call/ec.
     */
    function callWithEjector(attemptFunc, opt_failFunc) {
        var failFunc = opt_failFunc || identity;
        var disabled = false;
        var token = new Token('ejection');
        token.UNCATCHABLE___ = true;
        var stash = void 0;

        function ejector(result) {
            if (disabled) {
                throw new Error('ejector disabled');
            } else {
                // don't disable here.
                stash = result;
                throw token;
            }
        }

        markFuncFreeze(ejector);
        try {
            try {
                return attemptFunc.m___('call', [USELESS, ejector]);
            } finally {
                disabled = true;
            }
        } catch (e) {
            if (e === token) {
                return failFunc.m___('call', [USELESS, stash]);
            } else {
                throw e;
            }
        }
    }

    /**
     * Safely invokes {@code opt_ejector} with {@code result}.
     * <p>
     * If {@code opt_ejector} is falsy, disabled, or returns
     * normally, then {@code eject} throws. Under no conditions does
     * {@code eject} return normally.
     */
    function eject(opt_ejector, result) {
        if (opt_ejector) {
            opt_ejector.m___('call', [USELESS, result]);
            throw new Error('Ejector did not exit: ', opt_ejector);
        } else {
            throw new Error(result);
        }
    }

    /**
     * Internal routine for making a trademark from a table.
     * <p>
     * To untangle a cycle, the guard made by {@code makeTrademark} is
     * not yet either stamped or frozen. The caller of
     * {@code makeTrademark} must do both before allowing it to
     * escape.
     */
    function makeTrademark(typename, table) {
        typename = '' + typename;
        return snowWhite({
            toString: markFuncFreeze(function() {
                return typename + 'Mark';
            }),

            stamp: snowWhite({
                toString: markFuncFreeze(function() {
                    return typename + 'Stamp';
                }),
                mark___: markFuncFreeze(function(obj) {
                    table.set(obj, true);
                    return obj;
                })
            }),

            guard: snowWhite({
                toString: markFuncFreeze(function() {
                    return typename + 'T';
                }),
                coerce: markFuncFreeze(function(specimen, opt_ejector) {
                    if (table.get(specimen)) {
                        return specimen;
                    }
                    eject(opt_ejector,
                        'Specimen does not have the "' + typename + '" trademark');
                })
            })
        });
    }

    /**
     * Objects representing guards should be marked as such, so that
     * they will pass the {@code GuardT} guard.
     * <p>
     * {@code GuardT} is generally accessible as
     * {@code cajita.GuardT}. However, {@code GuardStamp} must not be
     * made generally accessible, but rather only given to code trusted
     * to use it to deem as guards things that act in a guard-like
     * manner: A guard MUST be immutable and SHOULD be idempotent. By
     * "idempotent", we mean that<pre>
     *     var x = g(specimen, ej); // may fail
     *     // if we're still here, then without further failure
     *     g(x) === x
     * </pre>
     */
    var GuardMark = makeTrademark('Guard', newTable(true));
    var GuardT = GuardMark.guard;
    var GuardStamp = GuardMark.stamp;
    freeze(GuardStamp.mark___(GuardT));

    /**
     * The {@code Trademark} constructor makes a trademark, which is a
     * guard/stamp pair, where the stamp marks and freezes unfrozen
     * records as carrying that trademark and the corresponding guard
     * cerifies objects as carrying that trademark (and therefore as
     * having been marked by that stamp).
     * <p>
     * By convention, a guard representing the type-like concept 'Foo'
     * is named 'FooT'. The corresponding stamp is 'FooStamp'. And the
     * record holding both is 'FooMark'. Many guards also have
     * {@code of} methods for making guards like themselves but
     * parameterized by further constraints, which are usually other
     * guards. For example, {@code T.ListT} is the guard representing
     * frozen array, whereas {@code T.ListT.of(cajita.GuardT)}
     * represents frozen arrays of guards.
     */
    function Trademark(typename) {
        var result = makeTrademark(typename, newTable(true));
        freeze(GuardStamp.mark___(result.guard));
        return result;
    }

    markFuncFreeze(Trademark);

    /**
     * First ensures that g is a guard; then does
     * {@code g.coerce(specimen, opt_ejector)}.
     */
    function guard(g, specimen, opt_ejector) {
        g = GuardT.coerce(g); // failure throws rather than ejects
        return g.coerce(specimen, opt_ejector);
    }

    /**
     * First ensures that g is a guard; then checks whether the specimen
     * passes that guard.
     * <p>
     * If g is a coercing guard, this only checks that g coerces the
     * specimen to something rather than failing. Note that trademark
     * guards are non-coercing, so if specimen passes a trademark guard,
     * then specimen itself has been marked with that trademark.
     */
    function passesGuard(g, specimen) {
        g = GuardT.coerce(g); // failure throws rather than ejects
        return callWithEjector(
            markFuncFreeze(function(opt_ejector) {
                g.coerce(specimen, opt_ejector);
                return true;
            }),
            markFuncFreeze(function(ignored) {
                return false;
            })
        );
    }

    /**
     * Given that {@code stamps} is a list of stamps and
     * {@code record} is a non-frozen object, this marks record with
     * the trademarks of all of these stamps, and then freezes and
     * returns the record.
     * <p>
     * If any of these conditions do not hold, this throws.
     */
    function stamp(stamps, record) {
        // TODO: Should nonextensible objects be stampable?
        if (isFrozen(record)) {
            throw new TypeError("Can't stamp frozen objects: " + record);
        }
        stamps = Array.slice(stamps, 0);
        var numStamps = stamps.length;
        // First ensure that we will succeed before applying any stamps to
        // the record.
        var i;
        for (i = 0; i < numStamps; i++) {
            if (!('mark___' in stamps[i])) {
                throw new TypeError("Can't stamp with a non-stamp: " + stamps[i]);
            }
        }
        for (i = 0; i < numStamps; i++) {
            // Only works for real stamps, postponing the need for a
            // user-implementable auditing protocol.
            stamps[i].mark___(record);
        }
        return freeze(record);
    }

    ////////////////////////////////////////////////////////////////////////
    // Sealing and Unsealing
    ////////////////////////////////////////////////////////////////////////

    /**
     * Returns a pair of functions such that the seal(x) wraps x in an object
     * so that only unseal can get x back from the object.
     * <p>
     * TODO(erights): The only remaining use as of this writing is
     * in domita for css. Perhaps a refactoring is in order.
     *
     * @return {object} of the form
     *     { seal: function seal(x) { return Token('(box)'); },
     *       unseal: function unseal(box) { return x; } }.
     */
    function makeSealerUnsealerPair() {
        var table = newTable(true);
        var undefinedStandin = {};

        function seal(payload) {
            if (payload === void 0) {
                payload = undefinedStandin;
            }
            var box = Token('(box)');
            table.set(box, payload);
            return box;
        }

        function unseal(box) {
            var payload = table.get(box);
            if (payload === void 0) {
                throw new TypeError('Sealer/Unsealer mismatch');
            } else if (payload === undefinedStandin) {
                return void 0;
            } else {
                return payload;
            }
        }

        return snowWhite({
            seal: markFuncFreeze(seal),
            unseal: markFuncFreeze(unseal)
        });
    }

    /**
     * A call to cajita.manifest(data) is dynamically ignored, but if the
     * data expression is valid static JSON text, its value is made
     * statically available to the module loader.
     * <p>
     * TODO(erights): Find out if this is still the plan.
     */
    function manifest(ignored) {
    }

    /**
     * Receives whatever was caught by a user defined try/catch block.
     *
     * @param ex A value caught in a try block.
     * @return The value to make available to the cajoled catch block.
     */
    function tameException(ex) {
        if (ex && ex.UNCATCHABLE___) {
            throw ex;
        }
        try {
            switch (typeof ex) {
                case 'string':
                case 'number':
                case 'boolean':
                case 'undefined':
                {
                    // Immutable.
                    return ex;
                }
                case 'object':
                {
                    if (ex === null) {
                        return null;
                    }
                    if (ex.throwable___) {
                        return ex;
                    }
                    if (isError(ex)) {
                        return freeze(ex);
                    }
                    return '' + ex;
                }
                case 'function':
                {
                    // According to Pratap Lakhsman's "JScript Deviations" S2.11
                    // If the caught object is a function, calling it within the catch
                    // supplies the head of the scope chain as the "this value".  The
                    // called function can add properties to this object.  This implies
                    // that for code of this shape:
                    //     var x;
                    //     try {
                    //       // ...
                    //     } catch (E) {
                    //       E();
                    //       return x;
                    //     }
                    // The reference to 'x' within the catch is not necessarily to the
                    // local declaration of 'x'; this gives Catch the same performance
                    // problems as with.

                    // We return a different, powerless function instead.
                    var name = '' + (ex.v___('name') || ex);

                    function inLieuOfThrownFunction() {
                        return 'In lieu of thrown function: ' + name;
                    }

                    return markFuncFreeze(inLieuOfThrownFunction, name);
                }
                default:
                {
                    log('Unrecognized exception type: ' + (typeof ex));
                    return 'Unrecognized exception type: ' + (typeof ex);
                }
            }
        } catch (_) {
            // Can occur if coercion to string fails, or if ex has getters
            // that fail. This function must never throw an exception
            // because doing so would cause control to leave a catch block
            // before the handler fires.
            log('Exception during exception handling.');
            return 'Exception during exception handling.';
        }
    }

    ///////////////////////////////////////////////////////////////////
    // Specification
    ///////////////////////////////////////////////////////////////////

    /**
     * 4. Overview
     */

    /**
     * 4.2 Language Overview
     */

    /**
     * 8. Types
     */

    function Type(x) {
        switch (typeof x) {
            case 'undefined':
            {
                return 'Undefined';
            }
            case 'boolean':
            {
                return 'Boolean';
            }
            case 'string':
            {
                return 'String';
            }
            case 'number':
            {
                return 'Number';
            }
            default:
            {
                return x ? 'Object' : 'Null';
            }
        }
    }

    /**
     * 8.6 Object type
     */

        // 8.6.1
    var attributeDefaults = {
        value: void 0,
        get: void 0,
        set: void 0,
        writable: false,
        enumerable: false,
        configurable: false
    };

    // 8.6.2
    function isPrimitive(x) {
        return Type(x) !== 'Object';
    }

    /**
     * 8.10 The Property Descriptor and Property Identifier Specification Types
     */

        // 8.10.1
    function IsAccessorDescriptor(Desc) {
        if (Desc === void 0) {
            return false;
        }
        if ('get' in Desc) {
            return true;
        }
        if ('set' in Desc) {
            return true;
        }
        return false;
    }

    // 8.10.2
    function IsDataDescriptor(Desc) {
        if (Desc === void 0) {
            return false;
        }
        if ('value' in Desc) {
            return true;
        }
        if ('writable' in Desc) {
            return true;
        }
        return false;
    }

    // 8.10.3
    function IsGenericDescriptor(Desc) {
        if (Desc === void 0) {
            return false;
        }
        if (!IsAccessorDescriptor(Desc) && !IsDataDescriptor(Desc)) {
            return true;
        }
        return false;
    }

    // 8.10.4
    function FromPropertyDescriptor(Desc) {
        function copyProp(Desc, obj, name) {
            obj.DefineOwnProperty___(name, {
                value: Desc[name],
                writable: true,
                enumerable: true,
                configurable: true
            });
        }

        // 1. If Desc is undefined, then return undefined.
        if (Desc === void 0) {
            return void 0;
        }
        // 2. Let obj be the result of creating a new object
        //    as if by the expression new Object() where Object is the standard
        //    built-in constructor with that name.
        var obj = {};
        // 3. If IsDataDescriptor(Desc) is true, then
        if (IsDataDescriptor(Desc)) {
            // a. Call the [[DefineOwnProperty]] internal method of obj
            //    with arguments "value", Property Descriptor {
            //      [[Value]]:Desc.[[Value]],
            //      [[Writable]]: true,
            //      [[Enumerable]]: true,
            //      [[Configurable]]: true
            //    }, and false.
            copyProp(Desc, obj, 'value');
            // b. Call the [[DefineOwnProperty]] internal method of obj
            //    with arguments "writable", Property Descriptor {[[Value]]:
            //    Desc.[[Writable]], [[Writable]]: true, [[Enumerable]]:
            //    true, [[Configurable]]: true}, and false.
            copyProp(Desc, obj, 'writable');
        }
        // 4. Else, IsAccessorDescriptor(Desc) must be true, so
        else {
            // a. Call the [[DefineOwnProperty]] internal method of obj
            //    with arguments "get", Property Descriptor {[[Value]]:
            //    Desc.[[Get]], [[Writable]]: true, [[Enumerable]]: true,
            //    [[Configurable]]: true}, and false.
            copyProp(Desc, obj, 'get');
            // b. Call the [[DefineOwnProperty]] internal method of obj
            //    with arguments "set", Property Descriptor {[[Value]]:
            //    Desc.[[Set]], [[Writable]]: true, [[Enumerable]]: true,
            //    [[Configurable]]: true}, and false.
            copyProp(Desc, obj, 'set');
        }
        // 5. Call the [[DefineOwnProperty]] internal method of obj with
        //    arguments "enumerable", Property Descriptor {[[Value]]:
        //    Desc.[[Enumerable]], [[Writable]]: true, [[Enumerable]]: true,
        //    [[Configurable]]: true}, and false.
        copyProp(Desc, obj, 'enumerable');
        // 6. Call the [[DefineOwnProperty]] internal method of obj with
        //    arguments "configurable", Property Descriptor {[[Value]]:
        //    Desc.[[Configurable]], [[Writable]]: true, [[Enumerable]]:
        //    true, [[Configurable]]: true}, and false.
        copyProp(Desc, obj, 'configurable');
        // 7. Return obj.
        return obj;
    }

    // 8.10.5
    function ToPropertyDescriptor(Obj) {
        // 1. If Type(Obj) is not Object throw a TypeError exception.
        if (Type(Obj) !== 'Object') {
            throw new TypeError('Expected an object.');
        }
        // 2. Let desc be the result of creating a new Property
        //    Descriptor that initially has no fields.
        var desc = {};
        // 3. If the result of calling the [[HasProperty]]
        //    internal method of Obj with argument "enumerable" is true, then
        //   a. Let enum be the result of calling the [[Get]]
        //      internal method of Obj with "enumerable".
        //   b. Set the [[Enumerable]] field of desc to ToBoolean(enum).
        if (Obj.HasProperty___('enumerable')) {
            desc.enumerable = !!Obj.v___('enumerable');
        }
        // 4. If the result of calling the [[HasProperty]]
        //    internal method of Obj with argument "configurable" is true, then
        //   a. Let conf  be the result of calling the [[Get]]
        //      internal method of Obj with argument "configurable".
        //   b. Set the [[Configurable]] field of desc to ToBoolean(conf).
        if (Obj.HasProperty___('configurable')) {
            desc.configurable = !!Obj.v___('configurable');
        }
        // 5. If the result of calling the [[HasProperty]]
        //    internal method of Obj with argument "value" is true, then
        //   a. Let value be the result of calling the [[Get]]
        //      internal method of Obj with argument "value".
        //   b. Set the [[Value]] field of desc to value.
        if (Obj.HasProperty___('value')) {
            desc.value = Obj.v___('value');
        }
        // 6. If the result of calling the [[HasProperty]]
        //    internal method of Obj with argument "writable" is true, then
        // a. Let writable be the result of calling the [[Get]]
        //    internal method of Obj with argument "writable".
        // b. Set the [[Writable]] field of desc to ToBoolean(writable).
        if (Obj.HasProperty___('writable')) {
            desc.writable = !!Obj.v___('writable');
        }
        // 7. If the result of calling the [[HasProperty]]
        //    internal method of Obj with argument "get" is true, then
        if (Obj.HasProperty___('get')) {
            // a. Let getter be the result of calling the [[Get]]
            //    internal method of Obj with argument "get".
            var getter = Obj.v___('get');
            // b. If IsCallable(getter) is false and getter is not
            //    undefined, then throw a TypeError exception.
            if (!isFunction(getter) && getter !== void 0) {
                throw new TypeError('Getter attributes must be functions or undef.');
            }
            // c. Set the [[Get]] field of desc to getter.
            desc.get = getter;
        }
        // 8. If the result of calling the [[HasProperty]]
        //    internal method of Obj with argument "set" is true, then
        if (Obj.HasProperty___('set')) {
            // a. Let setter be the result of calling the [[Get]]
            //    internal method of Obj with argument "set".
            var setter = Obj.v___('set');
            // b. If IsCallable(setter) is false and setter is not
            //    undefined, then throw a TypeError exception.
            if (!isFunction(setter) && setter !== void 0) {
                throw new TypeError('Setter attributes must be functions or undef.');
            }
            // c. Set the [[Set]] field of desc to setter.
            desc.set = setter;
        }
        // 9. If either desc.[[Get]] or desc.[[Set]] are present, then
        if ('set' in desc || 'get' in desc) {
            // a. If either desc.[[Value]] or desc.[[Writable]] are present,
            //    then throw a TypeError exception.
            if ('value' in desc) {
                throw new TypeError('Accessor properties must not have a value.');
            }
            if ('writable' in desc) {
                throw new TypeError('Accessor properties must not be writable.');
            }
        }
        // 10. Return desc.
        return desc;
    }

    /**
     * 8.12 Algorithms for Object Internal Methods
     */
    // 8.12.1
    // Note that the returned descriptor is for internal use only, so
    // nothing is whitelisted.
    Object.prototype.GetOwnProperty___ = function (P) {
        var O = this;
        //inline if (isNumericName(P)) {
        if (typeof P === 'number' || ('' + (+P)) === P) {
            if (O.hasOwnProperty(P)) {
                return {
                    value: O[P],
                    writable: isWritable(O, 'NUM___'),
                    configurable: isConfigurable(O, 'NUM___'),
                    enumerable: true
                };
            } else {
                return void 0;
            }
        }
        P = '' + P;
        //inline assertValidPropertyName(P);
        if (endsWith__.test(P)) {
            throw new TypeError('Properties may not end in double underscore.');
        }

        // 1. If O doesn't have an own property with name P, return undefined.
        //inline if (!guestHasOwnProperty(O, P)) {
        if (!O.hasOwnProperty(P + '_v___') && P !== 'NUM___') {
            return void 0;
        }

        // 2. Let D be a newly created Property Descriptor with no fields.
        var D = {};
        // 3. Let X be O's own property named P.
        // 4. If X is a data property, then
        if (hasValue(O, P)) {
            // a. Set D.[[Value]] to the value of X's [[Value]] attribute.
            D.value = O[P];
            // b. Set D.[[Writable]] to the value of X's [[Writable]] attribute
            D.writable = isWritable(O, P);
        } else {
            // 5. Else X is an accessor property, so
            // a. Set D.[[Get]] to the value of X's [[Get]] attribute.
            D.get = getter(O, P);
            // b. Set D.[[Set]] to the value of X's [[Set]] attribute.
            D.set = setter(O, P);
        }
        // 6. Set D.[[Enumerable]] to the value of X's [[Enumerable]] attribute.
        D.enumerable = isEnumerable(O, P);
        // 7. Set D.[[Configurable]] to the value of X's
        // [[Configurable]] attribute.
        D.configurable = isConfigurable(O, P);
        // 8. Return D.
        return D;
    };

    // 8.12.3
    Object.prototype.v___ = function (P) {
        P = '' + P;
        if (isNumericName(P)) {
            return this[P];
        }
        assertValidPropertyName(P);
        // Is P an accessor property on this?
        var g = getter(this, P);
        if (g) {
            return g.f___(this);
        }
        // Is it whitelisted as a value?
        if (hasValue(this, P)) {
            return this[P];
        }
        // Temporary support for Cajita's keeper interface
        if (this.handleRead___) {
            return this.handleRead___(P);
        }
        return void 0;
    };

    // 8.12.5
    Object.prototype.w___ = function (P, V) {
        var thisExtensible = isExtensible(this);
        P = '' + P;
        assertValidPropertyName(P);
        if (!thisExtensible) {
            if (wouldExtend(this, P)) {
                throw new TypeError("Could not create the property '" +
                    P + "': " + this + " is not extensible.");
            }
        }
        // Numeric indices are never accessor properties
        // and are all governed by a single property descriptor.
        // At this point, obj is either extensible or
        // non-extensible but already has the property in question.
        if (isNumericName(P)) {
            if (isWritable(this, 'NUM___') || !this.hasNumerics___()) {
                return this[P] = V;
            } else {
                throw new TypeError("The property '" + P + "' is not writable.");
            }
        }
        // Is name an accessor property on obj?
        var s = setter(this, P);
        if (s) {
            return s.f___(this, [V]);
        }

        // If P is inherited or an own property, write or throw.
        if (P + '_v___' in this) {
            if (isWritable(this, P)) {
                fastpathWrite(this, P);
                return this[P] = V;
            }
            throw new TypeError("The property '" + P + "' is not writable.");
        }

        // Temporary support for Cajita's keeper interface
        if (this.handleSet___) {
            return this.handleSet___(P, V);
        }

        // If P doesn't exist, is the object extensible?
        if (!this.hasOwnProperty(P) && isExtensible(this)) {
            this.DefineOwnProperty___(P, {
                value: V,
                writable: true,
                configurable: true,
                enumerable: true
            });
            return V;
        }
        throw new TypeError("The property '" + P + "' is not writable.");
    };

    // 8.12.6
    /**
     * Precondition: P is a number or string; this is to prevent testing
     * P and the string coersion having side effects.
     */
    Object.prototype.HasProperty___ = function (P) {
        if (isNumericName(P)) {
            return P in this;
        }
        return (P + '_v___' in this);
    };

    // 8.12.7
    Object.prototype.c___ = function (P) {
        var O = this;
        P = '' + P;
        // Temporary support for Cajita's keeper interface.
        if (O.handleDelete___) {
            var result = this.handleDelete___(P);
            // ES5 strict can't return false.
            if (!result) {
                throw new TypeError('Cannot delete ' + P + ' on ' + O);
            }
            return true;
        }
        // 1. Let desc be the result of calling the [[GetOwnProperty]]
        //    internal method of O with property name P.
        var desc = O.GetOwnProperty___(P);
        // 2. If desc is undefined, then return true.
        if (!desc) {
            return true;
        }
        // 3. If desc.[[Configurable]] is true, then
        if (desc.configurable) {
            if (isNumericName(P)) {
                if (isDeodorized(O, P)) {
                    throw new TypeError("Cannot delete Firefox-specific antidote '"
                        + P + "' on " + O);
                } else {
                    delete O[P];
                    return true;
                }
            }
            // a. Remove the own property with name P from O.
            delete O[P];
            delete O[P + '_v___'];
            delete O[P + '_w___'];
            delete O[P + '_gw___'];
            delete O[P + '_g___'];
            delete O[P + '_s___'];
            delete O[P + '_c___'];
            delete O[P + '_e___'];
            delete O[P + '_m___'];
            // b. Return true.
            return true;
        }
        // 4. Else if Throw, then throw a TypeError exception.
        // [This is strict mode, so Throw is always true.]
        throw new TypeError("Cannot delete '" + P + "' on " + O);
        // 5. Return false.
    };

    // 8.12.9
    // Preconditions:
    //   Desc is an internal property descriptor.
    //   P is a number or a string.
    Object.prototype.DefineOwnProperty___ = function (P, Desc) {
        //inline if (isNumericName(P)) {
        if (typeof P === 'number' || ('' + (+P)) === P) {
            throw new TypeError('Cannot define numeric properties.');
        }
        var O = this;
        P = '' + P;
        // 1. Let current be the result of calling the [[GetOwnProperty]]
        //    internal method of O with property name P.
        var current = O.GetOwnProperty___(P);
        // 2. Let extensible be the value of the [[Extensible]] internal
        //    property of O.

        //inline var extensible = isExtensible(O);
        var extensible = Type(O) === 'Object' && O.ne___ !== O;
        // 3. If current is undefined and extensible is false, then Reject.
        if (!current && !extensible) {
            throw new TypeError('This object is not extensible.');
        }
        // 4. If current is undefined and extensible is true, then
        if (!current && extensible) {
            // a. If  IsGenericDescriptor(Desc) or IsDataDescriptor(Desc)
            //    is true, then
            if (IsDataDescriptor(Desc) || IsGenericDescriptor(Desc)) {
                // i. Create an own data property named P of object O whose
                //    [[Value]], [[Writable]], [[Enumerable]] and
                //    [[Configurable]] attribute values are described by
                //    Desc. If the value of an attribute field of Desc is
                //    absent, the attribute of the newly created property is
                //    set to its default value.
                O[P] = Desc.value;
                O[P + '_v___'] = O;
                O[P + '_w___'] = false;
                O[P + '_gw___'] = Desc.writable ? O : false;
                O[P + '_e___'] = Desc.enumerable ? O : false;
                O[P + '_c___'] = Desc.configurable ? O : false;
                O[P + '_g___'] = void 0;
                O[P + '_s___'] = void 0;
                O[P + '_m___'] = false;
            }
            // b. Else, Desc must be an accessor Property Descriptor so,
            else {
                // i. Create an own accessor property named P of object O
                //    whose [[Get]], [[Set]], [[Enumerable]] and
                //    [[Configurable]] attribute values are described by
                //    Desc. If the value of an attribute field of Desc is
                //    absent, the attribute of the newly created property is
                //    set to its default value.
                if (Desc.configurable) {
                    O[P] = void 0;
                }
                O[P + '_v___'] = false;
                O[P + '_w___'] = O[P + '_gw___'] = false;
                O[P + '_e___'] = Desc.enumerable ? O : false;
                O[P + '_c___'] = Desc.configurable ? O : false;
                O[P + '_g___'] = Desc.get;
                O[P + '_s___'] = Desc.set;
                O[P + '_m___'] = false;
            }
            // c. Return true.
            return true;
        }
        // 5. Return true, if every field in Desc is absent.
        if (!('value' in Desc ||
            'writable' in Desc ||
            'enumerable' in Desc ||
            'configurable' in Desc ||
            'get' in Desc ||
            'set' in Desc)) {
            return true;
        }
        // 6. Return true, if every field in Desc also occurs in current
        //    and the value of every field in Desc is the same value as the
        //    corresponding field in current when compared using the
        //    SameValue algorithm (9.12).
        var allHaveAppearedAndAreTheSame = true;
        for (var i in Desc) {
            if (!Desc.hasOwnProperty(i)) {
                continue;
            }
            if (!SameValue(current.v___(i), Desc[i])) {
                allHaveAppearedAndAreTheSame = false;
                break;
            }
        }
        if (allHaveAppearedAndAreTheSame) {
            return true;
        }
        // 7. If the [[Configurable]] field of current is false then
        if (!current.configurable) {
            // a. Reject, if the [Cofigurable]] field of Desc is true.
            if (Desc.configurable) {
                throw new TypeError("The property '" + P +
                    "' is not configurable.");
            }
            // b. Reject, if the [[Enumerable]] field of Desc is present
            //    and the [[Enumerable]] fields of current and Desc are
            //    the Boolean negation of each other.
            if ('enumerable' in Desc && Desc.enumerable !== current.enumerable) {
                throw new TypeError("The property '" + P +
                    "' is not configurable.");
            }
        }
        var iddCurrent = IsDataDescriptor(current);
        var iddDesc = IsDataDescriptor(Desc);
        // 8. If IsGenericDescriptor(Desc) is true, then no further
        //    validation is required.
        if (IsGenericDescriptor(Desc)) {
            // Do nothing
        }
        // 9. Else, if IsDataDescriptor(current) and IsDataDescriptor(Desc)
        //    have different results, then
        else if (iddCurrent !== iddDesc) {
            // a. Reject, if the [[Configurable]] field of current is false.
            if (!current.configurable) {
                throw new TypeError("The property '" + P +
                    "' is not configurable.");
            }
            // b. If IsDataDescriptor(current) is true, then
            if (iddCurrent) {
                // i. Convert the property named P of object O from a data
                //    property to an accessor property. Preserve the existing
                //    values of the converted property's [[Configurable]] and
                //    [[Enumerable]] attributes and set the rest of the
                //    property's attributes to their default values.
                O[P] = void 0;
                O[P + '_v___'] = false;
                O[P + '_w___'] = O[P + '_gw___'] = false;
                // O[P + '_e___'] = O[P + '_e___'];
                // O[P + '_c___'] = O[P + '_c___'];
                O[P + '_g___'] = void 0;
                O[P + '_s___'] = void 0;
                O[P + '_m___'] = false;
            }
            // c. Else,
            else {
                // i. Convert the property named P of object O from an
                //    accessor property to a data property. Preserve the
                //    existing values of the converted property's
                //    [[Configurable]] and [[Enumerable]] attributes and set
                //    the rest of the property's attributes to their default
                //    values.
                O[P] = Desc.value;
                O[P + '_v___'] = O;
                O[P + '_w___'] = O[P + '_gw___'] = false;
                // O[P + '_e___'] = O[P + '_e___'];
                // O[P + '_c___'] = O[P + '_c___'];
                O[P + '_g___'] = void 0;
                O[P + '_s___'] = void 0;
                O[P + '_m___'] = false;
            }
        }
        // 10. Else, if IsDataDescriptor(current) and
        //     IsDataDescriptor(Desc) are both true, then
        else if (iddCurrent && iddDesc) {
            // a. If the [[Configurable]] field of current is false, then
            if (!current.configurable) {
                // i. Reject, if the [[Writable]] field of current is false
                //    and the [[Writable]] field of Desc is true.
                if (!current.writable && Desc.writable) {
                    throw new TypeError("The property '" + P +
                        "' is not configurable.");
                }
                // ii. If the [[Writable]] field of current is false, then
                if (!current.writable) {
                    // 1. Reject, if the [[Value]] field of Desc is present and
                    //    SameValue(Desc.[[Value]], current.[[Value]]) is false.
                    if ('value' in Desc && !SameValue(Desc.value, current.value)) {
                        throw new TypeError("The property '" + P +
                            "' is not writable.");
                    }
                }
            }
            // b. else, the [[Configurable]] field of current is true, so
            //    any change is acceptable. (Skip to 12)
        }
        // 11. Else, IsAccessorDescriptor(current) and
        //     IsAccessorDescriptor(Desc) are both true so,
        else {
            // a. If the [[Configurable]] field of current is false, then
            if (!current.configurable) {
                // i. Reject, if the [[Set]] field of Desc is present and
                //    SameValue(Desc.[[Set]], current.[[Set]]) is false.
                // ii. Reject, if the [[Get]] field of Desc is present and
                //     SameValue(Desc.[[Get]], current.[[Get]]) is false.
                if (('set' in Desc && !SameValue(Desc.set, current.set)) ||
                    ('get' in Desc && !SameValue(Desc.get, current.get))) {
                    throw new TypeError("The property '" + P +
                        "' is not configurable.");
                }
            }
        }
        // 12. For each attribute field of Desc that is present,
        //     set the correspondingly named attribute of the property
        //     named P of object O to the value of the field.
        if (iddDesc) {
            O[P] = Desc.value;
            O[P + '_v___'] = O;
            O[P + '_gw___'] = Desc.writable ? O : false;
            O[P + '_g___'] = O[P + '_s___'] = void 0;
        } else {
            O[P + '_v___'] = false;
            O[P + '_gw___'] = false;
            O[P + '_g___'] = Desc.get;
            O[P + '_s___'] = Desc.set;
        }
        O[P + '_e___'] = Desc.enumerable ? O : false;
        O[P + '_c___'] = Desc.configurable ? O : false;
        O[P + '_m___'] = false;
        O[P + '_w___'] = false;
        // 13. Return true.
        return true;
    };

    /**
     * 9 Type Conversion and Testing
     */

        // 9.6
    function ToUint32(input) {
        return input >>> 0;
    }

    // 9.9
    function ToObject(input) {
        if (input === void 0 || input === null) {
            throw new TypeError('Cannot convert ' + t + ' to Object.');
        }
        return Object(input);
    }

    // 9.12
    /**
     * Are x and y not observably distinguishable?
     */
    function SameValue(x, y) {
        if (x === y) {
            // 0 === -0, but they are not identical
            return x !== 0 || 1 / x === 1 / y;
        } else {
            // NaN !== NaN, but they are identical.
            // NaNs are the only non-reflexive value, i.e., if x !== x,
            // then x is a NaN.
            return x !== x && y !== y;
        }
    }


    /**
     * 11 Expressions
     */

    /**
     * Throws an exception if the value is an unmarked function.
     */
    function asFirstClass(value) {
        if (isFunction(value) && value.f___ === Function.prototype.f___) {
            var err = new Error('Internal: toxic function encountered!');
            err.UNCATCHABLE___ = true;
            throw err;
        }
        return value;
    }

    // 11.1.5
    /**
     * Creates a well-formed ES5 record from a list of alternating
     * keys and values.
     */
    function initializeMap(list) {
        var result = {};
        var accessors = {};
        for (var i = 0; i < list.length; i += 2) {
            if (typeof list[i] === 'string') {
                if (result.hasOwnProperty(list[i])) {
                    throw new SyntaxError('Duplicate keys: ' + list[i]);
                }
                if (isNumericName(list[i])) {
                    result[list[i]] = asFirstClass(list[i + 1]);
                } else {
                    result.DefineOwnProperty___(
                        list[i],
                        {
                            value: asFirstClass(list[i + 1]),
                            writable: true,
                            enumerable: true,
                            configurable: true
                        });
                }
            } else {
                var name = list[i][0];
                if (isNumericName(name)) {
                    throw new TypeError('Accessors not supported for numerics.');
                }
                var type = list[i][1];
                accessors[name] = accessors[name] || {};
                if (accessors[name].hasOwnProperty(type)) {
                    throw new SyntaxError('Duplicate accessor keys: ' +
                        type + ' ' + list[i]);
                }
                accessors[name][type] = asFirstClass(list[i + 1]);
            }
        }
        for (i in accessors) {
            if (endsWith__.test(i)) {
                continue;
            }
            if (!accessors.hasOwnProperty(i)) {
                continue;
            }
            result.DefineOwnProperty___(i, {
                get: accessors[i].get,
                set: accessors[i].set,
                enumerable: true,
                configurable: true
            });
        }
        return result;
    }

    // 11.2.3
    /**
     * Makes a [[ThrowTypeError]] function, as defined in section 13.2.3
     * of the ES5 spec.
     *
     * <p>The informal name for the [[ThrowTypeError]] function, defined
     * in section 13.2.3 of the ES5 spec, is the "poison pill". The poison
     * pill is simply a no-argument function that, when called, always
     * throws a TypeError. Since we wish this TypeError to carry useful
     * diagnostic info, we violate the ES5 spec by defining 4 poison
     * pills with 4 distinct identities.
     *
     * <p>A poison pill is installed as the getter & setter of the
     * de-jure (arguments.callee) and de-facto non-strict magic stack
     * inspection properties, which no longer work in ES5/strict, since
     * they violate encapsulation. Rather than simply remove them,
     * access to these properties is poisoned in order to catch errors
     * earlier when porting old non-strict code.
     */
    function makePoisonPill(badThing) {
        function poisonPill() {
            throw new TypeError('' + badThing + ' is forbidden by ES5/strict');
        }

        return markFunc(poisonPill);
    }

    var poisonFuncCaller = makePoisonPill("A function's .caller");
    var poisonFuncArgs = makePoisonPill("A function's .arguments");

    /**
     * Function calls g(args) get translated to g.f___(USELESS, args)
     * Tamed functions and cajoled functions install an overriding fastpath f___
     * to apply, the original Function.prototype.apply.
     */
    Function.prototype.f___ = callFault;
    Function.prototype.i___ = function(var_args) {
        return this.f___(USELESS, slice.call(arguments, 0));
    };
    Function.prototype.new___ = callFault;
    Function.prototype.DefineOwnProperty___('arguments', {
        enumerable: false,
        configurable: false,
        get: poisonFuncArgs,
        set: poisonFuncArgs
    });
    Function.prototype.DefineOwnProperty___('caller', {
        enumerable: false,
        configurable: false,
        get: poisonFuncCaller,
        set: poisonFuncCaller
    });

    // 11.2.4
    var poisonArgsCallee = makePoisonPill('arguments.callee');
    var poisonArgsCaller = makePoisonPill('arguments.caller');

    /**
     * Given either an array or an actual arguments object, return
     * Cajita's emulation of an ES5/strict arguments object.
     */
    function args(original) {
        var result = initializeMap(['length', 0]);
        push.apply(result, original);
        result.CLASS___ = 'Arguments';
        result.DefineOwnProperty___(
            'callee',
            {
                enumerable: false,
                configurable: false,
                get: poisonArgsCallee,
                set: poisonArgsCallee
            });
        result.DefineOwnProperty___(
            'caller',
            {
                enumerable: false,
                configurable: false,
                get: poisonArgsCaller,
                set: poisonArgsCaller
            });
        return result;
    }

    // 11.2.5

    // Fixed-point combinator Y finds the fixed-point of the given maker
    function Y(maker) {
        function recurse(x) {
            return maker(markFunc(function (var_args) {
                return x(x).apply(this, arguments);
            }));
        }

        return recurse(recurse);
    }

    // 11.8.7
    /**
     * Implements ES5's {@code <i>name</i> in <i>obj</i>}
     *
     * Precondition: name is a string
     */
    function isIn(name, obj) {
        var t = Type(obj);
        if (t !== 'Object') {
            throw new TypeError('Invalid "in" operand: ' + obj);
        }
        return obj.HasProperty___(name);
    }

    /**
     * 15 Standard Built-in ECMAScript Objects
     */

        // Sets up a per-object getter and setter.  Necessary to prevent
        // guest code from messing with expectations of host and innocent code.
        // If innocent code needs access to the guest properties, explicitly tame
        // it that way.
    function virtualize(obj, name, fun) {
        var vname = name + '_virt___';
        obj[vname] = fun ? markFunc(fun) : obj[name] ? markFunc(obj[name]) : void 0;
        obj.DefineOwnProperty___(name, {
            get: markFunc(function () {
                return this[vname];
            }),
            set: markFunc(function (val) {
                if (!isFunction(val)) {
                    throw new TypeError('Expected a function instead of ' + val);
                }
                if (isFrozen(this)) {
                    throw new TypeError('This object is frozen.');
                }
                if (!isExtensible(this) &&
                    !this.hasOwnProperty(vname)) {
                    throw new TypeError('This object is not extensible.');
                }
                this[vname] = asFirstClass(val);
            }),
            enumerable: false,
            configurable: false
        });
    }

    // 15.1.3.1--4
    markFunc(decodeURI);
    markFunc(decodeURIComponent);
    markFunc(encodeURI);
    markFunc(encodeURIComponent);

    // 15.2.1.1
    Object.f___ = markFunc(function (dis, as) {
        var len = as.length;
        if (len === 0 || as[0] === null || as[0] === void 0) {
            return {};
        }
        return ToObject(as[0]);
    });

    // 15.2.2.1
    Object.new___ = markFunc(function (value) {
        return Object.f___(USELESS, [value]);
    });

    // 15.2.3.1
    Object.DefineOwnProperty___('prototype', {
        value: Object.prototype,
        writable: false,
        enumerable: false,
        configurable: false
    });

    // 15.2.3.2
    // Prefer the browser's built-in version.
    if (!Object.getPrototypeOf) {
        Object.getPrototypeOf = function (obj) {
            if (Type(obj) !== 'Object') {
                throw new TypeError('Not an object.');
            }
            if (!Object.hasOwnProperty('Prototype___')) {
                // If there's no built-in version, fall back to __proto__.
                if ({}.__proto__ === Object.prototype) {
                    obj.Prototype___ = obj.__proto__;
                } else {
                    // If that fails, use directConstructor to give our best guess.
                    var constr = directConstructor(obj);
                    if (constr === BASE_OBJECT_CONSTRUCTOR) {
                        obj.Prototype___ = obj.baseProto___;
                    } else if (constr === void 0) {
                        obj.Prototype___ = null;
                    } else {
                        obj.Prototype___ = constr.prototype;
                    }
                }
            }
            return obj.Prototype___;
        };
    }
    origGetPrototypeOf = Object.getPrototypeOf;

    // 15.2.3.3
    Object.getOwnPropertyDescriptor = function(obj, P) {
        // 1. If Type(object) is not Object throw a TypeError exception.
        if (Type(obj) !== 'Object') {
            throw new TypeError('Expected an object.');
        }
        // 2. Let name be ToString(P).
        var name = '' + P;
        // 3. Let desc be the result of calling the [[GetOwnProperty]]
        //    internal method of obj with argument name.
        var desc = obj.GetOwnProperty___(name);
        // 4. Return the result of calling FromPropertyDescriptor(desc).
        return FromPropertyDescriptor(desc);
    };
    origGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

    // 15.2.3.4
    // virtualized to avoid confusing the webkit/safari/chrome debugger
    virtualize(Object, 'getOwnPropertyNames', ownKeys);
    // TODO(felix8a): spec says this should be configurable: true

    // 15.2.3.5
    /**
     * Makes a new empty object that directly inherits from {@code proto}.
     */
    function beget(proto) {
        if (proto === null) {
            throw new TypeError('Cannot beget from null.');
        }
        if (proto === (void 0)) {
            throw new TypeError('Cannot beget from undefined.');
        }
        function F() {
        }

        F.prototype = proto;
        var result = new F();
        return result;
    }

    // The algorithm below doesn't care whether Properties is absent
    // or undefined, so we can simplify.
    Object.create = function (O, opt_Properties) {
        // 1. If Type(O) is not Object or Null throw a TypeError exception.
        // (ES3 doesn't support null prototypes.)
        if (Type(O) !== 'Object') {
            throw new TypeError('Expected an object.');
        }
        // 2. Let obj be the result of creating a new object
        //    as if by the expression new Object() where Object
        //    is the standard built-in constructor with that name
        // 3. Set the [[Prototype]] internal property of obj to O.
        var obj = beget(O);
        // 4. If the argument Properties is present
        // and not undefined, add own properties to obj
        // as if by calling the standard built-in function
        // Object.defineProperties with arguments obj and Properties.
        if (opt_Properties !== void 0) {
            DefineProperties(obj, opt_Properties);
        }
        // 5. Return obj.
        return obj;
    };

    // 15.2.3.6
    Object.defineProperty = function (O, P, Attributes) {
        // 1. If Type(O) is not Object throw a TypeError exception.
        if (Type(O) !== 'Object') {
            throw new TypeError('Expected an object.');
        }
        // 2. Let name be ToString(P).
        var name = '' + P;
        // 3. Let desc be the result of calling
        //    ToPropertyDescriptor with Attributes as the argument.
        var desc = ToPropertyDescriptor(Attributes);
        // 4. Call the [[DefineOwnProperty]] internal method of O
        //    with arguments name, desc, and true.
        // (We don't need 'true' because we always throw in strict mode.)
        O.DefineOwnProperty___(name, desc);
        // 5. Return O.
        return O;
    };

    // 15.2.3.7
    function DefineProperties(O, Properties) {
        // 1. If Type(O) is not Object throw a TypeError exception.
        if (Type(O) !== 'Object') {
            throw new TypeError('Expected an object.');
        }
        // 2. Let props be ToObject(Properties).
        var props = ToObject(Properties);
        // 3. Let names be an internal list containing
        //    the names of each enumerable own property of props.
        var names = ownEnumKeys(props);
        // 4. Let descriptors be an empty internal List.
        var descriptors = [];
        // 5. For each element P of names in list order,
        var len = names.length;
        for (var i = 0; i < len; ++i) {
            var P = names[i];
            // a. Let descObj be the result of calling the [[Get]]
            //    internal method of props with P as the argument.
            var descObj = props.v___(P);
            // b. Let desc be the result of calling ToPropertyDescriptor
            //    with descObj as the argument.
            var desc = ToPropertyDescriptor(descObj);
            // c. Append desc to the end of descriptors.
            descriptors.push(desc);
        }
        // 6. For each element desc of descriptors in list order,
        // a. Call the [[DefineOwnProperty]] internal method
        //    of O with arguments P, desc, and true.
        // This part of the spec is nonsense.  I'm following Besen's
        // interpretation: see line 31479 of
        // http://besen.svn.sourceforge.net/viewvc/besen/trunk/src/BESEN.pas?revision=27&view=markup

        // TODO: The latest draft errata fixes this. We'll be ratifying
        // these errata at the upcoming EcmaScript meeting on 7/28 &
        // 7/29. Watch this space.
        for (i = 0; i < len; ++i) {
            P = names[i];
            desc = descriptors[i];
            O.DefineOwnProperty___(P, desc);
        }
        // 7. Return O.
        return O;
    }

    Object.defineProperties = DefineProperties;

    // 15.2.3.8
    Object.seal = function (O) {
        // 1. If Type(O) is not Object throw a TypeError exception.
        if (Type(O) !== 'Object') {
            throw new TypeError('Only objects may be sealed.');
        }
        // 2. For each own property name P of O,
        var keys = ownKeys(O), len = keys.length;
        for (var i = 0; i < len; ++i) {
            var P = keys[i];
            if (isNumericName(P)) {
                continue;
            }
            // a. Let desc be the result of calling the [[GetOwnProperty]]
            //    internal method of O with P.
            // b. If desc.[[Configurable]] is true, set
            //    desc.[[Configurable]] to false.
            // c. Call the [[DefineOwnProperty]] internal method of O with P,
            //    desc, and true as arguments.
            O[P + '_c___'] = false;
        }
        if (!O.hasNumerics___()) {
            O.NUM____v___ = O;
            O.NUM____gw___ = O;
            O.NUM____w___ = O;
            O.NUM____m___ = false;
            O.NUM____e___ = O;
            O.NUM____g___ = void 0;
            O.NUM____s___ = void 0;
        }
        O.NUM____c___ = false;
        // 3. Set the [[Extensible]] internal property of O to false.
        O.ne___ = O;
        // 4. Return O.
        return O;
    };

    // 15.2.3.9
    function freeze(obj) {
        if (Type(obj) !== 'Object') {
            throw new TypeError('Only objects may be frozen.');
        }
        // Frozen means all the properties are neither writable nor
        // configurable, and the object itself is not extensible.
        // Cajoled setters that change properties of the object will
        // fail like any other attempt to change the properties.
        // Tamed setters should check before changing a property.
        if (obj.z___ === obj) {
            return obj;
        }
        // Allow function instances to install their instance properties
        // before freezing them.
        if (obj.v___ === deferredV) {
            obj.v___('length');
        }
        obj.ne___ = obj;
        for (var i in obj) {
            if (!guestHasOwnProperty(obj, i)) {
                continue;
            }
            if (isNumericName(i)) {
                continue;
            }
            obj[i + '_c___'] = false;
            obj[i + '_gw___'] = false;
            obj[i + '_w___'] = false;
        }
        if (!obj.hasNumerics___()) {
            obj.NUM____v___ = obj;
            obj.NUM____e___ = obj;
            obj.NUM____g___ = void 0;
            obj.NUM____s___ = void 0;
        }
        obj['NUM____c___'] = false;
        obj['NUM____w___'] = false;
        obj['NUM____m___'] = false;
        obj['NUM____gw___'] = false;
        // Cache frozen state.
        obj.z___ = obj;
        return obj;
    }

    /**
     * Whitelists all the object's own properties that do not
     * end in __ and have not already been whitelisted.
     * If opt_deep is true, recurses on objects and
     * assumes the object has no cycles through accessible keys.
     */
    function whitelistAll(obj, opt_deep) {
        var i;
        for (i in obj) {
            if (obj.hasOwnProperty(i) &&
                !endsWith__.test(i) &&
                !((i + '_v___') in obj)) {
                var isObj = (typeof obj[i]) === 'object';
                if (opt_deep && isObj) {
                    whitelistAll(obj[i], true);
                }
                obj[i + '_v___'] = obj;
                obj[i + '_w___'] = false;
                obj[i + '_gw___'] = false;
                obj[i + '_e___'] = obj;
                obj[i + '_c___'] = false;
                obj[i + '_g___'] = void 0;
                obj[i + '_s___'] = void 0;
                obj[i + '_m___'] = false;
                if (isFunction(obj[i])) {
                    if (obj[i].f___ === Function.prototype.f___) {
                        markFunc(obj[i]);
                    }
                }
            }
        }
        return obj;
    }

    // TODO: Where this is used, do we really want frozenness
    // that is transitive across property traversals?
    function snowWhite(obj) {
        return freeze(whitelistAll(obj));
    }

    Object.freeze = freeze;

    // 15.2.3.10
    Object.preventExtensions = function (O) {
        if (!O.hasNumerics___()) {
            O.NUM____v___ = obj;
            O.NUM____e___ = obj;
            O.NUM____g___ = void 0;
            O.NUM____s___ = void 0;
            O.NUM____c___ = O;
            O.NUM____gw___ = O;
            O.NUM____w___ = O;
            O.NUM____m___ = false;
        }
        O.ne___ = O;
        return O;
    };

    // 15.2.3.11
    Object.isSealed = function (O) {
        // 1. If Type(O) is not Object throw a TypeError exception.
        if (Type(O) !== 'Object') {
            throw new TypeError('Only objects may be frozen.');
        }
        // 2. For each named own property name P of O,
        // a. Let desc be the result of calling the [[GetOwnProperty]]
        //    internal method of O with P.
        // b. If desc.[[Configurable]] is true, then return false.
        for (var i in O) {
            if (endsWith__.test(i)) {
                continue;
            }
            if (!O.hasOwnProperty(i)) {
                continue;
            }
            if (isNumericName(i)) {
                continue;
            }
            if (O[i + '_c___']) {
                return false;
            }
        }
        // 3. If the [[Extensible]] internal property of O is false, then
        //    return true.
        if (O.ne___ === O) {
            return true;
        }
        // 4. Otherwise, return false.
        return false;
    };

    // 15.2.3.12
    Object.isFrozen = isFrozen;

    // 15.2.3.13
    Object.isExtensible = isExtensible;

    // 15.2.3.14
    // virtualized to avoid confusing the webkit/safari/chrome debugger
    virtualize(Object, 'keys', ownEnumKeys);
    // TODO(felix8a): ES5 says this should be configurable: true

    (function () {
        var objectStaticMethods = [
            'getPrototypeOf',
            'getOwnPropertyDescriptor',
            // getOwnPropertyNames is virtual
            'create',
            'defineProperty',
            'defineProperties',
            'seal',
            'freeze',
            'preventExtensions',
            'isSealed',
            'isFrozen',
            'isExtensible'
            // keys is virtual
        ];
        var i, len = objectStaticMethods.length;
        for (i = 0; i < len; ++i) {
            var name = objectStaticMethods[i];
            Object.DefineOwnProperty___(name, {
                value: markFunc(Object[name]),
                writable: true,
                enumerable: false,
                configurable: true
            });
        }
    })();

    // 15.2.4.1
    Object.DefineOwnProperty___('constructor', {
        value: Object,
        writable: false,
        enumerable: false,
        configurable: false
    });

    // 15.2.4.2
    Object.prototype.toString = markFunc(function() {
        if (this.CLASS___) {
            return '[object ' + this.CLASS___ + ']';
        }
        return classProp.call(this);
    });
    Object.prototype.DefineOwnProperty___('toString', {
        get: markFunc(function () {
            return this.toString.orig___ ? this.toString.orig___ : this.toString;
        }),
        set: markFunc(function (val) {
            if (!isFunction(val)) {
                throw new TypeError('Expected a function instead of ' + val);
            }
            if (isFrozen(this)) {
                throw new TypeError("Won't set toString on a frozen object.");
            }
            val = asFirstClass(val);
            this.toString = markFunc(function (var_args) {
                return val.f___(safeDis(this), arguments);
            });
            this.toString.orig___ = val;
        }),
        enumerable: false,
        configurable: false
    });

    // 15.2.4.4
    markFunc(Object.prototype.valueOf);
    Object.prototype.DefineOwnProperty___('valueOf', {
        get: markFunc(function () {
            return this.valueOf.orig___ ? this.valueOf.orig___ : this.valueOf;
        }),
        set: markFunc(function (val) {
            if (!isFunction(val)) {
                throw new TypeError('Expected a function instead of ' + val);
            }
            if (isFrozen(this)) {
                throw new TypeError("Won't set valueOf on a frozen object.");
            }
            val = asFirstClass(val);
            this.valueOf = markFunc(function (var_args) {
                return val.f___(safeDis(this), arguments);
            });
            this.valueOf.orig___ = val;
        }),
        enumerable: false,
        configurable: false
    });

    // 15.2.4.5
    virtualize(Object.prototype, 'hasOwnProperty', function (P) {
        if (isNumericName(P)) {
            return this.hasOwnProperty(P);
        }
        return guestHasOwnProperty(this, P);
    });

    // 15.2.4.7
    virtualize(Object.prototype, 'propertyIsEnumerable', function (V) {
        return isEnumerable(this, '' + V);
    });

    // 15.2.4.3, 5--7
    (function () {
        var methods = [
            'toLocaleString',
            'isPrototypeOf'
        ];
        var i, len = methods.length;
        for (i = 0; i < len; ++i) {
            var name = methods[i];
            virtualize(Object.prototype, name);
        }
    })();

    // 15.2.4
    // NOT extensible under ES5/3
    freeze(Object.prototype);

    // 15.3 Function
    var FakeFunction = function () {
        throw new
            Error('Internal: FakeFunction should not be directly invocable.');
    };

    FakeFunction.toString = (function (str) {
        return function () {
            return str;
        };
    })(Function.toString());

    // 15.3.1
    Function.f___ = FakeFunction.f___ = markFunc(function() {
        throw new Error('Invoking the Function constructor is unsupported.');
    });

    // 15.3.2
    Function.new___ = FakeFunction.new___ = markFunc(function () {
        throw new Error('Constructing functions dynamically is unsupported.');
    });

    // 15.3.3.1
    FakeFunction.DefineOwnProperty___('prototype', {
        value: Function.prototype,
        writable: false,
        enumerable: false,
        configurable: false
    });

    // 15.3.4.1
    Function.prototype.DefineOwnProperty___('constructor', {
        value: FakeFunction,
        writable: true,
        enumerable: false,
        configurable: false
    });

    // 15.3.4.2
    (function () {
        var orig = Function.prototype.toString;
        Function.prototype.toString = markFunc(function () {
            if (this.toString___) {
                return this.toString___();
            }
            ;
            return orig.call(this);
        });
    })();

    // 15.3.4.3--5
    virtualize(Function.prototype, 'call', function (dis, var_args) {
        return this.apply(safeDis(dis), slice.call(arguments, 1));
    });
    virtualize(Function.prototype, 'apply', function (dis, as) {
        return this.apply(safeDis(dis), as ? slice.call(as, 0) : undefined);
    });
    /**
     * Bind this function to <tt>self</tt>, which will serve
     * as the value of <tt>this</tt> during invocation. Curry on a
     * partial set of arguments in <tt>var_args</tt>. Return the curried
     * result as a new function object.
     */
    Function.prototype.bind = markFunc(function(self, var_args) {
        var thisFunc = safeDis(this);
        var leftArgs = slice.call(arguments, 1);

        function funcBound(var_args) {
            var args = leftArgs.concat(slice.call(arguments, 0));
            return thisFunc.apply(safeDis(self), args);
        }

        // 15.3.5.2
        delete funcBound.prototype;
        funcBound.f___ = funcBound.apply;
        funcBound.new___ = function () {
            throw "Constructing the result of a bind() not yet implemented.";
        };
        return funcBound;
    });
    virtualize(Function.prototype, 'bind');

    // 15.4 Array

    // 15.4.1--2
    markFunc(Array);

    // 15.4.3.1
    Array.DefineOwnProperty___('prototype', {
        value: Array.prototype,
        writable: false,
        enumerable: false,
        configurable: false
    });

    // 15.4.3.2
    Array.isArray = markFunc(isArray);
    Array.DefineOwnProperty___('isArray', {
        value: Array.isArray,
        writable: true,
        enumerable: false,
        configurable: true
    });

    // Array.slice
    virtualize(Array, 'slice');

    // 15.4.4.1
    Array.prototype.DefineOwnProperty___('constructor', {
        value: Array.prototype.constructor,
        writable: true,
        enumerable: false,
        configurable: false
    });

    // 15.4.4.2
    markFunc(Array.prototype.toString);

    // 15.4.4.3--6
    (function () {
        var methods = [
            'toLocaleString',
            'concat',
            'join',
            'pop'
        ];
        for (var i = 0, len = methods.length; i < len; ++i) {
            virtualize(Array.prototype, methods[i]);
        }
    })();

    // 15.4.4.7--9

    // Array generics can add a length property; static accesses are
    // whitelisted by the cajoler, but dynamic ones need this.
    function whitelistLengthIfItExists(dis) {
        if (('length' in dis) && !('length_v___' in dis)) {
            dis.DefineOwnProperty___('length', {
                value: dis.length,
                writable: true,
                configurable: true,
                enumerable: true
            });
        }
    }

    function guardedVirtualize(obj, name) {
        var orig = obj[name];
        virtualize(obj, name, function (var_args) {
            if (!isExtensible(this)) {
                throw new TypeError("This object is not extensible.");
            }
            var dis = safeDis(this);
            var result = orig.apply(dis, arguments);
            whitelistLengthIfItExists(dis);
            return result;
        });
    }

    (function () {
        // Reverse can create own numeric properties.
        var methods = [
            'push',
            'reverse',
            'shift',
            'splice',
            'unshift'
        ];
        for (var i = 0, len = methods.length; i < len; ++i) {
            guardedVirtualize(Array.prototype, methods[i]);
        }
    })();

    // 15.4.4.10
    virtualize(Array.prototype, 'slice');

    // 15.4.4.11
    virtualize(Array.prototype, 'sort', function (comparefn) {
        // This taming assumes that sort only modifies {@code this},
        // even though it may read numeric properties on the prototype chain.
        if (!isWritable(this, 'NUM___')) {
            throw new TypeError(
                'Cannot sort an object whose ' +
                    'numeric properties are not writable.');
        }
        if (!isExtensible(this)) {
            throw new TypeError(
                'Cannot sort an object that is not extensible.');
        }
        var result = (comparefn ?
            Array.prototype.sort.call(
                this,
                markFunc(function(var_args) {
                    return comparefn.f___(this, arguments);
                })
            ) :
            Array.prototype.sort.call(this));
        whitelistLengthIfItExists(this);
        return result;
    });

    // 15.4.4.14
    Array.prototype.indexOf = markFunc(function (value, fromIndex) {
        // length is always readable
        var len = this.length >>> 0;
        if (!len) {
            return -1;
        }
        var i = fromIndex || 0;
        if (i >= len) {
            return -1;
        }
        if (i < 0) {
            i += len;
        }
        for (; i < len; i++) {
            if (!this.hasOwnProperty(i)) {
                continue;
            }
            // Numerics are always readable
            if (value === this[i]) {
                return i;
            }
        }
        return -1;
    });
    virtualize(Array.prototype, 'indexOf');

    // 15.4.4.15
    Array.prototype.lastIndexOf = function (value, fromIndex) {
        // length is always readable
        var len = this.length;
        if (!len) {
            return -1;
        }
        var i = arguments[1] || len;
        if (i < 0) {
            i += len;
        }
        i = Math.min(i, len - 1); //source code here Math.min___ , but this function is not defined
        for (; i >= 0; i--) {
            if (!this.hasOwnProperty(i)) {
                continue;
            }
            if (value === this[i]) {
                return i;
            }
        }
        return -1;
    };
    virtualize(Array.prototype, 'lastIndexOf');

    // For protecting methods that use the map-reduce API against
    // inner hull breaches. For example, we don't want cajoled code
    // to be able to use {@code every} to invoke a toxic function as
    // a filter, for instance.
    //
    // {@code fun} must not be marked as callable.
    // {@code fun} expects
    // - a function {@code block} to use (like the filter in {@code every})
    // - an optional object {@code thisp} to use as {@code this}
    // It wraps {@code block} in a function that invokes its taming.
    function createOrWrap(obj, name, fun) {
        virtualize(obj, name);
        var vname = name + '_virt___';
        if (!obj[name]) {
            // Create
            obj[vname] = fun;
        } else {
            // Wrap
            obj[vname] = (function (orig) {
                return function (block) { //, thisp
                    var a = slice.call(arguments, 0);
                    // Replace block with the taming of block
                    a[0] = markFunc(function(var_args) {
                        return block.f___(this, arguments);
                    });
                    // Invoke the original function on the tamed
                    // {@code block} and optional {@code thisp}.
                    return orig.apply(this, a);
                };
            })(obj[name]);
        }
        markFunc(obj[vname]);
    }

    // 15.4.4.16
    createOrWrap(Array.prototype, 'every', function (block, thisp) {
        var len = this.length >>> 0;
        for (var i = 0; i < len; i++) {
            if (!block.f___(thisp, [this[i]])) {
                return false;
            }
        }
        return true;
    });

    // 15.4.4.17
    createOrWrap(Array.prototype, 'some', function (block, thisp) {
        var len = this.length >>> 0;
        for (var i = 0; i < this.length; i++) {
            if (block.f___(thisp, [this[i]])) {
                return true;
            }
        }
        return false;
    });

    // 15.4.4.18
    virtualize(Array.prototype, 'forEach', function (block, thisp) {
        var len = this.length >>> 0;
        for (var i = 0; i < len; i++) {
            if (i in this) {
                block.f___(thisp, [this[i], i, this]);
            }
        }
    });

    // 15.4.4.19
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
    createOrWrap(Array.prototype, 'map', function (fun, thisp) {
        var len = this.length >>> 0;
        if (!isFunction(fun)) {
            throw new TypeError('Expected a function instead of ' + fun);
        }
        var res = new Array(len);
        for (var i = 0; i < len; i++) {
            if (i in this) {
                res[i] = fun.f___(thisp, [this[i], i, this]);
            }
        }
        return res;
    });

    // 15.4.4.20
    createOrWrap(Array.prototype, 'filter', function (block, thisp) {
        var values = [];
        var len = this.length >>> 0;
        for (var i = 0; i < len; i++) {
            if (block.f___(thisp, [this[i]])) {
                values.push(this[i]);
            }
        }
        return values;
    });

    // 15.4.4.21
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
    createOrWrap(Array.prototype, 'reduce', function(fun) { // , initial
        // {@code fun} is of the form
        // function(previousValue, currentValue, index, array) { ... }
        var len = this.length >>> 0;
        if (!isFunction(fun)) {
            throw new TypeError('Expected a function instead of ' + fun);
        }
        // no value to return if no initial value and an empty array
        if (len === 0 && arguments.length === 1) {
            throw new TypeError('Expected an initial value or a non-empty array.');
        }
        var i = 0;
        if (arguments.length >= 2) {
            var rv = arguments[1];
        } else {
            do {
                if (i in this) {
                    rv = this[i++];
                    break;
                }
                // if array contains no values, no initial value to return
                if (++i >= len) {
                    throw new TypeError('Expected non-empty array.');
                }
            } while (true);
        }
        for (; i < len; i++) {
            if (i in this) {
                rv = fun.f___(USELESS, [rv, this[i], i, this]);
            }
        }
        return rv;
    });

    // 15.4.4.22
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
    createOrWrap(Array.prototype, 'reduceRight', function(fun) { // , initial
        var len = this.length >>> 0;
        if (!isFunction(fun)) {
            throw new TypeError('Expected a function instead of ' + fun);
        }
        // no value to return if no initial value, empty array
        if (len === 0 && arguments.length === 1) {
            throw new TypeError('Expected an initial value or a non-empty array.');
        }
        var i = len - 1;
        if (arguments.length >= 2) {
            var rv = arguments[1];
        } else {
            do {
                if (i in this) {
                    rv = this[i--];
                    break;
                }
                // if array contains no values, no initial value to return
                if (--i < 0) {
                    throw new TypeError('Expected a non-empty array.');
                }
            } while (true);
        }
        for (; i >= 0; i--) {
            if (i in this) {
                rv = fun.f___(USELESS, [rv, this[i], i, this]);
            }
        }
        return rv;
    });

    // 15.5 String

    // 15.5.1--2
    markFunc(String);

    // 15.5.3.1
    String.DefineOwnProperty___('prototype', {
        value: String.prototype,
        writable: false,
        enumerable: false,
        configurable: false
    });

    // 15.5.3.2
    virtualize(String, 'fromCharCode');

    // 15.5.4.1
    String.prototype.DefineOwnProperty___('constructor', {
        value: String.prototype.constructor,
        writable: true,
        enumerable: false,
        configurable: false
    });

    // 15.5.4.2
    markFunc(String.prototype.toString);

    // 15.5.4.3
    markFunc(String.prototype.valueOf);

    // 15.5.4.4--9, 13, 15--20
    // and the nonstandard but universally implemented substr.
    (function () {
        var methods = [
            'charAt',
            'charCodeAt',
            'concat',
            'indexOf',
            'lastIndexOf',
            'localeCompare',
            'slice',
            'substring',
            'toLowerCase',
            'toLocaleLowerCase',
            'toUpperCase',
            'toLocaleUpperCase',
            'substr'
        ];
        var i, len = methods.length;
        for (i = 0; i < len; ++i) {
            virtualize(String.prototype, methods[i]);
        }
    })();

    // 15.5.4.10, 12, 14
    /**
     * Verifies that regexp is something that can appear as a
     * parameter to a Javascript method that would use it in a match.
     * <p>
     * If it is a RegExp, then this match might mutate it, which must
     * not be allowed if regexp is frozen.
     *
     * Returns: a boolean indicating whether {@code regexp} should be
     * cast to a String
     */
    function enforceMatchable(regexp) {
        if (regexp instanceof RegExp) {
            if (isFrozen(regexp)) {
                throw new Error("Can't match with frozen RegExp: " + regexp);
            }
            return false;
        }
        return true;
    }

    function tameStringRegExp(orig) {
        return markFunc(function (regexp) {
            var cast = enforceMatchable(regexp);
            return orig.call(this, cast ? ('' + regexp) : regexp);
        });
    }

    (function () {
        var methods = [
            'match',
            'search',
            'split'
        ];
        for (var i = 0, len = methods.length; i < len; ++i) {
            virtualize(
                String.prototype,
                methods[i],
                tameStringRegExp(String.prototype[methods[i]]));
        }
    })();

    // 15.5.4.11
    virtualize(String.prototype, 'replace', function (searcher, replacement) {
        var cast = enforceMatchable(searcher);
        if (isFunction(replacement)) {
            replacement = asFirstClass(replacement);
        } else {
            replacement = '' + replacement;
        }
        return String.prototype.replace.call(
            this,
            cast ? ('' + searcher) : searcher,
            replacement
        );
    });

    // 15.5.4.20
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    var trimBeginRegexp = /^\s\s*/;
    var trimEndRegexp = /\s\s*$/;
    virtualize(String.prototype, 'trim', function () {
        return ('' + this).
            replace(trimBeginRegexp, '').
            replace(trimEndRegexp, '');
    });

    // 15.6 Boolean

    // 15.6.1--2
    markFunc(Boolean);

    // 15.6.3.1
    Boolean.DefineOwnProperty___('prototype', {
        value: Boolean.prototype,
        writable: false,
        enumerable: false,
        configurable: false
    });

    // 15.6.4.1
    Boolean.prototype.DefineOwnProperty___('constructor', {
        value: Boolean.prototype.constructor,
        writable: true,
        enumerable: false,
        configurable: false
    });

    // 15.7 Number

    // 15.7.1--2
    markFunc(Number);

    // 15.7.3.1--6
    (function () {
        var props = [
            'prototype',
            'MAX_VALUE',
            'MIN_VALUE',
            // 'NaN' is automatically readable since it's a numeric property
            'NEGATIVE_INFINITY',
            'POSITIVE_INFINITY'
        ];
        var i, len = props.length;
        for (i = 0; i < len; ++i) {
            Number.DefineOwnProperty___(props[i], {
                value: Number[props[i]],
                writable: false,
                enumerable: false,
                configurable: false
            });
        }
    })();

    // 15.7.4.1
    Number.prototype.DefineOwnProperty___('constructor', {
        value: Number.prototype.constructor,
        writable: true,
        enumerable: false,
        configurable: false
    });

    // 15.7.4.2
    markFunc(Number.prototype.toString);

    // 15.7.4.4
    markFunc(Number.prototype.valueOf);

    // 15.7.4.3, 5--7
    (function () {
        var methods = [
            'toLocaleString',
            'toFixed',
            'toExponential',
            'toPrecision'
        ];
        var i, len = methods.length;
        for (i = 0; i < len; ++i) {
            virtualize(Number.prototype, methods[i]);
        }
    })();

    // 15.8 Math

    // 15.8.1.1--8
    (function () {
        var props = [
            'E',
            'LN10',
            'LN2',
            'LOG2E',
            'LOG10E',
            'PI',
            'SQRT1_2',
            'SQRT2'
        ];
        var i, len = props.length;
        for (i = 0; i < len; ++i) {
            Math.DefineOwnProperty___(props[i], {
                value: Math[props[i]],
                writable: false,
                enumerable: false,
                configurable: false
            });
        }
    })();

    // 15.8.2.1--18
    (function () {
        var methods = [
            'abs',
            'acos',
            'asin',
            'atan',
            'atan2',
            'ceil',
            'cos',
            'exp',
            'floor',
            'log',
            'max',
            'min',
            'pow',
            'random',
            'round',
            'sin',
            'sqrt',
            'tan'
        ];
        var i, len = methods.length;
        for (i = 0; i < len; ++i) {
            virtualize(Math, methods[i]);
        }
    })();

    // 15.9 Date

    // 15.9.1--3
    markFunc(Date);

    // 15.9.4.1
    Date.DefineOwnProperty___('prototype', {
        value: Date.prototype,
        writable: false,
        enumerable: false,
        configurable: false
    });

    // 15.9.4.2--4
    (function () {
        var staticMethods = [
            'parse',
            'UTC',
            'now'
        ];
        var i, len = staticMethods.length;
        for (i = 0; i < len; ++i) {
            virtualize(Date, staticMethods[i]);
        }
    })();

    // 15.9.5.1
    Date.prototype.DefineOwnProperty___('constructor', {
        value: Date.prototype.constructor,
        writable: true,
        enumerable: false,
        configurable: false
    });

    // 15.9.5.2
    markFunc(Date.prototype.toString);

    // 15.9.5.8
    markFunc(Date.prototype.valueOf);

    // 15.9.5.3--7, 9--44
    (function () {
        var methods = [
            'toDateString',
            'toTimeString',
            'toLocaleString',
            'toLocaleDateString',
            'toLocaleTimeString',
            'getTime',
            'getFullYear',
            'getMonth',
            'getDate',
            'getDay',
            'getHours',
            'getMinutes',
            'getSeconds',
            'getUTCSeconds',
            'getUTCMinutes',
            'getUTCHours',
            'getUTCDay',
            'getUTCDate',
            'getUTCMonth',
            'getUTCMilliseconds',
            'getUTCFullYear',
            'getMilliseconds',
            'getTimezoneOffset',
            'setFullYear',
            'setMonth',
            'setDate',
            'setHours',
            'setMinutes',
            'setSeconds',
            'setMilliseconds',
            'setTime',
            'toISOString',
            'toJSON',
            'setUTCFullYear',
            'setUTCMonth',
            'setUTCDate',
            'setUTCHours',
            'setUTCMinutes',
            'setUTCSeconds',
            'setUTCMilliseconds'
        ];//here set UTC* method not added
        for (var i = 0; i < methods.length; ++i) {
            virtualize(Date.prototype, methods[i]);
        }
    })();

    // 15.10 RegExp

    // 15.10.5
    RegExp.f___ = markFunc(function (dis___, as) {
        var pattern = as[0], flags = as[1];
        if (classProp.call(pattern) === '[object RegExp]'
            && flags === void 0) {
            return pattern;
        }
        switch (as.length) {
            case 0:
                return new RegExp.new___();
            case 1:
                return new RegExp.new___(pattern);
            default:
                return new RegExp.new___(pattern, flags);
        }
    });

    RegExp.new___ = markFunc(function (pattern, flags) {
        var re;
        switch (arguments.length) {
            case 0:
                re = new RegExp();
                break;
            case 1:
                re = new RegExp(pattern);
                break;
            default:
                re = new RegExp(pattern, flags);
        }
        var instanceProps = [
            'source',
            'global',
            'ignoreCase',
            'multiline'
        ];
        for (var i = 0; i < instanceProps.length; ++i) {
            re.DefineOwnProperty___(instanceProps[i], {
                value: re[instanceProps[i]],
                writable: false,
                enumerable: false,
                configurable: false
            });
        }
        re.DefineOwnProperty___('lastIndex', {
            value: re.lastIndex,
            writable: true,
            enumerable: false,
            configurable: false
        });
        return re;
    });

    // 15.10.5.1
    RegExp.DefineOwnProperty___('prototype', {
        value: RegExp.prototype,
        writable: false,
        enumerable: false,
        configurable: false
    });

    RegExp.prototype.DefineOwnProperty___('constructor', {
        value: RegExp,
        writable: true,
        enumerable: false,
        configurable: false
    });

    // Invoking exec and test with no arguments uses ambient data,
    // so we force them to be called with an argument, even if undefined.

    // 15.10.6.2
    virtualize(RegExp.prototype, 'exec', function (specimen) {
        return RegExp.prototype.exec.call(safeDis(this), specimen);
    });

    // 15.10.6.3
    virtualize(RegExp.prototype, 'test', function (specimen) {
        return RegExp.prototype.test.call(safeDis(this), specimen);
    });


    // 15.11 Error

    // 15.11.1, 2
    markFunc(Error);

    // 15.11.3.1
    Error.DefineOwnProperty___('prototype', {
        value: Error.prototype,
        enumerable: false,
        configurable: false,
        writable: true
    });

    // 15.11.4.1
    Error.prototype.DefineOwnProperty___('constructor', {
        value: Error,
        enumerable: false,
        configurable: false,
        writable: true
    });

    // 15.11.4.2
    Error.prototype.DefineOwnProperty___('name', {
        value: 'Error',
        enumerable: false,
        configurable: false,
        writable: true
    });

    // 15.11.4.3
    Error.prototype.DefineOwnProperty___('message', {
        value: '',
        enumerable: false,
        configurable: false,
        writable: true
    });

    // 15.11.4.4
    markFunc(Error.prototype.toString);

    // 15.11.6
    markFunc(EvalError);
    markFunc(RangeError);
    markFunc(ReferenceError);
    markFunc(SyntaxError);
    markFunc(TypeError);
    markFunc(URIError);

    ////////////////////////////////////////////////////////////////////////
    // Module loading
    ////////////////////////////////////////////////////////////////////////

    var myNewModuleHandler;

    /**
     * Gets the current module handler.
     */
    function getNewModuleHandler() {
        return myNewModuleHandler;
    }

    /**
     * Registers a new-module-handler, to be called back when a new
     * module is loaded.
     * <p>
     * This callback mechanism is provided so that translated Cajita
     * modules can be loaded from a trusted site with the
     * &lt;script&gt; tag, which runs its script as a statement, not
     * an expression. The callback is of the form
     * <tt>newModuleHandler.handle(newModule)</tt>.
     */
    function setNewModuleHandler(newModuleHandler) {
        myNewModuleHandler = newModuleHandler;
    }

    /**
     * A new-module-handler which returns the new module without
     * instantiating it.
     */
    var obtainNewModule = snowWhite({
        handle: markFuncFreeze(function handleOnly(newModule) {
            return newModule;
        })
    });

    /**
     * Enable the use of Closure Inspector, nee LavaBug
     */
    function registerClosureInspector(module) {
        if (this && this.CLOSURE_INSPECTOR___
            && this.CLOSURE_INSPECTOR___.supportsCajaDebugging) {
            this.CLOSURE_INSPECTOR___.registerCajaModule(module);
        }
    }

    /**
     * Makes a mutable copy of an object.
     * <p>
     * Even if the original is frozen, the copy will still be mutable.
     * It does a shallow copy, i.e., if record y inherits from record x,
     * ___.copy(y) will also inherit from x.
     * Copies all whitelisted properties, not just enumerable ones.
     * All resulting properties are writable, enumerable, and configurable.
     */
    function copy(obj) {
        // TODO(ihab.awad): Primordials may not be frozen; is this safe?
        var result = Array.isArray(obj) ? [] : {};
        var keys = ownKeys(obj), len = keys.length;
        for (var i = 0; i < len; ++i) {
            var k = keys[i], v = obj[k];
            if (isNumericName(k)) {
                result[k] = v;
            }
            else {
                result.DefineOwnProperty___(k, {
                    value: v,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
        }
        return result;
    }

    /**
     * Makes and returns a fresh "normal" module handler whose imports
     * are initialized to a copy of the sharedImports.
     * <p>
     * This handles a new module by calling it, passing it the imports
     * object held in this handler. Successive modules handled by the
     * same "normal" handler thereby see a simulation of successive
     * updates to a shared global scope.
     */
    function makeNormalNewModuleHandler() {
        var imports = void 0;
        var lastOutcome = void 0;

        function getImports() {
            if (!imports) {
                imports = copy(sharedImports);
            }
            return imports;
        }

        return snowWhite({
            getImports: markFuncFreeze(getImports),
            setImports: markFuncFreeze(function setImports(newImports) {
                imports = newImports;
            }),

            /**
             * An outcome is a pair of a success flag and a value.
             * <p>
             * If the success flag is true, then the value is the normal
             * result of calling the module function. If the success flag is
             * false, then the value is the thrown error by which the module
             * abruptly terminated.
             * <p>
             * An html page is cajoled to a module that runs to completion,
             * but which reports as its outcome the outcome of its last
             * script block. In order to reify that outcome and report it
             * later, the html page initializes moduleResult___ to
             * NO_RESULT, the last script block is cajoled to set
             * moduleResult___ to something other than NO_RESULT on success
             * but to call handleUncaughtException() on
             * failure, and the html page returns moduleResult___ on
             * completion. handleUncaughtException() records a failed
             * outcome. This newModuleHandler's handle() method will not
             * overwrite an already reported outcome with NO_RESULT, so the
             * last script-block's outcome will be preserved.
             */
            getLastOutcome: markFuncFreeze(function getLastOutcome() {
                return lastOutcome;
            }),

            /**
             * If the last outcome is a success, returns its value;
             * otherwise <tt>undefined</tt>.
             */
            getLastValue: markFuncFreeze(function getLastValue() {
                if (lastOutcome && lastOutcome[0]) {
                    return lastOutcome[1];
                } else {
                    return void 0;
                }
            }),

            /**
             * Runs the newModule's module function.
             * <p>
             * Updates the last outcome to report the module function's
             * reported outcome. Propagate this outcome by terminating in
             * the same manner.
             */
            handle: markFuncFreeze(function handle(newModule) {
                registerClosureInspector(newModule);
                var outcome = void 0;
                try {
                    var result = newModule.instantiate(___, getImports());
                    if (result !== NO_RESULT) {
                        outcome = [true, result];
                    }
                } catch (ex) {
                    outcome = [false, ex];
                }
                lastOutcome = outcome;
                if (outcome) {
                    if (outcome[0]) {
                        return outcome[1];
                    } else {
                        throw outcome[1];
                    }
                } else {
                    return void 0;
                }
            }),

            /**
             * This emulates HTML5 exception handling for scripts as discussed at
             * http://code.google.com/p/google-caja/wiki/UncaughtExceptionHandling
             * and see HtmlCompiler.java for the code that calls this.
             * @param exception a raw exception.  Since {@code throw} can raise any
             *   value, exception could be any value accessible to cajoled code, or
             *   any value thrown by an API imported by cajoled code.
             * @param onerror the value of the raw reference "onerror" in top level
             *   cajoled code.  This will likely be undefined much of the time, but
             *   could be anything.  If it is a func, it can be called with
             *   three strings (message, source, lineNum) as the
             *   {@code window.onerror} event handler.
             * @param {string} source a URI describing the source file from which the
             *   error originated.
             * @param {string} lineNum the approximate line number in source at which
             *   the error originated.
             */
            handleUncaughtException: markFuncFreeze(
                function handleUncaughtException(exception, onerror, source, lineNum) {
                    lastOutcome = [false, exception];

                    // Cause exception to be rethrown if it is uncatchable.
                    var message = tameException(exception);
                    if ('object' === typeof exception && exception !== null) {
                        message = '' + (exception.message || exception.desc || message);
                    }

                    // If we wanted to provide a hook for containers to get uncaught
                    // exceptions, it would go here before onerror is invoked.

                    // See the HTML5 discussion for the reasons behind this rule.
                    if (!isFunction(onerror)) {
                        throw new TypeError(
                            'Expected onerror to be a function or undefined.');
                    }
                    var shouldReport = onerror.i___(
                        message,
                        '' + source,
                        '' + lineNum);
                    if (shouldReport !== false) {
                        log(source + ':' + lineNum + ': ' + message);
                    }
                })
        });
    }

    function isFlag(name) {
        return /_v___$/.test(name)
            || /_w___$/.test(name)
            || /_gw___$/.test(name)
            || /_c___$/.test(name)
            || /_e___$/.test(name)
            || /_g___$/.test(name)
            || /_s___$/.test(name)
            || /_m___$/.test(name);
    }

    function copyToImports(imports, source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                if (/__$/.test(p)) {
                    if (!isFlag(p)) {
                        // Caja hidden property on IMPORTS -- these are used by Domita
                        imports[p] = source[p];
                    }
                } else if (isNumericName(p)) {
                    // Set directly
                    imports[p] = source[p];
                } else {
                    imports.DefineOwnProperty___(p, {
                        value: source[p],
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                }
            }
        }
    }

    /**
     * Produces a function module given an object literal module
     */
    function prepareModule(module, load) {
        registerClosureInspector(module);
        function theModule(extraImports) {
            var imports;
            if (extraImports.window) {
                imports = extraImports.window;
                copyToImports(imports, sharedImports);
            } else {
                imports = copy(sharedImports);
            }
            copyToImports({
                load: load,
                cajaVM: cajaVM
            });
            copyToImports(imports, extraImports);
            return module.instantiate(___, imports);
        }

        // Whitelist certain module properties as visible to guest code. These
        // are all primitive values that do not allow two guest entities with
        // access to the same module object to communicate.
        var props = ['cajolerName', 'cajolerVersion', 'cajoledDate', 'moduleURL'];
        for (var i = 0; i < props.length; ++i) {
            theModule.DefineOwnProperty___(props[i], {
                value: module[props[i]],
                writable: false,
                enumerable: true,
                configurable: false
            });
        }
        // The below is a transitive freeze because includedModules is an array
        // of strings.
        if (!!module.includedModules) {
            theModule.DefineOwnProperty___('includedModules', {
                value: freeze(module.includedModules),
                writable: false,
                enumerable: true,
                configurable: false
            });
        }

        // Provide direct access to 'instantiate' for privileged use 
        theModule.instantiate___ = function(___, IMPORTS___) {
            return module.instantiate(___, IMPORTS___);
        };

        return markFuncFreeze(theModule);
    }

    /**
     * A module is an object literal containing metadata and an
     * <code>instantiate</code> member, which is a plugin-maker function.
     * <p>
     * loadModule(module) marks module's <code>instantiate</code> member as a
     * func, freezes the module, asks the current new-module-handler to handle it
     * (thereby notifying the handler), and returns the new module.
     */
    function loadModule(module) {
        freeze(module);
        markFuncFreeze(module.instantiate);
        return myNewModuleHandler.m___('handle', [module]);
    }

    // *********************************************************************
    // * Cajita Taming API
    // * Reproduced here for Domita's and Shindig's use; new
    // * tamings should be done with the ES5 API.
    // *********************************************************************

    function grantFunc(obj, name) {
        obj.DefineOwnProperty___(name, {
            value: markFuncFreeze(obj[name]),
            writable: false,
            enumerable: false,
            configurable: false
        });
    }

    function grantRead(obj, name) {
        obj.DefineOwnProperty___(name, {
            value: obj[name],
            writable: false,
            enumerable: false,
            configurable: false
        });
    }

    /**
     * Install a getter for proto[name] that returns a wrapper that
     * first verifies that {@code this} inherits from proto.
     * <p>
     * When a pre-existing Javascript method may do something unsafe
     * when applied to a {@code this} of the wrong type, we need to
     * prevent such mis-application.
     */
    function grantTypedMethod(proto, name) {
        name = '' + name;
        var original = proto[name];
        var f = function () {
        };
        f.prototype = proto;
        proto.DefineOwnProperty___(name, {
            value: markFunc(function guardedApplier(var_args) {
                if (!(this instanceof f)) {
                    throw new TypeError(
                        'Tamed method applied to the wrong class of object.');
                }
                return original.apply(this, slice.call(arguments, 0));
            }),
            enumerable: false,
            configurable: true,
            writable: true
        });
    }

    /**
     * Install a getter for proto[name] under the assumption
     * that the original is a generic innocent method.
     * <p>
     * As an innocent method, we assume it is exophoric (uses its
     * <tt>this</tt> parameter), requires a feral <tt>this</tt> and
     * arguments, and returns a feral result. As a generic method, we
     * assume that its <tt>this</tt> may be bound to objects that do not
     * inherit from <tt>proto</tt>.
     * <p>
     * The wrapper will untame <tt>this</tt>. Note that typically
     * <tt>this</tt> will be a constructed object and so will untame to
     * itself. The wrapper will also untame the arguments and tame and
     * return the result.
     */
    function grantInnocentMethod(proto, name) {
        var original = proto[name];
        proto.DefineOwnProperty___(name, {
            enumerable: false,
            configurable: false,
            get: function () {
                return function guardedApplier(var_args) {
                    var feralThis = safeDis(untame(this));
                    var feralArgs = untame(slice.call(arguments, 0));
                    var feralResult = original.apply(feralThis, feralArgs);
                    return tame(feralResult);
                };
            },
            set: void 0
        });
    }

    /**
     * A shorthand that happens to be useful here.
     * <p>
     * For all i in arg2s: func2(arg1,arg2s[i]).
     */
    function all2(func2, arg1, arg2s) {
        var len = arg2s.length;
        for (var i = 0; i < len; i += 1) {
            func2(arg1, arg2s[i]);
        }
    }

    /**
     * Inside a <tt>___.forOwnKeys()</tt> or <tt>___.forAllKeys()</tt>, the
     * body function can terminate early, as if with a conventional
     * <tt>break;</tt>, by doing a <pre>return ___.BREAK;</pre>
     */
    var BREAK = Token('BREAK');

    /**
     * Used in domita with the name "forOwnKeys" for iterating over
     * JSON containers.
     */
    function forOwnNonCajaKeys(obj, fn) {
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) {
                continue;
            }
            if (endsWith__.test(i)) {
                continue;
            }
            if (fn(i, obj[i]) === BREAK) {
                return;
            }
        }
    }

    // TODO(metaweta): Deprecate this API, since it requires that we leave
    // configurable set to true in order to use both a getter and a setter.
    function useGetHandler(obj, name, getHandler) {
        getHandler = markFunc(getHandler);
        name = '' + name;
        var desc = obj.GetOwnProperty___(name);
        if (!desc || !IsAccessorDescriptor(desc)) {
            desc = {
                enumerable: false,
                configurable: true,
                get: getHandler,
                set: void 0
            };
        } else {
            desc.get = getHandler;
        }
        obj.DefineOwnProperty___(name, desc);
    }

    function useSetHandler(obj, name, setHandler) {
        setHandler = markFunc(setHandler);
        name = '' + name;
        var desc = obj.GetOwnProperty___(name);
        if (!IsAccessorDescriptor(desc)) {
            desc = {
                enumerable: false,
                configurable: true,
                get: void 0,
                set: setHandler
            };
        } else {
            desc.set = setHandler;
        }
        obj.DefineOwnProperty___(name, desc);
    }

    function hasOwnProp(obj, name) {
        return obj && obj.hasOwnProperty(name);
    }

    // *********************************************************************
    // * Exports
    // *********************************************************************

    cajaVM = whitelistAll({
        // Diagnostics and condition enforcement
        log: log,
        enforce: enforce,
        enforceType: enforceType,
        enforceNat: enforceNat,

        // Object indistinguishability and object-keyed tables
        Token: Token,
        newTable: newTable,

        // Guards and Trademarks
        identity: identity,
        callWithEjector: callWithEjector,
        eject: eject,
        GuardT: GuardT,
        Trademark: Trademark,
        guard: guard,
        passesGuard: passesGuard,
        stamp: stamp,

        // Sealing & Unsealing
        makeSealerUnsealerPair: makeSealerUnsealerPair,

        // Defensible objects
        def: def,

        // Other
        isFunction: isFunction,
        USELESS: USELESS,
        manifest: manifest,
        allKeys: allKeys
    });

    function readImport(imports, name) {
        name = '' + name;
        if (imports.HasProperty___(name)) {
            return imports.v___(name);
        }
        throw new ReferenceError(name + ' is not defined.');
    }

    function declareImport(imports, name) {
        if (imports.HasProperty___(name)) {
            return;
        }
        imports.w___(name, void 0);
    }

    function writeImport(imports, name, value) {
        if (imports.HasProperty___(name)) {
            imports.w___(name, value);
            return value;
        }
        throw new ReferenceError(name + ' is not defined.');
    }

    function goodParseInt(n, radix) {
        n = '' + n;
        // This turns an undefined radix into a NaN but is ok since NaN
        // is treated as undefined by parseInt
        radix = +radix;
        var isHexOrOctal = /^\s*[+-]?\s*0(x?)/.exec(n);
        var isOct = isHexOrOctal ? isHexOrOctal[1] !== 'x' : false;

        if (isOct && (radix !== radix || 0 === radix)) {
            return parseInt(n, 10);
        }
        return parseInt(n, radix);
    }

    var sharedImports = whitelistAll({
        cajaVM: cajaVM,

        'null': null,
        'false': false,
        'true': true,
        'NaN': NaN,
        'Infinity': Infinity,
        'undefined': void 0,
        parseInt: markFunc(goodParseInt),
        parseFloat: markFunc(parseFloat),
        isNaN: markFunc(isNaN),
        isFinite: markFunc(isFinite),
        decodeURI: markFunc(decodeURI),
        decodeURIComponent: markFunc(decodeURIComponent),
        encodeURI: markFunc(encodeURI),
        encodeURIComponent: markFunc(encodeURIComponent),
        escape: escape ? markFunc(escape) : (void 0),
        Math: Math,
        JSON: JSON,

        Object: Object,
        Array: Array,
        String: String,
        Boolean: Boolean,
        Number: Number,
        Date: Date,
        RegExp: RegExp,
        Function: FakeFunction,

        Error: Error,
        EvalError: EvalError,
        RangeError: RangeError,
        ReferenceError: ReferenceError,
        SyntaxError: SyntaxError,
        TypeError: TypeError,
        URIError: URIError
    });

    Object.prototype.m___ = function (name, as) {
        name = '' + name;
        if (this[name + '_m___']) {
            return this[name].f___(this, as);
        }
        var m = this.v___(name);
        if (typeof m !== 'function') {
            // Temporary support for Cajita's keeper interface
            if (this.handleCall___) {
                return this.handleCall___(name, as);
            }
            throw new TypeError(
                "The property '" + name + "' is not a function.");
        }
        // Fastpath the method on the object pointed to by name_v___
        // which is truthy iff it's a data property
        var ownerObj = this[name + '_v___'];
        if (ownerObj && ownerObj !== Function.prototype) {
            fastpathMethod(ownerObj, name);
        }
        return m.f___(this, as);
    };

    ___ = {
        sharedImports: sharedImports,
        USELESS: USELESS,
        BREAK: BREAK,
        tameException: tameException,
        args: args,
        deodorize: deodorize,
        copy: copy,
        i: isIn,
        iM: initializeMap,
        f: markSafeFunc,
        markFunc: markFunc,
        markFuncFreeze: markFuncFreeze,
        Trademark: Trademark,
        makeSealerUnsealerPair: makeSealerUnsealerPair,
        getId: getId,
        getImports: getImports,
        unregister: unregister,
        newTable: newTable,
        whitelistAll: whitelistAll,
        snowWhite: snowWhite,
        Y: Y,
        ri: readImport,
        di: declareImport,
        wi: writeImport,
        // Cajita API
        grantRead: grantRead,
        grantFunc: grantFunc,
        grantTypedMethod: grantTypedMethod,
        grantInnocentMethod: grantInnocentMethod,
        all2: all2,
        hasOwnProp: hasOwnProp,
        forOwnKeys: forOwnNonCajaKeys,
        markCtor: markFuncFreeze,
        useGetHandler: useGetHandler,
        useSetHandler: useSetHandler,
        primFreeze: snowWhite,
        isJSONContainer: isExtensible,
        getLogFunc: getLogFunc,
        setLogFunc: setLogFunc,
        callPub: function (obj, name, args) {
            return obj.m___(name, args);
        },
        readPub: function (obj, name) {
            return obj.v___(name);
        },
        canRead: function (obj, name) {
            return (name + '_v___') in obj;
        },
        freeze: freeze,
        // Module loading
        getNewModuleHandler: getNewModuleHandler,
        setNewModuleHandler: setNewModuleHandler,
        obtainNewModule: obtainNewModule,
        makeNormalNewModuleHandler: makeNormalNewModuleHandler,
        prepareModule: prepareModule,
        loadModule: loadModule,
        NO_RESULT: NO_RESULT,
        // Defensible objects
        def: def,
        // Taming
        tame: tame,
        untame: untame,
        tamesTo: tamesTo,
        markTameAsReadOnlyRecord: markTameAsReadOnlyRecord,
        markTameAsFunction: markTameAsFunction,
        markTameAsCtor: markTameAsCtor,
        markTameAsXo4a: markTameAsXo4a,
        grantTameAsMethod: grantTameAsMethod,
        grantTameAsRead: grantTameAsRead,
        grantTameAsReadWrite: grantTameAsReadWrite,
        extend: extend
    };
    var cajaVMKeys = ownEnumKeys(cajaVM);
    for (var i = 0; i < cajaVMKeys.length; ++i) {
        ___[cajaVMKeys[i]] = cajaVM[cajaVMKeys[i]];
    }
    setNewModuleHandler(makeNormalNewModuleHandler());
})();
;
/* Copyright Google Inc.
 * Licensed under the Apache Licence Version 2.0
 * Autogenerated at Fri Jul 12 15:43:30 GMT+08:00 2013
 * @provides css
 */
var css = {
  'properties': (function () {
      var s = [ '|left|center|right', '|top|center|bottom',
        '#(?:[\\da-f]{3}){1,2}|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|rgb\\(\\s*(?:-?\\d+|0|[+\\-]?\\d+(?:\\.\\d+)?%)\\s*,\\s*(?:-?\\d+|0|[+\\-]?\\d+(?:\\.\\d+)?%)\\s*,\\s*(?:-?\\d+|0|[+\\-]?\\d+(?:\\.\\d+)?%)\\)',
        '[+\\-]?\\d+(?:\\.\\d+)?(?:[cem]m|ex|in|p[ctx])',
        '\\d+(?:\\.\\d+)?(?:[cem]m|ex|in|p[ctx])',
        'none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset',
        '[+\\-]?\\d+(?:\\.\\d+)?%', '\\d+(?:\\.\\d+)?%',
        'url\\(\"[^()\\\\\"\\r\\n]+\"\\)',
        'repeat-x|repeat-y|(?:repeat|space|round|no-repeat)(?:\\s+(?:repeat|space|round|no-repeat)){0,2}'
      ], c = [ RegExp('^\\s*(?:\\s*(?:0|' + s[ 3 ] + '|' + s[ 6 ] +
          ')){1,2}\\s*$', 'i'), RegExp('^\\s*(?:\\s*(?:0|' + s[ 3 ] + '|' + s[
            6 ] + ')){1,4}(?:\\s*\\/(?:\\s*(?:0|' + s[ 3 ] + '|' + s[ 6 ] +
          ')){1,4})?\\s*$', 'i'), RegExp('^\\s*(?:\\s*none|(?:(?:\\s*(?:' + s[
            2 ] + ')\\s+(?:0|' + s[ 3 ] + ')(?:\\s*(?:0|' + s[ 3 ] +
          ')){1,4}(?:\\s*inset)?|(?:\\s*inset)?\\s+(?:0|' + s[ 3 ] +
          ')(?:\\s*(?:0|' + s[ 3 ] + ')){1,4}(?:\\s*(?:' + s[ 2 ] +
          '))?)\\s*,)*(?:\\s*(?:' + s[ 2 ] + ')\\s+(?:0|' + s[ 3 ] +
          ')(?:\\s*(?:0|' + s[ 3 ] +
          ')){1,4}(?:\\s*inset)?|(?:\\s*inset)?\\s+(?:0|' + s[ 3 ] +
          ')(?:\\s*(?:0|' + s[ 3 ] + ')){1,4}(?:\\s*(?:' + s[ 2 ] +
          '))?))\\s*$', 'i'), RegExp('^\\s*(?:' + s[ 2 ] +
          '|transparent|inherit)\\s*$', 'i'), RegExp('^\\s*(?:' + s[ 5 ] +
          '|inherit)\\s*$', 'i'), RegExp('^\\s*(?:thin|medium|thick|0|' + s[ 3
          ] + '|inherit)\\s*$', 'i'), RegExp('^\\s*(?:(?:thin|medium|thick|0|'
          + s[ 3 ] + '|' + s[ 5 ] + '|' + s[ 2 ] +
          '|transparent|inherit)(?:\\s+(?:thin|medium|thick|0|' + s[ 3 ] +
          ')|\\s+(?:' + s[ 5 ] +
          ')|\\s*#(?:[\\da-f]{3}){1,2}|\\s+aqua|\\s+black|\\s+blue|\\s+fuchsia|\\s+gray|\\s+green|\\s+lime|\\s+maroon|\\s+navy|\\s+olive|\\s+orange|\\s+purple|\\s+red|\\s+silver|\\s+teal|\\s+white|\\s+yellow|\\s+rgb\\(\\s*(?:-?\\d+|0|'
          + s[ 6 ] + ')\\s*,\\s*(?:-?\\d+|0|' + s[ 6 ] +
          ')\\s*,\\s*(?:-?\\d+|0|' + s[ 6 ] +
          ')\\)|\\s+transparent|\\s+inherit){0,2}|inherit)\\s*$', 'i'),
        /^\s*(?:none|inherit)\s*$/i, RegExp('^\\s*(?:0|' + s[ 3 ] + '|' + s[ 6
          ] + '|auto|inherit)\\s*$', 'i'), RegExp('^\\s*(?:0|' + s[ 4 ] + '|' +
          s[ 7 ] + '|none|inherit|auto)\\s*$', 'i'), RegExp('^\\s*(?:0|' + s[ 4
          ] + '|' + s[ 7 ] + '|inherit|auto)\\s*$', 'i'), RegExp('^\\s*(?:(?:'
          + s[ 2 ] + '|invert|inherit|' + s[ 5 ] + '|thin|medium|thick|0|' + s[
            3 ] +
          ')(?:\\s*#(?:[\\da-f]{3}){1,2}|\\s+aqua|\\s+black|\\s+blue|\\s+fuchsia|\\s+gray|\\s+green|\\s+lime|\\s+maroon|\\s+navy|\\s+olive|\\s+orange|\\s+purple|\\s+red|\\s+silver|\\s+teal|\\s+white|\\s+yellow|\\s+rgb\\(\\s*(?:-?\\d+|0|'
          + s[ 6 ] + ')\\s*,\\s*(?:-?\\d+|0|' + s[ 6 ] +
          ')\\s*,\\s*(?:-?\\d+|0|' + s[ 6 ] +
          ')\\)|\\s+invert|\\s+inherit|\\s+(?:' + s[ 5 ] +
          '|inherit)|\\s+(?:thin|medium|thick|0|' + s[ 3 ] +
          '|inherit)){0,2}|inherit)\\s*$', 'i'), RegExp('^\\s*(?:' + s[ 2 ] +
          '|invert|inherit)\\s*$', 'i'),
        /^\s*(?:visible|hidden|scroll|auto|no-display|no-content)\s*$/i,
        RegExp('^\\s*(?:0|' + s[ 4 ] + '|' + s[ 7 ] + '|inherit)\\s*$', 'i'),
        /^\s*(?:auto|always|avoid|left|right|inherit)\s*$/i,
        /^\s*(?:clip|ellipsis)\s*$/i, RegExp('^\\s*(?:normal|0|' + s[ 3 ] +
          '|inherit)\\s*$', 'i') ];
      return {
        '-moz-border-radius': c[ 1 ],
        '-moz-border-radius-bottomleft': c[ 0 ],
        '-moz-border-radius-bottomright': c[ 0 ],
        '-moz-border-radius-topleft': c[ 0 ],
        '-moz-border-radius-topright': c[ 0 ],
        '-moz-box-shadow': c[ 2 ],
        '-moz-outline': c[ 11 ],
        '-moz-outline-color': c[ 12 ],
        '-moz-outline-style': c[ 4 ],
        '-moz-outline-width': c[ 5 ],
        '-o-text-overflow': c[ 16 ],
        '-webkit-border-bottom-left-radius': c[ 0 ],
        '-webkit-border-bottom-right-radius': c[ 0 ],
        '-webkit-border-radius': c[ 1 ],
        '-webkit-border-radius-bottom-left': c[ 0 ],
        '-webkit-border-radius-bottom-right': c[ 0 ],
        '-webkit-border-radius-top-left': c[ 0 ],
        '-webkit-border-radius-top-right': c[ 0 ],
        '-webkit-border-top-left-radius': c[ 0 ],
        '-webkit-border-top-right-radius': c[ 0 ],
        '-webkit-box-shadow': c[ 2 ],
        'background': RegExp('^\\s*(?:\\s*(?:' + s[ 8 ] + '|none|(?:(?:0|' + s[
            6 ] + '|' + s[ 3 ] + s[ 0 ] + ')(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3
          ] + s[ 1 ] + '))?|(?:center|(?:lef|righ)t(?:\\s+(?:0|' + s[ 6 ] + '|'
          + s[ 3 ] + '))?|(?:top|bottom)(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] +
          '))?)(?:\\s+(?:center|(?:lef|righ)t(?:\\s+(?:0|' + s[ 6 ] + '|' + s[
            3 ] + '))?|(?:top|bottom)(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] +
          '))?))?)(?:\\s*\\/\\s*(?:(?:0|' + s[ 4 ] + '|' + s[ 6 ] +
          '|auto)(?:\\s+(?:0|' + s[ 4 ] + '|' + s[ 6 ] +
          '|auto)){0,2}|cover|contain))?|\\/\\s*(?:(?:0|' + s[ 4 ] + '|' + s[ 6
          ] + '|auto)(?:\\s+(?:0|' + s[ 4 ] + '|' + s[ 6 ] +
          '|auto)){0,2}|cover|contain)|' + s[ 9 ] +
          '|scroll|fixed|local|(?:border|padding|content)-box)(?:\\s*' + s[ 8 ]
          + '|\\s+none|(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] + s[ 0 ] +
          ')(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] + s[ 1 ] +
          '))?|(?:\\s+(?:center|(?:lef|righ)t(?:\\s+(?:0|' + s[ 6 ] + '|' + s[
            3 ] + '))?|(?:top|bottom)(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] +
          '))?)){1,2})(?:\\s*\\/\\s*(?:(?:0|' + s[ 4 ] + '|' + s[ 6 ] +
          '|auto)(?:\\s+(?:0|' + s[ 4 ] + '|' + s[ 6 ] +
          '|auto)){0,2}|cover|contain))?|\\s*\\/\\s*(?:(?:0|' + s[ 4 ] + '|' +
          s[ 6 ] + '|auto)(?:\\s+(?:0|' + s[ 4 ] + '|' + s[ 6 ] +
          '|auto)){0,2}|cover|contain)|\\s+repeat-x|\\s+repeat-y|(?:\\s+(?:repeat|space|round|no-repeat)){1,2}|\\s+(?:scroll|fixed|local)|\\s+(?:border|padding|content)-box){0,4}\\s*,)*\\s*(?:'
          + s[ 2 ] + '|transparent|inherit|' + s[ 8 ] + '|none|(?:(?:0|' + s[ 6
          ] + '|' + s[ 3 ] + s[ 0 ] + ')(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] +
          s[ 1 ] + '))?|(?:center|(?:lef|righ)t(?:\\s+(?:0|' + s[ 6 ] + '|' +
          s[ 3 ] + '))?|(?:top|bottom)(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] +
          '))?)(?:\\s+(?:center|(?:lef|righ)t(?:\\s+(?:0|' + s[ 6 ] + '|' + s[
            3 ] + '))?|(?:top|bottom)(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] +
          '))?))?)(?:\\s*\\/\\s*(?:(?:0|' + s[ 4 ] + '|' + s[ 6 ] +
          '|auto)(?:\\s+(?:0|' + s[ 4 ] + '|' + s[ 6 ] +
          '|auto)){0,2}|cover|contain))?|\\/\\s*(?:(?:0|' + s[ 4 ] + '|' + s[ 6
          ] + '|auto)(?:\\s+(?:0|' + s[ 4 ] + '|' + s[ 6 ] +
          '|auto)){0,2}|cover|contain)|' + s[ 9 ] +
          '|scroll|fixed|local|(?:border|padding|content)-box)(?:\\s*#(?:[\\da-f]{3}){1,2}|\\s+aqua|\\s+black|\\s+blue|\\s+fuchsia|\\s+gray|\\s+green|\\s+lime|\\s+maroon|\\s+navy|\\s+olive|\\s+orange|\\s+purple|\\s+red|\\s+silver|\\s+teal|\\s+white|\\s+yellow|\\s+rgb\\(\\s*(?:-?\\d+|0|'
          + s[ 6 ] + ')\\s*,\\s*(?:-?\\d+|0|' + s[ 6 ] +
          ')\\s*,\\s*(?:-?\\d+|0|' + s[ 6 ] +
          ')\\)|\\s+transparent|\\s+inherit|\\s*' + s[ 8 ] +
          '|\\s+none|(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] + s[ 0 ] +
          ')(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] + s[ 1 ] +
          '))?|(?:\\s+(?:center|(?:lef|righ)t(?:\\s+(?:0|' + s[ 6 ] + '|' + s[
            3 ] + '))?|(?:top|bottom)(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] +
          '))?)){1,2})(?:\\s*\\/\\s*(?:(?:0|' + s[ 4 ] + '|' + s[ 6 ] +
          '|auto)(?:\\s+(?:0|' + s[ 4 ] + '|' + s[ 6 ] +
          '|auto)){0,2}|cover|contain))?|\\s*\\/\\s*(?:(?:0|' + s[ 4 ] + '|' +
          s[ 6 ] + '|auto)(?:\\s+(?:0|' + s[ 4 ] + '|' + s[ 6 ] +
          '|auto)){0,2}|cover|contain)|\\s+repeat-x|\\s+repeat-y|(?:\\s+(?:repeat|space|round|no-repeat)){1,2}|\\s+(?:scroll|fixed|local)|\\s+(?:border|padding|content)-box){0,5}\\s*$',
          'i'),
        'background-attachment':
        /^\s*(?:scroll|fixed|local)(?:\s*,\s*(?:scroll|fixed|local))*\s*$/i,
        'background-color': c[ 3 ],
        'background-image': RegExp('^\\s*(?:' + s[ 8 ] +
          '|none)(?:\\s*,\\s*(?:' + s[ 8 ] + '|none))*\\s*$', 'i'),
        'background-position': RegExp('^\\s*(?:(?:0|' + s[ 6 ] + '|' + s[ 3 ] +
          s[ 0 ] + ')(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] + s[ 1 ] +
          '))?|(?:center|(?:lef|righ)t(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] +
          '))?|(?:top|bottom)(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] +
          '))?)(?:\\s+(?:center|(?:lef|righ)t(?:\\s+(?:0|' + s[ 6 ] + '|' + s[
            3 ] + '))?|(?:top|bottom)(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] +
          '))?))?)(?:\\s*,\\s*(?:(?:0|' + s[ 6 ] + '|' + s[ 3 ] + s[ 0 ] +
          ')(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] + s[ 1 ] +
          '))?|(?:center|(?:lef|righ)t(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] +
          '))?|(?:top|bottom)(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] +
          '))?)(?:\\s+(?:center|(?:lef|righ)t(?:\\s+(?:0|' + s[ 6 ] + '|' + s[
            3 ] + '))?|(?:top|bottom)(?:\\s+(?:0|' + s[ 6 ] + '|' + s[ 3 ] +
          '))?))?))*\\s*$', 'i'),
        'background-repeat': RegExp('^\\s*(?:' + s[ 9 ] + ')(?:\\s*,\\s*(?:' +
          s[ 9 ] + '))*\\s*$', 'i'),
        'border': RegExp('^\\s*(?:(?:thin|medium|thick|0|' + s[ 3 ] + '|' + s[
            5 ] + '|' + s[ 2 ] + '|transparent)(?:\\s+(?:thin|medium|thick|0|'
          + s[ 3 ] + ')|\\s+(?:' + s[ 5 ] +
          ')|\\s*#(?:[\\da-f]{3}){1,2}|\\s+aqua|\\s+black|\\s+blue|\\s+fuchsia|\\s+gray|\\s+green|\\s+lime|\\s+maroon|\\s+navy|\\s+olive|\\s+orange|\\s+purple|\\s+red|\\s+silver|\\s+teal|\\s+white|\\s+yellow|\\s+rgb\\(\\s*(?:-?\\d+|0|'
          + s[ 6 ] + ')\\s*,\\s*(?:-?\\d+|0|' + s[ 6 ] +
          ')\\s*,\\s*(?:-?\\d+|0|' + s[ 6 ] +
          ')\\)|\\s+transparent){0,2}|inherit)\\s*$', 'i'),
        'border-bottom': c[ 6 ],
        'border-bottom-color': c[ 3 ],
        'border-bottom-left-radius': c[ 0 ],
        'border-bottom-right-radius': c[ 0 ],
        'border-bottom-style': c[ 4 ],
        'border-bottom-width': c[ 5 ],
        'border-collapse': /^\s*(?:collapse|separate|inherit)\s*$/i,
        'border-color': RegExp('^\\s*(?:(?:' + s[ 2 ] +
          '|transparent)(?:\\s*#(?:[\\da-f]{3}){1,2}|\\s+aqua|\\s+black|\\s+blue|\\s+fuchsia|\\s+gray|\\s+green|\\s+lime|\\s+maroon|\\s+navy|\\s+olive|\\s+orange|\\s+purple|\\s+red|\\s+silver|\\s+teal|\\s+white|\\s+yellow|\\s+rgb\\(\\s*(?:-?\\d+|0|'
          + s[ 6 ] + ')\\s*,\\s*(?:-?\\d+|0|' + s[ 6 ] +
          ')\\s*,\\s*(?:-?\\d+|0|' + s[ 6 ] +
          ')\\)|\\s+transparent){0,4}|inherit)\\s*$', 'i'),
        'border-left': c[ 6 ],
        'border-left-color': c[ 3 ],
        'border-left-style': c[ 4 ],
        'border-left-width': c[ 5 ],
        'border-radius': c[ 1 ],
        'border-right': c[ 6 ],
        'border-right-color': c[ 3 ],
        'border-right-style': c[ 4 ],
        'border-right-width': c[ 5 ],
        'border-spacing': RegExp('^\\s*(?:(?:\\s*(?:0|' + s[ 3 ] +
          ')){1,2}|\\s*inherit)\\s*$', 'i'),
        'border-style': RegExp('^\\s*(?:(?:' + s[ 5 ] + ')(?:\\s+(?:' + s[ 5 ]
          + ')){0,4}|inherit)\\s*$', 'i'),
        'border-top': c[ 6 ],
        'border-top-color': c[ 3 ],
        'border-top-left-radius': c[ 0 ],
        'border-top-right-radius': c[ 0 ],
        'border-top-style': c[ 4 ],
        'border-top-width': c[ 5 ],
        'border-width': RegExp('^\\s*(?:(?:thin|medium|thick|0|' + s[ 3 ] +
          ')(?:\\s+(?:thin|medium|thick|0|' + s[ 3 ] + ')){0,4}|inherit)\\s*$',
          'i'),
        'bottom': c[ 8 ],
        'box-shadow': c[ 2 ],
        'caption-side': /^\s*(?:top|bottom|inherit)\s*$/i,
        'clear': /^\s*(?:none|left|right|both|inherit)\s*$/i,
        'clip': RegExp('^\\s*(?:rect\\(\\s*(?:0|' + s[ 3 ] +
          '|auto)\\s*,\\s*(?:0|' + s[ 3 ] + '|auto)\\s*,\\s*(?:0|' + s[ 3 ] +
          '|auto)\\s*,\\s*(?:0|' + s[ 3 ] + '|auto)\\)|auto|inherit)\\s*$',
          'i'),
        'color': RegExp('^\\s*(?:' + s[ 2 ] + '|inherit)\\s*$', 'i'),
        'counter-increment': c[ 7 ],
        'counter-reset': c[ 7 ],
        'cursor': RegExp('^\\s*(?:(?:\\s*' + s[ 8 ] +
          '\\s*,)*\\s*(?:auto|crosshair|default|pointer|move|e-resize|ne-resize|nw-resize|n-resize|se-resize|sw-resize|s-resize|w-resize|text|wait|help|progress|all-scroll|col-resize|hand|no-drop|not-allowed|row-resize|vertical-text)|\\s*inherit)\\s*$',
          'i'),
        'direction': /^\s*(?:ltr|rtl|inherit)\s*$/i,
        'display':
        /^\s*(?:inline|block|list-item|run-in|inline-block|table|inline-table|table-row-group|table-header-group|table-footer-group|table-row|table-column-group|table-column|table-cell|table-caption|none|inherit|-moz-inline-box|-moz-inline-stack)\s*$/i,
        'empty-cells': /^\s*(?:show|hide|inherit)\s*$/i,
        'float': /^\s*(?:left|right|none|inherit)\s*$/i,
        'font':
        RegExp('^\\s*(?:(?:normal|italic|oblique|inherit|small-caps|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)(?:\\s+(?:normal|italic|oblique|inherit|small-caps|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)){0,2}\\s+(?:xx-small|x-small|small|medium|large|x-large|xx-large|(?:small|larg)er|0|'
          + s[ 4 ] + '|' + s[ 7 ] +
          '|inherit)(?:\\s*\\/\\s*(?:normal|0|\\d+(?:\\.\\d+)?|' + s[ 4 ] + '|'
          + s[ 7 ] +
          '|inherit))?(?:(?:\\s*\"\\w(?:[\\w-]*\\w)(?:\\s+\\w([\\w-]*\\w))*\"|\\s+(?:serif|sans-serif|cursive|fantasy|monospace))(?:\\s*,\\s*(?:\"\\w(?:[\\w-]*\\w)(?:\\s+\\w([\\w-]*\\w))*\"|serif|sans-serif|cursive|fantasy|monospace))*|\\s+inherit)|caption|icon|menu|message-box|small-caption|status-bar|inherit)\\s*$',
          'i'),
        'font-family':
        /^\s*(?:(?:"\w(?:[\w-]*\w)(?:\s+\w([\w-]*\w))*"|serif|sans-serif|cursive|fantasy|monospace)(?:\s*,\s*(?:"\w(?:[\w-]*\w)(?:\s+\w([\w-]*\w))*"|serif|sans-serif|cursive|fantasy|monospace))*|inherit)\s*$/i,
        'font-size':
        RegExp('^\\s*(?:xx-small|x-small|small|medium|large|x-large|xx-large|(?:small|larg)er|0|'
          + s[ 4 ] + '|' + s[ 7 ] + '|inherit)\\s*$', 'i'),
        'font-stretch':
        /^\s*(?:normal|wider|narrower|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded)\s*$/i,
        'font-style': /^\s*(?:normal|italic|oblique|inherit)\s*$/i,
        'font-variant': /^\s*(?:normal|small-caps|inherit)\s*$/i,
        'font-weight':
        /^\s*(?:normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit)\s*$/i,
        'height': c[ 8 ],
        'left': c[ 8 ],
        'letter-spacing': c[ 17 ],
        'line-height': RegExp('^\\s*(?:normal|0|\\d+(?:\\.\\d+)?|' + s[ 4 ] +
          '|' + s[ 7 ] + '|inherit)\\s*$', 'i'),
        'list-style':
        RegExp('^\\s*(?:(?:disc|circle|square|decimal|decimal-leading-zero|lower-roman|upper-roman|lower-greek|lower-latin|upper-latin|armenian|georgian|lower-alpha|upper-alpha|none|inherit|inside|outside|'
          + s[ 8 ] +
          ')(?:\\s+(?:disc|circle|square|decimal|decimal-leading-zero|lower-roman|upper-roman|lower-greek|lower-latin|upper-latin|armenian|georgian|lower-alpha|upper-alpha|none|inherit)|\\s+(?:inside|outside|inherit)|\\s*'
          + s[ 8 ] + '|\\s+none|\\s+inherit){0,2}|inherit)\\s*$', 'i'),
        'list-style-image': RegExp('^\\s*(?:' + s[ 8 ] + '|none|inherit)\\s*$',
          'i'),
        'list-style-position': /^\s*(?:inside|outside|inherit)\s*$/i,
        'list-style-type':
        /^\s*(?:disc|circle|square|decimal|decimal-leading-zero|lower-roman|upper-roman|lower-greek|lower-latin|upper-latin|armenian|georgian|lower-alpha|upper-alpha|none|inherit)\s*$/i,
        'margin': RegExp('^\\s*(?:(?:0|' + s[ 3 ] + '|' + s[ 6 ] +
          '|auto)(?:\\s+(?:0|' + s[ 3 ] + '|' + s[ 6 ] +
          '|auto)){0,4}|inherit)\\s*$', 'i'),
        'margin-bottom': c[ 8 ],
        'margin-left': c[ 8 ],
        'margin-right': c[ 8 ],
        'margin-top': c[ 8 ],
        'max-height': c[ 9 ],
        'max-width': c[ 9 ],
        'min-height': c[ 10 ],
        'min-width': c[ 10 ],
        'opacity': /^\s*(?:0(?:\.\d+)?|\.\d+|1(?:\.0+)?|inherit)\s*$/i,
        'outline': c[ 11 ],
        'outline-color': c[ 12 ],
        'outline-style': c[ 4 ],
        'outline-width': c[ 5 ],
        'overflow': /^\s*(?:visible|hidden|scroll|auto|inherit)\s*$/i,
        'overflow-x': c[ 13 ],
        'overflow-y': c[ 13 ],
        'padding': RegExp('^\\s*(?:(?:\\s*(?:0|' + s[ 4 ] + '|' + s[ 7 ] +
          ')){1,4}|\\s*inherit)\\s*$', 'i'),
        'padding-bottom': c[ 14 ],
        'padding-left': c[ 14 ],
        'padding-right': c[ 14 ],
        'padding-top': c[ 14 ],
        'page-break-after': c[ 15 ],
        'page-break-before': c[ 15 ],
        'page-break-inside': /^\s*(?:avoid|auto|inherit)\s*$/i,
        'position': /^\s*(?:static|relative|absolute|inherit)\s*$/i,
        'right': c[ 8 ],
        'table-layout': /^\s*(?:auto|fixed|inherit)\s*$/i,
        'text-align': /^\s*(?:left|right|center|justify|inherit)\s*$/i,
        'text-decoration':
        /^\s*(?:none|(?:underline|overline|line-through|blink)(?:\s+(?:underline|overline|line-through|blink)){0,3}|inherit)\s*$/i,
        'text-indent': RegExp('^\\s*(?:0|' + s[ 3 ] + '|' + s[ 6 ] +
          '|inherit)\\s*$', 'i'),
        'text-overflow': c[ 16 ],
        'text-shadow': c[ 2 ],
        'text-transform':
        /^\s*(?:capitalize|uppercase|lowercase|none|inherit)\s*$/i,
        'top': c[ 8 ],
        'unicode-bidi': /^\s*(?:normal|embed|bidi-override|inherit)\s*$/i,
        'vertical-align':
        RegExp('^\\s*(?:baseline|sub|super|top|text-top|middle|bottom|text-bottom|0|'
          + s[ 6 ] + '|' + s[ 3 ] + '|inherit)\\s*$', 'i'),
        'visibility': /^\s*(?:visible|hidden|collapse|inherit)\s*$/i,
        'volume': RegExp('^\\s*(?:0|\\d+(?:\\.\\d+)?|' + s[ 7 ] +
          '|silent|x-soft|soft|medium|loud|x-loud|inherit)\\s*$', 'i'),
        'white-space':
        /^\s*(?:normal|pre|nowrap|pre-wrap|pre-line|inherit|-o-pre-wrap|-moz-pre-wrap|-pre-wrap)\s*$/i,
        'width': RegExp('^\\s*(?:0|' + s[ 4 ] + '|' + s[ 7 ] +
          '|auto|inherit)\\s*$', 'i'),
        'word-spacing': c[ 17 ],
        'word-wrap': /^\s*(?:normal|break-word)\s*$/i,
        'z-index': /^\s*(?:auto|\d+|inherit)\s*$/i,
        'zoom': RegExp('^\\s*(?:normal|0|\\d+(?:\\.\\d+)?|' + s[ 7 ] +
          ')\\s*$', 'i')
      };
    })(),
  'alternates': {
    'MozBoxShadow': [ 'boxShadow' ],
    'WebkitBoxShadow': [ 'boxShadow' ],
    'float': [ 'cssFloat', 'styleFloat' ]
  },
  'HISTORY_INSENSITIVE_STYLE_WHITELIST': {
    'display': true,
    'filter': true,
    'float': true,
    'height': true,
    'left': true,
    'opacity': true,
    'overflow': true,
    'position': true,
    'right': true,
    'top': true,
    'visibility': true,
    'width': true,
    'padding-left': true,
    'padding-right': true,
    'padding-top': true,
    'padding-bottom': true
  }
}
;
/* Copyright Google Inc.
 * Licensed under the Apache Licence Version 2.0
 * Autogenerated at Fri Jul 12 15:43:30 GMT+08:00 2013
 * @provides html4
 */
var html4 = {};
html4 .atype = {
  'NONE': 0,
  'URI': 1,
  'URI_FRAGMENT': 11,
  'SCRIPT': 2,
  'STYLE': 3,
  'ID': 4,
  'IDREF': 5,
  'IDREFS': 6,
  'GLOBAL_NAME': 7,
  'LOCAL_NAME': 8,
  'CLASSES': 9,
  'FRAME_TARGET': 10
};
html4 .ATTRIBS = {
  '*::class': 9,
  '*::dir': 0,
  '*::id': 4,
  '*::lang': 0,
  '*::onclick': 2,
  '*::ondblclick': 2,
  '*::onkeydown': 2,
  '*::onkeypress': 2,
  '*::onkeyup': 2,
  '*::onload': 2,
  '*::onmousedown': 2,
  '*::onmousemove': 2,
  '*::onmouseout': 2,
  '*::onmouseover': 2,
  '*::onmouseup': 2,
  '*::style': 3,
  '*::title': 0,
  'a::accesskey': 0,
  'a::coords': 0,
  'a::href': 1,
  'a::hreflang': 0,
  'a::name': 8,
  'a::onblur': 2,
  'a::onfocus': 2,
  'a::rel': 0,
  'a::rev': 0,
  'a::shape': 0,
  'a::tabindex': 0,
  'a::target': 10,
  'a::type': 0,
  'area::accesskey': 0,
  'area::alt': 0,
  'area::coords': 0,
  'area::href': 1,
  'area::nohref': 0,
  'area::onblur': 2,
  'area::onfocus': 2,
  'area::shape': 0,
  'area::tabindex': 0,
  'area::target': 10,
  'bdo::dir': 0,
  'blockquote::cite': 1,
  'br::clear': 0,
  'button::accesskey': 0,
  'button::disabled': 0,
  'button::name': 8,
  'button::onblur': 2,
  'button::onfocus': 2,
  'button::tabindex': 0,
  'button::type': 0,
  'button::value': 0,
  'caption::align': 0,
  'col::align': 0,
  'col::char': 0,
  'col::charoff': 0,
  'col::span': 0,
  'col::valign': 0,
  'col::width': 0,
  'colgroup::align': 0,
  'colgroup::char': 0,
  'colgroup::charoff': 0,
  'colgroup::span': 0,
  'colgroup::valign': 0,
  'colgroup::width': 0,
  'del::cite': 1,
  'del::datetime': 0,
  'div::align': 0,
  'dl::compact': 0,
  'font::color': 0,
  'font::face': 0,
  'font::size': 0,
  'form::accept': 0,
  'form::action': 1,
  'form::autocomplete': 0,
  'form::enctype': 0,
  'form::method': 0,
  'form::name': 8,
  'form::onreset': 2,
  'form::onsubmit': 2,
  'form::target': 10,
  'h1::align': 0,
  'h2::align': 0,
  'h3::align': 0,
  'h4::align': 0,
  'h5::align': 0,
  'h6::align': 0,
  'hr::align': 0,
  'hr::noshade': 0,
  'hr::size': 0,
  'hr::width': 0,
  'img::align': 0,
  'img::alt': 0,
  'img::border': 0,
  'img::height': 0,
  'img::hspace': 0,
  'img::ismap': 0,
  'img::name': 7,
  'img::src': 1,
  'img::usemap': 11,
  'img::vspace': 0,
  'img::width': 0,
  'input::accept': 0,
  'input::accesskey': 0,
  'input::align': 0,
  'input::alt': 0,
  'input::autocomplete': 0,
  'input::checked': 0,
  'input::disabled': 0,
  'input::ismap': 0,
  'input::maxlength': 0,
  'input::name': 8,
  'input::onblur': 2,
  'input::onchange': 2,
  'input::onfocus': 2,
  'input::onselect': 2,
  'input::readonly': 0,
  'input::size': 0,
  'input::src': 1,
  'input::tabindex': 0,
  'input::type': 0,
  'input::usemap': 11,
  'input::value': 0,
  'ins::cite': 1,
  'ins::datetime': 0,
  'label::accesskey': 0,
  'label::for': 5,
  'label::onblur': 2,
  'label::onfocus': 2,
  'legend::accesskey': 0,
  'legend::align': 0,
  'li::type': 0,
  'li::value': 0,
  'map::name': 7,
  'ol::compact': 0,
  'ol::start': 0,
  'ol::type': 0,
  'optgroup::disabled': 0,
  'optgroup::label': 0,
  'option::disabled': 0,
  'option::label': 0,
  'option::selected': 0,
  'option::value': 0,
  'p::align': 0,
  'pre::width': 0,
  'q::cite': 1,
  'select::disabled': 0,
  'select::multiple': 0,
  'select::name': 8,
  'select::onblur': 2,
  'select::onchange': 2,
  'select::onfocus': 2,
  'select::size': 0,
  'select::tabindex': 0,
  'table::align': 0,
  'table::bgcolor': 0,
  'table::border': 0,
  'table::cellpadding': 0,
  'table::cellspacing': 0,
  'table::frame': 0,
  'table::rules': 0,
  'table::summary': 0,
  'table::width': 0,
  'tbody::align': 0,
  'tbody::char': 0,
  'tbody::charoff': 0,
  'tbody::valign': 0,
  'td::abbr': 0,
  'td::align': 0,
  'td::axis': 0,
  'td::bgcolor': 0,
  'td::char': 0,
  'td::charoff': 0,
  'td::colspan': 0,
  'td::headers': 6,
  'td::height': 0,
  'td::nowrap': 0,
  'td::rowspan': 0,
  'td::scope': 0,
  'td::valign': 0,
  'td::width': 0,
  'textarea::accesskey': 0,
  'textarea::cols': 0,
  'textarea::disabled': 0,
  'textarea::name': 8,
  'textarea::onblur': 2,
  'textarea::onchange': 2,
  'textarea::onfocus': 2,
  'textarea::onselect': 2,
  'textarea::readonly': 0,
  'textarea::rows': 0,
  'textarea::tabindex': 0,
  'tfoot::align': 0,
  'tfoot::char': 0,
  'tfoot::charoff': 0,
  'tfoot::valign': 0,
  'th::abbr': 0,
  'th::align': 0,
  'th::axis': 0,
  'th::bgcolor': 0,
  'th::char': 0,
  'th::charoff': 0,
  'th::colspan': 0,
  'th::headers': 6,
  'th::height': 0,
  'th::nowrap': 0,
  'th::rowspan': 0,
  'th::scope': 0,
  'th::valign': 0,
  'th::width': 0,
  'thead::align': 0,
  'thead::char': 0,
  'thead::charoff': 0,
  'thead::valign': 0,
  'tr::align': 0,
  'tr::bgcolor': 0,
  'tr::char': 0,
  'tr::charoff': 0,
  'tr::valign': 0,
  'ul::compact': 0,
  'ul::type': 0
};
html4 .eflags = {
  'OPTIONAL_ENDTAG': 1,
  'EMPTY': 2,
  'CDATA': 4,
  'RCDATA': 8,
  'UNSAFE': 16,
  'FOLDABLE': 32,
  'SCRIPT': 64,
  'STYLE': 128
};
html4 .ELEMENTS = {
  'a': 0,
  'abbr': 0,
  'acronym': 0,
  'address': 0,
  'applet': 16,
  'area': 2,
  'b': 0,
  'base': 18,
  'basefont': 18,
  'bdo': 0,
  'big': 0,
  'blockquote': 0,
  'body': 49,
  'br': 2,
  'button': 0,
  'canvas': 16,
  'caption': 0,
  'center': 0,
  'cite': 0,
  'code': 16,
  'col': 2,
  'colgroup': 1,
  'dd': 1,
  'del': 0,
  'dfn': 0,
  'dir': 16,
  'div': 0,
  'dl': 0,
  'dt': 1,
  'em': 0,
  'embed': 0,
  'fieldset': 0,
  'font': 0,
  'form': 0,
  'frame': 18,
  'frameset': 16,
  'h1': 0,
  'h2': 0,
  'h3': 0,
  'h4': 0,
  'h5': 0,
  'h6': 0,
  'head': 49,
  'hr': 2,
  'html': 49,
  'i': 0,
  'iframe': 20,
  'img': 2,
  'input': 2,
  'ins': 0,
  'isindex': 18,
  'kbd': 0,
  'label': 0,
  'legend': 0,
  'li': 1,
  'link': 18,
  'map': 0,
  'menu': 16,
  'meta': 18,
  'nobr': 16,
  'noframes': 20,
  'noscript': 20,
  'object': 16,
  'ol': 0,
  'optgroup': 0,
  'option': 1,
  'p': 1,
  'param': 18,
  'pre': 0,
  'q': 0,
  's': 0,
  'samp': 16,
  'script': 84,
  'select': 0,
  'small': 0,
  'span': 0,
  'strike': 0,
  'strong': 0,
  'style': 148,
  'sub': 0,
  'sup': 0,
  'table': 0,
  'tbody': 1,
  'td': 1,
  'textarea': 8,
  'tfoot': 1,
  'th': 1,
  'thead': 1,
  'title': 24,
  'tr': 1,
  'tt': 0,
  'u': 0,
  'ul': 0,
  'var': 0
};
html4 .ueffects = {
  'NOT_LOADED': 0,
  'SAME_DOCUMENT': 1,
  'NEW_DOCUMENT': 2
};
html4 .URIEFFECTS = {
  'a::href': 2,
  'area::href': 2,
  'blockquote::cite': 0,
  'body::background': 1,
  'del::cite': 0,
  'form::action': 2,
  'img::src': 1,
  'input::src': 1,
  'ins::cite': 0,
  'q::cite': 0
};
html4 .ltypes = {
  'UNSANDBOXED': 2,
  'SANDBOXED': 1,
  'DATA': 0
};
html4 .LOADERTYPES = {
  'a::href': 2,
  'area::href': 2,
  'blockquote::cite': 2,
  'body::background': 1,
  'del::cite': 2,
  'form::action': 2,
  'img::src': 1,
  'input::src': 1,
  'ins::cite': 2,
  'q::cite': 2
};;
// Copyright (C) 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * An HTML sanitizer that can satisfy a variety of security policies.
 *
 * <p>
 * The HTML sanitizer is built around a SAX parser and HTML element and
 * attributes schemas.
 *
 * @author mikesamuel@gmail.com
 * @requires html4
 * @provides html, html_sanitize
 */

/**
 * @namespace
 */
var html = (function (html4) {
  var lcase;
  // The below may not be true on browsers in the Turkish locale.
  if ('script' === 'SCRIPT'.toLowerCase()) {
    lcase = function (s) { return s.toLowerCase(); };
  } else {
    /**
     * {@updoc
     * $ lcase('SCRIPT')
     * # 'script'
     * $ lcase('script')
     * # 'script'
     * }
     */
    lcase = function (s) {
      return s.replace(
          /[A-Z]/g,
          function (ch) {
            return String.fromCharCode(ch.charCodeAt(0) | 32);
          });
    };
  }

  var ENTITIES = {
    lt   : '<',
    gt   : '>',
    amp  : '&',
    nbsp : '\240',
    quot : '"',
    apos : '\''
  };

  var decimalEscapeRe = /^#(\d+)$/;
  var hexEscapeRe = /^#x([0-9A-Fa-f]+)$/;
  /**
   * Decodes an HTML entity.
   *
   * {@updoc
   * $ lookupEntity('lt')
   * # '<'
   * $ lookupEntity('GT')
   * # '>'
   * $ lookupEntity('amp')
   * # '&'
   * $ lookupEntity('nbsp')
   * # '\xA0'
   * $ lookupEntity('apos')
   * # "'"
   * $ lookupEntity('quot')
   * # '"'
   * $ lookupEntity('#xa')
   * # '\n'
   * $ lookupEntity('#10')
   * # '\n'
   * $ lookupEntity('#x0a')
   * # '\n'
   * $ lookupEntity('#010')
   * # '\n'
   * $ lookupEntity('#x00A')
   * # '\n'
   * $ lookupEntity('Pi')      // Known failure
   * # '\u03A0'
   * $ lookupEntity('pi')      // Known failure
   * # '\u03C0'
   * }
   *
   * @param name the content between the '&' and the ';'.
   * @return a single unicode code-point as a string.
   */
  function lookupEntity(name) {
    name = lcase(name);  // TODO: &pi; is different from &Pi;
    if (ENTITIES.hasOwnProperty(name)) { return ENTITIES[name]; }
    var m = name.match(decimalEscapeRe);
    if (m) {
      return String.fromCharCode(parseInt(m[1], 10));
    } else if (!!(m = name.match(hexEscapeRe))) {
      return String.fromCharCode(parseInt(m[1], 16));
    }
    return '';
  }

  function decodeOneEntity(_, name) {
    return lookupEntity(name);
  }

  var nulRe = /\0/g;
  function stripNULs(s) {
    return s.replace(nulRe, '');
  }

  var entityRe = /&(#\d+|#x[0-9A-Fa-f]+|\w+);/g;
  /**
   * The plain text of a chunk of HTML CDATA which possibly containing.
   *
   * {@updoc
   * $ unescapeEntities('')
   * # ''
   * $ unescapeEntities('hello World!')
   * # 'hello World!'
   * $ unescapeEntities('1 &lt; 2 &amp;&AMP; 4 &gt; 3&#10;')
   * # '1 < 2 && 4 > 3\n'
   * $ unescapeEntities('&lt;&lt <- unfinished entity&gt;')
   * # '<&lt <- unfinished entity>'
   * $ unescapeEntities('/foo?bar=baz&copy=true')  // & often unescaped in URLS
   * # '/foo?bar=baz&copy=true'
   * $ unescapeEntities('pi=&pi;&#x3c0;, Pi=&Pi;\u03A0') // FIXME: known failure
   * # 'pi=\u03C0\u03c0, Pi=\u03A0\u03A0'
   * }
   *
   * @param s a chunk of HTML CDATA.  It must not start or end inside an HTML
   *   entity.
   */
  function unescapeEntities(s) {
    return s.replace(entityRe, decodeOneEntity);
  }

  var ampRe = /&/g;
  var looseAmpRe = /&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi;
  var ltRe = /</g;
  var gtRe = />/g;
  var quotRe = /\"/g;
  var eqRe = /\=/g;  // Backslash required on JScript.net

  /**
   * Escapes HTML special characters in attribute values as HTML entities.
   *
   * {@updoc
   * $ escapeAttrib('')
   * # ''
   * $ escapeAttrib('"<<&==&>>"')  // Do not just escape the first occurrence.
   * # '&#34;&lt;&lt;&amp;&#61;&#61;&amp;&gt;&gt;&#34;'
   * $ escapeAttrib('Hello <World>!')
   * # 'Hello &lt;World&gt;!'
   * }
   */
  function escapeAttrib(s) {
    // Escaping '=' defangs many UTF-7 and SGML short-tag attacks.
    return s.replace(ampRe, '&amp;').replace(ltRe, '&lt;').replace(gtRe, '&gt;')
        .replace(quotRe, '&#34;').replace(eqRe, '&#61;');
  }

  /**
   * Escape entities in RCDATA that can be escaped without changing the meaning.
   * {@updoc
   * $ normalizeRCData('1 < 2 &&amp; 3 > 4 &amp;& 5 &lt; 7&8')
   * # '1 &lt; 2 &amp;&amp; 3 &gt; 4 &amp;&amp; 5 &lt; 7&amp;8'
   * }
   */
  function normalizeRCData(rcdata) {
    return rcdata
        .replace(looseAmpRe, '&amp;$1')
        .replace(ltRe, '&lt;')
        .replace(gtRe, '&gt;');
  }


  // TODO(mikesamuel): validate sanitizer regexs against the HTML5 grammar at
  // http://www.whatwg.org/specs/web-apps/current-work/multipage/syntax.html
  // http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html
  // http://www.whatwg.org/specs/web-apps/current-work/multipage/tokenization.html
  // http://www.whatwg.org/specs/web-apps/current-work/multipage/tree-construction.html

  /** token definitions. */
  var INSIDE_TAG_TOKEN = new RegExp(
      // Don't capture space.
      '^\\s*(?:'
      // Capture an attribute name in group 1, and value in group 3.
      // We capture the fact that there was an attribute in group 2, since
      // interpreters are inconsistent in whether a group that matches nothing
      // is null, undefined, or the empty string.
      + ('(?:'
         + '([a-z][a-z-]*)'                    // attribute name
         + ('('                                // optionally followed
            + '\\s*=\\s*'
            + ('('
               // A double quoted string.
               + '\"[^\"]*\"'
               // A single quoted string.
               + '|\'[^\']*\''
               // The positive lookahead is used to make sure that in
               // <foo bar= baz=boo>, the value for bar is blank, not "baz=boo".
               + '|(?=[a-z][a-z-]*\\s*=)'
               // An unquoted value that is not an attribute name.
               // We know it is not an attribute name because the previous
               // zero-width match would've eliminated that possibility.
               + '|[^>\"\'\\s]*'
               + ')'
               )
            + ')'
            ) + '?'
         + ')'
         )
      // End of tag captured in group 3.
      + '|(/?>)'
      // Don't capture cruft
      + '|[\\s\\S][^a-z\\s>]*)',
      'i');

  var OUTSIDE_TAG_TOKEN = new RegExp(
      '^(?:'
      // Entity captured in group 1.
      + '&(\\#[0-9]+|\\#[x][0-9a-f]+|\\w+);'
      // Comment, doctypes, and processing instructions not captured.
      + '|<\!--[\\s\\S]*?--\>|<!\\w[^>]*>|<\\?[^>*]*>'
      // '/' captured in group 2 for close tags, and name captured in group 3.
      + '|<(/)?([a-z][a-z0-9]*)'
      // Text captured in group 4.
      + '|([^<&>]+)'
      // Cruft captured in group 5.
      + '|([<&>]))',
      'i');

  /**
   * Given a SAX-like event handler, produce a function that feeds those
   * events and a parameter to the event handler.
   *
   * The event handler has the form:{@code
   * {
   *   // Name is an upper-case HTML tag name.  Attribs is an array of
   *   // alternating upper-case attribute names, and attribute values.  The
   *   // attribs array is reused by the parser.  Param is the value passed to
   *   // the saxParser.
   *   startTag: function (name, attribs, param) { ... },
   *   endTag:   function (name, param) { ... },
   *   pcdata:   function (text, param) { ... },
   *   rcdata:   function (text, param) { ... },
   *   cdata:    function (text, param) { ... },
   *   startDoc: function (param) { ... },
   *   endDoc:   function (param) { ... }
   * }}
   *
   * @param {Object} handler a record containing event handlers.
   * @return {Function} that takes a chunk of html and a parameter.
   *   The parameter is passed on to the handler methods.
   */
  function makeSaxParser(handler) {
    return function parse(htmlText, param) {
      htmlText = String(htmlText);
      var htmlLower = null;

      var inTag = false;  // True iff we're currently processing a tag.
      var attribs = [];  // Accumulates attribute names and values.
      var tagName = void 0;  // The name of the tag currently being processed.
      var eflags = void 0;  // The element flags for the current tag.
      var openTag = void 0;  // True if the current tag is an open tag.

      if (handler.startDoc) { handler.startDoc(param); }

      while (htmlText) {
        var m = htmlText.match(inTag ? INSIDE_TAG_TOKEN : OUTSIDE_TAG_TOKEN);
        htmlText = htmlText.substring(m[0].length);

        if (inTag) {
          if (m[1]) { // attribute
            // setAttribute with uppercase names doesn't work on IE6.
            var attribName = lcase(m[1]);
            var decodedValue;
            if (m[2]) {
              var encodedValue = m[3];
              switch (encodedValue.charCodeAt(0)) {  // Strip quotes
                case 34: case 39:
                  encodedValue = encodedValue.substring(
                      1, encodedValue.length - 1);
                  break;
              }
              decodedValue = unescapeEntities(stripNULs(encodedValue));
            } else {
              // Use name as value for valueless attribs, so
              //   <input type=checkbox checked>
              // gets attributes ['type', 'checkbox', 'checked', 'checked']
              decodedValue = attribName;
            }
            attribs.push(attribName, decodedValue);
          } else if (m[4]) {
            if (eflags !== void 0) {  // False if not in whitelist.
              if (openTag) {
                if (handler.startTag) {
                  handler.startTag(tagName, attribs, param);
                }
              } else {
                if (handler.endTag) {
                  handler.endTag(tagName, param);
                }
              }
            }

            if (openTag
                && (eflags & (html4.eflags.CDATA | html4.eflags.RCDATA))) {
              if (htmlLower === null) {
                htmlLower = lcase(htmlText);
              } else {
                htmlLower = htmlLower.substring(
                    htmlLower.length - htmlText.length);
              }
              var dataEnd = htmlLower.indexOf('</' + tagName);
              if (dataEnd < 0) { dataEnd = htmlText.length; }
              if (eflags & html4.eflags.CDATA) {
                if (handler.cdata) {
                  handler.cdata(htmlText.substring(0, dataEnd), param);
                }
              } else if (handler.rcdata) {
                handler.rcdata(
                    normalizeRCData(htmlText.substring(0, dataEnd)), param);
              }
              htmlText = htmlText.substring(dataEnd);
            }

            tagName = eflags = openTag = void 0;
            attribs.length = 0;
            inTag = false;
          }
        } else {
          if (m[1]) {  // Entity
            if (handler.pcdata) { handler.pcdata(m[0], param); }
          } else if (m[3]) {  // Tag
            openTag = !m[2];
            inTag = true;
            tagName = lcase(m[3]);
            eflags = html4.ELEMENTS.hasOwnProperty(tagName)
                ? html4.ELEMENTS[tagName] : void 0;
          } else if (m[4]) {  // Text
            if (handler.pcdata) { handler.pcdata(m[4], param); }
          } else if (m[5]) {  // Cruft
            if (handler.pcdata) {
              switch (m[5]) {
                case '<': handler.pcdata('&lt;', param); break;
                case '>': handler.pcdata('&gt;', param); break;
                default: handler.pcdata('&amp;', param); break;
              }
            }
          }
        }
      }

      if (handler.endDoc) { handler.endDoc(param); }
    };
  }

  /**
   * Returns a function that strips unsafe tags and attributes from html.
   * @param {Function} sanitizeAttributes
   *     maps from (tagName, attribs[]) to null or a sanitized attribute array.
   *     The attribs array can be arbitrarily modified, but the same array
   *     instance is reused, so should not be held.
   * @return {Function} from html to sanitized html
   */
  function makeHtmlSanitizer(sanitizeAttributes) {
    var stack;
    var ignoring;
    return makeSaxParser({
        startDoc: function (_) {
          stack = [];
          ignoring = false;
        },
        startTag: function (tagName, attribs, out) {
          if (ignoring) { return; }
          if (!html4.ELEMENTS.hasOwnProperty(tagName)) { return; }
          var eflags = html4.ELEMENTS[tagName];
          if (eflags & html4.eflags.FOLDABLE) {
            return;
          } else if (eflags & html4.eflags.UNSAFE) {
            ignoring = !(eflags & html4.eflags.EMPTY);
            return;
          }
          attribs = sanitizeAttributes(tagName, attribs);
          // TODO(mikesamuel): relying on sanitizeAttributes not to
          // insert unsafe attribute names.
          if (attribs) {
            if (!(eflags & html4.eflags.EMPTY)) {
              stack.push(tagName);
            }

            out.push('<', tagName);
            for (var i = 0, n = attribs.length; i < n; i += 2) {
              var attribName = attribs[i],
                  value = attribs[i + 1];
              if (value !== null && value !== void 0) {
                out.push(' ', attribName, '="', escapeAttrib(value), '"');
              }
            }
            out.push('>');
          }
        },
        endTag: function (tagName, out) {
          if (ignoring) {
            ignoring = false;
            return;
          }
          if (!html4.ELEMENTS.hasOwnProperty(tagName)) { return; }
          var eflags = html4.ELEMENTS[tagName];
          if (!(eflags & (html4.eflags.UNSAFE | html4.eflags.EMPTY
                          | html4.eflags.FOLDABLE))) {
            var index;
            if (eflags & html4.eflags.OPTIONAL_ENDTAG) {
              for (index = stack.length; --index >= 0;) {
                var stackEl = stack[index];
                if (stackEl === tagName) { break; }
                if (!(html4.ELEMENTS[stackEl]
                      & html4.eflags.OPTIONAL_ENDTAG)) {
                  // Don't pop non optional end tags looking for a match.
                  return;
                }
              }
            } else {
              for (index = stack.length; --index >= 0;) {
                if (stack[index] === tagName) { break; }
              }
            }
            if (index < 0) { return; }  // Not opened.
            for (var i = stack.length; --i > index;) {
              var stackEl = stack[i];
              if (!(html4.ELEMENTS[stackEl]
                    & html4.eflags.OPTIONAL_ENDTAG)) {
                out.push('</', stackEl, '>');
              }
            }
            stack.length = index;
            out.push('</', tagName, '>');
          }
        },
        pcdata: function (text, out) {
          if (!ignoring) { out.push(text); }
        },
        rcdata: function (text, out) {
          if (!ignoring) { out.push(text); }
        },
        cdata: function (text, out) {
          if (!ignoring) { out.push(text); }
        },
        endDoc: function (out) {
          for (var i = stack.length; --i >= 0;) {
            out.push('</', stack[i], '>');
          }
          stack.length = 0;
        }
      });
  }

  /**
   * Strips unsafe tags and attributes from html.
   * @param {string} htmlText to sanitize
   * @param {Function} opt_uriPolicy -- a transform to apply to uri/url
   *     attribute values.
   * @param {Function} opt_nmTokenPolicy : string -> string? -- a transform to
   *     apply to names, ids, and classes.
   * @return {string} html
   */
  function sanitize(htmlText, opt_uriPolicy, opt_nmTokenPolicy) {
    var out = [];
    makeHtmlSanitizer(
      function sanitizeAttribs(tagName, attribs) {
        for (var i = 0; i < attribs.length; i += 2) {
          var attribName = attribs[i];
          var value = attribs[i + 1];
          var atype = null, attribKey;
          if ((attribKey = tagName + '::' + attribName,
               html4.ATTRIBS.hasOwnProperty(attribKey))
              || (attribKey = '*::' + attribName,
                  html4.ATTRIBS.hasOwnProperty(attribKey))) {
            atype = html4.ATTRIBS[attribKey];
          }
          if (atype !== null) {
            switch (atype) {
              case html4.atype.NONE: break;
              case html4.atype.SCRIPT:
              case html4.atype.STYLE:
                value = null;
                break;
              case html4.atype.ID:
              case html4.atype.IDREF:
              case html4.atype.IDREFS:
              case html4.atype.GLOBAL_NAME:
              case html4.atype.LOCAL_NAME:
              case html4.atype.CLASSES:
                value = opt_nmTokenPolicy ? opt_nmTokenPolicy(value) : value;
                break;
              case html4.atype.URI:
                value = opt_uriPolicy && opt_uriPolicy(value);
                break;
              case html4.atype.URI_FRAGMENT:
                if (value && '#' === value.charAt(0)) {
                  value = opt_nmTokenPolicy ? opt_nmTokenPolicy(value) : value;
                  if (value) { value = '#' + value; }
                } else {
                  value = null;
                }
                break;
              default:
                value = null;
                break;
            }
          } else {
            value = null;
          }
          attribs[i + 1] = value;
        }
        return attribs;
      })(htmlText, out);
    return out.join('');
  }

  return {
    escapeAttrib: escapeAttrib,
    makeHtmlSanitizer: makeHtmlSanitizer,
    makeSaxParser: makeSaxParser,
    normalizeRCData: normalizeRCData,
    sanitize: sanitize,
    unescapeEntities: unescapeEntities
  };
})(html4);

var html_sanitize = html.sanitize;

;
// Copyright (C) 2008 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * JavaScript support for TemplateCompiler.java and for a tamed version of
 * <code>document.write{,ln}</code>.
 * <p>
 * This handles the problem of making sure that only the bits of a Gadget's
 * static HTML which should be visible to a script are visible, and provides
 * mechanisms to reliably find elements using dynamically generated unique IDs
 * in the face of DOM modifications by untrusted scripts.
 *
 * @author mikesamuel@gmail.com
 * @provides HtmlEmitter
 * @requires bridalMaker html html4 ___
 */

/**
 * @param base a node that is the ancestor of all statically generated HTML.
 * @param opt_tameDocument a tame document that will receive a load event
 *    when the html-emitter is closed, and which will have {@code write} and
 *    {@code writeln} members attached.
 */
function HtmlEmitter(base, opt_tameDocument) {
  if (!base) {
    throw new Error(
        'Host page error: Virtual document element was not provided');
  }
  var insertionPoint = base;
  var bridal = bridalMaker(base.ownerDocument);

  /**
   * Contiguous pairs of ex-descendants of base, and their ex-parent.
   * The detached elements (even indices) are ordered depth-first.
   */
  var detached = null;
  /** Makes sure IDs are accessible within removed detached nodes. */
  var idMap = null;

  var arraySplice = Array.prototype.splice;

  function buildIdMap() {
    idMap = {};
    var descs = base.getElementsByTagName('*');
    for (var i = 0, desc; (desc = descs[i]); ++i) {
      var id = desc.getAttributeNode('id');
      if (id && id.value) { idMap[id.value] = desc; }
    }
  }
  /**
   * Returns the element with the given ID under the base node.
   * @param id an auto-generated ID since we cannot rely on user supplied IDs
   *     to be unique.
   * @return {Element|null} null if no such element exists.
   */
  function byId(id) {
    if (!idMap) { buildIdMap(); }
    var node = idMap[id];
    if (node) { return node; }
    for (; (node = base.ownerDocument.getElementById(id));) {
      if (base.contains
          ? base.contains(node)
          : (base.compareDocumentPosition(node) & 0x10)) {
        idMap[id] = node;
        return node;
      } else {
        node.id = '';
      }
    }
    return null;
  }

  /**
   * emitStatic allows the caller to inject the static HTML from JavaScript,
   * if the gadget host page's usage pattern requires it.
   */
  function emitStatic(htmlString) {
    if (!base) {
      throw new Error('Host page error: HtmlEmitter.emitStatic called after' +
          ' document finish()ed');
    }
    base.innerHTML += htmlString;
  }
  
  // Below we define the attach, detach, and finish operations.
  // These obey the conventions that:
  //   (1) All detached nodes, along with their ex-parents are in detached,
  //       and they are ordered depth-first.
  //   (2) When a node is specified by an ID, after the operation is performed,
  //       it is in the tree.
  //   (3) Each node is attached to the same parent regardless of what the
  //       script does.  Even if a node is removed from the DOM by a script,
  //       any of its children that appear after the script, will be added.
  // As an example, consider this HTML which has the end-tags removed since
  // they don't correspond to actual nodes.
  //   <table>
  //     <script>
  //     <tr>
  //       <td>Foo<script>Bar
  //       <th>Baz
  //   <script>
  //   <p>The-End
  // There are two script elements, and we need to make sure that each only
  // sees the bits of the DOM that it is supposed to be aware of.
  //
  // To make sure that things work when javascript is off, we emit the whole
  // HTML tree, and then detach everything that shouldn't be present.
  // We represent the removed bits as pairs of (removedNode, parentItWasPartOf).
  // Including both makes us robust against changes scripts make to the DOM.
  // In this case, the detach operation results in the tree
  //   <table>
  // and the detached list
  //   [<tr><td>FooBar<th>Baz in <table>, <p>The-End in (base)]

  // After the first script executes, we reattach the bits needed by the second
  // script, which gives us the DOM
  //   <table><tr><td>Foo
  // and the detached list
  //   ['Bar' in <td>, <th>Baz in <tr>, <p>The-End in (base)]
  // Note that we did not simply remove items from the old detached list.  Since
  // the second script was deeper than the first, we had to add only a portion
  // of the <tr>'s content which required doing a separate mini-detach operation
  // and push its operation on to the front of the detached list.

  // After the second script executes, we reattach the bits needed by the third
  // script, which gives us the DOM
  //   <table><tr><td>FooBar<th>Baz
  // and the detached list
  //   [<p>The-End in (base)]

  // After the third script executes, we reattached the rest of the detached
  // nodes, and we're done.

  // To perform a detach or reattach operation, we impose a depth-first ordering
  // on HTML start tags, and text nodes:
  //   [0: <table>, 1: <tr>, 2: <td>, 3: 'Foo', 4: 'Bar', 5: <th>, 6: 'Baz',
  //    7: <p>, 8: 'The-End']
  // Then the detach operation simply removes the minimal number of nodes from
  // the DOM to make sure that only a prefix of those nodes are present.
  // In the case above, we are detaching everything after item 0.
  // Then the reattach operation advances the number.  In the example above, we
  // advance the index from 0 to 3, and then from 3 to 6.
  // The finish operation simply reattaches the rest, advancing the counter from
  // 6 to the end.

  // The minimal detached list from the node with DFS index I is the ordered
  // list such that a (node, parent) pair (N, P) is on the list if
  // dfs-index(N) > I and there is no pair (P, GP) on the list.

  // To calculate the minimal detached list given a node representing a point in
  // that ordering, we rely on the following observations:
  //    The minimal detached list after a node, is the concatenation of
  //    (1) that node's children in order
  //    (2) the next sibling of that node and its later siblings,
  //        the next sibling of that node's parent and its later siblings,
  //        the next sibling of that node's grandparent and its later siblings,
  //        etc., until base is reached.

  function detachOnto(limit, out) {
    // Set detached to be the minimal set of nodes that have to be removed
    // to make sure that limit is the last attached node in DFS order as
    // specified above.

    // First, store all the children.
    for (var child = limit.firstChild, next; child; child = next) {
      next = child.nextSibling;  // removeChild kills nextSibling.
      out.push(child, limit);
      limit.removeChild(child);
    }

    // Second, store your ancestor's next siblings and recurse.
    for (var anc = limit, greatAnc; anc && anc !== base; anc = greatAnc) {
      greatAnc = anc.parentNode;
      for (var sibling = anc.nextSibling, next; sibling; sibling = next) {
        next = sibling.nextSibling;
        out.push(sibling, greatAnc);
        greatAnc.removeChild(sibling);
      }
    }
  }
  /**
   * Make sure that everything up to and including the node with the given ID
   * is attached, and that nothing that follows the node is attached.
   */
  function attach(id) {
    var limit = byId(id);
    if (detached) {
      // Build an array of arguments to splice so we can replace the reattached
      // nodes with the nodes detached from limit.
      var newDetached = [0, 0];
      // Since limit has no parent, detachOnto will bottom out at its sibling.
      detachOnto(limit, newDetached);
      // Find the node containing limit that appears on detached.
      var limitAnc = limit;
      for (var parent; (parent = limitAnc.parentNode);) {
        limitAnc = parent;
      }
      // Reattach up to and including limit ancestor.
      // If some browser quirk causes us to miss limit in detached, we'll
      // reattach everything and try to continue.
      var nConsumed = 0;
      while (nConsumed < detached.length) {
        // in IE, some types of nodes can't be standalone, and detaching
        // one will create new parentNodes for them.  so at this point,
        // limitAnc might be an ancestor of the node on detached.
        var reattach = detached[nConsumed];
        var reattAnc = reattach;
        for (; reattAnc.parentNode; reattAnc = reattAnc.parentNode) {}
        (detached[nConsumed + 1] /* the parent */).appendChild(reattach);
        nConsumed += 2;
        if (reattAnc === limitAnc) { break; }
      }
      // Replace the reattached bits with the ones detached from limit.
      newDetached[1] = nConsumed;  // splice's second arg is the number removed
      arraySplice.apply(detached, newDetached);
    } else {
      // The first time attach is called, the limit is actually part of the DOM.
      // There's no point removing anything when all scripts are deferred.
      detached = [];
      detachOnto(limit, detached);
    }
    // Keep track of the insertion point for document.write.
    // The tag was closed if there is no child waiting to be added.
    // FIXME(mikesamuel): This is not technically correct, since the script
    // element could have been the only child.
    var isLimitClosed = detached[1] !== limit;
    insertionPoint = isLimitClosed ? limit.parentNode : limit;
    return limit;
  }
  /**
   * Removes a script place-holder.
   * When a text node immediately precedes a script block, the limit will be
   * a text node.  Text nodes can't be addressed by ID, so the TemplateCompiler
   * follows them with a {@code <span>} which must be removed to be semantics
   * preserving.
   */
  function discard(placeholder) {
    // An untrusted script block should not be able to access the wrapper before
    // it's removed since it won't be part of the DOM so there should be a
    // parentNode.
    placeholder.parentNode.removeChild(placeholder);
  }
  /**
   * Reattach any remaining detached bits, free resources.
   */
  function finish() {
    insertionPoint = null;
    if (detached) {
      for (var i = 0, n = detached.length; i < n; i += 2) {
        detached[i + 1].appendChild(detached[i]);
      }
    }
    // Release references so nodes can be garbage collected.
    idMap = detached = base = null;
    return this;
  }
  /**
   * Attach to the virtual document body classes that were extracted from the
   * body element.
   * @param {string} classes rewritten HTML classes.
   */
  function addBodyClasses(classes) {
    base.className += ' ' + classes;
  }

  function signalLoaded() {
    // Signals the close of the document and fires any window.onload event
    // handlers.
    var doc = opt_tameDocument;
    if (doc) { doc.signalLoaded___(); }
    return this;
  }

  this.byId = byId;
  this.attach = attach;
  this.discard = discard;
  this.emitStatic = emitStatic;
  this.finish = finish;
  this.signalLoaded = signalLoaded;
  this.setAttr = bridal.setAttribute;
  this.addBodyClasses = addBodyClasses;

  (function (tameDoc) {
    if (!tameDoc || tameDoc.write) { return; }

    function concat(items) {
      return Array.prototype.join.call(items, '');
    }

    var ucase;
    if ('script'.toUpperCase() === 'SCRIPT') {
      ucase = function (s) { return s.toUpperCase(); };
    } else {
      ucase = function (s) {
        return s.replace(
            /[a-z]/g,
            function (ch) {
              return String.fromCharCode(ch.charCodeAt(0) & ~32);
            });
      };
    }

    var documentWriter = {
      startTag: function (tagName, attribs) {
        var eltype = html4.ELEMENTS[tagName];
        if (!html4.ELEMENTS.hasOwnProperty(tagName)
            || (eltype & html4.eflags.UNSAFE) !== 0) {
          return;
        }
        tameDoc.sanitizeAttrs___(tagName, attribs);
        var el = bridal.createElement(tagName, attribs);
        if ((eltype & html4.eflags.OPTIONAL_ENDTAG)
            && el.tagName === insertionPoint.tagName) {
          documentWriter.endTag(el.tagName, true);
        }
        insertionPoint.appendChild(el);
        if (!(eltype & html4.eflags.EMPTY)) { insertionPoint = el; }
      },
      endTag: function (tagName, optional) {
        var anc = insertionPoint;
        tagName = ucase(tagName);
        while (anc !== base && !/\bvdoc-body___\b/.test(anc.className)) {
          var p = anc.parentNode;
          if (anc.tagName === tagName) {
            insertionPoint = p;
            return;
          }
          anc = p;
        }
      },
      pcdata: function (text) {
        insertionPoint.appendChild(insertionPoint.ownerDocument.createTextNode(
            html.unescapeEntities(text)));
      },
      cdata: function (text) {
        insertionPoint.appendChild(
            insertionPoint.ownerDocument.createTextNode(text));
      }
    };
    documentWriter.rcdata = documentWriter.pcdata;

    // Document.write and document.writeln behave as described at
    // http://www.w3.org/TR/2009/WD-html5-20090825/embedded-content-0.html#dom-document-write
    // but with a few differences:
    // (1) all HTML written is sanitized per the opt_tameDocument's HTML
    //     sanitizer
    // (2) HTML written cannot change where subsequent static HTML is emitted.
    // (3) if the document has been closed (insertion point is undefined) then
    //     the window will not be reopened.  Instead, execution will proceed at
    //     the end of the virtual document.  This is allowed by the spec but
    //     only if the onunload refuses to allow an unload, so we treat the
    //     virtual document as un-unloadable by document.write.
    // (4) document.write cannot be used to inject scripts, so the
    //     "if there is a pending external script" does not apply.
    /**
     * A tame version of document.write.
     * @param html_varargs according to HTML5, the input to document.write is
     *     varargs, and the HTML is the concatenation of all the arguments.
     */
    var tameDocWrite = function write(html_varargs) {
      var htmlText = concat(arguments);
      if (!insertionPoint) {
        // Handles case 3 where the document has been closed.
        insertionPoint = base;
      }
      var lexer = html.makeSaxParser(documentWriter);
      lexer(htmlText);
    };
    tameDoc.write = ___.markFuncFreeze(tameDocWrite, 'write');
    tameDoc.writeln = ___.markFuncFreeze(function writeln(html) {
      tameDocWrite(concat(arguments), '\n');
    }, 'writeln');
    ___.grantFunc(tameDoc, 'write');
    ___.grantFunc(tameDoc, 'writeln');
  })(opt_tameDocument);
}
;
// Copyright (C) 2008 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * A set of utility functions that implement browser feature testing to unify
 * certain DOM behaviors, and a set of recommendations about when to use these
 * functions as opposed to the native DOM functions.
 *
 * @author ihab.awad@gmail.com
 * @author jasvir@gmail.com
 * @provides bridalMaker, bridal
 * @requires document, html, html4, navigator, window,
 *     XMLHttpRequest, ActiveXObject
 */

var bridalMaker = function(document) {

  ////////////////////////////////////////////////////////////////////////////
  // Private section
  ////////////////////////////////////////////////////////////////////////////

  var isOpera = navigator.userAgent.indexOf('Opera') === 0;
  var isIE = !isOpera && navigator.userAgent.indexOf('MSIE') !== -1;
  var isWebkit = !isOpera && navigator.userAgent.indexOf('WebKit') !== -1;

  var featureAttachEvent = !!(window.attachEvent && !window.addEventListener);
  /**
   * Does the extended form of extendedCreateElement work?
   * From http://msdn.microsoft.com/en-us/library/ms536389.aspx :<blockquote>
   *     You can also specify all the attributes inside the createElement
   *     method by using an HTML string for the method argument.
   *     The following example demonstrates how to dynamically create two
   *     radio buttons utilizing this technique.
   *     <pre>
   *     ...
   *     var newRadioButton = document.createElement(
   *         "&lt;INPUT TYPE='RADIO' NAME='RADIOTEST' VALUE='First Choice'>")
   *     </pre>
   * </blockquote>
   */
  var featureExtendedCreateElement =
      (function () {
        try {
          return (
              document.createElement('<input type="radio">').type === 'radio');
        } catch (e) {
          return false;
        }
      })();

  // HTML5 compatibility on IE
  // Standard html5 but non-html4 tags cause IE to throw
  // Workaround from http://remysharp.com/html5-enabling-script
  function html5shim() {
    var html5_elements =["abbr", "article", "aside", "audio", "canvas",
        "details", "figcaption", "figure", "footer", "header", "hgroup", "mark",
        "meter", "nav", "output", "progress", "section", "summary", "time",
        "video"];
    var documentFragment = document.createDocumentFragment();
    for (var i = 0; i < html5_elements.length; i++) {
      try {
        document.createElement(html5_elements[i]);
        documentFragment.createElement(html5_elements[i]);
      } catch (e) {
        // failure in the shim is not a real failure
      }
    }
  }
  if (isIE) {
    html5shim();
  }

  var CUSTOM_EVENT_TYPE_SUFFIX = '_custom___';
  function tameEventType(type, opt_isCustom, opt_tagName) {
    type = String(type);
    if (endsWith__.test(type)) {
      throw new Error('Invalid event type ' + type);
    }
    var tagAttr = false;
    if (opt_tagName) {
      tagAttr = String(opt_tagName).toLowerCase() + '::on' + type;
    }
    if (!opt_isCustom
        && ((tagAttr && html4.atype.SCRIPT === html4.ATTRIBS[tagAttr])
            || html4.atype.SCRIPT === html4.ATTRIBS['*::on' + type])) {
      return type;
    }
    return type + CUSTOM_EVENT_TYPE_SUFFIX;
  }

  function eventHandlerTypeFilter(handler, tameType) {
    // This does not need to check that handler is callable by untrusted code
    // since the handler will invoke plugin_dispatchEvent which will do that
    // check on the untrusted function reference.
    return function (event) {
      if (tameType === event.eventType___) {
        return handler.call(this, event);
      }
    };
  }

  var endsWith__ = /__$/;
  var escapeAttrib = html.escapeAttrib;
  function constructClone(node, deep) {
    var clone;
    if (node.nodeType === 1 && featureExtendedCreateElement) {
      // From http://blog.pengoworks.com/index.cfm/2007/7/16/IE6--IE7-quirks-with-cloneNode-and-form-elements
      //     It turns out IE 6/7 doesn't properly clone some form elements
      //     when you use the cloneNode(true) and the form element is a
      //     checkbox, radio or select element.
      // JQuery provides a clone method which attempts to fix this and an issue
      // with event listeners.  According to the source code for JQuery's clone
      // method ( http://docs.jquery.com/Manipulation/clone#true ):
      //     IE copies events bound via attachEvent when
      //     using cloneNode. Calling detachEvent on the
      //     clone will also remove the events from the orignal
      // We do not need to deal with XHTML DOMs and so can skip the clean step
      // that jQuery does.
      var tagDesc = node.tagName;
      // Copying form state is not strictly mentioned in DOM2's spec of
      // cloneNode, but all implementations do it.  The value copying
      // can be interpreted as fixing implementations' failure to have
      // the value attribute "reflect" the input's value as determined by the
      // value property.
      switch (node.tagName) {
        case 'INPUT':
          tagDesc = '<input name="' + escapeAttrib(node.name)
              + '" type="' + escapeAttrib(node.type)
              + '" value="' + escapeAttrib(node.defaultValue) + '"'
              + (node.defaultChecked ? ' checked="checked">' : '>');
          break;
        case 'BUTTON':
          tagDesc = '<button name="' + escapeAttrib(node.name)
              + '" type="' + escapeAttrib(node.type)
              + '" value="' + escapeAttrib(node.value) + '">';
          break;
        case 'OPTION':
          tagDesc = '<option '
              + (node.defaultSelected ? ' selected="selected">' : '>');
          break;
        case 'TEXTAREA':
          tagDesc = '<textarea value="'
              + escapeAttrib(node.defaultValue) + '">';
          break;
      }

      clone = document.createElement(tagDesc);

      var attrs = node.attributes;
      for (var i = 0, attr; (attr = attrs[i]); ++i) {
        if (attr.specified && !endsWith__.test(attr.name)) {
          setAttribute(clone, attr.nodeName, attr.nodeValue);
        }
      }
    } else {
      clone = node.cloneNode(false);
    }
    if (deep) {
      // TODO(mikesamuel): should we whitelist nodes here, to e.g. prevent
      // untrusted code from reloading an already loaded script by cloning
      // a script node that somehow exists in a tree accessible to it?
      for (var child = node.firstChild; child; child = child.nextSibling) {
        var cloneChild = constructClone(child, deep);
        clone.appendChild(cloneChild);
      }
    }
    return clone;
  }

  function fixupClone(node, clone) {
    for (var child = node.firstChild, cloneChild = clone.firstChild; cloneChild;
         child = child.nextSibling, cloneChild = cloneChild.nextSibling) {
      fixupClone(child, cloneChild);
    }
    if (node.nodeType === 1) {
      switch (node.tagName) {
        case 'INPUT':
          clone.value = node.value;
          clone.checked = node.checked;
          break;
        case 'OPTION':
          clone.selected = node.selected;
          clone.value = node.value;
          break;
        case 'TEXTAREA':
          clone.value = node.value;
          break;
      }
    }

    // Do not copy listeners since DOM2 specifies that only attributes and
    // children are copied, and that children should only be copied if the
    // deep flag is set.
    // The children are handled in constructClone.
    var originalAttribs = node.attributes___;
    if (originalAttribs) {
      var attribs = {};
      clone.attributes___ = attribs;
      var k, v;
      for (k in originalAttribs) {
        if (/__$/.test(k)) { continue; }
        v = originalAttribs[k];
        switch (typeof v) {
          case 'string': case 'number': case 'boolean':
            attribs[k] = v;
            break;
        }
      };
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // Public section
  ////////////////////////////////////////////////////////////////////////////

  // Returns the window containing this element. 
  function getWindow(element) {
    var doc = element.ownerDocument;
    // IE
    if (doc.parentWindow) { return doc.parentWindow; }
    // Everything else
    // TODO: Safari 2's defaultView wasn't a window object :(
    // Safari 2 is not A-grade, though.
    if (doc.defaultView) { return doc.defaultView; }
    // Just in case
    var s = doc.createElement('script');
    s.innerHTML = "document.parentWindow = window;";
    doc.body.appendChild(s);
    doc.body.removeChild(s);
    return doc.parentWindow;
  }

  function untameEventType(type) {
    var suffix = CUSTOM_EVENT_TYPE_SUFFIX;
    var tlen = type.length, slen = suffix.length;
    var end = tlen - slen;
    if (end >= 0 && suffix === type.substring(end)) {
      type = type.substring(0, end);
    }
    return type;
  }

  function initEvent(event, type, bubbles, cancelable) {
    type = tameEventType(type, true);
    bubbles = Boolean(bubbles);
    cancelable = Boolean(cancelable);

    if (event.initEvent) {  // Non-IE
      event.initEvent(type, bubbles, cancelable);
    } else if (bubbles && cancelable) {  // IE
      event.eventType___ = type;
    } else {
      // TODO(mikesamuel): can bubbling and cancelable on events be simulated
      // via http://msdn.microsoft.com/en-us/library/ms533545(VS.85).aspx
      throw new Error(
          'Browser does not support non-bubbling/uncanceleable events');
    }
  }

  function dispatchEvent(element, event) {
    // TODO(mikesamuel): when we change event dispatching to happen
    // asynchronously, we should exempt custom events since those
    // need to return a useful value, and there may be code bracketing
    // them which could observe asynchronous dispatch.

    // "The return value of dispatchEvent indicates whether any of
    //  the listeners which handled the event called
    //  preventDefault. If preventDefault was called the value is
    //  false, else the value is true."
    if (element.dispatchEvent) {
      return Boolean(element.dispatchEvent(event));
    } else {
      // Only dispatches custom events as when tameEventType(t) !== t.
      element.fireEvent('ondataavailable', event);
      return Boolean(event.returnValue);
    }
  }

  /**
   * Add an event listener function to an element.
   *
   * <p>Replaces
   * W3C <code>Element::addEventListener</code> and
   * IE <code>Element::attachEvent</code>.
   *
   * @param {HTMLElement} element a native DOM element.
   * @param {string} type a string identifying the event type.
   * @param {boolean Element::function (event)} handler an event handler.
   * @param {boolean} useCapture whether the user wishes to initiate capture.
   * @return {boolean Element::function (event)} the handler added.  May be
   *     a wrapper around the input.
   */
  function addEventListener(element, type, handler, useCapture) {
    type = String(type);
    var tameType = tameEventType(type, false, element.tagName);
    if (featureAttachEvent) {
      // TODO(ihab.awad): How do we emulate 'useCapture' here?
      if (type !== tameType) {
        var wrapper = eventHandlerTypeFilter(handler, tameType);
        element.attachEvent('ondataavailable', wrapper);
        return wrapper;
      } else {
        element.attachEvent('on' + type, handler);
        return handler;
      }
    } else {
      // FF2 fails if useCapture not passed or is not a boolean.
      element.addEventListener(tameType, handler, useCapture);
      return handler;
    }
  }

  /**
   * Remove an event listener function from an element.
   *
   * <p>Replaces
   * W3C <code>Element::removeEventListener</code> and
   * IE <code>Element::detachEvent</code>.
   *
   * @param element a native DOM element.
   * @param type a string identifying the event type.
   * @param handler a function acting as an event handler.
   * @param useCapture whether the user wishes to initiate capture.
   */
  function removeEventListener(element, type, handler, useCapture) {
    type = String(type);
    var tameType = tameEventType(type, false, element.tagName);
    if (featureAttachEvent) {
      // TODO(ihab.awad): How do we emulate 'useCapture' here?
      if (tameType !== type) {
        element.detachEvent('ondataavailable', handler);
      } else {
        element.detachEvent('on' + type, handler);
      }
    } else {
      element.removeEventListener(tameType, handler, useCapture);
    }
  }

  /**
   * Clones a node per {@code Node.clone()}.
   * <p>
   * Returns a duplicate of this node, i.e., serves as a generic copy
   * constructor for nodes. The duplicate node has no parent;
   * (parentNode is null.).
   * <p>
   * Cloning an Element copies all attributes and their values,
   * including those generated by the XML processor to represent
   * defaulted attributes, but this method does not copy any text it
   * contains unless it is a deep clone, since the text is contained
   * in a child Text node. Cloning an Attribute directly, as opposed
   * to be cloned as part of an Element cloning operation, returns a
   * specified attribute (specified is true). Cloning any other type
   * of node simply returns a copy of this node.
   * <p>
   * Note that cloning an immutable subtree results in a mutable copy,
   * but the children of an EntityReference clone are readonly. In
   * addition, clones of unspecified Attr nodes are specified. And,
   * cloning Document, DocumentType, Entity, and Notation nodes is
   * implementation dependent.
   *
   * @param {boolean} deep If true, recursively clone the subtree
   * under the specified node; if false, clone only the node itself
   * (and its attributes, if it is an Element).
   *
   * @return {Node} The duplicate node.
   */
  function cloneNode(node, deep) {
    var clone;
    if (!document.all) {  // Not IE 6 or IE 7
      clone = node.cloneNode(deep);
    } else {
      clone = constructClone(node, deep);
    }
    fixupClone(node, clone);
    return clone;
  }

  function initCanvasElements(doc) {
    var els = doc.getElementsByTagName('canvas');
    for (var i = 0; i < els.length; i++) {
      initCanvasElement(els[i]);
    }
  }

  function initCanvasElement(el) {
    if (window.G_vmlCanvasManager) {
      window.G_vmlCanvasManager.initElement(el);
    }
  }

  function createElement(tagName, attribs) {
    if (featureExtendedCreateElement) {
      var tag = ['<', tagName];
      for (var i = 0, n = attribs.length; i < n; i += 2) {
        tag.push(' ', attribs[i], '="', escapeAttrib(attribs[i + 1]), '"');
      }
      tag.push('>');
      return document.createElement(tag.join(''));
    } else {
      var el = document.createElement(tagName);
      for (var i = 0, n = attribs.length; i < n; i += 2) {
        setAttribute(el, attribs[i], attribs[i + 1]);
      }
      return el;
    }
  }

  /**
   * Create a <code>style</code> element for a document containing some
   * specified CSS text. Does not add the element to the document: the client
   * may do this separately if desired.
   *
   * <p>Replaces directly creating the <code>style</code> element and
   * populating its contents.
   *
   * @param document a DOM document.
   * @param cssText a string containing a well-formed stylesheet production.
   * @return a <code>style</code> element for the specified document.
   */
  function createStylesheet(document, cssText) {
    // Courtesy Stoyan Stefanov who documents the derivation of this at
    // http://www.phpied.com/dynamic-script-and-style-elements-in-ie/ and
    // http://yuiblog.com/blog/2007/06/07/style/
    var styleSheet = document.createElement('style');
    styleSheet.setAttribute('type', 'text/css');
    if (styleSheet.styleSheet) {   // IE
      styleSheet.styleSheet.cssText = cssText;
    } else {                // the world
      styleSheet.appendChild(document.createTextNode(cssText));
    }
    return styleSheet;
  }

  /**
   * Set an attribute on a DOM node.
   *
   * <p>Replaces DOM <code>Node::setAttribute</code>.
   *
   * @param {HTMLElement} element a DOM element.
   * @param {string} name the name of an attribute.
   * @param {string} value the value of an attribute.
   */
  function setAttribute(element, name, value) {
    /*
      Hazards:

        - In IE[67], el.setAttribute doesn't work for attributes like
          'class' or 'for'.  IE[67] expects you to set 'className' or
          'htmlFor'.  Using setAttributeNode solves this problem.

        - In IE[67], <input> elements can shadow attributes.  If el is a
          form that contains an <input> named x, then el.setAttribute(x, y)
          will set x's value rather than setting el's attribute.  Using
          setAttributeNode solves this problem.

        - In IE[67], the style attribute can only be modified by setting
          el.style.cssText.  Neither setAttribute nor setAttributeNode will
          work.  el.style.cssText isn't bullet-proof, since it can be
          shadowed by <input> elements.

        - In IE[67], you can never change the type of an <button> element.
          setAttribute('type') silently fails, but setAttributeNode 
          throws an exception.  We want the silent failure.

        - In IE[67], you can never change the type of an <input> element.
          setAttribute('type') throws an exception.  We want the exception.

        - In IE[67], setAttribute is case-sensitive, unless you pass 0 as a
          3rd argument.  setAttributeNode is case-insensitive.

        - Trying to set an invalid name like ":" is supposed to throw an
          error.  In IE[678] and Opera 10, it fails without an error.
    */
    switch (name) {
      case 'style':
        element.style.cssText = value;
        return value;
      // Firefox will run javascript: URLs in the frame specified by target.
      // This can cause things to run in an unintended frame, so we make sure
      // that the target is effectively _self whenever a javascript: URL appears
      // on a node.
      case 'href':
        if (/^javascript:/i.test(value)) {
          element.stored_target___ = element.target;
          element.target = '';
        } else if (element.stored_target___) {
          element.target = element.stored_target___;
          delete element.stored_target___;
        }
        break;
      case 'target':
        if (element.href && /^javascript:/i.test(element.href)) {
          element.stored_target___ = value;
          return value;
        }
        break;
    }
    try {
      var attr = element.ownerDocument.createAttribute(name);
      attr.value = value;
      element.setAttributeNode(attr);
    } catch (e) {
      // It's a real failure only if setAttribute also fails.
      return element.setAttribute(name, value, 0);
    }
    return value;
  }

  /**
   * See <a href="http://www.w3.org/TR/cssom-view/#the-getclientrects"
   *      >ElementView.getBoundingClientRect()</a>.
   * @return {Object} duck types as a TextRectangle with numeric fields
   *    {@code left}, {@code right}, {@code top}, and {@code bottom}.
   */
  function getBoundingClientRect(el) {
    var doc = el.ownerDocument;
    // Use the native method if present.
    if (el.getBoundingClientRect) {
      var cRect = el.getBoundingClientRect();
      if (isIE) {
        // IE has an unnecessary border, which can be mucked with by styles, so
        // the amount of border is not predictable.
        // Depending on whether the document is in quirks or standards mode,
        // the border will be present on either the HTML or BODY elements.
        var fixupLeft = doc.documentElement.clientLeft + doc.body.clientLeft;
        cRect.left -= fixupLeft;
        cRect.right -= fixupLeft;
        var fixupTop = doc.documentElement.clientTop + doc.body.clientTop;
        cRect.top -= fixupTop;
        cRect.bottom -= fixupTop;
      }
      return ({
                top: +cRect.top,
                left: +cRect.left,
                right: +cRect.right,
                bottom: +cRect.bottom
              });
    }

    // Otherwise, try using the deprecated gecko method, or emulate it in
    // horribly inefficient ways.

    // http://code.google.com/p/doctype/wiki/ArticleClientViewportElement
    var viewport = (isIE && doc.compatMode === 'CSS1Compat')
        ? doc.body : doc.documentElement;

    // Figure out the position relative to the viewport.
    // From http://code.google.com/p/doctype/wiki/ArticlePageOffset
    var pageX = 0, pageY = 0;
    if (el === viewport) {
      // The viewport is the origin.
    } else if (doc.getBoxObjectFor) {  // Handles Firefox < 3
      var elBoxObject = doc.getBoxObjectFor(el);
      var viewPortBoxObject = doc.getBoxObjectFor(viewport);
      pageX = elBoxObject.screenX - viewPortBoxObject.screenX;
      pageY = elBoxObject.screenY - viewPortBoxObject.screenY;
    } else {
      // Walk the offsetParent chain adding up offsets.
      for (var op = el; (op && op !== el); op = op.offsetParent) {
        pageX += op.offsetLeft;
        pageY += op.offsetTop;
        if (op !== el) {
          pageX += op.clientLeft || 0;
          pageY += op.clientTop || 0;
        }
        if (isWebkit) {
          // On webkit the offsets for position:fixed elements are off by the
          // scroll offset.
          var opPosition = doc.defaultView.getComputedStyle(op, 'position');
          if (opPosition === 'fixed') {
            pageX += doc.body.scrollLeft;
            pageY += doc.body.scrollTop;
          }
          break;
        }
      }

      // Opera & (safari absolute) incorrectly account for body offsetTop
      if ((isWebkit
           && doc.defaultView.getComputedStyle(el, 'position') === 'absolute')
          || isOpera) {
        pageY -= doc.body.offsetTop;
      }

      // Accumulate the scroll positions for everything but the body element
      for (var op = el; (op = op.offsetParent) && op !== doc.body;) {
        pageX -= op.scrollLeft;
        // see https://bugs.opera.com/show_bug.cgi?id=249965
        if (!isOpera || op.tagName !== 'TR') {
          pageY -= op.scrollTop;
        }
      }
    }

    // Figure out the viewport container so we can subtract the window's
    // scroll offsets.
    var scrollEl = !isWebkit && doc.compatMode === 'CSS1Compat'
        ? doc.documentElement
        : doc.body;

    var left = pageX - scrollEl.scrollLeft, top = pageY - scrollEl.scrollTop;
    return ({
              top: top,
              left: left,
              right: left + el.clientWidth,
              bottom: top + el.clientHeight
            });
  }

  /**
   * Returns the value of the named attribute on element.
   * 
   * <p> In IE[67], if you have
   * <pre>
   *    <form id="f" foo="x"><input name="foo"></form>
   * </pre>
   * then f.foo is the input node,
   * and f.getAttribute('foo') is also the input node,
   * which is contrary to the DOM spec and the behavior of other browsers.
   * 
   * <p> This function tries to get a reliable value.
   *
   * <p> In IE[67], getting 'style' may be unreliable for form elements.
   *
   * @param {HTMLElement} element a DOM element.
   * @param {string} name the name of an attribute.
   */
  function getAttribute(element, name) {
    // In IE[67], element.style.cssText seems to be the only way to get the
    // value string.  This unfortunately fails when element.style is an
    // input element instead of a style object.
    if (name === 'style') {
      if (typeof element.style.cssText === 'string') {
        return element.style.cssText;
      }
    }
    var attr = element.getAttributeNode(name);
    if (attr && attr.specified) {
      return attr.value;
    } else {
      return null;
    }
  }

  function hasAttribute(element, name) {
    if (element.hasAttribute) {  // Non IE
      return element.hasAttribute(name);
    } else {
      var attr = element.getAttributeNode(name);
      return attr !== null && attr.specified;
    }
  }

  /**
   * Returns a "computed style" object for a DOM node.
   *
   * @param {HTMLElement element a DOM element.
   * @param {string} pseudoElement an optional pseudo-element selector,
   * such as ":first-child".
   */
  function getComputedStyle(element, pseudoElement) {
    if (element.currentStyle && pseudoElement === void 0) {
      return element.currentStyle;
    }

    // TODO(ihab.awad): Hack using window.top to get computed style b/c
    // there seem to be cross-frame miseries somewhere causing computed
    // style to be returned as undefined. Investigate the specific problem
    // and at least document it here, if not find a better solution.

    else if (window.top.getComputedStyle) {
      return window.top.getComputedStyle(element, pseudoElement);
    } else {
      throw new Error(
          'Computed style not available for pseudo element '
          + pseudoElement);
    }
  }

  /**
   * Returns a new XMLHttpRequest object, hiding browser differences in the
   * method of construction.
   */
  function makeXhr() {
    if (typeof XMLHttpRequest === 'undefined') {
      var activeXClassIds = [
          'MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0',
          'MSXML2.XMLHTTP', 'MICROSOFT.XMLHTTP.1.0', 'MICROSOFT.XMLHTTP.1',
          'MICROSOFT.XMLHTTP'];
      for (var i = 0, n = activeXClassIds.length; i < n; i++) {
        var candidate = activeXClassIds[i];
        try {
          return new ActiveXObject(candidate);
        } catch (e) {}
      }
    }
    return new XMLHttpRequest;
  }

  return {
    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
    initEvent: initEvent,
    dispatchEvent: dispatchEvent,
    cloneNode: cloneNode,
    createElement: createElement,
    createStylesheet: createStylesheet,
    setAttribute: setAttribute,
    getAttribute: getAttribute,
    hasAttribute: hasAttribute,
    getBoundingClientRect: getBoundingClientRect,
    getWindow: getWindow,
    untameEventType: untameEventType,
    extendedCreateElementFeature: featureExtendedCreateElement,
    getComputedStyle: getComputedStyle,
    makeXhr: makeXhr,
    initCanvasElement: initCanvasElement,
    initCanvasElements: initCanvasElements
  };
};

var bridal = bridalMaker(document);
;
// Copyright (C) 2010 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * Utilities for dealing with CSS source code.
 *
 * @author mikesamuel@gmail.com
 * @provides cssparser
 */

var cssparser = (function ()
{
  var ucaseLetter = /[A-Z]/g;
  function lcaseOne(ch) { return String.fromCharCode(ch.charCodeAt(0) | 32); };
  var LCASE = ('i' === 'I'.toLowerCase())
      ? function (s) { return s.toLowerCase(); }
      // Rhino's toLowerCase is broken.
      : function (s) { return s.replace(ucaseLetter, lcaseOne); };

  // CSS Lexical Grammar rules.
  // CSS lexical grammar from http://www.w3.org/TR/CSS21/grammar.html
  // The comments below are mostly copied verbatim from the grammar.

  // "@import"               {return IMPORT_SYM;}
  // "@page"                 {return PAGE_SYM;}
  // "@media"                {return MEDIA_SYM;}
  // "@charset"              {return CHARSET_SYM;}
  var KEYWORD = '(?:\\@(?:import|page|media|charset))';

  // nl                      \n|\r\n|\r|\f ; a newline
  var NEWLINE = '\\n|\\r\\n|\\r|\\f';

  // h                       [0-9a-f]      ; a hexadecimal digit
  var HEX = '[0-9a-f]';

  // nonascii                [\200-\377]
  var NON_ASCII = '[^\\0-\\177]';

  // unicode                 \\{h}{1,6}(\r\n|[ \t\r\n\f])?
  var UNICODE = '(?:(?:\\\\' + HEX + '{1,6})(?:\\r\\n|[ \t\\r\\n\\f])?)';

  // escape                  {unicode}|\\[^\r\n\f0-9a-f]
  var ESCAPE = '(?:' + UNICODE + '|\\\\[^\\r\\n\\f0-9a-f])';

  // nmstart                 [_a-z]|{nonascii}|{escape}
  var NMSTART = '(?:[_a-z]|' + NON_ASCII + '|' + ESCAPE + ')';

  // nmchar                  [_a-z0-9-]|{nonascii}|{escape}
  var NMCHAR = '(?:[_a-z0-9-]|' + NON_ASCII + '|' + ESCAPE + ')';

  // ident                   -?{nmstart}{nmchar}*
  var IDENT = '-?' + NMSTART + NMCHAR + '*';

  // name                    {nmchar}+
  var NAME = NMCHAR + '+';

  // hash
  var HASH = '#' + NAME;

  // string1                 \"([^\n\r\f\\"]|\\{nl}|{escape})*\"  ; "string"
  var STRING1 = '"(?:[^\\"\\\\]|\\\\[\\s\\S])*"';

  // string2                 \'([^\n\r\f\\']|\\{nl}|{escape})*\'  ; 'string'
  var STRING2 = "'(?:[^\\'\\\\]|\\\\[\\s\\S])*'";

  // string                  {string1}|{string2}
  var STRING = '(?:' + STRING1 + '|' + STRING2 + ')';

  // num                     [0-9]+|[0-9]*"."[0-9]+
  var NUM = '(?:[0-9]*\\.[0-9]+|[0-9]+)';

  // s                       [ \t\r\n\f]
  var SPACE = '[ \\t\\r\\n\\f]';

  // w                       {s}*
  var WHITESPACE = SPACE + '*';

  // url special chars
  var URL_SPECIAL_CHARS = '[!#$%&*-~]';

  // url chars               ({url_special_chars}|{nonascii}|{escape})*
  var URL_CHARS
      = '(?:' + URL_SPECIAL_CHARS + '|' + NON_ASCII + '|' + ESCAPE + ')*';

  // url
  var URL = (
      'url\\(' + WHITESPACE + '(?:' + STRING + '|' + URL_CHARS + ')'
      + WHITESPACE + '\\)');

  // comments
  // see http://www.w3.org/TR/CSS21/grammar.html
  var COMMENT = '/\\*[^*]*\\*+(?:[^/*][^*]*\\*+)*/';

  // {E}{M}             {return EMS;}
  // {E}{X}             {return EXS;}
  // {P}{X}             {return LENGTH;}
  // {C}{M}             {return LENGTH;}
  // {M}{M}             {return LENGTH;}
  // {I}{N}             {return LENGTH;}
  // {P}{T}             {return LENGTH;}
  // {P}{C}             {return LENGTH;}
  // {D}{E}{G}          {return ANGLE;}
  // {R}{A}{D}          {return ANGLE;}
  // {G}{R}{A}{D}       {return ANGLE;}
  // {M}{S}             {return TIME;}
  // {S}                {return TIME;}
  // {H}{Z}             {return FREQ;}
  // {K}{H}{Z}          {return FREQ;}
  // %                  {return PERCENTAGE;}
  var UNIT = '(?:em|ex|px|cm|mm|in|pt|pc|deg|rad|grad|ms|s|hz|khz|%)';

  // {num}{UNIT|IDENT}                   {return NUMBER;}
  var QUANTITY = NUM + '(?:' + WHITESPACE + UNIT + '|' + IDENT + ')?';

  // "<!--"                  {return CDO;}
  // "-->"                   {return CDC;}
  // "~="                    {return INCLUDES;}
  // "|="                    {return DASHMATCH;}
  // {w}"{"                  {return LBRACE;}
  // {w}"+"                  {return PLUS;}
  // {w}">"                  {return GREATER;}
  // {w}","                  {return COMMA;}
  var PUNC =  '<!--|-->|~=|[|=\\{\\+>,:;()]';

  var PROP_DECLS_TOKENS = new RegExp(
      '(?:'
      + [STRING, COMMENT, QUANTITY, URL, NAME, HASH, IDENT, SPACE + '+', PUNC]
          .join('|')
      + ')',
      'gi');

  var IDENT_RE = new RegExp('^(?:' + IDENT + ')$', 'i');
  var URL_RE = new RegExp('^(?:' + URL + ')$', 'i');
  var NON_HEX_ESC_RE = /\\(?:\r\n?|[^0-9A-Fa-f\r]|$)/g;
  var SPACE_RE = new RegExp(SPACE + '+', 'g');
  var BS = /\\/g;
  var DQ = /"/g;

  /** A replacer that deals with non hex backslashes. */
  function normEscs(x) {
    var out = '';
    // x could be '\\' in which case we return '' or it could be '\\\r\n' in
    // which case we escape both.
    // In the normal case where the length is 2 we end up turning any special
    // characters like \\, \", and \' into CSS escape sequences.
    for (var i = 1, n = x.length; i < n; ++i) {
      out += '\\' + x.charCodeAt(i).toString(16) + ' ';
    }
    return out;
  }

  function toCssStr(s) {
    return '"' + (s.replace(BS, '\\5c ').replace(DQ, '\\22 ')) + '"';
  }

  /**
   * Parser for CSS declaration groups that extracts property name, value
   * pairs.
   *
   * <p>
   * This method does not validate the CSS property value.  To do that, match
   * {@link css.properties} against the raw value in the handler.
   *
   * @param {string} cssText of CSS property declarations like
   *     {@code color:red}.
   * @param {function (string, Array.<string>) : void} handler
   *     receives each CSS property name and the tokenized value
   *     minus spaces and comments.
   */
  function parse(cssText, handler) {
    var toks = ('' + cssText).match(PROP_DECLS_TOKENS);
    if (!toks) { return; }
    var propName = null;
    var buf = [];
    var k = 0;
    for (var i = 0, n = toks.length; i < n; ++i) {
      var tok = toks[i];
      switch (tok.charCodeAt(0)) {
        // Skip spaces.  We can do this in properties even if they are
        // significant in rules.
        case 0x9: case 0xa: case 0xc: case 0xd: case 0x20: continue;
        case 0x27:  // Convert to double quoted string.
          tok = '"' + tok.substring(1, tok.length - 1).replace(DQ, '\\22 ')
              + '"';
          // $FALL-THROUGH$
        case 0x22: tok = tok.replace(NON_HEX_ESC_RE, normEscs); break;
        case 0x2f:  // slashes may start comments
          if ('*' === tok.charAt(1)) { continue; }
          break;
        // dot or digit
        case 0x2e:
        case 0x30: case 0x31: case 0x32: case 0x33: case 0x34:
        case 0x35: case 0x36: case 0x37: case 0x38: case 0x39:
          // 0.5 em  =>  0.5em
          tok = tok.replace(SPACE_RE, '');
          break;
        case 0x3a:  // colons separate property names from values
          // Remember the property name.
          if (k === 1 && IDENT_RE.test(buf[0])) {
            propName = LCASE(buf[0]);
          } else {
            propName = null;
          }
          k = buf.length = 0;
          continue;
        case 0x3b:  // semicolons separate name/value pairs
          if (propName) {
            if (buf.length) { handler(propName, buf.slice(0)); }
            propName = null;
          }
          k = buf.length = 0;
          continue;
        case 0x55: case 0x75:  // letter u
          var url = toUrl(tok);
          if (url !== null) { tok = 'url(' + toCssStr(url) + ')'; }
          break;
      }
      buf[k++] = tok;
    }
    if (propName && buf.length) { handler(propName, buf.slice(0)); }
  }

  var unicodeEscape
      = /\\(?:([0-9a-fA-F]{1,6})(?:\r\n?|[ \t\f\n])?|[^\r\n\f0-9a-f])/g;
  function decodeOne(_, hex) {
    return hex ? String.fromCharCode(parseInt(hex, 16)) : _.charAt(1);
  }
  /**
   * Given a css token, returns the URL contained therein or null.
   * @param {string} cssToken
   * @return {string|null}
   */
  function toUrl(cssToken) {
    if (!URL_RE.test(cssToken)) { return null; }
    cssToken = cssToken.replace(/^url[\s\(]+|[\s\)]+$/gi, '');
    switch (cssToken.charAt(0)) {
      case '"': case '\'':
        cssToken = cssToken.substring(1, cssToken.length - 1);
        break;
    }
    return cssToken.replace(unicodeEscape, decodeOne);
  }

  return {
    'parse': parse,
    'toUrl': toUrl,
    'toCssStr': toCssStr
  };
})();
;
// Copyright (C) 2008 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * A partially tamed browser object model based on
 * <a href="http://www.w3.org/TR/DOM-Level-2-HTML/Overview.html"
 * >DOM-Level-2-HTML</a> and specifically, the
 * <a href="http://www.w3.org/TR/DOM-Level-2-HTML/ecma-script-binding.html"
 * >ECMAScript Language Bindings</a>.
 *
 * Caveats:<ul>
 * <li>This is not a full implementation.
 * <li>Security Review is pending.
 * <li><code>===</code> and <code>!==</code> on node lists will not
 *   behave the same as with untamed node lists.  Specifically, it is
 *   not always true that {@code nodeA.childNodes === nodeA.childNodes}.
 * <li>Properties backed by setters/getters like {@code HTMLElement.innerHTML}
 *   will not appear to uncajoled code as DOM nodes do, since they are
 *   implemented using cajita property handlers.
 * </ul>
 *
 * <p>
 * TODO(ihab.awad): Our implementation of getAttribute (and friends)
 * is such that standard DOM attributes which we disallow for security
 * reasons (like 'form:enctype') are placed in the "virtual"
 * attributes map (this.node___.attributes___). They appear to be
 * settable and gettable, but their values are ignored and do not have
 * the expected semantics per the DOM API. This is because we do not
 * have a column in html4-defs.js stating that an attribute is valid
 * but explicitly blacklisted. Alternatives would be to always throw
 * upon access to these attributes; to make them always appear to be
 * null; etc. Revisit this decision if needed.
 *
 * <p>
 * TODO(ihab.awad): Come up with a uniform convention (and helper functions,
 * etc.) for checking that a user-supplied callback is a valid Cajita function
 * or Valija Disfunction.
 *
 * @author mikesamuel@gmail.com
 * @requires console
 * @requires clearInterval, clearTimeout, setInterval, setTimeout, cssparser
 * @requires ___, bridal, bridalMaker, css, html, html4, unicode
 * @provides attachDocumentStub, plugin_dispatchEvent___,
 *     plugin_dispatchToHandler___
 * @overrides domitaModules
 */

var domitaModules;
if (!domitaModules) {
    domitaModules = {};
}

domitaModules.classUtils = function() {
    function getterSetterSuffix(name) {
        return String.fromCharCode(name.charCodeAt(0) & ~32)
            + name.substring(1) + '___';
    }

    /**
     * Add setter and getter hooks so that the caja {@code node.innerHTML = '...'}
     * works as expected.
     */
    function exportFields(object, fields) {
        for (var i = fields.length; --i >= 0;) {
            var field = fields[i];
            var suffix = getterSetterSuffix(field);
            var getterName = 'get' + suffix;
            var setterName = 'set' + suffix;
            var count = 0;
            if (object[getterName]) {
                ++count;
                ___.useGetHandler(
                    object, field, object[getterName]);
            }
            if (object[setterName]) {
                ++count;
                ___.useSetHandler(
                    object, field, object[setterName]);
            }
            if (!count) {
                throw new Error('Failed to export field ' + field + ' on ' + object);
            }
        }
    }

    /**
     * Apply a supplied list of getter and setter functions to a given object.
     *
     * @param object an object to be decorated with getters and setters
     * implementing some properties.
     *
     * @param handlers an object containing the handler functions in the form:
     *
     *     {
     *       <propName> : { get: <getHandlerFcn>, set: <setHandlerFcn> },
     *       <propName> : { get: <getHandlerFcn>, set: <setHandlerFcn> },
     *       ...
     *     }
     *
     * For each <propName> entry, the "get" field is required, but the "set"
     * field may be empty; this implies that <propName> is a read-only property.
     */
    function applyAccessors(object, handlers) {
        function propertyOnlyHasGetter(_) {
            throw new TypeError('setting a property that only has a getter');
        }

        ___.forOwnKeys(handlers,
            ___.markFuncFreeze(function (propertyName, def) {
                var setter = def.set || propertyOnlyHasGetter;
                ___.useGetHandler(object, propertyName, def.get);
                ___.useSetHandler(object, propertyName, setter);
            }));
    }

    function hasGetHandler(object, propertyName) {
        return !!object[propertyName + '_g___'];
    }

    function hasSetHandler(object, propertyName) {
        return !!object[propertyName + '_s___'];
    }

    /**
     * Checks that a user-supplied callback is either a Cajita function or a
     * Valija Disfuction. Return silently if the callback is valid; throw an
     * exception if it is not valid.
     *
     * @param aCallback some user-supplied "function-like" callback.
     */
    function ensureValidCallback(aCallback) {
        if (typeof aCallback === 'function' && aCallback.i___) {
            return;
        }
        throw new Error('Expected valid guest function not ' + typeof aCallback);
    }

    return {
        exportFields: exportFields,
        ensureValidCallback: ensureValidCallback,
        applyAccessors: applyAccessors,
        getterSetterSuffix: getterSetterSuffix,
        hasGetHandler: hasGetHandler,
        hasSetHandler: hasSetHandler
    };
};

/** XMLHttpRequest or an equivalent on IE 6. */
domitaModules.XMLHttpRequestCtor = function (XMLHttpRequest, ActiveXObject) {
    if (XMLHttpRequest) {
        return XMLHttpRequest;
    } else if (ActiveXObject) {
        // The first time the ctor is called, find an ActiveX class supported by
        // this version of IE.
        var activeXClassId;
        return function ActiveXObjectForIE() {
            if (activeXClassId === void 0) {
                activeXClassId = null;
                /** Candidate Active X types. */
                var activeXClassIds = [
                    'MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0',
                    'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP',
                    'MICROSOFT.XMLHTTP.1.0', 'MICROSOFT.XMLHTTP.1',
                    'MICROSOFT.XMLHTTP'];
                for (var i = 0, n = activeXClassIds.length; i < n; i++) {
                    var candidate = activeXClassIds[i];
                    try {
                        void new ActiveXObject(candidate);
                        activeXClassId = candidate;
                        break;
                    } catch (e) {
                        // do nothing; try next choice
                    }
                }
                activeXClassIds = null;
            }
            return new ActiveXObject(activeXClassId);
        };
    } else {
        throw new Error('ActiveXObject not available');
    }
};

domitaModules.TameXMLHttpRequest = function(xmlHttpRequestMaker, uriCallback) {
    var classUtils = domitaModules.classUtils();

    // See http://www.w3.org/TR/XMLHttpRequest/

    // TODO(ihab.awad): Improve implementation (interleaving, memory leaks)
    // per http://www.ilinsky.com/articles/XMLHttpRequest/

    function TameXMLHttpRequest() {
        this.xhr___ = this.FERAL_TWIN___ = new xmlHttpRequestMaker();
        this.FERAL_TWIN___.TAMED_TWIN___ = this;
        classUtils.exportFields(
            this,
            ['onreadystatechange', 'readyState', 'responseText', 'responseXML',
                'status', 'statusText']);
    }

    var FROZEN = "Object is frozen.";
    var INVALID_SUFFIX = "Property names may not end in '__'.";
    var endsWith__ = /__$/;
    TameXMLHttpRequest.prototype.handleRead___ = function (name) {
        name = '' + name;
        if (endsWith__.test(name)) {
            return void 0;
        }
        var handlerName = name + '_getter___';
        if (this[handlerName]) {
            return this[handlerName]();
        }
        if (___.hasOwnProp(this.xhr___.properties___, name)) {
            return this.xhr___.properties___[name];
        } else {
            return void 0;
        }
    };
    TameXMLHttpRequest.prototype.handleCall___ = function (name, args) {
        name = '' + name;
        if (endsWith__.test(name)) {
            throw new Error(INVALID_SUFFIX);
        }
        var handlerName = name + '_handler___';
        if (this[handlerName]) {
            return this[handlerName].call(this, args);
        }
        if (___.hasOwnProp(this.xhr___.properties___, name)) {
            return this.xhr___.properties___[name].call(this, args);
        } else {
            throw new TypeError(name + ' is not a function.');
        }
    };
    TameXMLHttpRequest.prototype.handleSet___ = function (name, val) {
        name = '' + name;
        if (endsWith__.test(name)) {
            throw new Error(INVALID_SUFFIX);
        }
        if (Object.isFrozen(this)) {
            throw new Error(FROZEN);
        }
        var handlerName = name + '_setter___';
        if (this[handlerName]) {
            return this[handlerName](val);
        }
        if (!this.xhr___.properties___) {
            this.xhr___.properties___ = {};
        }
        this[name + '_c___'] = this;
        this[name + '_v___'] = false;
        this[name + '_e___'] = this;
        return this.xhr___.properties___[name] = val;
    };
    TameXMLHttpRequest.prototype.handleDelete___ = function (name) {
        name = '' + name;
        if (endsWith__.test(name)) {
            throw new Error(INVALID_SUFFIX);
        }
        if (Object.isFrozen(this)) {
            throw new Error(FROZEN);
        }
        var handlerName = name + '_deleter___';
        if (this[handlerName]) {
            return this[handlerName]();
        }
        if (this.xhr___.properties___) {
            return (
                delete this.xhr___.properties___[name]
                    && delete this[name + '_c___']
                    && delete this[name + '_e___']
                    && delete this[name + '_v___']);
        } else {
            return true;
        }
    };
    TameXMLHttpRequest.prototype.setOnreadystatechange___ = function (handler) {
        // TODO(ihab.awad): Do we need more attributes of the event than 'target'?
        // May need to implement full "tame event" wrapper similar to DOM events.
        var self = this;
        this.xhr___.onreadystatechange = function(event) {
            var evt = {};
            evt.DefineOwnProperty___('target', {
                value: self,
                writable: true,
                enumerable: true,
                configurable: true
            });
            return ___.callPub(handler, 'call', [void 0, evt]);
        };
        // Store for later direct invocation if need be
        this.handler___ = handler;
    };
    TameXMLHttpRequest.prototype.getReadyState___ = function () {
        // The ready state should be a number
        return Number(this.xhr___.readyState);
    };
    TameXMLHttpRequest.prototype.open = function (method, URL, opt_async, opt_userName, opt_password) {
        method = String(method);
        // The XHR interface does not tell us the MIME type in advance, so we
        // must assume the broadest possible.
        var safeUri = uriCallback.rewrite(
            String(URL), html4.ueffects.SAME_DOCUMENT, html4.ltypes.SANDBOXED);
        // If the uriCallback rejects the URL, we throw an exception, but we do not
        // put the URI in the exception so as not to put the caller at risk of some
        // code in its stack sniffing the URI.
        if ("string" !== typeof safeUri) {
            throw 'URI violates security policy';
        }
        switch (arguments.length) {
            case 2:
                this.async___ = true;
                this.xhr___.open(method, safeUri);
                break;
            case 3:
                this.async___ = opt_async;
                this.xhr___.open(method, safeUri, Boolean(opt_async));
                break;
            case 4:
                this.async___ = opt_async;
                this.xhr___.open(
                    method, safeUri, Boolean(opt_async), String(opt_userName));
                break;
            case 5:
                this.async___ = opt_async;
                this.xhr___.open(
                    method, safeUri, Boolean(opt_async), String(opt_userName),
                    String(opt_password));
                break;
            default:
                throw 'XMLHttpRequest cannot accept ' + arguments.length + ' arguments';
                break;
        }
    };
    TameXMLHttpRequest.prototype.setRequestHeader = function (label, value) {
        this.xhr___.setRequestHeader(String(label), String(value));
    };
    TameXMLHttpRequest.prototype.send = function(opt_data) {
        if (arguments.length === 0) {
            // TODO(ihab.awad): send()-ing an empty string because send() with no
            // args does not work on FF3, others?
            this.xhr___.send('');
        } else if (typeof opt_data === 'string') {
            this.xhr___.send(opt_data);
        } else /* if XML document */ {
            // TODO(ihab.awad): Expect tamed XML document; unwrap and send
            this.xhr___.send('');
        }

        // Firefox does not call the 'onreadystatechange' handler in
        // the case of a synchronous XHR. We simulate this behavior by
        // calling the handler explicitly.
        if (this.xhr___.overrideMimeType) {
            // This is Firefox
            if (!this.async___ && this.handler___) {
                var evt = { target: this };
                ___.callPub(this.handler___, 'call', [void 0, evt]);
            }
        }
    };
    TameXMLHttpRequest.prototype.abort = function () {
        this.xhr___.abort();
    };
    TameXMLHttpRequest.prototype.getAllResponseHeaders = function () {
        var result = this.xhr___.getAllResponseHeaders();
        return (result === undefined || result === null) ?
            result : String(result);
    };
    TameXMLHttpRequest.prototype.getResponseHeader = function (headerName) {
        var result = this.xhr___.getResponseHeader(String(headerName));
        return (result === undefined || result === null) ?
            result : String(result);
    };
    TameXMLHttpRequest.prototype.getResponseText___ = function () {
        var result = this.xhr___.responseText;
        return (result === undefined || result === null) ?
            result : String(result);
    };
    TameXMLHttpRequest.prototype.getResponseXML___ = function () {
        // TODO(ihab.awad): Implement a taming layer for XML. Requires generalizing
        // the HTML node hierarchy as well so we have a unified implementation.
        return {};
    };
    TameXMLHttpRequest.prototype.getStatus___ = function () {
        var result = this.xhr___.status;
        return (result === undefined || result === null) ?
            result : Number(result);
    };
    TameXMLHttpRequest.prototype.getStatusText___ = function () {
        var result = this.xhr___.statusText;
        return (result === undefined || result === null) ?
            result : String(result);
    };
    TameXMLHttpRequest.prototype.toString = ___.markFuncFreeze(function () {
        return 'Not a real XMLHttpRequest';
    });
    ___.markCtor(TameXMLHttpRequest, Object, 'TameXMLHttpRequest');
    ___.all2(___.grantTypedMethod, TameXMLHttpRequest.prototype,
        ['open', 'setRequestHeader', 'send', 'abort',
            'getAllResponseHeaders', 'getResponseHeader']);

    return TameXMLHttpRequest;
};

domitaModules.CssPropertiesCollection =
    function(cssPropertyNameCollection, anElement, css) {
        var canonicalStylePropertyNames = {};
        // Maps style property names, e.g. cssFloat, to property names, e.g. float.
        var cssPropertyNames = {};

        ___.forOwnKeys(cssPropertyNameCollection,
            ___.markFuncFreeze(function (cssPropertyName) {
                var baseStylePropertyName = cssPropertyName.replace(
                    /-([a-z])/g, function (_, letter) {
                        return letter.toUpperCase();
                    });
                var canonStylePropertyName = baseStylePropertyName;
                cssPropertyNames[baseStylePropertyName]
                    = cssPropertyNames[canonStylePropertyName]
                    = cssPropertyName;
                if (css.alternates.hasOwnProperty(canonStylePropertyName)) {
                    var alts = css.alternates[canonStylePropertyName];
                    for (var i = alts.length; --i >= 0;) {
                        cssPropertyNames[alts[i]] = cssPropertyName;
                        // Handle oddities like cssFloat/styleFloat.
                        if (alts[i] in anElement.style
                            && !(canonStylePropertyName in anElement.style)) {
                            canonStylePropertyName = alts[i];
                        }
                    }
                }
                canonicalStylePropertyNames[cssPropertyName] = canonStylePropertyName;
            }));

        return {
            isCanonicalProp: function (p) {
                return cssPropertyNames.hasOwnProperty(p);
            },
            isCssProp: function (p) {
                return canonicalStylePropertyNames.hasOwnProperty(p);
            },
            getCanonicalPropFromCss: function (p) {
                return canonicalStylePropertyNames[p];
            },
            getCssPropFromCanonical: function(p) {
                return cssPropertyNames[p];
            }
        };
    };

/**
 * Add a tamed document implementation to a Gadget's global scope.
 *
 * Has the side effect of adding the classes "vdoc-body___" and
 * idSuffix.substring(1) to the pseudoBodyNode.
 *
 * @param {string} idSuffix a string suffix appended to all node IDs.
 *     It should begin with "-" and end with "___".
 * @param {Object} uriCallback an object like <pre>{
 *       rewrite: function (uri, uriEffect, loaderType, hints) { return safeUri }
 *     }</pre>.
 *       * uri: the uri to be rewritten
 *       * uriEffect: the effect that allowing a URI to load has (@see UriEffect.java).
 *       * loaderType: type of loader that would load the URI or the rewritten version.
 *       * hints: record that describes the context in which the URI appears.  If a hint is not
 *         present it should not be relied upon.
 *     The rewrite function should be idempotent to allow rewritten HTML
 *     to be reinjected.
 * @param {Object} imports the gadget's global scope.
 * @param {Node} pseudoBodyNode an HTML node to act as the "body" of the
 *     virtual document provided to Cajoled code.
 * @param {Object} optPseudoWindowLocation a record containing the
 *     properties of the browser "window.location" object, which will
 *     be provided to the Cajoled code.
 */
var attachDocumentStub = (function () {
    // Array Remove - By John Resig (MIT Licensed)
    function arrayRemove(array, from, to) {
        var rest = array.slice((to || from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    }

    var TameNodeMark = ___.Trademark('TameNode');
    var TameNodeT = TameNodeMark.guard;
    var TameEventMark = ___.Trademark('TameEvent');
    var TameEventT = TameEventMark.guard;
    var TameImageDataMark = ___.Trademark('TameImageData');
    var TameImageDataT = TameImageDataMark.guard;
    var TameGradientMark = ___.Trademark('TameGradient');
    var TameGradientT = TameGradientMark.guard;

    // Define a wrapper type for known safe HTML, and a trademarker.
    // This does not actually use the trademarking functions since trademarks
    // cannot be applied to strings.
    function Html(htmlFragment) {
        this.html___ = String(htmlFragment || '');
    }

    Html.prototype.valueOf = Html.prototype.toString =
        ___.markFuncFreeze(function () {
            return this.html___;
        });
    function safeHtml(htmlFragment) {
        return (htmlFragment instanceof Html)
            ? htmlFragment.html___
            : html.escapeAttrib(String(htmlFragment || ''));
    }

    function blessHtml(htmlFragment) {
        return (htmlFragment instanceof Html)
            ? htmlFragment
            : new Html(htmlFragment);
    }

    var XML_SPACE = '\t\n\r ';

    var JS_SPACE = '\t\n\r ';
    // An identifier that does not end with __.
    var JS_IDENT = '(?:[a-zA-Z_][a-zA-Z0-9$_]*[a-zA-Z0-9$]|[a-zA-Z])_?';
    var SIMPLE_HANDLER_PATTERN = new RegExp(
        '^[' + JS_SPACE + ']*'
            + '(return[' + JS_SPACE + ']+)?'  // Group 1 is present if it returns.
            + '(' + JS_IDENT + ')[' + JS_SPACE + ']*'  // Group 2 is a function name.
            // Which can be passed optionally this node, and optionally the event.
            + '\\((?:this'
            + '(?:[' + JS_SPACE + ']*,[' + JS_SPACE + ']*event)?'
            + '[' + JS_SPACE + ']*)?\\)'
            // And it can end with a semicolon.
            + '[' + JS_SPACE + ']*(?:;?[' + JS_SPACE + ']*)$');

    // These id patterns match the ones in HtmlAttributeRewriter.

    var VALID_ID_CHAR = '[a-z]|[A-Z';

    var VALID_ID_PATTERN = new RegExp(
        '^[' + VALID_ID_CHAR + ']+$');

    var VALID_ID_LIST_PATTERN = new RegExp(
        '^[' + XML_SPACE + VALID_ID_CHAR + ']*$');

    var FORBIDDEN_ID_PATTERN = new RegExp('__\\s*$');

    var FORBIDDEN_ID_LIST_PATTERN = new RegExp('__(?:\\s|$)');

    function isValidId(s) {
        return !FORBIDDEN_ID_PATTERN.test(s)
            && VALID_ID_PATTERN.test(s);
    }

    function isValidIdList(s) {
        return !FORBIDDEN_ID_LIST_PATTERN.test(s)
            && VALID_ID_LIST_PATTERN.test(s);
    }

    // Trim whitespace from the beginning and end of a CSS string.

    function trimCssSpaces(input) {
        return input.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, '');
    }

    /**
     * The plain text equivalent of a CSS string body.
     * @param {string} s the body of a CSS string literal w/o quotes
     *     or CSS identifier.
     * @return {string} plain text.
     * {@updoc
     * $ decodeCssString('')
     * # ''
     * $ decodeCssString('foo')
     * # 'foo'
     * $ decodeCssString('foo\\\nbar\\\r\nbaz\\\rboo\\\ffar')
     * # 'foobarbazboofar'
     * $ decodeCssString('foo\\000a bar\\000Abaz')
     * # 'foo' + '\n' + 'bar' + '\u0ABA' + 'z'
     * $ decodeCssString('foo\\\\bar\\\'baz')
     * # "foo\\bar'baz"
     * }
     */
    function decodeCssString(s) {
        // Decode a CSS String literal.
        // From http://www.w3.org/TR/CSS21/grammar.html
        //     string1    \"([^\n\r\f\\"]|\\{nl}|{escape})*\"
        //     unicode    \\{h}{1,6}(\r\n|[ \t\r\n\f])?
        //     escape     {unicode}|\\[^\r\n\f0-9a-f]
        //     s          [ \t\r\n\f]+
        //     nl         \n|\r\n|\r|\f
        return s.replace(
            /\\(?:(\r\n?|\n|\f)|([0-9a-f]{1,6})(?:\r\n?|[ \t\n\f])?|(.))/gi,
            function (_, nl, hex, esc) {
                return esc || (nl ? '' : String.fromCharCode(parseInt(hex, 16)));
            });
    }

    /**
     * Sanitize the 'style' attribute value of an HTML element.
     *
     * @param styleAttrValue the value of a 'style' attribute, which we
     * assume has already been checked by the caller to be a plain String.
     *
     * @return a sanitized version of the attribute value.
     */
    function sanitizeStyleAttrValue(styleAttrValue) {
        var sanitizedDeclarations = [];
        cssparser.parse(
            String(styleAttrValue),
            function (property, value) {
                property = property.toLowerCase();
                if (css.properties.hasOwnProperty(property)
                    && css.properties[property].test(value + '')) {
                    sanitizedDeclarations.push(property + ': ' + value);
                }
            });
        return sanitizedDeclarations.join(' ; ');
    }

    function mimeTypeForAttr(tagName, attribName) {
        if (attribName === 'src') {
            if (tagName === 'img') {
                return 'image/*';
            }
            if (tagName === 'script') {
                return 'text/javascript';
            }
        }
        return '*/*';
    }

    // TODO(ihab.awad): Does this work on IE, where console output
    // goes to a DOM node?
    function assert(cond) {
        if (!cond) {
            if (typeof console !== 'undefined') {
                console.error('domita assertion failed');
                console.trace();
            }
            throw new Error("Domita assertion failed");
        }
    }

    var classUtils = domitaModules.classUtils();

    var cssSealerUnsealerPair = ___.makeSealerUnsealerPair();

    // Implementations of setTimeout, setInterval, clearTimeout, and
    // clearInterval that only allow simple functions as timeouts and
    // that treat timeout ids as capabilities.
    // This is safe even if accessed across frame since the same
    // trademark value is never used with more than one version of
    // setTimeout.
    var TimeoutIdMark = ___.Trademark('TimeoutId');
    var TimeoutIdT = TimeoutIdMark.guard;

    function tameSetTimeout(timeout, delayMillis) {
        // Existing browsers treat a timeout of null or undefined as a noop.
        var timeoutId;
        if (timeout) {
            if (typeof timeout === 'string') {
                throw new Error(
                    'setTimeout called with a string.'
                        + '  Please pass a function instead of a string of javascript');
            }
            timeoutId = setTimeout(
                function () {
                    ___.callPub(timeout, 'call', [___.USELESS]);
                },
                delayMillis | 0);
        } else {
            // tameClearTimeout checks for NaN and handles it specially.
            timeoutId = NaN;
        }
        return ___.stamp([TimeoutIdMark.stamp],
            { timeoutId___: timeoutId });
    }

    ___.markFuncFreeze(tameSetTimeout);
    function tameClearTimeout(timeoutId) {
        if (timeoutId === null || timeoutId === (void 0)) {
            return;
        }
        try {
            timeoutId = TimeoutIdT.coerce(timeoutId);
        } catch (e) {
            // From https://developer.mozilla.org/en/DOM/window.clearTimeout says:
            // Notes:
            // Passing an invalid ID to clearTimeout does not have any effect
            // (and doesn't throw an exception).
            return;
        }
        var rawTimeoutId = timeoutId.timeoutId___;
        // Skip NaN values created for null timeouts above.
        if (rawTimeoutId === rawTimeoutId) {
            clearTimeout(rawTimeoutId);
        }
    }

    ___.markFuncFreeze(tameClearTimeout);

    var IntervalIdMark = ___.Trademark('IntervalId');
    var IntervalIdT = IntervalIdMark.guard;

    function tameSetInterval(interval, delayMillis) {
        // Existing browsers treat an interval of null or undefined as a noop.
        var intervalId;
        if (interval) {
            if (typeof interval === 'string') {
                throw new Error(
                    'setInterval called with a string.'
                        + '  Please pass a function instead of a string of javascript');
            }
            intervalId = setInterval(
                function () {
                    ___.callPub(interval, 'call', [___.USELESS]);
                },
                delayMillis | 0);
        } else {
            intervalId = NaN;
        }
        return ___.stamp([IntervalIdMark.stamp],
            { intervalId___: intervalId });
    }

    ___.markFuncFreeze(tameSetInterval);
    function tameClearInterval(intervalId) {
        if (intervalId === null || intervalId === (void 0)) {
            return;
        }
        try {
            intervalId = IntervalIdT.coerce(intervalId);
        } catch (e) {
            // See comment about corresponding error handling in clearTimeout.
            return;
        }
        var rawIntervalId = intervalId.intervalId___;
        if (rawIntervalId === rawIntervalId) {
            clearInterval(rawIntervalId);
        }
    }

    ___.markFuncFreeze(tameClearInterval);

    function makeScrollable(element) {
        var window = bridal.getWindow(element);
        var overflow = null;
        if (element.currentStyle) {
            overflow = element.currentStyle.overflow;
        } else if (window.getComputedStyle) {
            overflow = window.getComputedStyle(element, void 0).overflow;
        } else {
            overflow = null;
        }
        switch (overflow && overflow.toLowerCase()) {
            case 'visible':
            case 'hidden':
                element.style.overflow = 'auto';
                break;
        }
    }

    /**
     * Moves the given pixel within the element's frame of reference as close to
     * the top-left-most pixel of the element's viewport as possible without
     * moving the viewport beyond the bounds of the content.
     * @param {number} x x-coord of a pixel in the element's frame of reference.
     * @param {number} y y-coord of a pixel in the element's frame of reference.
     */
    function tameScrollTo(element, x, y) {
        if (x !== +x || y !== +y || x < 0 || y < 0) {
            throw new Error('Cannot scroll to ' + x + ':' + typeof x + ','
                + y + ' : ' + typeof y);
        }
        element.scrollLeft = x;
        element.scrollTop = y;
    }

    /**
     * Moves the origin of the given element's view-port by the given offset.
     * @param {number} dx a delta in pixels.
     * @param {number} dy a delta in pixels.
     */
    function tameScrollBy(element, dx, dy) {
        if (dx !== +dx || dy !== +dy) {
            throw new Error('Cannot scroll by ' + dx + ':' + typeof dx + ', '
                + dy + ':' + typeof dy);
        }
        element.scrollLeft += dx;
        element.scrollTop += dy;
    }

    function guessPixelsFromCss(cssStr) {
        if (!cssStr) {
            return 0;
        }
        var m = cssStr.match(/^([0-9]+)/);
        return m ? +m[1] : 0;
    }

    function tameResizeTo(element, w, h) {
        if (w !== +w || h !== +h) {
            throw new Error('Cannot resize to ' + w + ':' + typeof w + ', '
                + h + ':' + typeof h);
        }
        element.style.width = w + 'px';
        element.style.height = h + 'px';
    }

    function tameResizeBy(element, dw, dh) {
        if (dw !== +dw || dh !== +dh) {
            throw new Error('Cannot resize by ' + dw + ':' + typeof dw + ', '
                + dh + ':' + typeof dh);
        }
        if (!dw && !dh) {
            return;
        }

        // scrollWidth is width + padding + border.
        // offsetWidth is width + padding + border, but excluding the non-visible
        // area.
        // clientWidth iw width + padding, and like offsetWidth, clips to the
        // viewport.
        // margin does not count in any of these calculations.
        //
        // scrollWidth/offsetWidth
        //   +------------+
        //   |            |
        //
        // +----------------+
        // |                | Margin-top
        // | +------------+ |
        // | |############| | Border-top
        // | |#+--------+#| |
        // | |#|        |#| | Padding-top
        // | |#| +----+ |#| |
        // | |#| |    | |#| | Height
        // | |#| |    | |#| |
        // | |#| +----+ |#| |
        // | |#|        |#| |
        // | |#+--------+#| |
        // | |############| |
        // | +------------+ |
        // |                |
        // +----------------+
        //
        //     |        |
        //     +--------+
        //     clientWidth (but excludes content outside viewport)

        var style = element.currentStyle;
        if (!style) {
            style = bridal.getWindow(element).getComputedStyle(element, void 0);
        }

        // We guess the padding since it's not always expressed in px on IE
        var extraHeight = guessPixelsFromCss(style.paddingBottom)
            + guessPixelsFromCss(style.paddingTop);
        var extraWidth = guessPixelsFromCss(style.paddingLeft)
            + guessPixelsFromCss(style.paddingRight);

        var goalHeight = element.clientHeight + dh;
        var goalWidth = element.clientWidth + dw;

        var h = goalHeight - extraHeight;
        var w = goalWidth - extraWidth;

        if (dh) {
            element.style.height = Math.max(0, h) + 'px';
        }
        if (dw) {
            element.style.width = Math.max(0, w) + 'px';
        }

        // Correct if our guesses re padding and borders were wrong.
        // We may still not be able to resize if e.g. the deltas would take
        // a dimension negative.
        if (dh && element.clientHeight !== goalHeight) {
            var hError = element.clientHeight - goalHeight;
            element.style.height = Math.max(0, h - hError) + 'px';
        }
        if (dw && element.clientWidth !== goalWidth) {
            var wError = element.clientWidth - goalWidth;
            element.style.width = Math.max(0, w - wError) + 'px';
        }
    }

    // See above for a description of this function.
    function attachDocumentStub(idSuffix, uriCallback, imports, pseudoBodyNode, optPseudoWindowLocation) {
        var pluginId = ___.getId(imports);
        var document = pseudoBodyNode.ownerDocument;
        var bridal = bridalMaker(document);
        var window = bridal.getWindow(pseudoBodyNode);

        if (arguments.length < 4) {
            throw new Error('arity mismatch: ' + arguments.length);
        }
        if (!optPseudoWindowLocation) {
            optPseudoWindowLocation = {};
        }
        var elementPolicies = {};
        elementPolicies.form = function (attribs) {
            // Forms must have a gated onsubmit handler or they must have an
            // external target.
            var sawHandler = false;
            for (var i = 0, n = attribs.length; i < n; i += 2) {
                if (attribs[i] === 'onsubmit') {
                    sawHandler = true;
                }
            }
            if (!sawHandler) {
                attribs.push('onsubmit', 'return false');
            }
            return attribs;
        };
        elementPolicies.a = elementPolicies.area = function (attribs) {
            // Anchor tags must always have the target '_blank'.
            attribs.push('target', '_blank');
            return attribs;
        };

        // On IE, turn an <canvas> tags into canvas elements that explorercanvas
        // will recognize 
        bridal.initCanvasElements(pseudoBodyNode);

        /** Sanitize HTML applying the appropriate transformations. */
        function sanitizeHtml(htmlText) {
            var out = [];
            htmlSanitizer(htmlText, out);
            return out.join('');
        }

        function sanitizeAttrs(tagName, attribs) {
            var n = attribs.length;
            for (var i = 0; i < n; i += 2) {
                var attribName = attribs[i];
                var value = attribs[i + 1];
                var atype = null, attribKey;
                if ((attribKey = tagName + '::' + attribName,
                    html4.ATTRIBS.hasOwnProperty(attribKey))
                    || (attribKey = '*::' + attribName,
                    html4.ATTRIBS.hasOwnProperty(attribKey))) {
                    atype = html4.ATTRIBS[attribKey];
                    value = rewriteAttribute(tagName, attribName, atype, value);
                } else {
                    value = null;
                }
                if (value !== null && value !== void 0) {
                    attribs[i + 1] = value;
                } else {
                    // Swap last attribute name/value pair in place, and reprocess here.
                    // This could affect how user-agents deal with duplicate attributes.
                    attribs[i + 1] = attribs[--n];
                    attribs[i] = attribs[--n];
                    i -= 2;
                }
            }
            attribs.length = n;
            var policy = elementPolicies[tagName];
            if (policy && elementPolicies.hasOwnProperty(tagName)) {
                return policy(attribs);
            }
            return attribs;
        }

        var htmlSanitizer = html.makeHtmlSanitizer(sanitizeAttrs);

        /**
         * If str ends with suffix,
         * and str is not identical to suffix,
         * then return the part of str before suffix.
         * Otherwise return fail.
         */
        function unsuffix(str, suffix, fail) {
            if (typeof str !== 'string') return fail;
            var n = str.length - suffix.length;
            if (0 < n && str.substring(n) === suffix) {
                return str.substring(0, n);
            } else {
                return fail;
            }
        }

        var ID_LIST_PARTS_PATTERN = new RegExp(
            '([^' + XML_SPACE + ']+)([' + XML_SPACE + ']+|$)', 'g');

        /** Convert a real attribute value to the value seen in a sandbox. */
        function virtualizeAttributeValue(attrType, realValue) {
            realValue = String(realValue);
            switch (attrType) {
                case html4.atype.GLOBAL_NAME:
                case html4.atype.ID:
                case html4.atype.IDREF:
                    return unsuffix(realValue, idSuffix, null);
                case html4.atype.IDREFS:
                    return realValue.replace(ID_LIST_PARTS_PATTERN,
                        function(_, id, spaces) {
                            return unsuffix(id, idSuffix, '') + (spaces ? ' ' : '');
                        });
                case html4.atype.URI_FRAGMENT:
                    if (realValue && '#' === realValue.charAt(0)) {
                        realValue = unsuffix(realValue.substring(1), idSuffix, null);
                        return realValue ? '#' + realValue : null;
                    } else {
                        return null;
                    }
                    break;
                default:
                    return realValue;
            }
        }

        /**
         * Undoes some of the changes made by sanitizeHtml, e.g. stripping ID
         * prefixes.
         */
        function tameInnerHtml(htmlText) {
            var out = [];
            innerHtmlTamer(htmlText, out);
            return out.join('');
        }

        var innerHtmlTamer = html.makeSaxParser({
            startTag: function (tagName, attribs, out) {
                out.push('<', tagName);
                for (var i = 0; i < attribs.length; i += 2) {
                    var aname = attribs[i];
                    var atype = getAttributeType(tagName, aname);
                    var value = attribs[i + 1];
                    if (aname !== 'target' && atype !== void 0) {
                        value = virtualizeAttributeValue(atype, value);
                        if (typeof value === 'string') {
                            out.push(' ', aname, '="', html.escapeAttrib(value), '"');
                        }
                    }
                }
                out.push('>');
            },
            endTag: function (name, out) {
                out.push('</', name, '>');
            },
            pcdata: function (text, out) {
                out.push(text);
            },
            rcdata: function (text, out) {
                out.push(text);
            },
            cdata: function (text, out) {
                out.push(text);
            }
        });

        /**
         * Returns a normalized attribute value, or null if the attribute should
         * be omitted.
         * <p>This function satisfies the attribute rewriter interface defined in
         * {@link html-sanitizer.js}.  As such, the parameters are keys into
         * data structures defined in {@link html4-defs.js}.
         *
         * @param {string} tagName a canonical tag name.
         * @param {string} attribName a canonical tag name.
         * @param type as defined in html4-defs.js.
         *
         * @return {string|null} null to indicate that the attribute should not
         *   be set.
         */
        function rewriteAttribute(tagName, attribName, type, value) {
            switch (type) {
                case html4.atype.NONE:
                    return String(value);
                case html4.atype.CLASSES:
                    // note, className is arbitrary CDATA.
                    value = String(value);
                    if (!FORBIDDEN_ID_LIST_PATTERN.test(value)) {
                        return value;
                    }
                    return null;
                case html4.atype.GLOBAL_NAME:
                case html4.atype.ID:
                case html4.atype.IDREF:
                    value = String(value);
                    if (value && isValidId(value)) {
                        return value + idSuffix;
                    }
                    return null;
                case html4.atype.IDREFS:
                    value = String(value);
                    if (value && isValidIdList(value)) {
                        return value.replace(ID_LIST_PARTS_PATTERN,
                            function(_, id, spaces) {
                                return id + idSuffix + (spaces ? ' ' : '');
                            });
                    }
                    return null;
                case html4.atype.LOCAL_NAME:
                    value = String(value);
                    if (value && isValidId(value)) {
                        return value;
                    }
                    return null;
                case html4.atype.SCRIPT:
                    value = String(value);
                    // Translate a handler that calls a simple function like
                    //   return foo(this, event)

                    // TODO(mikesamuel): integrate cajita compiler to allow arbitrary
                    // cajita in event handlers.
                    var match = value.match(SIMPLE_HANDLER_PATTERN);
                    if (!match) {
                        return null;
                    }
                    var doesReturn = match[1];
                    var fnName = match[2];
                    value = (doesReturn ? 'return ' : '') + 'plugin_dispatchEvent___('
                        + 'this, event, ' + pluginId + ', "'
                        + fnName + '");';
                    if (attribName === 'onsubmit') {
                        value = 'try { ' + value + ' } finally { return false; }';
                    }
                    return value;
                case html4.atype.URI:
                    value = String(value);
                    if (!uriCallback) {
                        return null;
                    }
                    return uriCallback.rewrite(
                        value, getUriEffect(tagName, attribName), getLoaderType(tagName, attribName),
                        { "XML_ATTR": attribName}) || null;
                case html4.atype.URI_FRAGMENT:
                    value = String(value);
                    if (value.charAt(0) === '#' && isValidId(value.substring(1))) {
                        return value + idSuffix;
                    }
                    return null;
                case html4.atype.STYLE:
                    if ('function' !== typeof value) {
                        return sanitizeStyleAttrValue(String(value));
                    }
                    var cssPropertiesAndValues = cssSealerUnsealerPair.unseal(value);
                    if (!cssPropertiesAndValues) {
                        return null;
                    }

                    var css = [];
                    for (var i = 0; i < cssPropertiesAndValues.length; i += 2) {
                        var propName = cssPropertiesAndValues[i];
                        var propValue = cssPropertiesAndValues[i + 1];
                        // If the propertyName differs between DOM and CSS, there will
                        // be a semicolon between the two.
                        // E.g., 'background-color;backgroundColor'
                        // See CssTemplate.toPropertyValueList.
                        var semi = propName.indexOf(';');
                        if (semi >= 0) {
                            propName = propName.substring(0, semi);
                        }
                        css.push(propName + ' : ' + propValue);
                    }
                    return css.join(' ; ');
                // Frames are ambient, so disallow reference.
                case html4.atype.FRAME_TARGET:
                default:
                    return null;
            }
        }

        function makeCache() {
            var cache = ___.newTable(false);
            cache.set(null, null);
            cache.set(void 0, null);
            return cache;
        }

        var editableTameNodeCache = makeCache();
        var readOnlyTameNodeCache = makeCache();

        /**
         * returns a tame DOM node.
         * @param {Node} node
         * @param {boolean} editable
         * @see <a href="http://www.w3.org/TR/DOM-Level-2-HTML/html.html"
         *       >DOM Level 2</a>
         */
        function defaultTameNode(node, editable) {
            if (node === null || node === void 0) {
                return null;
            }
            // TODO(mikesamuel): make sure it really is a DOM node

            var cache = editable ? editableTameNodeCache : readOnlyTameNodeCache;
            var tamed = cache.get(node);
            if (tamed !== void 0) {
                return tamed;
            }
            switch (node.nodeType) {
                case 1:  // Element
                    var tagName = node.tagName.toLowerCase();
                    switch (tagName) {
                        case 'a':
                            tamed = new TameAElement(node, editable);
                            break;
                        case 'canvas':
                            tamed = new TameCanvasElement(node, editable);
                            break;
                        case 'form':
                            tamed = new TameFormElement(node, editable);
                            break;
                        case 'select':
                        case 'button':
                        case 'option':
                        case 'textarea':
                        case 'input':
                            tamed = new TameInputElement(node, editable);
                            break;
                        case 'iframe':
                            tamed = new TameIFrameElement(node, editable);
                            break;
                        case 'img':
                            tamed = new TameImageElement(node, editable);
                            break;
                        case 'label':
                            tamed = new TameLabelElement(node, editable);
                            break;
                        case 'script':
                            tamed = new TameScriptElement(node, editable);
                            break;
                        case 'td':
                        case 'thead':
                        case 'tfoot':
                        case 'tbody':
                        case 'th':
                            tamed = new TameTableCompElement(node, editable);
                            break;
                        case 'tr':
                            tamed = new TameTableRowElement(node, editable);
                            break;
                        case 'table':
                            tamed = new TameTableElement(node, editable);
                            break;
                        default:
                            if (!html4.ELEMENTS.hasOwnProperty(tagName)
                                || (html4.ELEMENTS[tagName] & html4.eflags.UNSAFE)) {
                                // If an unrecognized or unsafe node, return a
                                // placeholder that doesn't prevent tree navigation,
                                // but that doesn't allow mutation or leak attribute
                                // information.
                                tamed = new TameOpaqueNode(node, editable);
                            } else {
                                tamed = new TameElement(node, editable, editable);
                            }
                            break;
                    }
                    break;
                case 2:  // Attr
                    // Cannot generically wrap since we must have access to the
                    // owner element
                    throw 'Internal: Attr nodes cannot be generically wrapped';
                    break;
                case 3:  // Text
                case 4:  // CDATA Section Node
                    tamed = new TameTextNode(node, editable);
                    break;
                case 8:  // Comment
                    tamed = new TameCommentNode(node, editable);
                    break;
                case 11: // Document Fragment
                    tamed = new TameBackedNode(node, editable, editable);
                    break;
                default:
                    tamed = new TameOpaqueNode(node, editable);
                    break;
            }

            if (node.nodeType === 1) {
                cache.set(node, tamed);
            }
            return tamed;
        }

        function tameRelatedNode(node, editable, tameNodeCtor) {
            if (node === null || node === void 0) {
                return null;
            }
            if (node === tameDocument.body___) {
                if (tameDocument.editable___ && !editable) {
                    // FIXME: return a non-editable version of body.
                    throw new Error(NOT_EDITABLE);
                }
                return tameDocument.getBody___();
            }

            // Catch errors because node might be from a different domain.
            try {
                var docElem = node.ownerDocument.documentElement;
                for (var ancestor = node; ancestor; ancestor = ancestor.parentNode) {
                    if (idClassPattern.test(ancestor.className)) {
                        return tameNodeCtor(node, editable);
                    } else if (ancestor === docElem) {
                        return null;
                    }
                }
                return tameNodeCtor(node, editable);
            } catch (e) {
            }
            return null;
        }

        /**
         * Returns the length of a raw DOM Nodelist object, working around
         * NamedNodeMap bugs in IE, Opera, and Safari as discussed at
         * http://code.google.com/p/google-caja/issues/detail?id=935
         *
         * @param nodeList a DOM NodeList.
         *
         * @return the number of nodes in the NodeList.
         */
        function getNodeListLength(nodeList) {
            var limit = nodeList.length;
            if (limit !== +limit) {
                limit = 1 / 0;
            }
            return limit;
        }

        /**
         * Constructs a NodeList-like object.
         *
         * @param tamed a JavaScript array that will be populated and decorated
         *     with the DOM NodeList API.
         * @param nodeList an array-like object supporting a "length" property
         *     and "[]" numeric indexing, or a raw DOM NodeList;
         * @param editable whether the tame nodes wrapped by this object
         *     should permit editing.
         * @param opt_tameNodeCtor a function for constructing tame nodes
         *     out of raw DOM nodes.
         */
        function mixinNodeList(tamed, nodeList, editable, opt_tameNodeCtor) {
            var limit = getNodeListLength(nodeList);
            if (limit > 0 && !opt_tameNodeCtor) {
                throw 'Internal: Nonempty mixinNodeList() without a tameNodeCtor';
            }

            for (var i = 0; i < limit && nodeList[i]; ++i) {
                tamed[i] = opt_tameNodeCtor(nodeList[i], editable);
            }

            // Guard against accidental leakage of untamed nodes
            nodeList = null;

            tamed.item = ___.markFuncFreeze(function (k) {
                k &= 0x7fffffff;
                if (k !== k) {
                    throw new Error();
                }
                return tamed[k] || null;
            });

            ___.grantFunc(tamed, 'item');

            return tamed;
        }

        function tameNodeList(nodeList, editable, opt_tameNodeCtor) {
            return ___.freeze(
                mixinNodeList([], nodeList, editable, opt_tameNodeCtor));
        }

        function tameOptionsList(nodeList, editable, opt_tameNodeCtor) {
            var nl = mixinNodeList([], nodeList, editable, opt_tameNodeCtor);
            nl.selectedIndex = +nodeList.selectedIndex;
            ___.grantRead(nl, 'selectedIndex');
            return ___.freeze(nl);
        }

        /**
         * Return a fake node list containing tamed nodes.
         * @param {Array.<TameNode>} array of tamed nodes.
         * @return an array that duck types to a node list.
         */
        function fakeNodeList(array) {
            var f = function(i) {
                return array[i];
            };
            array.item = ___.markFuncFreeze(f);
            ___.grantFunc(array, 'item');
            return ___.freeze(array);
        }

        /**
         * Constructs an HTMLCollection-like object which indexes its elements
         * based on their NAME attribute.
         *
         * @param tamed a JavaScript array that will be populated and decorated
         *     with the DOM HTMLCollection API.
         * @param nodeList an array-like object supporting a "length" property
         *     and "[]" numeric indexing.
         * @param editable whether the tame nodes wrapped by this object
         *     should permit editing.
         * @param opt_tameNodeCtor a function for constructing tame nodes
         *     out of raw DOM nodes.
         */
        function mixinHTMLCollection(tamed, nodeList, editable, opt_tameNodeCtor) {
            mixinNodeList(tamed, nodeList, editable, opt_tameNodeCtor);

            var tameNodesByName = {};
            var tameNode;

            for (var i = 0; i < tamed.length && (tameNode = tamed[i]); ++i) {
                var name = tameNode.getAttribute('name');
                if (name && !(name.charAt(name.length - 1) === '_' || (name in tamed)
                    || name === String(name & 0x7fffffff))) {
                    if (!tameNodesByName[name]) {
                        tameNodesByName[name] = [];
                    }
                    tameNodesByName[name].push(tameNode);
                }
            }

            ___.forOwnKeys(
                tameNodesByName,
                ___.markFuncFreeze(function (name, tameNodes) {
                    if (tameNodes.length > 1) {
                        tamed[name] = fakeNodeList(tameNodes);
                        ___.grantRead(tamed, name);
                    } else {
                        tamed[name] = tameNodes[0];
                        ___.grantRead(tamed, name);
                    }
                }));

            tamed.namedItem = ___.markFuncFreeze(function(name) {
                name = String(name);
                if (name.charAt(name.length - 1) === '_') {
                    return null;
                }
                if (___.hasOwnProp(tamed, name)) {
                    return ___.passesGuard(TameNodeT, tamed[name])
                        ? tamed[name] : tamed[name][0];
                }
                return null;
            });
            ___.grantFunc(tamed, 'namedItem');

            return tamed;
        }

        function tameHTMLCollection(nodeList, editable, opt_tameNodeCtor) {
            return ___.freeze(
                mixinHTMLCollection([], nodeList, editable, opt_tameNodeCtor));
        }

        function tameGetElementsByTagName(rootNode, tagName, editable) {
            tagName = String(tagName);
            if (tagName !== '*') {
                tagName = tagName.toLowerCase();
                if (!___.hasOwnProp(html4.ELEMENTS, tagName)
                    || html4.ELEMENTS[tagName] & html4.ELEMENTS.UNSAFE) {
                    // Allowing getElementsByTagName to work for opaque element types
                    // would leak information about those elements.
                    return new fakeNodeList([]);
                }
            }
            return tameNodeList(
                rootNode.getElementsByTagName(tagName), editable, defaultTameNode);
        }

        /**
         * Implements http://www.whatwg.org/specs/web-apps/current-work/#dom-document-getelementsbyclassname
         * using an existing implementation on browsers that have one.
         */
        function tameGetElementsByClassName(rootNode, className, editable) {
            className = String(className);

            // The quotes below are taken from the HTML5 draft referenced above.

            // "having obtained the classes by splitting a string on spaces"
            // Instead of using split, we use match with the global modifier so that
            // we don't have to remove leading and trailing spaces.
            var classes = className.match(/[^\t\n\f\r ]+/g);

            // Filter out classnames in the restricted namespace.
            for (var i = classes ? classes.length : 0; --i >= 0;) {
                var classi = classes[i];
                if (FORBIDDEN_ID_PATTERN.test(classi)) {
                    classes[i] = classes[classes.length - 1];
                    --classes.length;
                }
            }

            if (!classes || classes.length === 0) {
                // "If there are no tokens specified in the argument, then the method
                //  must return an empty NodeList" [instead of all elements]
                // This means that
                //     htmlEl.ownerDocument.getElementsByClassName(htmlEl.className)
                // will return an HtmlCollection containing htmlElement iff
                // htmlEl.className contains a non-space character.
                return fakeNodeList([]);
            }

            // "unordered set of unique space-separated tokens representing classes"
            if (typeof rootNode.getElementsByClassName === 'function') {
                return tameNodeList(
                    rootNode.getElementsByClassName(
                        classes.join(' ')), editable, defaultTameNode);
            } else {
                // Add spaces around each class so that we can use indexOf later to find
                // a match.
                // This use of indexOf is strictly incorrect since
                // http://www.whatwg.org/specs/web-apps/current-work/#reflecting-content-attributes-in-dom-attributes
                // does not normalize spaces in unordered sets of unique space-separated
                // tokens.  This is not a problem since HTML5 compliant implementations
                // already have a getElementsByClassName implementation, and legacy
                // implementations do normalize according to comments on issue 935.

                // We assume standards mode, so the HTML5 requirement that
                //   "If the document is in quirks mode, then the comparisons for the
                //    classes must be done in an ASCII case-insensitive  manner,"
                // is not operative.
                var nClasses = classes.length;
                for (var i = nClasses; --i >= 0;) {
                    classes[i] = ' ' + classes[i] + ' ';
                }

                // We comply with the requirement that the result is a list
                //   "containing all the elements in the document, in tree order,"
                // since the spec for getElementsByTagName has the same language.
                var candidates = rootNode.getElementsByTagName('*');
                var matches = [];
                var limit = candidates.length;
                if (limit !== +limit) {
                    limit = 1 / 0;
                }  // See issue 935
                candidate_loop:
                    for (var j = 0, candidate, k = -1;
                         j < limit && (candidate = candidates[j]);
                         ++j) {
                        var candidateClass = ' ' + candidate.className + ' ';
                        for (var i = nClasses; --i >= 0;) {
                            if (-1 === candidateClass.indexOf(classes[i])) {
                                continue candidate_loop;
                            }
                        }
                        var tamed = defaultTameNode(candidate, editable);
                        if (tamed) {
                            matches[++k] = tamed;
                        }
                    }
                // "the method must return a live NodeList object"
                return fakeNodeList(matches);
            }
        }

        function makeEventHandlerWrapper(thisNode, listener) {
            classUtils.ensureValidCallback(listener);
            function wrapper(event) {
                return plugin_dispatchEvent___(
                    thisNode, event, ___.getId(imports), listener);
            }

            return wrapper;
        }

        var NOT_EDITABLE = "Node not editable.";
        var INVALID_SUFFIX = "Property names may not end in '__'.";
        var UNSAFE_TAGNAME = "Unsafe tag name.";
        var UNKNOWN_TAGNAME = "Unknown tag name.";
        var INDEX_SIZE_ERROR = "Index size error.";

        /**
         * Define a property with the given name on the given ctor's prototype that
         * is accessible to untrusted code.
         * @param {Function} ctor the ctor for the class to modify.
         * @param {string} name the name of the property to define.
         * @param {boolean} useAttrGetter true if the getter should delegate to
         *     {@code ctor.prototype.getAttribute}.  That method is assumed to
         *     already be trusted though {@code toValue} is still called on the
         *     result.
         *     If false, then {@code toValue} is called on the result of accessing
         *     the name property on the underlying element, a possibly untrusted
         *     value.
         * @param {Function} toValue transforms the attribute or underlying property
         *     value retrieved according to the useAttrGetter flag above to the
         *     value of the defined property.
         * @param {boolean} useAttrSetter like useAttrGetter but for a setter.
         *     Switches between the name property on the underlying node
         *     (the false case) or using ctor's {@code setAttribute} method
         *     (the true case).
         * @param {Function} fromValue called on the input before it is passed
         *     through according to the flag above.  This receives untrusted values,
         *     and can do any vetting or transformation.  If {@code useAttrSetter}
         *     is true then it need not do much value vetting since the
         *     {@code setAttribute} method must do its own vetting.
         */
        function defProperty(ctor, name, useAttrGetter, toValue, useAttrSetter, fromValue) {
            // Given the name foo, the suffix is Foo___ so we end up defining
            // inaccessible methods getFoo___ and setFoo__ on ctor's prototype below.
            var getterSetterSuffix = classUtils.getterSetterSuffix(name);
            var proto = ctor.prototype;
            if (toValue) {
                proto['get' + getterSetterSuffix] = useAttrGetter
                    ? function () {
                    return toValue.call(this, this.getAttribute(name));
                }
                    : function () {
                    return toValue.call(this, this.node___[name]);
                };
            }
            if (fromValue) {
                proto['set' + getterSetterSuffix] = useAttrSetter
                    ? function (value) {
                    this.setAttribute(name, fromValue.call(this, value));
                    return value;
                }
                    : function (value) {
                    if (!this.editable___) {
                        throw new Error(NOT_EDITABLE);
                    }
                    this.node___[name] = fromValue.call(this, value);
                    return value;
                };
            }
        }

        function defAttributeAlias(ctor, name, toValue, fromValue) {
            defProperty(ctor, name, true, toValue, true, fromValue);
        }

        // Implementation of EventTarget::addEventListener
        function tameAddEventListener(name, listener, useCapture) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            if (!this.wrappedListeners___) {
                this.wrappedListeners___ = [];
            }
            useCapture = Boolean(useCapture);
            var wrappedListener = makeEventHandlerWrapper(this.node___, listener);
            wrappedListener = bridal.addEventListener(
                this.node___, name, wrappedListener, useCapture);
            wrappedListener.originalListener___ = listener;
            this.wrappedListeners___.push(wrappedListener);
        }

        // Implementation of EventTarget::removeEventListener
        function tameRemoveEventListener(name, listener, useCapture) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            if (!this.wrappedListeners___) {
                return;
            }
            var wrappedListener = null;
            for (var i = this.wrappedListeners___.length; --i >= 0;) {
                if (this.wrappedListeners___[i].originalListener___ === listener) {
                    wrappedListener = this.wrappedListeners___[i];
                    arrayRemove(this.wrappedListeners___, i, i);
                    break;
                }
            }
            if (!wrappedListener) {
                return;
            }
            bridal.removeEventListener(
                this.node___, name, wrappedListener, useCapture);
        }

        // A map of tamed node classes, keyed by DOM Level 2 standard name, which
        // will be exposed to the client.
        var nodeClasses = {};

        function inertCtor(tamedCtor, someSuper, name) {
            return nodeClasses[name] = ___.extend(tamedCtor, someSuper, name);
        }

        var tameNodeFields = [
            'nodeType', 'nodeValue', 'nodeName', 'firstChild',
            'lastChild', 'nextSibling', 'previousSibling', 'parentNode',
            'ownerDocument', 'childNodes', 'attributes'];

        /**
         * Base class for a Node wrapper.  Do not create directly -- use the
         * tameNode factory instead.
         * @param {boolean} editable true if the node's value, attributes, children,
         *     or custom properties are mutable.
         * @constructor
         */
        function TameNode(editable) {
            this.editable___ = editable;
            TameNodeMark.stamp.mark___(this);
            classUtils.exportFields(this, tameNodeFields);
        }

        inertCtor(TameNode, Object, 'Node');
        TameNode.prototype.getOwnerDocument___ = function () {
            // TODO(mikesamuel): upward navigation breaks capability discipline.
            if (!this.editable___ && tameDocument.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            return tameDocument;
        };
        // abstract TameNode.prototype.getNodeType___
        // abstract TameNode.prototype.getNodeName___
        // abstract TameNode.prototype.getNodeValue___
        // abstract TameNode.prototype.cloneNode
        // abstract TameNode.prototype.appendChild
        // abstract TameNode.prototype.insertBefore
        // abstract TameNode.prototype.removeChild
        // abstract TameNode.prototype.replaceChild
        // abstract TameNode.prototype.getFirstChild___
        // abstract TameNode.prototype.getLastChild___
        // abstract TameNode.prototype.getNextSibling___
        // abstract TameNode.prototype.getPreviousSibling___
        // abstract TameNode.prototype.getParentNode___
        // abstract TameNode.prototype.getElementsByTagName
        // abstract TameNode.prototype.getElementsByClassName
        // abstract TameNode.prototype.getChildNodes___
        // abstract TameNode.prototype.getAttributes___
        var tameNodePublicMembers = [
            'cloneNode',
            'appendChild', 'insertBefore', 'removeChild', 'replaceChild',
            'getElementsByClassName', 'getElementsByTagName', 'dispatchEvent',
            'hasChildNodes'
        ];

        /**
         * A tame node that is backed by a real node.
         * @param {boolean} childrenEditable true iff the child list is mutable.
         * @constructor
         */
        function TameBackedNode(node, editable, childrenEditable) {
            if (!node) {
                throw new Error('Creating tame node with undefined native delegate');
            }
            this.node___ = node;
            this.childrenEditable___ = editable && childrenEditable;
            this.FERAL_TWIN___ = node;
            try {
                // bug 1330 IE<=8 doesn't allow arbitrary properties on text nodes,
                // so this can fail, but failures are mostly harmless.
                node.TAMED_TWIN___ = this;
            } catch (ex) {
                ___.log("Warning: couldn't set TAMED_TWIN___ for " + node);
            }
            TameNode.call(this, editable);
        }

        ___.extend(TameBackedNode, TameNode);
        TameBackedNode.prototype.getNodeType___ = function () {
            return this.node___.nodeType;
        };
        TameBackedNode.prototype.getNodeName___ = function () {
            return this.node___.nodeName;
        };
        TameBackedNode.prototype.getNodeValue___ = function () {
            return this.node___.nodeValue;
        };
        TameBackedNode.prototype.cloneNode = function (deep) {
            var clone = bridal.cloneNode(this.node___, Boolean(deep));
            // From http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-3A0ED0A4
            //     "Note that cloning an immutable subtree results in a mutable copy"
            return defaultTameNode(clone, true);
        };
        TameBackedNode.prototype.appendChild = function (child) {
            // Child must be editable since appendChild can remove it from its parent.
            child = TameNodeT.coerce(child);
            if (!this.childrenEditable___ || !child.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            this.node___.appendChild(child.node___);
            return child;
        };
        TameBackedNode.prototype.insertBefore = function (toInsert, child) {
            toInsert = TameNodeT.coerce(toInsert);
            if (child === void 0) {
                child = null;
            }
            if (child !== null) {
                child = TameNodeT.coerce(child);
                if (!child.editable___) {
                    throw new Error(NOT_EDITABLE);
                }
            }
            if (!this.childrenEditable___ || !toInsert.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            this.node___.insertBefore(
                toInsert.node___, child !== null ? child.node___ : null);
            return toInsert;
        };
        TameBackedNode.prototype.removeChild = function (child) {
            child = TameNodeT.coerce(child);
            if (!this.childrenEditable___ || !child.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            this.node___.removeChild(child.node___);
            return child;
        };
        TameBackedNode.prototype.replaceChild = function (newChild, oldChild) {
            newChild = TameNodeT.coerce(newChild);
            oldChild = TameNodeT.coerce(oldChild);
            if (!this.childrenEditable___ || !newChild.editable___
                || !oldChild.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            this.node___.replaceChild(newChild.node___, oldChild.node___);
            return oldChild;
        };
        TameBackedNode.prototype.getFirstChild___ = function () {
            return defaultTameNode(this.node___.firstChild, this.childrenEditable___);
        };
        TameBackedNode.prototype.getLastChild___ = function () {
            return defaultTameNode(this.node___.lastChild, this.childrenEditable___);
        };
        TameBackedNode.prototype.getNextSibling___ = function () {
            return tameRelatedNode(this.node___.nextSibling, this.editable___,
                defaultTameNode);
        };
        TameBackedNode.prototype.getPreviousSibling___ = function () {
            return tameRelatedNode(this.node___.previousSibling, this.editable___,
                defaultTameNode);
        };
        TameBackedNode.prototype.getParentNode___ = function () {
            return tameRelatedNode(
                this.node___.parentNode, this.editable___, defaultTameNode);
        };
        TameBackedNode.prototype.getElementsByTagName = function (tagName) {
            return tameGetElementsByTagName(
                this.node___, tagName, this.childrenEditable___);
        };
        TameBackedNode.prototype.getElementsByClassName = function (className) {
            return tameGetElementsByClassName(
                this.node___, className, this.childrenEditable___);
        };
        TameBackedNode.prototype.getChildNodes___ = function () {
            return tameNodeList(
                this.node___.childNodes, this.childrenEditable___, defaultTameNode);
        };
        TameBackedNode.prototype.getAttributes___ = function () {
            var thisNode = this.node___;
            var tameNodeCtor = function(node, editable) {
                return new TameBackedAttributeNode(node, editable, thisNode);
            };
            return tameNodeList(
                this.node___.attributes, this.editable___, tameNodeCtor);
        };
        var endsWith__ = /__$/;
        // TODO(erights): Come up with some notion of a keeper chain so we can
        // say, "let every other keeper try to handle this first".
        TameBackedNode.prototype.handleRead___ = function (name) {
            name = String(name);
            if (endsWith__.test(name)) {
                return void 0;
            }
            if (classUtils.hasGetHandler(this, name)) {
                return this.v___(name);
            }
            if (classUtils.hasGetHandler(this, name.toLowerCase())) {
                return this.v___(name.toLowerCase());
            }
            if (___.hasOwnProp(this.node___.properties___, name)) {
                return this.node___.properties___[name];
            } else {
                return void 0;
            }
        };
        TameBackedNode.prototype.handleCall___ = function (name, args) {
            name = String(name);
            if (endsWith__.test(name)) {
                throw new Error(INVALID_SUFFIX);
            }
            var handlerName = name + '_handler___';
            if (this[handlerName]) {
                return this[handlerName].call(this, args);
            }
            handlerName = handlerName.toLowerCase();
            if (this[handlerName]) {
                return this[handlerName].call(this, args);
            }
            if (___.hasOwnProp(this.node___.properties___, name)) {
                return this.node___.properties___[name].call(this, args);
            } else {
                throw new TypeError(name + ' is not a function.');
            }
        };
        TameBackedNode.prototype.handleSet___ = function (name, val) {
            name = String(name);
            if (endsWith__.test(name)) {
                throw new Error(INVALID_SUFFIX);
            }
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            if (classUtils.hasSetHandler(this, name)) {
                return this.w___(name, val);
            }
            if (classUtils.hasSetHandler(this, name.toLowerCase())) {
                return this.w___(name.toLowerCase(), val);
            }
            if (!this.node___.properties___) {
                this.node___.properties___ = {};
            }
            this[name + '_c___'] = this;
            this[name + '_v___'] = false;
            this[name + '_e___'] = this;
            return this.node___.properties___[name] = val;
        };
        TameBackedNode.prototype.handleDelete___ = function (name) {
            name = String(name);
            if (endsWith__.test(name)) {
                throw new Error(INVALID_SUFFIX);
            }
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            var handlerName = name + '_deleter___';
            if (this[handlerName]) {
                return this[handlerName]();
            }
            handlerName = handlerName.toLowerCase();
            if (this[handlerName]) {
                return this[handlerName]();
            }
            if (this.node___.properties___) {
                return (
                    delete this.node___.properties___[name]
                        && delete this[name + '_c___']
                        && delete this[name + '_e___']
                        && delete this[name + '_v___']);
            } else {
                return true;
            }
        };
        /**
         * @param {boolean} ownFlag ignored
         */
        TameBackedNode.prototype.handleEnum___ = function (ownFlag) {
            // TODO(metaweta): Add code to list all the other handled stuff we know
            // about.
            if (this.node___.properties___) {
                return ___.allKeys(this.node___.properties___);
            }
            return [];
        };
        TameBackedNode.prototype.hasChildNodes = function () {
            return !!this.node___.hasChildNodes();
        };
        // http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget :
        // "The EventTarget interface is implemented by all Nodes"
        TameBackedNode.prototype.dispatchEvent = function dispatchEvent(evt) {
            evt = TameEventT.coerce(evt);
            bridal.dispatchEvent(this.node___, evt.event___);
        };
        ___.all2(
            ___.grantTypedMethod, TameBackedNode.prototype, tameNodePublicMembers);
        if (document.documentElement.contains) {  // typeof is 'object' on IE
            TameBackedNode.prototype.contains = function (other) {
                other = TameNodeT.coerce(other);
                var otherNode = other.node___;
                return this.node___.contains(otherNode);
            };
        }
        if ('function' ===
            typeof document.documentElement.compareDocumentPosition) {
            /**
             * Speced in <a href="http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition">DOM-Level-3</a>.
             */
            TameBackedNode.prototype.compareDocumentPosition = function (other) {
                other = TameNodeT.coerce(other);
                var otherNode = other.node___;
                if (!otherNode) {
                    return 0;
                }
                var bitmask = +this.node___.compareDocumentPosition(otherNode);
                // To avoid leaking information about the relative positioning of
                // different roots, if neither contains the other, then we mask out
                // the preceding/following bits.
                // 0x18 is (CONTAINS | CONTAINED)
                // 0x1f is all the bits documented at
                //     http://www.w3.org/TR/DOM-Level-3-Core/core.html#DocumentPosition
                //     except IMPLEMENTATION_SPECIFIC
                // 0x01 is DISCONNECTED
                /*
                 if (!(bitmask & 0x18)) {
                 // TODO: If they are not under the same virtual doc root, return
                 // DOCUMENT_POSITION_DISCONNECTED instead of leaking information
                 // about PRECEDING | FOLLOWING.
                 }
                 */
                // Firefox3 returns spurious PRECEDING and FOLLOWING bits for
                // disconnected trees.
                // https://bugzilla.mozilla.org/show_bug.cgi?id=486002
                if (bitmask & 1) {
                    bitmask &= ~6;
                }
                return bitmask & 0x1f;
            };
            if (!___.hasOwnProp(TameBackedNode.prototype, 'contains')) {
                // http://www.quirksmode.org/blog/archives/2006/01/contains_for_mo.html
                TameBackedNode.prototype.contains = function (other) {
                    var docPos = this.compareDocumentPosition(other);
                    return !(!(docPos & 0x10) && docPos);
                };
            }
        }
        ___.all2(function (o, k) {
                if (___.hasOwnProp(o, k)) {
                    ___.grantTypedMethod(o, k);
                }
            }, TameBackedNode.prototype,
            ['contains', 'compareDocumentPosition']);

        /**
         * A fake node that is not backed by a real DOM node.
         * @constructor
         */
        function TamePseudoNode(editable) {
            TameNode.call(this, editable);
            this.properties___ = {};
            this.TAMED_TWIN___ = this.FERAL_TWIN___ = this;
        }

        ___.extend(TamePseudoNode, TameNode);
        TamePseudoNode.prototype.appendChild =
            TamePseudoNode.prototype.insertBefore =
                TamePseudoNode.prototype.removeChild =
                    TamePseudoNode.prototype.replaceChild = function () {
                        ___.log("Node not editable; no action performed.");
                        return void 0;
                    };
        TamePseudoNode.prototype.getFirstChild___ = function () {
            var children = this.getChildNodes___();
            return children.length ? children[0] : null;
        };
        TamePseudoNode.prototype.getLastChild___ = function () {
            var children = this.getChildNodes___();
            return children.length ? children[children.length - 1] : null;
        };
        TamePseudoNode.prototype.getNextSibling___ = function () {
            var parentNode = this.getParentNode___();
            if (!parentNode) {
                return null;
            }
            var siblings = parentNode.getChildNodes___();
            for (var i = siblings.length - 1; --i >= 0;) {
                if (siblings[i] === this) {
                    return siblings[i + 1];
                }
            }
            return null;
        };
        TamePseudoNode.prototype.getPreviousSibling___ = function () {
            var parentNode = this.getParentNode___();
            if (!parentNode) {
                return null;
            }
            var siblings = parentNode.getChildNodes___();
            for (var i = siblings.length; --i >= 1;) {
                if (siblings[i] === this) {
                    return siblings[i - 1];
                }
            }
            return null;
        };
        TamePseudoNode.prototype.handleRead___ = function (name) {
            name = String(name);
            if (endsWith__.test(name)) {
                return void 0;
            }
            var handlerName = name + '_getter___';
            if (this[handlerName]) {
                return this[handlerName]();
            }
            handlerName = handlerName.toLowerCase();
            if (this[handlerName]) {
                return this[handlerName]();
            }
            if (___.hasOwnProp(this.properties___, name)) {
                return this.properties___[name];
            } else {
                return void 0;
            }
        };
        TamePseudoNode.prototype.handleCall___ = function (name, args) {
            name = String(name);
            if (endsWith__.test(name)) {
                throw new Error(INVALID_SUFFIX);
            }
            var handlerName = name + '_handler___';
            if (this[handlerName]) {
                return this[handlerName].call(this, args);
            }
            handlerName = handlerName.toLowerCase();
            if (this[handlerName]) {
                return this[handlerName].call(this, args);
            }
            if (___.hasOwnProp(this.properties___, name)) {
                return this.properties___[name].call(this, args);
            } else {
                throw new TypeError(name + ' is not a function.');
            }
        };
        TamePseudoNode.prototype.handleSet___ = function (name, val) {
            name = String(name);
            if (endsWith__.test(name)) {
                throw new Error(INVALID_SUFFIX);
            }
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            var handlerName = name + '_setter___';
            if (this[handlerName]) {
                return this[handlerName](val);
            }
            handlerName = handlerName.toLowerCase();
            if (this[handlerName]) {
                return this[handlerName](val);
            }
            if (!this.properties___) {
                this.properties___ = {};
            }
            this[name + '_c___'] = this;
            this[name + '_v___'] = false;
            this[name + '_e___'] = this;
            return this.properties___[name] = val;
        };
        TamePseudoNode.prototype.handleDelete___ = function (name) {
            name = String(name);
            if (endsWith__.test(name)) {
                throw new Error(INVALID_SUFFIX);
            }
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            var handlerName = name + '_deleter___';
            if (this[handlerName]) {
                return this[handlerName]();
            }
            handlerName = handlerName.toLowerCase();
            if (this[handlerName]) {
                return this[handlerName]();
            }
            if (this.properties___) {
                return (
                    delete this.properties___[name]
                        && delete this[name + '_c___']
                        && delete this[name + '_e___']
                        && delete this[name + '_v___']);
            } else {
                return true;
            }
        };
        TamePseudoNode.prototype.handleEnum___ = function (ownFlag) {
            // TODO(metaweta): Add code to list all the other handled stuff we know
            // about.
            if (this.properties___) {
                return ___.allKeys(this.properties___);
            }
            return [];
        };
        TamePseudoNode.prototype.hasChildNodes = function () {
            return this.getFirstChild___() != null;
        };
        ___.all2(
            ___.grantTypedMethod, TamePseudoNode.prototype, tameNodePublicMembers);

        var commonElementPropertyHandlers = {
            clientWidth: {
                get: function () {
                    return this.getGeometryDelegate___().clientWidth;
                }
            },
            clientHeight: {
                get: function () {
                    return this.getGeometryDelegate___().clientHeight;
                }
            },
            offsetLeft: {
                get: function () {
                    return this.getGeometryDelegate___().offsetLeft;
                }
            },
            offsetTop: {
                get: function () {
                    return this.getGeometryDelegate___().offsetTop;
                }
            },
            offsetWidth: {
                get: function () {
                    return this.getGeometryDelegate___().offsetWidth;
                }
            },
            offsetHeight: {
                get: function () {
                    return this.getGeometryDelegate___().offsetHeight;
                }
            },
            scrollLeft: {
                get: function () {
                    return this.getGeometryDelegate___().scrollLeft;
                },
                set: function (x) {
                    if (!this.editable___) {
                        throw new Error(NOT_EDITABLE);
                    }
                    this.getGeometryDelegate___().scrollLeft = +x;
                    return x;
                }
            },
            scrollTop: {
                get: function () {
                    return this.getGeometryDelegate___().scrollTop;
                },
                set: function (y) {
                    if (!this.editable___) {
                        throw new Error(NOT_EDITABLE);
                    }
                    this.getGeometryDelegate___().scrollTop = +y;
                    return y;
                }
            },
            scrollWidth: {
                get: function () {
                    return this.getGeometryDelegate___().scrollWidth;
                }
            },
            scrollHeight: {
                get: function () {
                    return this.getGeometryDelegate___().scrollHeight;
                }
            }
        };

        function TamePseudoElement(tagName, tameDoc, childNodesGetter, parentNodeGetter, innerHTMLGetter, geometryDelegate, editable) {
            TamePseudoNode.call(this, editable);
            this.tagName___ = tagName;
            this.tameDoc___ = tameDoc;
            this.childNodesGetter___ = childNodesGetter;
            this.parentNodeGetter___ = parentNodeGetter;
            this.innerHTMLGetter___ = innerHTMLGetter;
            this.geometryDelegate___ = geometryDelegate;
            classUtils.exportFields(this, ['tagName', 'innerHTML']);
            classUtils.applyAccessors(this, commonElementPropertyHandlers);
        }

        ___.extend(TamePseudoElement, TamePseudoNode);
        // TODO(mikesamuel): make nodeClasses work.
        TamePseudoElement.prototype.getNodeType___ = function () {
            return 1;
        };
        TamePseudoElement.prototype.getNodeName___
            = TamePseudoElement.prototype.getTagName___
            = function () {
            return this.tagName___;
        };
        TamePseudoElement.prototype.getNodeValue___ = function () {
            return null;
        };
        TamePseudoElement.prototype.getAttribute
            = function (attribName) {
            return null;
        };
        TamePseudoElement.prototype.setAttribute
            = function (attribName, value) {
        };
        TamePseudoElement.prototype.hasAttribute
            = function (attribName) {
            return false;
        };
        TamePseudoElement.prototype.removeAttribute
            = function (attribName) {
        };
        TamePseudoElement.prototype.getOwnerDocument___
            = function () {
            return this.tameDoc___;
        };
        TamePseudoElement.prototype.getChildNodes___
            = function () {
            return this.childNodesGetter___();
        };
        TamePseudoElement.prototype.getAttributes___
            = function () {
            return tameNodeList([], false, undefined);
        };
        TamePseudoElement.prototype.getParentNode___
            = function () {
            return this.parentNodeGetter___();
        };
        TamePseudoElement.prototype.getInnerHTML___
            = function () {
            return this.innerHTMLGetter___();
        };
        TamePseudoElement.prototype.getElementsByTagName = function (tagName) {
            tagName = String(tagName).toLowerCase();
            if (tagName === this.tagName___) {
                // Works since html, head, body, and title can't contain themselves.
                return fakeNodeList([]);
            }
            return this.getOwnerDocument___().getElementsByTagName(tagName);
        };
        TamePseudoElement.prototype.getElementsByClassName = function (className) {
            return this.getOwnerDocument___().getElementsByClassName(className);
        };
        TamePseudoElement.prototype.getBoundingClientRect = function () {
            return this.geometryDelegate___.getBoundingClientRect();
        };
        TamePseudoElement.prototype.getGeometryDelegate___ = function () {
            return this.geometryDelegate___;
        };
        TamePseudoElement.prototype.toString = ___.markFuncFreeze(function () {
            return '<' + this.tagName___ + '>';
        });
        ___.all2(___.grantTypedMethod, TamePseudoElement.prototype,
            ['getAttribute', 'setAttribute',
                'hasAttribute', 'removeAttribute',
                'getBoundingClientRect', 'getElementsByTagName']);

        function TameOpaqueNode(node, editable) {
            TameBackedNode.call(this, node, editable, editable);
        }

        ___.extend(TameOpaqueNode, TameBackedNode);
        TameOpaqueNode.prototype.getNodeValue___
            = TameBackedNode.prototype.getNodeValue___;
        TameOpaqueNode.prototype.getNodeType___
            = TameBackedNode.prototype.getNodeType___;
        TameOpaqueNode.prototype.getNodeName___
            = TameBackedNode.prototype.getNodeName___;
        TameOpaqueNode.prototype.getNextSibling___
            = TameBackedNode.prototype.getNextSibling___;
        TameOpaqueNode.prototype.getPreviousSibling___
            = TameBackedNode.prototype.getPreviousSibling___;
        TameOpaqueNode.prototype.getFirstChild___
            = TameBackedNode.prototype.getFirstChild___;
        TameOpaqueNode.prototype.getLastChild___
            = TameBackedNode.prototype.getLastChild___;
        TameOpaqueNode.prototype.getParentNode___
            = TameBackedNode.prototype.getParentNode___;
        TameOpaqueNode.prototype.getChildNodes___
            = TameBackedNode.prototype.getChildNodes___;
        TameOpaqueNode.prototype.getOwnerDocument___
            = TameBackedNode.prototype.getOwnerDocument___;
        TameOpaqueNode.prototype.getElementsByTagName
            = TameBackedNode.prototype.getElementsByTagName;
        TameOpaqueNode.prototype.getElementsByClassName
            = TameBackedNode.prototype.getElementsByClassName;
        TameOpaqueNode.prototype.hasChildNodes
            = TameBackedNode.prototype.hasChildNodes;
        TameOpaqueNode.prototype.getAttributes___
            = function () {
            return tameNodeList([], false, undefined);
        };
        for (var i = tameNodePublicMembers.length; --i >= 0;) {
            var k = tameNodePublicMembers[i];
            if (!TameOpaqueNode.prototype.hasOwnProperty(k)) {
                TameOpaqueNode.prototype[k] = ___.markFuncFreeze(function () {
                    throw new Error('Node is opaque');
                });
            }
        }
        ___.all2(
            ___.grantTypedMethod, TameOpaqueNode.prototype, tameNodePublicMembers);

        function TameTextNode(node, editable) {
            assert(node.nodeType === 3);

            // The below should not be strictly necessary since childrenEditable for
            // TameScriptElements is always false, but it protects against tameNode
            // being called naively on a text node from container code.
            var pn = node.parentNode;
            if (editable && pn) {
                if (1 === pn.nodeType
                    && (html4.ELEMENTS[pn.tagName.toLowerCase()]
                    & html4.eflags.UNSAFE)) {
                    // Do not allow mutation of text inside script elements.
                    // See the testScriptLoading testcase for examples of exploits.
                    editable = false;
                }
            }

            TameBackedNode.call(this, node, editable, editable);
            classUtils.exportFields(
                this, ['nodeValue', 'data', 'textContent', 'innerText']);
        }

        inertCtor(TameTextNode, TameBackedNode, 'Text');
        TameTextNode.prototype.setNodeValue___ = function (value) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            this.node___.nodeValue = String(value || '');
            return value;
        };
        TameTextNode.prototype.getTextContent___
            = TameTextNode.prototype.getInnerText___
            = TameTextNode.prototype.getData___
            = TameTextNode.prototype.getNodeValue___;
        TameTextNode.prototype.setTextContent___
            = TameTextNode.prototype.setInnerText___
            = TameTextNode.prototype.setData___
            = TameTextNode.prototype.setNodeValue___;
        TameTextNode.prototype.toString = ___.markFuncFreeze(function () {
            return '#text';
        });

        function TameCommentNode(node, editable) {
            assert(node.nodeType === 8);
            TameBackedNode.call(this, node, editable, editable);
        }

        inertCtor(TameCommentNode, TameBackedNode, 'CommentNode');
        TameCommentNode.prototype.toString = ___.markFuncFreeze(function () {
            return '#comment';
        });

        function lookupAttribute(map, tagName, attribName) {
            var attribKey;
            attribKey = tagName + '::' + attribName;
            if (map.hasOwnProperty(attribKey)) {
                return map[attribKey];
            }
            attribKey = '*::' + attribName;
            if (map.hasOwnProperty(attribKey)) {
                return map[attribKey];
            }
            return void 0;
        }

        function getAttributeType(tagName, attribName) {
            return lookupAttribute(html4.ATTRIBS, tagName, attribName);
        }

        function getLoaderType(tagName, attribName) {
            return lookupAttribute(html4.LOADERTYPES, tagName, attribName);
        }

        function getUriEffect(tagName, attribName) {
            return lookupAttribute(html4.URIEFFECTS, tagName, attribName);
        }

        /**
         * Plays the role of an Attr node for TameElement objects.
         */
        function TameBackedAttributeNode(node, editable, ownerElement) {
            TameBackedNode.call(this, node, editable);
            this.ownerElement___ = ownerElement;
            classUtils.exportFields(this,
                ['name', 'specified', 'value', 'ownerElement']);
        }

        inertCtor(TameBackedAttributeNode, TameBackedNode, 'Attr');
        TameBackedAttributeNode.prototype.getNodeName___ =
            TameBackedAttributeNode.prototype.getName___ =
                function () {
                    return String(this.node___.name);
                };
        TameBackedAttributeNode.prototype.getSpecified___ = function () {
            return defaultTameNode(this.ownerElement___, this.editable___)
                .hasAttribute(this.getName___());
        };
        TameBackedAttributeNode.prototype.getNodeValue___ =
            TameBackedAttributeNode.prototype.getValue___ = function () {
                return defaultTameNode(this.ownerElement___, this.editable___)
                    .getAttribute(this.getName___());
            };
        TameBackedAttributeNode.prototype.setNodeValue___ =
            TameBackedAttributeNode.prototype.setValue___ = function (value) {
                return defaultTameNode(this.ownerElement___, this.editable___)
                    .setAttribute(this.getName___(), value);
            };
        TameBackedAttributeNode.prototype.getOwnerElement___ = function () {
            return defaultTameNode(this.ownerElement___, this.editable___);
        };
        TameBackedAttributeNode.prototype.getNodeType___ = function () {
            return 2;
        };
        TameBackedAttributeNode.prototype.cloneNode = function (deep) {
            var clone = bridal.cloneNode(this.node___, Boolean(deep));
            // From http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-3A0ED0A4
            //     "Note that cloning an immutable subtree results in a mutable copy"
            return new TameBackedAttributeNode(clone, true, this.ownerElement____);
        };
        TameBackedAttributeNode.prototype.appendChild =
            TameBackedAttributeNode.prototype.insertBefore =
                TameBackedAttributeNode.prototype.removeChild =
                    TameBackedAttributeNode.prototype.replaceChild =
                        TameBackedAttributeNode.prototype.getFirstChild___ =
                            TameBackedAttributeNode.prototype.getLastChild___ =
                                TameBackedAttributeNode.prototype.getNextSibling___ =
                                    TameBackedAttributeNode.prototype.getPreviousSibling___ =
                                        TameBackedAttributeNode.prototype.getParentNode___ =
                                            TameBackedAttributeNode.prototype.getElementsByTagName =
                                                TameBackedAttributeNode.prototype.getElementsByClassName =
                                                    TameBackedAttributeNode.prototype.getChildNodes___ =
                                                        TameBackedAttributeNode.prototype.getAttributes___ = function () {
                                                            throw new Error("Not implemented.");
                                                        };
        TameBackedAttributeNode.prototype.toString =
            ___.markFuncFreeze(function () {
                return '[Fake attribute node]';
            });

        // Register set handlers for onclick, onmouseover, etc.
        function registerElementScriptAttributeHandlers(aTameElement) {
            var attrNameRe = /::(.*)/;
            for (var html4Attrib in html4.ATTRIBS) {
                if (html4.atype.SCRIPT === html4.ATTRIBS[html4Attrib]) {
                    (function (attribName) {
                        ___.useSetHandler(
                            aTameElement,
                            attribName,
                            function eventHandlerSetter(listener) {
                                if (!this.editable___) {
                                    throw new Error(NOT_EDITABLE);
                                }
                                if (!listener) {  // Clear the current handler
                                    this.node___[attribName] = null;
                                } else {
                                    // This handler cannot be copied from one node to another
                                    // which is why getters are not yet supported.
                                    this.node___[attribName] = makeEventHandlerWrapper(
                                        this.node___, listener);
                                }
                                return listener;
                            });
                    })(html4Attrib.match(attrNameRe)[1]);
                }
            }
        }

        function TameElement(node, editable, childrenEditable) {
            assert(node.nodeType === 1);
            TameBackedNode.call(this, node, editable, childrenEditable);
            classUtils.exportFields(
                this,
                ['className', 'id', 'innerHTML', 'tagName', 'style',
                    'offsetParent', 'title', 'dir', 'innerText', 'textContent']);
            classUtils.applyAccessors(this, commonElementPropertyHandlers);
            registerElementScriptAttributeHandlers(this);
        }

        nodeClasses.Element = inertCtor(TameElement, TameBackedNode, 'HTMLElement');
        TameElement.prototype.blur = function () {
            this.node___.blur();
        };
        TameElement.prototype.focus = function () {
            if (imports.isProcessingEvent___) {
                this.node___.focus();
            }
        };
        // IE-specific method.  Sets the element that will have focus when the
        // window has focus, without focusing the window.
        if (document.documentElement.setActive) {
            TameElement.prototype.setActive = function () {
                if (imports.isProcessingEvent___) {
                    this.node___.setActive();
                }
            };
            ___.grantTypedMethod(TameElement.prototype, 'setActive');
        }
        // IE-specific method.
        if (document.documentElement.hasFocus) {
            TameElement.prototype.hasFocus = function () {
                return this.node___.hasFocus();
            };
            ___.grantTypedMethod(TameElement.prototype, 'hasFocus');
        }
        defAttributeAlias(TameElement, 'id', defaultToEmptyStr, identity);
        TameElement.prototype.getAttribute = function (attribName) {
            attribName = String(attribName).toLowerCase();
            var tagName = this.node___.tagName.toLowerCase();
            var atype = getAttributeType(tagName, attribName);
            if (atype === void 0) {
                // Unrecognized attribute; use virtual map
                if (this.node___.attributes___) {
                    return this.node___.attributes___[attribName] || null;
                }
                return null;
            }
            var value = bridal.getAttribute(this.node___, attribName);
            if ('string' !== typeof value) {
                return value;
            }
            return virtualizeAttributeValue(atype, value);
        };
        TameElement.prototype.getAttributeNode = function (name) {
            var hostDomNode = this.node___.getAttributeNode(name);
            if (hostDomNode === null) {
                return null;
            }
            return new TameBackedAttributeNode(
                hostDomNode, this.editable___, this.node___);
        };
        TameElement.prototype.hasAttribute = function (attribName) {
            attribName = String(attribName).toLowerCase();
            var tagName = this.node___.tagName.toLowerCase();
            var atype = getAttributeType(tagName, attribName);
            if (atype === void 0) {
                // Unrecognized attribute; use virtual map
                return !!(
                    this.node___.attributes___ &&
                        ___.hasOwnProp(this.node___.attributes___, attribName));
            } else {
                return bridal.hasAttribute(this.node___, attribName);
            }
        };
        TameElement.prototype.setAttribute = function (attribName, value) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            attribName = String(attribName).toLowerCase();
            var tagName = this.node___.tagName.toLowerCase();
            var atype = getAttributeType(tagName, attribName);
            if (atype === void 0) {
                // Unrecognized attribute; use virtual map
                if (!this.node___.attributes___) {
                    this.node___.attributes___ = {};
                }
                this.node___.attributes___[attribName] = String(value);
            } else {
                var sanitizedValue = rewriteAttribute(
                    tagName, attribName, atype, value);
                if (sanitizedValue !== null) {
                    bridal.setAttribute(this.node___, attribName, sanitizedValue);
                }
            }
            return value;
        };
        TameElement.prototype.removeAttribute = function (attribName) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            attribName = String(attribName).toLowerCase();
            var tagName = this.node___.tagName.toLowerCase();
            var atype = getAttributeType(tagName, attribName);
            if (atype === void 0) {
                // Unrecognized attribute; use virtual map
                if (this.node___.attributes___) {
                    delete this.node___.attributes___[attribName];
                }
            } else {
                this.node___.removeAttribute(attribName);
            }
        };
        function simpleProp(o, name, value) {
            o.DefineOwnProperty___(name, {
                value: value,
                writable: true,
                enumerable: true,
                configurable: true
            });
        }

        TameElement.prototype.getBoundingClientRect = function () {
            var elRect = bridal.getBoundingClientRect(this.node___);
            var vbody = bridal.getBoundingClientRect(
                this.getOwnerDocument___().body___);
            var vbodyLeft = vbody.left, vbodyTop = vbody.top;
            var r = {};
            simpleProp(r, 'top', elRect.top - vbodyTop);
            simpleProp(r, 'left', elRect.left - vbodyLeft);
            simpleProp(r, 'right', elRect.right - vbodyLeft);
            simpleProp(r, 'bottom', elRect.bottom - vbodyTop);
            return r;
        };
        TameElement.prototype.getClassName___ = function () {
            return this.getAttribute('class') || '';
        };
        TameElement.prototype.setClassName___ = function (classes) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            return this.setAttribute('class', String(classes));
        };
        function defaultToEmptyStr(x) {
            return x || '';
        }

        defAttributeAlias(TameElement, 'title', defaultToEmptyStr, String);
        defAttributeAlias(TameElement, 'dir', defaultToEmptyStr, String);
        function innerTextOf(rawNode, out) {
            switch (rawNode.nodeType) {
                case 1:  // Element
                    var tagName = rawNode.tagName.toLowerCase();
                    if (html4.ELEMENTS.hasOwnProperty(tagName)
                        && !(html4.ELEMENTS[tagName] & html4.eflags.UNSAFE)) {
                        // Not an opaque node.
                        for (var c = rawNode.firstChild; c; c = c.nextSibling) {
                            innerTextOf(c, out);
                        }
                    }
                    break;
                case 3:  // Text Node
                case 4:  // CDATA Section Node
                    out[out.length] = rawNode.data;
                    break;
                case 11:  // Document Fragment
                    for (var c = rawNode.firstChild; c; c = c.nextSibling) {
                        innerTextOf(c, out);
                    }
                    break;
            }
        }

        TameElement.prototype.getTextContent___
            = TameElement.prototype.getInnerText___
            = function () {
            var text = [];
            innerTextOf(this.node___, text);
            return text.join('');
        };
        TameElement.prototype.setTextContent___
            = TameElement.prototype.setInnerText___
            = function (newText) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            var newTextStr = newText != null ? String(newText) : '';
            var el = this.node___;
            for (var c; (c = el.firstChild);) {
                el.removeChild(c);
            }
            if (newTextStr) {
                el.appendChild(el.ownerDocument.createTextNode(newTextStr));
            }
            return newText;
        };
        TameElement.prototype.getTagName___
            = TameBackedNode.prototype.getNodeName___;
        TameElement.prototype.getInnerHTML___ = function () {
            var tagName = this.node___.tagName.toLowerCase();
            if (!html4.ELEMENTS.hasOwnProperty(tagName)) {
                return '';  // unknown node
            }
            var flags = html4.ELEMENTS[tagName];
            var innerHtml = this.node___.innerHTML;
            if (flags & html4.eflags.CDATA) {
                innerHtml = html.escapeAttrib(innerHtml);
            } else if (flags & html4.eflags.RCDATA) {
                // Make sure we return PCDATA.
                // For RCDATA we only need to escape & if they're not part of an entity.
                innerHtml = html.normalizeRCData(innerHtml);
            } else {
                // If we blessed the resulting HTML, then this would round trip better
                // but it would still not survive appending, and it would propagate
                // event handlers where the setter of innerHTML does not expect it to.
                innerHtml = tameInnerHtml(innerHtml);
            }
            return innerHtml;
        };
        TameElement.prototype.setInnerHTML___ = function (htmlFragment) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            var tagName = this.node___.tagName.toLowerCase();
            if (!html4.ELEMENTS.hasOwnProperty(tagName)) {
                throw new Error();
            }
            var flags = html4.ELEMENTS[tagName];
            if (flags & html4.eflags.UNSAFE) {
                throw new Error();
            }
            var isRcData = flags & html4.eflags.RCDATA;
            var htmlFragmentString;
            if (!isRcData && htmlFragment instanceof Html) {
                htmlFragmentString = '' + safeHtml(htmlFragment);
            } else if (htmlFragment === null) {
                htmlFragmentString = '';
            } else {
                htmlFragmentString = '' + htmlFragment;
            }
            var sanitizedHtml;
            if (isRcData) {
                sanitizedHtml = html.normalizeRCData(htmlFragmentString);
            } else {
                sanitizedHtml = sanitizeHtml(htmlFragmentString);
            }
            this.node___.innerHTML = sanitizedHtml;
            return htmlFragment;
        };
        function identity(x) {
            return x;
        }

        defProperty(
            TameElement, 'style',
            false,
            function (styleNode) {
                return new TameStyle(styleNode, this.editable___, this);
            },
            true, identity);
        TameElement.prototype.updateStyle = function (style) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            var cssPropertiesAndValues = cssSealerUnsealerPair.unseal(style);
            if (!cssPropertiesAndValues) {
                throw new Error();
            }

            var styleNode = this.node___.style;
            for (var i = 0; i < cssPropertiesAndValues.length; i += 2) {
                var propName = cssPropertiesAndValues[i];
                var propValue = cssPropertiesAndValues[i + 1];
                // If the propertyName differs between DOM and CSS, there will
                // be a semicolon between the two.
                // E.g., 'background-color;backgroundColor'
                // See CssTemplate.toPropertyValueList.
                var semi = propName.indexOf(';');
                if (semi >= 0) {
                    propName = propName.substring(semi + 1);
                }
                styleNode[propName] = propValue;
            }
        };

        TameElement.prototype.getOffsetParent___ = function () {
            return tameRelatedNode(
                this.node___.offsetParent, this.editable___, defaultTameNode);
        };
        TameElement.prototype.getGeometryDelegate___ = function () {
            return this.node___;
        };
        TameElement.prototype.toString = ___.markFuncFreeze(function () {
            return '<' + this.node___.tagName + '>';
        });
        TameElement.prototype.addEventListener = tameAddEventListener;
        TameElement.prototype.removeEventListener = tameRemoveEventListener;
        ___.all2(
            ___.grantTypedMethod, TameElement.prototype,
            ['addEventListener', 'removeEventListener',
                'blur', 'focus',
                'getAttribute', 'setAttribute',
                'removeAttribute', 'hasAttribute',
                'getAttributeNode',
                'getBoundingClientRect',
                'updateStyle']);

        function TameAElement(node, editable) {
            TameElement.call(this, node, editable, editable);
            classUtils.exportFields(this, ['href']);
        }

        inertCtor(TameAElement, TameElement, 'HTMLAnchorElement');
        defProperty(TameAElement, 'href', false, identity, true, identity);

        // http://dev.w3.org/html5/spec/Overview.html#the-canvas-element
        var TameCanvasElement = (function() {
            function isFont(value) {
                return typeof(value) == "string" && css.properties.font.test(value);
            }

            function isColor(value) {
                // Note: we're testing against the pattern for the CSS "color:"
                // property, but what is actually referenced by the draft canvas spec is
                // the CSS syntactic element <color>, which is why we need to
                // specifically exclude "inherit".
                return typeof(value) == "string" && css.properties.color.test(value) &&
                    value !== "inherit";
            }

            var colorNameTable = {
                // http://dev.w3.org/csswg/css3-color/#html4 as cited by
                // http://dev.w3.org/html5/2dcontext/#dom-context-2d-fillstyle
                // TODO(kpreid): avoid duplication with table in CssRewriter.java
                " black":   "#000000",
                " silver":  "#c0c0c0",
                " gray":    "#808080",
                " white":   "#ffffff",
                " maroon":  "#800000",
                " red":     "#ff0000",
                " purple":  "#800080",
                " fuchsia": "#ff00ff",
                " green":   "#008000",
                " lime":    "#00ff00",
                " olive":   "#808000",
                " yellow":  "#ffff00",
                " navy":    "#000080",
                " blue":    "#0000ff",
                " teal":    "#008080",
                " aqua":    "#00ffff"
            };

            function StringTest(strings) {
                var table = {};
                // The table itself as a value is a marker to avoid running into
                // Object.prototype properties.
                for (var i = strings.length; --i >= 0;) {
                    table[strings[i]] = table;
                }
                return ___.markFuncFreeze(function (string) {
                    return typeof string === 'string' && table[string] === table;
                });
            }

            function canonColor(colorString) {
                // http://dev.w3.org/html5/2dcontext/ says the color shall be returned
                // only as #hhhhhh, not as names.
                return colorNameTable[" " + colorString] || colorString;
            }

            function TameImageData(imageData) {
                // Since we can't interpose indexing, we can't wrap the CanvasPixelArray
                // so we have to copy the pixel data. This is horrible, bad, and awful.
                var tameImageData = {
                    toString: ___.markFuncFreeze(function () {
                        return "[Domita Canvas ImageData]";
                    }),
                    width: ___.enforceType(imageData.width, "number"),
                    height: ___.enforceType(imageData.height, "number"),

                    // used to unwrap for passing to putImageData
                    bare___: imageData,

                    // lazily constructed tame copy, backs .data accessor; also used to
                    // test whether we need to write-back the copy before a putImageData
                    tamePixelArray___: undefined
                };
                ___.tamesTo(imageData, tameImageData);
                TameImageDataMark.stamp.mark___(tameImageData);
                classUtils.applyAccessors(tameImageData, {
                    data: {
                        // Accessor used so we don't need to copy if the client is just
                        // blitting (getImageData -> putImageData) rather than inspecting
                        // the pixels.
                        get: ___.markFuncFreeze(function () {
                            if (!tameImageData.tamePixelArray___) {
                                var bareArray = imageData.data;
                                var length = bareArray.length;
                                var tamePixelArray = { // not frozen, user-modifiable
                                    // TODO: Investigate whether it would be an optimization to
                                    // make this an array with properties added.
                                    toString: ___.markFuncFreeze(function () {
                                        return "[Domita CanvasPixelArray]";
                                    }),
                                    canvas_writeback___: function () {
                                        // This is invoked just before each putImageData
                                        for (var i = length - 1; i >= 0; i--) {
                                            bareArray[i] = tamePixelArray[i];
                                        }
                                    }
                                };
                                for (var i = length - 1; i >= 0; i--) {
                                    tamePixelArray[i] = bareArray[i];
                                }
                                tameImageData.tamePixelArray___ = tamePixelArray;
                            }
                            return tameImageData.tamePixelArray___;
                        })
                    }
                });
                return ___.primFreeze(tameImageData);
            }

            function TameGradient(gradient) {
                var tameGradient = {
                    toString: ___.markFuncFreeze(function () {
                        return "[Domita CanvasGradient]";
                    }),
                    addColorStop: ___.markFuncFreeze(function (offset, color) {
                        ___.enforceType(offset, 'number', 'color stop offset');
                        if (!(0 <= offset && offset <= 1)) {
                            throw new Error(INDEX_SIZE_ERROR);
                            // TODO(kpreid): should be a DOMException per spec
                        }
                        if (!isColor(color)) {
                            throw new Error("SYNTAX_ERR");
                            // TODO(kpreid): should be a DOMException per spec
                        }
                        gradient.addColorStop(offset, color);
                    })
                };
                ___.tamesTo(gradient, tameGradient);
                TameGradientMark.stamp.mark___(tameGradient);
                return ___.primFreeze(tameGradient);
            }

            function enforceFinite(value, name) {
                ___.enforceType(value, 'number', name);
                if (!isFinite(value)) {
                    throw new Error("NOT_SUPPORTED_ERR");
                    // TODO(kpreid): should be a DOMException per spec
                }
            }

            function TameCanvasElement(node, editable) {
                TameElement.call(this, node, editable, editable);
                classUtils.exportFields(
                    this,
                    ['height', 'width']);

                // helpers for tame context
                var context = node.getContext('2d');

                function tameFloatsOp(count, verb) {
                    return ___.markFuncFreeze(function () {
                        if (arguments.length !== count) {
                            throw new Error(verb + ' takes ' + count + ' args, not ' +
                                arguments.length);
                        }
                        for (var i = 0; i < count; i++) {
                            ___.enforceType(arguments[i], 'number', verb + ' argument ' + i);
                        }
                        context[verb].apply(context, arguments);
                    });
                }

                function tameRectMethod(m, hasResult) {
                    return ___.markFuncFreeze(function (x, y, w, h) {
                        if (arguments.length !== 4) {
                            throw new Error(m + ' takes 4 args, not ' +
                                arguments.length);
                        }
                        ___.enforceType(x, 'number', 'x');
                        ___.enforceType(y, 'number', 'y');
                        ___.enforceType(w, 'number', 'width');
                        ___.enforceType(h, 'number', 'height');
                        if (hasResult) {
                            return m.call(context, x, y, w, h);
                        } else {
                            m.call(context, x, y, w, h);
                        }
                    });
                }

                function tameDrawText(m) {
                    return ___.markFuncFreeze(function (text, x, y, maxWidth) {
                        ___.enforceType(text, 'string', 'text');
                        ___.enforceType(x, 'number', 'x');
                        ___.enforceType(y, 'number', 'y');
                        switch (arguments.length) {
                            case 3:
                                m.apply(context, arguments);
                                return;
                            case 4:
                                ___.enforceType(maxWidth, 'number', 'maxWidth');
                                m.apply(context, arguments);
                                return;
                            default:
                                throw new Error(m + ' cannot accept ' + arguments.length +
                                    ' arguments');
                        }
                    });
                }

                function tameGetMethod(prop) {
                    return ___.markFuncFreeze(function () {
                        return context[prop];
                    });
                }

                function tameSetMethod(prop, validator) {
                    return ___.markFuncFreeze(function (newValue) {
                        if (validator(newValue)) {
                            context[prop] = newValue;
                        }
                        return newValue;
                    });
                }

                function tameGetStyleMethod(prop) {
                    return ___.markFuncFreeze(function () {
                        var value = context[prop];
                        if (typeof(value) == "string") {
                            return canonColor(value);
                        } else if (___.passesGuard(TameGradientT, ___.tame(value))) {
                            return ___.tame(value);
                        } else {
                            throw("Internal: Can't tame value " + value + " of " + prop);
                        }
                    });
                }

                function tameSetStyleMethod(prop) {
                    return ___.markFuncFreeze(function (newValue) {
                        if (isColor(newValue)) {
                            context[prop] = newValue;
                        } else if (typeof(newValue) === "object" &&
                            ___.passesGuard(TameGradientT, newValue)) {
                            context[prop] = ___.untame(newValue);
                        } // else do nothing
                        return newValue;
                    });
                }

                function tameSimpleOp(m) {  // no return value
                    return ___.markFuncFreeze(function () {
                        if (arguments.length !== 0) {
                            throw new Error(m + ' takes no args, not ' + arguments.length);
                        }
                        m.call(context);
                    });
                }

                // Design note: We generally reject the wrong number of arguments,
                // unlike default JS behavior. This is because we are just passing data
                // through to the underlying implementation, but we don't want to pass
                // on anything which might be an extension we don't know about, and it
                // is better to fail explicitly than to leave the client wondering about
                // why their extension usage isn't working.

                // http://dev.w3.org/html5/2dcontext/
                this.tameContext2d___ = {
                    toString: ___.markFuncFreeze(function () {
                        return "[Domita CanvasRenderingContext2D]";
                    }),

                    save: tameSimpleOp(context.save),
                    restore: tameSimpleOp(context.restore),

                    scale: tameFloatsOp(2, 'scale'),
                    rotate: tameFloatsOp(1, 'rotate'),
                    translate: tameFloatsOp(2, 'translate'),
                    transform: tameFloatsOp(6, 'transform'),
                    setTransform: tameFloatsOp(6, 'setTransform'),

                    createLinearGradient: ___.markFuncFreeze(function (x0, y0, x1, y1) {
                        if (arguments.length !== 4) {
                            throw new Error('createLinearGradient takes 4 args, not ' +
                                arguments.length);
                        }
                        ___.enforceType(x0, 'number', 'x0');
                        ___.enforceType(y0, 'number', 'y0');
                        ___.enforceType(x1, 'number', 'x1');
                        ___.enforceType(y1, 'number', 'y1');
                        return TameGradient(context.createLinearGradient(x0, y0, x1, y1));
                    }),
                    createRadialGradient: ___.markFuncFreeze(function (x0, y0, r0, x1, y1, r1) {
                        if (arguments.length !== 6) {
                            throw new Error('createRadialGradient takes 6 args, not ' +
                                arguments.length);
                        }
                        ___.enforceType(x0, 'number', 'x0');
                        ___.enforceType(y0, 'number', 'y0');
                        ___.enforceType(r0, 'number', 'r0');
                        ___.enforceType(x1, 'number', 'x1');
                        ___.enforceType(y1, 'number', 'y1');
                        ___.enforceType(r1, 'number', 'r1');
                        return TameGradient(context.createRadialGradient(x0, y0, r0, x1, y1, r1));
                    }),

                    createPattern: ___.markFuncFreeze(function (imageElement, repetition) {
                        // Consider what policy to have wrt reading the pixels from image
                        // elements before implementing this.
                        throw new Error('Domita: canvas createPattern not yet implemented');
                    }),


                    clearRect:  tameRectMethod(context.clearRect, false),
                    fillRect:   tameRectMethod(context.fillRect, false),
                    strokeRect: tameRectMethod(context.strokeRect, false),

                    beginPath: tameSimpleOp(context.beginPath),
                    closePath: tameSimpleOp(context.closePath),
                    moveTo: tameFloatsOp(2, 'moveTo'),
                    lineTo: tameFloatsOp(2, 'lineTo'),
                    quadraticCurveTo: tameFloatsOp(4, 'quadraticCurveTo'),
                    bezierCurveTo: tameFloatsOp(6, 'bezierCurveTo'),
                    arcTo: tameFloatsOp(5, 'arcTo'),
                    rect: tameFloatsOp(4, 'rect'),
                    arc: ___.markFuncFreeze(function (x, y, radius, startAngle, endAngle, anticlockwise) {
                        if (arguments.length !== 6) {
                            throw new Error('arc takes 6 args, not ' + arguments.length);
                        }
                        ___.enforceType(x, 'number', 'x');
                        ___.enforceType(y, 'number', 'y');
                        ___.enforceType(radius, 'number', 'radius');
                        ___.enforceType(startAngle, 'number', 'startAngle');
                        ___.enforceType(endAngle, 'number', 'endAngle');
                        ___.enforceType(anticlockwise, 'boolean', 'anticlockwise');
                        if (radius < 0) {
                            throw new Error(INDEX_SIZE_ERROR);
                            // TODO(kpreid): should be a DOMException per spec
                        }
                        context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
                    }),
                    fill: tameSimpleOp(context.fill),
                    stroke: tameSimpleOp(context.stroke),
                    clip: tameSimpleOp(context.clip),

                    isPointInPath: ___.markFuncFreeze(function (x, y) {
                        ___.enforceType(x, 'number', 'x');
                        ___.enforceType(y, 'number', 'y');
                        return ___.enforceType(context.isPointInPath(x, y), 'boolean');
                    }),

                    fillText: tameDrawText(context.fillText),
                    strokeText: tameDrawText(context.strokeText),
                    measureText: ___.markFuncFreeze(function (string) {
                        if (arguments.length !== 1) {
                            throw new Error('measureText takes 1 arg, not ' + arguments.length);
                        }
                        ___.enforceType(string, 'string', 'measureText argument');
                        return context.measureText(string);
                    }),

                    drawImage: ___.markFuncFreeze(function (imageElement) {
                        // Consider what policy to have wrt reading the pixels from image
                        // elements before implementing this.
                        throw new Error('Domita: canvas drawImage not yet implemented');
                    }),

                    createImageData: ___.markFuncFreeze(function (sw, sh) {
                        if (arguments.length !== 2) {
                            throw new Error('createImageData takes 2 args, not ' +
                                arguments.length);
                        }
                        ___.enforceType(sw, 'number', 'sw');
                        ___.enforceType(sh, 'number', 'sh');
                        return TameImageData(context.createImageData(sw, sh));
                    }),
                    getImageData: tameRectMethod(function (sx, sy, sw, sh) {
                        return TameImageData(context.getImageData(sx, sy, sw, sh));
                    }, true),
                    putImageData: ___.markFuncFreeze(function
                        (tameImageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
                        tameImageData = TameImageDataT.coerce(tameImageData);
                        enforceFinite(dx, 'dx');
                        enforceFinite(dy, 'dy');
                        switch (arguments.length) {
                            case 3:
                                dirtyX = 0;
                                dirtyY = 0;
                                dirtyWidth = tameImageData.width;
                                dirtyHeight = tameImageData.height;
                                break;
                            case 7:
                                enforceFinite(dirtyX, 'dirtyX');
                                enforceFinite(dirtyY, 'dirtyY');
                                enforceFinite(dirtyWidth, 'dirtyWidth');
                                enforceFinite(dirtyHeight, 'dirtyHeight');
                                break;
                            default:
                                throw 'putImageData cannot accept ' + arguments.length +
                                    ' arguments';
                        }
                        if (tameImageData.tamePixelArray___) {
                            tameImageData.tamePixelArray___.canvas_writeback___();
                        }
                        context.putImageData(tameImageData.bare___, dx, dy, dirtyX, dirtyY,
                            dirtyWidth, dirtyHeight);
                    })
                };

                if ("drawFocusRing" in context) {
                    this.tameContext2d___.drawFocusRing = ___.markFuncFreeze(function
                        (tameElement, x, y, canDrawCustom) {
                        switch (arguments.length) {
                            case 3:
                                canDrawCustom = false;
                                break;
                            case 4:
                                break;
                            default:
                                throw 'drawFocusRing cannot accept ' + arguments.length +
                                    ' arguments';
                        }
                        tameElement = TameNodeT.coerce(tameElement);
                        ___.enforceType(x, 'number', 'x');
                        ___.enforceType(y, 'number', 'y');
                        ___.enforceType(canDrawCustom, 'boolean', 'canDrawCustom');

                        // On safety of using the untamed node here: The only information
                        // drawFocusRing takes from the node is whether it is focused.
                        return ___.enforceType(
                            context.drawFocusRing(tameElement.node___, x, y, canDrawCustom),
                            'boolean');
                    });
                }

                classUtils.applyAccessors(this.tameContext2d___, {
                    // We filter the values supplied to setters in case some browser
                    // extension makes them more powerful, e.g. containing scripting or a
                    // URL.
                    // TODO(kpreid): Do we want to filter the *getters* as well? Scenarios:
                    // (a) canvas shared with innocent code, (b) browser quirks?? If we do,
                    // then what should be done with a bad value?
                    globalAlpha: {
                        get: tameGetMethod('globalAlpha'),
                        set: tameSetMethod('globalAlpha',
                            function (v) {
                                return typeof v === "number" &&
                                    0.0 <= v && v <= 1.0;
                            })
                    },
                    globalCompositeOperation: {
                        get: tameGetMethod('globalCompositeOperation'),
                        set: tameSetMethod('globalCompositeOperation',
                            StringTest([
                                "source-atop",
                                "source-in",
                                "source-out",
                                "source-over",
                                "destination-atop",
                                "destination-in",
                                "destination-out",
                                "destination-over",
                                "lighter",
                                "copy",
                                "xor"
                            ]))
                    },
                    strokeStyle: {
                        get: tameGetStyleMethod('strokeStyle'),
                        set: tameSetStyleMethod('strokeStyle')
                    },
                    fillStyle: {
                        get: tameGetStyleMethod('fillStyle'),
                        set: tameSetStyleMethod('fillStyle')
                    },
                    lineWidth: {
                        get: tameGetMethod('lineWidth'),
                        set: tameSetMethod('lineWidth',
                            function (v) {
                                return typeof v === "number" &&
                                    0.0 < v && v !== Infinity;
                            })
                    },
                    lineCap: {
                        get: tameGetMethod('lineCap'),
                        set: tameSetMethod('lineCap', StringTest([
                            "butt",
                            "round",
                            "square"
                        ]))
                    },
                    lineJoin: {
                        get: tameGetMethod('lineJoin'),
                        set: tameSetMethod('lineJoin', StringTest([
                            "bevel",
                            "round",
                            "miter"
                        ]))
                    },
                    miterLimit: {
                        get: tameGetMethod('miterLimit'),
                        set: tameSetMethod('miterLimit',
                            function (v) {
                                return typeof v === "number" &&
                                    0 < v && v !== Infinity;
                            })
                    },
                    shadowOffsetX: {
                        get: tameGetMethod('shadowOffsetX'),
                        set: tameSetMethod('shadowOffsetX',
                            function (v) {
                                return typeof v === "number" && isFinite(v);
                            })
                    },
                    shadowOffsetY: {
                        get: tameGetMethod('shadowOffsetY'),
                        set: tameSetMethod('shadowOffsetY',
                            function (v) {
                                return typeof v === "number" && isFinite(v);
                            })
                    },
                    shadowBlur: {
                        get: tameGetMethod('shadowBlur'),
                        set: tameSetMethod('shadowBlur',
                            function (v) {
                                return typeof v === "number" &&
                                    0.0 <= v && v !== Infinity;
                            })
                    },
                    shadowColor: {
                        get: tameGetStyleMethod('shadowColor'),
                        set: tameSetMethod('shadowColor', isColor)
                    },

                    font: {
                        get: tameGetMethod('font'),
                        set: tameSetMethod('font', isFont)
                    },
                    textAlign: {
                        get: tameGetMethod('textAlign'),
                        set: tameSetMethod('textAlign', StringTest([
                            "start",
                            "end",
                            "left",
                            "right",
                            "center"
                        ]))
                    },
                    textBaseline: {
                        get: tameGetMethod('textBaseline'),
                        set: tameSetMethod('textBaseline', StringTest([
                            "top",
                            "hanging",
                            "middle",
                            "alphabetic",
                            "ideographic",
                            "bottom"
                        ]))
                    }
                });
                ___.primFreeze(this.tameContext2d___);
            }  // end of TameCanvasElement
            inertCtor(TameCanvasElement, TameElement, 'HTMLCanvasElement');
            TameCanvasElement.prototype.getContext = function (contextId) {

                // TODO(kpreid): We can refine this by inventing a ReadOnlyCanvas object
                // to return in this situation, which allows getImageData and so on but
                // not any drawing. Not bothering to do that for now; if you have a use
                // for it let us know.
                if (!this.editable___) {
                    throw new Error(NOT_EDITABLE);
                }

                ___.enforceType(contextId, 'string', 'contextId');
                switch (contextId) {
                    case '2d':
                        return this.tameContext2d___;
                    default:
                        // http://dev.w3.org/html5/spec/the-canvas-element.html#the-canvas-element
                        // says: The getContext(contextId, args...) method of the canvas
                        // element, when invoked, must run the following steps:
                        // [...]
                        //     If contextId is not the name of a context supported by the
                        //     user agent, return null and abort these steps.
                        //
                        // However, Mozilla throws and WebKit returns undefined instead.
                        // Returning undefined rather than null is closer to the spec than
                        // throwing.
                        return undefined;
                        throw new Error('Unapproved canvas contextId');
                }
            };
            defProperty(TameCanvasElement, 'height', false, identity, false, Number);
            defProperty(TameCanvasElement, 'width', false, identity, false, Number);
            ___.all2(___.grantTypedMethod, TameCanvasElement.prototype,
                ['getContext']);

            return TameCanvasElement;
        })();

        // http://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-40002357
        function TameFormElement(node, editable) {
            TameElement.call(this, node, editable, editable);
            this.length = node.length;
            classUtils.exportFields(
                this, ['action', 'elements', 'enctype', 'method', 'target']);
        }

        inertCtor(TameFormElement, TameElement, 'HTMLFormElement');
        TameFormElement.prototype.handleRead___ = function (name) {
            name = String(name);
            if (endsWith__.test(name)) {
                return void 0;
            }
            // TODO(ihab.awad): Due to the following bug:
            //     http://code.google.com/p/google-caja/issues/detail?id=997
            // the read handlers get called on the *prototypes* as well as the
            // instances on which they are installed. In that case, we just
            // defer to the super handler, which works for now.
            if (___.passesGuard(TameNodeT, this)) {
                var tameElements = this.getElements___();
                if (___.hasOwnProp(tameElements, name)) {
                    return tameElements[name];
                }
            }
            return TameBackedNode.prototype.handleRead___.call(this, name);
        };
        TameFormElement.prototype.submit = function () {
            return this.node___.submit();
        };
        TameFormElement.prototype.reset = function () {
            return this.node___.reset();
        };
        defAttributeAlias(TameFormElement, 'action', defaultToEmptyStr, String);
        TameFormElement.prototype.getElements___ = function () {
            return tameHTMLCollection(
                this.node___.elements, this.editable___, defaultTameNode);
        };
        defAttributeAlias(TameFormElement, 'enctype', defaultToEmptyStr, String);
        defAttributeAlias(TameFormElement, 'method', defaultToEmptyStr, String);
        defAttributeAlias(TameFormElement, 'target', defaultToEmptyStr, String);
        TameFormElement.prototype.reset = function () {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            this.node___.reset();
        };
        TameFormElement.prototype.submit = function () {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            this.node___.submit();
        };
        ___.all2(___.grantTypedMethod, TameFormElement.prototype,
            ['reset', 'submit']);


        function TameInputElement(node, editable) {
            TameElement.call(this, node, editable, editable);
            classUtils.exportFields(
                this,
                ['form', 'value', 'defaultValue',
                    'checked', 'disabled', 'readOnly',
                    'options', 'selected', 'selectedIndex',
                    'name', 'accessKey', 'tabIndex', 'text',
                    'defaultChecked', 'defaultSelected', 'maxLength',
                    'size', 'type', 'index', 'label',
                    'multiple', 'cols', 'rows']);
        }

        inertCtor(TameInputElement, TameElement, 'HTMLInputElement');
        defProperty(TameInputElement, 'checked', false, identity, false, Boolean);
        defProperty(
            TameInputElement, 'defaultChecked', false, identity, false, identity);
        defProperty(
            TameInputElement, 'value',
            false, function (x) {
                return x == null ? null : String(x);
            },
            false, function (x) {
                return x == null ? '' : '' + x;
            });
        defProperty(
            TameInputElement, 'defaultValue',
            false, function (x) {
                return x == null ? null : String(x);
            },
            false, function (x) {
                return x == null ? '' : '' + x;
            });
        TameInputElement.prototype.select = function () {
            this.node___.select();
        };
        TameInputElement.prototype.getForm___ = function () {
            return tameRelatedNode(
                this.node___.form, this.editable___, defaultTameNode);
        };
        defProperty(TameInputElement, 'disabled', false, identity, false, identity);
        defProperty(TameInputElement, 'readOnly', false, identity, false, identity);
        TameInputElement.prototype.getOptions___ = function () {
            return tameOptionsList(
                this.node___.options, this.editable___, defaultTameNode, 'name');
        };
        defProperty(
            TameInputElement, 'selected', false, identity, false, identity);
        defProperty(
            TameInputElement, 'defaultSelected', false, identity, false, Boolean);
        function toInt(x) {
            return x | 0;
        }

        defProperty(
            TameInputElement, 'selectedIndex', false, identity, false, toInt);
        defProperty(TameInputElement, 'name', false, identity, false, identity);
        defProperty(
            TameInputElement, 'accessKey', false, identity, false, identity);
        defProperty(TameInputElement, 'tabIndex', false, identity, false, identity);
        defProperty(TameInputElement, 'text', false, String);
        defProperty(
            TameInputElement, 'maxLength', false, identity, false, identity);
        defProperty(TameInputElement, 'size', false, identity, false, identity);
        defProperty(TameInputElement, 'type', false, identity, false, identity);
        defProperty(TameInputElement, 'index', false, identity, false, identity);
        defProperty(TameInputElement, 'label', false, identity, false, identity);
        defProperty(TameInputElement, 'multiple', false, identity, false, identity);
        defProperty(TameInputElement, 'cols', false, identity, false, identity);
        defProperty(TameInputElement, 'rows', false, identity, false, identity);
        ___.all2(___.grantTypedMethod, TameInputElement.prototype, ['select']);


        function TameImageElement(node, editable) {
            TameElement.call(this, node, editable, editable);
            classUtils.exportFields(this, ['src', 'alt']);
        }

        inertCtor(TameImageElement, TameElement, 'HTMLImageElement');
        defProperty(TameImageElement, 'src', false, identity, true, identity);
        defProperty(TameImageElement, 'alt', false, identity, false, String);

        function TameLabelElement(node, editable) {
            TameElement.call(this, node, editable, editable);
            classUtils.exportFields(this, ['htmlFor']);
        }

        inertCtor(TameLabelElement, TameElement, 'HTMLLabelElement');
        TameLabelElement.prototype.getHtmlFor___ = function () {
            return this.getAttribute('for');
        };
        TameLabelElement.prototype.setHtmlFor___ = function (id) {
            this.setAttribute('for', id);
            return id;
        };

        /**
         * A script element wrapper that allows setting of a src that has been
         * rewritten by a URI policy, but not modifying of textual content.
         */
        function TameScriptElement(node, editable) {
            // Make the child list immutable so that text content can't be added
            // or removed.
            TameElement.call(this, node, editable, false);
            classUtils.exportFields(this, ['src']);
        }

        inertCtor(TameScriptElement, TameElement, 'HTMLScriptElement');
        defProperty(TameScriptElement, 'src', false, identity, true, identity);

        function TameIFrameElement(node, editable) {
            // Make the child list immutable so that text content can't be added
            // or removed.
            TameElement.call(this, node, editable, false);
            classUtils.exportFields(
                this,
                ['align', 'frameBorder', 'height', 'width']);
        }

        inertCtor(TameIFrameElement, TameElement, "HTMLIFrameElement");
        TameIFrameElement.prototype.getAlign___ = function () {
            return this.node___.align;
        };
        TameIFrameElement.prototype.setAlign___ = function (alignment) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            alignment = String(alignment);
            if (alignment === 'left' ||
                alignment === 'right' ||
                alignment === 'center') {
                this.node___.align = alignment;
            }
        };
        TameIFrameElement.prototype.getAttribute = function(attr) {
            var attrLc = String(attr).toLowerCase();
            if (attrLc !== 'name' && attrLc !== 'src') {
                return TameElement.prototype.getAttribute.call(this, attr);
            }
            return null;
        };
        TameIFrameElement.prototype.setAttribute = function(attr, value) {
            var attrLc = String(attr).toLowerCase();
            // The 'name' and 'src' attributes are whitelisted for all tags in
            // html4-attributes-whitelist.json, since they're needed on tags
            // like <img>.  Because there's currently no way to filter attributes
            // based on the tag, we have to blacklist these two here.
            if (attrLc !== 'name' && attrLc !== 'src') {
                return TameElement.prototype.setAttribute.call(this, attr, value);
            }
            ___.log('Cannot set the [' + attrLc + '] attribute of an iframe.');
            return value;
        };
        TameIFrameElement.prototype.getFrameBorder___ = function () {
            return this.node___.frameBorder;
        };
        TameIFrameElement.prototype.setFrameBorder___ = function (border) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            border = String(border).toLowerCase();
            if (border === '0' || border === '1' ||
                border === 'no' || border === 'yes') {
                this.node___.frameBorder = border;
            }
        };
        defProperty(TameIFrameElement, 'height', false, identity, false, Number);
        defProperty(TameIFrameElement, 'width', false, identity, false, Number);
        TameIFrameElement.prototype.handleRead___ = function (name) {
            var nameLc = String(name).toLowerCase();
            if (nameLc !== 'src' && nameLc !== 'name') {
                return TameElement.prototype.handleRead___.call(this, name);
            }
            return undefined;
        };
        TameIFrameElement.prototype.handleSet___ = function (name, value) {
            var nameLc = String(name).toLowerCase();
            if (nameLc !== 'src' && nameLc !== 'name') {
                return TameElement.prototype.handleSet___.call(this, name, value);
            }
            ___.log('Cannot set the [' + nameLc + '] property of an iframe.');
            return value;
        };
        ___.all2(___.grantTypedMethod, TameIFrameElement.prototype,
            ['getAttribute', 'setAttribute']);


        function TameTableCompElement(node, editable) {
            TameElement.call(this, node, editable, editable);
            classUtils.exportFields(
                this,
                ['colSpan', 'cells', 'cellIndex', 'rowSpan', 'rows', 'rowIndex',
                    'align', 'vAlign', 'nowrap', 'sectionRowIndex']);
        }

        ___.extend(TameTableCompElement, TameElement);
        defProperty(
            TameTableCompElement, 'colSpan', false, identity, false, identity);
        TameTableCompElement.prototype.getCells___ = function () {
            return tameNodeList(
                this.node___.cells, this.editable___, defaultTameNode);
        };
        TameTableCompElement.prototype.getCellIndex___ = function () {
            return this.node___.cellIndex;
        };
        defProperty(
            TameTableCompElement, 'rowSpan', false, identity, false, identity);
        TameTableCompElement.prototype.getRows___ = function () {
            return tameNodeList(this.node___.rows, this.editable___, defaultTameNode);
        };
        TameTableCompElement.prototype.getRowIndex___ = function () {
            return this.node___.rowIndex;
        };
        TameTableCompElement.prototype.getSectionRowIndex___ = function () {
            return this.node___.sectionRowIndex;
        };
        defProperty(
            TameTableCompElement, 'align', false, identity, false, identity);
        defProperty(
            TameTableCompElement, 'vAlign', false, identity, false, identity);
        defProperty(
            TameTableCompElement, 'nowrap', false, identity, false, identity);
        TameTableCompElement.prototype.insertRow = function (index) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            requireIntIn(index, -1, this.node___.rows.length);
            return defaultTameNode(this.node___.insertRow(index), this.editable___);
        };
        TameTableCompElement.prototype.deleteRow = function (index) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            requireIntIn(index, -1, this.node___.rows.length);
            this.node___.deleteRow(index);
        };
        ___.all2(___.grantTypedMethod, TameTableCompElement.prototype,
            ['insertRow', 'deleteRow']);

        function requireIntIn(idx, min, max) {
            if (idx !== (idx | 0) || idx < min || idx > max) {
                throw new Error(INDEX_SIZE_ERROR);
            }
        }

        function TameTableRowElement(node, editable) {
            TameTableCompElement.call(this, node, editable);
        }

        inertCtor(TameTableRowElement, TameTableCompElement, 'HTMLTableRowElement');
        TameTableRowElement.prototype.insertCell = function (index) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            requireIntIn(index, -1, this.node___.cells.length);
            return defaultTameNode(
                this.node___.insertCell(index),
                this.editable___);
        };
        TameTableRowElement.prototype.deleteCell = function (index) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            requireIntIn(index, -1, this.node___.cells.length);
            this.node___.deleteCell(index);
        };
        ___.all2(___.grantTypedMethod, TameTableRowElement.prototype,
            ['insertCell', 'deleteCell']);

        function TameTableElement(node, editable) {
            TameTableCompElement.call(this, node, editable);
            classUtils.exportFields(
                this,
                ['tBodies', 'tHead', 'tFoot', 'cellPadding', 'cellSpacing', 'border']
            );
        }

        inertCtor(TameTableElement, TameTableCompElement, 'HTMLTableElement');
        TameTableElement.prototype.getTBodies___ = function () {
            return tameNodeList(
                this.node___.tBodies, this.editable___, defaultTameNode);
        };
        TameTableElement.prototype.getTHead___ = function () {
            return defaultTameNode(this.node___.tHead, this.editable___);
        };
        TameTableElement.prototype.getTFoot___ = function () {
            return defaultTameNode(this.node___.tFoot, this.editable___);
        };
        TameTableElement.prototype.createTHead = function () {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            return defaultTameNode(this.node___.createTHead(), this.editable___);
        };
        TameTableElement.prototype.deleteTHead = function () {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            this.node___.deleteTHead();
        };
        TameTableElement.prototype.createTFoot = function () {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            return defaultTameNode(this.node___.createTFoot(), this.editable___);
        };
        TameTableElement.prototype.deleteTFoot = function () {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            this.node___.deleteTFoot();
        };
        TameTableElement.prototype.createCaption = function () {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            return defaultTameNode(this.node___.createCaption(), this.editable___);
        };
        TameTableElement.prototype.deleteCaption = function () {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            this.node___.deleteCaption();
        };
        TameTableElement.prototype.insertRow = function (index) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            requireIntIn(index, -1, this.node___.rows.length);
            return defaultTameNode(this.node___.insertRow(index), this.editable___);
        };
        TameTableElement.prototype.deleteRow = function (index) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            requireIntIn(index, -1, this.node___.rows.length);
            this.node___.deleteRow(index);
        };
        function fromInt(x) {
            return '' + (x | 0);
        }  // coerce null and false to 0
        defAttributeAlias(TameTableElement, 'cellPadding', Number, fromInt);
        defAttributeAlias(TameTableElement, 'cellSpacing', Number, fromInt);
        defAttributeAlias(TameTableElement, 'border', Number, fromInt);

        ___.all2(___.grantTypedMethod, TameTableElement.prototype,
            ['createTHead', 'deleteTHead', 'createTFoot', 'deleteTFoot',
                'createCaption', 'deleteCaption', 'insertRow', 'deleteRow']);

        function tameEvent(event) {
            if (event.TAMED_TWIN___) {
                return event.TAMED_TWIN___;
            }
            return new TameEvent(event);
        }

        function TameEvent(event) {
            assert(!!event);
            this.event___ = this.FERAL_TWIN___ = event;
            event.TAMED_TWIN___ = this;
            TameEventMark.stamp.mark___(this);
            classUtils.exportFields(
                this,
                ['type', 'target', 'pageX', 'pageY', 'altKey',
                    'ctrlKey', 'metaKey', 'shiftKey', 'button',
                    'screenX', 'screenY',
                    'currentTarget', 'relatedTarget',
                    'fromElement', 'toElement',
                    'srcElement',
                    'clientX', 'clientY', 'keyCode', 'which']);
        }

        inertCtor(TameEvent, Object, 'Event');
        TameEvent.prototype.getType___ = function () {
            return bridal.untameEventType(String(this.event___.type));
        };
        TameEvent.prototype.getTarget___ = function () {
            var event = this.event___;
            return tameRelatedNode(
                event.target || event.srcElement, true, defaultTameNode);
        };
        TameEvent.prototype.getSrcElement___ = function () {
            return tameRelatedNode(this.event___.srcElement, true, defaultTameNode);
        };
        TameEvent.prototype.getCurrentTarget___ = function () {
            var e = this.event___;
            return tameRelatedNode(e.currentTarget, true, defaultTameNode);
        };
        TameEvent.prototype.getRelatedTarget___ = function () {
            var e = this.event___;
            var t = e.relatedTarget;
            if (!t) {
                if (e.type === 'mouseout') {
                    t = e.toElement;
                } else if (e.type === 'mouseover') {
                    t = e.fromElement;
                }
            }
            return tameRelatedNode(t, true, defaultTameNode);
        };
        // relatedTarget is read-only.  this dummy setter is because some code
        // tries to workaround IE by setting a relatedTarget when it's not set.
        // code in a sandbox can't tell the difference between "falsey because
        // relatedTarget is not supported" and "falsey because relatedTarget is
        // outside sandbox".
        TameEvent.prototype.setRelatedTarget___ = function (newValue) {
            return newValue;
        };
        TameEvent.prototype.getFromElement___ = function () {
            return tameRelatedNode(this.event___.fromElement, true, defaultTameNode);
        };
        TameEvent.prototype.getToElement___ = function () {
            return tameRelatedNode(this.event___.toElement, true, defaultTameNode);
        };
        TameEvent.prototype.getPageX___ = function () {
            return Number(this.event___.pageX);
        };
        TameEvent.prototype.getPageY___ = function () {
            return Number(this.event___.pageY);
        };
        TameEvent.prototype.stopPropagation = function () {
            // TODO(mikesamuel): make sure event doesn't propagate to dispatched
            // events for this gadget only.
            // But don't allow it to stop propagation to the container.
            if (this.event___.stopPropagation) {
                this.event___.stopPropagation();
            } else {
                this.event___.cancelBubble = true;
            }
        };
        TameEvent.prototype.preventDefault = function () {
            // TODO(mikesamuel): make sure event doesn't propagate to dispatched
            // events for this gadget only.
            // But don't allow it to stop propagation to the container.
            if (this.event___.preventDefault) {
                this.event___.preventDefault();
            } else {
                this.event___.returnValue = false;
            }
        };
        TameEvent.prototype.getAltKey___ = function () {
            return Boolean(this.event___.altKey);
        };
        TameEvent.prototype.getCtrlKey___ = function () {
            return Boolean(this.event___.ctrlKey);
        };
        TameEvent.prototype.getMetaKey___ = function () {
            return Boolean(this.event___.metaKey);
        };
        TameEvent.prototype.getShiftKey___ = function () {
            return Boolean(this.event___.shiftKey);
        };
        TameEvent.prototype.getButton___ = function () {
            var e = this.event___;
            return e.button && Number(e.button);
        };
        TameEvent.prototype.getClientX___ = function () {
            return Number(this.event___.clientX);
        };
        TameEvent.prototype.getClientY___ = function () {
            return Number(this.event___.clientY);
        };
        TameEvent.prototype.getScreenX___ = function () {
            return Number(this.event___.screenX);
        };
        TameEvent.prototype.getScreenY___ = function () {
            return Number(this.event___.screenY);
        };
        TameEvent.prototype.getWhich___ = function () {
            var w = this.event___.which;
            return w && Number(w);
        };
        TameEvent.prototype.getKeyCode___ = function () {
            var kc = this.event___.keyCode;
            return kc && Number(kc);
        };
        TameEvent.prototype.toString =
            ___.markFuncFreeze(function () {
                return '[Fake Event]';
            });
        ___.all2(___.grantTypedMethod, TameEvent.prototype,
            ['stopPropagation', 'preventDefault']);

        function TameCustomHTMLEvent(event) {
            TameEvent.call(this, event);
            this.properties___ = {};
        }

        ___.extend(TameCustomHTMLEvent, TameEvent);
        TameCustomHTMLEvent.prototype.initEvent
            = function (type, bubbles, cancelable) {
            bridal.initEvent(this.event___, type, bubbles, cancelable);
        };
        TameCustomHTMLEvent.prototype.handleRead___ = function (name) {
            name = String(name);
            if (endsWith__.test(name)) {
                return void 0;
            }
            var handlerName = name + '_getter___';
            if (this[handlerName]) {
                return this[handlerName]();
            }
            if (___.hasOwnProp(this.event___.properties___, name)) {
                return this.event___.properties___[name];
            } else {
                return void 0;
            }
        };
        TameCustomHTMLEvent.prototype.handleCall___ = function (name, args) {
            name = String(name);
            if (endsWith__.test(name)) {
                throw new Error(INVALID_SUFFIX);
            }
            var handlerName = name + '_handler___';
            if (this[handlerName]) {
                return this[handlerName].call(this, args);
            }
            if (___.hasOwnProp(this.event___.properties___, name)) {
                return this.event___.properties___[name].call(this, args);
            } else {
                throw new TypeError(name + ' is not a function.');
            }
        };
        TameCustomHTMLEvent.prototype.handleSet___ = function (name, val) {
            name = String(name);
            if (endsWith__.test(name)) {
                throw new Error(INVALID_SUFFIX);
            }
            var handlerName = name + '_setter___';
            if (this[handlerName]) {
                return this[handlerName](val);
            }
            if (!this.event___.properties___) {
                this.event___.properties___ = {};
            }
            this[name + '_c___'] = this;
            this[name + '_v___'] = false;
            this[name + '_e___'] = this;
            return this.event___.properties___[name] = val;
        };
        TameCustomHTMLEvent.prototype.handleDelete___ = function (name) {
            name = String(name);
            if (endsWith__.test(name)) {
                throw new Error(INVALID_SUFFIX);
            }
            var handlerName = name + '_deleter___';
            if (this[handlerName]) {
                return this[handlerName]();
            }
            if (this.event___.properties___) {
                return (
                    delete this.event___.properties___[name]
                        && delete this[name + '_c___']
                        && delete this[name + '_e___']
                        && delete this[name + '_v___']);
            } else {
                return true;
            }
        };
        TameCustomHTMLEvent.prototype.handleEnum___ = function (ownFlag) {
            // TODO(metaweta): Add code to list all the other handled stuff we know
            // about.
            if (this.event___.properties___) {
                return ___.allKeys(this.event___.properties___);
            }
            return [];
        };
        TameCustomHTMLEvent.prototype.toString = ___.markFuncFreeze(function () {
            return '[Fake CustomEvent]';
        });
        ___.grantTypedMethod(TameCustomHTMLEvent.prototype, 'initEvent');

        function TameHTMLDocument(doc, body, domain, editable) {
            TamePseudoNode.call(this, editable);
            this.doc___ = doc;
            this.body___ = body;
            this.domain___ = domain;
            this.onLoadListeners___ = [];
            var tameDoc = this;

            var tameBody = defaultTameNode(body, editable);
            this.tameBody___ = tameBody;
            // TODO(mikesamuel): create a proper class for BODY, HEAD, and HTML along
            // with all the other specialized node types.
            var tameBodyElement = new TamePseudoElement(
                'BODY',
                this,
                function () {
                    return tameNodeList(body.childNodes, editable, defaultTameNode);
                },
                function () {
                    return tameHtmlElement;
                },
                function () {
                    return tameInnerHtml(body.innerHTML);
                },
                tameBody,
                editable);
            ___.forOwnKeys(
                { appendChild: 0, removeChild: 0, insertBefore: 0, replaceChild: 0 },
                ___.markFuncFreeze(function (k) {
                    tameBodyElement[k] = tameBody[k].bind(tameBody);
                    ___.grantFunc(tameBodyElement, k);
                }));

            var title = doc.createTextNode(body.getAttribute('title') || '');
            var tameTitleElement = new TamePseudoElement(
                'TITLE',
                this,
                function () {
                    return [defaultTameNode(title, false)];
                },
                function () {
                    return tameHeadElement;
                },
                function () {
                    return html.escapeAttrib(title.nodeValue);
                },
                null,
                editable);
            var tameHeadElement = new TamePseudoElement(
                'HEAD',
                this,
                function () {
                    return [tameTitleElement];
                },
                function () {
                    return tameHtmlElement;
                },
                function () {
                    return '<title>' + tameTitleElement.getInnerHTML___() + '</title>';
                },
                null,
                editable);
            var tameHtmlElement = new TamePseudoElement(
                'HTML',
                this,
                function () {
                    return [tameHeadElement, tameBodyElement];
                },
                function () {
                    return tameDoc;
                },
                function () {
                    return ('<head>' + tameHeadElement.getInnerHTML___()
                        + '<\/head><body>'
                        + tameBodyElement.getInnerHTML___() + '<\/body>');
                },
                tameBody,
                editable);
            if (body.contains) {  // typeof is 'object' on IE
                tameHtmlElement.contains = function (other) {
                    other = TameNodeT.coerce(other);
                    var otherNode = other.node___;
                    return body.contains(otherNode);
                };
                ___.grantFunc(tameHtmlElement, 'contains');
            }
            if ('function' === typeof body.compareDocumentPosition) {
                /**
                 * Speced in <a href="http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition">DOM-Level-3</a>.
                 */
                tameHtmlElement.compareDocumentPosition = function (other) {
                    other = TameNodeT.coerce(other);
                    var otherNode = other.node___;
                    if (!otherNode) {
                        return 0;
                    }
                    var bitmask = +body.compareDocumentPosition(otherNode);
                    // To avoid leaking information about the relative positioning of
                    // different roots, if neither contains the other, then we mask out
                    // the preceding/following bits.
                    // 0x18 is (CONTAINS | CONTAINED).
                    // 0x1f is all the bits documented at
                    // http://www.w3.org/TR/DOM-Level-3-Core/core.html#DocumentPosition
                    // except IMPLEMENTATION_SPECIFIC.
                    // 0x01 is DISCONNECTED.
                    /*
                     if (!(bitmask & 0x18)) {
                     // TODO: If they are not under the same virtual doc root, return
                     // DOCUMENT_POSITION_DISCONNECTED instead of leaking information
                     // about PRECEEDED | FOLLOWING.
                     }
                     */
                    return bitmask & 0x1f;
                };
                if (!___.hasOwnProp(tameHtmlElement, 'contains')) {
                    // http://www.quirksmode.org/blog/archives/2006/01/contains_for_mo.html
                    tameHtmlElement.contains = (function (other) {
                        var docPos = this.compareDocumentPosition(other);
                        return !(!(docPos & 0x10) && docPos);
                    }).bind(tameHtmlElement);
                    ___.grantFunc(tameHtmlElement, 'contains');
                }
                ___.grantFunc(tameHtmlElement, 'compareDocumentPosition');
            }
            this.documentElement___ = tameHtmlElement;
            classUtils.exportFields(
                this, ['documentElement', 'body', 'title', 'domain', 'forms',
                    'compatMode']);
        }

        inertCtor(TameHTMLDocument, TamePseudoNode, 'HTMLDocument');
        TameHTMLDocument.prototype.getNodeType___ = function () {
            return 9;
        };
        TameHTMLDocument.prototype.getNodeName___
            = function () {
            return '#document';
        };
        TameHTMLDocument.prototype.getNodeValue___ = function () {
            return null;
        };
        TameHTMLDocument.prototype.getChildNodes___
            = function () {
            return [this.documentElement___];
        };
        TameHTMLDocument.prototype.getAttributes___ = function () {
            return [];
        };
        TameHTMLDocument.prototype.getParentNode___ = function () {
            return null;
        };
        TameHTMLDocument.prototype.getElementsByTagName = function (tagName) {
            tagName = String(tagName).toLowerCase();
            switch (tagName) {
                case 'body':
                    return fakeNodeList([ this.getBody___() ]);
                case 'head':
                    return fakeNodeList([ this.getHead___() ]);
                case 'title':
                    return fakeNodeList([ this.getTitle___() ]);
                case 'html':
                    return fakeNodeList([ this.getDocumentElement___() ]);
                default:
                    var nodes = tameGetElementsByTagName(
                        this.body___, tagName, this.editable___);
                    if (tagName === '*') {
                        nodes.unshift(this.getBody___());
                        nodes.unshift(this.getTitle___());
                        nodes.unshift(this.getHead___());
                        nodes.unshift(this.getDocumentElement___());
                    }
                    return nodes;
            }
        };
        TameHTMLDocument.prototype.getDocumentElement___ = function () {
            return this.documentElement___;
        };
        TameHTMLDocument.prototype.getBody___ = function () {
            return this.documentElement___.getLastChild___();
        };
        TameHTMLDocument.prototype.getHead___ = function () {
            return this.documentElement___.getFirstChild___();
        };
        TameHTMLDocument.prototype.getTitle___ = function () {
            return this.getHead___().getFirstChild___();
        };
        TameHTMLDocument.prototype.getDomain___ = function () {
            return this.domain___;
        };
        TameHTMLDocument.prototype.getElementsByClassName = function (className) {
            return tameGetElementsByClassName(
                this.body___, className, this.editable___);
        };
        TameHTMLDocument.prototype.addEventListener =
            function (name, listener, useCapture) {
                return this.tameBody___.addEventListener(name, listener, useCapture);
            };
        TameHTMLDocument.prototype.removeEventListener =
            function (name, listener, useCapture) {
                return this.tameBody___.removeEventListener(
                    name, listener, useCapture);
            };
        TameHTMLDocument.prototype.createComment = function (text) {
            return defaultTameNode(this.doc___.createComment(" "), true);
        };
        TameHTMLDocument.prototype.createDocumentFragment = function () {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            return defaultTameNode(this.doc___.createDocumentFragment(), true);
        };
        TameHTMLDocument.prototype.createElement = function (tagName) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            tagName = String(tagName).toLowerCase();
            if (!html4.ELEMENTS.hasOwnProperty(tagName)) {
                throw new Error(UNKNOWN_TAGNAME + "[" + tagName + "]");
            }
            var flags = html4.ELEMENTS[tagName];
            // Script exemption allows dynamic loading of proxied scripts.
            if ((flags & html4.eflags.UNSAFE) && !(flags & html4.eflags.SCRIPT)) {
                ___.log(UNSAFE_TAGNAME + "[" + tagName + "]: no action performed");
                return null;
            }
            var newEl = this.doc___.createElement(tagName);
            if ("canvas" == tagName) {
                bridal.initCanvasElement(newEl);
            }
            if (elementPolicies.hasOwnProperty(tagName)) {
                var attribs = elementPolicies[tagName]([]);
                if (attribs) {
                    for (var i = 0; i < attribs.length; i += 2) {
                        bridal.setAttribute(newEl, attribs[i], attribs[i + 1]);
                    }
                }
            }
            return defaultTameNode(newEl, true);
        };
        TameHTMLDocument.prototype.createTextNode = function (text) {
            if (!this.editable___) {
                throw new Error(NOT_EDITABLE);
            }
            return defaultTameNode(this.doc___.createTextNode(
                text !== null && text !== void 0 ? '' + text : ''), true);
        };
        TameHTMLDocument.prototype.getElementById = function (id) {
            id += idSuffix;
            var node = this.doc___.getElementById(id);
            return defaultTameNode(node, this.editable___);
        };
        TameHTMLDocument.prototype.getForms___ = function () {
            var tameForms = [];
            for (var i = 0; i < this.doc___.forms.length; i++) {
                var tameForm = tameRelatedNode(
                    this.doc___.forms.item(i), this.editable___, defaultTameNode);
                // tameRelatedNode returns null if the node is not part of
                // this node's virtual document.
                if (tameForm !== null) {
                    tameForms.push(tameForm);
                }
            }
            return fakeNodeList(tameForms);
        };
        TameHTMLDocument.prototype.getCompatMode___ = function () {
            return 'CSS1Compat';
        };
        TameHTMLDocument.prototype.toString = ___.markFuncFreeze(function () {
            return '[Fake Document]';
        });
        // http://www.w3.org/TR/DOM-Level-2-Events/events.html
        // #Events-DocumentEvent-createEvent
        TameHTMLDocument.prototype.createEvent = function (type) {
            type = String(type);
            if (type !== 'HTMLEvents') {
                // See https://developer.mozilla.org/en/DOM/document.createEvent#Notes
                // for a long list of event ypes.
                // See http://www.w3.org/TR/DOM-Level-2-Events/events.html
                // #Events-eventgroupings
                // for the DOM2 list.
                throw new Error('Unrecognized event type ' + type);
            }
            var document = this.doc___;
            var rawEvent;
            if (document.createEvent) {
                rawEvent = document.createEvent(type);
            } else {
                rawEvent = document.createEventObject();
                rawEvent.eventType = 'ondataavailable';
            }
            rawEvent.creatorDoc___ = document;
            var tamedEvent = new TameCustomHTMLEvent(rawEvent);
            return tamedEvent;
        };
        TameHTMLDocument.prototype.getOwnerDocument___ = function () {
            return null;
        };
        // Called by the html-emitter when the virtual document has been loaded.
        TameHTMLDocument.prototype.signalLoaded___ = function () {
            var onload = imports.window && imports.window.v___('onload');
            if (onload) {
                setTimeout(
                    function () {
                        ___.callPub(onload, 'call', [___.USELESS]);
                    },
                    0);
            }
            var listeners = this.onLoadListeners___;
            this.onLoadListeners___ = [];
            for (var i = 0, n = listeners.length; i < n; ++i) {
                (function (listener) {
                    setTimeout(
                        function () {
                            ___.callPub(listener, 'call', [___.USELESS]);
                        },
                        0);
                })(listeners[i]);
            }
        };

        ___.all2(___.grantTypedMethod, TameHTMLDocument.prototype,
            ['addEventListener', 'removeEventListener',
                'createComment', 'createDocumentFragment',
                'createElement', 'createEvent', 'createTextNode',
                'getElementById', 'getElementsByClassName',
                'getElementsByTagName']);


        // For JavaScript handlers.  See plugin_dispatchEvent___ below
        imports.handlers___ = [];
        imports.TameHTMLDocument___ = TameHTMLDocument;  // Exposed for testing
        imports.tameNode___ = defaultTameNode;
        imports.feralNode___ = ___.markFuncFreeze(function(tameNode) {
            tameNode = TameNodeT.coerce(tameNode);
            return tameNode.node___;
        });
        imports.tameEvent___ = tameEvent;
        imports.blessHtml___ = blessHtml;
        imports.blessCss___ = function (var_args) {
            var arr = [];
            for (var i = 0, n = arguments.length; i < n; ++i) {
                arr[i] = arguments[i];
            }
            return cssSealerUnsealerPair.seal(arr);
        };
        imports.htmlAttr___ = function (s) {
            return html.escapeAttrib(String(s || ''));
        };
        imports.html___ = safeHtml;
        imports.rewriteUri___ = function (uri, mimeType) {
            var s = rewriteAttribute(null, null, html4.atype.URI, uri);
            if (!s) {
                throw new Error();
            }
            return s;
        };
        imports.suffix___ = function (nmtokens) {
            var p = String(nmtokens).replace(/^\s+|\s+$/g, '').split(/\s+/g);
            var out = [];
            for (var i = 0; i < p.length; ++i) {
                var nmtoken = rewriteAttribute(null, null, html4.atype.ID, p[i]);
                if (!nmtoken) {
                    throw new Error(nmtokens);
                }
                out.push(nmtoken);
            }
            return out.join(' ');
        };
        imports.ident___ = function (nmtokens) {
            var p = String(nmtokens).replace(/^\s+|\s+$/g, '').split(/\s+/g);
            var out = [];
            for (var i = 0; i < p.length; ++i) {
                var nmtoken = rewriteAttribute(null, null, html4.atype.CLASSES, p[i]);
                if (!nmtoken) {
                    throw new Error(nmtokens);
                }
                out.push(nmtoken);
            }
            return out.join(' ');
        };
        imports.rewriteUriInCss___ = function(value) {
            return value
                ? uriCallback.rewrite(value, html4.ueffects.SAME_DOCUMENT,
                html4.ltypes.SANDBOXED, {})
                : void 0;
        };
        imports.rewriteUriInAttribute___ = function(value, tagName, attribName) {
            return value
                ? uriCallback.rewrite(value, getUriEffect(tagName, attribName),
                getLoaderType(tagName, attribName), {"XML_ATTR": attribName})
                : void 0;
        };

        var allCssProperties = domitaModules.CssPropertiesCollection(
            css.properties, document.documentElement, css);
        var historyInsensitiveCssProperties = domitaModules.CssPropertiesCollection(
            css.HISTORY_INSENSITIVE_STYLE_WHITELIST, document.documentElement, css);

        /**
         * http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration
         */
        function TameStyle(style, editable, tameEl) {
            this.style___ = style;
            this.editable___ = editable;
            this.tameEl___ = tameEl;
        }

        inertCtor(TameStyle, Object, 'Style');
        TameStyle.prototype.readByCanonicalName___ = function(canonName) {
            return String(this.style___[canonName] || '');
        };
        TameStyle.prototype.writeByCanonicalName___ = function(canonName, val) {
            this.style___[canonName] = val;
        };
        TameStyle.prototype.allowProperty___ = function (cssPropertyName) {
            return allCssProperties.isCssProp(cssPropertyName);
        };
        TameStyle.prototype.handleRead___ = function (stylePropertyName) {
            var self = this;
            if (String(stylePropertyName) === 'getPropertyValue') {
                return ___.markFuncFreeze(function(args) {
                    return TameStyle.prototype.getPropertyValue.call(self, args);
                });
            }
            if (!this.style___
                || !allCssProperties.isCanonicalProp(stylePropertyName)) {
                return void 0;
            }
            var cssPropertyName =
                allCssProperties.getCssPropFromCanonical(stylePropertyName);
            if (!this.allowProperty___(cssPropertyName)) {
                return void 0;
            }
            var canonName = allCssProperties.getCanonicalPropFromCss(cssPropertyName);
            return this.readByCanonicalName___(canonName);
        };
        TameStyle.prototype.handleCall___ = function(name, args) {
            if (String(name) === 'getPropertyValue') {
                return TameStyle.prototype.getPropertyValue.call(this, args);
            }
            throw 'Cannot handle method ' + String(name);
        };
        TameStyle.prototype.getPropertyValue = function (cssPropertyName) {
            cssPropertyName = String(cssPropertyName || '').toLowerCase();
            if (!this.allowProperty___(cssPropertyName)) {
                return '';
            }
            var canonName = allCssProperties.getCanonicalPropFromCss(cssPropertyName);
            return this.readByCanonicalName___(canonName);
        };
        TameStyle.prototype.handleSet___ = function (stylePropertyName, value) {
            if (!this.editable___) {
                throw new Error('style not editable');
            }
            stylePropertyName = String(stylePropertyName);
            if (stylePropertyName === 'cssText') {
                if (typeof this.style___.cssText === 'string') {
                    this.style___.cssText = sanitizeStyleAttrValue(value);
                } else {
                    // If the browser doesn't support setting cssText, then fall back to
                    // setting the style attribute of the containing element.  This won't
                    // work for style declarations that are part of stylesheets and not
                    // attached to elements.
                    this.tameEl___.setAttribute('style', value);
                }
                return value;
            }
            if (!allCssProperties.isCanonicalProp(stylePropertyName)) {
                throw new Error('Unknown CSS property name ' + stylePropertyName);
            }
            var cssPropertyName =
                allCssProperties.getCssPropFromCanonical(stylePropertyName);
            if (!this.allowProperty___(cssPropertyName)) {
                return void 0;
            }
            var pattern = css.properties[cssPropertyName];
            if (!pattern) {
                throw new Error('style not editable');
            }
            var val = '' + (value || '');
            // CssPropertyPatterns.java only allows styles of the form
            // url("...").  See the BUILTINS definition for the "uri" symbol.
            val = val.replace(
                /\burl\s*\(\s*\"([^\"]*)\"\s*\)/gi,
                function (_, url) {
                    var decodedUrl = decodeCssString(url);
                    var rewrittenUrl = uriCallback
                        ? uriCallback.rewrite(
                        decodedUrl, html4.ueffects.SAME_DOCUMENT, html4.ltypes.SANDBOXED,
                        { "CSS_PROP": cssPropertyName})
                        : null;
                    if (!rewrittenUrl) {
                        rewrittenUrl = 'about:blank';
                    }
                    return 'url("'
                        + rewrittenUrl.replace(
                        /[\"\'\{\}\(\):\\]/g,
                        function (ch) {
                            return '\\' + ch.charCodeAt(0).toString(16) + ' ';
                        })
                        + '")';
                });
            if (val && !pattern.test(val + ' ')) {
                throw new Error('bad value `' + val + '` for CSS property '
                    + stylePropertyName);
            }
            var canonName = allCssProperties.getCanonicalPropFromCss(cssPropertyName);
            this.writeByCanonicalName___(canonName, val);
            return value;
        };
        TameStyle.prototype.toString =
            ___.markFuncFreeze(function () {
                return '[Fake Style]';
            });

        function isNestedInAnchor(rawElement) {
            for (; rawElement && rawElement != pseudoBodyNode;
                   rawElement = rawElement.parentNode) {
                if (rawElement.tagName.toLowerCase() === 'a') {
                    return true;
                }
            }
            return false;
        }

        function TameComputedStyle(rawElement, pseudoElement) {
            rawElement = rawElement || document.createElement('div');
            TameStyle.call(
                this,
                bridal.getComputedStyle(rawElement, pseudoElement),
                false);
            this.rawElement___ = rawElement;
            this.pseudoElement___ = pseudoElement;
        }

        ___.extend(TameComputedStyle, TameStyle);
        TameComputedStyle.prototype.readByCanonicalName___ = function(canonName) {
            var canReturnDirectValue =
                historyInsensitiveCssProperties.isCanonicalProp(canonName)
                    || !isNestedInAnchor(this.rawElement___);
            if (canReturnDirectValue) {
                return TameStyle.prototype.readByCanonicalName___.call(this, canonName);
            } else {
                return new TameComputedStyle(pseudoBodyNode, this.pseudoElement___)
                    .readByCanonicalName___(canonName);
            }
        };
        TameComputedStyle.prototype.writeByCanonicalName___ = function(canonName) {
            throw 'Computed styles not editable: This code should be unreachable';
        };
        TameComputedStyle.prototype.toString = ___.markFuncFreeze(function () {
            return '[Fake Computed Style]';
        });

        // Note: nodeClasses.XMLHttpRequest is a ctor that *can* be directly
        // called by cajoled code, so we do not use inertCtor().
        nodeClasses.XMLHttpRequest = domitaModules.TameXMLHttpRequest(
            domitaModules.XMLHttpRequestCtor(
                window.XMLHttpRequest,
                window.ActiveXObject),
            uriCallback);

        /**
         * given a number, outputs the equivalent css text.
         * @param {number} num
         * @return {string} an CSS representation of a number suitable for both html
         *    attribs and plain text.
         */
        imports.cssNumber___ = function (num) {
            if ('number' === typeof num && isFinite(num) && !isNaN(num)) {
                return '' + num;
            }
            throw new Error(num);
        };
        /**
         * given a number as 24 bits of RRGGBB, outputs a properly formatted CSS
         * color.
         * @param {number} num
         * @return {string} a CSS representation of num suitable for both html
         *    attribs and plain text.
         */
        imports.cssColor___ = function (color) {
            // TODO: maybe whitelist the color names defined for CSS if the arg is a
            // string.
            if ('number' !== typeof color || (color != (color | 0))) {
                throw new Error(color);
            }
            var hex = '0123456789abcdef';
            return '#' + hex.charAt((color >> 20) & 0xf)
                + hex.charAt((color >> 16) & 0xf)
                + hex.charAt((color >> 12) & 0xf)
                + hex.charAt((color >> 8) & 0xf)
                + hex.charAt((color >> 4) & 0xf)
                + hex.charAt(color & 0xf);
        };
        imports.cssUri___ = function (uri, mimeType) {
            var s = rewriteAttribute(null, null, html4.atype.URI, uri);
            if (!s) {
                throw new Error();
            }
            return s;
        };

        /**
         * Create a CSS stylesheet with the given text and append it to the DOM.
         * @param {string} cssText a well-formed stylesheet production.
         */
        imports.emitCss___ = function (cssText) {
            this.getCssContainer___().appendChild(
                bridal.createStylesheet(document, cssText));
        };
        /** The node to which gadget stylesheets should be added. */
        imports.getCssContainer___ = function () {
            return document.getElementsByTagName('head')[0];
        };

        if (!/^-/.test(idSuffix)) {
            throw new Error('id suffix "' + idSuffix + '" must start with "-"');
        }
        if (!/___$/.test(idSuffix)) {
            throw new Error('id suffix "' + idSuffix + '" must end with "___"');
        }
        var idClass = idSuffix.substring(1);
        var idClassPattern = new RegExp(
            '(?:^|\\s)' + idClass.replace(/[\.$]/g, '\\$&') + '(?:\\s|$)');
        /** A per-gadget class used to separate style rules. */
        imports.getIdClass___ = function () {
            return idClass;
        };
        // enforce id class on element
        bridal.setAttribute(pseudoBodyNode, "class",
            bridal.getAttribute(pseudoBodyNode, "class")
                + " " + idClass + " vdoc-body___");

        // bitmask of trace points
        //    0x0001 plugin_dispatchEvent
        imports.domitaTrace___ = 0;
        imports.getDomitaTrace = ___.markFuncFreeze(
            function () {
                return imports.domitaTrace___;
            }
        );
        imports.setDomitaTrace = ___.markFuncFreeze(
            function (x) {
                imports.domitaTrace___ = x;
            }
        );

        function assignToImports(target, name, value) {
            if (target.DefineOwnProperty___) {
                target.DefineOwnProperty___(name, {
                    value: value,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            } else {
                target[name] = value;
            }
        }


        // TODO(mikesamuel): remove these, and only expose them via window once
        // Valija works
        imports.setTimeout = tameSetTimeout;
        imports.setInterval = tameSetInterval;
        imports.clearTimeout = tameClearTimeout;
        imports.clearInterval = tameClearInterval;

        var tameDocument = new TameHTMLDocument(
            document,
            pseudoBodyNode,
            String(optPseudoWindowLocation.hostname || 'nosuchhost.fake'),
            true);
        assignToImports(imports, 'document', tameDocument);
        imports.document.tameNode___ = imports.tameNode___;
        imports.document.feralNode___ = imports.feralNode___;
        imports.document.tameNode___ = imports.tameNode___;
        imports.document.feralNode___ = imports.feralNode___;

        // TODO(mikesamuel): figure out a mechanism by which the container can
        // specify the gadget's apparent URL.
        // See http://www.whatwg.org/specs/web-apps/current-work/multipage/history.html#location0
        var tameLocation = ___.primFreeze({
            toString: ___.markFuncFreeze(function () {
                return tameLocation.href;
            }),
            href: String(optPseudoWindowLocation.href
                || 'http://nosuchhost.fake:80/'),
            hash: String(optPseudoWindowLocation.hash || ''),
            host: String(optPseudoWindowLocation.host || 'nosuchhost.fake:80'),
            hostname: String(optPseudoWindowLocation.hostname || 'nosuchhost.fake'),
            pathname: String(optPseudoWindowLocation.pathname || '/'),
            port: String(optPseudoWindowLocation.port || '80'),
            protocol: String(optPseudoWindowLocation.protocol || 'http:'),
            search: String(optPseudoWindowLocation.search || '')
        });

        // See spec at http://www.whatwg.org/specs/web-apps/current-work/multipage/browsers.html#navigator
        // We don't attempt to hide or abstract userAgent details since
        // they are discoverable via side-channels we don't control.
        var tameNavigator = ___.primFreeze({
            appName: String(window.navigator.appName),
            appVersion: String(window.navigator.appVersion),
            platform: String(window.navigator.platform),
            // userAgent should equal the string sent in the User-Agent HTTP header.
            userAgent: String(window.navigator.userAgent),
            // Custom attribute indicating Caja is active.
            cajaVersion: '1.0'
        });

        /**
         * Set of allowed pseudo elements as described at
         * http://www.w3.org/TR/CSS2/selector.html#q20
         */
        var PSEUDO_ELEMENT_WHITELIST = {
            // after and before disallowed since they can leak information about
            // arbitrary ancestor nodes.
            'first-letter': true,
            'first-line': true
        };

        /**
         * See http://www.whatwg.org/specs/web-apps/current-work/multipage/browsers.html#window for the full API.
         */
        function TameWindow() {
            this.properties___ = {};
            this.FERAL_TWIN___ = this.TAMED_TWIN___ = this;
        }

        /**
         * An <a href=
         * href=http://www.w3.org/TR/DOM-Level-2-Views/views.html#Views-AbstractView
         * >AbstractView</a> implementation that exposes styling, positioning, and
         * sizing information about the current document's pseudo-body.
         * <p>
         * The AbstractView spec specifies very little in its IDL description, but
         * mozilla defines it thusly:<blockquote>
         *   document.defaultView is generally a reference to the window object
         *   for the document, however that is not defined in the specification
         *   and can't be relied upon for all host environments, particularly as
         *   not all browsers implement it.
         * </blockquote>
         * <p>
         * We can't provide access to the tamed window directly from document
         * since it is the global scope of valija code, and so access to another
         * module's tamed window provides an unbounded amount of authority.
         * <p>
         * Instead, we expose styling, positioning, and sizing properties
         * via this class.  All of this authority is already available from the
         * document.
         */
        function TameDefaultView() {
            // TODO(mikesamuel): Implement in terms of
            //     http://www.w3.org/TR/cssom-view/#the-windowview-interface
            // TODO: expose a read-only version of the document
            this.document = tameDocument;
            // Exposing an editable default view that pointed to a read-only
            // tameDocument via document.defaultView would allow escalation of
            // authority.
            assert(tameDocument.editable___);
            this.FERAL_TWIN___ = this.TAMED_TWIN___ = this;
            ___.grantRead(this, 'document');
        }


        var tameConsole = ___.primFreeze({
            log:___.markFuncFreeze(function() {
                var c;
                if (c = window.console) {
                    c.log.apply(c, arguments);
                }
            })
        });
        assignToImports(imports, 'console', tameConsole);

        ___.forOwnKeys({
            document: tameDocument,
            console:tameConsole,
            location: tameLocation,
            navigator: tameNavigator,
            setTimeout: tameSetTimeout,
            setInterval: tameSetInterval,
            clearTimeout: tameClearTimeout,
            clearInterval: tameClearInterval,
            addEventListener: ___.markFuncFreeze(
                function (name, listener, useCapture) {
                    if (name === 'load') {
                        classUtils.ensureValidCallback(listener);
                        tameDocument.onLoadListeners___.push(listener);
                    } else {
                        // TODO: need a testcase for this
                        tameDocument.addEventListener(name, listener, useCapture);
                    }
                }),
            removeEventListener: ___.markFuncFreeze(
                function (name, listener, useCapture) {
                    if (name === 'load') {
                        var listeners = tameDocument.onLoadListeners___;
                        var k = 0;
                        for (var i = 0, n = listeners.length; i < n; ++i) {
                            listeners[i - k] = listeners[i];
                            if (listeners[i] === listener) {
                                ++k;
                            }
                        }
                        listeners.length -= k;
                    } else {
                        tameDocument.removeEventListener(name, listener, useCapture);
                    }
                }),
            dispatchEvent: ___.markFuncFreeze(function (evt) {
                // TODO(ihab.awad): Implement
            })
        }, ___.markFuncFreeze(function (propertyName, value) {
            TameWindow.prototype[propertyName] = value;
            ___.grantRead(TameWindow.prototype, propertyName);
        }));
        ___.forOwnKeys({
            scrollBy: ___.markFuncFreeze(
                function (dx, dy) {
                    // The window is always auto scrollable, so make the apparent window
                    // body scrollable if the gadget tries to scroll it.
                    if (dx || dy) {
                        makeScrollable(tameDocument.body___);
                    }
                    tameScrollBy(tameDocument.body___, dx, dy);
                }),
            scrollTo: ___.markFuncFreeze(
                function (x, y) {
                    // The window is always auto scrollable, so make the apparent window
                    // body scrollable if the gadget tries to scroll it.
                    makeScrollable(tameDocument.body___);
                    tameScrollTo(tameDocument.body___, x, y);
                }),
            resizeTo: ___.markFuncFreeze(
                function (w, h) {
                    tameResizeTo(tameDocument.body___, w, h);
                }),
            resizeBy: ___.markFuncFreeze(
                function (dw, dh) {
                    tameResizeBy(tameDocument.body___, dw, dh);
                }),
            /** A partial implementation of getComputedStyle. */
            getComputedStyle: ___.markFuncFreeze(
                // Pseudo elements are suffixes like :first-line which constrain to
                // a portion of the element's content as defined at
                // http://www.w3.org/TR/CSS2/selector.html#q20
                function (tameElement, pseudoElement) {
                    tameElement = TameNodeT.coerce(tameElement);
                    // Coerce all nullish values to undefined, since that is the value
                    // for unspecified parameters.
                    // Per bug 973: pseudoElement should be null according to the
                    // spec, but mozilla docs contradict this.
                    // From https://developer.mozilla.org/En/DOM:window.getComputedStyle
                    //     pseudoElt is a string specifying the pseudo-element to match.
                    //     Should be an empty string for regular elements.
                    pseudoElement = (pseudoElement === null || pseudoElement === void 0
                        || '' === pseudoElement)
                        ? void 0 : String(pseudoElement).toLowerCase();
                    if (pseudoElement !== void 0
                        && !PSEUDO_ELEMENT_WHITELIST.hasOwnProperty(pseudoElement)) {
                        throw new Error('Bad pseudo element ' + pseudoElement);
                    }
                    // No need to check editable since computed styles are readonly.
                    return new TameComputedStyle(
                        tameElement.node___,
                        pseudoElement);
                })

            // NOT PROVIDED
            // event: a global on IE.  We always define it in scopes that can handle
            //        events.
            // opera: defined only on Opera.
        }, ___.markFuncFreeze(function (propertyName, value) {
            TameWindow.prototype[propertyName] = value;
            ___.grantRead(TameWindow.prototype, propertyName);
            TameDefaultView.prototype[propertyName] = value;
            ___.grantRead(TameDefaultView.prototype, propertyName);
        }));
        if (!Object.prototype.DefineOwnProperty___) {
            TameWindow.prototype.handleRead___ = function (name) {
                name = String(name);
                if (endsWith__.test(name)) {
                    return void 0;
                }
                var handlerName = name + '_getter___';
                if (this[handlerName]) {
                    return this[handlerName]();
                }
                if (___.hasOwnProp(this, name)) {
                    return this[name];
                } else {
                    return void 0;
                }
            };
            TameWindow.prototype.handleSet___ = function (name, val) {
                name = String(name);
                if (endsWith__.test(name)) {
                    throw new Error(INVALID_SUFFIX);
                }
                var handlerName = name + '_setter___';
                if (this[handlerName]) {
                    return this[handlerName](val);
                }
                this[name + '_c___'] = this;
                this[name + '_v___'] = false;
                this[name + '_e___'] = this;
                return this[name] = val;
            };
            TameWindow.prototype.handleDelete___ = function (name) {
                name = String(name);
                if (endsWith__.test(name)) {
                    throw new Error(INVALID_SUFFIX);
                }
                var handlerName = name + '_deleter___';
                if (this[handlerName]) {
                    return this[handlerName]();
                }
                return delete this[name + '_c___']
                    && delete this[name + '_e___']
                    && delete this[name + '_v___'];
            };
        }

        var tameWindow = new TameWindow();
        var tameDefaultView = new TameDefaultView(tameDocument.editable___);

        function propertyOnlyHasGetter(_) {
            throw new TypeError('setting a property that only has a getter');
        }

        ___.forOwnKeys({
            // We define all the window positional properties relative to
            // the fake body element to maintain the illusion that the fake
            // document is completely defined by the nodes under the fake body.
            clientLeft: {
                get: function () {
                    return tameDocument.body___.clientLeft;
                }
            },
            clientTop: {
                get: function () {
                    return tameDocument.body___.clientTop;
                }
            },
            clientHeight: {
                get: function () {
                    return tameDocument.body___.clientHeight;
                }
            },
            clientWidth: {
                get: function () {
                    return tameDocument.body___.clientWidth;
                }
            },
            offsetLeft: {
                get: function () {
                    return tameDocument.body___.offsetLeft;
                }
            },
            offsetTop: {
                get: function () {
                    return tameDocument.body___.offsetTop;
                }
            },
            offsetHeight: {
                get: function () {
                    return tameDocument.body___.offsetHeight;
                }
            },
            offsetWidth: {
                get: function () {
                    return tameDocument.body___.offsetWidth;
                }
            },
            // page{X,Y}Offset appear only as members of window, not on all elements
            // but http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
            // says that they are identical to the scrollTop/Left on all browsers but
            // old versions of Safari.
            pageXOffset: {
                get: function () {
                    return tameDocument.body___.scrollLeft;
                }
            },
            pageYOffset: {
                get: function () {
                    return tameDocument.body___.scrollTop;
                }
            },
            scrollLeft: {
                get: function () {
                    return tameDocument.body___.scrollLeft;
                },
                set: function (x) {
                    tameDocument.body___.scrollLeft = +x;
                    return x;
                }
            },
            scrollTop: {
                get: function () {
                    return tameDocument.body___.scrollTop;
                },
                set: function (y) {
                    tameDocument.body___.scrollTop = +y;
                    return y;
                }
            },
            scrollHeight: {
                get: function () {
                    return tameDocument.body___.scrollHeight;
                }
            },
            scrollWidth: {
                get: function () {
                    return tameDocument.body___.scrollWidth;
                }
            }
        }, ___.markFuncFreeze(function (propertyName, def) {
            var views = [tameWindow, tameDefaultView, tameDocument.getBody___(),
                tameDocument.getDocumentElement___()];
            var setter = def.set || propertyOnlyHasGetter, getter = def.get;
            for (var i = views.length; --i >= 0;) {
                var view = views[i];
                ___.useGetHandler(view, propertyName, getter);
                ___.useSetHandler(view, propertyName, setter);
            }
        }));

        ___.forOwnKeys({
            innerHeight: function () {
                return tameDocument.body___.clientHeight;
            },
            innerWidth: function () {
                return tameDocument.body___.clientWidth;
            },
            outerHeight: function () {
                return tameDocument.body___.clientHeight;
            },
            outerWidth: function () {
                return tameDocument.body___.clientWidth;
            }
        }, ___.markFuncFreeze(function (propertyName, handler) {
            // TODO(mikesamuel): define on prototype.
            ___.useGetHandler(tameWindow, propertyName, handler);
            ___.useGetHandler(tameDefaultView, propertyName, handler);
        }));

        // Attach reflexive properties to 'window' object
        var windowProps = ['top', 'self', 'opener', 'parent', 'window'];
        var wpLen = windowProps.length;
        for (var i = 0; i < wpLen; ++i) {
            var prop = windowProps[i];
            if (Object.prototype.DefineOwnProperty___) {
                tameWindow.DefineOwnProperty___(prop, {
                    value: tameWindow,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            } else {
                tameWindow[prop] = tameWindow;
                ___.grantRead(tameWindow, prop);
            }
        }

        if (tameDocument.editable___) {
            tameDocument.defaultView = tameDefaultView;
            ___.grantRead(tameDocument, 'defaultView');
            // Hook for document.write support.
            tameDocument.sanitizeAttrs___ = sanitizeAttrs;
        }

        // Iterate over all node classes, assigning them to the Window object
        // under their DOM Level 2 standard name.
        ___.forOwnKeys(nodeClasses, ___.markFuncFreeze(function(name, ctor) {
            ___.primFreeze(ctor);
            if (Object.prototype.DefineOwnProperty___) {
                tameWindow.DefineOwnProperty___(name, {
                    value: ctor,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            } else {
                tameWindow[name] = ctor;
                ___.grantRead(tameWindow, name);
            }
        }));

        // TODO(ihab.awad): Build a more sophisticated virtual class hierarchy by
        // creating a table of actual subclasses and instantiating tame nodes by
        // table lookups. This will allow the client code to see a truly consistent
        // DOM class hierarchy.
        var defaultNodeClasses = [
            'HTMLAppletElement',
            'HTMLAreaElement',
            'HTMLBaseElement',
            'HTMLBaseFontElement',
            'HTMLBodyElement',
            'HTMLBRElement',
            'HTMLButtonElement',
            'HTMLDirectoryElement',
            'HTMLDivElement',
            'HTMLDListElement',
            'HTMLFieldSetElement',
            'HTMLFontElement',
            'HTMLFrameElement',
            'HTMLFrameSetElement',
            'HTMLHeadElement',
            'HTMLHeadingElement',
            'HTMLHRElement',
            'HTMLHtmlElement',
            'HTMLIFrameElement',
            'HTMLIsIndexElement',
            'HTMLLabelElement',
            'HTMLLegendElement',
            'HTMLLIElement',
            'HTMLLinkElement',
            'HTMLMapElement',
            'HTMLMenuElement',
            'HTMLMetaElement',
            'HTMLModElement',
            'HTMLObjectElement',
            'HTMLOListElement',
            'HTMLOptGroupElement',
            'HTMLOptionElement',
            'HTMLParagraphElement',
            'HTMLParamElement',
            'HTMLPreElement',
            'HTMLQuoteElement',
            'HTMLScriptElement',
            'HTMLSelectElement',
            'HTMLStyleElement',
            'HTMLTableCaptionElement',
            'HTMLTableCellElement',
            'HTMLTableColElement',
            'HTMLTableElement',
            'HTMLTableRowElement',
            'HTMLTableSectionElement',
            'HTMLTextAreaElement',
            'HTMLTitleElement',
            'HTMLUListElement'
        ];

        var defaultNodeClassCtor = nodeClasses.Element;
        for (var i = 0; i < defaultNodeClasses.length; i++) {
            if (Object.prototype.DefineOwnProperty___) {
                tameWindow.DefineOwnProperty___(defaultNodeClasses[i], {
                    value: defaultNodeClassCtor,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            } else {
                tameWindow[defaultNodeClasses[i]] = defaultNodeClassCtor;
                ___.grantRead(tameWindow, defaultNodeClasses[i]);
            }
        }

        var outers = imports.outers;
        if (___.isJSONContainer(outers)) {
            // For Valija, use the window object as outers.
            ___.forOwnKeys(outers, ___.markFuncFreeze(function(k, v) {
                if (!(k in tameWindow)) {
                    // No need to check for DefineOwnProperty___; this case
                    // occurs iff we are in Valija, not ES53.
                    tameWindow[k] = v;
                    ___.grantRead(tameWindow, k);
                }
            }));
            imports.outers = tameWindow;
        } else {
            assignToImports(imports, 'window', tameWindow);
        }
    }

    return attachDocumentStub;
})();

/**
 * Function called from rewritten event handlers to dispatch an event safely.
 */
function plugin_dispatchEvent___(thisNode, event, pluginId, handler) {
    event = (event || bridal.getWindow(thisNode).event);
    // support currentTarget on IE[678]
    if (!event.currentTarget) {
        event.currentTarget = thisNode;
    }
    var imports = ___.getImports(pluginId);
    var node = imports.tameNode___(thisNode, true);
    return plugin_dispatchToHandler___(
        pluginId, handler, [ node, imports.tameEvent___(event), node ]);
}

function plugin_dispatchToHandler___(pluginId, handler, args) {
    var sig = ('' + handler).match(/^function\b[^\)]*\)/);
    var imports = ___.getImports(pluginId);
    if (imports.domitaTrace___ & 0x1) {
        ___.log(
            'Dispatch pluginId=' + pluginId +
                ', handler=' + (sig ? sig[0] : handler) +
                ', args=' + args);
    }
    switch (typeof handler) {
        case 'number':
            handler = imports.handlers___[handler];
            break;
        case 'string':
            var fn = void 0;
            var tameWin = void 0;
            var $v = ___.readPub(imports, '$v');
            if ($v) {
                fn = ___.callPub($v, 'ros', [handler]);
                if (!fn) {
                    tameWin = ___.callPub($v, 'ros', ['window']);
                }
            }
            if (!fn) {
                fn = ___.readPub(imports, handler);
                if (!fn) {
                    if (!tameWin) {
                        tameWin = ___.readPub(imports, 'window');
                    }
                    if (tameWin) {
                        fn = ___.readPub(tameWin, handler);
                    }
                }
            }
            handler = fn && typeof fn.call === 'function' ? fn : void 0;
            break;
        case 'function':
        case 'object':
            break;
        default:
            throw new Error(
                'Expected function as event handler, not ' + typeof handler);
    }
    if (___.startCallerStack) {
        ___.startCallerStack();
    }
    imports.isProcessingEvent___ = true;
    try {
        return ___.callPub(handler, 'call', args);
    } catch (ex) {
        if (ex && ex.cajitaStack___ && 'undefined' !== (typeof console)) {
            console.error(
                'Event dispatch %s: %s', handler, ex.cajitaStack___.join('\n'));
        }
        throw ex;
    } finally {
        imports.isProcessingEvent___ = false;
    }
}
;
// Copyright (C) 2010 Google Inc.
//      
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * Sets up a frame to act as the "taming" frame, used to tame objects from the
 * host frame to make them available to guest code.
 *
 * @author ihab.awad@gmail.com
 * @requires ___
 */

___.def([
    Array,
    Boolean,
    Date,
    Error,
    EvalError,
    Function,
    Number,
    Object,
    RangeError,
    ReferenceError,
    RegExp,
    String,
    SyntaxError,
    TypeError,
    URIError
]);;
// Copyright (C) 2010 Google Inc.
//      
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * This file exists to be concatenated into the single file that caja.js (the
 * iframed-Caja-runtime loader) loads as the very last thing to give an on-load
 * callback.
 *
 * @author kpreid@switchb.org
 * @requires cajaIframeDone___
 */

cajaIframeDone___();
