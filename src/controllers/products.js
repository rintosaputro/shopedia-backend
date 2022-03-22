exports.getAllProducts = async (req, res) => {
  try {
    return res.send({
      success: true,
      message: 'List all products'
    })
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: 'Unexpected error'
    })
  }
}
