const pm2 = require('pm2');

pm2.connect(function(err) {
  if (err) {
    console.error("Connection failed:", err);
    process.exit(2);
  }

  console.log("✅ Connected to PM2\n");

  pm2.launchBus(function(err, bus) {
    if (err) {
      console.error("Bus failed:", err);
      pm2.disconnect();
      return;
    }

    console.log("👀 Streaming live logs... Press Ctrl+C to stop\n");

    // Listen for normal logs
    bus.on('log:out', function(packet) {
      const time = new Date(packet.at).toLocaleTimeString();
      console.log(`[${time}] [${packet.process.name}] [OUT]: ${packet.data}`);
    });

    // Listen for error logs
    bus.on('log:err', function(packet) {
      const time = new Date(packet.at).toLocaleTimeString();
      console.error(`[${time}] [${packet.process.name}] [ERR]: ${packet.data}`);
    });

    // If PM2 daemon restarts
    bus.on('close', function() {
      console.log('Bus closed — PM2 restarted');
      pm2.disconnect();
      process.exit(1);
    });

  });
});