
var ops = require('./operations');

// insert example
ops.insert({
  table: "Open_vSwitch",
  row: {
    bridges: ops.set(
      'br0', 'br1', 'br2'
    )
  }
});

ops.select({
  table: "bridge",
  where: [
    includes("protocols", ops.set("OpenFlow14", "OpenFlow15"))
  ],
  columns: [
    "name",
    "ports",
    "controllers"
  ]
});


