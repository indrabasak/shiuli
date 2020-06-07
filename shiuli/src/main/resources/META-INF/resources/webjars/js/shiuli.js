(function (shiuli, $) {
    'use strict';

    /**
     * Initializes shiuli with the URL to fetch metrics
     * @function
     * @name shiuli#init
     *
     * @param {string} navBrand navigation brand anchor to add title
     * @param {string} navULId menu navigation to ppulate with menu items
     * @param {string} leftDivId left panel div Id for populating links
     * @param {string} viewDivId
     */
    shiuli.init = function (navBrand, navUlId, leftDivId, viewDivId) {
        _loadJSON(function (response) {
            // parse JSON string into object
            _jsonObj = JSON.parse(response);
            console.log(_jsonObj);

            _populateTitle(_jsonObj, navBrand);
            _populateMessage(_jsonObj);
            _populateMenu(_jsonObj, navUlId);
            _populateLinks(_jsonObj, leftDivId);
            _viewDivId = viewDivId;
        });

    };

    shiuli.showMessage = function() {
        _clearView();
       _displayView(_message);
    }

    shiuli.displayResponse = function(endpoint, type) {
        _clearView();
        _processRequest(endpoint, type);
    }

    shiuli.showHtml = function (url) {
        $(_viewDivId).empty();
        $(_viewDivId).html('<object data="' + url + '">');
        $(_viewDivId).attr('style', 'width:100%;height:100%');

        let children = $(_viewDivId).children();
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if(typeof child  === 'object') {
                $(child).attr('style', 'width:100%;height:100%');
            }
        }
    }

    function _loadJSON(callback) {
        let xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', CONFIG_FILE, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState === 4 && xobj.status === 200) {
                // Required use of an anonymous callback
                // as .open() will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }

    function _loadFile(mime, fileName, callback) {
        let xobj = new XMLHttpRequest();
        xobj.overrideMimeType(mime);
        xobj.open('GET', fileName, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState === 4 && xobj.status === 200) {
                // Required use of an anonymous callback
                // as .open() will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }

    function _populateTitle(jsonObj, navBrand) {
        let title = jsonObj["title"];
        $(navBrand).text('');
        let $img = $('<img src=' + DEFAULT_LOGO + '/>');
        $(navBrand).append($img);
        $(navBrand).append(title);
    }

    function _populateMessage(jsonObj) {
        let message = _jsonObj["message"];
        if (message) {
            let path = message["path"];
            if (path) {
                _loadFile("text/plain", path, function (response) {
                    let msg = response;
                    console.log(msg);
                    if (msg) {
                        let converter = new showdown.Converter();
                        _message = converter.makeHtml(msg);
                        console.log(_message);
                    }
                });
            } else {
                let text = message["txt"];
                if (text) {
                    _message = text;
                }
            }
        }
    }

    function _populateMenu(jsonObj, navUlId) {
        let items = jsonObj["menu"];

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let $li = $('<li/>');
            $li.addClass('nav-item');
            $(navUlId).append($li);

            let $a = $('<a/>');
            $li.append($a);
            $a.text(item["name"])

            let embed = item["embed"];
            if (embed && 'TRUE' === embed.toUpperCase()) {
                $a.attr('href', '#');
                $a.attr('onclick', 'shiuli.showHtml(\'' + item["href"] + '\')');
            } else {
                $a.attr('href', item["href"]);
            }
        }
    }

    function _populateLinks(jsonObj, leftDivId) {
        _addLink(leftDivId, 1, 'Home', 'shiuli.showMessage()', null, null);

        let links = jsonObj["links"];
        for (let i = 0; i < links.length; i++) {
            let link = links[i];
            _addLink(leftDivId, i + 2, link["name"], null, link["endpoint"], link["type"]);
        }
    }

    function _addLink(leftDivId, id, name, methodName, endpoint, type) {
        let $li = $('<li/>');
        $(leftDivId).append($li);

        let $span = $('<span/>')
        $span.addClass('fa-li');
        $span.addClass('shiuli');
        $li.append($span);

        let $i = $('<i/>');
        $i.addClass('fa fa-square icon-gray');
        $i.attr('aria-hidden', 'true');
        $span.append($i);

        let $a = $('<a/>');
        $li.append($a);
        $a.text(' ' + name);
        $a.attr('id', id);
        $a.attr('href', '#');
        $a.addClass('shiuli');

        if (methodName) {
            $a.attr('onclick', methodName);
        } else {
            $a.attr('onclick', 'shiuli.displayResponse(\'' + endpoint + '\', \'' + type + '\')');
        }
    }

    function _processRequest(url, type) {
        $.ajax({
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-Requested-With', 'BasicAuthClient');
            },
            success: function (data) {
                if (type && 'JSON' === type.toUpperCase()) {
                    _displayView(_formatJson(data));
                } else {
                    _displayView(data);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                _displayView("FAILURE: " + xhr.status + "\nERROR: " + thrownError, "in_log");
            },
            async: false
        });
    }

    /**
     * Formats a JSON object to formatted string
     * @param {JSON} json
     * @returns {string} formatted JSON string
     * @private
     */
    function _formatJson(json) {
        return _syntaxHighlight(JSON.stringify(json, null, 2));
    }

    /**
     * From https://stackoverflow.com/questions/4810841/pretty-print-json-using-javascript
     * @param {string} json
     * @returns {string} syntax higlighted JSON string
     * @private
     */
    function _syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    function _clearView() {
        $(_viewDivId).empty();
    }

    function _displayView(message, style) {
        if (style) {
            $(_viewDivId).append('<span class="' + style + '">' + message + '</span><br>');
        } else {
            $(_viewDivId).append('<span class="default_log">' + message + '</span><br>');
        }

    }

    const CONFIG_FILE = 'shiuli.json';

    const DEFAULT_LOGO = 'webjars/images/shiuli-logo-2.png';

    const DEFAULT_MESSAGE = '<h1>This is the landing page of Shiuli.</h1>';

    /**
     * JSON configuration object
     */
    let _jsonObj;

    let _viewDivId;

    let _message = DEFAULT_MESSAGE;


}(window.shiuli = window.shiuli || {}, jQuery, showdown));