
const asyncHandler = require("express-async-handler");

const accessControls = asyncHandler(async (req, res) => {
    try {
      res.status(200)
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
});

module.exports = { accessControls };
