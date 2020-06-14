const os = require("os");
const lu = require("loader-utils");
const ifaces = os.networkInterfaces();

const loader = function(source, other) {
  const options = lu.getOptions(this) || {};
  const callback = this.async();

  if (process.env.NODE_ENV === "production") {
    source = source.replace(/\[web\]/g, options.web.host);
    source = source.replace(/\[list\]/g, options.list.host);
  } else {
    let localIP = "";

    Object.keys(ifaces).forEach(function(ifname) {
      var alias = 0;

      ifaces[ifname].forEach(function(iface) {
        if ("IPv4" !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }

        localIP = iface.address;

        ++alias;
      });
    });

    source = source.replace(/\[web\]/g, localIP + ":" + options.web.port);
    source = source.replace(/\[list\]/g, localIP + ":" + options.list.port);
  }
  callback(null, source, other);
};

module.exports = loader;
