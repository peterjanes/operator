function geo(node) {
  if (node) {
    ufJSParser.newMicroformat(this, node, "geo");
  }
}

ufJSParser.microformats.geo = {
  version: "0.7",
  mfObject: geo,
  className: "geo",
  required: ["latitude","longitude"],
  definition: {
    properties: {
      "latitude" : {
        datatype: "float",
        virtual: true,
        /* This will only be called in the virtual case */
        virtualGetter: function(mfnode) {
          var value = ufJSParser.defaultGetter(mfnode);
          var latlong;
          if (value.match(';')) {
            latlong = value.split(';');
            if (latlong[0]) {
              return parseFloat(latlong[0]);
            }
          }
        },
      },
      "longitude" : {
        datatype: "float",
        virtual: true,
        /* This will only be called in the virtual case */
        virtualGetter: function(mfnode) {
          var value = ufJSParser.defaultGetter(mfnode);
          var latlong;
          if (value.match(';')) {
            latlong = value.split(';');
            if (latlong[1]) {
              return parseFloat(latlong[1]);
            }
          }
        }
      }
    },
    ufjs: {
      "ufjsDisplayName" : {
        virtual: true,
        virtualGetter: function(propnode, mfnode) {
          if (ufJSParser.getMicroformatProperty(mfnode, "geo", "latitude") &&
            ufJSParser.getMicroformatProperty(mfnode, "geo", "longitude")) {
  
            var s;
            if (propnode.innerText) {
              s = mfnode.innerText;
            } else {
              s = mfnode.textContent;
            }

            s = ufJSParser.trim(s);

            /* FIXME - THIS IS FIREFOX SPECIFIC */
            /* check if geo is contained in a vcard */
            var xpathExpression = "ancestor::*[contains(concat(' ', @class, ' '), ' vcard ')]";
            var xpathResult = mfnode.ownerDocument.evaluate(xpathExpression, mfnode, null,  XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (xpathResult.singleNodeValue) {
              var hcard = ufJSParser.createMicroformat(xpathResult.singleNodeValue, "hCard");
              if (hcard.fn) {
                return hcard.fn;
              }
            }
            /* check if geo is contained in a vevent */
            xpathExpression = "ancestor::*[contains(concat(' ', @class, ' '), ' vevent ')]";
            xpathResult = mfnode.ownerDocument.evaluate(xpathExpression, mfnode, null,  XPathResult.FIRST_ORDERED_NODE_TYPE, xpathResult);
            if (xpathResult.singleNodeValue) {
              var hcal = ufJSParser.createMicroformat(xpathResult.singleNodeValue, "hCalendar");
              if (hcal.summary) {
                return hcal.summary;
              }
            }
            return s;
          }
        }
      }
    }
  },
  validate: function(node, error) {
    error.message = "";
    if (!ufJSParser.getMicroformatProperty(node, "geo", "latitude")) {
      error.message += "No latitude specified\n";
    }
    if (!ufJSParser.getMicroformatProperty(node, "geo", "longitude")) {
      error.message += "No longitude specified\n";
    }
    if (error.message.length > 0) {
      return false;
    }
    return true;
  }
};
