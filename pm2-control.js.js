const pm2 = require('pm2');

pm2.connect(function(err) {
  if (err) {
    console.error("Connection failed:", err);
    process.exit(2);
  }

  console.log("✅ Connected to PM2\n");

  // STEP 1 — List all processes
  pm2.list(function(err, list) {
    if (err) {
      console.error("List failed:", err);
      pm2.disconnect();
      return;
    }

    console.log("📋 BEFORE RESTART:");
    list.forEach(p => {
      console.log(`  → ${p.name} | status: ${p.pm2_env.status} | restarts: ${p.pm2_env.restart_time}`);
    });

    // STEP 2 — Restart alpha
    pm2.restart("alpha", function(err) {
      if (err) {
        console.error("Restart failed:", err);
      } else {
        console.log("\n🔄 Restarted alpha!");
      }

      // STEP 3 — Wait 1 second then list again
      setTimeout(function() {

        pm2.list(function(err, updatedList) {
          if (err) {
            console.error("Second list failed:", err);
            pm2.disconnect();
            return;
          }

          console.log("\n📋 AFTER RESTART:");
          updatedList.forEach(p => {
            console.log(`  → ${p.name} | status: ${p.pm2_env.status} | restarts: ${p.pm2_env.restart_time}`);
          });

          // STEP 4 — Describe alpha (full details)
          pm2.describe("alpha", function(err, desc) {
            if (err) {
              console.error("Describe failed:", err);
              pm2.disconnect();
              return;
            }

            console.log("\n🔍 FULL DETAILS of alpha:");
            console.log("  Name    :", desc[0].name);
            console.log("  Status  :", desc[0].pm2_env.status);
            console.log("  Restarts:", desc[0].pm2_env.restart_time);
            console.log("  Script  :", desc[0].pm2_env.pm_exec_path);
            console.log("  Log file:", desc[0].pm2_env.pm_out_log_path);
            console.log("  Uptime  :", desc[0].pm2_env.pm_uptime);

            // STEP 5 — Always disconnect at the end
            pm2.disconnect();
            console.log("\n🔌 Disconnected!");
          });
        });

      }, 1000); // 1 second wait
    });
  });
});